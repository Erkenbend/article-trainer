import type { Article } from "../word-list.ts";

export interface LastAnswer {
    readonly wasCorrect: boolean | null;
    readonly correctArticle: Article | null;
    readonly challengeWord: string | null;
}

export function initLastAnswer(): LastAnswer {
    return {
        wasCorrect: null,
        correctArticle: null,
        challengeWord: null
    };
}
