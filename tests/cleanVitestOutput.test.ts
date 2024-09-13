import { expect, it } from "vitest";
import { cleanVitestOutput, type VitestOutput } from "../src/cleanVitestOutput";

it("Should remove failureMessages from assertionResults", () => {
  const output = cleanVitestOutput(
    JSON.stringify({
      testResults: [
        {
          name: "test",
          assertionResults: [
            {
              failureMessages: ["oh-dear"],
            },
          ],
        },
      ],
    } satisfies VitestOutput),
    {
      rootFolder: "./",
    }
  );

  expect(output).toEqual({
    testResults: [
      {
        name: "test",
        assertionResults: [{}],
      },
    ],
  });
});

it("Should retain statuses of assertionResults", () => {
  const output = cleanVitestOutput(
    JSON.stringify({
      testResults: [
        {
          name: "test",
          assertionResults: [
            {
              status: "failed",
            },
            {
              status: "passed",
            },
          ],
        },
      ],
    } satisfies VitestOutput),
    {
      rootFolder: "./",
    }
  );

  expect(output).toEqual({
    testResults: [
      {
        name: "test",
        assertionResults: [
          {
            status: "failed",
          },
          {
            status: "passed",
          },
        ],
      },
    ],
  });
});
