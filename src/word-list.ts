export enum Article {
    DER,
    DAS,
}

const wordLists = new Map<Article, string[]>([
    [Article.DER, [
        "Effekt",
        "Aspekt",
        "Bär",
        "Brunnen",
        "Kontrabass",
        "Balkon",
        "Ärger",
        "Erker",
        "Geist",
        "Quatsch",
        "Quark",
        "Grad",
        "Moment",
        "Grieß",
        "Buchstabe",
        "Akku",
        "Knoten",
        "Garten",
        "Zweck",
        "Ast",
        "Brei",
        "Rest",
        "Strohhalm",
        "Biss",
        "Magnet",
        "Fleck",
        "Rachen",
        "Aspekt",
        "Kürbis",
        "Abend",
        "Streak",
        "Gürtel",
        "Geschmack",
        "Planet",
        "Typ",
    ]],
    [Article.DAS, [
        "Geschlecht",
        "Tor",
        "Heim",
        "Getriebe",
        "Kraut",
        "Monster",
        "Gespenst",
        "Gespinst",
        "Gummi",
        "Knie",
        "Dorf",
        "Kabel",
        "Volumen",
        "Stroh",
        "Schaf",
        "Aua",
        "Pulver",
        "Protokoll",
        "Maß",
        "Klo",
        "Gerät",
        "Prinzip",
        "Verfahren",
    ]]
]);


export function getRandomWord(): string {
    const wordList = wordLists.get(Math.random() < 0.5 ? Article.DER : Article.DAS);
    if (!wordList) {
        console.warn("List of words not found!")
        return "";
    }
    return wordList[Math.floor(Math.random() * wordList.length)];
}

export function isCorrect(guessedArticle: Article, challengeWord: string): boolean {
    return wordLists.get(guessedArticle)?.includes(challengeWord) ?? false;
}
