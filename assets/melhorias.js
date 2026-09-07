/* ══════════════════════════════════════════════════════════════════════
   MELHORIAS DA RODADA 3 — comportamento compartilhado pelas rotas.
   docs/plano-melhorias-rodada-3.md descreve cada peça.

   · lightbox para qualquer <a data-lightbox="grupo"> com <img> dentro
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── lightbox ──────────────────────────────────────────────────── */
  var gatilhos = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
  if (gatilhos.length) {
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Foto ampliada');
    lb.innerHTML =
      '<button class="lb__btn lb__fechar" type="button" aria-label="Fechar"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M2 2l18 18M20 2L2 20" stroke="currentColor" stroke-width="1.2"/></svg></button>' +
      '<button class="lb__btn lb__ant" type="button" aria-label="Foto anterior"><svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M16 6H1M5 1L.6 6 5 11" stroke="currentColor" stroke-width="1.2"/></svg></button>' +
      '<img alt="">' +
      '<button class="lb__btn lb__prox" type="button" aria-label="Próxima foto"><svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M0 6h15M11 1l4.4 5L11 11" stroke="currentColor" stroke-width="1.2"/></svg></button>' +
      '<p class="lb__legenda"></p>';
    document.body.appendChild(lb);
    var img = lb.querySelector('img');
    var legenda = lb.querySelector('.lb__legenda');
    var grupo = [], atual = 0, origem = null;

    var mostrar = function (i) {
      atual = (i + grupo.length) % grupo.length;
      var a = grupo[atual];
      img.src = a.getAttribute('href');
      img.alt = (a.querySelector('img') || {}).alt || '';
      legenda.textContent = (atual + 1) + ' / ' + grupo.length + (img.alt ? ' · ' + img.alt : '');
    };
    var abrir = function (a) {
      var nome = a.getAttribute('data-lightbox');
      grupo = gatilhos.filter(function (g) { return g.getAttribute('data-lightbox') === nome; });
      origem = a;
      mostrar(grupo.indexOf(a));
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb__fechar').focus();
    };
    var fechar = function () {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (origem) origem.focus();
    };

    gatilhos.forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); abrir(a); });
    });
    lb.querySelector('.lb__fechar').addEventListener('click', fechar);
    lb.querySelector('.lb__ant').addEventListener('click', function () { mostrar(atual - 1); });
    lb.querySelector('.lb__prox').addEventListener('click', function () { mostrar(atual + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') fechar();
      else if (e.key === 'ArrowLeft') mostrar(atual - 1);
      else if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  }
})();
