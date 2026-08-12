/* ══════════════════════════════════════════════════════════════════════
   Comportamento compartilhado das páginas internas do site social:
   nav sólida, menu mobile, entrada dos blocos e botão de voltar ao topo.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var nav    = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('navDrawer');
  var toTop  = document.getElementById('toTop');
  var hero   = document.getElementById('topo');

  /* ── nav ganha fundo ao sair do hero ─────────────────────────────── */
  if (nav && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { rootMargin: '-85% 0px 0px 0px' }).observe(hero);
  } else if (nav) {
    nav.classList.add('is-stuck');
  }

  /* ── menu mobile ─────────────────────────────────────────────────── */
  if (toggle && drawer) {
    var fechar = function () {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', function () {
      var aberto = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(aberto));
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = aberto ? 'hidden' : '';
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') fechar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        fechar();
        toggle.focus();
      }
    });
  }

  /* ── entrada dos blocos ──────────────────────────────────────────────
     Quem chega por link com âncora começa no meio do documento; o que
     ficou acima nunca cruzaria o observer, então é revelado de imediato. */
  var blocos = document.querySelectorAll('.rise');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(blocos, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(blocos, function (el) { el.classList.add('is-in'); });
  }

  /* ── voltar ao topo ──────────────────────────────────────────────── */
  if (toTop) {
    var pendente = false;

    var atualizar = function () {
      toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
      pendente = false;
    };

    window.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      window.requestAnimationFrame(atualizar);
    }, { passive: true });

    atualizar();

    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduz ? 'auto' : 'smooth' });
      /* devolve o foco ao início do documento para quem navega por teclado */
      var alvo = document.querySelector('.nav__logo');
      if (alvo) alvo.focus({ preventScroll: true });
    });
  }
})();
