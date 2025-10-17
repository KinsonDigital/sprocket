/**
 * Holds functions related to logging messages to the console.
 * @module
 */

/**
 * Logs the given {@link msg} to the console in red text.
 * @param msg The message to log.
 */
export function printRed(msg: string): void {
	console.log(`%c${msg}`, "color: red;");
}

/**
 * Logs the given {@link msg} to the console in indian red text.
 * @param msg The message to log.
 */
export function printIndianRed(msg: string): void {
	console.log(`%c${msg}`, "color: indianred;");
}

/**
 * Logs the given {@link msg} to the console in green text.
 * @param msg The message to log.
 */
export function printGreen(msg: string): void {
	console.log(`%c${msg}`, "color: green;");
}

/**
 * Logs the given {@link msg} to the console in medium sea green text.
 * @param msg The message to log.
 */
export function printMediumSeaGreen(msg: string): void {
	console.log(`%c${msg}`, "color: mediumseagreen;");
}

/**
 * Logs the given {@link msg} to the console in blue text.
 * @param msg The message to log.
 */
export function printBlue(msg: string): void {
	console.log(`%c${msg}`, "color: blue;");
}

/**
 * Logs the given {@link msg} to the console in yellow text.
 * @param msg The message to log.
 */
export function printYellow(msg: string): void {
	console.log(`%c${msg}`, "color: yellow;");
}

/**
 * Logs the given {@link msg} to the console in cyan text.
 * @param msg The message to log.
 */
export function printCyan(msg: string): void {
	console.log(`%c${msg}`, "color: cyan;");
}

/**
 * Logs the given {@link msg} to the console in gray text.
 * @param msg The message to log.
 */
export function printGray(msg: string): void {
	console.log(`%c${msg}`, "color: gray;");
}
