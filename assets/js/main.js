/* My STEM Lab — small progressive enhancements. No dependencies. */
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Resource filter (used on /resources/)
  var filter = document.getElementById('resource-filter');
  if (filter) {
    var groups = Array.prototype.slice.call(document.querySelectorAll('.resource-group'));
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      groups.forEach(function (group) {
        var anyVisible = false;
        Array.prototype.forEach.call(group.querySelectorAll('.resource'), function (item) {
          var match = q === '' || item.textContent.toLowerCase().indexOf(q) !== -1 ||
                      group.dataset.subject.toLowerCase().indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
          if (match) anyVisible = true;
        });
        group.style.display = anyVisible ? '' : 'none';
      });
    });
  }
})();
