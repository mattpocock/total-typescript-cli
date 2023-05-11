import * as fs from "fs";
import * as path from "path";
import * as fg from "fast-glob";

/**
 * Adds a bunch of scripts, like e-01, e-02 to package.json
 * so that StackBlitz can run them programmatically via URL
 * commands
 */

export const prepareStackblitz = () => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const srcPath = path.resolve(process.cwd(), "./src");
  const allExercises: string[] = fg.sync(
    path.join(srcPath, "**", "**.{ts,tsx}").replace(/\\/g, "/"),
  );
  const exerciseFiles = allExercises.filter((exercise) =>
    exercise.includes(".problem."),
  );
  const exerciseNames = exerciseFiles.map(
    (exercise) => path.parse(exercise).base.split("-")[0],
  );

  const newPackageJson = Object.assign({}, packageJson);

  newPackageJson.scripts = {
    ...packageJson.scripts,
  };

  exerciseNames.forEach((exercise) => {
    newPackageJson.scripts[`e-${exercise}`] = `tt-cli ${exercise}`;
    newPackageJson.scripts[`s-${exercise}`] = `tt-cli ${exercise} --solution`;
  });

  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
};
