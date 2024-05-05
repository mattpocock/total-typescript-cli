import { execSync } from "child_process";
import {
  compareSnapshotAgainstExisting,
  takeSnapshot,
} from "./snapshotExercises";
import { npm } from "./install";

const SNAPSHOT_FILE_LOCATION = "./snap.md";

export const upgrade = async () => {
  await takeSnapshot(SNAPSHOT_FILE_LOCATION);

  npm(
    "add -D typescript@latest vitest@latest @total-typescript/exercise-cli@latest",
    {
      cwd: process.cwd(),
      stdio: "inherit",
    },
  );

  await compareSnapshotAgainstExisting(SNAPSHOT_FILE_LOCATION);

  execSync(`rm -rf ${SNAPSHOT_FILE_LOCATION}`);

  console.log("Upgrade complete!");
};
