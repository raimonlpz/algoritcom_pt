import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { playersAtom, mapAtom, userAtom, eventsPlayerAtom } from '../atoms'
import { useAtom } from 'jotai'

export const socket = io('http://localhost:3001')

export const SocketProvider = () => {

    const [_players, setPlayers] = useAtom(playersAtom)   
    const [_user, setUser] = useAtom(userAtom)
    const [_map, setMap] = useAtom(mapAtom) 
    const [eventsPlayer, setEventsPlayer] = useAtom(eventsPlayerAtom)

    useEffect(() => {
        function onConnect() {
            console.log('connected');
        }

        function onDisconnect() {
            console.log('disconnected');
        }

        function onInitPlayer(value) {
            const {
                map,
                id, 
                players
            } = value
            setMap(map)
            setUser(id)
            setPlayers(players)
        } 

        function onPlayers(value) {
            setPlayers(value)
        }

        function onJump(value) {
            setEventsPlayer({
                ...eventsPlayer,
                jump: value
            })
        }
        function onDance(value) {
            setEventsPlayer({
                ...eventsPlayer,
                dance: value
            })
        }

        function onRun(value) {
            setPlayers((prev) => {
                return prev.map((player) => {
                    if (player.id === value.id) {
                        return value
                    }
                    return player
                })
            })
        }

        function onCanCollected(value) {
            setPlayers((prev) => {
                return prev.map((player) => {
                    if (player.id === value.id) {
                        return {
                            ...player,
                            cansCount: value.cansCount
                        }
                    }
                    return player
                })
            })
        }

        socket.on('connect', onConnect)
        socket.on('initPlayer', onInitPlayer)
        socket.on('players', onPlayers)
        socket.on('jump', onJump)
        socket.on('dance', onDance)
        socket.on('run', onRun)
        socket.on('canCollected', onCanCollected)
        socket.on('disconnect', onDisconnect)

        return () => {
            socket.off('connect', onConnect)
            socket.off('initPlayer', onInitPlayer)
            socket.off('players', onPlayers)
            socket.off('disconnect', onDisconnect)
            socket.off('jump', onJump)
            socket.off('dance', onDance)
            socket.off('canCollected', onCanCollected)
            socket.off('run', onRun)
        }
    }, [])
}