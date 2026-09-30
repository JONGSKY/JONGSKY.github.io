(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var label = document.querySelector('[data-theme-label]');
  // Keep the first visit calm and editorial. A previous version stored a dark
  // preference under the old key, so use a new key for this visual system.
  var stored = localStorage.getItem('jongho-theme-v2');

  function setTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (label) label.textContent = 'Light mode';
    } else {
      root.removeAttribute('data-theme');
      if (label) label.textContent = 'Dark mode';
    }
  }

  setTheme(stored || 'light');
  if (toggle) toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('jongho-theme-v2', next);
    setTheme(next);
  });

  var buttons = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter').toLowerCase();
      buttons.forEach(function (item) { item.classList.remove('is-active'); });
      button.classList.add('is-active');
      cards.forEach(function (card) {
        var category = card.getAttribute('data-category').toLowerCase();
        card.classList.toggle('is-hidden', filter !== 'all' && category !== filter.toLowerCase());
      });
    });
  });
}());
