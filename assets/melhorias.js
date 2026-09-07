/* ══════════════════════════════════════════════════════════════════════
   MELHORIAS DA RODADA 3 — comportamento compartilhado pelas rotas.
   docs/plano-melhorias-rodada-3.md descreve cada peça.

   · lightbox para qualquer <a data-lightbox="grupo"> com <img> dentro
   · #blogPosts: troca os três posts fixos pelos mais recentes da API
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

  /* ── do blog: três posts mais recentes da API do WordPress ─────── */
  var lista = document.getElementById('blogPosts');
  if (lista && window.fetch) {
    var API = 'https://diterra.com.br/wp-json/wp/v2/posts?per_page=3&_embed=wp:featuredmedia';
    var decodificar = function (html) { var t = document.createElement('textarea'); t.innerHTML = html; return t.value; };
    var dataLonga = function (iso) {
      var d = new Date(iso);
      if (isNaN(d)) return '';
      return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    };
    window.fetch(API).then(function (r) { return r.ok ? r.json() : null; }).then(function (posts) {
      if (!posts || posts.length < 3) return;
      var cards = lista.querySelectorAll('.post');
      posts.slice(0, 3).forEach(function (p, i) {
        var a = cards[i];
        if (!a || !p.link || !p.title) return;
        a.href = p.link;
        a.querySelector('.post__titulo').textContent = decodificar(p.title.rendered);
        var t = a.querySelector('.post__data');
        if (t) { t.textContent = dataLonga(p.date); t.setAttribute('datetime', p.date); }
        var midia = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
        var tam = midia && midia.media_details && midia.media_details.sizes;
        var src = (tam && tam.large && tam.large.source_url) || (tam && tam.medium_large && tam.medium_large.source_url) || (midia && midia.source_url);
        if (src) a.querySelector('.post__capa img').src = src;
      });
    }).catch(function () { /* ficam os três posts fixos */ });
  }
})();
