'use strict';

const counter = document.querySelector('.main__container--timer');
const playbtn = document.querySelector('.main__container__controls--play');
const stopbtn = document.querySelector('.main__container__controls--stop');
const nextbtn = document.querySelector('.main__container__controls--next');
const backbtn = document.querySelector('.main__container__controls--back');
const playIcon = document.querySelector('.main__container__controls--play use');
const title = document.querySelector('.main__title');

const DEFAULT_FOCUS_TIME = 3600 * 1000;
const DEFAULT_REST_TIME = 900 * 1000;
const DEFAULT_MAX_ROUNDS = 4;

let time = DEFAULT_FOCUS_TIME;
let minutes = time / 1000 / 60;
let seconds = (time / 1000) % 60;
let running = false;
let interval;
let round = 1;
let rest = false;

playbtn.addEventListener('click', toggle_running);
stopbtn.addEventListener('click', reset);
nextbtn.addEventListener('click', next);
backbtn.addEventListener('click', back);

// Basics

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
  if (rest) time = DEFAULT_REST_TIME;
  else time = DEFAULT_FOCUS_TIME;

  updatetime(time);
  stoptimer();
}

// Buttons

function playtimer() {
  if (!interval) interval = window.setInterval(decreaseTime, 1000);
}
function stoptimer() {
  if (!interval) return;
  window.clearInterval(interval);
  running = false;
  interval = undefined;
}

// Playback controls

function next() {
  round++;
  if (round > DEFAULT_MAX_ROUNDS) {
    round = 1;
  }
  rest = !rest;
  reset();
  toggle_play_icon();
}
function back() {
  if (round > 1 || rest) {
    rest = !rest;
    reset();
    toggle_play_icon();
  }
  if (round > 1) {
    round--;
  }
}

function resttheme() {
  title.textContent = 'Rest';
  title.style.color = 'var(--color-rest)';
//   text decoration underline and overline colors change to rest
  title.style.textDecorationColor = 'var(--color-rest)';
  
  playIcon.style.fill = 'var(--color-rest)';
}
function focustime() {
    title.textContent = 'Focus';
    title.style.color = 'var(--color-focus)';
    playIcon.style.fill = 'var(--color-focus)';
    title.style.textDecorationColor = 'var(--color-focus)';
}

// focustime()
// OPTIONS
