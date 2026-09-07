/* ══════════════════════════════════════════════════════════════════════
   MELHORIAS DA RODADA 3 — comportamento compartilhado pelas rotas.
   docs/plano-melhorias-rodada-3.md descreve cada peça.

   · lightbox para qualquer <a data-lightbox="grupo"> com <img> dentro
   · #blogPosts: troca os três posts fixos pelos mais recentes da API
   · <video data-hero-video="nome">: toca o mp4 do acervo em tela larga e com
     movimento permitido; no celular a foto por trás assume
   · painel "Agendar visita": abre em qualquer <a data-visita>; o valor do
     atributo (slug da casa) pré-seleciona o espaço. Sem destino ainda.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* com um diálogo aberto, o resto da página sai da ordem de Tab */
  var prender = function (aberto) {
    Array.prototype.forEach.call(document.querySelectorAll('main, footer.foot, .barra-acao, .pil, .nav'), function (el) { el.inert = aberto; });
  };

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
      prender(true);
      lb.querySelector('.lb__fechar').focus();
    };
    var fechar = function () {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      prender(false);
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

  /* ── painel "Agendar visita" ───────────────────────────────────── */
  var CASAS = [['a-querencia','A Querência'],['palacete-monte-alegre','Palacete Monte Alegre'],['casa-lucca','Casa Lucca'],['espaco-terra','Espaço Terrá']];
  var painel = document.createElement('aside');
  painel.className = 'visita';
  painel.id = 'visita';
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-modal', 'true');
  painel.setAttribute('aria-labelledby', 'visitaTitulo');
  painel.hidden = true;
  painel.innerHTML =
    '<div class="visita__veu" data-fechar></div>' +
    '<div class="visita__caixa">' +
      '<button class="visita__fechar" type="button" aria-label="Fechar" data-fechar><svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M2 2l18 18M20 2L2 20" stroke="currentColor" stroke-width="1.2"/></svg></button>' +
      '<p class="eyebrow">Agendar visita</p>' +
      '<h2 class="h-section" id="visitaTitulo">Venha conhecer a casa</h2>' +
      '<p class="visita__texto">Conte o básico e a equipe confirma dia e horário pelo WhatsApp.</p>' +
      '<form class="visita__form" novalidate>' +
        '<label class="visita__campo"><span>Nome</span><input type="text" name="nome" autocomplete="name" required></label>' +
        '<label class="visita__campo"><span>WhatsApp</span><input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="(19) 9 0000-0000" required></label>' +
        '<div class="visita__linha">' +
          '<label class="visita__campo"><span>Data pretendida</span><input type="text" name="data" placeholder="Ex.: março de 2027"></label>' +
          '<label class="visita__campo"><span>Convidados</span><input type="number" name="convidados" min="10" max="1500" inputmode="numeric" placeholder="120"></label>' +
        '</div>' +
        '<label class="visita__campo"><span>Casa</span><select name="casa"><option value="">Ainda não sei</option>' +
          CASAS.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + '</option>'; }).join('') + '</select></label>' +
        '<p class="visita__erro" aria-live="polite" hidden></p>' +
        '<button class="btn btn--primary visita__enviar" type="submit">Enviar</button>' +
        '<p class="visita__nota">Sem compromisso. A visita é com a equipe que vai cuidar do seu evento.</p>' +
      '</form>' +
      '<div class="visita__ok" hidden><p class="script">Recebemos</p><h3 class="h-card" id="visitaResumo"></h3><p class="visita__texto">Abrimos o seu e-mail com o pedido pronto para a equipe. A confirmação de dia e horário vem pelo WhatsApp em até um dia útil.</p><p class="visita__texto">Se preferir, chame agora: <a href="https://wa.me/5519996777288" target="_blank" rel="noopener">(19) 99677-7288</a>.</p></div>' +
    '</div>';
  document.body.appendChild(painel);

  var form = painel.querySelector('form');
  var erro = painel.querySelector('.visita__erro');
  var ok = painel.querySelector('.visita__ok');
  var origemVisita = null;
  var casaDaPagina = (window.location.pathname.match(/\/social\/espacos\/([a-z-]+)/) || [])[1] || '';

  var abrirVisita = function (casa, origem) {
    origemVisita = origem || null;
    form.hidden = false; ok.hidden = true; erro.hidden = true;
    form.casa.value = casa || '';
    painel.hidden = false;
    document.body.style.overflow = 'hidden';
    prender(true);
    window.requestAnimationFrame(function () {
      painel.classList.add('is-open');
      form.nome.focus();
    });
  };
  var fecharVisita = function () {
    painel.classList.remove('is-open');
    document.body.style.overflow = '';
    prender(false);
    window.setTimeout(function () { painel.hidden = true; }, 350);
    if (origemVisita) origemVisita.focus();
  };

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-visita]');
    if (!a) return;
    e.preventDefault();
    var casa = a.getAttribute('data-visita') || casaDaPagina;
    if (CASAS.map(function (c) { return c[0]; }).indexOf(casa) === -1) casa = '';
    abrirVisita(casa, a);
  });
  Array.prototype.forEach.call(painel.querySelectorAll('[data-fechar]'), function (b) { b.addEventListener('click', fecharVisita); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !painel.hidden) fecharVisita();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var faltam = [];
    if (!form.nome.value.trim()) faltam.push('nome');
    if (!/^[\d\s()+-]{8,}$/.test(form.whatsapp.value.trim())) faltam.push('WhatsApp');
    if (faltam.length) {
      erro.textContent = 'Confira: ' + faltam.join(' e ') + '.';
      erro.hidden = false;
      (faltam[0] === 'nome' ? form.nome : form.whatsapp).focus();
      return;
    }
    /* Sem endpoint conectado, o pedido segue pelo mesmo caminho do
       formulário longo (formulario.js): abre o e-mail do visitante com a
       mensagem pronta para o comercial. A confirmação repete o que a
       pessoa pediu, para ela conferir antes de fechar. */
    var dados = {};
    Array.prototype.forEach.call(form.elements, function (el) { if (el.name) dados[el.name] = el.value; });
    var nomeCasa = (CASAS.filter(function (c) { return c[0] === dados.casa; })[0] || [null, 'casa a definir'])[1];
    var partes = [nomeCasa];
    if (dados.data) partes.push(dados.data);
    if (dados.convidados) partes.push(dados.convidados + ' convidados');
    document.getElementById('visitaResumo').textContent = partes.join(', ') + '.';
    var corpo = 'Pedido de visita pelo site\n\n' +
      'Nome: ' + dados.nome + '\nWhatsApp: ' + dados.whatsapp + '\nCasa: ' + nomeCasa +
      '\nData pretendida: ' + (dados.data || 'a definir') + '\nConvidados: ' + (dados.convidados || 'a definir') + '\n';
    window.location.href = 'mailto:contato@diterra.com.br?subject=' +
      encodeURIComponent('Visita: ' + nomeCasa + (dados.data ? ', ' + dados.data : '')) +
      '&body=' + encodeURIComponent(corpo);
    form.hidden = true; ok.hidden = false;
    painel.querySelector('.visita__fechar').focus();
  });

  /* ── vídeo nos heroes ──────────────────────────────────────────── */
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var economia = navigator.connection && navigator.connection.saveData;
  var ligarVideos = function () {
    Array.prototype.forEach.call(document.querySelectorAll('video[data-hero-video]'), function (v) {
      if (semMovimento || economia || !window.matchMedia('(min-width: 768px)').matches) return;
      var nome = v.getAttribute('data-hero-video');
      var grande = v.hasAttribute('data-1920') && window.matchMedia('(min-width: 1440px)').matches;
      v.src = '/assets/opt/video/' + nome + '-' + (grande ? '1920' : '1280') + '.mp4';
      v.hidden = false;
      var tocar = v.play();
      if (tocar && tocar.catch) tocar.catch(function () { v.hidden = true; });
    });
  };
  /* o vídeo espera a página carregar: não disputa banda com o LCP */
  if (document.readyState === 'complete') ligarVideos(); else window.addEventListener('load', ligarVideos, { once: true });

  /* ── pausar vídeo (WCAG 2.2.2): um botão por vídeo de fundo ──────
     Cobre os vídeos do melhorias.js e os que o portal e o corporativo
     ligam sozinhos (#stageVideo, #heroVideo). Aparece quando o vídeo
     começa a tocar; some se ele nunca tocar. */
  Array.prototype.forEach.call(document.querySelectorAll('video[data-hero-video], #stageVideo, #heroVideo'), function (v) {
    var palco = v.closest('.hero, .page-hero, .stage, header, section') || v.parentNode;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'video-pausa'; b.hidden = true;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<span>Pausar vídeo</span>';
    palco.appendChild(b);
    v.addEventListener('playing', function () { b.hidden = false; }, { once: true });
    b.addEventListener('click', function () {
      var pausar = !v.paused;
      if (pausar) v.pause(); else v.play();
      b.setAttribute('aria-pressed', String(pausar));
      b.querySelector('span').textContent = pausar ? 'Retomar vídeo' : 'Pausar vídeo';
    });
  });
})();
