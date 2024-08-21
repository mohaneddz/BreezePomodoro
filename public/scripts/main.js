'use strict';

const counter = document.querySelector('.main__container--timer');
const playbtn = document.querySelector('.main__container__controls--play');
const stopbtn = document.querySelector('.main__container__controls--stop');
const nextbtn = document.querySelector('.main__container__controls--next');
const backbtn = document.querySelector('.main__container__controls--back');
const playIcon = document.querySelector('.main__container__controls--play use');

const DEFAULT_TIME = 3600 * 1000;

let time = DEFAULT_TIME;
let minutes = time / 1000 / 60;
let seconds = (time / 1000) % 60;
let running = false;
let interval;

playbtn.addEventListener('click', toggle_running);
stopbtn.addEventListener('click', reset);
nextbtn.addEventListener('click', next);
backbtn.addEventListener('click', back);

// Basics

function toggle_running() {
  running = !running;
  playIcon.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    running ? 'img/sprites.svg#icon-pause' : 'img/sprites.svg#icon-play2'
  );
  running ? playtimer() : stoptimer();
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
  time = DEFAULT_TIME;
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

function next() {}
function back() {}
