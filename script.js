const wordContainer = document.querySelector('#word-container');
const userInput = document.querySelector('#user-input');
const scoreDisplay = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');
const startButton = document.getElementById('startButton');

let score = 0;
let timeLeft = 60;


startButton.addEventListener('click', startGame);


function startGame() {
  // Reset game state (if needed)
  score = 0;
  timeLeft = 60;
  scoreDisplay.textContent = 'Score: 0';
  timerDisplay.textContent = '60sec';
  userInput.value = '';
  
  // Enable input field
  userInput.disabled = false;

  // Start the timer and word generation
  countdown();
  wordInterval = setInterval(function () {
    createFallingWord();
  }, 2000);
  
}




// Generate a random word
async function generateRandomWord() {
  const url = 'https://random-word-api.herokuapp.com/word?length=6';

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
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
    { top: '80%' }
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
    timerDisplay.textContent = `${timeLeft}sec`;
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
  if (currentWord) {
    const enteredWord = userInput.value.trim().toLowerCase();
    const correctWord = currentWord.textContent.toLowerCase();
    if (enteredWord === correctWord) {
      // If the entered word is correct, remove the word and update the score
      currentWord.remove();
      score++;
      scoreDisplay.textContent = ` ${score}`;
      userInput.value = '';
    }
  }
});

// Additional event listener to clear input when the user misses the word
userInput.addEventListener('change', function() {
  const currentWord = document.querySelector('.word');
  if (currentWord) {
    // Clear the input when the user misses the word
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
    highestScoreData.player = player;

    // Save the updated highest score data to local storage
    localStorage.setItem('highestScoreData', JSON.stringify(highestScoreData));
  }

  // Set the score and highest score in the modal
  modalScore.textContent = `  ${score}`;
  highestScoreDisplay.textContent = `Highest Score: ${highestScoreData.score}`;
  highestScorePlayerDisplay.textContent = `PlayerName: ${highestScoreData.player}`;

  // Display the modal
  modal.style.display = 'block';
  
}

// Function to close the modal
function closeModal() {
  const modal = document.querySelector('#gameOver');
  modal.style.display = 'none';
  
}

