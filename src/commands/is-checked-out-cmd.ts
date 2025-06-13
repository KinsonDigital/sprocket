import { Command } from "@cliffy/command";

const isCheckedOutCmd = new Command()
	.name("is-checked-out")
	.description("Checks if a branch is currently checked out.")
	.arguments("<branch:string>")
	.action(async (options, branch: string) => {
		console.log(branch);
	});

export { isCheckedOutCmd };
