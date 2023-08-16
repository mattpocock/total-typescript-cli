import * as fg from "fast-glob";
import path from "path";

const searchToGlob = (search: {
  num?: string;
  allowedTypes?: ("explainer" | "solution" | "problem")[];
}) => {
  return `**/${search?.num ?? ""}*.{${search?.allowedTypes?.join(",") ?? ""}}*`;
};

export const findAllExercises = async (
  srcPath: string,
  search?: {
    num?: string;
    allowedTypes?: ("explainer" | "solution" | "problem")[];
  },
): Promise<string[]> => {
  const glob = searchToGlob(search || {});

  const allExercises = await fg.default(
    path.join(srcPath, "**", glob).replace(/\\/g, "/"),
    {
      onlyFiles: false,
    },
  );

  return allExercises;
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
