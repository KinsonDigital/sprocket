import z from "@zod";
import type { DenoConfig, Task, TaskDefinition } from "./deno.ts";

/**
 * Checks whether the given value is a valid {@link DenoConfig} object.
 * @param denoConfig The value to validate.
 * @returns `true` if the value conforms to the {@link DenoConfig} schema; otherwise, `false`.
 */
export function isDenoConfig(denoConfig: unknown): denoConfig is DenoConfig {
	const isValidResult = isDenoConfigValid(denoConfig);

	return isValidResult[0];
}

/**
 * Validates whether the given value conforms to the {@link DenoConfig} schema.
 * @param denoConfig The value to validate.
 * @returns A tuple where the first element is `true` if valid or `false` if invalid,
 * and the second element is an empty string on success or a detailed error message on failure.
 */
export function isDenoConfigValid(denoConfig: unknown): [boolean, string] {
	const schema = z.object({
		tasks: z.record(
			z.string(),
			z.union([
				z.string(),
				z.object({
					description: z.string(),
					command: z.string(),
					dependencies: z.array(z.string()).optional(),
				}),
			]),
		).optional(),
	});

	const validationResult = schema.safeParse(denoConfig);

	if (validationResult.success) {
		return [true, ""];
	} else {
		const issues = validationResult.error.issues;
		const errMsg = issues.map((e) => {
			const path = e.path.length > 0 ? e.path.join(" -> ") : "(root)";
			return `  - [${path}]: ${e.message} (code: ${e.code})`;
		}).join("\n");

		return [false, `Validation failed with ${issues.length} error(s):\n${errMsg}`];
	}
}

/**
 * Checks whether the given value is a standard {@link Task}, which is a plain string.
 * @param task The value to check.
 * @returns `true` if the value is a string; otherwise, `false`.
 */
export function isStandardTask(task: unknown): task is Task {
	return task !== undefined && typeof task === "string";
}

/**
 * Checks whether the given value is a valid {@link TaskDefinition} object
 * containing at least `description` and `command` string properties.
 * @param taskDef The value to validate.
 * @returns `true` if the value conforms to the {@link TaskDefinition} schema; otherwise, `false`.
 */
export function isTaskDefinition(taskDef: unknown): taskDef is TaskDefinition {
	const schema = z.object({
		description: z.string(),
		command: z.string(),
	});

	return schema.safeParse(taskDef).success;
}
