// Initialize the audio element for correct word

let correctSound;
let wrongSound;
correctSound = document.querySelector('#correctSound');
export function playCorrectSound() {
  if (correctSound) {
    correctSound.currentTime = 0; // Reset the audio to the beginning
    correctSound.play();
  }
}

// Initialize the audio element for wrong word

wrongSound = document.querySelector('#wrongSound');
export function playWrongSound() {
  if (wrongSound) {
    wrongSound.currentTime = 0; // Reset the audio to the beginning
    wrongSound.play();
  }
}