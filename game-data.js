// Define game eras, upgrades, and dilemmas
const eras = [
    {
        name: "Stone Age", 
        color: "#8B4513", 
        glow: "#FFA07A", 
        medalColor: "#8B4513", 
        advanceCost: 250, 
        dilemma: {
            narrative: "The winter is harsh, and food is scarce. You've located a herd of wild animals. Do you:",
            choices: ["Attempt to domesticate them for future stability", "Hunt them all for immediate survival"],
            correct: 0,
            medalDescription: "Medal of the Stone Age - For showing foresight by domesticating animals."
        },
        upgrades: [
            {
                name: "Animal Domestication", 
                cost: 100, 
                effect: () => upgradeClickValue += 2.0, 
                description: "Domesticating animals provides a stable food source, increasing points earned on click by 2.0.", 
                color: "#654321", 
                size: 20
            },
            {
                name: "Fire Mastery", 
                cost: 50, 
                effect: () => {
                    passivePoints += 2.0;
                    updateGlowingText();
                    setupPassivePoints();
                }, 
                description: "Mastering fire provides warmth and protection, gaining 2.0 points per second.", 
                color: "#DAA520", 
                size: 25
            },
            {
                name: "Stone Tools", 
                cost: 10, 
                effect: () => upgradeClickValue += baseClickValue * 0.2, 
                description: "Crafting stone tools improves efficiency in hunting and gathering, increasing click efficiency by 20%.", 
                color: "#704214", 
                size: 30
            },
        ], 
        description: "Harsh winters and predators force adaptation.",
        gradient: "linear-gradient(270deg, #8B4513, #FFA07A, #8B4513, #FFA07A, #8B4513)",
        randomDilemmas: [
            {
                title: "Rival Tribe",
                description: "A neighboring tribe is demanding you hand over half of your stone tools and food supplies.",
                options: [
                    {
                        text: "Give them what they want for peace",
                        outcome: {
                            message: "The tribe accepts your offering and proposes a trade alliance.",
                            effect: () => {
                                passivePoints += 1.0;
                                showNotification("Gained +1.0 points per second from trade alliance!");
                            },
                            pointsLost: Math.floor(points * 0.5)
                        }
                    },
                    {
                        text: "Refuse their demands",
                        outcome: {
                            message: "The tribe attacks and steals most of your resources.",
                            effect: () => {
                                baseClickValue *= 0.8;
                                showNotification("Lost 20% of your click value!");
                            },
                            pointsLost: Math.floor(points * 0.8)
                        }
                    }
                ]
            },
            {
                title: "Strange Plants",
                description: "Your gatherers have found unusual plants with colorful berries. They smell sweet.",
                options: [
                    {
                        text: "Test them cautiously",
                        outcome: {
                            message: "The berries turn out to be nutritious and slightly medicinal.",
                            effect: () => {
                                baseClickValue *= 1.1;
                                showNotification("Gained 10% click value from medicinal berries!");
                            }
                        }
                    },
                    {
                        text: "Harvest and eat plenty",
                        outcome: {
                            message: "Many tribe members fall ill. Some recover with new insights.",
                            effect: () => {
                                points = Math.max(0, points * 0.7);
                                upgradeClickValue += 1;
                                showNotification("Lost 30% of points but gained +1.0 click value!");
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        name: "Bronze Age", 
        color: "#CD7F32", 
        glow: "#FF8C00", 
        medalColor: "#CD7F32", 
        advanceCost: 1500, 
        dilemma: {
            narrative: "Your tribe has discovered a new metal. Do you:",
            choices: ["Use it for weapons to conquer neighboring tribes", "Use it for tools to improve farming"],
            correct: 1,
            medalDescription: "Medal of the Bronze Age - For choosing peace and prosperity over war."
        },
        upgrades: [
            {
                name: "Trade Routes", 
                cost: 800, 
                effect: () => upgradeClickValue += 4.0, 
                description: "Establishing trade routes allows for the exchange of goods, increasing points earned on click by 4.0.", 
                color: "#CD853F", 
                size: 20
            },
            {
                name: "Irrigation Systems", 
                cost: 400, 
                effect: () => {
                    passivePoints += 4.0;
                    updateGlowingText();
                    setupPassivePoints();
                }, 
                description: "Building irrigation systems improves crop yield, gaining 4.0 points per second.", 
                color: "#D2691E", 
                size: 25
            },
            {
                name: "Bronze Swords", 
                cost: 200, 
                effect: () => upgradeClickValue += baseClickValue * 0.3, 
                description: "Forging bronze swords enhances combat capabilities, increasing click efficiency by 30%.", 
                color: "#B22222", 
                size: 30
            },
        ],
        description: "Metallurgy brings new tools and weapons, improving agriculture and warfare.",
        gradient: "linear-gradient(270deg, #CD7F32, #FF8C00, #CD7F32, #FF8C00, #CD7F32)",
        randomDilemmas: [
            {
                title: "Copper Shortage",
                description: "Your bronze production is threatened by a copper shortage. A merchant offers copper at triple the normal price.",
                options: [
                    {
                        text: "Pay the high price",
                        outcome: {
                            message: "You maintain production but drain your resources.",
                            effect: () => {
                                points = Math.max(0, points * 0.6);
                                showNotification("Lost 40% of your points to purchase copper!");
                            }
                        }
                    },
                    {
                        text: "Send an expedition to find new copper",
                        outcome: {
                            message: "After initial hardship, your explorers discover an abundant copper mine!",
                            effect: () => {
                                points = Math.max(0, points * 0.8);
                                passivePoints *= 1.5;
                                showNotification("Lost 20% points but gained 50% more passive income!");
                            }
                        }
                    }
                ]
            },
            {
                title: "Craftsman's Guild",
                description: "Master craftsmen want to form a guild, restricting who can work with bronze but improving quality.",
                options: [
                    {
                        text: "Support the guild",
                        outcome: {
                            message: "Quality improves dramatically but production slows.",
                            effect: () => {
                                upgradeClickValue += 5;
                                passivePoints *= 0.8;
                                showNotification("Gained +5.0 click value but lost 20% passive income!");
                            }
                        }
                    },
                    {
                        text: "Reject the guild, keep production open",
                        outcome: {
                            message: "Production increases but some quality is lost.",
                            effect: () => {
                                passivePoints += 3;
                                upgradeClickValue *= 0.9;
                                showNotification("Gained +3.0 passive income but lost 10% click value!");
                            }
                        }
                    }
                ]
            }
        ]
    },
    // ... Continue with other eras in the same pattern
    {
        name: "Iron Age", 
        color: "#A9A9A9", 
        glow: "#C0C0C0", 
        medalColor: "#A9A9A9", 
        advanceCost: 3000, 
        dilemma: {
            narrative: "Your kingdom is threatened by invaders. Do you:",
            choices: ["Fortify your defenses and prepare for a siege", "Launch a preemptive strike to eliminate the threat"],
            correct: 0,
            medalDescription: "Medal of the Iron Age - For prioritizing defense and strategic planning."
        },
        upgrades: [
            {
                name: "Fortifications", 
                cost: 4000, 
                effect: () => upgradeClickValue += 8.0, 
                description: "Building fortifications protects your kingdom, increasing points earned on click by 8.0.", 
                color: "#808080", 
                size: 20
            },
            {
                name: "Advanced Farming", 
                cost: 2000, 
                effect: () => {
                    passivePoints += 8.0;
                    updateGlowingText();
                    setupPassivePoints();
                }, 
                description: "Advancing farming techniques improves food production, gaining 8.0 points per second.", 
                color: "#A9A9A9", 
                size: 25
            },
            {
                name: "Iron Swords", 
                cost: 1000, 
                effect: () => upgradeClickValue += baseClickValue * 0.4, 
                description: "Forging iron swords enhances military strength, increasing click efficiency by 40%.", 
                color: "#696969", 
                size: 30
            },
        ],
        description: "Stronger tools and weapons lead to powerful empires and advanced farming.",
        gradient: "linear-gradient(270deg, #A9A9A9, #C0C0C0, #A9A9A9, #C0C0C0, #A9A9A9)",
        randomDilemmas: [
            {
                title: "Forest Clearing",
                description: "Your growing population needs more farmland. You could clear a sacred forest for farming.",
                options: [
                    {
                        text: "Clear the forest",
                        outcome: {
                            message: "The new farms increase food production, but the gods seem displeased...",
                            effect: () => {
                                passivePoints += 5;
                                baseClickValue *= 0.8;
                                showNotification("Gained +5.0 passive income but lost 20% click value!");
                            }
                        }
                    },
                    {
                        text: "Preserve the sacred forest",
                        outcome: {
                            message: "Your people find innovative ways to farm the existing land more efficiently.",
                            effect: () => {
                                baseClickValue *= 1.2;
                                showNotification("Gained 20% more click value through innovation!");
                            }
                        }
                    }
                ]
            },
            {
                title: "Iron Mines Collapse",
                description: "A major iron mine has collapsed. Rescuing miners will halt production for weeks.",
                options: [
                    {
                        text: "Focus on rescue efforts",
                        outcome: {
                            message: "Most miners are saved. Their gratitude increases productivity.",
                            effect: () => {
                                points = Math.max(0, points * 0.7);
                                upgradeClickValue *= 1.25;
                                showNotification("Lost 30% of points but gained 25% more click value!");
                            }
                        }
                    },
                    {
                        text: "Abandon the miners, open a new mine",
                        outcome: {
                            message: "Production continues but worker morale plummets.",
                            effect: () => {
                                passivePoints *= 0.6;
                                showNotification("Lost 40% of passive income due to poor morale!");
                            }
                        }
                    }
                ]
            }
        ]
    },
    // Continue with other eras...
];

// Define random event probabilities
const eventConfig = {
    minTimeBetweenEvents: 60000, // 1 minute minimum between events
    maxTimeBetweenEvents: 180000, // 3 minutes maximum
    chanceOfEventOnClick: 0.02 // 2% chance of event per click
};