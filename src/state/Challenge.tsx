import { type Article, type DifficultyKey, getRandomWord } from "../word-list.ts";

export interface Challenge {
    readonly currentWord: string;
    readonly expectedArticle: Article;
    readonly selectedDifficulty: DifficultyKey;
}

export function chooseNewChallengeWord(currentWord: string, difficulty: DifficultyKey): { word: string, article: Article } {
    let newChallengeWord = { word: "", article: 'DER' as Article }
    do {
        newChallengeWord = getRandomWord(difficulty)
    } while (newChallengeWord.word === currentWord)
    return newChallengeWord;
}

export function initChallenge(): Challenge {
    const newChallengeWord = chooseNewChallengeWord("", "ADRIEN");
    return {
        currentWord: newChallengeWord.word,
        expectedArticle: newChallengeWord.article,
        selectedDifficulty: "ADRIEN",
    }
}
