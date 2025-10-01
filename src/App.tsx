import {useState} from 'react'

import './App.css'
import {Article, getRandomWord, isCorrect, type DifficultyKey, supportedDifficulties, translateDifficulty} from "./word-list.ts";

const LOCALE = "en-DE";

interface Score {
    readonly currentStreak: number;
    readonly currentStreakTimePerWord: number | null;
    readonly startTimeCurrentStreak: number;
    readonly bestStreak: number;
    readonly bestStreakTimePerWord: number | null;
}

interface Challenge {
    readonly currentWord: string;
    readonly selectedDifficulty: DifficultyKey;
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
    // TODO: score per difficulty
    const [score, updateScore] = useState<Score>({
        currentStreak: 0,
        currentStreakTimePerWord: null,
        startTimeCurrentStreak: performance.now(),
        bestStreak: 0,
        bestStreakTimePerWord: null
    });
    const [challenge, updateChallenge] = useState<Challenge>({
        currentWord: chooseNewChallengeWord("", "ADRIEN"),
        selectedDifficulty: "ADRIEN"
    });

    function handleResponseButtonClicked(article: Article) {
        const correctAnswer = isCorrect(article, challenge.currentWord, challenge.selectedDifficulty);
        setLastAnswerCorrect(() => correctAnswer)
        updateChallenge(c => ({
            ...c,
            currentWord: chooseNewChallengeWord(c.currentWord, c.selectedDifficulty)
        }))
        updateScore(s => {
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
        })
    }

    function resetGame() {
        setLastAnswerCorrect(null)
        updateChallenge(c => ({
            ...c,
            currentWord: chooseNewChallengeWord(c.currentWord, c.selectedDifficulty)
        }))
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

            {/* TODO: extract to separate component */}
            <div className="difficulty-selection">
                <label>Wortliste:&nbsp;&nbsp;</label>
                <select
                    className="difficulty-selector"
                    value={challenge.selectedDifficulty}
                    onChange={e => {
                        console.log(e.target.value)
                        updateChallenge(c => ({
                            ...c,
                            selectedDifficulty: e.target.value as DifficultyKey
                        }))
                        resetGame()
                    }}
                >
                    {supportedDifficulties.map(key => (
                        <option key={key} value={key}>{translateDifficulty(key)}</option>
                    ))}

                    {/*<option value={IDifficulty.ADRIEN}>{IDifficulty.ADRIEN}</option>*/}
                    {/*<option value={IDifficulty.EASY}>{IDifficulty.EASY}</option>*/}
                    {/*<option value={IDifficulty.INTERMEDIATE}>{IDifficulty.INTERMEDIATE}</option>*/}
                    {/*<option value={IDifficulty.HARD}>{IDifficulty.HARD}</option>*/}

                    {/* TODO later: make the select block dynamic from enum values */}
                    {/*{getEnumKeys(Difficulty).map((key, index) => (*/}
                    {/*    // eslint-disable-next-line react-x/no-array-index-key*/}
                    {/*    <option key={index} value={key}>*/}
                    {/*        {Difficulty[key]}*/}
                    {/*    </option>*/}
                    {/*))}*/}
                </select>
            </div>

            <Footer/>
        </>
    )
}

export default App
