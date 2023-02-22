#! /usr/bin/env node

import * as SDK from "@the-stations-project/sdk";

/* MAIN */
async function main(subcommand: string, args: string[]) {
	switch (subcommand) {
		case "create": return await create(args[0]);
		case "disband": return await disband(args[0]);
		default: return new SDK.Result(SDK.ExitCodes.ErrNoCommand, undefined);
	}
}

/* SUB-FUNCTIONS */
async function create(group: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* get path */
	const path = SDK.Registry.join_paths("groups", group);

	/* create directory */
	(await SDK.Registry.mkdir(path)).or_log_error()
		.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown));

	return result;
}

async function disband(group: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* get path */
	const path = SDK.Registry.join_paths("groups", group);

	/* delete directory */
	(await SDK.Registry.delete(path)).or_log_error()
		.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown));

	return result;
}

async function add_user(group: string, uname: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* get path */
	const path = SDK.Registry.join_paths("groups", group, uname);

	/* create user file */
	(await SDK.Registry.write(path, "")).or_log_error()
		.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown);

	return result;
}

SDK.start_service(main, (result) => console.log(result.to_string()));
