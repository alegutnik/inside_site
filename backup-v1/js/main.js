/* INSIDE — весь интерактив сайта. Без библиотек. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Год в футере */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ============================================================
     1. Аналитика
     Работает, только если пиксель подключён в <head> index.html.
     ============================================================ */
  function track(name, params) {
    params = params || {};
    if (typeof gtag === 'function') gtag('event', name, params);
    if (typeof fbq === 'function') fbq('trackCustom', name, params);
    if (typeof ttq === 'object' && ttq.track) ttq.track(name, params);
  }

  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      track('CTAClick', { cta: el.dataset.cta, text: el.textContent.trim().slice(0, 60) });
    });
  });

  /* ============================================================
     2. Появление блоков при скролле
     ============================================================ */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduced) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    /* соседние карточки внутри одной сетки всплывают каскадом */
    var groups = new Map();
    revealables.forEach(function (el) {
      var p = el.parentElement;
      if (!groups.has(p)) groups.set(p, 0);
      var i = groups.get(p);
      el.style.setProperty('--reveal-delay', Math.min(i, 6) * 70 + 'ms');
      groups.set(p, i + 1);
    });

    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealIO.observe(el); });

    /* Страховка: если наблюдатель почему-то не отработал, через 2.5 с
       показываем всё, что уже в зоне видимости. Контент важнее анимации. */
    setTimeout(function () {
      revealables.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 2500);
  }

  /* ============================================================
     3. Счётчики — цифры набегают, когда блок появился
     ============================================================ */
  var nums = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    if (reduced) { el.textContent = target; return; }

    var duration = 1100;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);          // ease-out
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    nums.forEach(function (el) { el.textContent = el.dataset.count; });
  } else {
    var countIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { countIO.observe(el); });
  }

  /* ============================================================
     4. Карусель отзывов
     Прокрутка — нативная (свайп работает сам), JS только для
     стрелок, точек и автопрокрутки.
     ============================================================ */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel__track');
    var prev = root.querySelector('.carousel__nav--prev');
    var next = root.querySelector('.carousel__nav--next');
    var dotsBox = root.querySelector('.carousel__dots');
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    var paused = false;

    function perView() {
      var slideW = slides[0].getBoundingClientRect().width;
      return Math.max(1, Math.round(track.clientWidth / slideW));
    }
    function pageCount() { return Math.max(1, slides.length - perView() + 1); }
    function currentPage() {
      var slideW = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return Math.round(track.scrollLeft / (slideW + gap));
    }
    function goTo(i) {
      var slideW = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollTo({ left: i * (slideW + gap), behavior: reduced ? 'auto' : 'smooth' });
    }

    /* точки */
    var dots = [];
    function buildDots() {
      dotsBox.innerHTML = '';
      dots = [];
      for (var i = 0; i < pageCount(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Відгук ' + (i + 1));
        b.addEventListener('click', (function (n) {
          return function () { paused = true; goTo(n); };
        })(i));
        dotsBox.appendChild(b);
        dots.push(b);
      }
    }

    function sync() {
      var cur = Math.min(currentPage(), pageCount() - 1);
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === cur ? 'true' : 'false'); });
      if (prev) prev.disabled = cur <= 0;
      if (next) next.disabled = cur >= pageCount() - 1;
    }

    if (prev) prev.addEventListener('click', function () { paused = true; goTo(currentPage() - 1); });
    if (next) next.addEventListener('click', function () { paused = true; goTo(currentPage() + 1); });

    /* стрелки с клавиатуры, когда фокус на ленте */
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); paused = true; goTo(currentPage() + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); paused = true; goTo(currentPage() - 1); }
    });

    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(sync, 90);
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildDots(); sync(); }, 150);
    });

    /* «Читати повністю» — отзывы обрезаны до 9 строк */
    slides.forEach(function (card) {
      var quote = card.querySelector('blockquote');
      if (!quote) return;
      /* кнопка нужна только если текст реально не влез */
      if (quote.scrollHeight <= quote.clientHeight + 4) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rcard__more';
      btn.textContent = 'Читати повністю';
      btn.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        btn.textContent = open ? 'Згорнути' : 'Читати повністю';
        paused = true;
      });
      quote.insertAdjacentElement('afterend', btn);
    });

    /* автопрокрутка: стоит на паузе при наведении и после ручного клика */
    var delay = parseInt(root.dataset.autoplay, 10);
    if (delay && !reduced) {
      root.addEventListener('mouseenter', function () { paused = true; });
      root.addEventListener('mouseleave', function () { paused = false; });
      root.addEventListener('focusin', function () { paused = true; });
      track.addEventListener('touchstart', function () { paused = true; }, { passive: true });

      setInterval(function () {
        if (paused || document.hidden) return;
        var cur = currentPage();
        goTo(cur >= pageCount() - 1 ? 0 : cur + 1);
      }, delay);
    }

    buildDots();
    sync();
  });

  /* ============================================================
     5. Липкая кнопка — появляется, когда первый экран уехал вверх
     ============================================================ */
  var bar = document.getElementById('stickybar');
  if (bar) {
    bar.hidden = false;
    var hero = document.querySelector('.hero');
    var footer = document.querySelector('.footer');

    function toggleBar() {
      var pastHero = hero ? window.scrollY > hero.offsetHeight * 0.8 : window.scrollY > 500;
      /* у футера своя кнопка — прячем липкую, чтобы не дублировать */
      var atFooter = footer && footer.getBoundingClientRect().top < window.innerHeight;
      bar.classList.toggle('is-visible', pastHero && !atFooter);
    }
    window.addEventListener('scroll', toggleBar, { passive: true });
    toggleBar();
  }

  /* ============================================================
     6. YouTube — iframe грузится только по клику
     ============================================================ */
  document.querySelectorAll('.ytlite').forEach(function (box) {
    function play() {
      var id = box.dataset.yt;
      if (!id || id.indexOf('REPLACE') === 0) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = 'З чого складається INSIDE';
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(f);
      track('VideoPlay');
    }
    box.addEventListener('click', play);
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  });

  /* ============================================================
     7. Досмотр секций
     ============================================================ */
  if ('IntersectionObserver' in window) {
    var seen = new WeakSet();
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen.has(e.target)) {
          seen.add(e.target);
          track('SectionView', { section: e.target.id });
        }
      });
    }, { threshold: 0.35 });

    ['tariffs', 'program', 'reviews', 'support'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionIO.observe(el);
    });
  }
})();
