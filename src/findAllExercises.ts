import * as fg from "fast-glob";
import { readdir } from "fs/promises";
import path from "path";
import { isDir } from "./detectExerciseType";

const searchToGlob = (search: {
  num?: string;
  allowedTypes?: ("explainer" | "solution" | "problem")[];
}) => {
  return `**/${search?.num ?? ""}*.{${search?.allowedTypes?.join(",") ?? ""}}*`;
};

export const findExerciseInCwd = async (
  exercise: string,
  runSolution: boolean,
): Promise<string> => {
  const srcPath = path.resolve(process.cwd(), "./src");

  const exerciseFile = await findExercise(srcPath, {
    num: exercise,
    allowedTypes: ["explainer", runSolution ? "solution" : "problem"],
  });

  if (!exerciseFile) {
    console.log(`Exercise ${exercise} not found`);
    process.exit(1);
  }

  return exerciseFile;
};

export const findAllSections = async (
  srcPath: string,
): Promise<{
  sections: {
    name: string;
    files: string[];
  }[];
  isASectionRepo: boolean;
}> => {
  const dirContents = await readdir(srcPath);

  const allSections: {
    name: string;
    files: string[];
  }[] = [];

  const exercises = await findAllExercises(srcPath, {
    allowedTypes: ["explainer", "problem", "solution"],
  });

  for (const dir of dirContents) {
    if (await isDir(path.join(srcPath, dir))) {
      const pathToSection = path.join(srcPath, dir);
      allSections.push({
        name: dir,
        files: exercises.filter((exercise) => {
          return exercise.startsWith(pathToSection);
        }),
      });
    }
  }

  return {
    sections: allSections.sort((a, b) => a.name.localeCompare(b.name)),
    // If there is anything else in the src directory that is not a dir,
    // then this is not a 'section' repo
    isASectionRepo: allSections.length === dirContents.length,
  };
};

export const findAllExercises = async (
  srcPath: string,
  search: {
    num?: string;
    allowedTypes: ("explainer" | "solution" | "problem")[];
  },
): Promise<string[]> => {
  const glob = searchToGlob(search || {});

  const allExercises = await fg.default(
    path.join(srcPath, "**", glob).replace(/\\/g, "/"),
    {
      onlyFiles: false,
    },
  );

  return allExercises.sort((a, b) => a.localeCompare(b));
};

export const findExercise = async (
  srcPath: string,
  search: {
    num?: string;
    allowedTypes?: ("explainer" | "solution" | "problem")[];
  },
): Promise<string | undefined> => {
  const glob = searchToGlob(search);

  const allExercises = await fg.default(
    path.join(srcPath, "**", glob).replace(/\\/g, "/"),
    {
      onlyFiles: false,
    },
  );

  return allExercises[0];
};
