'use strict';

import * as df from './config.js';

// select by id
const intervals = document.getElementById('intervals');
const focus = document.getElementById('focus');
const rest = document.getElementById('rest');
const blur = document.getElementById('blur');
const themeRadioButtons = document.querySelectorAll('input[name="theme"]');
const errorMessage = document.getElementById('error-message');
const apply = document.getElementById('apply');
const reset = document.getElementById('reset');
const fields = [focus, rest];

let theme = localStorage.getItem('theme') || df.DEFAULT_THEME;
df.setTheme(localStorage.getItem('theme') || df.DEFAULT_THEME);

// apply values from local storage
function apply_local() {

	let _focus = localStorage.getItem('focus') || df.DEFAULT_FOCUS_TIME;
	let _rest = localStorage.getItem('rest')  || df.DEFAULT_REST_TIME;
	console.log(_focus, _rest);

	intervals.value = localStorage.getItem('intervals') || df.DEFAULT_MAX_ROUNDS;
	blur.value = localStorage.getItem('blur') || df.DEFAULT_BLUR;
	
	focus.value = get_time_setting(_focus);
	rest.value = get_time_setting(_rest);

	// applying the theme now :
	if (theme === 'Lagoon') themeRadioButtons[0].checked = true;
	else if (theme === 'Owl') themeRadioButtons[1].checked = true;
	else if (theme === 'Monkai') themeRadioButtons[2].checked = true;
}

function get_time_setting(time) {
	let seconds = Math.floor((time / 1000) % 60);
	if (time > 3600 * 1000) {
		let hours = Math.floor((time / 3600) * 1000);
		let minutes = Math.floor(time / (60 * 1000) - hours * 60);
		console.log(hours, minutes, seconds);

		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}}`;
	} else {
		let minutes = Math.floor(time / (60 * 1000));
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
};

reset.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.setItem('intervals', df.DEFAULT_MAX_ROUNDS);
	localStorage.setItem('focus', df.DEFAULT_FOCUS_TIME);
	localStorage.setItem('rest', df.DEFAULT_REST_TIME);
	localStorage.setItem('blur', df.DEFAULT_BLUR);
	localStorage.setItem('theme', df.DEFAULT_THEME);
	apply_local();
});

apply.addEventListener('click', (e) => {
	// store values in local storage
	e.preventDefault();
	if (errorMessage.style.display === 'inline') {
		return;
	}

	intervals && localStorage.setItem('intervals', intervals.value);
	focus && localStorage.setItem('focus', parse_duration(focus.value));
	rest && localStorage.setItem('rest', parse_duration(rest.value));
	blur && localStorage.setItem('blur', blur.value);
	theme = document.querySelector('input[name="theme"]:checked').value;
	localStorage.setItem('theme', theme);
	console.log(theme);

	df.setTheme(theme);
});

// Setting the error message
fields.forEach((field) => {
	field.addEventListener('submit', function (event) {
		const duration = focus.value;
		try {
			parse_duration(duration); // Re-validate on form submission
		} catch (err) {
			event.preventDefault(); // Prevent form submission if invalid
		}
	});

	field.addEventListener('input', function () {
		const duration = this.value;

		try {
			parse_duration(duration); // Try to parse the duration
			this.setCustomValidity(''); // Clear any previous invalid state
			errorMessage.style.display = 'none'; // Hide error message
		} catch (err) {
			this.setCustomValidity('Invalid time format'); // Set the field as invalid
			errorMessage.style.display = 'inline'; // Show error message
		}
	});
});

function parse_duration(duration) {
	const timeFormat = /^(\d+)(?::([0-5]?\d))?(?::([0-5]?\d))?$/;

	if (duration === undefined || !timeFormat.test(duration)) throw new Error('Invalid time format');

	let hour = 0,
		min = 0,
		sec = 0;
	const parts = duration.split(':').map(Number);

	if (parts.length === 1) {
		min = parts[0]; // Only minutes are provided
	} else if (parts.length === 2) {
		[min, sec] = parts; // Minutes and seconds
	} else if (parts.length === 3) {
		[hour, min, sec] = parts; // Hours, minutes, and seconds
	}

	return (hour * 3600 + min * 60 + sec) * 1000;
}

// Initialize
apply_local();
// df.setTheme(df.theme);
