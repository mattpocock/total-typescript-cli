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

  await runExerciseFile(exerciseFile);
};

export const runExerciseFile = async (exercisePath: string) => {
  const exerciseType = await detectExerciseType(exercisePath);

  if (exerciseType === "not-runnable") {
    console.log(`This exercise doesn't need the CLI.`.bold);

    console.log(
      ` - ` +
        `You haven't done anything wrong!`.bold +
        ` Your setup is working correctly.`,
    );

    console.log(
      ` - ` +
        `But this exercise doesn't require the CLI to be run to complete it.`,
    );

    console.log(
      ` - Instead, ` +
        `follow the instructions in the video`.bold +
        ` to complete the exercise.`,
    );

    process.exit(0);
  }

  switch (exerciseType) {
    case "file":
      return await runFileBasedExercise(exercisePath);

    case "package-json-with-dev-script":
      return await runPackageJsonExercise(exercisePath);
  }
  exerciseType satisfies never;
};
