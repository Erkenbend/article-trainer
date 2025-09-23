import {useState} from 'react'

import './App.css'
import {Article, SOLUTIONS} from "./word-list.ts";

const LOCALE = "en-DE";

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

    function chooseNewChallengeWord(currentWord: string): string {
        let newChallengeWord = undefined
        do {
            newChallengeWord = Array.from(SOLUTIONS.keys())[Math.floor(Math.random() * SOLUTIONS.size)]
        } while (newChallengeWord === currentWord)
        return newChallengeWord
    }

    function handleResponseButtonClicked(article: Article) {
        setLastAnswerCorrect(() => {
            return SOLUTIONS.get(challengeWord) == article
        })
        setChallengeWord(c => chooseNewChallengeWord(c))
    }

    return (
        <>
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

            <div className="footer">
                <div className="build-timestamp">
                    Build timestamp: {new Date(BUILD_TIMESTAMP).toLocaleString(LOCALE)}
                </div>
                <div className="github-logo">
                    <a href="https://github.com/Erkenbend/article-trainer">
                        <img src="/github-mark-white.svg" alt="GitHub Logo" width="40px"/>
                    </a>
                </div>
            </div>
        </>
    )
}

export default App
