console.log("Welcome to DSR");

interface Command {
  commands: string[];
}

interface Script {
  name: string;
  path: string;
  commands: string[][];
  git: boolean;
}

// deno-lint-ignore no-explicit-any
const commands: Promise<any>[] = [];

try {
  const scripts = JSON.parse(await Deno.readTextFile(Deno.args[0])) as Script[];
  console.log(`Found ${scripts.length} scripts`);

  for (let index = 0; index < scripts.length; index++) {
    const script = scripts[index];
    console.log("Starting command: " + script.name);

    if (script.git) {
      console.log("Running git pull...");
      const cmd = Deno.run({
        cwd: script.path,
        cmd: [
          "git",
          "pull",
        ],
        stdout: "null",
        stderr: "null",
      });

      await cmd.status();
    }

    for (let index = 0; index < script.commands.length; index++) {
      console.log(
        `Running command ${(index + 1)} of ${script.commands.length}`,
      );
      const cmd = Deno.run({
        cwd: script.path,
        cmd: script.commands[index],
        stdout: "inherit",
        stderr: "inherit",
      });

      commands.push(cmd.status());
    }
  }
} catch (e) {
  console.log("Failed to run startup scripts");
  throw e;
}

await Promise.all(commands);