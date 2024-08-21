'use strict';

const { Exception } = require("sass");

// DOM Elements
const counter = document.querySelector('.main__container--timer');
const playbtn = document.querySelector('.main__container__controls--play');
const stopbtn = document.querySelector('.main__container__controls--stop');
const nextbtn = document.querySelector('.main__container__controls--next');
const backbtn = document.querySelector('.main__container__controls--back');
const playIcon = document.querySelector('.main__container__controls--play use');
const roundCounter = document.querySelector('.main__container--round');
const title = document.querySelector('.main__title');

// Constants
const DEFAULT_FOCUS_TIME = 3600 * 1000; // 1 hour
const DEFAULT_REST_TIME = 900 * 1000; // 15 minutes
const DEFAULT_MAX_ROUNDS = 4;

let max_rounds = DEFAULT_MAX_ROUNDS;
let time = DEFAULT_FOCUS_TIME;
let minutes = time / 1000 / 60;
let seconds = (time / 1000) % 60;
let running = false;
let interval;
let round = 1;
let rest = false;

// Functions

function attach(ele, event, func) {
  ele.addEventListener(event, func);
}

function resttheme() {
  title.textContent = 'Rest';
  title.style.color = 'var(--color-rest)';
  title.style.textDecorationColor = 'var(--color-rest)';
}

function focustime() {
  title.textContent = 'Focus';
  title.style.color = 'var(--color-focus)';
  title.style.textDecorationColor = 'var(--color-focus)';
}

function resettheme() {
  playIcon.style.fill = 'var(--color-primary-darker)';
}

function setround(round) {
  roundCounter.textContent = `Round ${round} of ${max_rounds}`;
}

function toggle_play_icon() {
  playIcon.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    running ? 'img/sprites.svg#icon-pause' : 'img/sprites.svg#icon-play2'
  );
  running ? playtimer() : stoptimer();
}

function toggle_running() {
  running = !running;
  toggle_play_icon();
}

function updatetime(time) {
  seconds = (time / 1000) % 60;
  minutes = time / 1000 / 60;
  counter.textContent = `${Math.floor(minutes)}:${Math.floor(seconds)
    .toString()
    .padStart(2, '0')}`;
}

function decreaseTime() {
  if (time <= 0) {
    return;
  }
  time -= 1000;
  updatetime(time);
}

function reset() {
  time = rest ? DEFAULT_REST_TIME : DEFAULT_FOCUS_TIME;
  updatetime(time);
  stoptimer();
}

// Timer Controls

function playtimer() {
  if (!interval) interval = window.setInterval(decreaseTime, 1000);
  playIcon.style.fill = rest ? 'var(--color-rest)' : 'var(--color-focus)';
}

function stoptimer() {
  if (!interval) return;
  window.clearInterval(interval);
  running = false;
  interval = undefined;
  resettheme();
}

// Playback Controls

function next() {
  if (round >= DEFAULT_MAX_ROUNDS && rest) {
    round = 1;
  } else if (rest) {
    round++;
  }
  setround(round);
  rest = !rest;
  reset();
  toggle_play_icon();
  rest ? resttheme() : focustime();
}

function back() {
  if (round > 1 || rest) {
    rest = !rest;
    reset();
    toggle_play_icon();
    rest ? resttheme() : focustime();
  }
  if (round > 1 && !rest) {
    round--;
  }
  setround(round);
}

// Event Listeners

attach(playbtn, 'click', toggle_running);
attach(stopbtn, 'click', reset);
attach(nextbtn, 'click', next);
attach(backbtn, 'click', back);
