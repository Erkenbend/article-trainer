import type { LastAnswer } from "../state/LastAnswer"

export function LastAnswerDiv(props: { lastAnswer: LastAnswer }) {
    const { lastAnswer } = props
    if (lastAnswer.wasCorrect == null) {
        return <div className="last-answer">&nbsp;<br />&nbsp;</div>
    }
    if (lastAnswer.wasCorrect) {
        return <div className="last-answer">
            <div className="last-answer-status-correct">
                KORREKT!
            </div>
            <div className="last-answer-correction">
                &nbsp;
            </div>
        </div>
    }

    return <div className="last-answer">
        <div className="last-answer-status-incorrect">
            INKORREKT!
        </div>
        <div className="last-answer-correction">
            {capitalize(lastAnswer.correctArticle)} {lastAnswer.challengeWord}
        </div>
    </div>
}

function capitalize(s: string | null): string {
    if (s === null || s.length == 0) {
        return "";
    }
    return s[0].toLocaleUpperCase() + s.slice(1).toLocaleLowerCase();
}
