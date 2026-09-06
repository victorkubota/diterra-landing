/* ══════════════════════════════════════════════════════════════════════
   Lista que troca a foto (.switch / .vcard) — espaços do corporativo e
   as quatro casas da home social.

   Referência Sarah Haywood. No desktop a foto grande troca com
   transição; no celular cada card abre a própria foto. O rodízio
   automático passa pelas casas e para assim que a pessoa escolhe uma.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── espaços: lista que troca a foto ───────────────────────────
     Referência Sarah Haywood. No desktop a foto grande troca com
     transição; no celular cada card abre a própria foto. */
  var sw = document.getElementById('venueSwitch');
  if (sw) {
    var cards = Array.prototype.slice.call(sw.querySelectorAll('.vcard'));
    var shots = Array.prototype.slice.call(sw.querySelectorAll('.switch__shot'));

    /* O painel fechado tem 0px de altura mas continua no documento, e os
       dois links de dentro continuavam recebendo Tab: o foco sumia num
       destino invisível. inert tira o painel fechado da ordem de
       tabulação e da árvore de acessibilidade sem tocar no layout, então
       a transição de altura continua a mesma.

       O tabindex acompanha o padrão de tablist: só a aba ativa recebe
       Tab, e as setas circulam entre as quatro. Antes as quatro estavam
       em 0, o que fazia o Tab parar quatro vezes numa lista que a seta
       já percorre. */
    var ativar = function (slug) {
      cards.forEach(function (c) {
        var on = c.getAttribute('data-venue') === slug;
        c.classList.toggle('is-on', on);
        var head = c.querySelector('.vcard__head');
        head.setAttribute('aria-selected', String(on));
        head.tabIndex = on ? 0 : -1;
        var painel = c.querySelector('.vcard__panel');
        if (painel) painel.inert = !on;
      });
      shots.forEach(function (s) {
        s.classList.toggle('is-on', s.getAttribute('data-shot') === slug);
      });
    };

    /* o HTML nasce com todos os paineis abertos, para funcionar sem JS.
       Assim que o JS assume, o estado inicial passa a valer de verdade. */
    var inicial = cards.find(function (c) { return c.classList.contains('is-on'); }) || cards[0];
    if (inicial) ativar(inicial.getAttribute('data-venue'));

    cards.forEach(function (c, i) {
      var head = c.querySelector('.vcard__head');
      head.addEventListener('click', function () {
        ativar(c.getAttribute('data-venue'));
        escolher();
      });
      head.addEventListener('keydown', function (e) {
        var alvo = null;
        if (e.key === 'ArrowDown') alvo = cards[(i + 1) % cards.length];
        else if (e.key === 'ArrowUp') alvo = cards[(i - 1 + cards.length) % cards.length];
        else if (e.key === 'Home') alvo = cards[0];
        else if (e.key === 'End') alvo = cards[cards.length - 1];
        if (!alvo) return;
        e.preventDefault();
        ativar(alvo.getAttribute('data-venue'));
        alvo.querySelector('.vcard__head').focus();
        escolher();
      });
    });

    /* ── passagem automática das casas ─────────────────────────────
       Quem só rola a página via uma casa das quatro. O rodízio mostra
       as outras três sozinho.

       A régua vem do MESMO relógio que faz a troca, não de uma animação
       CSS presa a uma classe. A versão anterior dependia de o navegador
       reiniciar a animação a cada vez que a classe .is-on mudava de
       cartão, e era isso que dava a impressão de que ela só rodava na
       primeira volta. Aqui o progresso é um número que o próprio timer
       escreve: enquanto ele anda, a régua anda; quando ele para, ela
       para no lugar, e a pausa fica visível.

       Conteúdo que se move sozinho precisa de como parar (WCAG 2.2.2):
         · mouse ou foco na seção pausa enquanto durar
         · escolher uma casa pausa e NÃO retoma sozinho, para o rodízio
           não roubar de volta a casa que a pessoa quis ler
         · quem pediu menos movimento no sistema nunca vê o rodízio
         · fora da tela ou em aba oculta não roda para ninguém */
    var ESPERA = 6000;
    var PASSO = 100;
    var relogio = null, pausado = false, escolhido = false, naTela = false;
    var decorrido = 0;

    /* largura E visibilidade saem da mesma variável. A visibilidade
       chegou a depender de uma classe no contêiner, mas aí eram dois
       mecanismos para um efeito só; com uma variável, o que o relógio
       escreve é exatamente o que a régua mostra. */
    var pintarRegua = function (visivel) {
      sw.style.setProperty('--rp', (decorrido / ESPERA).toFixed(4));
      sw.style.setProperty('--ro', visivel ? '1' : '0');
    };

    var proxima = function () {
      var atual = cards.findIndex(function (c) { return c.classList.contains('is-on'); });
      ativar(cards[(Math.max(0, atual) + 1) % cards.length].getAttribute('data-venue'));
      decorrido = 0;
      pintarRegua(true);
    };

    var passo = function () {
      decorrido += PASSO;
      if (decorrido >= ESPERA) proxima(); else pintarRegua(true);
    };

    var tocar = function () {
      if (relogio || escolhido || pausado || !naTela || document.hidden) return;
      relogio = setInterval(passo, PASSO);
      pintarRegua(true);
    };

    /* pausa guarda o tempo decorrido: ao voltar, a casa atual termina o
       que faltava em vez de recomeçar do zero */
    var pausar = function () {
      if (relogio) { clearInterval(relogio); relogio = null; }
      pintarRegua(false);
    };

    /* a pessoa escolheu uma casa: para e fica parado, mas a régua zera
       para não deixar uma barra pela metade sugerindo contagem */
    var escolher = function () {
      escolhido = true;
      pausar();
      decorrido = 0;
      pintarRegua(false);
    };

    if (!reduz) {
      pintarRegua(false);
      sw.addEventListener('mouseenter', function () { pausado = true; pausar(); });
      sw.addEventListener('mouseleave', function () { pausado = false; tocar(); });
      /* focusin/focusout só entre pausa e retomada: quem clicou já caiu
         em escolher(), e o foco que fica no botão não deve represar o
         estado depois disso */
      sw.addEventListener('focusin', function () { pausado = true; pausar(); });
      sw.addEventListener('focusout', function () { pausado = false; tocar(); });
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) pausar(); else tocar();
      });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entradas) {
          naTela = entradas[0].isIntersecting;
          if (naTela) tocar(); else pausar();
        }, { threshold: 0.35 }).observe(sw);
      } else {
        naTela = true; tocar();
      }
    }
  }

})();
