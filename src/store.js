import { writable } from "svelte/store";

const storedState = JSON.parse(localStorage.getItem("state"));
export const state = writable(storedState || {});
state.subscribe(val => {
    localStorage.setItem("state", JSON.stringify(val))
})