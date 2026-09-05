/* ══════════════════════════════════════════════════════════════════════
   Comportamento compartilhado das páginas internas do site social:
   nav sólida, menu mobile, entrada dos blocos e botão de voltar ao topo.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* is-ready: o hero de cada rota entra em cascata a partir daqui.
     rAF não roda em aba de fundo, então o timer garante a entrada. */
  var pronto = function () { document.body.classList.add('is-ready'); };
  window.requestAnimationFrame(pronto);
  window.setTimeout(pronto, 400);

  /* "a confirmar" não é um vazio: é um dado que a Di Terrá ainda vai
     dar. O hover e o leitor de tela recebem a explicação. */
  Array.prototype.forEach.call(document.querySelectorAll('.tbd'), function (el) {
    el.setAttribute('title', 'Estamos confirmando este dado com a casa. Pergunte na proposta e a equipe responde com o número certo.');
    el.setAttribute('aria-description', 'Estamos confirmando este dado com a casa. Pergunte na proposta e a equipe responde com o número certo.');
  });

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
  /* .rise para texto, .reveal-shot para fotografia, .cascata para listas:
     os três dependem do mesmo is-in, então um observer só dá conta. */
  /* ── título que sobe por trás de uma máscara ────────────────────────
     Cada linha do título vira um recorte com o próprio índice --l, e
     sobe de dentro dele. O gesto vinha do corporativo; a função abaixo
     é a mesma, palavra por palavra. */
  var montarLinhas = function (el) {
    var bruto = el.getAttribute('data-linhas');
    if (bruto === null) {
      bruto = el.children.length ? '' : el.textContent.replace(/\s+/g, ' ').trim();
      el.setAttribute('data-linhas', bruto);
    }

    if (!bruto) {
      if (el.querySelector('.linhas__l')) return;
      var caixa = document.createElement('span');
      caixa.className = 'linhas__l';
      caixa.style.setProperty('--l', '0');
      var dentro = document.createElement('span');
      while (el.firstChild) { dentro.appendChild(el.firstChild); }
      caixa.appendChild(dentro);
      el.appendChild(caixa);
      return;
    }

    /* mede: cada palavra vira inline-block e o offsetTop diz a linha */
    var palavras = bruto.split(' ');
    el.textContent = '';
    var marcas = palavras.map(function (p) {
      var s = document.createElement('span');
      s.textContent = p;
      s.style.display = 'inline-block';
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
      return s;
    });

    var linhas = [], atual = null, topo = null;
    marcas.forEach(function (s, i) {
      var t = s.offsetTop;
      if (topo === null || Math.abs(t - topo) > 2) { topo = t; atual = []; linhas.push(atual); }
      atual.push(palavras[i]);
    });

    el.textContent = '';
    linhas.forEach(function (palavrasDaLinha, i) {
      var caixa = document.createElement('span');
      caixa.className = 'linhas__l';
      caixa.style.setProperty('--l', String(i));
      var dentro = document.createElement('span');
      dentro.textContent = palavrasDaLinha.join(' ');
      caixa.appendChild(dentro);
      el.appendChild(caixa);
    });
  };

  var titulos = Array.prototype.slice.call(document.querySelectorAll('.linhas'));
  titulos.forEach(montarLinhas);

  /* a primeira medição acontece com a fonte de sistema no lugar da
     Cormorant, e a serifada quebra em outro ponto. Remede quando a fonte
     real chega, pulando o que já entrou em tela. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      titulos.forEach(function (el) {
        if (!el.classList.contains('is-in')) montarLinhas(el);
      });
    });
  }

  /* na virada de largura o texto quebra em outro ponto. Só refaz o que
     ainda não entrou: remontar um título já revelado o faria animar de
     novo, do nada, no meio da leitura. */
  var larguraAnterior = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === larguraAnterior) return;
    larguraAnterior = window.innerWidth;
    titulos.forEach(function (el) {
      if (!el.classList.contains('is-in')) montarLinhas(el);
    });
  }, { passive: true });

  var blocos = document.querySelectorAll('.rise, .reveal-shot, .cascata, .linhas, .deco-line');

  /* A revelação é um gesto de uma vez só, e a classe precisa sair quando
     ele termina.

     .reveal-shot.is-in img pesa (0,2,1) e vence .card__media img e
     .gallery img, que pesam (0,1,1). Enquanto a classe fica, ela governa
     também o hover: medido em 05/09/2026, o zoom passava de 1,1s para
     1,6s e herdava o atraso do --i — 0,44s na quinta foto da galeria, o
     que lê como travado. No corporativo isso nunca apareceu porque lá
     nenhum .reveal-shot tem zoom de hover.

     Tirada a classe, resta o is-in e o componente volta a mandar no
     próprio hover. Sem clip-path a foto já está inteira, então nada
     pisca. */
  var encerrarRevelacao = function (el) {
    var alvo = el.querySelector('img, video');
    var pronto = false;
    var limpar = function () {
      if (pronto) return;
      pronto = true;
      el.classList.remove('reveal-shot');
    };
    if (alvo) {
      alvo.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'transform') limpar();
      });
    }
    /* rede: transitionend não dispara se a transição for suprimida —
       movimento reduzido, aba em segundo plano, imagem que não carregou */
    window.setTimeout(limpar, 2600);
  };

  var revelar = function (el) {
    el.classList.add('is-in');
    if (el.classList.contains('reveal-shot')) encerrarRevelacao(el);
  };

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
        revelar(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(blocos, function (el) { io.observe(el); });
    /* o observer dorme em aba de fundo e em painel oculto; passado um
       segundo, o que está dentro da tela aparece de qualquer jeito */
    window.setTimeout(function () {
      var linha = window.innerHeight * 0.9;
      Array.prototype.forEach.call(blocos, function (el) {
        if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < linha) revelar(el);
      });
    }, 1000);
  } else {
    Array.prototype.forEach.call(blocos, function (el) { revelar(el); });
  }

  /* ── hero vira cartão ao sair ─────────────────────────────────────
     Mesmo gesto do corporativo e da home social: a foto se recolhe num
     cartão arredondado enquanto some pelo topo. A forma mora no
     base.css; aqui só escrevemos o progresso.

     O curso são 70% de uma tela de rolagem, tempo suficiente para o
     recolhimento acontecer enquanto a foto ainda está saindo. */
  var palco = document.getElementById('heroPalco');
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pintarHero = function () {
    if (!palco || semMovimento) return;
    var curso = window.innerHeight * 0.7;
    palco.style.setProperty('--hp',
      Math.max(0, Math.min(1, window.scrollY / curso)).toFixed(4));
  };

  /* ── régua de leitura ──────────────────────────────────────────────
     Quanto da página já passou, escrito em --lido para a barra da nav
     ler por scaleX. Sem transição: o valor acompanha a rolagem quadro a
     quadro, e uma transição aqui atrasaria a barra em relação ao dedo. */
  var regua = document.querySelector('.nav__progresso');

  var pintarRegua = function () {
    if (!regua || !nav) return;
    var curso = document.documentElement.scrollHeight - window.innerHeight;
    nav.style.setProperty('--lido',
      curso > 0 ? Math.min(1, window.scrollY / curso).toFixed(4) : '0');
  };

  /* ── pilha de cartões: --cp é quanto o PRÓXIMO cartão já cobriu este ──
     Só onde há pilha (≥ 860px) e com movimento permitido. A forma
     (desfoque, escala, luz) mora no base.css. */
  var podePilha = !semMovimento && window.matchMedia('(min-width: 860px)').matches;
  var cartoes = podePilha ? Array.prototype.slice.call(document.querySelectorAll('.pilha .fmt')) : [];
  var medirPilha = function () {
    if (cartoes.length < 2) return;
    var alto = window.innerHeight;
    cartoes.forEach(function (c, i) {
      var prox = cartoes[i + 1];
      if (!prox) { c.style.setProperty('--cp', '0'); return; }
      var curso = alto - c.getBoundingClientRect().top;
      var avanco = alto - prox.getBoundingClientRect().top;
      var p = curso > 0 ? avanco / curso : 0;
      c.style.setProperty('--cp', Math.max(0, Math.min(1, p)).toFixed(4));
    });
  };

  /* ── laço de scroll, compartilhado pelo hero, a régua, a barra de ação,
     a pilha e o voltar ao topo ── */
  var barra = document.getElementById('barraAcao');
  if (toTop || palco || regua || barra || cartoes.length) {
    var pendente = false;

    var atualizar = function () {
      if (toTop) toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
      if (barra) barra.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.5);
      pintarHero();
      pintarRegua();
      medirPilha();
      pendente = false;
    };

    window.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      window.requestAnimationFrame(atualizar);
    }, { passive: true });

    atualizar();
  }

  /* ── hub de soluções chegando de uma ocasião ─────────────────────
     /social/solucoes?ocasiao=casamento: o hero diz para que ocasião a
     pessoa está olhando. Só texto; a lista continua a mesma. */
  var ocasiao = new URLSearchParams(window.location.search).get('ocasiao');
  var leadHub = document.querySelector('.page-hero__lead');
  var nomesOcasiao = { casamento: 'casamentos', debutante: 'debutantes', aniversario: 'aniversários e bodas', formatura: 'formaturas' };
  if (ocasiao && leadHub && nomesOcasiao[ocasiao] && window.location.pathname.indexOf('/social/solucoes') === 0) {
    var marca = document.createElement('span');
    marca.className = 'eyebrow';
    marca.textContent = 'Para ' + nomesOcasiao[ocasiao];
    leadHub.parentNode.insertBefore(marca, leadHub);
  }

  /* ── índice com foto (soluções na home) ─────────────────────────
     Passar o mouse ou focar um item troca a foto do palco. Sem palco
     (celular) a miniatura já está ao lado do nome. */
  var indice = document.getElementById('indiceSolucoes');
  if (indice) {
    var itensIndice = indice.querySelectorAll('.indice__item');
    var fotosIndice = indice.querySelectorAll('.indice__foto');
    var ativarIndice = function (slug) {
      Array.prototype.forEach.call(itensIndice, function (li) { li.classList.toggle('is-on', li.getAttribute('data-foto') === slug); });
      Array.prototype.forEach.call(fotosIndice, function (f) { f.classList.toggle('is-on', f.getAttribute('data-foto') === slug); });
    };
    Array.prototype.forEach.call(itensIndice, function (li) {
      var slug = li.getAttribute('data-foto');
      li.addEventListener('mouseenter', function () { ativarIndice(slug); });
      li.querySelector('a').addEventListener('focus', function () { ativarIndice(slug); });
    });
  }

  /* ── cursor "Ver" ──────────────────────────────────────────────────
     Só com ponteiro fino e sem movimento reduzido. Um círculo pequeno
     com a palavra segue o mouse sobre fotos clicáveis; diz o que o
     clique faz antes do clique. */
  if (window.matchMedia('(pointer: fine)').matches && !semMovimento) {
    var cursor = document.createElement('div');
    cursor.className = 'cursor-ver';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = 'Ver';
    document.body.appendChild(cursor);
    var alvosCursor = 'a:has(img), .glightbox, .vcard__head, .switch__stage, .indice__link';
    var moverCursor = function (e) {
      cursor.style.transform = 'translate3d(' + (e.clientX - 28) + 'px,' + (e.clientY - 28) + 'px,0)';
    };
    document.addEventListener('pointerover', function (e) {
      var alvo = e.target.closest && e.target.closest(alvosCursor);
      if (!alvo) return;
      cursor.classList.add('is-on');
      moverCursor(e);
    });
    document.addEventListener('pointerout', function (e) {
      var alvo = e.target.closest && e.target.closest(alvosCursor);
      if (alvo && !(e.relatedTarget && alvo.contains(e.relatedTarget))) cursor.classList.remove('is-on');
    });
    document.addEventListener('pointermove', function (e) {
      if (cursor.classList.contains('is-on')) moverCursor(e);
    }, { passive: true });
  }

  /* ── voltar ao topo ──────────────────────────────────────────────── */
  if (toTop) {

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
