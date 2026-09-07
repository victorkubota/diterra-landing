/* ══════════════════════════════════════════════════════════════════════
   NAV PÍLULA — alternativa à barra atual, para comparação lado a lado.

   Liga:    qualquer rota com ?nav=pilula (fica gravado no navegador)
   Desliga: qualquer rota com ?nav=barra

   Modelo: craft.do. A pílula nasce escondida e aparece depois que a
   página rola. Ao pousar o mouse num item, a própria pílula cresce para
   baixo e mostra cards; os outros links esmaecem.

   Carrega no <head> sem defer de propósito: a classe html.nav-pilula
   precisa existir antes da primeira pintura, senão a barra antiga pisca
   e some. A montagem do DOM espera o documento.

   O que a pílula sabe de cada universo (logo, itens, alternador, ação)
   mora em CONTEXTOS. Espaços e Soluções são os mesmos dicionários do
   gerador (tools/gerar-paginas.py), copiados aqui em forma resumida.
   Quando o painel de visita (PR 8) existir, o destino da ação troca.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CHAVE = 'diterra-nav';
  var modo = new URLSearchParams(window.location.search).get('nav');
  var salvo = null;
  try {
    if (modo === 'pilula') window.localStorage.setItem(CHAVE, 'pilula');
    else if (modo === 'barra') window.localStorage.removeItem(CHAVE);
    salvo = window.localStorage.getItem(CHAVE);
  } catch (e) { /* armazenamento bloqueado: só a URL decide */ }

  var ativa = modo === 'pilula' || (modo !== 'barra' && salvo === 'pilula');
  if (!ativa) return;
  document.documentElement.classList.add('nav-pilula');

  var BLOG = 'https://diterra.com.br/blog/';
  var API  = 'https://diterra.com.br/wp-json/wp/v2/posts?per_page=1&_embed=wp:featuredmedia';
  var ROLAGEM_MINIMA = 24;   /* px rolados antes de a pílula aparecer */

  var ESPACOS = [
    { slug: 'a-querencia',           nome: 'A Querência',           resumo: 'Salão coberto e jardim para celebrações de grande porte.' },
    { slug: 'palacete-monte-alegre', nome: 'Palacete Monte Alegre', resumo: 'Arquitetura histórica para celebrações de assinatura.' },
    { slug: 'casa-lucca',            nome: 'Casa Lucca',            resumo: 'Escala menor e ambiente reservado para celebrações intimistas.' },
    { slug: 'espaco-terra',          nome: 'Espaço Terrá',          resumo: 'Estrutura versátil com horizonte aberto do interior paulista.' }
  ];
  var SOLUCOES = [
    { slug: 'gastronomia',            nome: 'Gastronomia',            resumo: 'Menu autoral, do welcome ao doce da madrugada.' },
    { slug: 'decoracao',              nome: 'Decoração',              resumo: 'Cenografia, flores e ambientação sob medida.' },
    { slug: 'coquetelaria',           nome: 'Coquetelaria',           resumo: 'Bar assinado, drinks autorais e serviço dedicado.' },
    { slug: 'producao',               nome: 'Produção',               resumo: 'Planejamento, cronograma e operação no dia.' },
    { slug: 'tecnologia-audiovisual', nome: 'Tecnologia audiovisual', resumo: 'Som, luz, projeção e transmissão.' }
  ];

  var corporativo = window.location.pathname.indexOf('/corporativo') === 0;
  var CONTEXTOS = {
    social: {
      logo: '/assets/brand/social-wordmark-navy.png', alt: 'Di Terrá Eventos', inicio: '/social',
      itens: [
        { rotulo: 'Espaços',  href: '/social/espacos',  menu: 'espacos' },
        { rotulo: 'Soluções', href: '/social/solucoes', menu: 'solucoes' },
        { rotulo: 'Sobre',    href: '/sobre' },
        { rotulo: 'Blog',     href: BLOG, menu: 'blog', externo: true }
      ],
      alternador: { rotulo: 'Corporativo', href: '/corporativo' },
      acao: { rotulo: 'Agendar visita', href: '/social#contato' } /* abre o painel no PR 8 */
    },
    corporativo: {
      logo: '/assets/brand/corp-horizontal-navy.png', alt: 'Di Terrá Corporativo', inicio: '/corporativo',
      itens: [
        { rotulo: 'Formatos', href: '/corporativo#formatos' },
        { rotulo: 'Espaços',  href: '/corporativo#espacos', menu: 'espacos' },
        { rotulo: 'Sobre',    href: '/sobre' },
        { rotulo: 'Blog',     href: BLOG, menu: 'blog', externo: true }
      ],
      alternador: { rotulo: 'Eventos sociais', href: '/social' },
      acao: { rotulo: 'Agendar visita', href: '/corporativo#proposta' }
    }
  };
  var ctx = corporativo ? CONTEXTOS.corporativo : CONTEXTOS.social;

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var card = function (href, titulo, texto, img) {
    return '<a class="pil__card" href="' + href + '">' +
      '<span class="pil__card-head">' + (img ? '<img src="' + img + '" alt="" width="44" height="44">' : '') +
      '<b>' + esc(titulo) + '</b></span>' + (texto ? '<p>' + esc(texto) + '</p>' : '') + '</a>';
  };
  var atalho = function (href, titulo) {
    return '<a class="pil__card pil__card--curto" href="' + href + '"><span class="pil__card-head"><b>' + esc(titulo) + '</b></span></a>';
  };

  var PAINEIS = {
    espacos: function () {
      return '<div class="pil__grid"><div class="pil__col2">' + ESPACOS.map(function (e) {
        return card('/social/espacos/' + e.slug, e.nome, e.resumo, '/assets/opt/' + e.slug + '-amplitude-800.webp');
      }).join('') + '</div><div class="pil__aside">' +
        atalho('/social/espacos', 'Todos os espaços') + atalho(ctx.acao.href, 'Agendar visita') + '</div></div>';
    },
    solucoes: function () {
      return '<div class="pil__grid"><div class="pil__col2">' + SOLUCOES.map(function (s) {
        return card('/social/solucoes/' + s.slug, s.nome, s.resumo, null);
      }).join('') + '</div><div class="pil__aside">' +
        atalho('/social/solucoes', 'Todas as soluções') + atalho(ctx.acao.href, 'Agendar visita') + '</div></div>';
    },
    /* nasce com o post mais recente conhecido; a API troca pelo atual */
    blog: function () {
      return '<div class="pil__grid"><div class="pil__col2">' +
        '<a class="pil__card pil__post" id="pilPost" href="https://diterra.com.br/destination-wedding-no-interior-de-sp-como-funciona-e-porque-escolher/" target="_blank" rel="noopener">' +
        '<span class="pil__card-head"><img id="pilPostImg" src="/assets/opt/cerimonia-vertical-800.webp" alt="" width="96" height="72">' +
        '<span><small>Último post</small><b id="pilPostTitulo">Destination Wedding no Interior de SP: como funciona e por que escolher</b></span></span></a>' +
        '</div><div class="pil__aside">' + atalho(BLOG, 'Ver todos os posts') + '</div></div>';
    }
  };

  var montar = function () {
    var gaveta = document.getElementById('navDrawer');
    var nav = document.createElement('div');
    nav.className = 'pil';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navegação principal');

    var aqui = window.location.pathname.replace(/\/$/, '');
    var html = '<div class="pil__row"><a class="pil__logo" href="' + ctx.inicio + '" aria-label="' + esc(ctx.alt) + ', início">' +
      '<img src="' + ctx.logo + '" alt="' + esc(ctx.alt) + '"></a><ul class="pil__list">';
    ctx.itens.forEach(function (it) {
      var atual = aqui === it.href.replace(/#.*$/, '') && it.href.indexOf('#') === -1 ? ' aria-current="page"' : '';
      var ext = it.externo ? ' target="_blank" rel="noopener"' : '';
      html += '<li class="pil__item"><a class="pil__link" href="' + it.href + '"' + atual + ext +
        (it.menu ? ' data-menu="' + it.menu + '" aria-haspopup="true" aria-expanded="false" aria-controls="pilPainel-' + it.menu + '"' : '') +
        '>' + esc(it.rotulo) + '</a></li>';
    });
    html += '</ul><div class="pil__side">' +
      '<a class="pil__switch" href="' + ctx.alternador.href + '">' + esc(ctx.alternador.rotulo) + '</a>' +
      '<a class="pil__cta" href="' + ctx.acao.href + '">' + esc(ctx.acao.rotulo) + '</a>' +
      (gaveta ? '<button class="pil__toggle" type="button" aria-expanded="false" aria-controls="navDrawer" aria-label="Abrir menu"><span></span><span></span></button>' : '') +
      '</div></div><div class="pil__mega"><div>';
    ctx.itens.forEach(function (it) {
      if (it.menu) html += '<div class="pil__panel" id="pilPainel-' + it.menu + '" data-panel="' + it.menu + '">' + PAINEIS[it.menu]() + '</div>';
    });
    html += '</div></div>';
    nav.innerHTML = html;
    document.body.insertBefore(nav, document.body.firstChild);

    var links = Array.prototype.slice.call(nav.querySelectorAll('.pil__link[data-menu]'));
    var paineis = Array.prototype.slice.call(nav.querySelectorAll('.pil__panel'));
    var atraso = null;

    var fechar = function () {
      nav.classList.remove('is-open');
      links.forEach(function (a) { a.classList.remove('is-active'); a.setAttribute('aria-expanded', 'false'); });
      paineis.forEach(function (p) { p.classList.remove('is-on'); });
    };
    var abrir = function (menu) {
      window.clearTimeout(atraso);
      links.forEach(function (a) {
        var on = a.getAttribute('data-menu') === menu;
        a.classList.toggle('is-active', on);
        a.setAttribute('aria-expanded', String(on));
      });
      paineis.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-panel') === menu); });
      nav.classList.add('is-open');
    };

    /* ── aparece só depois que a página rola ───────────────────────── */
    var mostrar = function () {
      var visivel = window.scrollY > ROLAGEM_MINIMA;
      nav.classList.toggle('is-visible', visivel);
      if (!visivel) fechar();
    };
    window.addEventListener('scroll', mostrar, { passive: true });
    mostrar();

    /* ── painéis: mouse abre ao pousar; teclado e toque abrem aqui ── */
    var podeHover = window.matchMedia('(hover: hover)').matches;
    Array.prototype.forEach.call(nav.querySelectorAll('.pil__link'), function (a) {
      var menu = a.getAttribute('data-menu');
      if (podeHover) {
        a.addEventListener('mouseenter', function () { if (menu) abrir(menu); else fechar(); });
      }
      if (!menu) return;
      a.addEventListener('click', function (e) {
        /* no toque, o primeiro toque abre; o segundo segue o link */
        if (podeHover || a.classList.contains('is-active')) return;
        e.preventDefault();
        abrir(menu);
      });
      a.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || ((e.key === 'Enter' || e.key === ' ') && !a.classList.contains('is-active'))) {
          e.preventDefault();
          abrir(menu);
          var primeiro = nav.querySelector('.pil__panel.is-on a');
          if (primeiro) primeiro.focus();
        }
      });
    });
    nav.addEventListener('mouseleave', function () { atraso = window.setTimeout(fechar, 160); });
    nav.addEventListener('mouseenter', function () { window.clearTimeout(atraso); });
    nav.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        var ativo = nav.querySelector('.pil__link.is-active');
        fechar();
        if (ativo) ativo.focus();
      }
    });
    nav.addEventListener('focusout', function (e) {
      if (!nav.contains(e.relatedTarget)) fechar();
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) fechar();
    });

    /* ── celular: o hambúrguer da pílula abre a gaveta que já existe ─ */
    var toggle = nav.querySelector('.pil__toggle');
    if (toggle && gaveta) {
      var pintar = function (aberto) {
        gaveta.classList.toggle('is-open', aberto);
        toggle.setAttribute('aria-expanded', String(aberto));
        toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      };
      toggle.addEventListener('click', function () {
        pintar(!gaveta.classList.contains('is-open'));
      });
      gaveta.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') pintar(false);
      });
      /* o site.js também fecha a gaveta no Escape e pode rodar antes;
         por isso o critério é o estado deste botão, não o da gaveta */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { pintar(false); toggle.focus(); }
      });
    }

    /* ── blog: troca o post fixo pelo mais recente da API ──────────── */
    if (window.fetch && document.getElementById('pilPost')) {
      window.fetch(API).then(function (r) { return r.ok ? r.json() : null; }).then(function (lista) {
        var p = lista && lista[0];
        if (!p || !p.link || !p.title) return;
        document.getElementById('pilPost').href = p.link;
        /* o título vem com entidades (&#8217;): decodifica sem injetar HTML */
        var caixa = document.createElement('textarea');
        caixa.innerHTML = p.title.rendered;
        document.getElementById('pilPostTitulo').textContent = caixa.value;
        var midia = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
        var tam = midia && midia.media_details && midia.media_details.sizes;
        var src = (tam && tam.medium && tam.medium.source_url) || (midia && midia.source_url);
        if (src) document.getElementById('pilPostImg').src = src;
      }).catch(function () { /* fica o post fixo */ });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
