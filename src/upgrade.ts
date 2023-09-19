import { execSync } from "child_process";
import {
  compareSnapshotAgainstExisting,
  takeSnapshot,
} from "./snapshotExercises";

export const upgrade = async () => {
  await takeSnapshot("./snap");

  execSync(
    "npm add -D typescript@latest vitest@latest @total-typescript/exercise-cli@latest",
    {
      cwd: process.cwd(),
      stdio: "inherit",
    },
  );

  await compareSnapshotAgainstExisting("./snap");

  execSync("rm -rf ./snap");

  console.log("Upgrade complete!");
};
