import { existsSync } from "@std/fs";
import { resolve } from "@std/path";
import { Command } from "@cliffy/command";
import { Select } from "@cliffy/prompt";
import { runJob } from "./core/job-runner.ts";
import { Guards } from "./core/guards.ts";
import type { SprocketConfig } from "./core/configuration.ts";
import denoConfig from "../deno.json" with { type: "json" };

const command = new Command()
	.name("sprocket")
	.description("Tool to create prs and prepare for releases.")
	.version(`v${denoConfig.version}`)
	.command("run-job")
	.arguments("<filePath:string>")
	.option("-f, --file-path", "The path to the typescript config file to run.")
	.option("-j, --job-name [string]", "The name of the job to run from the config file.")
	.action(async (_options, filePath: string) => {
		console.log(`The job chosen is: ${_options.jobName}`);

		filePath = resolve(Deno.cwd(), filePath);

		if (existsSync(filePath)) {
			try {
				const fileUrl = new URL(`file://${filePath}`);
				const config = (await import(fileUrl.href)).config as SprocketConfig;

				if (config) {
					const selectedJobName = Guards.isNothing(_options.jobName)
						? await Select.prompt({
							message: "Select a job to run",
							options: Guards.isNothing(config.jobs) ? [] : config.jobs.map((job) => job.name),
						})
						: _options.jobName;

					const selectedJob = config.jobs.find((j) => j.name === selectedJobName);

					if (!selectedJob) {
						console.error(`Job '${selectedJobName}' not found in the configuration.`);
						Deno.exit(1);
					}

					await runJob(selectedJob);
				} else {
					console.error("Configuration file does not export a 'config' object.");
					Deno.exit(1);
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
