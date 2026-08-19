export const PROMPTS = {
  projectDescription: (title, category, techStack) => `
You are an expert project manager and technical writer. Generate a professional project description for the following project:

Project Title: ${title}
Category: ${category}
Tech Stack: ${techStack}

Please provide a comprehensive project description that includes:
1. A compelling project overview
2. Clear objectives and goals
3. Key features and functionalities
4. Technical challenges and solutions
5. Expected outcomes and success metrics

Format the response in JSON with the following structure:
{
  "overview": "...",
  "objectives": ["...", "..."],
  "features": ["...", "..."],
  "challenges": ["...", "..."],
  "outcomes": ["...", "..."]
}
`,

  readme: (projectName, description, techStack, features) => `
You are an expert technical documentation writer. Generate a professional README.md file for the following project:

Project Name: ${projectName}
Description: ${description}
Tech Stack: ${techStack}
Features: ${features}

The README should include:
1. Project overview
2. Features list
3. Tech stack with versions
4. Installation instructions
5. Folder structure
6. API documentation (if applicable)
7. Future improvements

Format as proper Markdown.
`,

  teamRecommendation: (userSkills, userExperience, userInterests, previousProjects) => `
You are an expert team builder and talent matcher. Based on the following user profile, recommend the best teammates:

User Skills: ${userSkills}
User Experience: ${userExperience}
User Interests: ${userInterests}
Previous Projects: ${previousProjects}

Provide recommendations in JSON format:
{
  "recommendations": [
    {
      "skills": ["...", "..."],
      "experience": "...",
      "compatibilityScore": 85,
      "reason": "..."
    }
  ]
}
`,

  taskBreakdown: (projectIdea) => `
You are an expert project manager and technical lead. Break down the following project idea into actionable tasks:

Project Idea: ${projectIdea}

Provide a detailed task breakdown in JSON format:
{
  "milestones": [
    {
      "name": "...",
      "tasks": [
        {
          "title": "...",
          "subtasks": ["...", "..."],
          "estimatedHours": 8,
          "priority": "high"
        }
      ]
    }
  ],
  "timeline": "...",
  "recommendedOrder": ["...", "..."]
}
`,

  codeReview: (code, language) => `
You are an expert code reviewer. Review the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive review in JSON format:
{
  "suggestions": ["...", "..."],
  "possibleBugs": ["...", "..."],
  "bestPractices": ["...", "..."],
  "performanceImprovements": ["...", "..."],
  "securityRecommendations": ["...", "..."]
}
`,

  meetingSummary: (meetingNotes) => `
You are an expert meeting facilitator. Summarize the following meeting notes:

Meeting Notes: ${meetingNotes}

Generate a structured summary in JSON format:
{
  "summary": "...",
  "actionItems": [
    {
      "task": "...",
      "assignedTo": "...",
      "deadline": "..."
    }
  ],
  "keyDecisions": ["...", "..."],
  "nextSteps": ["...", "..."]
}
`,

  smartSearch: (query, context) => `
You are an intelligent search assistant. The user is searching with the following natural language query:

Query: ${query}
Context: ${context}

Interpret the query and provide search parameters in JSON format:
{
  "type": "projects|users|tasks|teams",
  "filters": {
    "key": "value"
  },
  "sortBy": "...",
  "interpretation": "..."
}
`,

  productivityInsights: (projects, tasks, activity, deadlines) => `
You are an expert productivity analyst. Analyze the following data:

Projects: ${projects}
Tasks: ${tasks}
Activity: ${activity}
Deadlines: ${deadlines}

Generate productivity insights in JSON format:
{
  "weeklyReport": "...",
  "suggestions": ["...", "..."],
  "riskAnalysis": ["...", "..."],
  "productivityScore": 85,
  "recommendations": ["...", "..."]
}
`,
};
