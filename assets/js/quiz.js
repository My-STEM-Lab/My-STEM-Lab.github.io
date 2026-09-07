/* ---------------------------------------------------------------------------
   My STEM Lab — quiz engine.

   Data comes from _data/quizzes/<name>.yml via a JSON block in the page.
   No dependencies. Nothing is stored or sent anywhere.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var root = document.getElementById('quiz');
  var dataEl = document.getElementById('quiz-data');
  if (!root || !dataEl) return;

  var questions;
  try {
    questions = JSON.parse(dataEl.textContent);
  } catch (e) {
    return; // malformed data — leave the page as-is rather than showing a broken widget
  }
  if (!questions || !questions.length) return;

  // Each answer as [implies P=>Q, implies Q=>P] — used for the diagnostic.
  var AXES = {
    sufficient: [true, false],
    necessary: [false, true],
    both: [true, true],
    neither: [false, false]
  };
  var LABEL = {
    sufficient: 'Sufficient but not necessary',
    necessary: 'Necessary but not sufficient',
    both: 'Necessary and sufficient',
    neither: 'Neither necessary nor sufficient'
  };

  var el = {
    start: document.getElementById('quiz-start'),
    play: document.getElementById('quiz-play'),
    results: document.getElementById('quiz-results'),
    begin: document.getElementById('quiz-begin'),
    dots: document.getElementById('quiz-dots'),
    n: document.getElementById('quiz-n'),
    total: document.getElementById('quiz-total'),
    stem: document.getElementById('quiz-stem'),
    prompt: document.getElementById('quiz-prompt'),
    options: document.getElementById('quiz-options'),
    hintBtn: document.getElementById('quiz-hint-btn'),
    hint: document.getElementById('quiz-hint'),
    feedback: document.getElementById('quiz-feedback'),
    next: document.getElementById('quiz-next')
  };

  var idx = 0;
  var answered = false;
  var results = [];

  function typeset(node) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([node])['catch'](function () {});
    }
  }

  function buildDots() {
    el.dots.innerHTML = '';
    questions.forEach(function () {
      var d = document.createElement('span');
      d.className = 'quiz-dot';
      el.dots.appendChild(d);
    });
  }

  function markDot(i, correct) {
    var d = el.dots.children[i];
    if (d) d.className = 'quiz-dot ' + (correct ? 'is-right' : 'is-wrong');
  }

  function render() {
    var q = questions[idx];
    answered = false;

    el.n.textContent = idx + 1;
    el.stem.innerHTML = q.question;
    el.prompt.textContent = root.dataset.prompt.replace(/\$/g, '');

    // reset options
    Array.prototype.forEach.call(el.options.children, function (b) {
      b.className = '';
      b.disabled = false;
    });

    el.hint.hidden = true;
    el.hint.innerHTML = '';
    el.hintBtn.hidden = !q.hint;
    el.hintBtn.textContent = 'Show a hint';
    el.feedback.hidden = true;
    el.feedback.innerHTML = '';
    el.next.hidden = true;

    typeset(el.stem);
    el.stem.focus();
  }

  function choose(given) {
    if (answered) return;
    answered = true;

    var q = questions[idx];
    var correct = given === q.answer;
    results.push({ q: q, given: given, correct: correct });
    markDot(idx, correct);

    Array.prototype.forEach.call(el.options.children, function (b) {
      b.disabled = true;
      var a = b.dataset.a;
      if (a === q.answer) b.className = 'is-right';
      else if (a === given) b.className = 'is-wrong';
    });

    el.feedback.className = 'quiz-feedback ' + (correct ? 'is-right' : 'is-wrong');
    el.feedback.innerHTML =
      '<p class="quiz-verdict">' +
      (correct ? 'Correct — ' : 'Not quite. The answer is ') +
      LABEL[q.answer] + '.</p><p>' + q.why + '</p>';
    el.feedback.hidden = false;

    el.next.textContent = (idx === questions.length - 1) ? 'See your results' : 'Next question';
    el.next.hidden = false;
    typeset(el.feedback);
  }

  /* Which direction are they getting wrong? This is the useful part. */
  function diagnose() {
    var over = 0, miss = 0, overNec = 0;
    results.forEach(function (r) {
      if (r.correct) return;
      var t = AXES[r.q.answer], g = AXES[r.given];
      if (g[0] && !t[0]) over++;          // claimed P=>Q when it fails
      if (g[1] && !t[1]) { over++; overNec++; }  // claimed Q=>P when it fails
      if (!g[0] && t[0]) miss++;          // missed a valid P=>Q
      if (!g[1] && t[1]) miss++;          // missed a valid Q=>P
    });

    if (!over && !miss) {
      return '<p><b>Full marks.</b> You checked both directions every time, which is exactly ' +
        'the habit this drill is for. The reasoning isn\'t your bottleneck.</p>';
    }
    if (over > miss) {
      return '<p><b>You\'re accepting implications without testing them.</b> ' +
        (overNec >= over / 2 ? 'Most often by assuming the converse — proving one direction and ' +
          'taking the other for granted. ' : '') +
        'Before committing to a direction, spend ten seconds actively hunting a counterexample. ' +
        'Negatives, zero, and non-integers are where they usually hide.</p>';
    }
    if (miss > over) {
      return '<p><b>You\'re finding one counterexample and stopping.</b> ' +
        'A failed direction only rules out half the answer — it tells you nothing about the other ' +
        'half. Ask both questions explicitly, every time, even when the first one settles it.</p>';
    }
    return '<p><b>Mixed pattern.</b> Some directions accepted without testing, some valid ones ' +
      'missed. The fix for both is the same: write down the two implications separately before ' +
      'you decide anything.</p>';
  }

  function finish() {
    var score = results.filter(function (r) { return r.correct; }).length;
    var total = questions.length;
    var missed = results.filter(function (r) { return !r.correct; });

    var head, line;
    if (score >= total - 1) {
      head = 'You\'ve got this cold.';
      line = 'The reasoning on Paper 2 isn\'t what\'s holding you back, which usually means ' +
        'Paper 1 pace is. That\'s what I\'d work on with you.';
    } else if (score >= total * 0.6) {
      head = 'Close, and the gap is a small one.';
      line = 'The pattern above is a specific, fixable habit rather than missing knowledge — ' +
        'normally a couple of sessions\' worth.';
    } else {
      head = 'Worth putting some proper time into.';
      line = 'This is the most learnable part of Paper 2 and the fastest scoring gain available ' +
        'to you — nothing in A-Level trains it, so almost everyone starts here.';
    }

    var html =
      '<div class="quiz-score"><b>' + score + '</b><span>out of ' + total + '</span></div>' +
      '<div class="quiz-diagnosis">' + diagnose() + '</div>';

    if (missed.length) {
      html += '<h3 class="quiz-review-head">What you missed</h3><div class="quiz-review">';
      missed.forEach(function (r) {
        html += '<details><summary>' + r.q.question + '</summary>' +
          '<p class="quiz-review-meta">You said <b>' + LABEL[r.given] + '</b>. ' +
          'The answer is <b>' + LABEL[r.q.answer] + '</b>.</p>' +
          '<p>' + r.q.why + '</p></details>';
      });
      html += '</div>';
    }

    html +=
      '<div class="quiz-actions">' +
        '<button class="btn btn-ghost" id="quiz-retry" type="button">Try again</button>' +
      '</div>' +
      '<div class="quiz-cta">' +
        '<h3>' + head + '</h3><p>' + line + '</p>' +
        '<div class="quiz-cta-actions">' +
          '<a class="btn btn-primary btn-lg" href="' + root.dataset.trial +
            '" target="_blank" rel="noopener">' + root.dataset.trialLabel + '</a>' +
          '<a class="btn btn-ghost" href="' + root.dataset.subjectUrl + '">How I teach TMUA</a>' +
        '</div>' +
      '</div>';

    el.results.innerHTML = html;
    el.play.hidden = true;
    el.results.hidden = false;
    typeset(el.results);
    el.results.scrollIntoView({ block: 'start', behavior: 'smooth' });

    document.getElementById('quiz-retry').addEventListener('click', function () {
      idx = 0; results = []; buildDots();
      el.results.hidden = true;
      el.play.hidden = false;
      render();
      root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  // ---- wiring ----
  el.total.textContent = questions.length;

  el.begin.addEventListener('click', function () {
    buildDots();
    el.start.hidden = true;
    el.play.hidden = false;
    render();
  });

  el.options.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-a]');
    if (b && !b.disabled) choose(b.dataset.a);
  });

  el.hintBtn.addEventListener('click', function () {
    var q = questions[idx];
    if (el.hint.hidden) {
      el.hint.innerHTML = '<p>' + q.hint + '</p>';
      el.hint.hidden = false;
      el.hintBtn.textContent = 'Hide hint';
      typeset(el.hint);
    } else {
      el.hint.hidden = true;
      el.hintBtn.textContent = 'Show a hint';
    }
  });

  el.next.addEventListener('click', function () {
    if (idx === questions.length - 1) finish();
    else { idx++; render(); }
  });
})();
