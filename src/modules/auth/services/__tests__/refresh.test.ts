import { describe, it, expect, jest, afterAll, beforeAll } from "@jest/globals";
import { deleteRefreshToken, getNewAccessTokenFromRefreshToken } from "../refresh";
import { initData } from "../../../../tests/setup";

jest.mock("../helper", () => {
  return {
    generateAccessToken: jest.fn().mockReturnValue("token-test-1"),
  };
});

describe("refresh", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should return a new access token when refresh token correct", async () => {
    await initData();
    const newAccessToken = await getNewAccessTokenFromRefreshToken("token-test-1");
    expect(newAccessToken).toBe("token-test-1");
  });

  it("should return error when refresh token expired", async () => {
    try {
      await getNewAccessTokenFromRefreshToken("token-test-2");
    } catch (error: any) {
      expect(error.message).toBe("Unauthorized");
    }
  });

  it("should return error when refresh token incorrect", async () => {
    try {
      await getNewAccessTokenFromRefreshToken("123");
    } catch (error: any) {
      expect(error.message).toBe("Unauthorized");
    }
  });

  it("should delete refresh token when refresh token correct", async () => {
    await deleteRefreshToken("123");
  });
});
