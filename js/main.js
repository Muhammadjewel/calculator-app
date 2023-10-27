const TRANSITION_DURATION = 300;
const CALCULATOR = {
  currentValue: '',
  firstNumber: null,
  secondNumber: null,
  operator: null,
  result: null,
  isSoundOn: true,
  themes: {
    '1': 'dark',
    '2': 'light',
    '3': 'vintage'
  },
  numberKeyCodes: ['Numpad0', 'NumpadDecimal', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'Digit0', 'Period', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'],
  operatorKeyCodes: ['NumpadDivide', 'NumpadMultiply', 'NumpadSubtract', 'NumpadAdd', 'Slash', 'Minus', 'Digit8', 'ShiftRight', 'Equal', 'ShiftRight'],
  equalOrEnterKeyCodes: ['Enter', 'NumpadEnter', 'Equal'],
  numberKeyCodeReplaceMap: {
    'Period|Decimal': '.',
    'Numpad|Digit': '',
  },
  operatorKeyCodeReplaceMap: {
    'Numpad': '',
    'Subtract|Minus': '-',
    'Add|Equal': '+',
    'Multiply|Digit8': '*',
    'Divide|Slash': '/',
  }
}


function init () {
  function playAudio (el) {
    el.currentTime = 0;
    el.play();
  }


  // **THEME SWITCHER
  const elRoot = document.documentElement;
  const elThemeSwitcherControlWrapper = document.querySelector('.theme-switcher__control-wrapper');
  const elSwitchAudio = document.querySelector('#switch-audio');


  function switchTheme () {
    const elCheckedThemeInput = elThemeSwitcherControlWrapper.querySelector('input:checked') || elThemeSwitcherControlWrapper.querySelector('[checked]');
    let dataTheme = elCheckedThemeInput.value;

    elRoot.setAttribute('data-theme', dataTheme);
    localStorage.setItem('theme', dataTheme);

    if (CALCULATOR.isSoundOn) {
      playAudio(elSwitchAudio);
    }
  }

  function resetThemeInputs () {
    const elsThemeInput = elThemeSwitcherControlWrapper.querySelectorAll('.theme-switcher__radio');

    elsThemeInput.forEach(function (elThemeInput) {
      elThemeInput.removeAttribute('checked');
    });
  }

  function updateThemeInput (theme) {
    const elCurrentTheme = theme || elRoot.dataset.theme;
    document.querySelector(`.theme-switcher__radio[value='${elCurrentTheme}']`).setAttribute('checked', true);
  }

  function handleThemeHotkeyKeyUp (themeIndex) {
    resetThemeInputs();
    updateThemeInput(CALCULATOR.themes[themeIndex]);
    switchTheme();
  }


  if (elThemeSwitcherControlWrapper) {
    elThemeSwitcherControlWrapper.addEventListener('change', switchTheme);
  }


  // **FUNCTIONS TO RUN IN PAGE LOAD
  updateThemeInput();


  // **HANDLING NUMBER KEYS
  const elCalculatorInput = document.querySelector('.calculator__input');
  const elCalculatorKeyboard = document.querySelector('.calculator__keyboard');
  const elKeyAudio = document.querySelector('#key-audio');

  function reset () {
    CALCULATOR.currentValue = '';
    CALCULATOR.firstNumber = null;
    CALCULATOR.secondNumber = null;
    CALCULATOR.operator = null;
    CALCULATOR.result = null;
    elCalculatorInput.value = '';
  }

  function formatNumber (numberString) {
    // TODO number is X. => show in a plain format
    return parseFloat(numberString, 10).toLocaleString();
  }

  function replaceMultiple (string, map) {
    for (let x in map) {
      string = string.replace(new RegExp(x, 'g'), map[x]);
    }
    return string;
  }

  function calculate () {
    const { firstNumber, secondNumber, operator } = CALCULATOR;

    if (operator === '+') {
      CALCULATOR.result = firstNumber + secondNumber;
    } else if (operator === '-') {
      CALCULATOR.result = firstNumber - secondNumber;
    } else if (operator === 'x') {
      CALCULATOR.result = firstNumber * secondNumber;
    } else if (operator === '/') {
      CALCULATOR.result = firstNumber / secondNumber;
    }

    const { result } = CALCULATOR;
    CALCULATOR.firstNumber = result;
    CALCULATOR.secondNumber = null;
    CALCULATOR.currentValue = result;
    elCalculatorInput.value = formatNumber(result);
  }

  function emulateKeyPress (el) {
    el.click();
    el.focus();
    el.classList.add('key--active');

    setTimeout(() => {
      el.classList.remove('key--active');
      el.blur();
    }, TRANSITION_DURATION);
  }

  function handleNumberKeyClick (elKey) {
    const isKeyDecimal = elKey.dataset.key === '.';
    const isCurrentValueEmpty = CALCULATOR.currentValue === '';
    const hasCurrentValueDecimal = CALCULATOR.currentValue.includes('.');
    const isKeyDecimalAndCurrentValueEmpty = isKeyDecimal && isCurrentValueEmpty;
    const isKeyDecimalAndHasCurrentValueDecimal = isKeyDecimal && hasCurrentValueDecimal;
    const hasThreeDecimals = hasCurrentValueDecimal && CALCULATOR.currentValue.split('.')[1].length === 3;

    if (isKeyDecimalAndCurrentValueEmpty) {
      CALCULATOR.currentValue += '0.';
      elCalculatorInput.value = CALCULATOR.currentValue;
      elKey.blur();
      return;
    }

    if (isKeyDecimalAndHasCurrentValueDecimal) {
      elKey.blur();
      return;
    }

    if (hasThreeDecimals) {
      elKey.blur();
      return;
    }

    CALCULATOR.currentValue += elKey.dataset.key;
    elCalculatorInput.value = formatNumber(CALCULATOR.currentValue);
    elKey.blur();
  }

  function handleOperatorKeyClick (elKey) {
    const isInputEmpty = !elCalculatorInput.value;

    if (isInputEmpty) {
      return;
    }

    if (CALCULATOR.firstNumber && CALCULATOR.currentValue) {
      CALCULATOR.secondNumber = parseFloat(CALCULATOR.currentValue, 10);
      calculate();
    }

    if (CALCULATOR.firstNumber) {
      CALCULATOR.operator = elKey.textContent;
      CALCULATOR.currentValue = '';
      return;
    }

    CALCULATOR.firstNumber = parseFloat(CALCULATOR.currentValue, 10);
    CALCULATOR.operator = elKey.textContent;
    CALCULATOR.currentValue = '';
  }

  function deleteCharacter () {
    // TODO: fix number display when number has decimals and it has 0 in it
    // TODO: after calculation is made, currentValue becomes ''. Then Del click is throwing an error
    const isCurrentValueEmpty = CALCULATOR.currentValue === '';
    const hasCurrentValueOneCharacter = CALCULATOR.currentValue.length === 1;

    if (isCurrentValueEmpty) {
      return;
    }

    if (hasCurrentValueOneCharacter) {
      CALCULATOR.currentValue = '';
      elCalculatorInput.value = '';
      return;
    }

    CALCULATOR.currentValue = CALCULATOR.currentValue.slice(0, -1);
    elCalculatorInput.value = formatNumber(CALCULATOR.currentValue);
  }

  function handleEqualKeyClick () {
    if (CALCULATOR.firstNumber && CALCULATOR.currentValue) {
      CALCULATOR.secondNumber = parseFloat(CALCULATOR.currentValue, 10);
      calculate();
    }

    CALCULATOR.operator = null;
  }

  function handleCalculatorKeyboardClick (evt) {
    const elKey = evt.target;

    if (elKey.classList.contains('key') && CALCULATOR.isSoundOn) {
      playAudio(elKeyAudio);
    }

    if (elKey.classList.contains('key--number')) {
      handleNumberKeyClick(elKey);
    }

    if (elKey.classList.contains('key--operator')) {
      handleOperatorKeyClick(elKey);
    }

    if (elKey.classList.contains('key--equal')) {
      handleEqualKeyClick(elKey);
    }

    if (elKey.classList.contains('key--del')) {
      deleteCharacter();
    }

    if (elKey.classList.contains('key--reset')) {
      reset();
    }
  }

  // Keyboard ichidagi raqam tugmalari bosilganda
  if (elCalculatorKeyboard) {
    elCalculatorKeyboard.addEventListener('click', handleCalculatorKeyboardClick);
  }


  // **GLOBAL EVENT LISTENERS
  document.addEventListener('keyup', function (evt) {
    // THEME CHANGING VIA HOTKEYS
    const isThemeHotkey = evt.altKey && (Object.keys(CALCULATOR.themes).includes(evt.key));
    const isEscKey = evt.code === 'Escape';
    const isNumberKey = CALCULATOR.numberKeyCodes.includes(evt.code) && !evt.shiftKey;
    const isOperatorKey =
      (evt.shiftKey && evt.code === 'Equal') ||
      (evt.shiftKey && evt.code === 'Digit8') ||
      CALCULATOR.operatorKeyCodes.includes(evt.code);
    const isEqualOrEnter = CALCULATOR.equalOrEnterKeyCodes.includes(evt.code);

    if (isThemeHotkey) {
      handleThemeHotkeyKeyUp(evt.key);
    }

    if (isEscKey) {
      emulateKeyPress(elCalculatorKeyboard.querySelector('.key--reset'));
    }

    if (isNumberKey) {
      let key = replaceMultiple(evt.code, CALCULATOR.numberKeyCodeReplaceMap);
      emulateKeyPress(elCalculatorKeyboard.querySelector(`[data-key="${key}"]`));;
    }

    if (isOperatorKey && evt.code !== 'ShiftRight') {
      let key = replaceMultiple(evt.code, CALCULATOR.operatorKeyCodeReplaceMap);
      emulateKeyPress(elCalculatorKeyboard.querySelector(`[data-key="${key}"]`));
    }

    if (isEqualOrEnter) {
      emulateKeyPress(elCalculatorKeyboard.querySelector(`[data-key="="]`));
    }
  });
}

document.addEventListener('DOMContentLoaded', init);



/* TODO
Handle keyboard input via input.
Remove anything other than number.
*/



/* TODO: Bug: Hotkeys can't change theme after theme is changed via keyboard radio manipulation

Severity: low
Priority: low
Steps to reproduce:
1. Change theme to 3 themes using arrow keys on input radio focus
2. Change theme using hotkeys

Expected result:
Theme is changed.

Actual result:
Theme cannot be changed. No errors shown on console.

Add'l:
The reason can be because of input radio. Using buttons may help.
*/
