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

    var ativar = function (slug) {
      cards.forEach(function (c) {
        var on = c.getAttribute('data-venue') === slug;
        c.classList.toggle('is-on', on);
        c.querySelector('.vcard__head').setAttribute('aria-selected', String(on));
      });
      shots.forEach(function (s) {
        s.classList.toggle('is-on', s.getAttribute('data-shot') === slug);
      });
    };

    cards.forEach(function (c, i) {
      var head = c.querySelector('.vcard__head');
      head.addEventListener('click', function () {
        ativar(c.getAttribute('data-venue'));
        escolher();
      });
      head.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var alvo = cards[(i + d + cards.length) % cards.length];
        alvo.querySelector('.vcard__head').focus();
        ativar(alvo.getAttribute('data-venue'));
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
