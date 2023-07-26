import { describe, it, expect, jest, afterAll } from "@jest/globals";
import { createUser } from "../create";

describe("createUser", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should return a user when register", async () => {
    const user = await createUser({
      email: "tes12t@gmail.com",
      password: "123",
    });
    expect(user.email).toBe("tes12t@gmail.com");
    expect(user.password).toBe("123");
  });

  it("should return a user when login", async () => {
    const user = await createUser({
      email: "tes12t@gmail.com",
      password: "123",
    });
    expect(user.email).toBe("tes12t@gmail.com");
    expect(user.password).toBe("123");
  });

  it("should not return user when missing email", async () => {
    try {
      await createUser({
        email: null,
        password: "123",
      });
    } catch (error: any) {
      expect(error.message).toBe("Password and Email is required!");
    }
  });

  it("should not return user when missing password", async () => {
    try {
      await createUser({
        email: "tes12t@gmail.com",
        password: null,
      });
    } catch (error: any) {
      expect(error.message).toBe("Password and Email is required!");
    }
  });

  it("should not return user when password incorrect", async () => {
    try {
      await createUser({
        email: "tes12t@gmail.com",
        password: "12322222",
      });
    } catch (error: any) {
      expect(error.message).toBe("Password incorrect!");
    }
  });
});

jest.mock("../helper", () => {
  return {
    hashBcrypt: jest.fn().mockReturnValue("123"),
    generateSalt: jest.fn().mockReturnValue("123"),
    compareBcrypt: jest.fn().mockReturnValue(true),
  };
});
