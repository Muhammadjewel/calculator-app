const CALCULATOR = {
  isSoundOn: true,
  themes: {
    '1': 'dark',
    '2': 'light',
    '3': 'vintage'
  }
}


function init () {
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

  function playAudio (el) {
    el.currentTime = 0;
    el.play();
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


  // **GLOBAL EVENT LISTENERS
  document.addEventListener('keyup', function (evt) {
    const isThemeHotkey = evt.altKey && (Object.keys(CALCULATOR.themes).includes(evt.key));

    if (isThemeHotkey) {
      handleThemeHotkeyKeyUp(evt.key);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);


// TODO: Fix theme changing after hotkey/input change (and vice versa) cases
