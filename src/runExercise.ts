import * as fs from "fs";
import * as path from "path";
import * as fg from "fast-glob";
import { execSync } from "child_process";
import * as chokidar from "chokidar";
import { jsonc } from "jsonc";

export const runExercise = (exercise: string, isSolution: boolean) => {
  const tsconfigPath = path.resolve(process.cwd(), "./tsconfig.json");

  const tempTsconfigPath = path.resolve(process.cwd(), "./tsconfig.temp.json");

  const tsconfig = jsonc.parse(fs.readFileSync(tsconfigPath, "utf8"));

  const srcPath = path.resolve(process.cwd(), "./src");

  if (!exercise) {
    console.log("Please specify an exercise");
    process.exit(1);
  }

  const allExercises = fg.sync(
    path.join(srcPath, "**", "**.{ts,tsx}").replace(/\\/g, "/"),
  );

  let pathIndicators = [".problem.", ".explainer."];

  if (isSolution) {
    pathIndicators = [".solution."];
  }

  const exerciseFile = allExercises.find((e) => {
    const base = path.parse(e).base;
    return (
      base.startsWith(exercise) && pathIndicators.some((i) => base.includes(i))
    );
  });

  if (!exerciseFile) {
    console.log(`Exercise ${exercise} not found`);
    process.exit(1);
  }

  // One-liner for current directory
  chokidar.watch(exerciseFile).on("all", (event, path) => {
    const fileContents = fs.readFileSync(exerciseFile, "utf8");

    const containsVitest =
      fileContents.includes(`from "vitest"`) ||
      fileContents.includes(`from 'vitest'`);
    try {
      console.clear();
      if (containsVitest) {
        console.log("Running tests...");
        execSync(`vitest run "${exerciseFile}" --passWithNoTests`, {
          stdio: "inherit",
        });
      }
      console.log("Checking types...");

      // Write a temp tsconfig.json
      const tsconfigWithIncludes = {
        ...tsconfig,
        include: [exerciseFile],
      };

      fs.writeFileSync(
        tempTsconfigPath,
        JSON.stringify(tsconfigWithIncludes, null, 2),
      );

      const cmd = `tsc --project ${tempTsconfigPath}`;

      execSync(cmd, {
        stdio: "inherit",
      });
      console.log("Typecheck complete. You finished the exercise!");
    } catch (e) {
      console.log("Failed. Try again!");

      try {
        fs.rmSync(tempTsconfigPath);
      } catch (e) {}
    }
  });
};
