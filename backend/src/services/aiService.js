import Groq from 'groq-sdk';

// Initialize Groq AI with API key from environment
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper function to generate content with error handling
async function generateContent(prompt, model = 'llama3-70b-8192') {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
}

// AI Project Description Generator
export async function generateProjectDescription(projectName, projectType, context = '') {
  const prompt = `Generate a compelling project description for a ${projectType} project called "${projectName}".
  
Context: ${context}

Requirements:
- Write a clear, professional description (2-3 paragraphs)
- Highlight the project's purpose and value
- Mention key features or goals
- Keep it concise and engaging
- Format as plain text (no markdown)`;

  return generateContent(prompt);
}

// AI README Generator
export async function generateReadme(projectName, description, techStack, features = []) {
  const featuresList = features.length > 0 ? features.join(', ') : 'to be determined';
  
  const prompt = `Generate a comprehensive README.md file for a project called "${projectName}".

Project Description: ${description}
Tech Stack: ${techStack}
Key Features: ${featuresList}

Requirements:
- Include standard sections: Title, Description, Installation, Usage, Features, Contributing, License
- Use proper markdown formatting
- Include code examples for installation and usage
- Make it professional and easy to understand
- Add badges for build status, version, etc. (placeholders)`;

  return generateContent(prompt);
}

// AI Team Recommendation
export async function recommendTeam(projectDescription, requiredSkills, teamSize) {
  const prompt = `Recommend team composition for a project with the following details:

Project Description: ${projectDescription}
Required Skills: ${requiredSkills}
Team Size: ${teamSize}

Requirements:
- Suggest roles needed (e.g., Frontend Developer, Backend Developer, Designer, etc.)
- Assign skill levels (Junior, Mid, Senior) for each role
- Provide reasoning for each recommendation
- Format as a structured list
- Consider the project complexity and timeline`;

  return generateContent(prompt);
}

// AI Task Breakdown
export async function breakdownTasks(projectDescription, deadline, complexity = 'medium') {
  const prompt = `Break down a project into actionable tasks based on the following:

Project Description: ${projectDescription}
Deadline: ${deadline}
Complexity: ${complexity}

Requirements:
- Create a prioritized task list
- Include task descriptions
- Estimate effort (in hours or days)
- Identify dependencies between tasks
- Suggest milestones
- Format as a structured list with clear sections`;

  return generateContent(prompt);
}

// AI Code Review
export async function reviewCode(code, language, context = '') {
  const prompt = `Review the following ${language} code:

${code}

Context: ${context}

Requirements:
- Identify potential bugs or issues
- Suggest improvements for code quality
- Check for security vulnerabilities
- Recommend best practices
- Provide specific line references if applicable
- Be constructive and educational
- Format feedback clearly with categories`;

  return generateContent(prompt);
}

// AI Meeting Summary
export async function summarizeMeeting(transcript, meetingType = 'standup') {
  const prompt = `Summarize the following meeting transcript:

${transcript}

Meeting Type: ${meetingType}

Requirements:
- Extract key decisions made
- Identify action items with owners
- Note important discussions
- Highlight blockers or issues
- Suggest follow-up items
- Format as a structured summary with clear sections`;

  return generateContent(prompt);
}

// AI Smart Search
export async function smartSearch(query, context = '') {
  const prompt = `Provide a comprehensive answer to the following query:

Query: ${query}
Context: ${context}

Requirements:
- Provide accurate, helpful information
- Include relevant examples
- Suggest best practices
- Reference common patterns or solutions
- Be concise but thorough
- Format as clear, readable text`;

  return generateContent(prompt);
}

// AI Productivity Insights
export async function generateProductivityInsights(tasksData, timeData, goals = []) {
  const prompt = `Analyze productivity data and provide actionable insights:

Tasks Completed: ${tasksData}
Time Data: ${timeData}
Goals: ${goals.length > 0 ? goals.join(', ') : 'None specified'}

Requirements:
- Identify productivity patterns
- Suggest improvements
- Highlight areas of strength
- Recommend time management strategies
- Provide motivational insights
- Format as a structured report with clear sections`;

  return generateContent(prompt);
}

export default {
  generateProjectDescription,
  generateReadme,
  recommendTeam,
  breakdownTasks,
  reviewCode,
  summarizeMeeting,
  smartSearch,
  generateProductivityInsights,
};
