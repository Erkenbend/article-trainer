import type {Score} from "../state/Score.tsx";

function displayAsString(duration: number | null): string {
    return duration === null ? '-' : (duration / 1000).toFixed(2);
}

export function StreakIndicatorTable(props: { score: Score }) {
    const {score} = props

    return <table className="streak-indicator">
        <thead>
        <tr>
            <th className="current-streak">Aktuell</th>
            <th className="best-streak">Rekord</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td className="current-streak">
                Streak: {score.currentStreak}
            </td>
            <td className="best-streak">
                Streak: {score.bestStreak}
            </td>
        </tr>
        <tr>
            <td className="current-streak">
                ({displayAsString(score.currentStreakTimePerWord)} s/Wort)
            </td>
            <td className="best-streak">
                ({displayAsString(score.bestStreakTimePerWord)} s/Wort)
            </td>
        </tr>
        </tbody>
    </table>
}