import { expect, it, test } from "vitest";
import { TestUtils } from "./utils";

it("Should work with exercise numbers with length 2", async () => {
  const testUtils = new TestUtils();

  testUtils.writeFile(
    ["package.json"],
    JSON.stringify({
      scripts: {},
    }),
  );

  testUtils.writeFile(["src", "01-example.problem.ts"]);

  await testUtils.run("prepare-stackblitz");

  const packageJson = testUtils.readJsonFile(["package.json"]);

  expect(packageJson.scripts["e-01"]).toEqual("tt-cli run 01");
  expect(packageJson.scripts["s-01"]).toEqual("tt-cli run 01 --solution");
});

it("Should work with exercise numbers with length 3", async () => {
  const testUtils = new TestUtils();

  testUtils.writeFile(
    ["package.json"],
    JSON.stringify({
      scripts: {},
    }),
  );

  testUtils.writeFile(["src", "040-example.problem.ts"]);

  await testUtils.run("prepare-stackblitz");

  const packageJson = testUtils.readJsonFile(["package.json"]);

  expect(packageJson.scripts["e-040"]).toEqual("tt-cli run 040");
  expect(packageJson.scripts["s-040"]).toEqual("tt-cli run 040 --solution");
});

it.skip("Should work with deeply nested exercises", async () => {
  const testUtils = new TestUtils();

  testUtils.writeFile(
    ["package.json"],
    JSON.stringify({
      scripts: {},
    }),
  );

  testUtils.writeFile([
    "src",
    "deeply",
    "020-section",
    "040-example.problem.ts",
  ]);

  await testUtils.run("prepare-stackblitz");

  const packageJson = testUtils.readJsonFile(["package.json"]);

  expect(packageJson.scripts["e-040"]).toEqual("tt-cli run 040");
  expect(packageJson.scripts["s-040"]).toEqual("tt-cli run 040 --solution");
});

it.skip("Should delete existing scripts that are no longer used", async () => {
  const testUtils = new TestUtils();

  testUtils.writeFile(
    ["package.json"],
    JSON.stringify({
      scripts: {
        "e-01": "something",
        "s-01": "something",
        "e-020": "something",
        "s-020": "something",
      },
    }),
  );

  testUtils.writeFile(["src", "040-example.problem.ts"]);

  await testUtils.run("prepare-stackblitz");

  const packageJson = testUtils.readJsonFile(["package.json"]);

  expect(packageJson.scripts["e-01"]).toEqual(undefined);
  expect(packageJson.scripts["s-01"]).toEqual(undefined);
  expect(packageJson.scripts["e-020"]).toEqual(undefined);
  expect(packageJson.scripts["s-020"]).toEqual(undefined);
});

it.skip("Should preserve scripts that aren't s-01, e-02 formatted", async () => {
  const testUtils = new TestUtils();

  testUtils.writeFile(
    ["package.json"],
    JSON.stringify({
      scripts: {
        dev: "tsc",
      },
    }),
  );

  testUtils.writeFile(["src", "040-example.problem.ts"]);

  await testUtils.run("prepare-stackblitz");

  const packageJson = testUtils.readJsonFile(["package.json"]);

  expect(packageJson.scripts["dev"]).toEqual("tsc");
});

it.skip("Should work with explainers", async () => {
  const testUtils = new TestUtils();

  testUtils.writeFile(
    ["package.json"],
    JSON.stringify({
      scripts: {},
    }),
  );

  testUtils.writeFile(["src", "01-example.explainer.ts"]);

  await testUtils.run("prepare-stackblitz");

  const packageJson = testUtils.readJsonFile(["package.json"]);

  expect(packageJson.scripts["e-01"]).toEqual("tt-cli run 01");
  expect(packageJson.scripts["s-01"]).toEqual("tt-cli run 01 --solution");
});
