import { existsSync } from "@std/fs";
import { resolve } from "@std/path";
import { Command } from "@cliffy/command";
import { Select } from "@cliffy/prompt";
import { runJob } from "./core/runners.ts";
import { isSprocketConfig } from "./core/configuration.ts";
import denoConfig from "../deno.json" with { type: "json" };
import { isBoolean, isNothing } from "./core/guards.ts";

/**
 * The arguments and options for the CLI.
 */
type ArgsOptions = {
	/**
	 * The file path to the configuration file.
	 */
	filePath?: true | undefined;

	/**
	 * The name of the job to run.
	 */
	jobName?: string | true | undefined;
};

/**
 * The main entry point for the Sprocket CLI application.
 */
const command = new Command()
	.name("sprocket")
	.description("Tool to create prs and prepare for releases.")
	.version(`v${denoConfig.version}`)
	.command("run-job")
	.arguments("<filePath:string>")
	.option("-j, --job-name [string]", "The name of the job to run from the config file.")
	.action(async (_options: ArgsOptions, filePath: string) => {
		filePath = resolve(Deno.cwd(), filePath);

		if (existsSync(filePath)) {
			try {
				const fileUrl = new URL(`file://${filePath}`);
				const module = (await import(fileUrl.href)) as { config: unknown };
				const config = module.config;

				if (!isSprocketConfig(config)) {
					console.error("The configuration file is not a valid Sprocket configuration.");
					Deno.exit(1);
				}

				// If only one job exists, run it directly instead of asking user to choose
				if (config.jobs.length === 1) {
					await runJob(config.jobs[0]);
				} else {
					const selectedJobName = !isNothing(_options.jobName) && !isBoolean(_options.jobName)
						? _options.jobName
						: await Select.prompt({
							message: "Select a job to run",
							options: isNothing(config.jobs) ? [] : config.jobs.map((job) => job.name),
						});

					const selectedJob = config.jobs.find((j) => j.name === selectedJobName);

					if (!selectedJob) {
						console.error(`Job '${selectedJobName}' not found in the configuration.`);
						Deno.exit(1);
					}

					await runJob(selectedJob);
				}
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				console.error(`Error loading configuration file: ${errorMsg}`);

				Deno.exit(1);
			}
		} else {
			console.error(`The configuration file '${filePath}' not found.`);
			Deno.exit(1);
		}
	});

if (Deno.args.length === 0) {
	command.showHelp();
} else {
	await command.parse(Deno.args);
}
