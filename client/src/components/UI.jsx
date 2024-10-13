import { useEffect } from "react";
import { camAtom, playersAtom } from "../atoms";
import { useAtom } from "jotai";

export default function UI() {

  const [players] = useAtom(playersAtom)
  const [cam, setCam] = useAtom(camAtom)

  const onToggle = (e) => {
    if (e.target.checked) {
      setCam("Zoom")
    } else {
      setCam("Default")
    }
  }


  return (
    <>
        <div className="absolute bottom-5 right-5">
            <kbd className="flex flex-col justify-center items-center mb-2 px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                <span className="italic">Run:</span>
                <span>Touch</span>
            </kbd>
            <kbd className="flex flex-col justify-center items-center mb-2 px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                <span className="italic">Dance:</span>
                <span>Press D</span>
            </kbd>
            <kbd className="flex flex-col justify-center items-center px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                <span className="italic">Jump:</span>
                <span>Spacebar</span>
            </kbd>
        </div>
        <kbd className="absolute bottom-5 left-5">
            <span className="text-white font-semibold text-xs">&#x1f37a; Collect as many Beers as you can!</span>
        </kbd>

        <div className="absolute top-5 right-5 text-right">
            {
                players.map((player) => (
                    <div key={player.id}>
                        <kbd className="text-pink-500 font-semibold text-xs">{player.name} ~ </kbd>
                        <kbd className="text-white font-semibold text-xs">  {player.cansCount} Beers</kbd>
                    </div>
                ))
            }
        </div>

        <div className="absolute top-5 left-5">
            <label className="inline-flex items-center me-5 cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" onChange={onToggle} />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                <kbd className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Zoom Cam</kbd>
            </label>
        </div>
    </>
  );
}