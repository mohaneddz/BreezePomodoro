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
let imageUrl = localStorage.getItem('backgroundImage' || df.DEFAULT_BACKGROUND);

// Variables

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

function play_sound(sound) {
	const audio = new Audio(`ost/${sound}.wav`);
	if (sound === 'tick') audio.volume = 0.05;
	else audio.volume = 0.3;
	audio.play();
}

function decreaseTime() {
	if (time <= 0) {
		next();
		toggle_running();
		return;
	}
	time -= 1000;
	updatetime(time);
	play_sound('tick');
}

function reset() {
	time = rest ? localStorage.getItem('rest') : localStorage.getItem('focus');
	updatetime(time);
	stoptimer();
}

function full_reset() {
	round = 1;
	setround(round);
	rest = false;
	reset();
	focus_theme();
}

function save() {
	localStorage.setItem('curr_time', time);
	localStorage.setItem('round', round);
	localStorage.setItem('state', rest);
}

// Timer Controls ////////////////////////////////////

function playtimer() {
	if (!interval) interval = window.setInterval(decreaseTime, 1000);
	playIcon.style.fill = rest ? 'var(--color-rest)' : 'var(--color-focus)';
}

function stoptimer() {
	if (!interval) {
		return;
	}
	window.clearInterval(interval);
	running = false;
	interval = undefined;
	resettheme();
}

// Playback Controls ////////////////////////////////////

function next() {
	if (round >= max_rounds && rest) {
		round = 1;
	} else if (rest) {
		round++;
	}
	setround(round);
	rest = !rest;

	reset();
	toggle_play_icon();
	rest ? rest_theme() : focus_theme();
	if (round < max_rounds || !rest) play_sound(rest ? 'high' : 'deep');
	else play_sound('mid-high');
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
counter.addEventListener('click', full_reset);
playbtn.addEventListener('click', toggle_running);
stopbtn.addEventListener('click', reset);
nextbtn.addEventListener('click', next);
backbtn.addEventListener('click', back);
settings.addEventListener('click', save);

function init_main() {
	// Set initial values from local storage, otherwise use defaults
	max_rounds = localStorage.getItem('intervals') || df.DEFAULT_MAX_ROUNDS;
	time = localStorage.getItem('curr_time') || df.DEFAULT_FOCUS_TIME;
	round = localStorage.getItem('round') || 1;

	// Retrieve and convert the state from localStorage
	rest = localStorage.getItem('state') === 'true'; // Convert string to boolean

	if (round > max_rounds) round = 1;

	// Update time and round display
	if (time >= 3600 * 1000) {
		hours = time / 1000 / 60 / 60;
		minutes = (time / 1000 / 60) % 60;
	} else {
		minutes = time / 1000 / 60;
	}
	seconds = (time / 1000) % 60;

	// Updating the view
	updatetime(time);
	setround(round);

	// Apply theme and background
	df.setTheme(localStorage.getItem('theme') || df.DEFAULT_THEME);
	df.setbackground(imageUrl || df.DEFAULT_BACKGROUND);

	// Apply correct theme based on the rest state
	if (rest) {
		rest_theme();
	} else {
		focus_theme();
	}
	df.setblur(localStorage.getItem('blur') || df.DEFAULT_BLUR);
}

init_main();
