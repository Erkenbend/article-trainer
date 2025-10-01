import type {DifficultyKey} from "../word-list.ts";

export interface Challenge {
    readonly currentWord: string;
    readonly selectedDifficulty: DifficultyKey;
}
