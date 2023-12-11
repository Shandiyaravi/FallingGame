// Generate a random word through API
export async function generateRandomWord() {
    const url = 'https://random-word-api.herokuapp.com/word?length=6';
    try {
      const response = await fetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }