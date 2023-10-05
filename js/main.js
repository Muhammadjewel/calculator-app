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
  document.querySelector(`.theme-switcher__radio[value="${elCurrentTheme}"]`).setAttribute('checked', true);
}

document.addEventListener('DOMContentLoaded', init);
