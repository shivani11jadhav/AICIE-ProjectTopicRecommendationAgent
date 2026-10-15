import { extractJSON } from "../src/utils/parseJSON.js";

describe("extractJSON", () => {
  test("parses plain JSON string", () => {
    const result = extractJSON('{"key": "value"}');
    expect(result).toEqual({ key: "value" });
  });

  test("parses JSON wrapped in markdown code fence", () => {
    const result = extractJSON('```json\n{"key": "value"}\n```');
    expect(result).toEqual({ key: "value" });
  });

  test("parses JSON wrapped in bare code fence", () => {
    const result = extractJSON('```\n{"key": "value"}\n```');
    expect(result).toEqual({ key: "value" });
  });

  test("parses JSON array", () => {
    const result = extractJSON("[1, 2, 3]");
    expect(result).toEqual([1, 2, 3]);
  });

  test("extracts JSON from surrounding text", () => {
    const result = extractJSON('Here is the result: {"recommendations": []}');
    expect(result).toEqual({ recommendations: [] });
  });

  test("throws on completely invalid input", () => {
    expect(() => extractJSON("This is just plain text with no JSON")).toThrow();
  });

  test("throws on empty string", () => {
    expect(() => extractJSON("")).toThrow();
  });

  test("throws on null", () => {
    expect(() => extractJSON(null)).toThrow();
  });
});
