import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  // verbose: true,
  // automock: true,
  testPathIgnorePatterns: ["/__tests__/fake/"],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 85,
      lines: 80,
      statements: 80,
    },
    "./src/core/modules/": {
      branches: 70,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
export default config;
