/* ══════════════════════════════════════════════════════════════════════
   NAV PÍLULA — alternativa à barra atual, para comparação lado a lado.

   Liga:    qualquer rota com ?nav=pilula (fica gravado no navegador)
   Desliga: qualquer rota com ?nav=barra

   Carrega no <head> sem defer de propósito: a classe html.nav-pilula
   precisa existir antes da primeira pintura, senão a barra antiga pisca
   e some. A montagem do DOM espera o documento.

   O que a pílula sabe de cada universo (logo, itens, alternador, ação)
   mora em CONTEXTOS. Espaços e Soluções são os mesmos dicionários do
   gerador (tools/gerar-paginas.py), copiados aqui em forma resumida.
   Quando Sobre (PR 4) e o painel de visita (PR 8) existirem, os dois
   destinos provisórios abaixo trocam de href.
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

  var ESPACOS = [
    { slug: 'a-querencia',           nome: 'A Querência',           resumo: 'Salão coberto e jardim para celebrações de grande porte.' },
    { slug: 'palacete-monte-alegre', nome: 'Palacete Monte Alegre', resumo: 'Arquitetura histórica para celebrações de assinatura.' },
    { slug: 'casa-lucca',            nome: 'Casa Lucca',            resumo: 'Escala menor e ambiente reservado para celebrações intimistas.' },
    { slug: 'espaco-terra',          nome: 'Espaço Terrá',          resumo: 'Estrutura versátil com horizonte aberto do interior paulista.' }
  ];
  var SOLUCOES = [
    { slug: 'gastronomia',            nome: 'Gastronomia',            resumo: 'menu autoral' },
    { slug: 'decoracao',              nome: 'Decoração',              resumo: 'cenografia e flores' },
    { slug: 'coquetelaria',           nome: 'Coquetelaria',           resumo: 'bar assinado' },
    { slug: 'producao',               nome: 'Produção',               resumo: 'cronograma e operação' },
    { slug: 'tecnologia-audiovisual', nome: 'Tecnologia audiovisual', resumo: 'som, luz e projeção' }
  ];

  var corporativo = window.location.pathname.indexOf('/corporativo') === 0;
  var CONTEXTOS = {
    social: {
      logo: '/assets/brand/social-wordmark-white.png', alt: 'Di Terrá Eventos', inicio: '/social',
      itens: [
        { rotulo: 'Espaços',  href: '/social/espacos',  menu: 'espacos' },
        { rotulo: 'Soluções', href: '/social/solucoes', menu: 'solucoes' },
        { rotulo: 'Sobre',    href: '/social#intro' },           /* vira /sobre no PR 4 */
        { rotulo: 'Blog',     href: BLOG, menu: 'blog', externo: true }
      ],
      alternador: { rotulo: 'Corporativo', href: '/corporativo' },
      acao: { rotulo: 'Agendar visita', href: '/social#contato' } /* abre o painel no PR 8 */
    },
    corporativo: {
      logo: '/assets/brand/corp-horizontal-white.png', alt: 'Di Terrá Corporativo', inicio: '/corporativo',
      itens: [
        { rotulo: 'Formatos', href: '/corporativo#formatos' },
        { rotulo: 'Espaços',  href: '/corporativo#espacos', menu: 'espacos' },
        { rotulo: 'Sobre',    href: '/corporativo#manifesto' },  /* vira /sobre no PR 4 */
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
  var seta = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3.5 5 7.5 9 3.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';

  var painelEspacos = function () {
    return '<div class="pil__panel"><div class="pil__casas">' + ESPACOS.map(function (e) {
      return '<a class="pil__casa" href="/social/espacos/' + e.slug + '">' +
        '<img src="/assets/opt/' + e.slug + '-amplitude-800.webp" alt="" width="800" height="600">' +
        '<b>' + esc(e.nome) + '</b><small>' + esc(e.resumo) + '</small></a>';
    }).join('') + '</div></div>';
  };
  var painelSolucoes = function () {
    return '<div class="pil__panel"><div class="pil__lista">' + SOLUCOES.map(function (s) {
      return '<a href="/social/solucoes/' + s.slug + '">' + esc(s.nome) + '<small>' + esc(s.resumo) + '</small></a>';
    }).join('') + '</div></div>';
  };
  /* nasce com o post mais recente conhecido; a API troca pelo atual */
  var painelBlog = function () {
    return '<div class="pil__panel"><a class="pil__post" id="pilPost" href="https://diterra.com.br/destination-wedding-no-interior-de-sp-como-funciona-e-porque-escolher/" target="_blank" rel="noopener">' +
      '<img id="pilPostImg" alt="" width="104" height="78" src="/assets/opt/cerimonia-vertical-800.webp">' +
      '<span><small>Último post</small><b id="pilPostTitulo">Destination Wedding no Interior de SP: como funciona e por que escolher</b><em>Ler no blog &rarr;</em></span></a></div>';
  };
  var PAINEIS = { espacos: painelEspacos, solucoes: painelSolucoes, blog: painelBlog };

  var montar = function () {
    var gaveta = document.getElementById('navDrawer');
    var nav = document.createElement('div');
    nav.className = 'pil';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navegação principal');

    var aqui = window.location.pathname.replace(/\/$/, '');
    var html = '<a class="pil__logo" href="' + ctx.inicio + '" aria-label="' + esc(ctx.alt) + ', início">' +
      '<img src="' + ctx.logo + '" alt="' + esc(ctx.alt) + '"></a><ul class="pil__list">';
    ctx.itens.forEach(function (it, i) {
      var atual = aqui === it.href.replace(/#.*$/, '') && it.href.indexOf('#') === -1 ? ' aria-current="page"' : '';
      var ext = it.externo ? ' target="_blank" rel="noopener"' : '';
      html += '<li class="pil__item"' + (it.menu ? ' data-menu="' + it.menu + '"' : '') + '>' +
        '<a class="pil__link" href="' + it.href + '"' + atual + ext +
        (it.menu ? ' aria-haspopup="true" aria-expanded="false" aria-controls="pilMenu' + i + '"' : '') + '>' +
        esc(it.rotulo) + (it.menu ? seta : '') + '</a>' +
        (it.menu ? '<div class="pil__drop" id="pilMenu' + i + '">' + PAINEIS[it.menu]() + '</div>' : '') +
        '</li>';
    });
    html += '</ul><div class="pil__side">' +
      '<a class="pil__switch" href="' + ctx.alternador.href + '">' + esc(ctx.alternador.rotulo) + ' &rarr;</a>' +
      '<a class="pil__cta" href="' + ctx.acao.href + '">' + esc(ctx.acao.rotulo) + '</a>' +
      (gaveta ? '<button class="pil__toggle" type="button" aria-expanded="false" aria-controls="navDrawer" aria-label="Abrir menu"><span></span><span></span></button>' : '') +
      '</div>';
    nav.innerHTML = html;
    document.body.insertBefore(nav, document.body.firstChild);

    /* ── vidro mais fechado depois do hero, como a barra faz ──────── */
    var hero = document.getElementById('topo');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        nav.classList.toggle('is-stuck', !entradas[0].isIntersecting);
      }, { rootMargin: '-85% 0px 0px 0px' }).observe(hero);
    } else {
      nav.classList.add('is-stuck');
    }

    /* ── dropdown: mouse abre por CSS; teclado e toque abrem aqui ───
       Enter/Espaço no item com menu abre em vez de navegar na primeira
       vez; segundo Enter segue o link. Escape fecha e devolve o foco. */
    var itens = Array.prototype.slice.call(nav.querySelectorAll('.pil__item[data-menu]'));
    var fechar = function () {
      itens.forEach(function (li) {
        li.classList.remove('is-open');
        li.querySelector('.pil__link').setAttribute('aria-expanded', 'false');
      });
    };
    itens.forEach(function (li) {
      var link = li.querySelector('.pil__link');
      var toque = window.matchMedia('(hover: none)').matches;
      link.addEventListener('click', function (e) {
        if (!toque || li.classList.contains('is-open')) return;
        e.preventDefault();
        fechar();
        li.classList.add('is-open');
        link.setAttribute('aria-expanded', 'true');
      });
      link.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || ((e.key === 'Enter' || e.key === ' ') && !li.classList.contains('is-open'))) {
          e.preventDefault();
          fechar();
          li.classList.add('is-open');
          link.setAttribute('aria-expanded', 'true');
          var primeiro = li.querySelector('.pil__drop a');
          if (primeiro) primeiro.focus();
        }
      });
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { fechar(); link.focus(); }
      });
      li.addEventListener('focusout', function (e) {
        if (!li.contains(e.relatedTarget)) fechar();
      });
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
        var a = document.getElementById('pilPost');
        a.href = p.link;
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
