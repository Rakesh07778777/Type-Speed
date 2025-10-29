const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let startTime;
let timerInterval;
let timerStarted = false; 


quoteInputElement.addEventListener('input', () => {

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');
  let correct = true;


  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      characterSpan.classList.remove('correct', 'incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });


  if (correct) {
    clearInterval(timerInterval);
    timerStarted = false;
    renderNewQuote();
  }
});


async function getRandomQuote() {
  try {
    const response = await fetch(RANDOM_QUOTE_API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error fetching quote:', error);
    quoteDisplayElement.innerText = '⚠️ Unable to load quote. Please check your internet.';
    return null;
  }
}


async function renderNewQuote() {
  const quote = await getRandomQuote();
  if (!quote) return;

  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach((character) => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });


  quoteInputElement.value = '';
  timerElement.innerText = 0;
}


function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerElement.innerText = 0;
  startTime = new Date();

  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}


function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}


renderNewQuote();
