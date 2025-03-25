// Functions for handling random dilemmas

function showRandomDilemma(dilemma) {
    // Set dilemma content
    const dilemmaTitle = randomDilemmaModal.querySelector('h3');
    dilemmaTitle.textContent = dilemma.title || "Event!";
    dilemmaText.textContent = dilemma.description;
    
    dilemmaChoice1.textContent = dilemma.options[0].text;
    dilemmaChoice2.textContent = dilemma.options[1].text;
    
    // Show modal
    randomDilemmaModal.style.display = 'block';
    
    // Set up choice handlers
    dilemmaChoice1.onclick = () => {
        handleRandomDilemmaChoice(dilemma.options[0].outcome);
    };
    
    dilemmaChoice2.onclick = () => {
        handleRandomDilemmaChoice(dilemma.options[1].outcome);
    };
}

function handleRandomDilemmaChoice(outcome) {
    // Hide the modal
    randomDilemmaModal.style.display = 'none';
    
    // Apply outcome effects
    if (outcome.message) {
        showAlert(outcome.message);
    }
    
    // Apply point loss if specified
    if (outcome.pointsLost) {
        points = Math.max(0, points - outcome.pointsLost);
        updateScore(false);
        
        // Visual feedback for point loss
        const scoreElement = document.getElementById("score").querySelector("span");
        scoreElement.style.animation = "flashRed 0.5s ease-in-out";
        scoreElement.addEventListener("animationend", () => {
            scoreElement.style.animation = "";
        }, { once: true });
    }
    
    // Apply custom effect if specified
    if (typeof outcome.effect === 'function') {
        outcome.effect();
    }
    
    // Create appropriate visual feedback based on outcome
    if (outcome.message.includes("Lost") || outcome.pointsLost) {
        createFlashEffect('#FF000033'); // Reddish flash for negative outcomes
    } else {
        createFlashEffect('#00FF0033'); // Greenish flash for positive outcomes
    }
}

// Additional utility functions for random events
function getRandomEventDelay() {
    return Math.random() * (eventConfig.maxTimeBetweenEvents - eventConfig.minTimeBetweenEvents) + eventConfig.minTimeBetweenEvents;
}

// Add more eras' dilemmas as needed
function expandRandomDilemmas() {
    // This function can be used to dynamically add more random dilemmas to existing eras
    // For example, adding a new dilemma to the Stone Age:
    /*
    eras[0].randomDilemmas.push({
        title: "New Challenge",
        description: "Description of the challenge",
        options: [
            {
                text: "Option 1",
                outcome: {
                    message: "Outcome of option 1",
                    effect: () => {
                        // Custom effect here
                    }
                }
            },
            {
                text: "Option 2",
                outcome: {
                    message: "Outcome of option 2",
                    effect: () => {
                        // Custom effect here
                    }
                }
            }
        ]
    });
    */
}