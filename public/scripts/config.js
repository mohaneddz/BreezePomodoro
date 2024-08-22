// Constants
export const DEFAULT_FOCUS_TIME = 3600 * 1000; // 1 hour
export const DEFAULT_REST_TIME = 900 * 1000; // 15 minutes
export const DEFAULT_MAX_ROUNDS = 6;
export const DEFAULT_BLUR = 10;
export const DEFAULT_THEME = 'Lagoon';

export const setTheme = function (theme) {
	const root = document.documentElement;

	// Primary colors
	root.style.setProperty('--color-primary', `var(--${theme}-color-primary)`);
	root.style.setProperty('--color-primary-rgb', `var(--${theme}-color-primary-rgb)`);
	root.style.setProperty('--color-primary-dark', `var(--${theme}-color-primary-dark)`);
	root.style.setProperty('--color-primary-dark-rgb', `var(--${theme}-color-primary-dark-rgb)`);
	root.style.setProperty('--color-primary-darker', `var(--${theme}-color-primary-darker)`);
	root.style.setProperty('--color-primary-darker-rgb', `var(--${theme}-color-primary-darker-rgb)`);
	root.style.setProperty('--color-primary-light', `var(--${theme}-color-primary-light)`);
	root.style.setProperty('--color-primary-light-rgb', `var(--${theme}-color-primary-light-rgb)`);

	// Secondary colors
	root.style.setProperty('--color-secondary', `var(--${theme}-color-secondary)`);
	root.style.setProperty('--color-secondary-rgb', `var(--${theme}-color-secondary-rgb)`);
	root.style.setProperty('--color-secondary-light', `var(--${theme}-color-secondary-light)`);
	root.style.setProperty('--color-secondary-light-rgb', `var(--${theme}-color-secondary-light-rgb)`);
	root.style.setProperty('--color-secondary-lighter', `var(--${theme}-color-secondary-lighter)`);
	root.style.setProperty('--color-secondary-lighter-rgb', `var(--${theme}-color-secondary-lighter-rgb)`);

	// Tertiary colors
	root.style.setProperty('--color-tertiary-lighter', `var(--${theme}-color-tertiary-lighter)`);
	root.style.setProperty('--color-tertiary-lighter-rgb', `var(--${theme}-color-tertiary-lighter-rgb)`);

	// Rest colors
	root.style.setProperty('--color-rest', `var(--${theme}-color-rest)`);
	root.style.setProperty('--color-rest-rgb', `var(--${theme}-color-rest-rgb)`);

	// Focus colors
	root.style.setProperty('--color-focus', `var(--${theme}-color-focus)`);
	root.style.setProperty('--color-focus-rgb', `var(--${theme}-color-focus-rgb)`);
};

export const show_err = function (msg) {
	console.log(msg);
};
