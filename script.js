const yesBtn = document.getElementById('yesBtn');
const noButtonsContainer = document.getElementById('noButtons');
const messageDiv = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

const buttonSize = 100; // Width and height of the buttons
let noBtnSize = 1; // Initial size multiplier for the No button
let noBtnOffset = 0; // Initial offset for the No button
let yesClickCount = 0; // Click counter for the Yes button
let moveYesButtonInterval = null; // Interval for moving the Yes button
let moveIntervalTime = 2000; // Initial time interval for moving the Yes button

function generateRandomPosition() {
    const x = Math.random() * (window.innerWidth - buttonSize);
    const y = Math.random() * (window.innerHeight - buttonSize);
    return { x, y };
}

function isOverlapping(x, y, buttons) {
    return buttons.some(btn => {
        const rect = btn.getBoundingClientRect();
        return (
            x < rect.right &&
            x + buttonSize > rect.left &&
            y < rect.bottom &&
            y + buttonSize > rect.top
        );
    });
}

function moveYesButtonRandomly() {
    let position;
    const noButtons = Array.from(noButtonsContainer.querySelectorAll('.button.red'));

    do {
        position = generateRandomPosition();
    } while (isOverlapping(position.x, position.y, noButtons));

    yesBtn.style.position = 'absolute';
    yesBtn.style.left = `${position.x}px`;
    yesBtn.style.top = `${position.y}px`;
}

function startMovingYesButton() {
    stopMovingYesButton(); // Clear any existing interval
    moveYesButtonInterval = setInterval(() => {
        moveYesButtonRandomly();
    }, moveIntervalTime);
}

function stopMovingYesButton() {
    if (moveYesButtonInterval) {
        clearInterval(moveYesButtonInterval);
        moveYesButtonInterval = null;
    }
}

function createAdditionalNoButtons() {
    const existingButtons = Array.from(noButtonsContainer.querySelectorAll('.button.red'));

    for (let i = 2; i <= 3; i++) {
        let position;
        do {
            position = generateRandomPosition();
        } while (isOverlapping(position.x, position.y, existingButtons));

        const newNoBtn = document.createElement('button');
        newNoBtn.id = `noBtn${i}`;
        newNoBtn.className = 'button red';
        newNoBtn.textContent = 'No';
        newNoBtn.style.position = 'absolute';
        newNoBtn.style.top = `${position.y}px`;
        newNoBtn.style.left = `${position.x}px`;
        noButtonsContainer.appendChild(newNoBtn);

        existingButtons.push(newNoBtn); // Add the new button to the list of existing buttons
    }

    // Reset sizes of all No buttons after adding new ones
    resetNoButtons();
}

function resetNoButtons() {
    noBtnSize = 1; // Reset size multiplier
    noButtonsContainer.querySelectorAll('.button.red').forEach(btn => {
        btn.style.transform = `scale(${noBtnSize})`; // Reset the No button sizes
    });
}

function resetNoButton() {
    noBtnOffset = 0; // Reset No button offset
    yesBtn.style.transform = `translateX(${noBtnOffset}px)`; // Reset the Yes button position
}

function resetState(keepMessage = false) {
    if (!keepMessage) {
        messageDiv.textContent = ''; // Clear the message
    }
    resetNoButtons(); // Reset the No buttons size
    resetNoButton(); // Reset the Yes button position
    stopMovingYesButton(); // Stop moving Yes button if it was moving
    moveIntervalTime = 2000; // Reset the interval time

    // Remove additional No buttons, keeping only the original one
    const extraNoBtns = Array.from(noButtonsContainer.querySelectorAll('.button.red')).slice(1);
    extraNoBtns.forEach(btn => noButtonsContainer.removeChild(btn));

    // Reset the Yes click counter
    yesClickCount = 0;

    // Reset Yes button position to original
    yesBtn.style.position = 'static';
}

yesBtn.addEventListener('click', () => {
    yesClickCount++;
    // Increase the size of No buttons and move Yes button
    noBtnSize += 0.2;
    noBtnOffset -= 5;

    noButtonsContainer.querySelectorAll('.button.red').forEach(btn => {
        btn.style.transform = `scale(${noBtnSize})`; // Apply the new size to all No buttons
    });
    yesBtn.style.transform = `translateX(${noBtnOffset}px)`; // Apply the new position to the Yes button

    if (yesClickCount === 20) {
        createAdditionalNoButtons(); // Add two more No buttons and reset sizes
    } else if (yesClickCount > 26) {
        moveIntervalTime = Math.max(200, moveIntervalTime - 100); // Reduce the interval by 0.1 seconds (100ms) after each Yes click starting at click 26
        startMovingYesButton(); // Start or update the movement with the new interval
    }
});

noButtonsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('red')) {
        messageDiv.textContent = 'Yay!'; // Show the message when No button is clicked
        resetState(true); // Reset everything except the Yay message
    }
});

resetBtn.addEventListener('click', () => {
    resetState(); // Reset the state on Reset button click
});
