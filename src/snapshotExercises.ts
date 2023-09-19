import { execSync } from "child_process";
import * as path from "path";
import { cleanVitestOutput } from "./cleanVitestOutput";
import { readFileSync, writeFileSync, writeSync } from "fs";
import Diff from "diff";
import "colors";

const getTSSnapshot = (rootFolder: string): string => {
  let result: string;
  try {
    result = execSync(`npx tsc`, {
      cwd: rootFolder,
    }).toString();
  } catch (error: any) {
    result = error.output.toString();
  }
  return result;
};

const getVitestSnapshot = (rootFolder: string): string => {
  let result: string;

  try {
    result = execSync(`npx vitest run --reporter=json`, {
      cwd: rootFolder,
      stdio: "pipe",
    }).toString();
  } catch (error: any) {
    result = error.output.toString();
  }

  const vitestOutput = cleanVitestOutput(result, {
    rootFolder,
  });

  return JSON.stringify(vitestOutput, null, 2);
};

const getSnapshot = () => {
  const tsSnapshot = getTSSnapshot(process.cwd());

  const vitestSnapshot = getVitestSnapshot(process.cwd());

  const fullSnapshot = tsSnapshot + "\n\n" + vitestSnapshot;

  return fullSnapshot;
};

export const takeSnapshot = async (outPath: string) => {
  const fullSnapshot = getSnapshot();
  writeFileSync(outPath, fullSnapshot);
};

export const compareSnapshotAgainstExisting = async (outPath: string) => {
  const newSnapshot = getSnapshot();
  const existingSnapshot = readFileSync(outPath, "utf8");

  if (newSnapshot !== existingSnapshot) {
    execSync(`git add ${outPath}`);

    writeFileSync(outPath, newSnapshot);

    console.log(
      "Snapshots differ. Original has been staged for commit. Check the diff in VSCode to see what changed.",
    );
    process.exit(1);
  }
};
