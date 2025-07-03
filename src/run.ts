import * as fs from 'fs/promises';
import * as path from 'path';
import * as readline from 'readline';

import { getModel } from './ai/providers';
import {
  deepResearch,
  writeFinalAnswer,
} from './deep-research';
import { generateFeedback } from './feedback';

// Helper function for consistent logging
function log(...args: any[]) {
  console.log(...args);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to get user input
function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

// run the agent
async function run() {
  console.log('Using model: ', getModel().modelId);

  // Get initial query
  const initialQuery = await askQuestion('무엇을 조사하고 싶으신가요? ');
  const solutionContext = await askQuestion('분석할 IT 솔루션에 대한 간략한 설명을 입력해주세요 (선택 사항, 없으면 Enter): ');

  // Get breath and depth parameters
  const breadth =
    parseInt(
      await askQuestion(
        '조사 너비(하위 주제 수)를 입력하세요 (권장 3-7, 기본 6): ',
      ),
      10,
    ) || 6;
  const depth =
    parseInt(
      await askQuestion('조사 깊이(단계)를 입력하세요 (권장 1-3, 기본 2): '),
      10,
    ) || 2;
  const isReport =
    (await askQuestion(
      '상세 보고서를 생성하시겠습니까, 아니면 특정 답변을 원하십니까? (보고서/답변, 기본 보고서): ',
    )) !== '답변';

  let combinedQuery = initialQuery;
  if (isReport) {
    log(`Creating research plan...`);

    // Generate follow-up questions
    const followUpQuestions = await generateFeedback({
      query: initialQuery,
    });

    log(
      '\n귀하의 연구 요구 사항을 더 잘 이해하기 위해 다음 후속 질문에 답변해 주십시오:',
    );

    // Collect answers to follow-up questions
    const answers: string[] = [];
    for (const question of followUpQuestions) {
      const answer = await askQuestion(`\n${question}\n답변: `);
      answers.push(answer);
    }

    // Combine all information for deep research
    combinedQuery = `
Initial Query: ${initialQuery}
Follow-up Questions and Answers:
${followUpQuestions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i]}`).join('\n')}
`;
  }

  log('\nStarting research...\n');

  const { learnings, visitedUrls, comprehensiveReport, reportPaths } = await deepResearch({
    solutionContext: solutionContext || undefined, // solutionContext가 빈 문자열이면 undefined로 전달
    query: combinedQuery,
    breadth,
    depth,
    initialQuery, // 원래 사용자 쿼리를 폴더명으로 사용
    originalDepth: depth, // 최초 depth 값 전달
  });

  log(`\n\nLearnings:\n\n${learnings.join('\n')}`);
  log(`\n\nVisited URLs (${visitedUrls.length}):\n\n${visitedUrls.join('\n')}`);
  log('Writing final report...');

  if (isReport) {
    const safeFileNameBase = initialQuery.replace(/[\/\?%\*:|<>".]/g, '').replace(/\s+/g, '_');
    if (comprehensiveReport) {
      console.log(`\n\n✅ Comprehensive Report Generated!`);
      console.log(`📁 Reports saved to: ${reportPaths?.join(', ')}`);
      console.log(`\n\n💡 Strategic Summary:\n\n${comprehensiveReport.substring(0, 1000)}...`);
    } else {
      console.log(`\n\n⚠️ Note: Comprehensive report generation was skipped or failed.`);
      console.log(`📚 Research data saved in: report/${safeFileNameBase}/`);
    }
  } else {
    const answer = await writeFinalAnswer({
      prompt: combinedQuery,
      learnings,
    });

    await fs.writeFile('answer.md', answer, 'utf-8');
    console.log(`\n\nFinal Answer:\n\n${answer}`);
    console.log('\nAnswer has been saved to answer.md');
  }

  rl.close();
}

run().catch(console.error);
