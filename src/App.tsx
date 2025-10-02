import {useState} from 'react'

import './App.css'
import {type Article, type DifficultyKey, isCorrect} from "./word-list.ts";
import {LastAnswerDiv} from "./components/LastAnswerDiv.tsx";
import {DifficultySelectionDiv} from "./components/DifficultySelectionDiv.tsx";
import {Footer} from "./components/Footer.tsx";
import {initScoreSheet, type Score, updateScore} from "./state/Score.tsx";
import {type Challenge, chooseNewChallengeWord, initChallenge} from "./state/Challenge.tsx";
import {StreakIndicatorTable} from "./components/StreakIndicatorTable.tsx";

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
