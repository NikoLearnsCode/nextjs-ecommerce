import { describe, it, expect } from "vitest";
import { formatPrice } from "@/utils/formatPrice";

describe("formatPrice", () => {
  it("returnerar tankstreck för null/undefined", () => {
    expect(formatPrice(null)).toBe("–");
    expect(formatPrice(undefined)).toBe("–");
  });

  it("returnerar tankstreck för ogiltig sträng", () => {
    expect(formatPrice("inte ett tal")).toBe("–");
  });

  it("formaterar heltal utan decimaler", () => {
    const out = formatPrice(1000);
    expect(out).toContain("kr");
    expect(out).not.toContain(",");
  });

  it("formaterar decimaltal med två decimaler", () => {
    const out = formatPrice(99.5);
    expect(out).toContain("kr");
    expect(out).toContain("99,50");
  });

  it("tolkar numerisk sträng", () => {
    expect(formatPrice("250")).toContain("250");
  });
});
