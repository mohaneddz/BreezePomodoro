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
/**
 * Toggle the play icon between play and pause.
 * @returns {void}
 */
function toggle_play_icon() {
	playIcon.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		running ? 'img/sprites.svg#icon-pause' : 'img/sprites.svg#icon-play2'
	);
	running ? playtimer() : stoptimer();
}

/**
 * Toggle the running state of the timer.
 * @returns {void}
 */
function toggle_running() {
	running = !running;
	toggle_play_icon();
}

/**
 * Update the time displayed on the timer.
 * @param {number} time - The time in milliseconds.
 * @returns {void}
 */
function updatetime(time) {
	if (time > 3600) {
		hours = time / 60 / 60;
		minutes = (time / 60) % 60;
		seconds = time % 60;
		counter.style.setProperty('font-size', '9rem');
		counter.textContent = `${Math.floor(hours).toString().padStart(2, '0')}:${Math.floor(minutes)
			.toString()
			.padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`;
	} else {
		minutes = time / 60;
		seconds = time % 60;
		counter.style.setProperty('font-size', '12rem');
		counter.textContent = `${Math.floor(minutes).toString().padStart(2, '0')}:${Math.floor(seconds)
			.toString()
			.padStart(2, '0')}`;
	}
}

/**
 * Play a sound effect.
 * @param {string} sound - The name of the sound file.
 * @returns {void}
 * */
function play_sound(sound) {
	const audio = new Audio(`sounds/${sound}.wav`);
	if (sound === 'tick') audio.volume = 0.05;
	else audio.volume = 0.3;
	audio.play();
}

/**
 * 	Decrease the time by 1 second.
 * 	If the time is less than or equal to 0, move to the next round.
 * @returns {void}
 */
function decreaseTime() {
	if (time <= 0) {
		next();
		playtimer();
		rest ? rest_theme() : focus_theme();
		return;
	}
	time -= 1;
	updatetime(time);
	play_sound('tick');
}

/**
 * Reset the timer to the current focus or rest time.
 * @returns {void}
 * */
function reset() {
	time = rest ? localStorage.getItem('rest') : localStorage.getItem('focus');
	if (!time) 
		time = rest ? df.DEFAULT_REST_TIME : df.DEFAULT_FOCUS_TIME;
	updatetime(time);
	stoptimer();
}

/**
 * Reset the timer to the initial state.
 * @returns {void}
 * */
function full_reset() {
	round = 1;
	setround(round);
	rest = false;
	reset();
	focus_theme();
}

/**
 * Save the current state to local storage.
 * @returns {void}
 * */
function save() {
	localStorage.setItem('curr_time', time);
	localStorage.setItem('round', round);
	localStorage.setItem('state', rest);
}

// Timer Controls ////////////////////////////////////
/**
 * Start the timer.
 * @returns {void}
 */
function playtimer() {
	if (!interval) interval = window.setInterval(decreaseTime, 1000);
	playIcon.style.fill = rest ? 'var(--color-rest)' : 'var(--color-focus)';
}

/**
 *	Stop the timer.
 * @returns {void}
 */
function stoptimer() {
	if (!interval) return;
	window.clearInterval(interval);
	running = false;
	interval = undefined;
	resettheme();
	playIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'img/sprites.svg#icon-play2');
}

// Playback Controls ////////////////////////////////////
/**
 * Move to the next round.
 * If the current round is the last round, play a different sound.
 * @returns {void}
 */
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
	toggle_running();
	rest ? rest_theme() : focus_theme();
	if (round < max_rounds || !rest) play_sound(rest ? 'high' : 'deep');
	else play_sound('mid-high');
}

/**
 * Move to the previous round.
 * @returns {void}
 * */
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
/**
 * Apply the rest theme.
 * @returns {void}
 */
function rest_theme() {
	title.textContent = 'Rest';
	title.style.color = 'var(--color-rest)';
	title.style.textDecorationColor = 'var(--color-rest)';
}

/**
 * Apply the focus theme.
 * @returns {void}
 * */
function focus_theme() {
	title.textContent = 'Focus';
	title.style.color = 'var(--color-focus)';
	title.style.textDecorationColor = 'var(--color-focus)';
}

/**
 * Reset the theme to the default focus theme.
 * @returns {void}
 * 	*/
function resettheme() {
	playIcon.style.fill = 'var(--color-primary-darker)';
}

/**
 *	Set the round counter.
 * @param {number} round - The current round.
 */
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

// Initialisation ////////////////////////////////////
/**
 * Initialise the main timer.
 * @returns {void}
 * */
function init_main() {
	// Set initial values from local storage, otherwise use defaults
	max_rounds = localStorage.getItem('intervals') || df.DEFAULT_MAX_ROUNDS;
	time = localStorage.getItem('curr_time') || df.DEFAULT_FOCUS_TIME;
	round = localStorage.getItem('round') || 1;

	// Retrieve and convert the state from localStorage
	rest = localStorage.getItem('state') === 'true'; // Convert string to boolean

	if (round > max_rounds) round = 1;

	// Update time and round display
	if (time >= 3600) {
		hours = time / 60 / 60;
		minutes = (time / 60) % 60;
	} else {
		minutes = time / 60;
	}
	seconds = time % 60;

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
