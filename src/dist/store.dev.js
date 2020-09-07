"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = void 0;

var _store = require("svelte/store");

var storedState = JSON.parse(localStorage.getItem("state"));
var state = (0, _store.writable)(storedState || {});
exports.state = state;
state.subscribe(function (val) {
  localStorage.setItem("state", JSON.stringify(val));
});