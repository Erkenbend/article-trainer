all_words=$(curl -s -X GET https://raw.githubusercontent.com/vbvss199/Language-Learning-decks/refs/heads/main/german/german.json)
maxLength=10

jq_filter_string() {
  # $1: gender
  # $2: comma separated difficulty
  difficulties=$(echo "[\"$2\"]" | sed 's/,/\",\"/g')
  echo ".[] | select((.gender == \"$1\") and (.cefr_level as \$l | $difficulties | index(\$l))) | select(.word | length <= $maxLength) | .word"
}

wrap_in_quotes() {
  while IFS=$'\n' read -r in; do
    echo "\"$in\","
  done
}

echo ${all_words} | jq -r "$(jq_filter_string "masculine" "A1,A2")" | wrap_in_quotes > beginnerWordsWithDer.tmp
echo "Parsed $(wc -l < beginnerWordsWithDer.tmp) beginner words with DER"

echo ${all_words} | jq -r "$(jq_filter_string "masculine" "B1,B2")" | wrap_in_quotes > intermediateWordsWithDer.tmp
echo "Parsed $(wc -l < intermediateWordsWithDer.tmp) intermediate words with DER"

echo ${all_words} | jq -r "$(jq_filter_string "masculine" "C1,C2")" | wrap_in_quotes > expertWordsWithDer.tmp
echo "Parsed $(wc -l < expertWordsWithDer.tmp) expert words with DER"

echo ${all_words} | jq -r "$(jq_filter_string "neuter" "A1,A2")" | wrap_in_quotes > beginnerWordsWithDas.tmp
echo "Parsed $(wc -l < beginnerWordsWithDas.tmp) beginner words with DAS"

echo ${all_words} | jq -r "$(jq_filter_string "neuter" "B1,B2")" | wrap_in_quotes > intermediateWordsWithDas.tmp
echo "Parsed $(wc -l < intermediateWordsWithDas.tmp) intermediate words with DAS"

echo ${all_words} | jq -r "$(jq_filter_string "neuter" "C1,C2")" | wrap_in_quotes > expertWordsWithDas.tmp
echo "Parsed $(wc -l < expertWordsWithDas.tmp) expert words with DAS"
