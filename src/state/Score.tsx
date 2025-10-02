import {type DifficultyKey, supportedDifficulties} from "../word-list.ts";

export interface Score {
    readonly currentStreak: number;
    readonly currentStreakTimePerWord: number | null;
    readonly startTimeCurrentStreak: number;
    readonly bestStreak: number;
    readonly bestStreakTimePerWord: number | null;
}

function streakBeaten(score: Score): boolean {
    if (score.currentStreak > score.bestStreak) {
        return true;
    }
    if (score.currentStreak < score.bestStreak) {
        return false;
    }
    if (score.currentStreakTimePerWord === null || score.bestStreakTimePerWord === null) {
        return false;
    }
    return score.currentStreakTimePerWord < score.bestStreakTimePerWord;
}

export function updateScore(s: Score, correctAnswer: boolean): Score {
    if (correctAnswer) {
        // only start computing streak time on second correct answer
        return s.currentStreak == 0 ?
            {
                ...s,
                currentStreak: s.currentStreak + 1,
                startTimeCurrentStreak: performance.now()
            } :
            {
                ...s,
                currentStreak: s.currentStreak + 1,
                currentStreakTimePerWord: (performance.now() - s.startTimeCurrentStreak) / s.currentStreak
            }
    }

    // save streak and reset on wrong answer
    return {
        currentStreak: 0,
        currentStreakTimePerWord: null,
        startTimeCurrentStreak: performance.now(),
        bestStreak: streakBeaten(s) ? s.currentStreak : s.bestStreak,
        bestStreakTimePerWord: streakBeaten(s) ? s.currentStreakTimePerWord : s.bestStreakTimePerWord
    }
}

export function initScoreSheet() : Map<DifficultyKey, Score> {
    const initialState = new Map<DifficultyKey, Score>();
    for (const difficultyKey of supportedDifficulties) {
        initialState.set(difficultyKey as DifficultyKey, {
            currentStreak: 0,
            currentStreakTimePerWord: null,
            startTimeCurrentStreak: performance.now(),
            bestStreak: 0,
            bestStreakTimePerWord: null
        })
    }
    return initialState;
}
