import {useState} from 'react'

import './App.css'
import {Article, getRandomWord, isCorrect} from "./word-list.ts";

const LOCALE = "en-DE";

interface Score {
    readonly currentStreak: number;
    readonly startTimeCurrentStreak: number;
    readonly bestStreak: number;
    readonly bestStreakTimePerWord: number;
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
        startTimeCurrentStreak: performance.now(),
        bestStreak: 0,
        bestStreakTimePerWord: 0
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
                    bestStreak: s.bestStreak
                }
            }
            return {
                currentStreak: 0,
                startTimeCurrentStreak: performance.now(),
                bestStreak: Math.max(s.currentStreak, s.bestStreak),
                bestStreakTimePerWord: s.currentStreak > s.bestStreak ? (performance.now() - s.startTimeCurrentStreak) / s.currentStreak : s.bestStreakTimePerWord
            }
        })
    }

    function resetGame() {
        setLastAnswerCorrect(null)
        setChallengeWord(c => chooseNewChallengeWord(c))
        updateScore({...score, currentStreak: 0, startTimeCurrentStreak: performance.now()})
    }

    return (
        <>
            <table className="streak-indicator">
                <tbody>
                <tr>
                    <td className="current-streak">
                        Aktueller Streak: {score.currentStreak}
                    </td>
                    <td className="best-streak">
                        Bester Streak: {score.bestStreak}
                    </td>
                </tr>
                <tr>
                    <td/>
                    <td className="best-streak-time">
                        Zeit pro Wort: {(score.bestStreakTimePerWord / 1000).toFixed(2)}s
                    </td>
                </tr>
                </tbody>
            </table>

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
