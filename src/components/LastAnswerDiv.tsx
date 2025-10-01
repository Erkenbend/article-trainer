export function LastAnswerDiv(props: { lastAnswerCorrect: boolean | null }) {
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
