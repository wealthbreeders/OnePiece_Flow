// script.js

// Define the rotation sequence: Position 1 will swap with positions in this order
const swapSequence = [3, 5, 4, 2];
let currentSwapIndex = 0; // Tracks the current step in the rotation sequence

// Initial position assignments
let positionAssignments = {
    1: "Alice",
    2: "Bob",
    3: "Charlie",
    4: "Diana",
    5: "Ethan"
};

// References to DOM elements
const logDiv = document.getElementById('log');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

// Scheduler variable
let rotationTimeout = null; // Holds the reference to the setTimeout for rotation

/**
 * Function to display current position assignments
 * Since positions are fixed, we only need to update the person names
 */
function displayAssignments() {
    Object.keys(positionAssignments).forEach(pos => {
        const positionCard = document.getElementById(`position-${pos}`);
        if (positionCard) {
            const personNameDiv = positionCard.querySelector('.person-name');
            if (personNameDiv) {
                personNameDiv.textContent = positionAssignments[pos];
            }
        }
    });
}

/**
 * Function to log rotation events
 * @param {string} message 
 */
function logEvent(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const timestamp = new Date().toLocaleString();
    entry.textContent = `[${timestamp}] ${message}`;
    logDiv.appendChild(entry);
    // Scroll to the bottom
    logDiv.scrollTop = logDiv.scrollHeight;
}

/**
 * Function to rotate positions based on the defined swap sequence
 */
function rotatePositions() {
    // Get the target position to swap with Position 1
    const targetPos = swapSequence[currentSwapIndex];

    // Log the rotation action
    logEvent(`Rotating Position 1 (${positionAssignments[1]}) with Position ${targetPos} (${positionAssignments[targetPos]})`);

    // Perform the swap
    const temp = positionAssignments[1];
    positionAssignments[1] = positionAssignments[targetPos];
    positionAssignments[targetPos] = temp;

    // Update the UI
    displayAssignments();

    // Log the rotation completion
    logEvent(`Rotation completed: Position 1 is now ${positionAssignments[1]}, Position ${targetPos} is now ${positionAssignments[targetPos]}`);

    // Update the swap index for the next rotation
    currentSwapIndex = (currentSwapIndex + 1) % swapSequence.length;

    // Schedule the next rotation for the following day at 11:30 AM
    scheduleNextRotation();
}

/**
 * Function to calculate the time until the next 11:30 AM
 * @returns {number} Milliseconds until next 11:30 AM
 */
function getTimeUntilNext1130AM() {
    const now = new Date();
    const nextRotation = new Date();

    nextRotation.setHours(11);
    nextRotation.setMinutes(30);
    nextRotation.setSeconds(0);
    nextRotation.setMilliseconds(0);

    // If current time is past 11:30 AM, set for next day
    if (now >= nextRotation) {
        nextRotation.setDate(nextRotation.getDate() + 1);
    }

   // return nextRotation - now;
   return 10000;
}

/**
 * Function to schedule the next rotation at 11:30 AM
 */
function scheduleNextRotation() {
    const delay = getTimeUntilNext1130AM();
    logEvent(`Next rotation scheduled in ${(delay / 1000 / 60).toFixed(2)} minutes.`);

    rotationTimeout = setTimeout(() => {
        rotatePositions();
    }, delay);
}

/**
 * Function to start the rotation scheduler
 * Initiates the first rotation scheduling
 */
function startRotationScheduler() {
    if (rotationTimeout) {
        logEvent('Rotation is already scheduled.');
        return;
    }
    logEvent('Rotation scheduler started.');
    scheduleNextRotation();
}

/**
 * Function to stop the rotation scheduler
 */
function stopRotationScheduler() {
    if (rotationTimeout) {
        clearTimeout(rotationTimeout);
        rotationTimeout = null;
        logEvent('Rotation scheduler stopped.');
    } else {
        logEvent('Rotation scheduler is not running.');
    }
}

/**
 * Initialize the application
 */
function init() {
    displayAssignments();
    logEvent('Application initialized.');
    // Automatically schedule the first rotation on initialization
    // Comment out the line below if you want manual start via button
    // scheduleNextRotation();
}

// Event listeners for buttons
startBtn.addEventListener('click', () => {
    startRotationScheduler();
});

stopBtn.addEventListener('click', () => {
    stopRotationScheduler();
});

// Initialize on page load
window.onload = init;

/**
 * Optional: Trigger rotation immediately on start
 * Uncomment the line below if you want to rotate as soon as the scheduler starts
 */
// startBtn.addEventListener('click', rotatePositions);
