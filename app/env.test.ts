// app/env.test.ts
import { describe, expect, it } from "vitest";

describe("Workers runtime environment", () => {
  it("has Web API globals available", () => {
    expect(typeof Request).toBe("function");
    expect(typeof Response).toBe("function");
    expect(typeof URL).toBe("function");
  });

  it("does not have Node.js-only globals", () => {
    // Workers runtime では process は限定的にしか使えない
    expect(typeof process).not.toBe("undefined"); // nodejs_compat flag で存在する
  });
});
