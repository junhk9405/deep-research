interface TextSplitterParams {
    chunkSize: number;
    chunkOverlap: number;
}
declare abstract class TextSplitter implements TextSplitterParams {
    chunkSize: number;
    chunkOverlap: number;
    constructor(fields?: Partial<TextSplitterParams>);
    abstract splitText(text: string): string[];
    createDocuments(texts: string[]): string[];
    splitDocuments(documents: string[]): string[];
    private joinDocs;
    mergeSplits(splits: string[], separator: string): string[];
}
export interface RecursiveCharacterTextSplitterParams extends TextSplitterParams {
    separators: string[];
}
export declare class RecursiveCharacterTextSplitter extends TextSplitter implements RecursiveCharacterTextSplitterParams {
    separators: string[];
    constructor(fields?: Partial<RecursiveCharacterTextSplitterParams>);
    splitText(text: string): string[];
}
export {};
//# sourceMappingURL=text-splitter.d.ts.map