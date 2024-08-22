'use strict';

import * as df from './config.js';

// DOM Elements
const counter = document.querySelector('.main__container--timer');
const playbtn = document.querySelector('.main__container__controls--play');
const stopbtn = document.querySelector('.main__container__controls--stop');
const nextbtn = document.querySelector('.main__container__controls--next');
const backbtn = document.querySelector('.main__container__controls--back');
const playIcon = document.querySelector('.main__container__controls--play use');
const roundCounter = document.querySelector('.main__container--round');
const title = document.querySelector('.main__title');
const settings = document.querySelector('.settings--icon');

let max_rounds;
let time;
let minutes;
let seconds;
let hours;
let running;
let interval;
let round;
let rest;

// Basic Functions ////////////////////////////////////
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

	if (time > 3600 * 1000) {
		hours = time / 1000 / 60 / 60;
		minutes = (time / 1000 / 60) % 60;
		seconds = (time / 1000) % 60;
		counter.style.setProperty('font-size', '9rem');
		counter.textContent = `${Math.floor(hours).toString().padStart(2, '0')}:${Math.floor(minutes)
			.toString()
			.padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`;
		} else {
			minutes = time / 1000 / 60;
			seconds = (time / 1000) % 60;
			counter.style.setProperty('font-size', '12rem');
		counter.textContent = `${Math.floor(minutes).toString().padStart(2, '0')}:${Math.floor(seconds)
			.toString()
			.padStart(2, '0')}`;
	}
}

function decreaseTime() {
	if (time <= 0) {
		return;
	}
	time -= 1000;
	updatetime(time);
}

function reset() {
	time = rest ? localStorage.getItem('rest') : localStorage.getItem('focus');
	updatetime(time);
	stoptimer();
}

function save() {
	localStorage.setItem('focus', time);
	localStorage.setItem('round', round);
}

// Timer Controls ////////////////////////////////////

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

// Playback Controls ////////////////////////////////////

function next() {
	if (round >= df.DEFAULT_MAX_ROUNDS && rest) {
		round = 1;
	} else if (rest) {
		round++;
	}
	setround(round);
	rest = !rest;
	reset();
	toggle_play_icon();
	rest ? rest_theme() : focus_theme();
}

function back() {
	if (round > 1 || rest) {
		rest = !rest;
		reset();
		toggle_play_icon();
		rest ? rest_theme() : focus_theme();
	}
	if (round > 1 && !rest) {
		round--;
	}
	setround(round);
}

// Theme Functions ////////////////////////////////////

function rest_theme() {
	title.textContent = 'Rest';
	title.style.color = 'var(--color-rest)';
	title.style.textDecorationColor = 'var(--color-rest)';
}

function focus_theme() {
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

// Event Listeners
playbtn.addEventListener('click', toggle_running);
stopbtn.addEventListener('click', reset);
nextbtn.addEventListener('click', next);
backbtn.addEventListener('click', back);
settings.addEventListener('click', save);

(function init() {
	// // Set initial values from local storage, otherwise use defaults :)
	max_rounds = localStorage.getItem('intervals') || df.DEFAULT_MAX_ROUNDS;
	time = localStorage.getItem('focus') || df.DEFAULT_FOCUS_TIME;
	round = localStorage.getItem('round') || 1;
	// // Convert time to minutes and seconds
	// if time is more than 1 hour
	if (time >= 3600 * 1000) {
		hours = time / 1000 / 60 / 60;
		minutes = (time / 1000 / 60) % 60;
		updatetime(time);
	} else {
		minutes = time / 1000 / 60;
	}
	seconds = (time / 1000) % 60;
	// // Updating the view
	updatetime(time);
	setround(round);
	df.setTheme(localStorage.getItem('theme') || df.DEFAULT_THEME);
})();
