/* INSIDE — весь интерактив сайта. Без библиотек. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ============================================================
     Аналитика. Работает, только если пиксель подключён в <head>.
     ============================================================ */
  function track(name, params) {
    params = params || {};
    if (typeof gtag === 'function') gtag('event', name, params);
    if (typeof fbq === 'function') fbq('trackCustom', name, params);
    if (typeof ttq === 'object' && ttq.track) ttq.track(name, params);
  }

  $$('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      track('CTAClick', { cta: el.dataset.cta, text: el.textContent.trim().slice(0, 60) });
    });
  });

  /* ============================================================
     ПРОГРАММА КУРСА — вкладки
     Правки текста блоков делать здесь.
     ============================================================ */
  var MODULES = [
    { n: 1, title: 'Розбір матриці: як «читати» людей, як книгу',
      result: 'Окремо вивчаємо кожен блок матриці та починаємо розуміти причинно-наслідкові зв’язки, як вони впливають на стосунки, гроші та реалізацію',
      points: [
        'Вчимося знаходити підхід до будь-якої людини',
        'Розбираємо кожен показник по суті й на прикладах — без води. Простою мовою пояснюю не лише, що означає показник, а й як це працює насправді',
        'Перша практика: домашні завдання — не теорія про значення сектора, а можливість ЗРОЗУМІТИ й ЗАСТОСУВАТИ'
      ],
      tags: ['Бонусний урок'], milestone: '' },

    { n: 2, title: 'Як впливати на себе та на інших за допомогою розбору матриці',
      result: 'Зрозумієш, що насправді впливає на гроші, цілі та сімейність, а що — ні, і як допомогти собі та іншим',
      points: [
        'Навчишся будувати матрицю і дізнаєшся, чому люди змінюються з віком',
        'Відповіси на запитання, чому люди поводяться саме так, що ними керує',
        'Як керувати собою та своїми сильними й слабкими сторонами'
      ],
      tags: ['Бонусний урок'], milestone: '' },

    { n: 3, title: 'Призначення: як зрозуміти свої задачі і знайти себе',
      result: 'Розкриєш власний потенціал — і зможеш допомагати іншим робити те саме',
      points: [
        'Розберешся в різниці між числом душі та призначенням',
        'Зможеш зазирнути «в душу» іншої людини й зрозуміти, чому вона поводиться саме так'
      ],
      tags: [], milestone: '' },

    { n: 4, title: 'Коди: твої сильні і слабкі місця',
      result: 'Зрозумієш свої приховані таланти та сильні сторони і зможеш допомогти їх розкрити іншим',
      points: [
        'Усвідомиш, де твої слабкі місця — і навчишся з ними працювати',
        'Побачиш зв’язок між подіями у своєму житті та кодами в матриці',
        'Точно знатимеш, яке рішення отримають твої майбутні клієнти саме від тебе'
      ],
      tags: ['Бонусний урок'],
      milestone: 'Блок, після якого ти вже можеш робити перші розбори для клієнтів' },

    { n: 5, title: 'Сумісність. Як налагодити стосунки з іншими',
      result: 'Зробиш ревізію всіх своїх минулих стосунків — і побачиш, що саме й чому пішло не так',
      points: [
        'Зрозумієш, який партнер тобі потрібен, як його знайти і чого він чекатиме від тебе',
        'Усвідомиш, як впливаєш на інших людей і як вони впливають на тебе',
        'Зможеш створити послугу з розбору сумісності в парі та продавати її у своєму блозі'
      ],
      tags: ['Бонусний урок', '3 чек-листи'], milestone: '' },

    { n: 6, title: 'Енергія та ресурс. Чому всі вічно втомлені і як це виправити',
      result: 'Зрозумієш, де взяти енергію та ресурс, щоб діяти, і як допомогти в цьому іншим',
      points: [
        'Розрахуєш, як найкраще презентувати себе, щоб створювати навколо себе ком’юніті',
        'Розберешся в ангельських числах, ресурсних символах та кольорах',
        'Зможеш створити власну послугу, яка допомагатиме людям почуватися краще'
      ],
      tags: ['Бонусний блок', '3 чек-листи'], milestone: '' },

    { n: 7, title: 'Дитяча матриця. Як домовитися з внутрішньою дитиною',
      result: 'Проаналізуєш не лише себе, а й те, як батьки вплинули на те, ким ти є зараз',
      points: [
        'Налагодиш стосунки з дітьми (якщо вони в тебе є)',
        '90% людей плачуть на цьому блоці — від глибоких усвідомлень про батьків і дитинство'
      ],
      tags: ['Бонусний урок'], milestone: '' },

    { n: 8, title: 'Гроші, мислення і реалізація. Твоя фінансова стратегія',
      result: 'Як за допомогою матриці вплинути на гроші та проявленість',
      points: [
        'Які конкретні кроки зробити далі, щоб отримати результат',
        'Зможеш створити власну продуктову лінійку і продавати її',
        'Перестанеш роздавати знання просто так — і навчишся заробляти на цьому'
      ],
      tags: [], milestone: 'Фінал: власна продуктова лінійка і перші клієнти' }
  ];

  (function programTabs() {
    var tabsBox = $('#progTabs');
    var panel = $('#progPanel');
    if (!tabsBox || !panel) return;

    var active = 0;
    var tabs = [];
    var userPicked = false;   /* чтобы не скроллить при первой отрисовке */

    var wide = window.matchMedia('(min-width:901px)');
    /* Ширину берём с запасом: если она ещё неизвестна (0), считаем экран
       широким — иначе на десктопе панель осталась бы пустой. */
    var isWide = function () {
      var w = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
      return w === 0 ? true : w >= 901;
    };

    MODULES.forEach(function (m, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ptab';
      b.id = 'ptab-' + m.n;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'progPanel');

      var n = document.createElement('span');
      n.className = 'ptab__n';
      n.textContent = m.n;

      /* Заголовок кладём внутрь вложенного span, а сам .ptab__title
         хранит текст в data-text: CSS рисует поверх невидимую жирную
         копию и резервирует под неё высоту. Иначе при выборе вкладки
         текст жирнеет, становится шире и перескакивает на вторую строку. */
      var t = document.createElement('span');
      t.className = 'ptab__title';
      t.dataset.text = m.title;
      var tInner = document.createElement('span');
      tInner.textContent = m.title;
      t.appendChild(tInner);

      /* order нужен для мобильной гармошки: вкладки чётные, панель
         встаёт на нечётный сразу за выбранной. На десктопе не влияет. */
      b.style.order = i * 2;
      b.style.gridColumn = '1';

      b.appendChild(n);
      b.appendChild(t);
      /* Повторный клик закрывает блок только на мобильном (там гармошка).
         На десктопе панель всегда должна что-то показывать. */
      b.addEventListener('click', function () {
        userPicked = true;
        if (active === i && !isWide()) showPlaceholder();
        else select(i);
      });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        var next = (i + (e.key === 'ArrowDown' ? 1 : MODULES.length - 1)) % MODULES.length;
        userPicked = true;
        select(next);
        tabs[next].focus();
      });

      tabsBox.appendChild(b);
      tabs.push(b);
    });

    /* Ничего не выбрано: панель показывает подсказку, все вкладки закрыты. */
    function showPlaceholder() {
      active = -1;
      tabs.forEach(function (b) {
        b.setAttribute('aria-selected', 'false');
        b.tabIndex = 0;
      });
      panel.removeAttribute('aria-labelledby');
      panel.style.order = tabs.length * 2 + 1;
      panel.innerHTML = '';
      panel.classList.add('is-empty');
      panel.appendChild(el('p', 'ppanel__hint', 'Обери блок зі списку — і побач, що всередині.'));
    }

    function select(i) {
      active = i;
      var m = MODULES[i];

      tabs.forEach(function (b, k) {
        var on = k === i;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });

      panel.setAttribute('aria-labelledby', tabs[i].id);
      panel.style.order = i * 2 + 1;
      panel.classList.remove('is-empty');
      panel.innerHTML = '';

      panel.appendChild(el('p', 'ppanel__kicker', 'Блок ' + m.n + ' з ' + MODULES.length));
      panel.appendChild(el('h3', 'ppanel__title', m.title));
      panel.appendChild(el('p', 'ppanel__result', m.result));

      var ul = document.createElement('ul');
      ul.className = 'ppanel__points';
      m.points.forEach(function (p) { ul.appendChild(el('li', '', p)); });
      panel.appendChild(ul);

      if (m.tags.length) {
        var tagbox = document.createElement('div');
        tagbox.className = 'ppanel__tags';
        m.tags.forEach(function (t) { tagbox.appendChild(el('span', '', t)); });
        panel.appendChild(tagbox);
      }

      if (m.milestone) panel.appendChild(el('p', 'ppanel__milestone', m.milestone));

      /* На мобильном панель встаёт гармошкой под выбранной вкладкой.
         Если она вылезла за низ экрана — аккуратно подтягиваем в кадр,
         чтобы не приходилось искать текст прокруткой. */
      if (userPicked && window.matchMedia('(max-width:900px)').matches) {
        requestAnimationFrame(function () {
          var r = panel.getBoundingClientRect();
          var bottomLimit = window.innerHeight - 90;   /* запас под липкую кнопку */
          if (r.top < 80 || r.bottom > bottomLimit) {
            var y = window.scrollY + r.top - 96;       /* запас под верхнюю панель */
            window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
          }
        });
      }

      track('ProgramTab', { block: m.n });
    }

    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      e.textContent = text;
      return e;
    }

    /* На широком экране панель стоит рядом со списком — пусто там выглядит
       странно, поэтому первый блок открыт. На мобильном это гармошка:
       открытый блок сразу отодвигал бы остальные вкладки вниз, поэтому
       стартуем закрытыми. */
    if (isWide()) select(0); else showPlaceholder();

    /* при смене ширины подстраиваемся, но не спорим с выбором пользователя */
    wide.addEventListener('change', function (e) {
      if (userPicked) return;
      if (e.matches) select(0); else showPlaceholder();
    });
  })();

  /* ============================================================
     Выбор тарифа для бронирования
     Кнопки «Предзапис» в карточках ведут к блоку брони и сразу
     отмечают нужный вариант.
     ============================================================ */
  (function tariffPicker() {
    var opts = $$('.picker__opt');
    var label = $('#bookTariff');
    var btn = $('#bookBtn');
    if (!opts.length) return;

    function pick(name) {
      var found = false;
      opts.forEach(function (o) {
        var on = o.dataset.tariff === name;
        o.setAttribute('aria-checked', on ? 'true' : 'false');
        if (on) { found = true; if (label) label.textContent = o.textContent.trim(); }
      });
      if (found && btn) btn.dataset.tariff = name;
      return found;
    }

    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        pick(o.dataset.tariff);
        track('TariffPick', { tariff: o.dataset.tariff, from: 'picker' });
      });
    });

    /* клик по «Предзапис» в карточке тарифа */
    $$('[data-pick]').forEach(function (a) {
      a.addEventListener('click', function () {
        pick(a.dataset.pick);
        track('TariffPick', { tariff: a.dataset.pick, from: 'card' });
      });
    });

    /* стрелками между вариантами, как в настоящей радиогруппе */
    opts.forEach(function (o, i) {
      o.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var next = (i + (e.key === 'ArrowRight' ? 1 : opts.length - 1)) % opts.length;
        pick(opts[next].dataset.tariff);
        opts[next].focus();
      });
    });
  })();

  /* ============================================================
     Появление блоков при скролле
     ============================================================ */
  var reveals = $$('[data-reveal]');

  /* Показ блока. Важно: inline-стиль сильнее любого CSS, поэтому после
     завершения перехода inline transform и transition СНИМАЮТСЯ — иначе они
     навсегда блокируют :hover у карточек (тарифы переставали приподниматься
     и только подсвечивались). */
  function show(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
    setTimeout(function () {
      el.style.transform = '';
      el.style.transition = '';
    }, 1000);
  }

  if (reduced || !reveals.length) {
    reveals.forEach(show);
  } else {
    reveals.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      var d = (i % 4) * 70;
      el.style.transition = 'opacity .6s cubic-bezier(.2,.7,.3,1) ' + d + 'ms, transform .6s cubic-bezier(.2,.7,.3,1) ' + d + 'ms';
    });

    var ioWorks = false;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        ioWorks = true;
        entries.forEach(function (e) {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
      reveals.forEach(function (el) { io.observe(el); });
    }

    /* Страховка: если наблюдатель не отработал — показываем по геометрии.
       Контент важнее анимации. */
    var geoReveal = function () {
      reveals.forEach(function (el) {
        if (el.style.opacity === '1') return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.94 && r.bottom > -80) show(el);
      });
    };
    geoReveal();
    setTimeout(function () { ioWorks ? geoReveal() : reveals.forEach(show); }, 900);
    window.__geoReveal = geoReveal;
  }

  /* ============================================================
     Счётчики
     ============================================================ */
  $$('[data-count]').forEach(function (el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    if (reduced || !('IntersectionObserver' in window)) { el.textContent = target; return; }

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var dur = 1100, t0 = performance.now();
      var tick = function (t) {
        var p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);

    setTimeout(function () { if (el.textContent === '0') el.textContent = target; }, 2500);
  });

  /* ============================================================
     Автоподсветка карточки «Що чекає всередині»
     Та, что ближе к центру экрана, подсвечивается сама — на
     мобильном ховера нет, и без этого блок выглядит мёртвым.
     ============================================================ */
  var hlCards = $$('.features__grid > .fcard');
  var syncHighlight = null;

  if (hlCards.length && !reduced) {
    var hlCurrent = null;
    syncHighlight = function () {
      var mid = window.innerHeight * 0.45;
      var best = null, bestD = Infinity;

      hlCards.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.bottom < 40 || r.top > window.innerHeight - 40) return;
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = c; }
      });

      if (best === hlCurrent) return;
      if (hlCurrent) hlCurrent.classList.remove('is-near');
      hlCurrent = best;
      if (best) best.classList.add('is-near');
    };
    syncHighlight();
  }

  /* ============================================================
     Верхняя панель: бургер, подсветка раздела, прогресс
     ============================================================ */
  var burger = $('#burger');
  var menu = $('#mobilemenu');

  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = !menu.hidden;
      menu.hidden = open;
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    $$('[data-mnav]').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMenu();
  });

  var navLinks = $$('[data-nav]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var sections = navLinks.map(function (a) { return document.getElementById(a.dataset.nav); }).filter(Boolean);
    var so = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; })
                       .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!vis) return;
      navLinks.forEach(function (a) { a.classList.toggle('is-active', a.dataset.nav === vis.target.id); });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .2, .5] });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ============================================================
     Скролл: панель прячется вниз / показывается вверх,
     полоса прогресса, липкая кнопка на мобильном
     ============================================================ */
  var topbar = $('#topbar');
  var progress = $('#progress');
  var sticky = $('#stickybar');
  var lastY = 0;

  /* Пока идёт плавный прыжок по якорю из самой панели, не прячем её:
     иначе scroll-padding-top рассчитан на видимую панель, а она
     уезжает — и якорь «промахивается» на её высоту. */
  var keepBarUntil = 0;
  $$('#topbar a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { keepBarUntil = Date.now() + 1200; });
  });

  function onScroll() {
    if (window.__geoReveal) window.__geoReveal();
    if (syncHighlight) syncHighlight();

    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    if (topbar) {
      var past = y > window.innerHeight * 0.7;
      var menuOpen = menu && !menu.hidden;
      if (!past) topbar.style.transform = 'translateY(-100%)';
      else if (menuOpen || y < lastY - 4 || Date.now() < keepBarUntil) topbar.style.transform = 'translateY(0)';
      else if (y > lastY + 4) { topbar.style.transform = 'translateY(-100%)'; closeMenu(); }
    }
    if (Math.abs(y - lastY) > 4) lastY = y;

    if (progress) progress.style.width = Math.min(100, (y / max) * 100) + '%';

    if (sticky) {
      /* у футера своя кнопка — липкую прячем, чтобы не дублировать */
      var nearEnd = y > max - 420;
      var vis = window.innerWidth <= 720 && y > window.innerHeight * 0.9 && !nearEnd;
      sticky.style.transform = vis ? 'translateY(0)' : 'translateY(140%)';
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ============================================================
     Отзывы: бесконечная лента
     Карточки дублируются один раз, прокрутка заворачивается по
     ширине оригинального набора — стыка не видно ни в одну сторону.
     ============================================================ */
  var track$ = $('#rtrack');
  if (track$ && track$.querySelector('figure')) {
    var GAP = 18;
    var originals = $$('figure', track$);

    originals.forEach(function (el) {
      var c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      /* клоны не должны попадать в таб-порядок и в озвучку скринридером */
      $$('a,button,[tabindex]', c).forEach(function (n) { n.tabIndex = -1; });
      track$.appendChild(c);
    });

    var halfWidth = function () {
      return originals.reduce(function (sum, el) { return sum + el.offsetWidth + GAP; }, 0);
    };
    var wrap = function (x) {
      var h = halfWidth();
      if (h <= 0) return x;
      return ((x % h) + h) % h;
    };

    var DUR = 480;
    var raf = null;
    /* Отсечка по времени, а не флаг «идёт анимация»: если кадр почему-то
       не придёт (фоновая вкладка, экономия энергии), она истечёт сама
       и заворот ленты продолжит работать. */
    var animUntil = 0;

    var tween = function (delta) {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (reduced) { track$.scrollLeft = wrap(track$.scrollLeft + delta); return; }

      var from = track$.scrollLeft;
      var t0 = performance.now();
      animUntil = t0 + DUR + 80;

      /* scroll-snap:mandatory дощёлкивает ленту к ближайшей карточке на
         каждом кадре и превращает анимацию в рывок. Снимаем снап на время
         анимации и возвращаем в конце — свайп пальцем снап сохраняет. */
      track$.style.scrollSnapType = 'none';

      var step = function (now) {
        var p = Math.min(1, (now - t0) / DUR);
        var e = 1 - Math.pow(1 - p, 3);
        track$.scrollLeft = wrap(from + delta * e);
        if (p < 1) { raf = requestAnimationFrame(step); }
        else {
          raf = null; animUntil = 0;
          track$.style.scrollSnapType = '';
        }
      };
      raf = requestAnimationFrame(step);
    };

    /* ручной свайп тоже заворачиваем — но не мешаем текущей анимации */
    track$.addEventListener('scroll', function () {
      if (performance.now() < animUntil) return;
      var w = wrap(track$.scrollLeft);
      if (Math.abs(w - track$.scrollLeft) > 1) track$.scrollLeft = w;
    }, { passive: true });

    var stepWidth = function () {
      var card = track$.querySelector('figure');
      return (card ? card.offsetWidth : 360) + GAP;
    };

    $$('[data-scroll]').forEach(function (b) {
      b.addEventListener('click', function () { tween(stepWidth() * parseInt(b.dataset.scroll, 10)); });
    });

    track$.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      tween(e.key === 'ArrowRight' ? stepWidth() : -stepWidth());
    });
  }

  /* ============================================================
     Видео в макете телефона — всегда без звука и по кругу
     ============================================================ */
  var phoneVideo = $('.phone__video');
  if (phoneVideo) {
    phoneVideo.muted = true;
    phoneVideo.defaultMuted = true;
    phoneVideo.volume = 0;
    phoneVideo.loop = true;
    phoneVideo.removeAttribute('controls');
    /* autoplay в разметке может не сработать — дожимаем вручную */
    var tryPlay = function () { var p = phoneVideo.play(); if (p) p.catch(function () {}); };
    tryPlay();
    phoneVideo.addEventListener('loadeddata', tryPlay);
    phoneVideo.addEventListener('volumechange', function () {
      if (!phoneVideo.muted) { phoneVideo.muted = true; phoneVideo.volume = 0; }
    });
  }

  /* ============================================================
     YouTube — iframe грузится только по клику
     ============================================================ */
  var yt = $('#ytlite');
  if (yt) {
    var play = function () {
      var id = yt.dataset.yt;
      if (!id) return;
      yt.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0"' +
        ' title="З чого складається INSIDE"' +
        ' allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      track('VideoPlay');
    };
    yt.addEventListener('click', play);
    yt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  }

  /* ============================================================
     Досмотр секций
     ============================================================ */
  if ('IntersectionObserver' in window) {
    var seen = new WeakSet();
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen.has(e.target)) {
          seen.add(e.target);
          track('SectionView', { section: e.target.id });
        }
      });
    }, { threshold: 0.35 });
    ['tariffs', 'program', 'reviews', 'support'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sio.observe(el);
    });
  }
})();
