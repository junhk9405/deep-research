import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from './ai/providers';
import { systemPrompt } from './prompt';
export async function generateFeedback({ query, numQuestions = 3, }) {
    const userFeedback = await generateObject({
        model: getModel(),
        system: systemPrompt(),
        prompt: `Given the following query from the user, ask some follow up questions to clarify the research direction. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>`,
        schema: z.object({
            questions: z
                .array(z.string())
                .describe(`Follow up questions to clarify the research direction, max of ${numQuestions}`),
        }),
    });
    return userFeedback.object.questions.slice(0, numQuestions);
}
