$(document).ready(function () {
    // JLPT N5 Country Names in Katakana and their English equivalents with Romaji
    const countries = [
        { katakana: "アメリカ", romaji: "amerika", english: ["america", "united states", "usa"] },
        { katakana: "イギリス", romaji: "igirisu", english: ["united kingdom", "uk", "england"] },
        { katakana: "インド", romaji: "indo", english: ["india"] },
        { katakana: "オーストラリア", romaji: "oosutoraria", english: ["australia"] },
        { katakana: "カナダ", romaji: "kanada", english: ["canada"] },
        { katakana: "シンガポール", romaji: "shingapooru", english: ["singapore"] },
        { katakana: "タイ", romaji: "tai", english: ["thailand"] },
        { katakana: "フィリピン", romaji: "firipin", english: ["philippines"] },
        { katakana: "ベトナム", romaji: "betonamu", english: ["vietnam"] },
        { katakana: "マレーシア", romaji: "mareeshia", english: ["malaysia"] },
        { katakana: "インドネシア", romaji: "indoneshia", english: ["indonesia"] },
        { katakana: "中国", romaji: "chuugoku", english: ["china"] },
        { katakana: "日本", romaji: "nihon", english: ["japan"] },
        { katakana: "韓国", romaji: "kankoku", english: ["south korea", "korea"] },
        { katakana: "ドイツ", romaji: "doitsu", english: ["germany"] } // Added Germany
    ];

    let currentCountry = {};
    let score = 0;

    // Function to load a new random country with ruby text for pronunciation
    function loadNewCountry() {
        currentCountry = countries[Math.floor(Math.random() * countries.length)];
        // Create the ruby structure
        const rubyContent = `<ruby>${currentCountry.katakana}<rt>${currentCountry.romaji}</rt></ruby>`;
        $('#katakana-country').html(rubyContent);
        $('#feedback').text('');
        $('#country-input').val('');
        $('#next-btn').addClass('hidden');
        $('#submit-btn').prop('disabled', false);
    }

    // Function to check user's answer
    function checkAnswer() {
        const userAnswer = $('#country-input').val().trim().toLowerCase();
        const correctAnswers = currentCountry.english.map(answer => answer.toLowerCase());

        if (correctAnswers.includes(userAnswer)) {
            $('#feedback').text('Correct! 🎉').css('color', 'green');
            score++;
        } else {
            const correctAnswerDisplay = correctAnswers.map(answer => capitalizeFirstLetter(answer)).join(", ");
            $('#feedback').text(`Incorrect. The correct answers are: ${correctAnswerDisplay}`).css('color', 'red');
        }

        $('#submit-btn').prop('disabled', true);
        $('#next-btn').removeClass('hidden');
    }

    // Utility function to capitalize the first letter of each answer for display purposes
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Event handler for the Submit button
    $('#submit-btn').click(function () {
        checkAnswer();
    });

    // Event handler for the Next button
    $('#next-btn').click(function () {
        loadNewCountry();
    });

    // Load the first country when the game starts
    loadNewCountry();
});
