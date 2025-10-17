/**
 * Provides various guard functions for type checking and validation.
 * @module
 */

/**
 * Returns a value indicating if the given {@link value} is undefined.
 * @param value The value to check.
 * @returns True if the value is undefined, otherwise false.
 */
export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

/**
 * Returns a value indicating if the given {@link value} is null.
 * @param value The value to check.
 * @returns True if the value is null, otherwise false.
 */
export function isNull(value: unknown): value is null {
	return value === null;
}

/**
 * Returns a value indicating if the given {@link value} is an empty string or array.
 * @param value The value to check.
 * @returns True if the value is an empty string or array, otherwise false.
 */
export function isEmpty<T>(value: string | T[]): value is "" | [] {
	if (isString(value)) {
		return value === "";
	}

	return value.length === 0;
}

/**
 * Returns a value indicating if the given {@link value} is a function.
 * @param func The value to check.
 * @returns True if the value is a function, otherwise false.
 */
export function isFunction(func: unknown): func is (...args: unknown[]) => unknown {
	return typeof func === "function";
}

/**
 * Returns a value indicating if the given {@link value} is undefined or null.
 * @param value The value to check.
 * @returns True if the value is undefined or null, otherwise false.
 */
export function isUndefinedOrNull(value: unknown): value is undefined | null {
	return isUndefined(value) || isNull(value);
}

/**
 * Returns a value indicating if the given {@link value} is undefined, null, or an empty string or array.
 * @param value The value to check.
 * @returns True if the value is undefined, null, or an empty string or array, otherwise false.
 */
export function isUndefinedOrNullOrEmpty(value: unknown | string | []): value is undefined | null | "" {
	if (typeof value === "string") {
		return isEmpty(value);
	} else if (Array.isArray(value)) {
		return value.length === 0;
	}

	return isUndefinedOrNull(value);
}

/**
 * Returns true if the given {@link value} is nothing.
 * @param value The value to check.
 * @returns True if the value is nothing.
 * @remarks Nothing is defined as undefined, null, an empty string, an NaN number, or an empty array.
 */
export function isNothing<T>(
	value: undefined | null | unknown | string | number | T[]
): value is undefined | null {
	if (value === undefined || value === null) {
		return true;
	}

	if (typeof value === "string") {
		return value === "";
	}

	if (typeof value === "number") {
		return isNaN(value);
	}

	if (Array.isArray(value)) {
		return value.length <= 0;
	}

	return false;
}

/**
 * Returns true if the given {@link value} is an empty string.
 * @param value The value to check.
 * @returns True if the value is an empty string.
 */
export function isStringNothing(value: unknown): value is "" {
	return isString(value) && value === "";
}

/**
 * Returns true if the given {@link value} is a string.
 * @param value The value to check.
 * @returns True if the value is a string.
 */
export function isString(value: unknown): value is string {
	return typeof value === "string";
}

/**
 * Returns true if the given {@link value} is a number.
 * @param value The value to check.
 * @returns True if the value is a number.
 */
export function isNumber(value: unknown): value is number {
	return typeof value === "number" && !isNaN(value);
}

/**
 * Returns true if the given {@link value} is a boolean.
 * @param value The value to check.
 * @returns True if the value is a boolean.
 */
export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

/**
 * Checks if the given {@link value} is a number and is less than one.
 * @param value The value to check.
 * @param paramName The name of the parameter that is being checked.
 */
export function isLessThanOne(value: undefined | null | number): value is number {
	const isNullOrUndefined = value === undefined || value === null;
	if (isNullOrUndefined || isNaN(value) || !isFinite(value)) {
		return false;
	}

	if (value < 1) {
		return false;
	}

	return true;
}

/**
 * Returns a value indicating if the given {@link value} is an error.
 * @param value The value to check.
 * @returns True if the value is an error.
 */
export function isError(value: unknown): value is Error {
	return value instanceof Error;
}

/**
 * Returns a value indicating whether or not the given {@link value} starts with a new line character.
 * @param value The value to check.
 * @returns True if the value starts with a new line character of '\n'.
 */
export function startsWithNL(value: string): value is string {
	if (isString(value)) {
		return value.startsWith("\n");
	}

	return false;
}

/**
 * Returns a value indicating whether or not the given {@link value} starts with a carriage return character.
 * @param value The value to check.
 * @returns True if the value starts with a carriage return character of '\r'.
 */
export function startsWithCR(value: string): value is string {
	if (isString(value)) {
		return value.startsWith("\r");
	}

	return false;
}

/**
 * Returns a value indicating whether or not the given {@link value} starts with a new line
 * character or a carriage return character.
 * @param value The value to check.
 * @returns True if the value starts with a new line character of '\n' or a carriage return character of '\r'.
 */
export function startsWithNLOrCR(value: string): value is string {
	if (isString(value)) {
		return startsWithNL(value) || startsWithCR(value);
	}

	return false;
}

/**
 * Returns a value indicating whether or not the given {@link value} ends with a new line character.
 * @param value The value to check.
 * @returns True if the value ends with a new line character of '\n'.
 */
export function endsWithNL(value: string): value is string {
	if (isString(value)) {
		return value.endsWith("\n");
	}

	return false;
}

/**
 * Returns a value indicating whether or not the given {@link value} ends with a carriage return character.
 * @param value The value to check.
 * @returns True if the value ends with a carriage return character of '\r'.
 */
export function endsWithCR(value: string): value is string {
	if (isString(value)) {
		return value.endsWith("\r");
	}

	return false;
}

/**
 * Returns a value indicating whether or not the given {@link value} ends with a new line
 * character or a carriage return character.
 * @param value The value to check.
 * @returns True if the value ends with a new line character of '\n' or a carriage return character of '\r'.
 */
export function endsWithNLOrCR(value: string): value is string {
	if (isString(value)) {
		return endsWithNL(value) || endsWithCR(value);
	}

	return false;
}
