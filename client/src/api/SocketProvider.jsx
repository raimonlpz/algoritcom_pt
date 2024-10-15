import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { playersAtom, mapAtom, userAtom, eventsPlayerAtom, drunkieAtom } from '../atoms'
import { useAtom } from 'jotai'

export const socket = io('https://algoritcom-pt.vercel.app:3001')

export const SocketProvider = () => {

    const [_players, setPlayers] = useAtom(playersAtom)  
    const [_drunkie, setDrunkie] = useAtom(drunkieAtom) 
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
                players,
                drunkie
            } = value
            setMap(map)
            setUser(id)
            setDrunkie(drunkie)
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

        function onCanRobbed(value) {
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

        function onDrunkieMove(value) {
            setDrunkie(value)
        }

        socket.on('connect', onConnect)
        socket.on('initPlayer', onInitPlayer)
        socket.on('players', onPlayers)
        socket.on('jump', onJump)
        socket.on('dance', onDance)
        socket.on('run', onRun)
        socket.on('canCollected', onCanCollected)
        socket.on('canRobbed', onCanRobbed)
        socket.on('drunkieMove', onDrunkieMove)
        socket.on('disconnect', onDisconnect)

        return () => {
            socket.off('connect', onConnect)
            socket.off('initPlayer', onInitPlayer)
            socket.off('players', onPlayers)
            socket.off('disconnect', onDisconnect)
            socket.off('jump', onJump)
            socket.off('dance', onDance)
            socket.off('canCollected', onCanCollected)
            socket.off('canRobbed', onCanRobbed)
            socket.off('drunkieMove', onDrunkieMove)
            socket.off('run', onRun)
        }
    }, [])
}