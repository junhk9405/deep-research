// src/api.ts
// ✅ providers.ts에서 이미 dotenv 로딩하므로 여기서는 제거

import cors from 'cors';
import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// 동적 import로 변경된 deepResearch
import { writeComprehensiveReport } from './comprehensive-report-generator';

const app = express();
const port = process.env.PORT || 3051;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function for consistent logging
function log(...args: any[]) {
  console.log(...args);
}

// 연구 세션 관리를 위한 인터페이스
interface ResearchSession {
  status: 'running' | 'completed' | 'error';
  progress?: {
    currentDepth: number;
    totalDepth: number;
    completedQueries: number;
    totalQueries: number;
    currentQuery?: string;
  };
  result?: any;
  error?: string;
  reportPaths?: string[];
  startTime: number;
}

// 진행중인 연구 세션들을 메모리에 저장
const sessions = new Map<string, ResearchSession>();

// API endpoint to run research
app.post('/api/research', async (req: Request, res: Response) => {
  try {
    const { query, depth = 2, breadth = 6 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    log('\nStarting research...\n');

    // 동적 import 사용
    const { deepResearch } = await import('./deep-research');
    
    const { learnings, visitedUrls } = await deepResearch({
      query,
      breadth,
      depth,
    });

    log(`\n\nLearnings:\n\n${learnings.join('\n')}`);
    log(
      `\n\nVisited URLs (${visitedUrls.length}):\n\n${visitedUrls.join('\n')}`,
    );

    return res.json({
      success: true,
      learnings,
      visitedUrls,
    });
  } catch (error: unknown) {
    console.error('Error in research API:', error);
    return res.status(500).json({
      error: 'An error occurred during research',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// generate report API
app.post('/api/generate-report', async (req: Request, res: Response) => {
  try {
    const { query, depth = 3, breadth = 3 } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    log('\n Starting research...\n');
    
    // 동적 import 사용
    const { deepResearch } = await import('./deep-research');
    
    const { learnings, visitedUrls } = await deepResearch({
      query,
      breadth,
      depth
    });
    
    log(`\n\nLearnings:\n\n${learnings.join('\n')}`);
    log(
      `\n\nVisited URLs (${visitedUrls.length}):\n\n${visitedUrls.join('\n')}`,
    );
    
    const report = await writeComprehensiveReport({
      prompt: query,
      learnings,
      visitedUrls
    });

    return res.json({ report });
    
  } catch (error: unknown) {
    console.error("Error in generate report API:", error);
    return res.status(500).json({
      error: 'An error occurred during research',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// 1. 연구 시작 API 엔드포인트
app.post('/api/research/start', async (req: Request, res: Response) => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { 
      query, 
      depth = 2, 
      breadth = 5, 
      solutionContext 
    } = req.body;

    // 입력 검증
    if (!query || typeof query !== 'string' || query.trim().length < 5) {
      return res.status(400).json({ 
        error: 'Query must be at least 5 characters long' 
      });
    }

    if (depth < 1 || depth > 3) {
      return res.status(400).json({ 
        error: 'Depth must be between 1 and 3' 
      });
    }

    if (breadth < 3 || breadth > 10) {
      return res.status(400).json({ 
        error: 'Breadth must be between 3 and 10' 
      });
    }

    // 세션 초기화
    sessions.set(sessionId, { 
      status: 'running',
      startTime: Date.now()
    });

    console.log(`🚀 Starting research session: ${sessionId}`);
    console.log(`📝 Query: ${query}`);
    console.log(`⚙️ Depth: ${depth}, Breadth: ${breadth}`);

    // 클라이언트에게 즉시 응답
    res.json({ 
      sessionId, 
      status: 'started',
      message: 'Research started successfully'
    });

    // 백그라운드에서 연구 시작
    runResearchInBackground(sessionId, query.trim(), { 
      depth, 
      breadth, 
      solutionContext: solutionContext?.trim() || undefined 
    });

  } catch (error) {
    console.error('❌ Error starting research:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 2. 연구 진행상황 조회 API 엔드포인트
app.get('/api/research/status/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        message: 'The session may have expired or never existed'
      });
    }

    const response = {
      sessionId,
      status: session.status,
      progress: session.progress,
      error: session.error,
      reportPaths: session.reportPaths?.map(path => ({
        filename: path.split(/[/\\]/).pop(),
        fullPath: path
      })),
      elapsedTime: Date.now() - session.startTime
    };

    res.json(response);

  } catch (error) {
    console.error('❌ Error getting session status:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// 3. 파일 다운로드 API 엔드포인트
app.get('/api/research/download/:sessionId/:filename', (req: Request, res: Response) => {
  try {
    const { sessionId, filename } = req.params;
    
    if (!sessionId || !filename) {
      return res.status(400).json({ 
        error: 'Session ID and filename are required' 
      });
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ 
        error: 'Research not completed yet' 
      });
    }

    if (!session.reportPaths || session.reportPaths.length === 0) {
      return res.status(404).json({ 
        error: 'No reports available' 
      });
    }

    const requestedFile = session.reportPaths.find(filePath => {
      const actualFilename = path.basename(filePath);
      return actualFilename === filename;
    });

    if (!requestedFile) {
      return res.status(404).json({ 
        error: 'File not found',
        availableFiles: session.reportPaths.map(p => path.basename(p))
      });
    }

    if (!fs.existsSync(requestedFile)) {
      return res.status(404).json({ 
        error: 'File not found on disk' 
      });
    }

    console.log(`📥 Downloading file: ${filename} for session: ${sessionId}`);

    res.download(requestedFile, filename, (err) => {
      if (err) {
        console.error('❌ Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      } else {
        console.log(`✅ File downloaded successfully: ${filename}`);
      }
    });

  } catch (error) {
    console.error('❌ Error downloading file:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
});

// 4. 세션 취소 API
app.delete('/api/research/cancel/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status === 'running') {
      session.status = 'error';
      session.error = 'Cancelled by user';
      sessions.set(sessionId, session);
    }

    res.json({ message: 'Session cancelled successfully' });

  } catch (error) {
    console.error('❌ Error cancelling session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 백그라운드 연구 실행 함수
async function runResearchInBackground(
  sessionId: string, 
  query: string, 
  options: { depth: number; breadth: number; solutionContext?: string }
) {
  const session = sessions.get(sessionId);
  if (!session) return;

  try {
    console.log(`🔬 Starting deep research for session: ${sessionId}`);
    
    // 동적 import 사용
    const { deepResearch } = await import('./deep-research');
    
    const result = await deepResearch({
      query,
      depth: options.depth,
      breadth: options.breadth,
      solutionContext: options.solutionContext,
      initialQuery: query,
      originalDepth: options.depth,
      onProgress: (progress) => {
        const updatedSession = sessions.get(sessionId);
        if (updatedSession && updatedSession.status === 'running') {
          updatedSession.progress = progress;
          sessions.set(sessionId, updatedSession);
          
          console.log(`📊 Session ${sessionId} progress: ${progress.completedQueries}/${progress.totalQueries} queries completed`);
        }
      }
    });

    const updatedSession = sessions.get(sessionId);
    if (updatedSession) {
      updatedSession.status = 'completed';
      updatedSession.result = result;
      updatedSession.reportPaths = result.reportPaths || [];
      sessions.set(sessionId, updatedSession);
      
      console.log(`✅ Research completed for session: ${sessionId}`);
      console.log(`📄 Generated ${result.reportPaths?.length || 0} report files`);
    }

  } catch (error) {
    console.error(`❌ Research failed for session ${sessionId}:`, error);
    
    const updatedSession = sessions.get(sessionId);
    if (updatedSession) {
      updatedSession.status = 'error';
      updatedSession.error = error instanceof Error ? error.message : 'Unknown error occurred';
      sessions.set(sessionId, updatedSession);
    }
  }
}

// 세션 정리 함수
function cleanupOldSessions() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;
  let cleanedCount = 0;

  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.startTime > maxAge) {
      sessions.delete(sessionId);
      cleanedCount++;
      console.log(`🧹 Cleaned up old session: ${sessionId}`);
    }
  }

  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} old sessions`);
  }
}

setInterval(cleanupOldSessions, 60 * 60 * 1000);

// 서버 시작
app.listen(port, () => {
  console.log(`🚀 Deep Research API server running on port ${port}`);
  console.log(`📊 Session management: In-memory storage (24h TTL)`);
  console.log(`🔗 Available endpoints:`);
  console.log(`   POST /api/research/start`);
  console.log(`   GET  /api/research/status/:sessionId`);
  console.log(`   GET  /api/research/download/:sessionId/:filename`);
  console.log(`   DELETE /api/research/cancel/:sessionId`);
});

export default app;