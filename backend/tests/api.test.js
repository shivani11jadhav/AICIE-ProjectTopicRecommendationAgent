/**
 * API integration tests.
 * These tests use supertest and do NOT call real AI APIs.
 * AI service calls are mocked.
 */
import "dotenv/config";
import request from "supertest";
import app from "../src/server.js";

describe("GET /api/health", () => {
  test("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /api/recommendations — validation", () => {
  test("returns 400 when body is empty", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .send({})
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .send({ branch: "CS" }) // missing most fields
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  test("returns 400 with invalid difficulty", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .send({
        branch: "CS",
        academicYear: "3rd",
        skills: ["JavaScript"],
        interests: ["Web"],
        domain: "Web Development",
        techStack: ["React"],
        difficulty: "Expert", // invalid
        duration: "4 weeks",
        teamType: "Individual",
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
  });
});

describe("POST /api/chat — validation", () => {
  test("returns 400 when message is missing", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ project: {}, preferences: {} })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
  });
});
