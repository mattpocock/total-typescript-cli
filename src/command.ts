import { Command } from "commander";
import { runExercise } from "./runExercise";
import { prepareStackblitz } from "./prepareStackblitz";
import {
  compareSnapshotAgainstExisting,
  takeSnapshot,
} from "./snapshotExercises";
import { runPrompts } from "./runPrompts";
import packageJson from "../package.json" with { type: "json" };
import { createSectionRepos } from "./create-section-repos";

export const totalTypeScriptCLI = new Command();

totalTypeScriptCLI.version(packageJson.version);

totalTypeScriptCLI
  .command("run [exercise]")
  .alias("exercise [exercise]")
  .description("Runs an exercise on watch mode")
  .option("-s, --solution", "Run the solution")
  .action(
    (
      exercise: string,
      options: {
        solution: boolean;
      },
    ) => {
      if (exercise) {
        runExercise(exercise, options.solution);
      } else {
        runPrompts();
      }
    },
  );

totalTypeScriptCLI
  .command("create-section-repos")
  .description("Creates section repos")
  .action(createSectionRepos);

totalTypeScriptCLI
  .command("prepare-stackblitz")
  .description("Adds e-01, e-02 scripts to package.json")
  .action(prepareStackblitz);

totalTypeScriptCLI
  .command("take-snapshot <snapshotPath>")
  .description("Takes a snapshot of the current state of the exercises")
  .action(takeSnapshot);

totalTypeScriptCLI
  .command("compare-snapshot <snapshotPath>")
  .description("Compares the current state of the exercises against a snapshot")
  .action(compareSnapshotAgainstExisting);
