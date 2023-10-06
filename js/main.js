function init () {
  const elThemeSwitcherControlWrapper = document.querySelector('.theme-switcher__control-wrapper');

  // DOM handlers
  function switchTheme () {
    const elRoot = document.documentElement
    let dataTheme = elThemeSwitcherControlWrapper.querySelector('input:checked').value;

    let newTheme = '';

    if (dataTheme === 'light') {
      newTheme = 'light';
    } else if (dataTheme === 'dark') {
      newTheme = 'dark';
    } else if (dataTheme === 'vintage') {
      newTheme = 'vintage';
    }

    elRoot.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);
  }


  // Event listeners
  if (elThemeSwitcherControlWrapper) {
    elThemeSwitcherControlWrapper.addEventListener('change', switchTheme);
  }

  const elCurrentTheme = document.documentElement.dataset.theme;
  document.querySelector(`.theme-switcher__radio[value='${elCurrentTheme}']`).setAttribute('checked', true);
}

document.addEventListener('DOMContentLoaded', init);


// CALCULATOR
const CALCULATOR = {
  currentValue: '',
  firstNumber: 0,
  secondNumber: 0,
  result: 0,
  // TODO refactor to use key.code, instead of .key
  keys: {
    numbers: ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    operators: ['+', '-', '*', '/'],
    commands: ['Escape', 'Enter', 'Tab', 'Shift', 'Control', 'Alt', 'Delete', 'Backspace', 'F5']
  },
  input: '.calculator__input',
  keyboard: '.calculator__keyboard',
  // To emulate key press
  pressKey: function (key) {
    console.log(key);
  },
  clearInput: function (elInput) {
    elInput.value = '';
    CALCULATOR.currentValue = '';
  },
  updateInput: function (elInput) {
    elInput.value = parseFloat(CALCULATOR.currentValue, 10).toLocaleString({
      minimumIntegerDigits: 0
    });
  }
};


const elCalcKeyboard = document.querySelector(CALCULATOR.keyboard);
const elCalcInput = document.querySelector(CALCULATOR.input);


document.addEventListener('keydown', function (evt) {
  let isNotAllowedKey = !CALCULATOR.keys.numbers.includes(evt.key) && !CALCULATOR.keys.operators.includes(evt.key) && !CALCULATOR.keys.commands.includes(evt.key);

  if (isNotAllowedKey) {
    evt.preventDefault();
  }

  if (evt.key === 'Escape') {
    CALCULATOR.clearInput(elCalcInput);
  }
});



if (elCalcKeyboard) {
  elCalcKeyboard.addEventListener('click', function (evt) {
    let isNotANumberKey = !evt.target.classList.contains('key--number');
    let isDecimalKey = evt.target.dataset.key === '.';

    if (isNotANumberKey) {
      return;
    }

    if (isDecimalKey && CALCULATOR.currentValue.includes('.')) {
      return;
    }

    CALCULATOR.currentValue += evt.target.dataset.key;
    console.log(CALCULATOR.currentValue);
    CALCULATOR.updateInput(elCalcInput);
  });
}
