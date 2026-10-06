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

// --- Event Listeners ---

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

// Initial count update
updateCounts();
