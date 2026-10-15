import { scoreProject, rankProjects } from "../src/services/scorer.js";

const mockPrefs = {
  branch: "Computer Science",
  academicYear: "3rd Year",
  skills: ["JavaScript", "React", "Node.js"],
  interests: ["Web Development", "AI"],
  domain: "Web Development",
  techStack: ["React", "Node.js", "MongoDB"],
  difficulty: "Intermediate",
  duration: "6-8 weeks",
  teamType: "Individual",
};

const mockProject = {
  id: "p1",
  title: "AI Task Manager",
  domain: "Web Development",
  requiredSkills: ["JavaScript", "React", "Node.js"],
  recommendedTechStack: ["React", "Node.js", "MongoDB"],
  tags: ["Web Development", "AI", "productivity"],
  difficulty: "Intermediate",
  estimatedDuration: "6-8 weeks",
  feasibilityScore: 80,
};

describe("scorer", () => {
  test("scoreProject returns suitabilityScore between 0 and 100", () => {
    const scored = scoreProject(mockProject, mockPrefs);
    expect(scored.suitabilityScore).toBeGreaterThanOrEqual(0);
    expect(scored.suitabilityScore).toBeLessThanOrEqual(100);
  });

  test("scoreProject attaches scoreBreakdown", () => {
    const scored = scoreProject(mockProject, mockPrefs);
    expect(scored.scoreBreakdown).toBeDefined();
    expect(scored.scoreBreakdown.skillMatch).toBeDefined();
  });

  test("well-matched project scores higher than mismatched", () => {
    const mismatchedProject = {
      id: "p2",
      title: "Embedded Firmware",
      domain: "IoT",
      requiredSkills: ["C", "Assembly", "RTOS"],
      recommendedTechStack: ["C", "FreeRTOS"],
      tags: ["IoT", "hardware"],
      difficulty: "Advanced",
      estimatedDuration: "6 months",
      feasibilityScore: 40,
    };

    const goodScore = scoreProject(mockProject, mockPrefs).suitabilityScore;
    const badScore = scoreProject(mismatchedProject, mockPrefs).suitabilityScore;
    expect(goodScore).toBeGreaterThan(badScore);
  });

  test("rankProjects returns sorted descending by suitabilityScore", () => {
    const projects = [
      { ...mockProject, id: "p1", feasibilityScore: 80 },
      { ...mockProject, id: "p2", feasibilityScore: 40, difficulty: "Advanced", requiredSkills: ["Rust"] },
    ];
    const ranked = rankProjects(projects, mockPrefs);
    expect(ranked[0].suitabilityScore).toBeGreaterThanOrEqual(
      ranked[1].suitabilityScore
    );
  });

  test("difficulty mismatch reduces score", () => {
    const beginner = scoreProject(
      { ...mockProject, difficulty: "Beginner" },
      mockPrefs
    );
    const advanced = scoreProject(
      { ...mockProject, difficulty: "Advanced" },
      mockPrefs
    );
    const exact = scoreProject(mockProject, mockPrefs); // Intermediate = match
    expect(exact.suitabilityScore).toBeGreaterThan(beginner.suitabilityScore);
    expect(exact.suitabilityScore).toBeGreaterThan(advanced.suitabilityScore);
  });
});
