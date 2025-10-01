import {useState} from 'react'

import './App.css'
import {
    Article,
    type DifficultyKey,
    getRandomWord,
    isCorrect,
    supportedDifficulties,
    translateDifficulty
} from "./word-list.ts";

const LOCALE = "en-DE";

interface Score {
    readonly currentStreak: number;
    readonly currentStreakTimePerWord: number | null;
    readonly startTimeCurrentStreak: number;
    readonly bestStreak: number;
    readonly bestStreakTimePerWord: number | null;
}

function initScoreSheet() {
    const initialState = new Map<DifficultyKey, Score>();
    for (const difficultyKey of supportedDifficulties) {
        initialState.set(difficultyKey, {
            currentStreak: 0,
            currentStreakTimePerWord: null,
            startTimeCurrentStreak: performance.now(),
            bestStreak: 0,
            bestStreakTimePerWord: null
        })
    }
    return initialState;
}

interface Challenge {
    readonly currentWord: string;
    readonly selectedDifficulty: DifficultyKey;
}

function initChallenge() {
    return {
        currentWord: chooseNewChallengeWord("", "ADRIEN"),
        selectedDifficulty: "ADRIEN" as DifficultyKey,
    }
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

function updateScore(s: Score, correctAnswer: boolean): Score {
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

function displayAsString(duration: number | null): string {
    return duration === null ? '-' : (duration / 1000).toFixed(2);
}

function chooseNewChallengeWord(currentWord: string, difficulty: DifficultyKey): string {
    let newChallengeWord = undefined
    do {
        newChallengeWord = getRandomWord(difficulty)
    } while (newChallengeWord === currentWord)
    return newChallengeWord
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
                ({displayAsString(score.currentStreakTimePerWord)} s/Wort)
            </td>
            <td className="best-streak">
                ({displayAsString(score.bestStreakTimePerWord)} s/Wort)
            </td>
        </tr>
        </tbody>
    </table>
}

function LastAnswerDiv(props: { lastAnswerCorrect: boolean | null }) {
    const {lastAnswerCorrect} = props
    if (lastAnswerCorrect == null) {
        return <div className="last-answer">&nbsp;</div>
    }
    if (lastAnswerCorrect) {
        return <div className="last-answer">
            <div className="last-answer-status-correct">
                KORREKT!
            </div>
        </div>
    }
    return <div className="last-answer">
        <div className="last-answer-status-incorrect">
            INKORREKT!
        </div>
    </div>
}

function DifficultySelectionDiv(props: {
    selectedDifficulty: DifficultyKey,
    onChange: (difficulty: DifficultyKey) => void
}) {
    const {selectedDifficulty, onChange} = props
    return <div className="difficulty-selection">
        <label>Wortliste:&nbsp;&nbsp;</label>
        <select
            className="difficulty-selector"
            value={selectedDifficulty}
            onChange={e => {
                onChange(e.target.value as DifficultyKey);
            }}
        >
            {supportedDifficulties.map(key => (
                <option key={key} value={key}>{translateDifficulty(key)}</option>
            ))}
        </select>
    </div>
}

function Footer() {
    return <div className="footer">
        <div className="build-timestamp">
            Version: {new Date(BUILD_TIMESTAMP).toLocaleString(LOCALE)}
        </div>
        <div className="github-logo">
            <a href="https://github.com/Erkenbend/article-trainer">
                <img src="/github-mark-white.svg" alt="GitHub Logo" width="30px"/>
            </a>
        </div>
    </div>
}

function App() {

    const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
    const [scoreSheet, updateScoreSheet] = useState<Map<DifficultyKey, Score>>(initScoreSheet);
    const [challenge, updateChallenge] = useState<Challenge>(initChallenge);

    function handleResponseButtonClicked(article: Article) {
        const correctAnswer = isCorrect(article, challenge.currentWord, challenge.selectedDifficulty);
        setLastAnswerCorrect(() => correctAnswer)
        updateChallenge(c => ({
            ...c,
            currentWord: chooseNewChallengeWord(c.currentWord, c.selectedDifficulty)
        }))
        updateScoreSheet(s => {
            const updatedScoreSheet = new Map(s)
            updatedScoreSheet.set(
                challenge.selectedDifficulty,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                updateScore(updatedScoreSheet.get(challenge.selectedDifficulty)!, correctAnswer)
            )
            return updatedScoreSheet;
        })
    }

    function resetGame() {
        setLastAnswerCorrect(null)
        updateChallenge(c => ({
            ...c,
            currentWord: chooseNewChallengeWord(c.currentWord, c.selectedDifficulty)
        }))
        updateScoreSheet(
            s => {
                const updatedScoreSheet = new Map(s)
                updatedScoreSheet.set(
                    challenge.selectedDifficulty,
                    {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        ...updatedScoreSheet.get(challenge.selectedDifficulty)!,
                        currentStreak: 0,
                        currentStreakTimePerWord: null,
                        startTimeCurrentStreak: performance.now()
                    })
                return updatedScoreSheet;
            })
    }

    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <StreakIndicatorTable score={scoreSheet.get(challenge.selectedDifficulty)!}/>

            <div className="challenge-word">
                {challenge.currentWord}
            </div>

            <div className="response-buttons">
                <button type="button" className="response-button"
                        onClick={() => {
                            handleResponseButtonClicked(Article.DER)
                        }}>
                    DER
                </button>
                <button type="button" className="response-button"
                        onClick={() => {
                            handleResponseButtonClicked(Article.DAS)
                        }}>
                    DAS
                </button>
            </div>

            <LastAnswerDiv lastAnswerCorrect={lastAnswerCorrect}/>

            <div className="reset-section">
                <button type="button" className="reset-button" onClick={resetGame}>Zurücksetzen</button>
            </div>

            <DifficultySelectionDiv
                selectedDifficulty={challenge.selectedDifficulty}
                onChange={(newValue: DifficultyKey) => {
                    updateChallenge(c => ({...c, selectedDifficulty: newValue}))
                    resetGame()
                }}
            />

            <Footer/>
        </>
    )
}

export default App
