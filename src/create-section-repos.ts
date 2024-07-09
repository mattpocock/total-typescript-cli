import { execSync } from "child_process";
import { cpSync, mkdirSync, readdirSync, rmSync } from "fs";
import path from "path";
import { findAllExercises, findAllSections } from "./findAllExercises";

export const createSectionRepos = async () => {
  const srcPath = path.resolve(process.cwd(), "./src");

  if (!process.env.GITHUB_TOKEN) {
    console.log("Please set the GITHUB_TOKEN environment variable");
    process.exit(1);
  }

  const { sections, isASectionRepo } = await findAllSections(srcPath);

  if (!isASectionRepo) {
    console.log("This is not a section repo - not creating sections");
    process.exit(1);
  }

  const repoName = execSync("basename $(git rev-parse --show-toplevel)")
    .toString()
    .trim();

  const sectionDetails = sections.map((section) => {
    const sectionNum = section.name.split("-")[0]!;
    return {
      num: sectionNum,
      section: section.name,
      pathToSection: path.resolve(srcPath, section.name),
      repo: `mattpocock/${repoName}-${sectionNum}`,
      files: section.files,
    };
  });

  const ROOT_FILES_TO_EXCLUDE = [
    ".github",
    ".git",
    "node_modules",
    "renovate.json",
    "out",
    ".twoslash-lint",
  ];

  execSync("git clean -fdx");

  const rootFilesToCopy = readdirSync(process.cwd()).filter(
    (file) => !ROOT_FILES_TO_EXCLUDE.includes(file),
  );

  const relativePathsToExercises = await findAllExercises(srcPath, {
    allowedTypes: ["explainer", "solution", "problem"],
  }).then((exercises) => exercises.map((e) => path.relative(srcPath, e)));

  for (const section of sectionDetails) {
    const repoPath = path.resolve(process.cwd(), "out");

    try {
      mkdirSync(repoPath);
    } catch (e) {}

    rmSync(path.join(repoPath, ".git"), { recursive: true, force: true });

    for (const file of rootFilesToCopy) {
      cpSync(file, path.resolve(repoPath, file), {
        recursive: true,
        errorOnExist: false,
        force: true,
      });
    }

    const relativePathsToSectionExercises = section.files.map((file) =>
      path.relative(srcPath, file),
    );

    const exercisesToDelete = relativePathsToExercises.filter(
      (p) => !relativePathsToSectionExercises.includes(p),
    );

    execSync(`rm -rf ${exercisesToDelete.join(" ")}`, {
      cwd: path.join(repoPath, "src"),
    });

    // Initialise the repo
    execSync(`git init -b main`, { cwd: repoPath });

    // Add the files
    execSync(`git add .`, { cwd: repoPath });

    // Commit the files
    execSync(`git commit -m "Initial commit"`, { cwd: repoPath });

    try {
      // Attempt to create the repo
      execSync(`gh repo create ${section.repo} --public --source ${repoPath}`);

      // Push the files
      execSync(`git push -u origin main`, { cwd: repoPath });
    } catch (e) {
      const remoteUrl = `https://total-typescript-bot:${process.env.GITHUB_TOKEN}@github.com/${section.repo}.git`;

      // Repo already exists, so add the remote
      // Add the remote
      execSync(`git remote add origin ${remoteUrl}`, {
        cwd: repoPath,
      });

      // Fetch the remote
      execSync(`git fetch`, { cwd: repoPath });

      try {
        // IMPROVEMENT: only force push when the files have changed
        const changedFiles = execSync(
          `git diff --name-only origin/main main --`,
          {
            cwd: repoPath,
          },
        )
          .toString()
          .trim();
        if (changedFiles) {
          // Force push the files
          execSync(`git push -u origin main --force`, { cwd: repoPath });
        } else {
          console.log("No files have changed, not pushing");
        }
      } catch (e) {
      } finally {
        execSync(`git push -u origin main --force`, { cwd: repoPath });
      }
    }
  }
};
