import { detectExerciseType } from "./detectExerciseType";
import { findExerciseInCwd } from "./findAllExercises";
import { runFileBasedExercise } from "./runFileBasedExercise";
import { runPackageJsonExercise } from "./runPackageJsonExercise";

export const runExercise = async (exercise: string, runSolution: boolean) => {
  if (!exercise) {
    console.log("Please specify an exercise");
    process.exit(1);
  }

  const exerciseFile = await findExerciseInCwd(exercise, runSolution);

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
