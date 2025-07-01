// src/ai/providers.ts
// ✅ 1. 가장 먼저 환경 변수 로딩
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createFireworks } from '@ai-sdk/fireworks';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import {
  extractReasoningMiddleware,
  LanguageModelV1,
  wrapLanguageModel,
} from 'ai';
import { getEncoding } from 'js-tiktoken';

import { RecursiveCharacterTextSplitter } from './text-splitter';

// 환경 변수명 통일 및 fallback 추가
const OPENAI_API_KEY = process.env.OPENAI_KEY || process.env.OPENAI_API_KEY;
const FIREWORKS_API_KEY = process.env.FIREWORKS_KEY || process.env.FIREWORKS_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY;

console.log('🔑 API Keys status:');
console.log('  OPENAI:', !!OPENAI_API_KEY, OPENAI_API_KEY?.substring(0, 10) + '...');
console.log('  FIREWORKS:', !!FIREWORKS_API_KEY);
console.log('  ANTHROPIC:', !!ANTHROPIC_API_KEY);

// Providers
const openai = OPENAI_API_KEY
  ? createOpenAI({
      apiKey: OPENAI_API_KEY,
      baseURL: process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1',
    })
  : undefined;

const fireworks = FIREWORKS_API_KEY
  ? createFireworks({
      apiKey: FIREWORKS_API_KEY,
    })
  : undefined;

const anthropic = ANTHROPIC_API_KEY
  ? createAnthropic({
      apiKey: ANTHROPIC_API_KEY,
    })
  : undefined;

const customModel = process.env.CUSTOM_MODEL && openai
  ? openai(process.env.CUSTOM_MODEL, {
      structuredOutputs: true,
    })
  : undefined;

// Models with better fallback
const claudeSonnet4Model = anthropic?.('claude-sonnet-4-20250514');

const o3MiniModel = openai?.('o3-2025-04-16', {
  structuredOutputs: true,
});

// 기본 GPT 모델들 추가 (더 안정적)
const gpt4Model = openai?.('gpt-4o-mini', {
  structuredOutputs: true,
});

const gpt35Model = openai?.('gpt-3.5-turbo', {
  structuredOutputs: true,
});

const deepSeekR1Model = fireworks
  ? wrapLanguageModel({
      model: fireworks(
        'accounts/fireworks/models/deepseek-r1',
      ) as LanguageModelV1,
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    })
  : undefined;

export function getModel(): LanguageModelV1 {
  console.log('🎯 getModel() called');
  
  if (customModel) {
    console.log('✅ Using custom model:', process.env.CUSTOM_MODEL);
    return customModel;
  }

  // 사용 가능한 모델 우선순위 체크
  const models = [
    { model: deepSeekR1Model, name: 'DeepSeek R1' },
    { model: o3MiniModel, name: 'O3 Mini' },
    { model: claudeSonnet4Model, name: 'Claude Sonnet 4' },
    { model: gpt4Model, name: 'GPT-4o Mini' },
    { model: gpt35Model, name: 'GPT-3.5 Turbo' }
  ];

  for (const { model, name } of models) {
    if (model) {
      console.log(`✅ Using model: ${name}`);
      return model as LanguageModelV1;
    }
  }

  // 모든 모델이 실패한 경우 더 상세한 오류 메시지
  const errorDetails = {
    openaiKey: !!OPENAI_API_KEY,
    fireworksKey: !!FIREWORKS_API_KEY,
    anthropicKey: !!ANTHROPIC_API_KEY,
    openaiProvider: !!openai,
    fireworksProvider: !!fireworks,
    anthropicProvider: !!anthropic
  };
  
  console.error('❌ No model available. Details:', errorDetails);
  throw new Error(`No model found. Please check your API keys. Status: ${JSON.stringify(errorDetails)}`);
}

export function getModelSafely(preferredModel: string): LanguageModelV1 {
  console.log(`🎯 getModelSafely() called with: ${preferredModel}`);
  
  try {
    // Claude 모델 처리
    if (preferredModel.startsWith('claude-')) {
      if (!anthropic) {
        console.warn('Anthropic provider not available, falling back to default');
        return getModel();
      }
      console.log(`✅ Using Claude model: ${preferredModel}`);
      return anthropic(preferredModel) as LanguageModelV1;
    }
    
    // OpenAI 모델 처리
    if (!openai) {
      console.warn('OpenAI provider not available, falling back to default');
      return getModel();
    }
    
    console.log(`✅ Using OpenAI model: ${preferredModel}`);
    return openai(preferredModel, { structuredOutputs: true });
    
  } catch (error) {
    console.warn(`Failed to load ${preferredModel}, falling back to default:`, error);
    return getModel();
  }
}

// 모델별 함수들 - 더 안전한 fallback 적용
export function getQueryModel(): LanguageModelV1 {
  const queryModelName = process.env.QUERY_MODEL || 'gpt-4o-mini';
  console.log(`🎯 getQueryModel() using: ${queryModelName}`);
  return getModelSafely(queryModelName);
}

export function getResearchModel(): LanguageModelV1 {
  const researchModelName = process.env.RESEARCH_MODEL || 'gpt-4o-mini';
  console.log(`🎯 getResearchModel() using: ${researchModelName}`);
  return getModelSafely(researchModelName);
}

export function getReportModel(): LanguageModelV1 {
  const reportModelName = process.env.REPORT_MODEL || 'gpt-4o-mini';
  console.log(`🎯 getReportModel() using: ${reportModelName}`);
  
  // O3 모델 우선 시도
  if (reportModelName === 'o3-2025-04-16' && o3MiniModel) {
    console.log('✅ Using O3 Mini for reports');
    return o3MiniModel;
  }
  
  return getModelSafely(reportModelName);
}

export function getAnswerModel(): LanguageModelV1 {
  const answerModelName = process.env.ANSWER_MODEL || 'gpt-4o-mini';
  console.log(`🎯 getAnswerModel() using: ${answerModelName}`);
  return getModelSafely(answerModelName);
}

// 나머지 함수들
const MinChunkSize = 140;
const encoder = getEncoding('o200k_base');

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
  const chunkSize = prompt.length - overflowTokens * 3;
  if (chunkSize < MinChunkSize) {
    return prompt.slice(0, MinChunkSize);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: 0,
  });
  const trimmedPrompt = splitter.splitText(prompt)[0] ?? '';

  if (trimmedPrompt.length === prompt.length) {
    return trimPrompt(prompt.slice(0, chunkSize), contextSize);
  }

  return trimPrompt(trimmedPrompt, contextSize);
}

export async function generateObjectSafely({
  model,
  system,
  prompt,
  schema,
  maxTokens,
  temperature
}: {
  model: LanguageModelV1;
  system: string;
  prompt: string;
  schema: any;
  maxTokens?: number;
  temperature?: number;
}): Promise<{ report: string }> {
  
  const isClaudeModel = model.modelId.includes('claude');
  
  if (isClaudeModel) {
    const { generateText } = await import('ai');
    const result = await generateText({
      model,
      system,
      prompt,
      maxTokens: maxTokens || 16000,
      temperature: temperature || 0.7,
    });
    
    return { report: result.text };
    
  } else {
    const { generateObject } = await import('ai');
    const result = await generateObject({
      model,
      system,
      prompt,
      schema,
      temperature,
    });
    
    return result.object as { report: string };
  }
}