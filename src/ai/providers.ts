import { createFireworks } from '@ai-sdk/fireworks';
import { createOpenAI } from '@ai-sdk/openai';
import {
  extractReasoningMiddleware,
  LanguageModelV1,
  wrapLanguageModel,
} from 'ai';
import { getEncoding } from 'js-tiktoken';

import { RecursiveCharacterTextSplitter } from './text-splitter';

// Providers
const openai = process.env.OPENAI_KEY
  ? createOpenAI({
      apiKey: process.env.OPENAI_KEY,
      baseURL: process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1',
    })
  : undefined;

const fireworks = process.env.FIREWORKS_KEY
  ? createFireworks({
      apiKey: process.env.FIREWORKS_KEY,
    })
  : undefined;

const customModel = process.env.CUSTOM_MODEL
  ? openai?.(process.env.CUSTOM_MODEL, {
      structuredOutputs: true,
    })
  : undefined;

// Models

const o3MiniModel = openai?.('o3-2025-04-16', {
  structuredOutputs: true,
})

const deepSeekR1Model = fireworks
  ? wrapLanguageModel({
      model: fireworks(
        'accounts/fireworks/models/deepseek-r1',
      ) as LanguageModelV1,
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    })
  : undefined;

export function getModel(): LanguageModelV1 {
  if (customModel) {
    return customModel;
  }

  const model = deepSeekR1Model ?? o3MiniModel;
  if (!model) {
    throw new Error('No model found');
  }

  return model as LanguageModelV1;
}

// 함수별 모델 선택 함수들
export function getModelSafely(preferredModel: string): LanguageModelV1 {
  try {
    if (!openai) {
      console.warn('OpenAI provider not available, falling back to default');
      return getModel();
    }
    return openai(preferredModel, { structuredOutputs: true });
  } catch (error) {
    console.warn(`Failed to load ${preferredModel}, falling back to default:`, error);
    return getModel();
  }
}

export function getQueryModel(): LanguageModelV1 {
  const queryModelName = process.env.QUERY_MODEL || 'gpt-4.1-mini-2025-04-14';
  return getModelSafely(queryModelName);
}

export function getResearchModel(): LanguageModelV1 {
  const researchModelName = process.env.RESEARCH_MODEL || 'gpt-4.1-mini-2025-04-14';
  return getModelSafely(researchModelName);
}

export function getReportModel(): LanguageModelV1 {
  // 최종 보고서용은 항상 o3 모델 사용
  const reportModelName = process.env.REPORT_MODEL || 'o3-2025-04-16';
  if (reportModelName === 'o3-2025-04-16' && o3MiniModel) {
    return o3MiniModel;
  }
  return getModelSafely(reportModelName);
}

export function getAnswerModel(): LanguageModelV1 {
  const answerModelName = process.env.ANSWER_MODEL || 'gpt-4.1-mini-2025-04-14';
  return getModelSafely(answerModelName);
}

const MinChunkSize = 140;
const encoder = getEncoding('o200k_base');

// trim prompt to maximum context size
export function trimPrompt(
  prompt: string,
  contextSize = Number(process.env.CONTEXT_SIZE) || 128_000,
) {
  if (!prompt) {
    return '';
  }

  const length = encoder.encode(prompt).length;
  if (length <= contextSize) {
    return prompt;
  }

  const overflowTokens = length - contextSize;
  // on average it's 3 characters per token, so multiply by 3 to get a rough estimate of the number of characters
  const chunkSize = prompt.length - overflowTokens * 3;
  if (chunkSize < MinChunkSize) {
    return prompt.slice(0, MinChunkSize);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: 0,
  });
  const trimmedPrompt = splitter.splitText(prompt)[0] ?? '';

  // last catch, there's a chance that the trimmed prompt is same length as the original prompt, due to how tokens are split & innerworkings of the splitter, handle this case by just doing a hard cut
  if (trimmedPrompt.length === prompt.length) {
    return trimPrompt(prompt.slice(0, chunkSize), contextSize);
  }

  // recursively trim until the prompt is within the context size
  return trimPrompt(trimmedPrompt, contextSize);
}
