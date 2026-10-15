/**
 * Builds structured prompts for the AI recommendation workflow.
 */

export const RECOMMENDATION_SYSTEM_PROMPT = `You are an expert academic project advisor for college students.
Your role is to recommend specific, feasible, and educational project ideas.

RULES:
- Return ONLY valid JSON. No markdown, no explanation outside the JSON.
- Each project must be genuinely useful and buildable within the stated constraints.
- Do NOT claim a project is unique or has never been built before.
- Feasibility and originality scores are estimates, not verified facts.
- Keep technology suggestions realistic for the student's stated skill level.`;

export const DETAIL_SYSTEM_PROMPT = `You are a senior software architect helping college students plan their projects.
Return ONLY valid JSON. No markdown. Provide practical, actionable guidance.`;

export const CHAT_SYSTEM_PROMPT = `You are a helpful project mentor for a college student.
You have context about their selected project and preferences.
Answer questions clearly, concisely, and at an appropriate technical level.
If asked something outside your knowledge, say so honestly.`;

/**
 * Build the recommendation generation prompt.
 * @param {object} prefs - Validated student preferences
 * @param {number} count - Number of recommendations to generate
 */
export function buildRecommendationPrompt(prefs, count = 5) {
  return `Generate ${count} distinct project topic recommendations for this student profile:

STUDENT PROFILE:
- Academic Branch/Course: ${prefs.branch}
- Academic Year/Semester: ${prefs.academicYear}
- Technical Skills: ${prefs.skills.join(", ")}
- Areas of Interest: ${prefs.interests.join(", ")}
- Preferred Domain: ${prefs.domain}
- Preferred Technology Stack: ${prefs.techStack.join(", ")}
- Difficulty Level: ${prefs.difficulty}
- Available Duration: ${prefs.duration}
- Project Type: ${prefs.teamType}${prefs.teamSize ? ` (${prefs.teamSize} members)` : ""}

Return a JSON object with this exact schema:
{
  "recommendations": [
    {
      "id": "unique_string_id",
      "title": "Project Title",
      "shortDescription": "2-3 sentence overview",
      "problemStatement": "What problem does this solve?",
      "whySuitable": "Why this matches the student's profile specifically",
      "mainFeatures": ["feature 1", "feature 2", "feature 3"],
      "recommendedTechStack": ["tech1", "tech2"],
      "requiredSkills": ["skill1", "skill2"],
      "difficulty": "Beginner|Intermediate|Advanced",
      "estimatedDuration": "e.g. 4-6 weeks",
      "learningOutcomes": ["outcome1", "outcome2"],
      "feasibilityScore": 75,
      "feasibilityExplanation": "Why this score (note: this is an estimate)",
      "domain": "${prefs.domain}",
      "tags": ["tag1", "tag2"],
      "suggestedImprovements": ["improvement1", "improvement2"]
    }
  ]
}`;
}

/**
 * Build the detailed project breakdown prompt.
 * @param {object} project - Selected project recommendation
 * @param {object} prefs - Student preferences
 */
export function buildDetailPrompt(project, prefs) {
  return `Provide a detailed project plan for:

PROJECT: "${project.title}"
DESCRIPTION: ${project.shortDescription}
STUDENT SKILLS: ${prefs.skills.join(", ")}
TECH STACK: ${project.recommendedTechStack?.join(", ")}
DURATION: ${project.estimatedDuration}
TEAM TYPE: ${prefs.teamType}

Return a JSON object with this exact schema:
{
  "projectOverview": "Comprehensive description",
  "objectives": ["objective1", "objective2"],
  "proposedArchitecture": "Architecture description",
  "modules": [
    {
      "name": "Module Name",
      "responsibility": "What this module does",
      "technologies": ["tech1"]
    }
  ],
  "databaseSchema": {
    "tables": [
      {
        "name": "table_name",
        "description": "purpose",
        "keyFields": ["field1", "field2"]
      }
    ]
  },
  "implementationRoadmap": [
    {
      "phase": 1,
      "title": "Phase Title",
      "tasks": ["task1", "task2"],
      "duration": "1 week"
    }
  ],
  "testingApproach": {
    "unitTesting": "approach description",
    "integrationTesting": "approach description",
    "userTesting": "approach description"
  },
  "futureEnhancements": ["enhancement1", "enhancement2"]
}`;
}

/**
 * Build the chat system context given selected project + preferences.
 */
export function buildChatSystemPrompt(project, prefs) {
  return `${CHAT_SYSTEM_PROMPT}

SELECTED PROJECT: "${project.title}"
DESCRIPTION: ${project.shortDescription}
TECH STACK: ${project.recommendedTechStack?.join(", ")}
DIFFICULTY: ${project.difficulty}
DURATION: ${project.estimatedDuration}

STUDENT PROFILE:
- Branch: ${prefs.branch}
- Year: ${prefs.academicYear}
- Skills: ${prefs.skills.join(", ")}
- Interests: ${prefs.interests.join(", ")}
- Team type: ${prefs.teamType}`;
}
