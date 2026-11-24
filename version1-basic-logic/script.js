// Messages are kept separate from the rules so they are easy to change.
const messages = {
  Calm: 'There’s time, and things feel under control.',
  Procrastination: 'There’s still time, so distractions keep winning.',
  Pressure: 'The deadline feels close, but getting into a rhythm is hard.',
  Focus: 'The deadline is close, and you’re ready to get things done.',
  Panic: 'Time is running out, and everything is pulling you away.'
};

// Slider values below 50 mean far away; 50–100 mean coming soon.
function getState(deadlineValue, highDistractions, highFocus) {
  const deadlineSoon = deadlineValue >= 50;

  if (!deadlineSoon) {
    return highDistractions ? 'Procrastination' : 'Calm';
  }

  if (highDistractions && !highFocus) return 'Panic';
  if (!highDistractions && highFocus) return 'Focus';
  return 'Pressure';
}

const deadline = document.querySelector('#deadline');
const distractions = document.querySelector('#distractions');
const focusInputs = document.querySelectorAll('input[name="focus"]');
const deadlineLabel = document.querySelector('#deadline-label');
const distractionsLabel = document.querySelector('#distractions-label');
const stateName = document.querySelector('#state-name');
const stateMessage = document.querySelector('#state-message');

function updateSimulator() {
  const deadlineValue = Number(deadline.value);
  const highDistractions = distractions.checked;
  const highFocus = document.querySelector('input[name="focus"]:checked').value === 'high';
  const state = getState(deadlineValue, highDistractions, highFocus);
  const deadlineText = deadlineValue >= 50 ? 'Coming soon' : 'Far away';

  deadlineLabel.textContent = deadlineText;
  deadline.setAttribute('aria-valuetext', deadlineText);
  distractionsLabel.textContent = highDistractions ? 'High' : 'Low';
  stateName.textContent = state;
  stateMessage.textContent = messages[state];
}

// The slider updates while it moves; the other controls update on selection.
deadline.addEventListener('input', updateSimulator);
distractions.addEventListener('change', updateSimulator);
focusInputs.forEach(input => input.addEventListener('change', updateSimulator));

// Match the initial result to the starting inputs.
updateSimulator();
