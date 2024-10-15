$(document).ready(function () {
    let correctAnswers = 0;
    let currentQuestionIndex = 0;
    let totalQuestions = 0;
    let questionArray = [];

    // Load questions from JSON
    $.getJSON("json/wip-quest.json", function(data) {
        let verbs = Object.keys(data);

        verbs.forEach(verb => {
            let availableConjugations = data[verb];
            
            // Handle case where there are at least 2 conjugations
            if (availableConjugations.length >= 2) {
                // Shuffle and select conjugations
                let shuffled = availableConjugations.sort(() => 0.5 - Math.random());
                let correctConjugation = shuffled[0];
                let incorrectConjugations = shuffled.slice(1, Math.min(availableConjugations.length, 4));

                incorrectConjugations.push(correctConjugation);
                let options = incorrectConjugations.sort(() => 0.5 - Math.random());
                
                questionArray.push({
                    sentence: correctConjugation.sentence,
                    targetConjugation: correctConjugation.targetConjugation,
                    verb: verb,
                    correct: correctConjugation.correct,
                    explanation: correctConjugation.explanation,
                    options: options
                });
            } else {
                console.error(`Error: Not enough conjugations available for the verb "${verb}".`);
            }
        });

        totalQuestions = questionArray.length;

        if (totalQuestions === 0) {
            $('#quiz-container').html('<div class="card">Error: No valid questions available in the quiz data.</div>');
            return;
        }

        // Render first question
        renderQuestion(currentQuestionIndex);
        handleOptionClick();
        handleContinue();
        updateAccuracy();
    }).fail(function() {
        console.error("Error: Could not load questions.json.");
        $('#quiz-container').html('<div class="card">Error: Unable to load quiz data.</div>');
    });

    function updateAccuracy() {
        if (currentQuestionIndex === 0) {
            $('#accuracy').text('0%');
        } else {
            let accuracy = (correctAnswers / currentQuestionIndex) * 100;
            $('#accuracy').text(accuracy.toFixed(0) + '%');
        }
    }

    function renderQuestion(questionIndex) {
        if (!questionArray[questionIndex]) {
            console.error("Error: Question data is undefined.");
            $('#quiz-container').html('<div class="card">Error: No valid question found.</div>');
            return;
        }

        let question = questionArray[questionIndex];
        let quizContainer = $('#quiz-container');

        let questionHtml = `
        <div class="question-card" id="question${questionIndex}">
            <div class="header">
                <h2>Accuracy: <span id="accuracy">0%</span></h2>
                <button id="help-btn">Help</button>
            </div>
            <div class="card">${question.sentence} <br><small>(${question.targetConjugation})</small></div>
            <div class="options">
                ${question.options.map(option => `
                    <div class="option-card" data-answer="${option.correct === question.correct ? 'correct' : 'wrong'}" data-conjugation="${option.targetConjugation}">
                        ${option.title}
                    </div>
                `).join('')}
            </div>
            <div class="message-box" id="messageBox${questionIndex}"></div>
            <button class="continue-btn" id="continueBtn${questionIndex}" style="display:none;">Continue</button>
        </div>
    `;

        quizContainer.html(questionHtml);
    }

    function handleOptionClick() {
        $(document).on('click', '.option-card', function () {
            const isCorrect = $(this).data('answer') === 'correct';
            let question = questionArray[currentQuestionIndex];

            if (isCorrect) {
                $(this).addClass('correct');
                correctAnswers++;
                updateAccuracy();
                $(`#continueBtn${currentQuestionIndex}`).fadeIn();
                $(`#messageBox${currentQuestionIndex}`).hide();
            } else {
                $(this).addClass('wrong');
                let message = `No, ${$(this).text()} is the ${$(this).data('conjugation')} form and is not the ${question.targetConjugation} form. ${question.explanation}`;
                $(`#messageBox${currentQuestionIndex}`).text(message).fadeIn();
            }
        });
    }

    function handleContinue() {
        $(document).on('click', '.continue-btn', function () {
            if (currentQuestionIndex < totalQuestions - 1) {
                currentQuestionIndex++;
                renderQuestion(currentQuestionIndex);
                updateAccuracy();
            } else {
                $('#quiz-container').html('<div class="card">Quiz Complete! Your final accuracy is ' + (correctAnswers / totalQuestions * 100).toFixed(0) + '%</div>');
                checkForMissingData();
            }
        });
    }

    // Error handler: Check for missing data
    function checkForMissingData() {
        $.getJSON("questions.json", function(data) {
            let verbs = Object.keys(data);
            let missingVerbs = 121 - verbs.length;
            let missingQuestions = 0;

            verbs.forEach(verb => {
                if (data[verb].length < 4) {
                    missingQuestions += (4 - data[verb].length);
                }
            });

            if (missingVerbs > 0 || missingQuestions > 0) {
                let errorMsg = `Error. ${missingVerbs} verbs missing. ${missingQuestions} alternate questions missing.`;
                $('#quiz-container').append(`<div class="card">${errorMsg}</div>`);
            }
        });
    }

    // Handle Help button click
    $(document).on('click', '#help-btn', function() {
        $('#cheat-sheet-modal').fadeIn();
    });

    // Handle Close button click in modal
    $(document).on('click', '.modal-content .close', function() {
        $('#cheat-sheet-modal').fadeOut();
    });

    // Close the modal when clicking outside of the modal content
    $(document).on('click', '#cheat-sheet-modal', function(event) {
        if ($(event.target).is('#cheat-sheet-modal')) {
            $('#cheat-sheet-modal').fadeOut();
        }
    });
});
