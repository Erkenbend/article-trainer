import type { Article } from "../word-list.ts";

export interface LastAnswer {
    readonly wasCorrect: boolean;
    readonly correctArticle: Article;
    readonly challengeWord: string;
}
