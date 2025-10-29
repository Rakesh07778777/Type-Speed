const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let timerInterval;
let startTime;

// Load saved data from localStorage
let quotesHistory = JSON.parse(localStorage.getItem('quotesHistory')) || [];
let bestTime = localStorage.getItem('bestTime') || null;
let lastQuote = localStorage.getItem('lastQuote') || null;

// Display last quote if it exists
if (lastQuote) {
  displayQuote(lastQuote);
  startTimer();
} else {
  renderNewQuote();
}

quoteInputElement.addEventListener('input', () => {
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

  // When the quote is typed correctly
  if (correct) handleCorrectQuote();
});

// ✅ Fetch random quote from API
function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content);
}

// ✅ Handle correct typing
function handleCorrectQuote() {
  const currentTime = getTimerTime();

  // Save quote & time to history
  const completedQuote = quoteDisplayElement.innerText;
  quotesHistory.push({ quote: completedQuote, time: currentTime });

  // Update best time
  if (!bestTime || currentTime < bestTime) {
    bestTime = currentTime;
    localStorage.setItem('bestTime', bestTime);
  }

  // Save updated history and move to next quote
  localStorage.setItem('quotesHistory', JSON.stringify(quotesHistory));
  renderNewQuote();
}

// ✅ Display quote character by character
function displayQuote(quote) {
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

// ✅ Render new quote and start timer
async function renderNewQuote() {
  const quote = await getRandomQuote();

  // Save this quote as the "last quote"
  localStorage.setItem('lastQuote', quote);

  displayQuote(quote);
  startTimer();
}

// ✅ Timer functions
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
