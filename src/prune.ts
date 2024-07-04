import path from "path";
import { findAllExercises } from "./findAllExercises";
import { execSync } from "child_process";

const getLastPathPart = (filepath: string) => {
  return filepath.split("/").pop();
};

export const prune = async (exercise: string) => {
  const srcPath = path.resolve(process.cwd(), "./src");

  const exercisePaths = await findAllExercises(srcPath, {
    allowedTypes: ["problem", "solution", "explainer"],
  });

  const filesToDelete = exercisePaths.filter((exercisePath) => {
    const lastPathPart = getLastPathPart(exercisePath);

    const exerciseWithHyphenSuffix = `${exercise}-`;

    if (lastPathPart) {
      return !lastPathPart.includes(exerciseWithHyphenSuffix);
    }
    return !exercisePath.includes(exerciseWithHyphenSuffix);
  });

  if (filesToDelete.length === exercisePaths.length) {
    console.log(`Exercise ${exercise} not found`);
    process.exit(1);
  }

  if (filesToDelete.length > 0) {
    execSync(`rm -rf ${filesToDelete.map((f) => `"${f}"`).join(" ")}`, {
      stdio: "inherit",
    });
  }
};
