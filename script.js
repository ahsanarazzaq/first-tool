// ==========================================================================
// Tool 1: Text Case Converter
// ==========================================================================

// DOM Elements
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const statusMessage = document.getElementById('statusMessage');

// Buttons
const btnUpper = document.getElementById('btnUpper');
const btnLower = document.getElementById('btnLower');
const btnTitle = document.getElementById('btnTitle');
const btnSentence = document.getElementById('btnSentence');
const btnReverse = document.getElementById('btnReverse');
const btnCopy = document.getElementById('btnCopy');
const btnClear = document.getElementById('btnClear');

let statusTimeout = null;

// --- Helper Functions ---

// Update Character and Word Counts
function updateCounts() {
  const text = textInput.value;

  // Total characters
  charCount.textContent = text.length;

  // Total words (matches non-whitespace character clusters)
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  wordCount.textContent = words;
}

// Show temporary status notification
function showMessage(msg, type = 'info') {
  if (statusTimeout) {
    clearTimeout(statusTimeout);
  }

  statusMessage.textContent = msg;
  statusMessage.className = `status-message show ${type}`;

  statusTimeout = setTimeout(() => {
    statusMessage.className = 'status-message';
  }, 2200);
}

// --- Case Conversion Logic ---

// 1. UPPERCASE
function toUpperCase() {
  textInput.value = textInput.value.toUpperCase();
  updateCounts();
  showMessage('Converted to UPPERCASE', 'info');
}

// 2. lowercase
function toLowerCase() {
  textInput.value = textInput.value.toLowerCase();
  updateCounts();
  showMessage('Converted to lowercase', 'info');
}

// 3. Title Case (capitalizes the first letter of every word)
function toTitleCase() {
  const text = textInput.value.toLowerCase();
  textInput.value = text.replace(/\b\w+/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  updateCounts();
  showMessage('Converted to Title Case', 'info');
}

// 4. Sentence Case (capitalizes first letter of each sentence)
function toSentenceCase() {
  let text = textInput.value.toLowerCase();

  // Capitalize first character of sentence after start of string or after . ! ?
  text = text.replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => {
    return char.toUpperCase();
  });

  // Capitalize standalone "i" (e.g., "i am" -> "I am")
  text = text.replace(/\bi\b/g, 'I');

  textInput.value = text;
  updateCounts();
  showMessage('Converted to Sentence case', 'info');
}

// 5. Reverse Text
function reverseText() {
  textInput.value = Array.from(textInput.value).reverse().join('');
  updateCounts();
  showMessage('Text reversed', 'info');
}

// 6. Copy to Clipboard
async function copyToClipboard() {
  const text = textInput.value;

  if (!text) {
    showMessage('Nothing to copy!', 'info');
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or local file without HTTPS context
      textInput.select();
      document.execCommand('copy');
    }
    showMessage('Copied to clipboard!', 'success');
  } catch (err) {
    // If clipboard API fails, fallback to select & execCommand
    textInput.select();
    document.execCommand('copy');
    showMessage('Copied to clipboard!', 'success');
  }
}

// 7. Clear Text
function clearText() {
  if (!textInput.value) return;
  textInput.value = '';
  updateCounts();
  textInput.focus();
  showMessage('Text cleared', 'info');
}

// --- Event Listeners for Case Converter ---

// Update counts on user input
textInput.addEventListener('input', updateCounts);

// Button clicks
btnUpper.addEventListener('click', toUpperCase);
btnLower.addEventListener('click', toLowerCase);
btnTitle.addEventListener('click', toTitleCase);
btnSentence.addEventListener('click', toSentenceCase);
btnReverse.addEventListener('click', reverseText);
btnCopy.addEventListener('click', copyToClipboard);
btnClear.addEventListener('click', clearText);

// Initial count update for Case Converter
updateCounts();


// ==========================================================================
// Tool 2: Word & Character Counter
// ==========================================================================

// Word Counter DOM Elements
const wcInput = document.getElementById('wcInput');
const wcWords = document.getElementById('wcWords');
const wcChars = document.getElementById('wcChars');
const wcCharsNoSpaces = document.getElementById('wcCharsNoSpaces');
const wcSentences = document.getElementById('wcSentences');
const wcParagraphs = document.getElementById('wcParagraphs');
const btnWcCopy = document.getElementById('btnWcCopy');
const btnWcClear = document.getElementById('btnWcClear');
const wcStatusMessage = document.getElementById('wcStatusMessage');

let wcStatusTimeout = null;

// Show status message for Word Counter
function showWcMessage(msg, type = 'info') {
  if (wcStatusTimeout) {
    clearTimeout(wcStatusTimeout);
  }

  wcStatusMessage.textContent = msg;
  wcStatusMessage.className = `status-message show ${type}`;

  wcStatusTimeout = setTimeout(() => {
    wcStatusMessage.className = 'status-message';
  }, 2200);
}

// Calculate and update all counts in real-time
function updateWordCounter() {
  const text = wcInput.value;
  const trimmed = text.trim();

  // 1. Total Characters (including spaces and newlines)
  wcChars.textContent = text.length;

  // 2. Characters without spaces (ignores spaces, tabs, and newlines)
  wcCharsNoSpaces.textContent = text.replace(/\s/g, '').length;

  // 3. Word Count (consecutive clusters of non-whitespace characters)
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  wcWords.textContent = words;

  // 4. Sentence Count (sentences ending with . ! ? or standalone clauses)
  if (!trimmed) {
    wcSentences.textContent = '0';
  } else {
    const sentences = trimmed
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    wcSentences.textContent = sentences.length;
  }

  // 5. Paragraph Count (paragraphs separated by line breaks)
  if (!trimmed) {
    wcParagraphs.textContent = '0';
  } else {
    const paragraphs = text
      .split(/\r?\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    wcParagraphs.textContent = paragraphs.length;
  }
}

// Clear Word Counter textarea and reset all counts to zero
function clearWordCounter() {
  if (!wcInput.value) return;
  wcInput.value = '';
  updateWordCounter();
  wcInput.focus();
  showWcMessage('Text cleared', 'info');
}

// Copy Word Counter text to clipboard
async function copyWordCounter() {
  const text = wcInput.value;

  if (!text) {
    showWcMessage('Nothing to copy!', 'info');
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      wcInput.select();
      document.execCommand('copy');
    }
    showWcMessage('Copied to clipboard!', 'success');
  } catch (err) {
    wcInput.select();
    document.execCommand('copy');
    showWcMessage('Copied to clipboard!', 'success');
  }
}

// Event Listeners for Word Counter
wcInput.addEventListener('input', updateWordCounter);
btnWcClear.addEventListener('click', clearWordCounter);
btnWcCopy.addEventListener('click', copyWordCounter);

// Initial count update for Word Counter
updateWordCounter();


// ==========================================================================
// Tool 3: Reading Time Calculator
// ==========================================================================

// Reading Time DOM Elements
const rtInput = document.getElementById('rtInput');
const rtWordCount = document.getElementById('rtWordCount');
const rtReadingTime = document.getElementById('rtReadingTime');
const rtSpeakingTime = document.getElementById('rtSpeakingTime');
const btnRtCopy = document.getElementById('btnRtCopy');
const btnRtClear = document.getElementById('btnRtClear');
const rtStatusMessage = document.getElementById('rtStatusMessage');

// Speed constants
const READING_WPM = 200;
const SPEAKING_WPM = 130;

let rtStatusTimeout = null;

// Show status message for Reading Time Calculator
function showRtMessage(msg, type = 'info') {
  if (rtStatusTimeout) {
    clearTimeout(rtStatusTimeout);
  }

  rtStatusMessage.textContent = msg;
  rtStatusMessage.className = `status-message show ${type}`;

  rtStatusTimeout = setTimeout(() => {
    rtStatusMessage.className = 'status-message';
  }, 2200);
}

// Calculate and update Reading Time metrics
function updateReadingTime() {
  const text = rtInput.value;
  const trimmed = text.trim();

  // Word count: handles multiple spaces, line breaks, empty text, punctuation
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  rtWordCount.textContent = words;

  // For empty text: show 0 min for both
  if (words === 0) {
    rtReadingTime.textContent = '0 min';
    rtSpeakingTime.textContent = '0 min';
    return;
  }

  // Calculate estimated minutes based on average speeds
  const readingMins = Math.ceil(words / READING_WPM);
  const speakingMins = Math.ceil(words / SPEAKING_WPM);

  rtReadingTime.textContent = `${readingMins} min`;
  rtSpeakingTime.textContent = `${speakingMins} min`;
}

// Clear Reading Time textarea and reset all results
function clearReadingTime() {
  if (!rtInput.value) return;
  rtInput.value = '';
  updateReadingTime();
  rtInput.focus();
  showRtMessage('Text cleared', 'info');
}

// Copy Reading Time text to clipboard
async function copyReadingTime() {
  const text = rtInput.value;

  if (!text) {
    showRtMessage('Nothing to copy!', 'info');
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      rtInput.select();
      document.execCommand('copy');
    }
    showRtMessage('Copied to clipboard!', 'success');
  } catch (err) {
    rtInput.select();
    document.execCommand('copy');
    showRtMessage('Copied to clipboard!', 'success');
  }
}

// Event Listeners for Reading Time Calculator
rtInput.addEventListener('input', updateReadingTime);
btnRtClear.addEventListener('click', clearReadingTime);
btnRtCopy.addEventListener('click', copyReadingTime);

// Initial count update for Reading Time Calculator
updateReadingTime();


// ==========================================================================
// General UI Navigation & Mobile Menu
// ==========================================================================

const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

// Toggle mobile navigation drawer
if (navToggle && siteNav) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    siteNav.classList.toggle('is-open');
  });

  // Close mobile drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('is-open') && !siteNav.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    }
  });

  // Close mobile drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
      navToggle.focus();
    }
  });
}

// Navigation link active indicator and mobile menu auto-close
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
    this.classList.add('active');

    // Close mobile drawer upon clicking any link
    if (navToggle && siteNav && siteNav.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    }
  });
});
