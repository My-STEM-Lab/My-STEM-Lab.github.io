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

  // WhatsApp handle: tap to copy.
  // Click-to-chat links need a phone number and there's no username link format,
  // so we put the handle on the clipboard for the visitor to search instead.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older or non-secure contexts.
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('[data-wa-copy]') : null;
    if (!chip) return;

    var handle = chip.getAttribute('data-wa-copy');
    var label = chip.querySelector('[data-wa-label]');
    var live = chip.parentNode.querySelector('.wa-live');
    if (chip._waTimer) clearTimeout(chip._waTimer);

    copyText(handle).then(function () {
      chip.classList.add('copied');
      if (label) label.textContent = 'Copied';
      if (live) live.textContent = handle + ' copied. Search for it in WhatsApp to start a chat.';
    }).catch(function () {
      // Couldn't copy — tell them the handle rather than failing silently.
      if (label) label.textContent = 'Copy ' + handle;
      if (live) live.textContent = 'Copy failed. My WhatsApp handle is ' + handle + '.';
    }).then(function () {
      chip._waTimer = setTimeout(function () {
        chip.classList.remove('copied');
        if (label) label.textContent = 'Tap to copy';
        if (live) live.textContent = '';
      }, 4000);
    });
  });

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
