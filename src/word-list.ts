export enum Article {
    DER,
    DAS,
}

const wordsWithDer = [
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
]

const wordsWithDas = [
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
]

export const SOLUTIONS = computeSolutions();

function computeSolutions() {
    const map = new Map<string, Article>()
    for (const wordWithDer of wordsWithDer) {
        map.set(wordWithDer, Article.DER)
    }
    for (const wordWithDas of wordsWithDas) {
        map.set(wordWithDas, Article.DAS)
    }
    return map;
}
