import {useState} from 'react'

import './App.css'
import {type Article, type DifficultyKey, getRandomWord, isCorrect, supportedDifficulties} from "./word-list.ts";
import {LastAnswerDiv} from "./components/LastAnswerDiv.tsx";
import {DifficultySelectionDiv} from "./components/DifficultySelectionDiv.tsx";
import {Footer} from "./components/Footer.tsx";
import type {Score} from "./state/Score.tsx";
import type {Challenge} from "./state/Challenge.tsx";
import {StreakIndicatorTable} from "./components/StreakIndicatorTable.tsx";

function initScoreSheet() : Map<DifficultyKey, Score> {
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

function chooseNewChallengeWord(currentWord: string, difficulty: DifficultyKey): string {
    let newChallengeWord = undefined
    do {
        newChallengeWord = getRandomWord(difficulty)
    } while (newChallengeWord === currentWord)
    return newChallengeWord
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
                            handleResponseButtonClicked("DER")
                        }}>
                    DER
                </button>
                <button type="button" className="response-button"
                        onClick={() => {
                            handleResponseButtonClicked("DAS")
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
