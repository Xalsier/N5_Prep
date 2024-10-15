$(document).ready(function () {
    // Declare variables in the global scope
    let correctOption, correctHour, correctMinute, correctPeriod;

    // Function to generate a random time
    function generateRandomTime() {
        const hour = Math.floor(Math.random() * 12) + 1; // 1 to 12
        const minute = Math.floor(Math.random() * 60);   // 0 to 59
        const period = Math.random() < 0.5 ? 'AM' : 'PM'; // Randomly pick AM or PM
        return { hour, minute, period };
    }

    // Mappings for numbers to Hiragana (hours and minutes)
    const hoursHiragana = {
        1: 'いち',
        2: 'に',
        3: 'さん',
        4: 'よ',
        5: 'ご',
        6: 'ろく',
        7: 'しち',
        8: 'はち',
        9: 'く',
        10: 'じゅう',
        11: 'じゅういち',
        12: 'じゅうに'
    };

    const minutesHiragana = {
        0: '',
        1: 'いち',
        2: 'に',
        3: 'さん',
        4: 'よん',
        5: 'ご',
        6: 'ろく',
        7: 'なな',
        8: 'はち',
        9: 'きゅう',
        10: 'じゅう',
        20: 'にじゅう',
        30: 'さんじゅう',
        40: 'よんじゅう',
        50: 'ごじゅう'
    };

    // Create mappings for hours and minutes to facilitate parsing
    const hourReadings = {};
    for (let hour = 1; hour <= 12; hour++) {
        const hourHiragana = hoursHiragana[hour];
        const hourReading = `${hourHiragana}時`;
        hourReadings[hourReading] = hour;
    }

    const minuteReadings = {};
    for (let minute = 1; minute <= 59; minute++) {
        let minuteHiragana = '';
        if (minutesHiragana[minute]) {
            minuteHiragana = minutesHiragana[minute];
        } else {
            const tens = Math.floor(minute / 10) * 10;
            const ones = minute % 10;
            minuteHiragana = (minutesHiragana[tens] || '') + (minutesHiragana[ones] || '');
        }
        const minuteSuffix = getMinuteSuffix(minute);
        const minuteReading = `${minuteHiragana}${minuteSuffix}分`;
        minuteReadings[minuteReading] = minute;
    }

    // Function to determine the correct suffix for minutes
    function getMinuteSuffix(minute) {
        const specialPpun = [1, 3, 4, 6, 8, 10];
        const lastDigit = minute % 10;

        if (minute === 0) {
            return '';
        } else if (specialPpun.includes(lastDigit) || minute % 10 === 0) {
            return 'ぷん';
        } else if ([2, 5, 7, 9].includes(lastDigit)) {
            return 'ふん';
        } else {
            return 'ふん'; // Default to 'fun'
        }
    }

    // Function to convert numbers to Japanese time string
    function convertTimeToJapanese(hour, minute, period) {
        const periodKanji = period === 'AM' ? '午前' : '午後';

        // Handle hour conversion
        const hourHiragana = hoursHiragana[hour];
        const hourString = `${hourHiragana}時`;

        // Handle minute conversion
        let minuteHiragana = '';
        if (minute === 0) {
            minuteHiragana = '';
        } else {
            if (minutesHiragana[minute]) {
                minuteHiragana = minutesHiragana[minute];
            } else {
                const tens = Math.floor(minute / 10) * 10;
                const ones = minute % 10;
                minuteHiragana = (minutesHiragana[tens] || '') + (minutesHiragana[ones] || '');
            }
            const minuteSuffix = getMinuteSuffix(minute);
            minuteHiragana += `${minuteSuffix}分`;
        }

        return `${periodKanji}${hourString}${minuteHiragana}`;
    }

    // Function to generate incorrect options
    function generateIncorrectOptions(correctOption) {
        const options = new Set();
        options.add(correctOption);

        while (options.size < 4) {
            const randomHour = Math.floor(Math.random() * 12) + 1;
            const randomMinute = Math.floor(Math.random() * 60);
            const randomPeriod = Math.random() < 0.5 ? 'AM' : 'PM';

            const option = convertTimeToJapanese(randomHour, randomMinute, randomPeriod);
            options.add(option);
        }

        const optionsArray = Array.from(options);
        optionsArray.sort(() => 0.5 - Math.random()); // Shuffle options
        return optionsArray.slice(0, 4);
    }

    // Function to parse Japanese time string back into components
    function parseJapaneseTime(japaneseTime) {
        let period = null;
        if (japaneseTime.startsWith('午前')) {
            period = 'AM';
            japaneseTime = japaneseTime.slice(2); // Remove '午前'
        } else if (japaneseTime.startsWith('午後')) {
            period = 'PM';
            japaneseTime = japaneseTime.slice(2); // Remove '午後'
        }

        let hour = null;
        let minute = 0; // Default to 0 if no minute is present

        // Extract hour
        for (const [reading, value] of Object.entries(hourReadings)) {
            if (japaneseTime.startsWith(reading)) {
                hour = value;
                japaneseTime = japaneseTime.slice(reading.length); // Remove the hour part
                break;
            }
        }

        // Extract minute
        if (japaneseTime.length > 0) {
            for (const [reading, value] of Object.entries(minuteReadings)) {
                if (japaneseTime === reading) {
                    minute = value;
                    break;
                }
            }
        }

        return { hour, minute, period };
    }

    // Initialize game
    function startGame() {
        // Reset UI elements
        $('#feedback').text('');
        $('#explanation').addClass('hidden').html('');
        $('#next-button').addClass('hidden');
        $('#explanation-button').text('Explanation');
        $('.option').removeClass('correct incorrect').prop('disabled', false);

        // Generate random time
        const { hour, minute, period } = generateRandomTime();
        correctHour = hour;
        correctMinute = minute;
        correctPeriod = period;

        const displayTime = `${hour}:${minute < 10 ? '0' + minute : minute} ${period}`;
        $("#time-to-guess").text(displayTime);

        // Get the correct Japanese translation
        correctOption = convertTimeToJapanese(hour, minute, period);

        // Generate options
        let options = generateIncorrectOptions(correctOption);

        // Ensure correct option is included
        if (!options.includes(correctOption)) {
            options[0] = correctOption;
        }

        options = options.slice(0, 4).sort(() => 0.5 - Math.random()); // Shuffle options

        // Assign options to buttons
        $("#option1").text(options[0]);
        $("#option2").text(options[1]);
        $("#option3").text(options[2]);
        $("#option4").text(options[3]);
    }

    // Function to provide explanations
    let explanationVisible = false;
    function showExplanation() {
        if (explanationVisible) {
            $('#explanation').addClass('hidden').html('');
            $('#explanation-button').text('Explanation');
            explanationVisible = false;
            return;
        }

        const explanations = {
            '午前': 'gozen (AM)',
            '午後': 'gogo (PM)',
            '時': 'ji (hour)',
            '分': 'fun/pun (minutes)'
        };
        let explanationText = '<strong>Kanji Explanations:</strong><br>';
        for (const [kanji, romaji] of Object.entries(explanations)) {
            explanationText += `${kanji}: ${romaji}<br>`;
        }

        explanationText += '<br><strong>Minute Suffixes (1-10):</strong><br>';
        explanationText += '<table style="width:100%; text-align:left;">';
        explanationText += '<tr><th>Minute</th><th>Reading</th><th>Suffix</th></tr>';
        explanationText += '<tr><td>1</td><td>いっ</td><td>いっぷん</td></tr>';
        explanationText += '<tr><td>2</td><td>に</td><td>にふん</td></tr>';
        explanationText += '<tr><td>3</td><td>さん</td><td>さんぷん</td></tr>';
        explanationText += '<tr><td>4</td><td>よん</td><td>よんぷん</td></tr>';
        explanationText += '<tr><td>5</td><td>ご</td><td>ごふん</td></tr>';
        explanationText += '<tr><td>6</td><td>ろっ</td><td>ろっぷん</td></tr>';
        explanationText += '<tr><td>7</td><td>なな</td><td>ななふん</td></tr>';
        explanationText += '<tr><td>8</td><td>はっ</td><td>はっぷん</td></tr>';
        explanationText += '<tr><td>9</td><td>きゅう</td><td>きゅうふん</td></tr>';
        explanationText += '<tr><td>10</td><td>じゅっ</td><td>じゅっぷん</td></tr>';
        explanationText += '</table>';

        $('#explanation').html(explanationText).removeClass('hidden');
        $('#explanation-button').text('Hide Explanation');
        explanationVisible = true;
    }

    // Function to provide detailed feedback
    function provideFeedback(selectedOption) {
        let feedbackMessage = '';
        const selectedTime = parseJapaneseTime(selectedOption);

        const misreadPeriod = selectedTime.period !== correctPeriod;
        const misreadHour = selectedTime.hour !== correctHour;
        const misreadMinute = selectedTime.minute !== correctMinute;

        const misreadComponents = [];
        if (misreadPeriod) misreadComponents.push('the temporal adverb');
        if (misreadHour) misreadComponents.push('the hour');
        if (misreadMinute) misreadComponents.push('the minute');

        const isCorrect = misreadComponents.length === 0;

        if (isCorrect) {
            feedbackMessage = 'Correct! 🎉';
        } else {
            feedbackMessage = 'You misread ' + misreadComponents.join(' and ') + '.';
        }

        // Set feedback color
        $('#feedback').text(feedbackMessage).css('color', isCorrect ? 'green' : 'red');
    }

    // Handle user selection
    $(".option").off("click").on("click", function () {
        const selectedOption = $(this).text();

        // Disable all options
        $('.option').prop('disabled', true);

        // Provide feedback
        provideFeedback(selectedOption);

        // Color the buttons
        $('.option').each(function () {
            if ($(this).text() === correctOption) {
                $(this).addClass('correct');
            } else if ($(this).text() === selectedOption) {
                $(this).addClass('incorrect');
            }
        });

        // Show Next button
        $('#next-button').removeClass('hidden');
    });

    // Handle Explanation button click
    $('#explanation-button').on('click', function () {
        showExplanation();
    });

    // Handle Next button click
    $('#next-button').on('click', function () {
        startGame();
    });

    // Start the game when the page loads
    startGame();
});
