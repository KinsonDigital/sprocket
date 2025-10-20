/**
 * Utility functions for various common operations.
 * @module
 */

import { toText } from "@std/streams";
import { isNothing, isStringNothing } from "./guards.ts";

/**
 * Regular expression pattern for validating production version strings.
 * Matches versions in the format: v{major}.{minor}.{patch} (e.g., v1.2.3)
 */
const prodVersionRegex = /^v[0-9]+\.[0-9]+\.[0-9]+$/;

/**
 * Regular expression pattern for validating preview version strings.
 * Matches versions in the format: v{major}.{minor}.{patch}-preview.{number} (e.g., v1.2.3-preview.4)
 */
const prevVersionRegex = /^v[0-9]+\.[0-9]+\.[0-9]+-preview\.[0-9]+$/;

/**
 * Splits the given {@link value} by the given {@link separator}.
 * @param value The value to split.
 * @param separator The separator to split the value by.
 * @returns The values split by the given separator.
 * @remarks Only the first character will be used by the given {@link separator}.
 */
export function splitBy(value: string, separator: string): string[] {
	if (isStringNothing(value)) {
		return [];
	}

	if (isStringNothing(separator)) {
		return [value];
	}

	// Only use the first character for a separator
	separator = separator.length === 1 ? separator : separator[0];

	return value.indexOf(separator) === -1 ? [value] : value.split(separator)
		.map((v) => v.trim())
		.filter((i) => !isNothing(i));
}

/**
 * Splits the given {@link value} by comma.
 * @param value The value to split by comma.
 * @returns The values split by comma.
 */
export function splitByComma(value: string): string[] {
	if (isNothing(value)) {
		return [];
	}

	return splitBy(value, ",");
}

/**
 * Returns a number that is clamped between the given {@link min} and {@link max} values.
 * @param value The value to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns A value that is clamped between the given {@link min} and {@link max} values.
 */
export function clamp(value: number, min: number, max: number): number {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	} else {
		return value;
	}
}

/**
 * Checks if the given {@link version} is a valid production version.
 * @param version The version to check.
 * @returns True if the version is a valid production version, otherwise false.
 */
export function validProdVersion(version: string): boolean {
	return prodVersionRegex.test(version.trim().toLowerCase());
}

/**
 * Checks if the given {@link version} is not valid production version.
 * @param version The version to check.
 * @returns True if the version is not a valid production version, otherwise false.
 */
export function isNotValidProdVersion(version: string): boolean {
	return !validProdVersion(version);
}

/**
 * Checks if the given {@link version} is a valid preview version.
 * @param version The version to check.
 * @returns True if the version is a valid preview version, otherwise false.
 */
export function validPreviewVersion(version: string): boolean {
	return prevVersionRegex.test(version.trim().toLowerCase());
}

/**
 * Checks if the given {@link version} is not a valid preview version.
 * @param version The version to check.
 * @returns True if the version is not a valid preview version, otherwise false.
 */
export function isNotValidPreviewVersion(version: string): boolean {
	return !validPreviewVersion(version);
}

/**
 * Checks if the given {@link version} is not a valid preview or production version.
 * @param version The version to check.
 * @returns True if the version is not a valid preview or production version, otherwise false.
 */
export function isNotValidPreviewOrProdVersion(version: string): boolean {
	return isNotValidPreviewVersion(version) && isNotValidProdVersion(version);
}

/**
 * Trims the given {@link valueToRemove} from the start of the given {@link valueToTrim}
 * until the {@link valueToRemove} does not exit anymore.
 * @param valueToTrim The value to trim the starting value from.
 * @param valueToRemove The starting value to trim.
 * @returns The given {@link valueToTrim} with the starting value trimmed.
 */
export function trimAllStartingValue(valueToTrim: string, valueToRemove: string): string {
	if (isNothing(valueToTrim)) {
		return valueToTrim;
	}

	if (isNothing(valueToRemove)) {
		return valueToTrim;
	}

	while (valueToTrim.startsWith(valueToRemove)) {
		valueToTrim = valueToTrim.slice(1);
	}

	return valueToTrim;
}

/**
 * Trims the given {@link valueToRemove} from the end of the given {@link valueToTrim}
 * until the {@link valueToRemove} does not exit anymore.
 * @param valueToTrim The value to trim the ending value from.
 * @param valueToRemove The ending value to trim.
 * @returns The given {@link valueToTrim} with the ending value trimmed.
 */
export function trimAllEndingValue(valueToTrim: string, valueToRemove: string): string {
	if (isNothing(valueToTrim)) {
		return valueToTrim;
	}

	if (isNothing(valueToRemove)) {
		return valueToTrim;
	}

	while (valueToTrim.endsWith(valueToRemove)) {
		valueToTrim = valueToTrim.slice(0, valueToTrim.length - 1);
	}

	return valueToTrim;
}

/**
 * Normalizes the given {@link path} by replacing all back slashes with forward slashes,
 * and trimming any and ending slashes.
 * @param path The path to normalize.
 * @returns The normalized path.
 */
export function normalizePath(path: string): string {
	path = path.replaceAll("\\", "/");
	path = path.replaceAll("//", "/");
	path = trimAllEndingValue(path, "/");

	return path;
}

/**
 * Executes a command using the given {@link app} name and {@link args}.
 * @param app The name of the application to run.
 * @param args The arguments to send to the application.
 * @returns A promise that resolves to a string or error.
 */
export async function runCommandAsync(app: string, args: string[]): Promise<string | Error> {
	if (app === undefined || app === null || app === "") {
		const errorMsg = "The command parameter cannot be null or empty.";
		console.log(errorMsg);
		Deno.exit(1);
	}

	const cmd = new Deno.Command(app, { args: args, stdout: "piped", stderr: "piped" });

	const child = cmd.spawn();

	const successMsg = await toText(child.stdout);
	const errorMsg = await toText(child.stderr);
	const status = await child.status;

	if (status.success) {
		return successMsg;
	} else {
		return new Error(errorMsg);
	}
}
