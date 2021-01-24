const hourElement = document.querySelector('.hour');
const minuteElement = document.querySelector('.minute');
const secondElement = document.querySelector('.second');
const timeElement = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const toggle = document.querySelector('.toggle');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const storedTheme = localStorage.getItem('prefers-color-scheme');

console.log(storedTheme);

// set default dark mode,
//   first check if it was set previously,
//   then check the browser's preferences
if (storedTheme) {
  // if we previously chose dark mode, then set dark mode
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    setToggleButtonText();
  }
  // if we previously chose light mode, then set light mode
  if (storedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    setToggleButtonText();
  }
} else if (
  // If there's no saved theme, check the browser's preferences
  window.matchMedia('(prefers-color-scheme)').media !== 'not all' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  document.documentElement.classList.add('dark');
  setToggleButtonText();
}

toggle.addEventListener('click', () => {
  // Save preferences
  localStorage.setItem('prefers-color-scheme', document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  // toggle dark mode
  document.documentElement.classList.toggle('dark');
  setToggleButtonText();
});

function setToggleButtonText() {
  if (document.documentElement.classList.contains('dark')) {
    toggle.innerText = 'Light mode';
  } else {
    toggle.innerText = 'Dark mode';
  }
}

// Clock
setTime();
setInterval(() => setTime(), 1000);

function setTime() {
  const time = new Date();

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const day = time.getDate();
  const month = time.getMonth();
  const dayOfTheWeek = time.getDay();

  // Every 12 hours, when the clock turns from '11:59:59' to '00:00:00',
  // turn off the transition for one second to avoid the spinning.
  if (seconds === 0 && minutes === 0 && hours === 0) {
    setNeedleTransition(hourElement, false);
    setNeedleTransition(minuteElement, false);
    setNeedleTransition(secondElement, false);
  } else if (secondElement.style.transitionProperty === 'none') {
    setNeedleTransition(hourElement, true);
    setNeedleTransition(minuteElement, true);
    setNeedleTransition(secondElement, true);
  }

  setNeedleDegree(hourElement, (hours % 12) * 60 * 60 + minutes * 60 + seconds, 12 * 60 * 60, 0);
  setNeedleDegree(minuteElement, minutes * 60 + seconds, 60 * 60, hours);
  setNeedleDegree(secondElement, seconds, 60, hours * 60 + minutes);

  timeElement.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  dateElement.innerHTML = `${days[dayOfTheWeek]}, ${months[month]} <span class="circle">${day}</span>`;
}

function setNeedleDegree(needle, value, maxValue, spin) {
  const degree = spin * 360 + (value * 360) / maxValue;

  needle.style.transform = `translate(-50%, -100%) rotate(${degree}deg)`;
}

function setNeedleTransition(needle, bool) {
  needle.style.transition = bool ? 'all 0.5s ease-in' : 'none 0s ease 0s';
}
