export type ResearchProgress = {
    currentDepth: number;
    totalDepth: number;
    currentBreadth: number;
    totalBreadth: number;
    currentQuery?: string;
    totalQueries: number;
    completedQueries: number;
};
type ResearchResult = {
    learnings: string[];
    visitedUrls: string[];
};
export declare function writeFinalReport({ prompt, learnings, visitedUrls, }: {
    prompt: string;
    learnings: string[];
    visitedUrls: string[];
}): Promise<string>;
export declare function writeFinalAnswer({ prompt, learnings, }: {
    prompt: string;
    learnings: string[];
}): Promise<string>;
export declare function deepResearch({ query, breadth, depth, learnings, visitedUrls, onProgress, }: {
    query: string;
    breadth: number;
    depth: number;
    learnings?: string[];
    visitedUrls?: string[];
    onProgress?: (progress: ResearchProgress) => void;
}): Promise<ResearchResult>;
export {};
//# sourceMappingURL=deep-research.d.ts.map