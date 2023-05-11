import { Command } from "commander";
import { runExercise } from "./runExercise";
import { prepareStackblitz } from "./prepareStackblitz";

export const program = new Command();

program.version("0.0.1");

program
  .command("run <exercise>")
  .description("Runs an exercise on watch mode")
  .option("-s, --solution", "Run the solution")
  .action(
    (
      exercise: string,
      options: {
        solution: boolean;
      },
    ) => runExercise(exercise, options.solution),
  );

program
  .command("prepare-stackblitz")
  .description("Adds e-01, e-02 scripts to package.json")
  .action(prepareStackblitz);
