import {useState} from 'react'

import './App.css'
import {Article, getRandomWord, isCorrect} from "./word-list.ts";

const LOCALE = "en-DE";

interface Score {
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

function displayAsString(duration: number | null): string {
    return ((duration ?? 0) / 1000).toFixed(2)
}

function StreakIndicatorTable(props: { score: Score }) {
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
                ({displayAsString(score.currentStreakTimePerWord)}s/Wort)
            </td>
            <td className="best-streak">
                ({displayAsString(score.bestStreakTimePerWord)}s/Wort)
            </td>
        </tr>
        </tbody>
    </table>
}

function LastAnswerDiv(props: { lastAnswerCorrect: boolean | null }) {
    const {lastAnswerCorrect} = props
    if (lastAnswerCorrect == null) {
        return <div>&nbsp;</div>
    }
    if (lastAnswerCorrect) {
        return <div className="last-answer-status-correct">
            KORREKT!
        </div>
    }
    return <div className="last-answer-status-incorrect">
        INKORREKT!
    </div>
}

function App() {

    const [challengeWord, setChallengeWord] = useState<string>(chooseNewChallengeWord(""));
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
    const [score, updateScore] = useState<Score>({
        currentStreak: 0,
        currentStreakTimePerWord: null,
        startTimeCurrentStreak: performance.now(),
        bestStreak: 0,
        bestStreakTimePerWord: null
    });

    function chooseNewChallengeWord(currentWord: string): string {
        let newChallengeWord = undefined
        do {
            newChallengeWord = getRandomWord()
        } while (newChallengeWord === currentWord)
        return newChallengeWord
    }

    function handleResponseButtonClicked(article: Article) {
        const correctAnswer = isCorrect(article, challengeWord);
        setLastAnswerCorrect(() => correctAnswer)
        setChallengeWord(c => chooseNewChallengeWord(c))
        updateScore(s => {
            if (correctAnswer) {
                return {
                    ...s,
                    currentStreak: s.currentStreak + 1,
                    currentStreakTimePerWord: (performance.now() - s.startTimeCurrentStreak) / (s.currentStreak + 1)
                }
            }
            return {
                currentStreak: 0,
                currentStreakTimePerWord: null,
                startTimeCurrentStreak: performance.now(),
                bestStreak: streakBeaten(s) ? s.currentStreak : s.bestStreak,
                bestStreakTimePerWord: streakBeaten(s) ? s.currentStreakTimePerWord : s.bestStreakTimePerWord
            }
        })
    }

    function resetGame() {
        setLastAnswerCorrect(null)
        setChallengeWord(c => chooseNewChallengeWord(c))
        updateScore({
            ...score,
            currentStreak: 0,
            currentStreakTimePerWord: null,
            startTimeCurrentStreak: performance.now()
        })
    }

    return (
        <>
            <StreakIndicatorTable score={score}/>

            <div className="challenge-word">
                {challengeWord}
            </div>

            <div className="response-buttons">
                <button type="button" className="response-button"
                        onClick={() => {
                            handleResponseButtonClicked(Article.DER);
                        }}>
                    DER
                </button>
                <button type="button" className="response-button"
                        onClick={() => {
                            handleResponseButtonClicked(Article.DAS);
                        }}>
                    DAS
                </button>
            </div>

            <div className="last-answer">
                <LastAnswerDiv lastAnswerCorrect={lastAnswerCorrect}/>
            </div>

            <div className="reset-section">
                <button type="button" className="reset-button" onClick={() => {
                    resetGame()
                }}>
                    Zurücksetzen
                </button>
            </div>

            <div className="footer">
                <div className="build-timestamp">
                    Version: {new Date(BUILD_TIMESTAMP).toLocaleString(LOCALE)}
                </div>
                <div className="github-logo">
                    <a href="https://github.com/Erkenbend/article-trainer">
                        <img src="/github-mark-white.svg" alt="GitHub Logo" width="30px"/>
                    </a>
                </div>
            </div>
        </>
    )
}

export default App
