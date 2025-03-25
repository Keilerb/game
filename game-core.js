// Core game variables
let points = 0.0;
let baseClickValue = 1.0;
let upgradeClickValue = 0.0;
let currentEra = 0;
let medals = [];
let passivePoints = 0.0;
let passiveInterval = null;
let lastRandomEventTime = 0;

// Define random event probabilities
const eventConfig = {
    minTimeBetweenEvents: 60000, // 1 minute minimum between events
    maxTimeBetweenEvents: 180000, // 3 minutes maximum
    chanceOfEventOnClick: 0.02 // 2% chance of event per click
};

// DOM references
let mainGame, clickArea, clickRipple, scoreDisplay, upgradePanel, eraTitle, eraDescription;
let alertBox, nextEraBtn, skipEraBtn, particles, choiceModal, narrative, choice1, choice2;
let medalsContainer, mysteriousWindow, startButton, gameContainer, startMenu, welcomeModal;
let closeWelcomeModalBtn, randomDilemmaModal, dilemmaText, dilemmaChoice1, dilemmaChoice2;

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM references
    mainGame = document.getElementById('main-game');
    clickArea = document.getElementById('click-area');
    clickRipple = document.getElementById('click-ripple');
    scoreDisplay = document.getElementById('score');
    upgradePanel = document.getElementById('upgrades');
    eraTitle = document.getElementById('era-title');
    eraDescription = document.getElementById('era-description');
    alertBox = document.getElementById('alert');
    nextEraBtn = document.getElementById('next-era');
    skipEraBtn = document.getElementById('skip-era');
    particles = document.getElementById('particles');
    choiceModal = document.getElementById('choiceModal');
    narrative = document.getElementById('narrative');
    choice1 = document.getElementById('choice1');
    choice2 = document.getElementById('choice2');
    medalsContainer = document.getElementById('medals');
    mysteriousWindow = document.getElementById('mysteriousWindow');
    startButton = document.getElementById('start-button');
    gameContainer = document.getElementById('game-container');
    startMenu = document.getElementById('start-menu');
    welcomeModal = document.getElementById('welcomeModal');
    closeWelcomeModalBtn = document.getElementById('close-welcome-modal');
    randomDilemmaModal = document.getElementById('randomDilemmaModal');
    dilemmaText = document.getElementById('dilemma-text');
    dilemmaChoice1 = document.getElementById('dilemma-choice1');
    dilemmaChoice2 = document.getElementById('dilemma-choice2');
    
    // Initialize game
    initializeGame();
});

// The initialization function that sets up the game
function initializeGame() {
    // Set up event listeners
    startButton.addEventListener('click', () => {
        startMenu.style.display = 'none';
        gameContainer.style.display = 'flex';
        updateEra();
        welcomeModal.style.display = 'block';
        
        // Start random event timer
        scheduleNextRandomEvent();
    });

    closeWelcomeModalBtn.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
    });
    
    // Click event handler
    clickArea.addEventListener('click', (e) => {
        points += baseClickValue + upgradeClickValue;
        updateScore(true);
        
        // Visual feedback
        clickArea.classList.add('clicked');
        
        // Add ripple effect
        clickRipple.classList.remove('ripple-effect');
        void clickRipple.offsetWidth; // Force reflow
        clickRipple.classList.add('ripple-effect');
        
        // Create pulse ring
        const pulseRing = document.createElement('div');
        pulseRing.className = 'pulse-ring';
        mainGame.appendChild(pulseRing);
        setTimeout(() => {
            if (mainGame.contains(pulseRing)) {
                mainGame.removeChild(pulseRing);
            }
        }, 1500);
        
        // Add particles
        for (let i = 0; i < 10; i++) {
            let x = e.clientX + (Math.random() - 0.5) * 50;
            let y = e.clientY + (Math.random() - 0.5) * 50;
            createParticle(x, y);
        }
        
        // Add click value indicator
        const clickGlowingText = document.createElement('div');
        clickGlowingText.className = 'click-glowing-text';
        clickGlowingText.textContent = `+${(baseClickValue + upgradeClickValue).toFixed(1)}`;
        clickGlowingText.style.left = `${e.clientX}px`;
        clickGlowingText.style.top = `${e.clientY}px`;
        mainGame.appendChild(clickGlowingText);
        setTimeout(() => {
            if (mainGame.contains(clickGlowingText)) {
                mainGame.removeChild(clickGlowingText);
            }
        }, 1000);
        
        setTimeout(() => {
            clickArea.classList.remove('clicked');
        }, 300);
        
        // Check for random event
        checkForRandomEvent();
    });
    
    nextEraBtn.addEventListener('click', () => {
        if (currentEra < eras.length - 1) {
            if (points >= eras[currentEra].advanceCost) {
                showChoice();
            } else {
                showAlert(`Need ${eras[currentEra].advanceCost} points to advance!`);
            }
        } else {
            if (medals.length === eras.length - 1) {
                showAlert('You have reached the true final era!');
            } else {
                showAlert("You need all Medals of History to advance past the final age!");
            }
        }
    });

    skipEraBtn.addEventListener('click', () => {
        advanceEra();
    });
}

function updateScore(isPassive = false) {
    const scoreElement = document.getElementById("score").querySelector("span");
    scoreElement.textContent = points.toFixed(1);
    if (isPassive) {
        scoreElement.style.animation = "flashGreen 0.5s ease-in-out";
        scoreElement.addEventListener("animationend", () => {
            scoreElement.style.animation = "";
        }, { once: true });
    }
}

function updateGlowingText() {
    if (passivePoints > 0) {
        const glowingText = document.querySelector(".glowing-text");
        glowingText.textContent = `+${passivePoints.toFixed(1)}/s`;
        glowingText.style.animation = "fadeOut 1s ease-out forwards, moveUp 1s ease-out forwards";
        setTimeout(() => {
            glowingText.style.animation = "";
        }, 1000);
    }
}

function setupPassivePoints() {
    if (passivePoints > 0) {
        if (passiveInterval) {
            clearInterval(passiveInterval);
        }
        passiveInterval = setInterval(() => {
            points += passivePoints;
            updateScore(true);
            updateGlowingText();
        }, 1000);
    }
}

function resetUpgrades() {
    const upgrades = document.querySelectorAll('.upgrade');
    upgrades.forEach(upgrade => {
        upgrade.classList.remove('active');
    });
    upgradeClickValue = 0.0;
    passivePoints = 0.0;
    if (passiveInterval) {
        clearInterval(passiveInterval);
        passiveInterval = null;
    }
}

function updateEra() {
    const era = eras[currentEra];
    const background = document.getElementById('background');
    
    // Update visuals for the current era
    background.style.background = era.gradient;
    background.style.backgroundSize = '2000% 2000%';
    background.style.animation = 'gradientAnimation 30s ease infinite';
    background.className = ''; // Clear previous classes

    // Set era-specific backgrounds
    if (era.name === "AI Age") {
        background.classList.add('ai-age');
        addStarsAndComets();
    } else {
        removeStarsAndComets();
    }

    if (era.name === "Stone Age") {
        addSnowstorm();
    } else {
        removeSnowstorm();
    }

    if (era.name === "Iron Age") {
        addSmoke();
    } else {
        removeSmoke();
    }

    // Update UI elements
    clickArea.style.background = `radial-gradient(circle at 75% 25%, ${era.color}, #4ecdc4)`;
    document.documentElement.style.setProperty('--age-glow-color', era.glow);
    eraTitle.textContent = era.name;
    eraDescription.textContent = era.description;
    upgradePanel.innerHTML = '';

    // Sort upgrades by cost in ascending order
    era.upgrades.sort((a, b) => a.cost - b.cost);

    // Create upgrade buttons
    era.upgrades.forEach((upgrade, index) => {
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.textContent = `${upgrade.name} - ${upgrade.cost} Points`;
        upgradeElement.setAttribute('data-cost', upgrade.cost);
        upgradeElement.setAttribute('data-description', upgrade.description);
        upgradeElement.style.setProperty('--orbit-color', upgrade.color);
        upgradeElement.style.setProperty('--orbit-radius', `${120 + index * 20}px`);
        
        upgradeElement.addEventListener('click', () => {
            if (points >= upgrade.cost) {
                points -= upgrade.cost;
                updateScore(false);
                upgradeElement.classList.add('active');
                upgrade.effect();

                // Create orbit visual
                const orbit = document.createElement('div');
                orbit.className = 'orbit';
                orbit.style.top = '50%';
                orbit.style.left = '50%';
                orbit.style.background = `radial-gradient(circle at 75% 25%, ${upgrade.color}, rgba(255,255,255,0.5))`;
                orbit.style.boxShadow = `0 0 10px ${upgrade.color}`;
                orbit.style.width = `${upgrade.size}px`;
                orbit.style.height = `${upgrade.size}px`;
                orbit.style.animationDuration = `${8 + index * 2}s`;
                orbit.style.setProperty('--orbit-radius', upgradeElement.style.getPropertyValue('--orbit-radius'));
                mainGame.appendChild(orbit);
            } else {
                showAlert('Not enough points!');
            }
        });
        
        upgradePanel.appendChild(upgradeElement);
    });
}

function showAlert(message) {
    alertBox.innerText = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 4000);
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particles.appendChild(particle);
    setTimeout(() => {
        if (particles && particles.contains(particle)) {
            particles.removeChild(particle);
        }
    }, 1000);
}

function explodeOrbits() {
    const orbits = document.querySelectorAll('.orbit');
    orbits.forEach(orbit => {
        orbit.style.animation = 'explode 1s forwards';
        setTimeout(() => {
            if (mainGame && mainGame.contains(orbit)) {
                mainGame.removeChild(orbit);
            }
        }, 1000);
    });
}

function showChoice() {
    const era = eras[currentEra];
    if (era.dilemma) {
        narrative.textContent = era.dilemma.narrative;
        choice1.textContent = era.dilemma.choices[0];
        choice2.textContent = era.dilemma.choices[1];
        choiceModal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        choice1.onclick = () => {
            handleChoice(0, era.dilemma.correct);
        };
        choice2.onclick = () => {
            handleChoice(1, era.dilemma.correct);
        };
    } else {
        advanceEra();
    }
}

function handleChoice(chosen, correct) {
    choiceModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (chosen === correct) {
        addMedal(currentEra);
        showSuccessScreen();
    } else {
        showMysteriousWindow();
        showFailureScreen();
    }
    advanceEra();
}

function showSuccessScreen() {
    const successMessage = document.createElement('div');
    successMessage.className = 'alert';
    successMessage.innerText = `The gods award you with a medal of ${eras[currentEra].name}!`;
    successMessage.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
    successMessage.style.color = '#00ff00';
    successMessage.style.position = 'absolute';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(successMessage);
    setTimeout(() => {
        if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
        }
    }, 3000);
    document.body.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
    setTimeout(() => {
        document.body.style.backgroundColor = '';
    }, 1000);
}

function showFailureScreen() {
    const failureMessage = document.createElement('div');
    failureMessage.className = 'alert';
    failureMessage.innerText = 'The gods will remember that.';
    failureMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    failureMessage.style.color = '#ff0000';
    failureMessage.style.position = 'absolute';
    failureMessage.style.top = '50%';
    failureMessage.style.left = '50%';
    failureMessage.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(failureMessage);
    setTimeout(() => {
        if (document.body.contains(failureMessage)) {
            document.body.removeChild(failureMessage);
        }
    }, 3000);
    document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    setTimeout(() => {
        document.body.style.backgroundColor = '';
    }, 1000);
}

function addMedal(eraIndex) {
    const medal = document.createElement('div');
    medal.className = 'medal';
    medal.style.setProperty('--medal-color', eras[eraIndex].medalColor);
    medal.setAttribute('data-tooltip', eras[eraIndex].dilemma.medalDescription);
    medalsContainer.appendChild(medal);
    medals.push(medal);
}

function showMysteriousWindow() {
    mysteriousWindow.style.display = 'block';
    setTimeout(() => {
        mysteriousWindow.style.display = 'none';
    }, 2000);
}

function advanceEra() {
    if (currentEra < eras.length - 1) {
        explodeOrbits();
        // Reset points to 0
        points = 0.0;
        updateScore(false);
        // Double the baseClickValue
        baseClickValue *= 2;
        // Clear all intervals
        if (passiveInterval) {
            clearInterval(passiveInterval);
            passiveInterval = null;
        }
        // Reset upgrades
        resetUpgrades();

        currentEra++;
        updateEra();
        
        // Check if in final era without medals
        if (currentEra === eras.length - 1 && medals.length < eras.length - 1) {
            showAlert("You need all Medals of History to advance past the final age!");
        }
        
        // Reset random event timer for new era
        lastRandomEventTime = Date.now();
        scheduleNextRandomEvent();
    } else {
        if (medals.length === eras.length - 1) {
            showAlert('You have reached the true final era!');
        } else {
            showAlert("You need all Medals of History to advance past the final age!");
        }
    }
}

// Schedule and check for random events
function scheduleNextRandomEvent() {
    const delay = Math.random() * (eventConfig.maxTimeBetweenEvents - eventConfig.minTimeBetweenEvents) + eventConfig.minTimeBetweenEvents;
    setTimeout(() => {
        triggerRandomEvent();
        scheduleNextRandomEvent();
    }, delay);
}

function checkForRandomEvent() {
    // Only check if enough time has passed since last event
    if (Date.now() - lastRandomEventTime > eventConfig.minTimeBetweenEvents) {
        // Random chance on click
        if (Math.random() < eventConfig.chanceOfEventOnClick) {
            triggerRandomEvent();
        }
    }
}

function triggerRandomEvent() {
    // Don't trigger events if modals are open
    if (choiceModal.style.display === 'block' || 
        welcomeModal.style.display === 'block' || 
        randomDilemmaModal.style.display === 'block') {
        return;
    }
    
    // Update last event time
    lastRandomEventTime = Date.now();
    
    // Get current era's random dilemmas
    const currentEraDilemmas = eras[currentEra].randomDilemmas;
    if (!currentEraDilemmas || currentEraDilemmas.length === 0) return;
    
    // Select a random dilemma
    const randomDilemma = currentEraDilemmas[Math.floor(Math.random() * currentEraDilemmas.length)];
    
    // Display the dilemma
    showRandomDilemma(randomDilemma);
}

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
    if (outcome.message && outcome.message.includes("Lost") || outcome.pointsLost) {
        createFlashEffect('#FF000033'); // Reddish flash for negative outcomes
    } else {
        createFlashEffect('#00FF0033'); // Greenish flash for positive outcomes
    }
}

// Visual effect helpers
function createFlashEffect(color = '#FFFFFF') {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = color;
    flash.style.opacity = '0.3';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '1000';
    flash.style.animation = 'fadeOut 0.5s forwards';
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (document.body.contains(flash)) {
            document.body.removeChild(flash);
        }
    }, 500);
}

// Clean up animations periodically
function cleanUpAnimations() {
    const oldParticles = document.querySelectorAll('.particle');
    const oldTexts = document.querySelectorAll('.click-glowing-text');
    const oldRings = document.querySelectorAll('.pulse-ring');
    
    oldParticles.forEach(p => {
        if (particles && particles.contains(p)) {
            particles.removeChild(p);
        }
    });
    
    oldTexts.forEach(t => {
        if (mainGame && mainGame.contains(t)) {
            mainGame.removeChild(t);
        }
    });
    
    oldRings.forEach(r => {
        if (mainGame && mainGame.contains(r)) {
            mainGame.removeChild(r);
        }
    });
}

// Clean up on page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        cleanUpAnimations();
        updateScore(true);
    }
});

// Ensure the glowing text appears every second
setInterval(() => {
    updateGlowingText();
}, 1000);

// Clean up animations every 5 minutes
setInterval(cleanUpAnimations, 300000);
