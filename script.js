"usestrict";

const wordContainer = document.querySelector('#word-container');
const userInput = document.querySelector('#user-input');
const scoreDisplay = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');
const startButton = document.querySelector('#startButton');

let score = 0;
let timeLeft = 90;
let correctSound;
let wrongSound;

//click event to start the game

startButton.addEventListener('click', startGame);

//Function for starting the game

function startGame() {
  startButton.removeEventListener('click', startGame);
  score = 0;
  timeLeft = 90;
  scoreDisplay.textContent = 'Score: 0';
  timerDisplay.textContent = '90sec';
  userInput.value = '';
  // Enable input field

  userInput.disabled = false;
  userInput.focus();

  // Start the timer and word generation

  countdown();
  wordInterval = setInterval(function () {
    createFallingWord();
  }, 2000);
}


// Generate a random word through API
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
  //Calculates position where the words fall from
  const startPosition = Math.random() * (wordContainer.clientWidth - 50);
  word.style.left = `${startPosition}px`;
  word.style.top = '0';
  wordContainer.appendChild(word);
  const animation = word.animate([
    { top: '0' },
    { top: '80%' }
  ], {
    duration: 3500,
    iterations: 1,
    easing: 'linear'
  });

  animation.onfinish = () => {
    word.remove();
  };
}


// Initialize the audio element for correct word

correctSound = document.querySelector('#correctSound');
function playCorrectSound() {
  if (correctSound) {
    correctSound.currentTime = 0; // Reset the audio to the beginning
    correctSound.play();
  }
}

// Initialize the audio element for wrong word

wrongSound = document.querySelector('#wrongSound');
function playWrongSound() {
  if (wrongSound) {
    wrongSound.currentTime = 0; // Reset the audio to the beginning
    wrongSound.play();
  }
}

//Function for timer

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
      playCorrectSound();
    }
  }
});

// Additional event listener to clear input when the user misses the word

userInput.addEventListener('change', function() {
  const currentWord = document.querySelector('.word');
  if (currentWord) {
    // Clear the input when the user misses the word
    userInput.value = '';
    playWrongSound();
  }
});

// Function to end the game

function endGame() {
  const gameOverEL = document.querySelector('#gameOver');
  const playerScore = document.querySelector('#playerScore');
  const highestScoreDisplay = document.querySelector('#highestScore');
  

  // Retrieve the current highest score data from local storage
  const highestScoreData = JSON.parse(localStorage.getItem('highestScoreData')) || { score: 0, player: '' };

  // Update the highest score if the current score is higher
  if (score > highestScoreData.score){
    // Prompt the user for their name or use a pre-defined logic
    const playerName = prompt('Congratulations! You achieved a new high score. Enter your name:') || 'Anonymous';

    // Update the highest score data
    highestScoreData.score = score;
    highestScoreData.player = playerName;

    // Save the updated highest score data to local storage
    localStorage.setItem('highestScoreData', JSON.stringify(highestScoreData));
  }

  // display the score and highest score in the gameOver container
  playerScore.textContent = `  ${score}`;
  highestScoreDisplay.textContent = `Highest Score: ${highestScoreData.score} by ${highestScoreData.player}`;

  // styles
  gameOverEL.style.display = 'flex';
  gameOverEL.style.flexDirection='column';
  gameOverEL.style.gap='1rem';
  gameOverEL.style.fontSize='1.5rem';
  
}

// Function to close the modal
function closeGame() {
  const gameOverEL = document.querySelector('#gameOver');
  gameOverEL.style.display = 'none';
  startButton.addEventListener('click', startGame);
  startGame();
}



