import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { totalTypeScriptCLI } from "../src/command";

export class TestUtils {
  private TEST_ENV_PATH = path.join(import.meta.dirname, "playground");
  prepareProcessEnv() {
    process.cwd = () => this.TEST_ENV_PATH;
  }

  clearTestEnv() {
    rmSync(this.TEST_ENV_PATH, { recursive: true, force: true });
    mkdirSync(this.TEST_ENV_PATH);
  }

  constructor() {
    this.prepareProcessEnv();
    this.clearTestEnv();
  }

  async run(cmd: string) {
    await totalTypeScriptCLI.parseAsync(["", "", ...cmd.split(" ")]);
  }

  writeFile(filePath: string[], content?: string) {
    const fullPath = path.join(this.TEST_ENV_PATH, ...filePath);
    mkdirSync(path.dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content ?? "");
  }

  readFile(filePath: string[]) {
    return readFileSync(path.join(this.TEST_ENV_PATH, ...filePath), "utf-8");
  }

  readJsonFile(filePath: string[]) {
    return JSON.parse(
      readFileSync(path.join(this.TEST_ENV_PATH, ...filePath), "utf-8"),
    );
  }
}
