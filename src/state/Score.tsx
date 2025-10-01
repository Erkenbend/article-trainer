export interface Score {
    readonly currentStreak: number;
    readonly currentStreakTimePerWord: number | null;
    readonly startTimeCurrentStreak: number;
    readonly bestStreak: number;
    readonly bestStreakTimePerWord: number | null;
}
