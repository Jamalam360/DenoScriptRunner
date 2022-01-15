interface Command {
  commands: string[];
}

interface Script {
  path: string;
  commands: string[][];
  git: boolean;
}

try {
  const scripts = JSON.parse(await Deno.readTextFile(Deno.args[0])) as Script[];

  for (let index = 0; index < scripts.length; index++) {
    const script = scripts[index];

    if (script.git) {
      await Deno.run({
        cwd: script.path,
        cmd: [
          "git",
          "pull",
        ],
        stdout: "null",
        stderr: "null"
      });
    }

    for (let index = 0; index < script.commands.length; index++) {
      const cmd = Deno.run({
        cwd: script.path,
        cmd: script.commands[index],
        stdout: "inherit",
        stderr: "inherit",
      });

      await cmd.status();
    }
  }
} catch (e) {
  console.log("Failed to run startup scripts");
  throw e;
}
