#! /usr/bin/env node

import * as SDK from "@the-stations-project/sdk";

/* MAIN */
async function main(subcommand: string, args: string[]) {
	switch (subcommand) {
		case "create": return await create(args[0]);
		case "disband": return await disband(args[0]);
		case "mod_users": return await mod_users(args[0], args[1], args[2]);
		default: return new SDK.Result(SDK.ExitCodes.ErrNoCommand, undefined);
	}
}

/* SUB-FUNCTIONS */
async function create(group: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* safety */
	if (arguments.length < 1) return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);

	/* get path */
	const path = SDK.Registry.join_paths("groups", group, "details");

	/* create directory */
	(await SDK.Registry.mkdir(path)).or_log_error()
		.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown));

	return result;
}

async function disband(group: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* safety */
	if (arguments.length < 1) return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);

	/* get path */
	const path = SDK.Registry.join_paths("groups", group);

	/* delete directory */
	(await SDK.Registry.delete(path)).or_log_error()
		.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown));

	return result;
}

async function mod_users(group: string, uname: string, action: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, false);

	/* safety */
	if (arguments.length < 2) return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);

	/* get path */
	const path = SDK.Registry.join_paths("groups", group, uname);

	switch (action) {
		case "add": {
			(await SDK.Registry.write(path, "")).or_log_error()
				.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown));
			break;
		}
		case "remove": {
			(await SDK.Registry.delete(path)).or_log_error()
				.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown));
			break;
		}
		case "check": {
			(await SDK.Registry.test(path))
				.ok(() => result.finalize_with_value(true))
				.err(() => result.finalize_with_value(false));
			break;	
		}
		default: return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);
	}

	return result;
}

SDK.start_service(main, (result) => console.log(result.to_string()));
