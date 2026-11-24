// Messages are kept separate from the rules so they are easy to change.
const messages = {
  Calm: 'There’s time, and things feel under control.',
  Procrastination: 'There’s still time, so distractions keep winning.',
  Pressure: 'The deadline feels close, but getting into a rhythm is hard.',
  Focus: 'The deadline is close, and you’re ready to get things done.',
  Panic: 'Time is running out, and everything is pulling you away.'
};

// Keep the existing five-state rules. Urgency now supplies deadlineSoon.
function getState(deadlineSoon, highDistractions, highFocus) {
  if (!deadlineSoon) {
    return highDistractions ? 'Procrastination' : 'Calm';
  }

  if (highDistractions && !highFocus) return 'Panic';
  if (!highDistractions && highFocus) return 'Focus';
  return 'Pressure';
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// datetime-local values represent the visitor's device-local date and time.
function getDeadlineInfo(value, now = Date.now()) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
  const remaining = timestamp - now;
  let urgency;
  if (remaining <= 0) urgency = 'Overdue';
  else if (remaining < DAY) urgency = 'Coming soon';
  else if (remaining <= 3 * DAY) urgency = 'Getting closer';
  else urgency = 'Plenty of time';

  return { remaining, urgency, soon: remaining < DAY };
}

function formatTimeRemaining(remaining) {
  if (remaining === 0) return 'Deadline reached';
  const duration = Math.abs(remaining);
  let amount;
  let unit;
  if (duration >= DAY) { amount = Math.floor(duration / DAY); unit = 'day'; }
  else if (duration >= HOUR) { amount = Math.floor(duration / HOUR); unit = 'hour'; }
  else if (duration >= MINUTE) { amount = Math.floor(duration / MINUTE); unit = 'minute'; }
  else return remaining > 0 ? 'Less than a minute left' : 'Less than a minute overdue';

  // Whole units are rounded down; the countdown refreshes automatically.
  return `${amount} ${unit}${amount === 1 ? '' : 's'} ${remaining > 0 ? 'left' : 'overdue'}`;
}

const task = document.querySelector('#task');
const deadline = document.querySelector('#deadline');
const distractions = document.querySelector('#distractions');
const focusInputs = document.querySelectorAll('input[name="focus"]');
const deadlineLabel = document.querySelector('#deadline-label');
const timeLeft = document.querySelector('#time-left');
const distractionsLabel = document.querySelector('#distractions-label');
const stateName = document.querySelector('#state-name');
const stateMessage = document.querySelector('#state-message');

// Avoid repeating unchanged announcements during automatic clock updates.
function setText(element, text) {
  if (element.textContent !== text) element.textContent = text;
}

function updateSimulator() {
  const info = getDeadlineInfo(deadline.value);
  const highDistractions = distractions.checked;
  const highFocus = document.querySelector('input[name="focus"]:checked').value === 'high';
  setText(distractionsLabel, highDistractions ? 'High' : 'Low');
  setText(deadlineLabel, info ? info.urgency : 'Choose a deadline');
  setText(timeLeft, info ? formatTimeRemaining(info.remaining) : 'Time remaining will appear here.');

  if (!info || !task.value.trim()) {
    setText(stateName, !info ? 'Waiting for a deadline' : 'Waiting for a task');
    setText(stateMessage, 'Enter a task and choose its deadline to see how the moment feels.');
    return;
  }

  const state = getState(info.soon, highDistractions, highFocus);
  setText(stateName, state);
  setText(stateMessage, messages[state]);
}

// Deadline and task edits update immediately. Other interactions stay the same.
task.addEventListener('input', updateSimulator);
deadline.addEventListener('input', updateSimulator);
deadline.addEventListener('change', updateSimulator);
distractions.addEventListener('change', updateSimulator);
focusInputs.forEach(input => input.addEventListener('change', updateSimulator));
document.querySelector('form').addEventListener('submit', event => event.preventDefault());

// Keep urgency current even when the visitor does not touch any controls.
setInterval(updateSimulator, 1000);
document.addEventListener('visibilitychange', updateSimulator);
window.addEventListener('focus', updateSimulator);
updateSimulator();
