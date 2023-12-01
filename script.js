const wordContainer = document.querySelector('#word-container');
const userInput = document.querySelector('#user-input');
const scoreDisplay = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');

let score = 0;
let timeLeft = 60; 
let wordInterval;

// Generate a random word
async function generateRandomWord() {
  const url = 'https://random-word-api.herokuapp.com/word';

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result; ;
  } catch (error) {
    console.error(error);
  }
}

// Create a falling word
async function createFallingWord() {
  const word = document.createElement('div');
  word.classList.add('word');
  
  // Use await to get the result from the asynchronous function
  word.textContent = await generateRandomWord();
  
  const startPosition = Math.random() * (wordContainer.clientWidth - 50);
  word.style.left = `${startPosition}px`;
  word.style.top = '0';
  wordContainer.appendChild(word);

  const animation = word.animate([
    { top: '0' },
    { top: '100%' }
  ], {
    duration: 4000,
    iterations: 1,
    easing: 'linear'
  });

  animation.onfinish = () => {
    word.remove();
  };
}
function countdown() {
  const timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left:${timeLeft}`;
    if (timeLeft === 0) {
      clearInterval(timer);
      clearInterval(wordInterval); // Stop word generation
      userInput.disabled = true; // Disable input field
      endGame();
    }
  }, 1000);
}
// Check user input against the displayed word
userInput.addEventListener('input', function() {
  const currentWord = document.querySelector('.word');
  if (currentWord && userInput.value === currentWord.textContent) {
    currentWord.remove();
    score ++;
    scoreDisplay.textContent = score;
    userInput.value = '';
  }
});
// Function to end the game
function endGame() {
 
  const modal = document.querySelector('#gameOver');
  const modalScore = document.querySelector('#modalScore');
  const highestScoreDisplay = document.querySelector('#highestScore');
  const highestScorePlayerDisplay = document.querySelector('#playerName');

  // Retrieve the current highest score data from local storage
  const highestScoreData = JSON.parse(localStorage.getItem('highestScoreData')) || { score: 0, player: '' };

  // Update the highest score if the current score is higher
  if (score > highestScoreData.score) {
    // Prompt the user for their name or use a pre-defined logic
    const playerName = prompt('Congratulations! You achieved a new high score. Enter your name:') || 'Anonymous';

    // Update the highest score data
    highestScoreData.score = score;
    highestScoreData.player = playerName;

    // Save the updated highest score data to local storage
    localStorage.setItem('highestScoreData', JSON.stringify(highestScoreData));
  }

  // Set the score and highest score in the modal
  modalScore.textContent = score;
  highestScoreDisplay.textContent = highestScoreData.score;
  highestScorePlayerDisplay.textContent = highestScoreData.player;

  // Display the modal
  modal.style.display = 'block';
}



// Function to close the modal
function closeModal() {
  const modal = document.querySelector('#gameOverModal');
  modal.style.display = 'none';
}


// Start the timer and word generation


countdown();
wordInterval = setInterval(createFallingWord, 2000);