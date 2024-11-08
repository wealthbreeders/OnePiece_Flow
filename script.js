// script.js

// Define the rotation sequence: Position 1 will swap with positions in this order
const swapSequence = [3, 5, 4, 2];
let currentSwapIndex = 0; // Tracks the current step in the rotation sequence
let previousPosition = null; // Tracks the last position that was in Position 1

// Initial position assignments
let positionAssignments = {
    1: "Brianna",
    2: "Gudlhum",
    3: "Max",
    4: "Yayha",
    5: "Drew"
};

// References to DOM elements
const logDiv = document.getElementById('log');
const startBtn = document.getElementById('startBtn');
const rotateNowBtn = document.getElementById('rotateNowBtn');
const stopBtn = document.getElementById('stopBtn');

// Scheduler variable
let rotationTimeout = null; // Holds the reference to the setTimeout for rotation

/**
 * Function to display current position assignments
 * Since positions are fixed, we only need to update the person names
 */
// Function to display current assignments and labels
function displayAssignments() {
    Object.keys(positionAssignments).forEach(pos => {
        const positionCard = document.getElementById(`position-${pos}`);
        if (positionCard) {
            const personNameDiv = positionCard.querySelector('.person-name');
            const positionLabelDiv = positionCard.querySelector('.position-label');
            
            personNameDiv.textContent = positionAssignments[pos];
            
            // Clear previous labels
            positionLabelDiv.textContent = "";
            positionLabelDiv.classList.remove('next', 'previous');

            // Set "PREVIOUS" label only if previousPosition is defined (rotation has started)
            if (previousPosition !== null && parseInt(pos) === swapSequence[currentSwapIndex]) {
                positionLabelDiv.textContent = "PREVIOUS";
                positionLabelDiv.classList.add('previous');
            }

            // Initial condition: display "NEXT" only on the first position in swapSequence if rotation hasn't started
            if (previousPosition === null && parseInt(pos) === swapSequence[0]) {
                positionLabelDiv.textContent = "NEXT";
                positionLabelDiv.classList.add('next');
            }
            // For subsequent rotations, calculate the next index in a circular way
            else if (previousPosition !== null) {
                let nextIndex = (currentSwapIndex + 1) % swapSequence.length;
                if (parseInt(pos) === swapSequence[nextIndex]) {
                    positionLabelDiv.textContent = "NEXT";
                    positionLabelDiv.classList.add('next');
                }
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
// Modify rotatePositions to update `previousPosition`
function rotatePositions(triggeredManually = false) {
    const targetPos = swapSequence[currentSwapIndex];
    previousPosition = 1; // Set previousPosition as Position 1 before rotation

    if (triggeredManually) {
        logEvent(`Manual Rotation: Swapping Position 1 (${positionAssignments[1]}) with Position ${targetPos} (${positionAssignments[targetPos]})`);
    } else {
        logEvent(`Scheduled Rotation: Swapping Position 1 (${positionAssignments[1]}) with Position ${targetPos} (${positionAssignments[targetPos]})`);
    }

    // Perform the swap
    const temp = positionAssignments[1];
    positionAssignments[1] = positionAssignments[targetPos];
    positionAssignments[targetPos] = temp;

    // Update UI and labels
    displayAssignments();

    // Log the rotation completion
    logEvent(`Rotation completed: Position 1 is now ${positionAssignments[1]}, Position ${targetPos} is now ${positionAssignments[targetPos]}`);

    // Update the swap index for the next rotation
    currentSwapIndex = (currentSwapIndex + 1) % swapSequence.length;

    // Schedule the next rotation if not manual
    if (!triggeredManually) {
        scheduleNextRotation();
    }
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

    // For demonstration purposes, return 10 seconds
    // Comment out the line below for actual scheduling
    return 10000; // 10,000 milliseconds = 10 seconds

    // Uncomment the line below for actual scheduling
    // return nextRotation - now;
}

/**
 * Function to schedule the next rotation at 11:30 AM
 */
function scheduleNextRotation() {
    const delay = getTimeUntilNext1130AM();
    const delayInMinutes = (delay / 1000 / 60).toFixed(2);
    logEvent(`Next rotation scheduled in ${delayInMinutes} minutes.`);

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
 * Function to handle manual rotation
 */
function handleManualRotation() {
    rotatePositions(true); // Pass true to indicate manual trigger
}

/**
 * Function to handle assignment editing
 * @param {Event} event 
 */
function handleEditButtonClick(event) {
    const editBtn = event.target;
    const positionCard = editBtn.closest('.position-card');
    const personNameDiv = positionCard.querySelector('.person-name');

    // Check if already in edit mode
    if (editBtn.textContent === 'Edit') {
        // Switch to edit mode
        const currentName = positionAssignments[getPositionNumber(positionCard)];
        personNameDiv.innerHTML = `<input type="text" value="${currentName}" class="edit-input" />`;
        editBtn.textContent = 'Save';
    } else if (editBtn.textContent === 'Save') {
        // Save the new name
        const inputField = personNameDiv.querySelector('.edit-input');
        const newName = inputField.value.trim();

        if (newName === "") {
            alert("Name cannot be empty.");
            return;
        }

        const positionNumber = getPositionNumber(positionCard);
        positionAssignments[positionNumber] = newName;

        // Exit edit mode
        personNameDiv.textContent = newName;
        editBtn.textContent = 'Edit';

        logEvent(`Position ${positionNumber} assignment updated to ${newName}.`);
    }
}

/**
 * Utility function to get the position number from a position card
 * @param {HTMLElement} positionCard 
 * @returns {number} Position number
 */
function getPositionNumber(positionCard) {
    const positionNumberDiv = positionCard.querySelector('.position-number');
    if (positionNumberDiv) {
        const posText = positionNumberDiv.textContent.trim();
        const posNumber = posText.split(' ')[1];
        return parseInt(posNumber, 10);
    }
    return null;
}

/**
 * Initialize the application
 */
// Initialize application and display the initial labels
function init() {
    displayAssignments();
    logEvent('Application initialized.');
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', handleEditButtonClick);
    });
}
// Event listeners for buttons
startBtn.addEventListener('click', () => {
    startRotationScheduler();
});

stopBtn.addEventListener('click', () => {
    stopRotationScheduler();
});

rotateNowBtn.addEventListener('click', () => {
    handleManualRotation();
});


// Initialize on page load
window.onload = init;

/**
 * Optional: Trigger rotation immediately on start
 * Uncomment the line below if you want to rotate as soon as the scheduler starts
 */
 //startBtn.addEventListener('click', rotatePositions);
 
