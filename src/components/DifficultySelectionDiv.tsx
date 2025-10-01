import {type DifficultyKey, supportedDifficulties, translateDifficulty} from "../word-list.ts";

export function DifficultySelectionDiv(props: {
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
