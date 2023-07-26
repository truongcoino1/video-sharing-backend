import { describe, it, expect, jest, afterAll } from "@jest/globals";
import { findIfOneCondition } from "../get";
import { initData } from "../../../../tests/setup";

describe("get Functions", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should not return user when email not exist", async () => {
    const user = await findIfOneCondition({ email: "1111", password: "" });
    expect(user).toBe(undefined);
  });

  it("should return a user when email and password correct", async () => {
    await initData();
    const user = await findIfOneCondition({ email: "tes12t@gmail.com", password: "123" });
    expect(user.email).toBe("tes12t@gmail.com");
  });
});
