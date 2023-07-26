import { describe, it, expect, jest } from "@jest/globals";
import bcryptjs from "bcryptjs";
import {
  verifyAccessToken,
  hashBcrypt,
  compareBcrypt,
  generateAccessToken,
  generateRefreshToken,
  generateSalt,
} from "../helper";
import userServices from "../auth";

jest.mock("bcryptjs", () => {
  return {
    genSaltSync: jest.fn().mockReturnValue("123"),
    hash: jest.fn().mockImplementation((text, salt, cb: any) => {
      cb(null, "123");
    }),
    compare: jest.fn().mockImplementation((text, salt, cb: any) => {
      cb(null, true);
    }),
  };
});

jest.mock("jsonwebtoken", () => {
  return {
    verify: jest.fn().mockReturnValue({ userId: 1 }),
    sign: jest.fn().mockReturnValue("123"),
  };
});

describe("helper", () => {
  it("should return correct when generateSalt", async () => {
    const salt = await generateSalt(10);
    expect(salt).toBe("123");
  });

  it("should return correct when hashBcrypt", async () => {
    const hashed = await hashBcrypt("123", "123");
    expect(hashed).toBe("123");
  });

  it("should return incorrect when hashBcrypt error", async () => {
    // @ts-ignore
    bcryptjs.hash = jest.fn().mockImplementation((text, salt, cb: any) => {
      cb("error", null);
    });
    try {
      await hashBcrypt("123", "123");
    } catch (error: any) {
      expect(error).toBe("error");
    }
  });

  it("should return correct when compareBcrypt", async () => {
    const isCorrect = await compareBcrypt("123", "123");
    expect(isCorrect).toBe(true);
  });

  it("should return incorrect when compareBcrypt error", async () => {
    // @ts-ignore
    bcryptjs.compare = jest.fn().mockImplementation((text, salt, cb: any) => {
      cb("error", null);
    });
    try {
      await compareBcrypt("123", "123");
    } catch (error: any) {
      expect(error).toBe("error");
    }
  });

  // should return string when generateAccessToken
  it("should return correct when generateAccessToken", async () => {
    const accessToken = await generateAccessToken(1);
    expect(accessToken).toBe("123");
  });

  // should return string when generateRefreshToken
  it("should return correct when generateRefreshToken", async () => {
    const refreshToken = await generateRefreshToken(1);
    expect(refreshToken).toBe("123");
  });

  // should return object when verifyAccessToken
  it("should return correct when verifyAccessToken", async () => {
    // @ts-ignore
    userServices.findIfOneCondition = jest.fn().mockReturnValue({ id: 1 });
    const user = await verifyAccessToken("123");
    expect(user).toEqual({ id: 1 });
  });
});
