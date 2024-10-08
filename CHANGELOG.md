# @total-typescript/exercise-cli

## 0.11.0

### Minor Changes

- b166607: Made vitest snapshot more resistant to changes by deleting failure messages. Only whether the test failed or succeeded will now be stored in the snapshot.

## 0.10.1

### Patch Changes

- 966b434: Improved non-runnable exercise text to make it less confusing.

## 0.10.0

### Minor Changes

- fd1f038: Removed old commands: prune and upgrade

## 0.9.2

### Patch Changes

- bbd986b: Made it mandatory to provide a GITHUB_TOKEN for create section repos

## 0.9.1

### Patch Changes

- 825aad7: Changed to ssh-based remote

## 0.9.0

### Minor Changes

- f9e4ee7: Added the create-section-repos command for creating repos based on the sections of the course

### Patch Changes

- f40d60e: Removed prune from prepare stackblitz

## 0.8.3

### Patch Changes

- 6b0f708: Made the npx command only run the latest
- 6b0f708: Fixed bug with prune

## 0.8.2

### Patch Changes

- 8de0e7e: Fixed a bug where it asked you to install tt-cli

## 0.8.0

### Minor Changes

- 1b46e96: Added the prune command, which helps speed up the stackblitz editor.

### Patch Changes

- 19a2317: Fixed a bug where tsconfig.temp.json did not always get deleted.
- 5d28610: Improved log output for upgrade script
- ce974cf: Made prepare-stackblitz clean up unused scripts

## 0.6.1

### Patch Changes

- 6061eec: Improved the output of the compare snapshot function to output a git diff to stdout
- 6061eec: Made the initial install during snapshotting output to the console

## 0.6.0

### Minor Changes

- 88d8883: Made the upgrade script push to git after completion.
- 5f463bc: Allowed snapshot to capture data inside folder-based exercises, allowing upgrade to be used on the book exercises.
- 88d8883: Added an upgrade-beta command to test the latest TS beta

### Patch Changes

- 5f463bc: Fixed a bug where exercises did not return in the correct order
- 88d8883: Updated the peer dependencies required by the CLI

## 0.5.1

### Patch Changes

- de42a81: Fixed bug where you could no longer run specific exercises

## 0.5.0

### Minor Changes

- d79b475: Upgraded vitest peer dependency.

## 0.4.0

### Minor Changes

- 82adb76: Added a snapshotting tool to replace the snapshots in each of the project directories.
- dbf4066: Added the ability to run "tt-cli run" to open a prompt of which exercise you'd like to run.

## 0.3.2

### Patch Changes

- 1a1abb5: Fixed a bug where folder paths containing spaces were not working.

## 0.3.1

### Patch Changes

- f5b0436: Made prepare-stackblitz work with the new types of exercises.

## 0.3.0

### Minor Changes

- fa3c7de: Added the ability to run folder-based exercises, for the upcoming TT book.

## 0.2.1

### Patch Changes

- Fixed an issue where it wasn't parsing jsonc

## 0.1.4

### Patch Changes

- 73cc331: Initial commit
