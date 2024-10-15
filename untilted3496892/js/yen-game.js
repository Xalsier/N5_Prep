$(document).ready(function () {
    // Emojis representing random items
    const items = ["🍎", "🍔", "👜", "🎮", "🍣", "📱", "🚲", "🍕", "👟", "🎧"];

    // Number-to-Kanji mappings with Furigana (Japanese pronunciation)
    const kanjiNumbers = {
        1: { kanji: "一", furigana: "いち" },
        2: { kanji: "二", furigana: "に" },
        3: { kanji: "三", furigana: "さん" },
        4: { kanji: "四", furigana: "よん" },
        5: { kanji: "五", furigana: "ご" },
        6: { kanji: "六", furigana: "ろく" },
        7: { kanji: "七", furigana: "なな" },
        8: { kanji: "八", furigana: "はち" },
        9: { kanji: "九", furigana: "きゅう" },
        10: { kanji: "十", furigana: "じゅう" },
        100: { kanji: "百", furigana: "ひゃく" },
        1000: { kanji: "千", furigana: "せん" },
        10000: { kanji: "万", furigana: "まん" } // Ensured 万 has furigana
    };

    let currentPrice = 0;
    let currentKanjiPrice = "";
    let itemEmoji = "";

    // Function to generate random price in tens, hundreds, and thousands
    function generateRandomPrice() {
        const ranges = [
            { min: 10, max: 99 },      // Tens
            { min: 100, max: 999 },    // Hundreds
            { min: 1000, max: 9999 },  // Thousands
            { min: 10000, max: 99999 } // Tens of thousands
        ];

        const randomRange = ranges[Math.floor(Math.random() * ranges.length)];
        return Math.floor(Math.random() * (randomRange.max - randomRange.min + 1)) + randomRange.min;
    }

    // Function to convert numbers to Kanji with Furigana (ruby text with Japanese readings)
    function convertToKanjiWithFurigana(number) {
        const kanji = [];

        if (number >= 10000) {
            const man = Math.floor(number / 10000);
            kanji.push(`<ruby>${kanjiNumbers[man].kanji}<rt>${kanjiNumbers[man].furigana}</rt></ruby>`);
            kanji.push(`<ruby>万<rt>まん</rt></ruby>`); // 万 marker with furigana
            number %= 10000;
        }
        if (number >= 1000) {
            const sen = Math.floor(number / 1000);
            kanji.push(`<ruby>${kanjiNumbers[sen].kanji}<rt>${kanjiNumbers[sen].furigana}</rt></ruby>`);
            kanji.push(`<ruby>千<rt>せん</rt></ruby>`); // 千 marker with furigana
            number %= 1000;
        }
        if (number >= 100) {
            const hyaku = Math.floor(number / 100);
            kanji.push(`<ruby>${kanjiNumbers[hyaku].kanji}<rt>${kanjiNumbers[hyaku].furigana}</rt></ruby>`);
            kanji.push(`<ruby>百<rt>ひゃく</rt></ruby>`); // 百 marker with furigana
            number %= 100;
        }
        if (number >= 10) {
            const juu = Math.floor(number / 10);
            kanji.push(`<ruby>${kanjiNumbers[juu].kanji}<rt>${kanjiNumbers[juu].furigana}</rt></ruby>`);
            kanji.push(`<ruby>十<rt>じゅう</rt></ruby>`); // 十 marker with furigana
            number %= 10;
        }
        if (number > 0) {
            kanji.push(`<ruby>${kanjiNumbers[number].kanji}<rt>${kanjiNumbers[number].furigana}</rt></ruby>`);
        }

        // Append 円 (en) for yen
        kanji.push(`<ruby>円<rt>えん</rt></ruby>`);

        return kanji.join("");
    }

    // Function to load a new random item with price
    function loadNewItem() {
        currentPrice = generateRandomPrice();
        currentKanjiPrice = convertToKanjiWithFurigana(currentPrice);
        itemEmoji = items[Math.floor(Math.random() * items.length)];

        $('#item-emoji').text(itemEmoji);
        $('#kanji-price').html(currentKanjiPrice);
        $('#feedback').text('');
        $('#yen-input').val('');
        $('#next-btn').addClass('hidden');
        $('#submit-btn').prop('disabled', false);
    }

    // Function to check user's answer
    function checkAnswer() {
        const userAnswer = $('#yen-input').val().trim();

        if (parseInt(userAnswer) === currentPrice) {
            $('#feedback').text('Correct! 🎉').css('color', 'green');
        } else {
            $('#feedback').text(`Incorrect. The correct price is: ${currentPrice}円`).css('color', 'red');
        }

        $('#submit-btn').prop('disabled', true);
        $('#next-btn').removeClass('hidden');
    }

    // Event handler for the Submit button
    $('#submit-btn').click(function () {
        checkAnswer();
    });

    // Event handler for the Next button
    $('#next-btn').click(function () {
        loadNewItem();
    });

    // Load the first item when the game starts
    loadNewItem();
});
