document.addEventListener('DOMContentLoaded', function() {
  var btn = document.querySelector('.back-to-list');
  var title = document.querySelector('.page-title');
  if (btn && title) {
    title.parentNode.insertBefore(btn, title);
  }
});
