import {type DifficultyKey, getRandomWord} from "../word-list.ts";

export interface Challenge {
    readonly currentWord: string;
    readonly selectedDifficulty: DifficultyKey;
}

export function chooseNewChallengeWord(currentWord: string, difficulty: DifficultyKey): string {
    let newChallengeWord = undefined
    do {
        newChallengeWord = getRandomWord(difficulty)
    } while (newChallengeWord === currentWord)
    return newChallengeWord
}

export function initChallenge() {
    return {
        currentWord: chooseNewChallengeWord("", "ADRIEN"),
        selectedDifficulty: "ADRIEN" as DifficultyKey,
    }
}
