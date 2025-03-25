// Functions for visual effects

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particles.appendChild(particle);
    setTimeout(() => {
        if (particles.contains(particle)) {
            particles.removeChild(particle);
        }
    }, 1000);
}

function addStarsAndComets() {
    const background = document.getElementById('background');
    const numStars = 100;
    const numComets = 10;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        background.appendChild(star);
    }

    for (let i = 0; i < numComets; i++) {
        const comet = document.createElement('div');
        comet.className = 'comet';
        comet.style.top = '100%';
        comet.style.left = `${Math.random() * 100}vw`;
        comet.style.animationDelay = `${Math.random() * 5}s`;
        background.appendChild(comet);
    }
}

function removeStarsAndComets() {
    const background = document.getElementById('background');
    const stars = document.querySelectorAll('.star');
    const comets = document.querySelectorAll('.comet');

    stars.forEach(star => {
        if (background.contains(star)) {
            background.removeChild(star);
        }
    });
    
    comets.forEach(comet => {
        if (background.contains(comet)) {
            background.removeChild(comet);
        }
    });
}

function addSnowstorm() {
    const background = document.getElementById('background');
    const numSnowflakes = 300;

    for (let i = 0; i < numSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.top = `${Math.random() * -100}vh`;
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 3}s`;
        background.appendChild(snowflake);
    }
}

function removeSnowstorm() {
    const background = document.getElementById('background');
    const snowflakes = document.querySelectorAll('.snowflake');

    snowflakes.forEach(snowflake => {
        if (background.contains(snowflake)) {
            background.removeChild(snowflake);
        }
    });
}

function addSmoke() {
    const background = document.getElementById('background');
    const numSmoke = 50;

    for (let i = 0; i < numSmoke; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.top = `${Math.random() * 100}vh`;
        smoke.style.left = `${Math.random() * 100}vw`;
        smoke.style.animationDuration = `${Math.random() * 3 + 3}s`;
        background.appendChild(smoke);
    }
}

function removeSmoke() {
    const background = document.getElementById('background');
    const smokeParticles = document.querySelectorAll('.smoke');

    smokeParticles.forEach(smoke => {
        if (background.contains(smoke)) {
            background.removeChild(smoke);
        }
    });
}

// Enhanced click feedback animations
function enhancedClickFeedback() {
    // Make sure all animation elements are properly removed
    const cleanUpAnimations = () => {
        const oldParticles = document.querySelectorAll('.particle');
        const oldTexts = document.querySelectorAll('.click-glowing-text');
        const oldRings = document.querySelectorAll('.pulse-ring');
        
        oldParticles.forEach(p => {
            if (particles.contains(p)) {
                particles.removeChild(p);
            }
        });
        
        oldTexts.forEach(t => {
            if (mainGame.contains(t)) {
                mainGame.removeChild(t);
            }
        });
        
        oldRings.forEach(r => {
            if (mainGame.contains(r)) {
                mainGame.removeChild(r);
            }
        });
    };
    
    // Clean up on page visibility change to prevent animation buildup
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            cleanUpAnimations();
        }
    });
    
    // Clean up every 5 minutes to prevent memory leaks
    setInterval(cleanUpAnimations, 300000);
}

// Create flash effect for achievements and important events
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
        document.body.removeChild(flash);
    }, 500);
}

// Initialize visual effects
function initVisualEffects() {
    enhancedClickFeedback();
    
    // Ensure the glowing text appears every second even when switching tabs
    setInterval(() => {
        updateGlowingText();
    }, 1000);
    
    // Ensure the score flashes green on passive gain
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateScore(true);
        }
    });
}

// Call this when the game starts
initVisualEffects();