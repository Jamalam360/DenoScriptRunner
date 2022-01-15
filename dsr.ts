interface Command {
  commands: string[];
}

interface Script {
  name: string;
  path: string;
  commands: string[][];
  git: boolean;
  await: boolean;
}

try {
  const scripts = JSON.parse(await Deno.readTextFile(Deno.args[0])) as Script[];

  for (let index = 0; index < scripts.length; index++) {
    const script = scripts[index];

    if (script.git) {
      const cmd = Deno.run({
        cwd: script.path,
        cmd: [
          "git",
          "pull",
        ],
        stdout: "null",
        stderr: "null"
      });

      await cmd.status();
    }

    for (let index = 0; index < script.commands.length; index++) {
      console.log("Starting command: " + script.name);

      const cmd = Deno.run({
        cwd: script.path,
        cmd: script.commands[index],
        stdout: "inherit",
        stderr: "inherit",
      });

      if (script.await) {
        await cmd.status();
      }
    }
  }
} catch (e) {
  console.log("Failed to run startup scripts");
  throw e;
}
