import { expect, it, test } from "vitest";
import { TestUtils } from "./utils";

it("Should correctly create a snapshot of vitest exercises", async () => {
  const testUtils = new TestUtils();

  testUtils.writeFile(
    ["tsconfig.json"],
    JSON.stringify({
      compilerOptions: {
        strict: true,
      },
    }),
  );

  testUtils.writeFile(
    ["vite.config.ts"],
    [
      `import { defineConfig } from "vitest/config";`,
      `import path from "path";`,
      ``,
      `export default defineConfig({`,
      `  test: {`,
      `    include: ["src/**/*{problem,solution,explainer}*.{ts,tsx}"],`,
      `    setupFiles: [path.resolve(__dirname, "scripts/setup.ts")],`,
      `    passWithNoTests: true,`,
      `    environment: "jsdom",`,
      `  },`,
      `});`,
    ].join("\n"),
  );

  testUtils.writeFile(
    ["src", "01-example.problem.ts"],
    [
      `import { it, expect } from 'vitest';`,
      `it('should work', () => {`,
      `  expect(1).toEqual(1);`,
      `});`,
    ].join("\n"),
  );

  await testUtils.run("take-snapshot ./snap");

  const result = testUtils.readFile(["snap"]);

  expect(result).toMatchInlineSnapshot();
});
