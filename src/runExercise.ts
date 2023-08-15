import * as fg from "fast-glob";
import * as path from "path";
import { detectExerciseType } from "./detectExerciseType";
import { runFileBasedExercise } from "./runFileBasedExercise";
import { runPackageJsonExercise } from "./runPackageJsonExercise";

const findExerciseToRun = async (
  exercise: string,
  runSolution: boolean,
): Promise<string> => {
  const srcPath = path.resolve(process.cwd(), "./src");

  const glob = `**/${exercise}*.{explainer,${
    runSolution ? "solution" : "problem"
  }}*`;

  const allExercises = await fg.default(
    path.join(srcPath, "**", glob).replace(/\\/g, "/"),
    {
      onlyFiles: false,
    },
  );

  const exerciseFile = allExercises[0];

  if (!exerciseFile) {
    console.log(`Exercise ${exercise} not found`);
    process.exit(1);
  }

  return exerciseFile;
};

export const runExercise = async (exercise: string, runSolution: boolean) => {
  if (!exercise) {
    console.log("Please specify an exercise");
    process.exit(1);
  }

  const exerciseFile = await findExerciseToRun(exercise, runSolution);

  const exerciseType = await detectExerciseType(exerciseFile);

  if (exerciseType === "not-runnable") {
    console.log(
      `Exercise ${exercise} is not runnable. Follow the instructions in the video to complete it.`,
    );
    process.exit(0);
  }

  switch (exerciseType) {
    case "file":
      return await runFileBasedExercise(exerciseFile);

    case "package-json-with-dev-script":
      return await runPackageJsonExercise(exerciseFile);
  }
  exerciseType satisfies never;
};
