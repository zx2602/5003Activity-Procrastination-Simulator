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
const testCheckIn = document.querySelector('#test-check-in');
const checkIn = document.querySelector('#check-in');
const checkInQuestion = document.querySelector('#check-in-question');
const activityButtons = document.querySelectorAll('[data-activity]');
const checkInHistory = document.querySelector('#check-in-history');
const reminderHint = document.querySelector('#reminder-hint');
let recentCheckIns = [];
let lastCheckInAt = null;
let reminderStartedAt = null;
let scheduledDeadline = '';
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

// Only the most recent three answers count. Before three answers exist,
// use those available: two distraction answers are still required for High.
function hasHighDistractions(answers) {
  return answers.slice(-3).filter(answer => answer !== 'Working').length >= 2;
}

function getReminderInterval(remaining) {
  if (remaining <= DAY) return 2 * HOUR;
  if (remaining <= 3 * DAY) return 4 * HOUR;
  return 8 * HOUR;
}

function openCheckIn() {
  if (!checkIn.hidden) return;
  checkIn.hidden = false;
  checkInQuestion.focus();
}

function recordCheckIn(activity) {
  recentCheckIns = [...recentCheckIns, activity].slice(-3);
  lastCheckInAt = Date.now();
  checkIn.hidden = true;
  setText(checkInHistory, `Recent check-ins (oldest first): ${recentCheckIns.join(' · ')}.`);
  updateSimulator();
  testCheckIn.focus();
}

// Recalculate cadence against the live deadline, so entering a more urgent
// time band shortens the wait without accumulating background prompts.
function updateReminders(info) {
  if (!info || !task.value.trim()) {
    reminderStartedAt = null;
    scheduledDeadline = '';
    setText(reminderHint, 'Add a task and deadline to start automatic check-ins while this page is open.');
    return;
  }
  const now = Date.now();
  if (reminderStartedAt === null || scheduledDeadline !== deadline.value) {
    reminderStartedAt = now;
    scheduledDeadline = deadline.value;
  }
  const interval = getReminderInterval(info.remaining);
  setText(reminderHint, `Automatic check-ins: about every ${interval / HOUR} hours while this page is open.`);
  const since = Math.max(reminderStartedAt, lastCheckInAt ?? 0);
  if (!document.hidden && now - since >= interval) openCheckIn();
}

function updateSimulator() {
  const info = getDeadlineInfo(deadline.value);
  const highDistractions = hasHighDistractions(recentCheckIns);
  const highFocus = document.querySelector('input[name="focus"]:checked').value === 'high';
  setText(distractionsLabel, highDistractions ? 'High' : 'Low');
  setText(deadlineLabel, info ? info.urgency : 'Choose a deadline');
  setText(timeLeft, info ? formatTimeRemaining(info.remaining) : 'Time remaining will appear here.');
  updateReminders(info);

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
testCheckIn.addEventListener('click', openCheckIn);
activityButtons.forEach(button => button.addEventListener('click', () => recordCheckIn(button.dataset.activity)));
focusInputs.forEach(input => input.addEventListener('change', updateSimulator));
document.querySelector('form').addEventListener('submit', event => event.preventDefault());

// Keep urgency current even when the visitor does not touch any controls.
setInterval(updateSimulator, 1000);
document.addEventListener('visibilitychange', updateSimulator);
window.addEventListener('focus', updateSimulator);
updateSimulator();
