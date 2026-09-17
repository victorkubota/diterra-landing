/* ══════════════════════════════════════════════════════════════════════
   ÁLBUM DE DEPOIMENTOS — prova de conceito (17/09/2026)

   Lê os doze depoimentos que já estão no HTML e monta com eles um álbum
   aberto: duas folhas no desktop, uma no celular, virando sozinho a cada
   cinco segundos.

   O MECANISMO, em uma frase: existe UMA folha móvel. Antes de girar ela
   recebe na frente a página que sai e no verso a página que entra;
   embaixo, a página fixa já está trocada pela SEGUINTE. Quando o giro
   termina, as fixas assumem o novo par e a folha volta ao zero,
   escondida. Nenhum clone, nenhum z-index empilhado, e o laço fecha
   sem rebobinar o álbum na cara do visitante.

   Os nós das páginas são MOVIDOS, nunca copiados. Um <img> que já
   baixou continua baixado ao mudar de lugar no DOM; um clone recomeça
   do zero e pisca branco no meio da virada.
   ══════════════════════════════════════════════════════════════════════ */
(() => {
  const secao = document.querySelector('[data-album]');
  if (!secao) return;

  const fonte = secao.querySelector('[data-album-fonte]');
  const palco = secao.querySelector('[data-album-palco]');
  if (!fonte || !palco) return;

  const casos = Array.from(fonte.querySelectorAll('.caso'));
  if (casos.length < 4) return;

  const REPOUSO = 5000;   // o pedido: cinco segundos parada
  const VIRADA  = 1150;   // o giro em si

  const mqSpread = matchMedia('(min-width: 860px)');
  const mqCalma  = matchMedia('(prefers-reduced-motion: reduce)');
  const temMouse = matchMedia('(hover: hover)');

  let paginas = [];        // nós de página, na ordem
  let idx = 0;             // página da esquerda (spread) ou página única
  let virando = false;
  let parado = false;      // decisão explícita de quem clicou em pausar
  let suspenso = false;    // mouse em cima, foco dentro, fora de quadro, aba oculta
  let relogio = null;
  let giro = null;         // a animação da folha em curso

  let album, livro, pEsq, pDir, folha, frente, verso, aviso, conta, btnParar, marcas = [];

  const spread = () => mqSpread.matches;
  const calma  = () => mqCalma.matches;
  const passo  = () => (spread() ? 2 : 1);
  const pag    = n => paginas[((n % paginas.length) + paginas.length) % paginas.length];

  /* ── monta as páginas a partir dos casos ─────────────────────────
     Duas peças por folha no desktop, uma no celular: o polaroid sozinho
     já ocupa 170px, e meia tela de celular não comporta dois. */
  function fatia() {
    const porFolha = spread() ? 2 : 1;
    const nova = [];
    for (let i = 0; i < casos.length; i += porFolha) {
      const pagina = document.createElement('div');
      pagina.className = 'album__conteudo';
      casos.slice(i, i + porFolha).forEach(c => pagina.appendChild(c));
      nova.push(pagina);
    }
    /* O spread precisa de número PAR de folhas: com ímpar, a última
       abertura mostraria a primeira folha à direita e a virada seguinte
       cairia meio passo fora do lugar, para sempre. */
    if (spread() && nova.length % 2 === 1) nova.pop();
    return nova;
  }

  function monta() {
    clearTimeout(relogio);
    virando = false;
    idx = 0;

    // devolve os casos para a fonte antes de refatiar (troca de layout)
    casos.forEach(c => fonte.appendChild(c));
    paginas = fatia();

    palco.innerHTML = `
      <div class="album" data-parado="0">
        <div class="album__capa">
          <div class="album__livro" role="group" aria-label="Álbum de depoimentos">
            <div class="album__pagina album__pagina--esq"></div>
            <div class="album__pagina album__pagina--dir"></div>
            <div class="album__folha">
              <div class="folha__face folha__face--frente"><div class="folha__sombra"></div></div>
              <div class="folha__face folha__face--verso"><div class="folha__sombra"></div></div>
            </div>
            <div class="album__lombada"></div>
          </div>
        </div>
        <div class="album__controles">
          <button type="button" class="album__seta" data-atras>
            <span aria-hidden="true">‹</span> Anterior
          </button>
          <div class="album__marcas" aria-hidden="true"></div>
          <span class="album__conta" aria-hidden="true" data-conta></span>
          <button type="button" class="album__seta" data-adiante>
            Próxima <span aria-hidden="true">›</span>
          </button>
          <button type="button" class="album__parar" data-parar>
            <span data-rotulo>Pausar o álbum</span>
          </button>
        </div>
        <p class="sr-only" role="status" aria-live="polite" data-aviso></p>
      </div>`;

    album  = palco.querySelector('.album');
    livro  = palco.querySelector('.album__livro');
    pEsq   = palco.querySelector('.album__pagina--esq');
    pDir   = palco.querySelector('.album__pagina--dir');
    folha  = palco.querySelector('.album__folha');
    frente = palco.querySelector('.folha__face--frente');
    verso  = palco.querySelector('.folha__face--verso');
    aviso  = palco.querySelector('[data-aviso]');
    conta  = palco.querySelector('[data-conta]');
    btnParar = palco.querySelector('[data-parar]');

    livro.style.setProperty('--dur-virada', VIRADA + 'ms');

    // estado inicial
    if (spread()) { põe(pEsq, pag(0)); põe(pDir, pag(1)); }
    else          { põe(pDir, pag(0)); }

    montaMarcas();
    liga();
    // sem virada automática quando o movimento é reduzido: o álbum vira
    // um livro que se folheia no botão, que é exatamente o que a
    // preferência pede
    if (calma()) btnParar.hidden = true;
    anuncia();
    agenda();
  }

  function põe(alvo, pagina) {
    if (!pagina) return;
    // a sombra da face mora no próprio nó e não pode ser varrida junto
    Array.from(alvo.children).forEach(f => { if (!f.classList.contains('folha__sombra')) f.remove(); });
    alvo.appendChild(pagina);
  }

  function montaMarcas() {
    const caixa = palco.querySelector('.album__marcas');
    const total = paginas.length / passo();
    marcas = [];
    caixa.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'album__marca';
      /* fora da ordem de tabulação de propósito: as marcas moram numa
         caixa aria-hidden, e elemento focável dentro de aria-hidden é
         armadilha de teclado. O caminho de teclado são as setas, que
         fazem a mesma coisa e se anunciam. */
      b.tabIndex = -1;
      b.setAttribute('aria-label', `Ir para a folha ${i + 1}`);
      b.addEventListener('click', () => salta(i * passo()));
      caixa.appendChild(b);
      marcas.push(b);
    }
    pintaMarcas();
  }

  function pintaMarcas() {
    const atual = Math.floor(idx / passo());
    marcas.forEach((b, i) => b.setAttribute('aria-current', i === atual ? 'true' : 'false'));
  }

  function anuncia() {
    const atual = Math.floor(idx / passo()) + 1;
    const total = paginas.length / passo();
    aviso.textContent = `Folha ${atual} de ${total}`;
    conta.textContent = `${atual} / ${total}`;
    livro.setAttribute('aria-label', `Álbum de depoimentos, folha ${atual} de ${total}`);
  }

  /* ── a virada ─────────────────────────────────────────────────────
     dir = +1 adiante, -1 atrás. Adiante a folha sai de 0° e pousa em
     -180°; atrás ela nasce em -180° (fora de quadro, à esquerda) e
     volta para 0°. As duas usam a MESMA folha e o mesmo caminho. */
  function vira(dir) {
    if (virando || paginas.length < 2) return;

    if (calma()) { salta(idx + dir * passo(), true); return; }

    virando = true;
    const p = passo();
    const inicio = dir > 0 ? 0 : -180;
    const fim    = dir > 0 ? -180 : 0;

    if (dir > 0) {
      põe(frente, spread() ? pag(idx + 1) : pag(idx));
      if (spread()) { põe(verso, pag(idx + 2)); põe(pDir, pag(idx + 3)); }
      else          { põe(pDir, pag(idx + 1)); }
    } else {
      põe(frente, pag(idx - 1));
      if (spread()) { põe(verso, pag(idx)); põe(pEsq, pag(idx - 2)); }
    }
    verso.classList.toggle('esta-vazia', !spread());

    /* O que acontece quando o gesto termina. Está declarado antes da
       animação porque é ela que o chama. */
    const encerra = () => {
      if (!virando) return;
      virando = false;
      idx = ((idx + dir * p) % paginas.length + paginas.length) % paginas.length;

      /* Adiante, a folha pousou sobre a esquerda e é a esquerda que
         assume o que estava no verso. Atrás, ela voltou para a direita.
         Nos dois casos a página fixa recebe o MESMO conteúdo que já
         está desenhado na folha, então a troca não pisca. */
      if (dir > 0) { if (spread()) põe(pEsq, pag(idx)); }
      else         { põe(pDir, pag(idx + (spread() ? 1 : 0))); }

      livro.dataset.virando = '0';
      // cancela o fill: sem isto a folha ficaria presa no ângulo final
      if (giro) { giro.cancel(); giro = null; }
      folha.classList.remove('esta-no-ar');

      pintaMarcas();
      anuncia();
      agenda();
    };

    /* A VIRADA É WEB ANIMATIONS, não transição.

       Transição depende de o navegador ter um "estilo anterior" pintado
       para interpolar a partir dele, e isso é exatamente o que falha
       numa peça que acabou de aparecer: medido aqui, a folha saltava
       direto para o ângulo final. Dá para contornar com reflow forçado
       e dois quadros de espera, mas aí o começo do gesto passa a
       depender de quando o quadro chega. animate() não tem esse
       problema: os dois extremos são declarados na chamada.

       A folha também nunca sai do fluxo — descansa em visibility:
       hidden, nunca em display: none. */
    folha.classList.add('esta-no-ar');
    livro.dataset.virando = '1';

    giro = folha.animate(
      [{ transform: `rotateY(${inicio}deg)` }, { transform: `rotateY(${fim}deg)` }],
      { duration: VIRADA, easing: 'cubic-bezier(.58,.04,.30,1)', fill: 'forwards' }
    );

    /* O fim da animação é o sinal bom. O relógio é a rede: em aba
       oculta o navegador não produz quadros, a animação não avança e a
       promessa não resolve — e a seção não pode ficar travada por isso.
       Nesse caso o relógio encerra, a troca de páginas acontece sem
       gesto nenhum, e quem volta para a aba encontra o álbum certo. */
    giro.finished.then(encerra).catch(() => {});
    setTimeout(encerra, VIRADA + 200);
  }

  /* pulo direto, sem giro: usado pelas marcas e pelo movimento reduzido */
  function salta(destino, silencioso) {
    if (virando) return;
    idx = ((destino % paginas.length) + paginas.length) % paginas.length;
    if (spread()) { põe(pEsq, pag(idx)); põe(pDir, pag(idx + 1)); }
    else          { põe(pDir, pag(idx)); }
    pintaMarcas();
    anuncia();
    if (!silencioso) reinicia();
    else agenda();
  }

  /* ── o relógio ────────────────────────────────────────────────────
     Nunca roda com a aba oculta, fora de quadro, com o mouse em cima,
     com foco dentro ou depois de pausar no botão. */
  function agenda() {
    clearTimeout(relogio);
    if (parado || suspenso || calma() || document.hidden) return;
    relogio = setTimeout(() => vira(1), REPOUSO);
  }
  function reinicia() { clearTimeout(relogio); agenda(); }
  function suspende(v) { suspenso = v; agenda(); }

  function liga() {
    palco.querySelector('[data-adiante]').addEventListener('click', () => { vira(1); reinicia(); });
    palco.querySelector('[data-atras]').addEventListener('click', () => { vira(-1); reinicia(); });

    btnParar.addEventListener('click', () => {
      parado = !parado;
      album.dataset.parado = parado ? '1' : '0';
      btnParar.querySelector('[data-rotulo]').textContent = parado ? 'Voltar a virar' : 'Pausar o álbum';
      agenda();
    });

    if (temMouse.matches) {
      livro.addEventListener('mouseenter', () => suspende(true));
      livro.addEventListener('mouseleave', () => suspende(false));
    }
    album.addEventListener('focusin',  () => suspende(true));
    album.addEventListener('focusout', () => suspende(false));

    new IntersectionObserver(es => suspende(!es[0].isIntersecting), { threshold: .2 }).observe(livro);
  }

  document.addEventListener('visibilitychange', agenda);
  mqSpread.addEventListener('change', monta);
  mqCalma.addEventListener('change', monta);

  /* As fotos das folhas que ainda não entraram em quadro vivem fora do
     DOM, e imagem fora do DOM não baixa. Sem este empurrão a primeira
     virada de cada folha mostraria o quadro cinza por um instante. */
  function adianta() {
    casos.forEach(c => {
      const img = c.querySelector('img');
      const src = c.querySelector('source');
      if (src?.srcset) { const i = new Image(); i.src = src.srcset.split(' ')[0]; }
      else if (img?.src) { const i = new Image(); i.src = img.src; }
    });
  }

  monta();
  fonte.remove();   // o conteúdo agora mora no álbum, não na lista
  // requestIdleCallback recebe OPÇÕES no segundo argumento, não
  // milissegundos: passar número lança TypeError e o adiantamento
  // nunca roda. O setTimeout é o caminho de quem não tem a API.
  if ('requestIdleCallback' in window) requestIdleCallback(adianta, { timeout: 1500 });
  else setTimeout(adianta, 400);
})();
