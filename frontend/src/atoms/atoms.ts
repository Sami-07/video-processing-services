import { atom } from "jotai";
import { User } from "@/lib/types/user-type";


export const userAtom = atom<User| null>(null);
export const searchAtom = atom<string>("");
export const hasSearchedAtom = atom<boolean>(false);