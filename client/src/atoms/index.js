import { atom } from "jotai";

export const playersAtom = atom([]);
export const mapAtom = atom(null);
export const userAtom = atom(null);
export const camAtom = atom("Default");
export const gridAtom = atom(false);
export const eventsPlayerAtom = atom({
  dance: null,
  jump: null,
});
export const drunkieAtom = atom(null);
