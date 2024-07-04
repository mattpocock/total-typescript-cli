import * as fs from "fs/promises";
import * as path from "path";
import { findAllExercises } from "./findAllExercises";

/**
 * Adds a bunch of scripts, like e-01, e-02 to package.json
 * so that StackBlitz can run them programmatically via URL
 * commands
 */

const getPackageJsonScript = (
  exercise: string,
  type: "exercise" | "solution",
): string => {
  return [
    `npx @total-typescript/exercise-cli@latest prune ${exercise}`,
    `pnpm i`,
    `tt-cli run ${exercise} ${type === "solution" ? "--solution" : ""}`,
  ].join(" && ");
};

export const prepareStackblitz = async () => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));

  const srcPath = path.resolve(process.cwd(), "./src");
  const exerciseFiles = await findAllExercises(srcPath, {
    allowedTypes: ["problem", "explainer"],
  });
  const exerciseNumbers: string[] = exerciseFiles.map(
    (exercise) => path.parse(exercise).base.split("-")[0]!,
  );

  const newPackageJson = Object.assign({}, packageJson);

  newPackageJson.scripts = {
    ...packageJson.scripts,
  };

  exerciseNumbers.forEach((exerciseNumber) => {
    newPackageJson.scripts[`e-${exerciseNumber}`] = getPackageJsonScript(
      exerciseNumber,
      "exercise",
    );
    newPackageJson.scripts[`s-${exerciseNumber}`] = getPackageJsonScript(
      exerciseNumber,
      "solution",
    );
  });

  await fs.writeFile(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
};
