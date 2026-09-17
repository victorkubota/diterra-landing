# Plano de motion das páginas internas · rodada 5

Sequência da rodada de 17/09/2026, que nasceu do retorno da cliente sobre as
páginas de ocasião ("senti falta de animação e movimento, a página está dura") e da
leitura das duas referências que ele mandou olhar, apuradas em
`docs/referencias-motion-apple-nubank.md`.

**O que já foi feito** (commit desta rodada): o item 1 da onda 1, que era conserto e
não melhoria. Os dois gestos presos à rolagem que o site tem, o parallax do retrato
do depoimento das três LPs de ocasião e o da faixa fotográfica da home, estavam
escritos e inertes. `overflow: hidden` no contêiner o torna um scroll container, e
`animation-timeline: view()` sem argumento se prende ao scroll container ancestral
mais próximo: o gesto media o progresso de um bloco que nunca rola e ficava cravado
no meio do percurso. Medido antes, em produção: `timeline.source` apontando para o
próprio contêiner e `transform` parado em `translateY(-0,002px)` ao longo de 1400px
de rolagem. Medido depois, no código desta branch: `source` no documento e
`transform` de -58,2px a +58,6px no retrato, de -29,9px a +33,6px na faixa.

As duas saídas foram testadas uma a uma no navegador, e cada caso pede a sua: o
retrato aceita nome de timeline (`view-timeline-name`), porque a imagem é filha em
fluxo normal; a faixa da home precisa de `overflow: clip`, porque a camada de foto é
absoluta e ali o nome não basta. Isso está comentado nas duas folhas.

**O que está proposto e aguarda decisão:** o resto da onda 1 (calibragem, nenhum
gesto novo), a onda 2 (componentes novos) e a onda 3 (unificação, invisível para o
visitante). Cada item traz o código pronto, onde aplicar, as armadilhas e as
objeções que foram levantadas e incorporadas na revisão.

Uma correção de premissa que vale para todo o documento: a display do site é
**Instrument Serif, estilo único 400** desde 17/09/2026 (`assets/css/base.css`), e
não mais a Cormorant Garamond 300. Qualquer comentário novo que afirme "serif peso
300" entra errado no repositório.

---

## Diagnóstico · por que a página parece dura

O site não tem falta de movimento. Tem `.rise`, `.reveal-shot`, `.linhas` (que mede a quebra real no navegador e remede em `document.fonts.ready`), `.cascata`, `.acende` com `@property` e `animation-timeline: view()`, pilha com sticky e `--cp` quadro a quadro, hero que se recolhe em cartão por `--hp`, parallax scroll-driven nativo, view transitions entre documentos com cinco nomes, e um gate de movimento reduzido que preserva o retorno por cor em vez de zerar tudo. Isso é mais sistema do que a maioria dos sites tem, e é mais do que as duas referências entregam em acessibilidade de foco.

O movimento não está sendo **sentido** por seis razões, todas verificadas:

**1. Três animações presas à rolagem estão inertes em produção.** Este é o achado de maior valor da rodada. `social/evento.css:392` declara `.js .foto-desliza { overflow: hidden; }` e a imagem dentro usa `animation-timeline: view()`. `overflow: hidden` transforma o elemento em scroll container, e `view()` sem argumento se prende ao scroll container **ancestral mais próximo**, não ao documento. Resultado medido: `currentTime` cravado em ~50% e transform congelado ao longo de 800px de rolagem. O parallax do retrato das três LPs de ocasião **nunca deslizou um pixel**. O mesmo vale para `.banner-bg` dentro de `.banner { overflow: hidden }` (`social/home.css:469`). Os dois que funcionam (`.acende` e `.ornament img`) funcionam porque as seções usam `overflow-x: clip` (`social/social.css:285`), e `clip` não cria scroll container. A regra não está escrita em lugar nenhum do repositório.

**2. A entrada padrão usa a curva errada e uma duração só.** `base.css:113-114` divide as curvas por papel, com o comentário ao lado: `--ease` para estado, `--ease-out` para chegada. O `.rise` (`base.css:877-881`), que é a camada de entrada de 19 rotas e aparece centenas de vezes, transiciona com `var(--ease)` e move opacidade e deslocamento nos mesmos `--dur-slow`. A caixa pousa de uma vez. O site já sabe separar: o `.switch__shot` roda `opacity .9s, transform 1.4s, clip-path 1s` no mesmo gesto. Só a entrada não aproveita. É por isso que o título já lê mais macio que o bloco em volta dele: o `.linhas` sempre usou `--ease-out`.

**3. O escalonamento existe e não chegou onde precisava.** `grep -o 'card rise" style="--i:' social/espacos/index.html` retorna vazio. Os 4 cartões de casa do hub, os 5 de soluções e os 3 de cada casa são `a.card.rise` **sem nenhum índice**: a fileira inteira chega num quadro. O `--i` é escrito à mão, irmão por irmão, no HTML. Onde alguém escreveu, escreveu errado: a `.galeria-oc` das três LPs tem `--i` em 1,2,3,4,5,**6,6,6**, e as três últimas fotos chegam juntas.

**4. O ciclo tem duas fases, não três.** `.rise`, `.cascata` e `.linhas` entram em `.is-in` e ficam lá para sempre, com transição e atraso pendurados. Só o `.reveal-shot` tem fim, e por remoção de classe (`site.js:277-291`, rede de 2600ms), porque em 05/09/2026 alguém mediu que a foto revelada perdia o próprio hover. Nenhum dos quatro declara `will-change`.

**5. Onze das catorze internas abrem paradas.** A abertura do herói (foto assentando de `scale(1.06)`, texto em cascata) existe, funciona e está em produção desde 17/09 · presa a `body.lp-ocasiao` em `social/evento.css:339-358`, ou seja, em 3 rotas. A marcação do herói é a mesma nas dezesseis (`.page-hero > .page-hero__media + .wrap > ol.crumbs + h1.h-display + p.lead`). O gate era o seletor.

**6. Metade das fronteiras de dobra não existe para o olho.** Medido com o método WCAG da própria tabela de contraste dos temas: mesa `#efede7` contra `--sand-50` `#f5f3ee` dá **1,056:1**. Sand-50 contra paper, 1,109:1. Mesa contra paper, 1,171:1. Numa página de casa há seis passagens claro-contra-claro, e `.section { padding-block: clamp(80px,10vw,140px) }` põe duas paradas encostadas: 160px no celular e 280px no desktop de creme vazio com uma troca de cor no meio que o olho não separa de um degradê de brilho de tela. Do bloco 6 ao 10 são quatro telas sem uma fronteira legível. O ritmo real é: nada, nada, SLAM, nada, nada, nada, SLAM.

**Sobras que confundem o inventário:** a régua de leitura é código morto em CSS e em JS (não existe `id="nav"` nem `.nav__progresso` em nenhuma das 22 rotas; `site.js:21` e `:341` devolvem null). `--dur-foto` (1.4s) e `--dur-view` (.45s) têm **zero** consumidores, enquanto os mesmos números vivem literais a poucas linhas. `.gallery--percurso` não tem consumidor nenhum. O `.deco-line` está no HTML das quatro casas e a regra vive em `social/home.css`, que **só `/social` carrega**: nas casas o fio não é desenhado nem existe. E `class="eyebrow"` foi removido de todas as rotas de vitrine a pedido da cliente.

---

---

## Onda 1 · ajustes de calibragem

Pouco código, nenhum gesto novo, nenhuma linha de biblioteca. Ordenada por impacto ÷ esforço.

| # | Item | Onde | Esforço | Impacto | Rotas |
|---|---|---|---|---|---|
| 1 | ~~Consertar o parallax inerte~~ **feito nesta rodada** (o respiro das casas fica para a próxima) | `evento.css`, `home.css` | P | alto | 4 |
| 2 | Entrada que assenta: duas durações, curva de chegada, 20px | `base.css` | P | alto | 19 |
| 3 | O gesto tem fim: terceira fase por remoção de classe | `base.css`, `site.js` | P | médio-alto | 19 |
| 4 | Abertura do herói destravada, sem tocar no h1 | `social.css`, `evento.css` | P | alto | 16 |
| 5 | Índice que o CSS calcula, um atributo por contêiner | `base.css` + 13 HTML | M | alto | 13 |
| 6 | A chamada final em três tempos | 16 HTML + `social.css` | P | alto | 16 |
| 7 | A dobra clara passa a existir | `base.css`, `social.css` | M | alto | 19 |
| 8 | O fio que se desenha, nas casas e na cronologia | `social.css`, `melhorias.css` | P | médio | 7 |
| 9 | Manchete nas rotas de tese | `base.css` + 9 HTML | P | médio | 9 |
| 10 | Controle de parada do rodízio (WCAG 2.2.2) | `base.css`, `switch.js` + 5 HTML | P | conformidade | 5 |

---

### 1 · Consertar o parallax que já está escrito e não se move · FEITO

> **Estado:** aplicado no commit desta rodada, nas quatro rotas onde o defeito
> existia (as três LPs de ocasião e a home social). O que ficou de fora e segue
> valendo como proposta é a EXTENSÃO do mesmo gesto para a `.respiro-foto` das
> quatro páginas de casa, que hoje é a faixa mais parada daquelas rotas.
>
> **Uma correção na receita abaixo, apurada no navegador depois de escrita:** a
> saída por nome de timeline (`view-timeline-name`) funciona no retrato do
> depoimento, onde a imagem é filha em fluxo normal, e **não** funciona na faixa da
> home, onde a camada de foto é `position: absolute` (medido: com nome e `hidden`, o
> `currentTime` continua nulo). Ali a saída é `overflow: clip`, que recorta igual e
> não cria scroll container. Os dois casos estão comentados nas folhas com a
> medição que os separa.

**O que o visitante vê:** a foto do depoimento das três LPs volta a deslizar contra a rolagem, e a faixa fotográfica de tela cheia das quatro casas, que hoje é imagem parada com gradiente, passa a mostrar mais paisagem do que cabe na moldura.

Objeção que uma lente levantou e que está incorporada: a proposta original aplicava `view()` nu dentro de `.respiro-foto`, que tem `overflow: hidden` (`melhorias.css:210`), então o gesto nasceria morto pelo mesmo motivo que o `.foto-desliza` está morto. A saída é nomear o timeline.

```css
/* ═══ 1 de 3 · social/evento.css, substitui o bloco do .foto-desliza ═══

   POR QUE ISTO ESTAVA INERTE
   O `view()` sem argumento se prende ao scroll container ANCESTRAL MAIS
   PRÓXIMO. `overflow: hidden` transforma a caixa num scroll container,
   então o timeline resolvia para a própria .foto-desliza e o progresso
   ficava cravado em 50%: o parallax das três ocasiões nunca deslizou um
   pixel desde que foi escrito.

   Duas saídas existem e esta é a que não depende de mexer no recorte:
   a caixa NOMEIA o timeline e a imagem o referencia por nome. O outro
   caminho é trocar `hidden` por `clip`, que recorta igual e não cria
   scroll container (é por isso que o .acende e o ornamento funcionam:
   as seções usam overflow-x: clip, social/social.css:285).

   A folga de altura é o CURSO do deslize: 124% de altura dá 12% de
   sobra por lado, e 9% de translate resolvem contra a altura da PRÓPRIA
   imagem (9% de 124% = 11,16% da caixa). Fecha com 0,8% de margem. Não
   subir o curso sem subir a folga na mesma conta, senão a borda de
   baixo aparece no fim do percurso. */
@supports (animation-timeline: view()) {
  .js .foto-desliza {
    overflow: hidden;
    view-timeline-name: --desliza;
    view-timeline-axis: block;
  }
  .js .foto-desliza img {
    height: 124%; position: relative; top: -12%;
    animation: fotoDesliza linear both;
    animation-timeline: --desliza;
    animation-range: entry 0% exit 100%;
  }
}
@keyframes fotoDesliza {
  from { translate: 0 -9%; }
  to   { translate: 0  9%; }
}

/* `translate` e não `transform`: a propriedade separada é o que impede
   este gesto de disputar com o zoom de hover e com a escala do
   .reveal-shot, que é a razão do aviso escrito em base.css:895. */

/* OBRIGATÓRIO, e não redundante: o gate global (base.css:1145) apenas
   encurta a duração para .01ms, e uma animação com `fill: both`
   completa uma volta instantânea e ESTACIONA no estado final, deixando
   a foto deslocada +9% para sempre. É a mesma armadilha que obrigou o
   marquee e o álbum a usarem `animation: none` em seletor de classe. */
@media (prefers-reduced-motion: reduce) {
  .js .foto-desliza img { height: 100%; top: 0; translate: none; animation: none; }
}


/* ═══ 2 de 3 · assets/css/melhorias.css, junto do .respiro-foto (210) ═══

   A .respiro-foto é a única faixa das páginas de casa que existe SÓ pela
   fotografia (70svh de imagem sangrando) e hoje é a mais parada da rota.
   Mesmo gesto, mesmo nome de propriedade, mesmos números.

   `bottom: auto` é obrigatório: melhorias.css:211 declara `inset: 0` no
   picture E no img, então com top e height explícitos a caixa fica
   sobredeterminada e o navegador escolhe qual das três ignorar. A folga
   some sem aviso. */
@supports (animation-timeline: view()) {
  .js .respiro-foto {
    view-timeline-name: --desliza;
    view-timeline-axis: block;
  }
  .js .respiro-foto img {
    height: 124%; top: -12%; bottom: auto;
    animation: fotoDesliza linear both;
    animation-timeline: --desliza;
    animation-range: entry 0% exit 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .js .respiro-foto img { height: 100%; top: 0; bottom: 0; translate: none; animation: none; }
}


/* ═══ 3 de 3 · social/home.css, no .banner ═══
   Mesmo defeito, mesma correção: .banner declara overflow: hidden na
   linha 469 e a .banner-bg dentro usa view(). Nomear o timeline no
   .banner e referenciá-lo na .banner-bg. */
```

**Onde aplicar:** as 3 LPs recebem o conserto de graça (nenhuma edição de HTML). As 4 casas em `social/espacos/*.html` recebem de graça também, porque `.respiro-foto` já está no HTML delas (`a-querencia.html:238`). Total: 8 rotas, zero atributo novo.

**Armadilha:** confira no DevTools que `getAnimations()[0].timeline.source` resolve para o elemento nomeado e que `currentTime` varia com a rolagem. Se ficar cravado em 50%, sobrou um `overflow: hidden` entre a caixa e o documento. E **não** aplicar no herói, que já tem o `--hp`, nem no mesmo elemento que `.reveal-shot`.

---

### 2 · Entrada que assenta em vez de aparecer

**O que o visitante vê:** o texto sobe menos e chega em duas velocidades. Para de se mexer antes de acabar de aparecer, então parece material se acomodando e não caixa piscando.

Conservador de propósito: a opacidade fica nos `--dur-slow` de hoje, e só o deslocamento encurta. Assim a referência do antes e depois se preserva e a mudança percebida é a curva mais o assentamento.

```css
/* ═══ 1 de 2 · assets/css/base.css, no :root, bloco MOVIMENTO,
   logo abaixo de --dur-press (linha ~126) ═══════════════════════════ */

  /* PASSO, CURSO E TETO DA REVELAÇÃO
     O escalonamento era número literal e cada folha escolheu o seu:
     .11s no .rise, .07s por linha no .linhas, .13s na raiz, .1s no herói
     das ocasiões, mais a tabela de nth-child do .cascata. Cinco passos
     para um gesto só.

     --rev-sobe desce de 26px para 20px. A display é Instrument Serif,
     estilo único 400 (ver a nota da linha 26): alta, estreita e de
     contraste alto. 26px sobre o gelo --sand-100 lê como pulo, porque o
     olho vê a caixa se mexendo em vez de ver o texto assentando. 20px é
     a vizinhança dos 18px que a entrada do herói já usa.

     --rev-teto limita o ÍNDICE, não o tempo. O atraso acumula, então
     sem teto o sexto irmão espera 0,66s antes de começar, e 0,66s de
     espera não lê como ritmo: lê como travamento. É o mesmo diagnóstico
     que obrigou o encerrarRevelacao() a existir em 05/09/2026. */
  --rev-passo: .11s;
  --rev-sobe:  20px;
  --rev-teto:  5;

  /* A SEGUNDA DURAÇÃO DA CHEGADA
     Aqui está o ponto. Hoje opacidade e deslocamento terminam juntos,
     nos mesmos --dur-slow, e o bloco pousa de uma vez. Com o
     deslocamento MAIS CURTO que a opacidade o elemento chega ao lugar e
     só depois firma: o movimento termina, a presença continua chegando.
     O site já faz isso no .switch__shot (opacity .9s contra transform
     1.4s no mesmo gesto). Só não fazia na entrada, que é a que aparece
     centenas de vezes. */
  --rev-desl: .6s;


/* ═══ 2 de 2 · assets/css/base.css, substitui as linhas 876-882 ═════ */

.js .rise { opacity: 0; transform: translateY(var(--rev-sobe)); }

/* O atraso sai do índice com teto. min() com número sem unidade dentro
   de calc é válido; se alguém escrever style="--i:2px" a conta inteira
   fica inválida e o atraso cai para zero, sem erro no console. É o modo
   de falha a vigiar numa revisão. */
.rise { --rev-atraso: calc(min(var(--i, 0), var(--rev-teto)) * var(--rev-passo)); }

.rise.is-in {
  opacity: 1; transform: none;
  /* --ease-out e NÃO --ease. A escala do site divide as curvas por papel
     (linhas 113-114): --ease para estado, --ease-out para chegada. O
     .rise era a maior chegada do site e a única usando a curva de
     estado, que sai mais rápido e desacelera menos no fim. O .linhas
     sempre usou --ease-out, e é por isso que o título já lê mais macio
     que o bloco em volta dele: não é impressão, é a curva. */
  transition:
    opacity   var(--dur-slow) var(--ease-out) var(--rev-atraso, 0s),
    transform var(--rev-desl) var(--ease-out) var(--rev-atraso, 0s);
}

/* A revelação de foto herda o mesmo atraso e ganha teto próprio: as
   galerias têm 7 e 8 itens, e ali o atraso É o gesto (descobrir uma
   foto depois da outra), ao contrário de um bloco de texto. Os 1.15s e
   1.6s continuam literais de propósito: mexer na velocidade da
   fotografia é decisão separada, não efeito colateral de uma
   desduplicação (ver onda 3). */
.reveal-shot { --rev-teto: 7; }

/* Movimento reduzido: nada a acrescentar. O gate de base.css:1145 já
   recorta transition-property para opacity e cor, então o deslocamento
   morre sozinho, e a linha 1156 já faz o .rise nascer no lugar. Duas
   durações viram uma, sem uma regra nova. */
```

**Onde aplicar:** `base.css`, efeito imediato nas 19 rotas que carregam `site.js`. A raiz `/` é imune por construção (tem `.rise` próprio no `<style>` inline da linha 34, depois do link de `base.css`). `/corporativo` **não carrega `site.js`** (as três ocorrências no arquivo são comentários; ele traz runtime próprio a partir da linha 960), mas carrega `base.css`, então recebe a calibragem e não a terceira fase.

**Armadilhas:** não reordenar o bloco. `.js .rise { opacity: 0 }` precisa vir antes de `.rise.is-in`, e já houve regressão exatamente assim no `.hero-fade` da home. Não trocar `--dur-slow` por `--dur-focal` no mesmo commit: mistura duas decisões e some com a referência do antes e depois. LCP não muda: o `.rise` já nascia em `opacity: 0` atrás de `html.js`, e o que melhora é o deslocamento terminando 200ms mais cedo.

---

### 3 · O gesto tem fim (terceira fase por remoção de classe)

**O que o visitante vê:** nada de novo. O que muda é que o texto fica nítido depois de entrar e o cartão já revelado responde ao mouse na hora, sem herdar a espera da fila.

Duas objeções corrigidas aqui, e as duas são verificadas no código:

- A proposta original usava `.rise.is-done { transition: none }`. Esse seletor pesa (0,2,0) e **venceria** `.servico { transition: transform var(--dur) var(--ease) }` (`social/espaco.css:87`, 35 elementos `servico rise`), que é justamente a `transition-property` que faz o `--press-caixa` do `:active` funcionar ali. A saída é remover a classe, como o `encerrarRevelacao()` já faz desde 05/09/2026.
- O diagnóstico de que "o cartão perde a transição de cor do hover" **não se confirma**: não existe nenhuma regra `.card:hover { color }` em folha alguma, então o `transition: color` de `social.css:208` é transição sem consumidor. A razão para encerrar o gesto é o `will-change` preso e a contagem de camadas, não uma transição de hover perdida. Não shipar a afirmação como medição. (De brinde: `.card:active { transform: var(--press-caixa) }` **já salta sem transição hoje**, porque a `transition-property` do `.card` é só `color`. É um defeito pequeno, pré-existente, e vale corrigir junto: `transition: color var(--dur) var(--ease), transform var(--dur-press) var(--ease)`.)

```css
/* ═══ 1 de 2 · assets/css/base.css, na regra .rise.is-in do item 2 ═══
   Acrescentar UMA linha ao bloco, e só se o JS abaixo for junto:

     will-change: opacity, transform;

   will-change promove o elemento a camada própria de composição. Uma
   camada por bloco, PERMANENTE, come memória de GPU: são 21 .rise por
   página de casa. A dica vale durante o gesto, não depois dele, e é o
   JS que a desliga (tirando a classe). O argumento de antialiasing
   subpixel NÃO se aplica aqui: o body já declara
   -webkit-font-smoothing: antialiased (base.css:290), então subpixel
   está desligado no site inteiro. O custo é composição, não nitidez.

   Se apenas o CSS for publicado, sem o JS, NÃO acrescentar esta linha:
   sem o desligamento ela é regressão, não otimização. */


/* ═══ 2 de 2 · assets/site.js, ao lado de encerrarRevelacao (~linha 276) */

  /* ── terceira fase da subida ──────────────────────────────────────
     O ciclo tinha duas fases: escondido e animando. O .is-in nunca
     saía, então a transição, o atraso do --i e o will-change ficavam
     pendurados no elemento para sempre.

     A saída é a que o .reveal-shot já usa e por isso mesmo funciona:
     TIRAR A CLASSE quando o gesto acaba. Sem .rise não existe estado
     escondido (opacity volta ao padrão 1), não existe transição de
     entrada e não existe will-change, e o elemento volta ao regime da
     própria folha: o --press-caixa do .servico e a transição de cor do
     .card param de ser governados por um seletor de (0,2,0) que não é
     deles.

     NÃO trocar por uma classe .is-done com `transition: none`: um
     seletor de (0,2,0) apagaria a transition-property dos componentes,
     porque .servico e .card pesam (0,1,0) e perdem o empate.

     O .is-in FICA, e isso é obrigatório: .switch.is-in .switch__arco
     (home.css:363 e evento.css:150) e .deco-line.is-in (home.css:60)
     dependem dele, e o arco do palco das casas sumiria.

     Escuta a OPACIDADE, que é a mais longa do par: escutar o transform
     encerraria o ciclo com o fade ainda correndo. */
  var encerrarSubida = function (el) {
    var pronto = false;
    var limpar = function () {
      if (pronto) return;
      pronto = true;
      el.classList.remove('rise');
    };
    el.addEventListener('transitionend', function (e) {
      /* e.target === el é obrigatório: transitionend BORBULHA, e sem
         este teste a transição de qualquer filho (a foto do
         .reveal-shot dentro do .card, por exemplo) encerraria a subida
         antes da hora. É o modo de falha mais silencioso deste bloco,
         porque só aparece em blocos que contêm mídia. */
      if (e.propertyName === 'opacity' && e.target === el) limpar();
    });
    /* rede, no mesmo espírito dos 2600ms do encerrarRevelacao:
       transitionend não dispara com movimento reduzido, em aba de fundo
       ou quando a transição é suprimida. Teto = maior índice praticado
       (7) x 110ms + a duração mais longa (800ms) + folga. */
    window.setTimeout(limpar, 2600);
  };

  /* e dentro do revelar() que já existe (~linha 293): */
  var revelar = function (el) {
    el.classList.add('is-in');
    if (el.classList.contains('reveal-shot')) encerrarRevelacao(el);
    if (el.classList.contains('rise'))        encerrarSubida(el);
  };

/* Movimento reduzido: o gate global não alcança `will-change`, que é
   propriedade e não transição. Acrescentar no bloco de base.css:1145:
     .rise.is-in { will-change: auto; }
   Sem essa linha, quem pediu menos movimento fica com as camadas e sem
   o gesto, que é o pior dos dois mundos. */
```

**Nota de manutenção:** `.deco-line.rise` nunca dispara `transitionend` de opacidade, porque `home.css:60` declara `transition: transform .8s` e substitui a `transition-property`. Esses elementos sempre caem na rede de 2600ms. Não é quebra, mas alguém vai tentar "consertar" um timer que é load-bearing. Escrever isso no comentário.

---

### 4 · A abertura do herói destravada para as treze internas que faltam

**O que o visitante vê:** ao entrar em qualquer página interna, a foto do topo assenta de um enquadramento levemente maior e o caminho de migalhas e a linha de apoio entram em sequência, em vez de a página nascer parada.

Este é o item de melhor procedência do conjunto: `social/evento.css:312-332` registra o feedback da cliente de 17/09 na íntegra ("senti falta de animação e movimento, a página está dura") e nomeia este gesto como parte da resposta **já aprovada**. Ele roda em 3 rotas e a marcação é a mesma em 16.

Três objeções incorporadas, todas verificadas:

- **O h1 fica fora da cascata.** `assets/css/melhorias.css:197` declara `.page-hero .h-display { view-transition-name: titulo }` e `base.css:253` liga `@view-transition { navigation: auto }`. Hoje a navegação hub → casa tem `titulo` nos dois lados e o título faz morph. Pôr `opacity: 0` nesse h1 em 13 rotas novas entrega à view transition um snapshot invisível: o título apaga durante toda navegação interna e depois pipoca. De quebra, isso elimina o risco de LCP inteiro (o h1 é o segundo candidato depois da foto) e o gesto fica mais editorial: o que se move é o miolo, e o título está firme desde o primeiro quadro, como numa abertura de revista.
- **O `translateY(-6%)` tem de ser repetido.** `social/social.css:78-81` declara `height: 112%; transform: translateY(-6%)` em `.page-hero__media img` para as 16 rotas. Escrever só a escala apaga o deslocamento e desloca o enquadramento de dezesseis heróis de uma vez. É a armadilha que `evento.css:337-338` já documenta por escrito.
- **O destino é `social/social.css`, não `base.css`.** `.page-hero` mora lá, e `/corporativo` não tem `.page-hero` nenhum (usa `.hero__media`), então `base.css` carregaria uma regra com zero consumidores num dos dois universos que ele existe para servir.

```css
/* ═══ 1 de 2 · social/social.css, junto do bloco .page-hero ═════════

   ABERTURA DO HERÓI DE PÁGINA INTERNA

   Escrito para as três rotas de ocasião em social/evento.css:339-358 e
   preso lá pelo seletor body.lp-ocasiao. As outras treze internas abrem
   com o título já parado no lugar, e o único gesto do herói é o
   recolhimento em cartão, que só começa depois de a pessoa rolar.

   O gatilho é o .is-ready que o site.js grava no body (site.js:10-12,
   rAF com rede de 400ms para aba de fundo) e NÃO o IntersectionObserver:
   o herói já está em tela quando a rota abre, e esperar interseção
   revelaria o texto depois de a pessoa já ter olhado para ele.

   O h1 NÃO entra na cascata, e isso é decisão e não omissão: ele carrega
   view-transition-name: titulo (melhorias.css:197) e viaja de uma rota
   para a outra. Dois gestos de chegada no mesmo elemento no mesmo
   segundo é o excesso que a cliente já cortou uma vez. Ele ocupa a
   posição 2 na contagem, então o lead continua sendo o terceiro tempo.
   ─────────────────────────────────────────────────────────────────── */

/* o índice sai do nth-child: o herói tem três a cinco filhos e marcar
   --i à mão em treze arquivos seria pagar caro por uma tabela de cinco
   linhas. Onde o HTML já escreve --i (as três LPs), o inline vence. */
.page-hero .wrap > :nth-child(1)   { --h: 0; }
.page-hero .wrap > :nth-child(2)   { --h: 1; }
.page-hero .wrap > :nth-child(3)   { --h: 2; }
.page-hero .wrap > :nth-child(4)   { --h: 3; }
.page-hero .wrap > :nth-child(n+5) { --h: 4; }

.js .page-hero .wrap > *:not(.h-display) {
  opacity: 0; transform: translateY(16px);
}
/* ORDEM IMPORTA: as duas regras empatam em (0,4,0), então esta precisa
   vir DEPOIS no arquivo. Já houve regressão exatamente assim no
   .hero-fade (home.css:32 registra a pegadinha). */
.is-ready .page-hero .wrap > *:not(.h-display) {
  opacity: 1; transform: none;
  /* passo de .1s e não o --rev-passo de .11s, e partida curta: é a
     primeira tela, e cada centésimo entra na conta do carregamento. */
  transition:
    opacity   var(--dur-focal) var(--ease-out) calc(var(--h, 0) * .1s + .05s),
    transform var(--rev-desl)  var(--ease-out) calc(var(--h, 0) * .1s + .05s);
}

/* A FOTO ASSENTA. O translateY(-6%) vem da linha 81 deste arquivo e
   PRECISA ser repetido: é a mesma propriedade, e escrever só a escala
   apagaria o enquadramento de dezesseis heróis. O enquadramento
   continua vindo de --hero-foco; recorte não é movimento, e por isso
   fica fora do corte de movimento reduzido.

   3.6s é o número social (o corporativo usa 3.2s e a raiz 3.4s; a
   unificação disso é onda 3). */
.js .page-hero__media img,
.js .page-hero__media video { transform: translateY(-6%) scale(1.06); }

.is-ready .page-hero__media img,
.is-ready .page-hero__media video {
  transform: translateY(-6%) scale(1);
  transition: transform 3.6s var(--ease);
}

@media (prefers-reduced-motion: reduce) {
  /* o texto nasce no lugar e a foto não escala, mas MANTÉM o
     deslocamento de enquadramento: zerá-lo não é menos movimento, é
     outra foto */
  .js .page-hero .wrap > *:not(.h-display) { opacity: 1; transform: none; }
  .js .page-hero__media img,
  .js .page-hero__media video,
  .is-ready .page-hero__media img,
  .is-ready .page-hero__media video { transform: translateY(-6%); }
}


/* ═══ 2 de 2 · social/evento.css: APAGAR as linhas 339-358 e 495 ════
   O bloco sobe inteiro. Deixar as duas versões põe dois estados
   iniciais escondidos sobre os mesmos elementos nas três LPs, e o
   sintoma é o texto do herói piscando ou não chegando nunca. Remover
   também a classe page-hero__entra e os style="--i" do HTML das três
   LPs (casamento.html:62,68,69 e irmãs), senão fica classe sem regra em
   três arquivos, que é exatamente como o .deco-line quebrou. */
```

**Onde aplicar:** `social/social.css` (carregada pelas 16 rotas com `.page-hero`, todas com `site.js`). Ganham o gesto: os 2 hubs, as 4 casas, as 5 soluções, `/social/fornecedores` e `/sobre`. Em fornecedores vale mais que em qualquer outra: é a única rota do site com **uma foto só**, e ela é a do herói. `/proposta` carrega as folhas mas não tem `.page-hero`, e `/social/prova-album` não carrega nenhuma das duas: não há rota com estado escondido sem quem o revele.

**Antes de publicar:** medir LCP em `/social/espacos` (foto pequena) e numa casa (`fetchpriority="high"`, 2400x1610) em 4G simulado, e testar uma navegação hub → casa por **clique**, não por reload, para ver o morph do título intacto.

---

### 5 · Índice que o CSS calcula, um atributo por contêiner

**O que o visitante vê:** os quatro cartões de casa deixam de aparecer todos juntos e passam a se montar um depois do outro, como uma lista sendo lida em vez de uma página abrindo.

Três propostas independentes chegaram aqui, e as três tentaram escalonar **por coluna**, com media queries espelhando o grid. Todas as três tabelas de celular estavam erradas, e sempre na mesma direção: tratando um item que atravessa duas colunas como se não atravessasse, ou uma grade de duas colunas como se fosse de uma (`.equipe` a ≤520px é `1fr 1fr`, `melhorias.css:94`). **A sofisticação sai.** O observer já revela cada elemento quando ele entra em quadro, e em grades de 3 a 6 itens o índice corrido com teto é indistinguível do índice por coluna e não descola quando alguém muda o `grid-template-columns`.

```css
/* ═══ 1 de 3 · assets/css/base.css, no bloco MOVIMENTO, depois do .rise

   NUMERAÇÃO DOS IRMÃOS

   O --i vinha escrito à mão no HTML, irmão por irmão, e por isso as
   grades de cartão das internas nunca receberam nenhum: grep por
   'card rise" style="--i' em social/espacos/index.html retorna vazio, e
   os quatro cartões de casa chegam no mesmo quadro. Mesmo caso nas seis
   .forn__cat de /social/fornecedores e nos três retratos de /sobre.

   Aqui a POSIÇÃO vira índice, sem JS e sem atributo por filho: quem
   acrescentar um cartão amanhã não renumera nada. O teto vem de graça,
   porque quem passa do quinto herda a primeira regra.

   NÃO escalonar por coluna com media queries espelhando o grid. Foi
   tentado e a conta de celular erra em toda grade que tenha um item
   atravessando duas colunas; e o índice descola em silêncio no dia em
   que alguém mexer em social.css ou melhorias.css. O observer já revela
   cada elemento quando ELE entra em quadro, então a segunda fileira já
   chega depois por conta própria.

   Propriedade personalizada HERDA, e aqui isso é o desejado: um .card
   com --i:2 passa o índice para o .card__media.reveal-shot dentro dele,
   então a foto revela em sincronia com o cartão em vez de no quadro
   zero (a foto acenderia dentro de um cartão ainda invisível). Custo
   medido: numa grade de quatro, a última foto começa a revelar a 0,33s
   e o clip termina a 1,48s. Se isso parecer lento na tela, o ajuste é
   --rev-passo: .08s NO CONTÊINER, não mexer na herança.
   ─────────────────────────────────────────────────────────────────── */
:is(.cascata, [data-ritmo]) > *             { --i: var(--rev-teto); }
:is(.cascata, [data-ritmo]) > :nth-child(1) { --i: 0; }
:is(.cascata, [data-ritmo]) > :nth-child(2) { --i: 1; }
:is(.cascata, [data-ritmo]) > :nth-child(3) { --i: 2; }
:is(.cascata, [data-ritmo]) > :nth-child(4) { --i: 3; }
:is(.cascata, [data-ritmo]) > :nth-child(5) { --i: 4; }


/* ═══ 2 de 3 · assets/css/base.css, substitui as linhas 921-934 ═════

   LISTA (E QUALQUER BLOCO) QUE SE MONTA ITEM A ITEM

   Deixa de ser só de lista: `> li` vira `> *`, e o mesmo gesto passa a
   servir os três passos da chamada final e qualquer contêiner cujos
   FILHOS devam chegar um a um. A tabela de nth-child sai (travava no
   nono item, repetia um passo .07s que não estava em token nenhum, e só
   funcionava com <li>), mas o PASSO e o TETO dela ficam: item de lista
   é leitura, não chegada de superfície, e uma ficha técnica de oito
   linhas com o tempo de bloco terminaria 0,88s depois de começar. */
.cascata {
  --rev-passo: .07s;
  --rev-teto:  7;
}
.js .cascata > * { opacity: 0; transform: translateY(14px); }
.cascata > * { --rev-atraso: calc(min(var(--i, 0), var(--rev-teto)) * var(--rev-passo)); }
.cascata.is-in > * {
  opacity: 1; transform: none;
  transition:
    opacity   var(--dur)      var(--ease-out) var(--rev-atraso, 0s),
    transform var(--rev-desl) var(--ease-out) var(--rev-atraso, 0s);
}

/* no bloco de movimento reduzido (linha ~1164), trocar o seletor:
   `.js .cascata > li` passa a `.js .cascata > *` */
@media (prefers-reduced-motion: reduce) {
  .js .cascata > * { opacity: 1; transform: none; }
}
```

```html
<!-- ═══ 3 de 3 · HTML: um atributo por CONTÊINER ═══════════════════

  <div class="grid grid--3" data-ritmo>     11 rotas, 1 cada
                                            (hub de espaços e de soluções,
                                             "Os outros espaços" das 4 casas,
                                             "As outras soluções" das 5 soluções)
  <div class="forn" data-ritmo>             /social/fornecedores, 6 categorias
  <ul class="equipe" data-ritmo>            /sobre, 3 retratos
  <ul class="numeros" data-ritmo>           /sobre, 2009 / 4 / 1.200

  E na .galeria-oc das 3 LPs: TIRAR os oito style="--i:N" de cada rota
  (hoje 1,2,3,4,5,6,6,6, com as três últimas no mesmo quadro) e pôr
  data-ritmo no contêiner. Estilo de atributo vence folha, então sem
  remover os inline a regra nova não faz nada. São 24 atributos a menos
  e uma fonte de verdade só.
-->
```

**Três limpezas obrigatórias no mesmo commit**, todas verificadas:

1. Em `/sobre`, `ol.tempo` (linhas 83-87), `ul.valores` (98-101) e `ul.equipe` (131-133) já têm `.rise` e `style="--i:N"` **nos filhos**. Pôr `data-ritmo` no pai sem tirar o `rise` e o `--i` de cada `<li>` cria dois estados escondidos e dois gatilhos no mesmo nó.
2. `ul.numeros` (sobre:65) e `ul.spec` (sobre:114) estão **dentro** de `div.prose.rise`, e as 6 `ul.forn__lista` estão dentro de `div.forn__cat.rise`. Aninhar escalonamento de filho dentro de fade de pai são dois gestos disputando a mesma leitura. Ou tira o `.rise` do pai, ou deixa essas listas fora desta rodada. Em `/social/fornecedores`, que é a rota sem fotografia, a recomendação é tirar o `.rise` das seis categorias e ficar com a cascata dos 21 nomes: a lista lendo como enumeração é o que a rota ganha; a categoria subindo é o que ela não precisa.
3. Não pôr `data-ritmo` em contêiner que tenha título com `.linhas` dentro. O `--i` herda e o `.linhas` soma (`base.css:958` usa `--l * .07s + --i * .11s`), então um título na terceira posição atrasaria 0,22s a mais. Nas 11 grades não tem; confira antes de estender.

---

### 6 · A chamada final chega em três tempos

**O que o visitante vê:** no fim de toda página, a frase manuscrita convida, o título pergunta e então os botões aparecem, em vez de os três surgirem juntos como um bloco de texto.

```html
<!-- ═══ 1 de 2 · HTML: 22 instâncias em 16 arquivos ══════════════════
     (contagem conferida arquivo por arquivo: 13 rotas com 1 cada,
     mais casamento, debutante e bodas com 3 cada. A contagem de 19 que
     circulou está errada.)

       de:   <div class="wrap cta rise">
       para: <div class="wrap cta cascata">

     Três delas são `wrap cta rise on-dark` (casamento:213 e irmãs):
     manter o on-dark.

     Só isso. Os filhos passam a ser numerados pela regra de posição do
     item 5 e o observer já observa .cascata (site.js:261).
     NÃO deixar as duas classes juntas: o pai desvaneceria enquanto os
     filhos escalonam, e o resultado lê como atraso, não como ritmo.
-->
```

```css
/* ═══ 2 de 2 · social/social.css, junto do .cta (linhas 252-255) ════

   A chamada final é a última coisa que todo visitante vê: 22 lugares em
   16 rotas, com o texto quase sempre idêntico. Era um .rise só, então
   script, título e botões chegavam no mesmo quadro.

   Em .cascata os três chegam em sequência, e a sequência É o argumento:
   a frase manuscrita convida, o título pergunta, os botões respondem.
   Fora de ordem não é uma conversa, é um cartaz.

   .09s e não os .14s propostos: a contagem de filhos varia de 2 a 4
   (os CTAs das LPs têm p.script + h2 + p.lead + .cta__actions, e os de
   faixa escura não têm o script). Com .14s o quarto filho só estaria
   inteiro 1,08s depois de o bloco entrar, e o botão é o elemento de
   conversão: ele não pode ser o último a chegar por mais de meio
   segundo. Com .09s e o fade de --dur, os botões ficam legíveis dentro
   de uns 0,8s em qualquer uma das 22 instâncias.

   O .cta__actions é UM filho com dois botões dentro: eles chegam
   juntos, de propósito, porque a decisão é entre eles e escaloná-los
   sugeriria hierarquia que não existe.

   NÃO acrescentar .linhas ao h2 desta seção: máscara por linha mais
   cascata por filho são dois gestos disputando a mesma superfície, que
   é a mesma razão pela qual o .eventos-grid desliga o zoom da foto no
   hover (social.css:274). Um gesto por superfície. */
.cta.cascata {
  --rev-passo: .09s;
  --rev-teto:  4;
}

/* Movimento reduzido já está coberto pelo corte do .cascata em
   base.css: os filhos nascem no lugar e a página termina legível, com
   os botões alcançáveis pelo Tab durante todo o gesto. */
```

**Dependência dura:** sem a generalização de `> li` para `> *` do item 5, trocar `.rise` por `.cascata` deixa o CTA **sem gesto nenhum**, porque os filhos não são `<li>`. As duas vão na mesma leva ou nenhuma vai.

**Conferir antes de editar:** o `.ornament` é irmão do `.wrap.cta`, não filho (verificado em `sobre:139-140` e `a-querencia:549-550`), então não entra na contagem. Se em algum arquivo ele estiver dentro do wrap, a numeração começa errada.

---

### 7 · A dobra clara passa a existir

**O que o visitante vê:** as faixas de Ocasiões e de Contato param de fingir que são um bloco de cor diferente, o vão de creme vazio entre dois blocos cai pela metade, e uma linha muito fina no alto de cada faixa nova diz que trocou de assunto.

Três propostas que só funcionam juntas. As duas lentes aprovaram as três com correção; as correções estão aplicadas.

```css
/* ═══ 1 de 3 · social/social.css, no bloco SEÇÕES (junto da linha 107)

   A MESA É UMA

   .eventos e .contato eram as duas únicas faixas em --sand-50, e as
   duas sempre encostam na mesa (--sand-100). Medido pelo método WCAG da
   tabela dos temas: 1,056:1. Dois pontos de L* no mesmo matiz não são
   uma dobra, são a mesma folha com uma emenda de impressão. Nas quatro
   casas isso custa quatro fronteiras falsas por rota.

   Retirado o terceiro valor claro, a escada das internas fica com o que
   se lê: a mesa, o paper (1,171:1, agora com o vinco declarando a
   passagem) e a tinta (14,827:1).

   --sand-50 NÃO sai do tema e não perde emprego: continua sendo o
   degrau de SUPERFÍCIE DE COMPONENTE, que é o uso em que dois pontos de
   L* bastam porque existe uma borda de 1px ao lado dizendo onde a
   superfície começa. O que sai é o emprego de FAIXA, onde não há borda.

   Ganho lateral medido: o campo do formulário de #contato usa
   `background: var(--sand-50)` (social.css:575), ou seja, hoje o
   preenchimento é IDÊNTICO ao da faixa (1:1) e o campo existe só pela
   borda. Sobre a mesa ele passa a ter 1,056:1 de fundo próprio.

   `background: none` e não `transparent`: as duas regras escrevem
   background em shorthand, e `none` reseta o shorthand inteiro sem
   deixar background-image órfã. Especificidade de 0,2,0 porque
   social/espaco.css:318 repinta a faixa com o mesmo --sand-50 nas
   quatro casas. */
.eventos,
.contato,
.contato.contato-casa { background: none; }

/* Dívida paga no mesmo commit: sem tinta própria as duas deixam de ser
   laje, e base.css:1239 diz isso por escrito ("faixa sem tinta própria
   não vira laje porque ela É a mesa"). Hoje é inerte porque
   melhorias.css:15 zera raio e fresta, mas essa linha é um interruptor
   de uma linha: revertida, .contato.laje + .section--invert casaria na
   regra de fresta de base.css:1295 e abriria uma fresta entre uma faixa
   sem tinta e o royal. */
.eventos, .contato { border-radius: 0; margin-block-start: 0; }


/* ═══ 2 de 3 · assets/css/base.css, depois do bloco LAJE ════════════

   VINCO DE DOBRA · a fronteira que a cor não consegue fazer

   1px de --ui-sombra-fio mede 1,51:1 de aresta sobre qualquer um dos
   três chãos claros: 29% mais contraste que a maior das trocas de cor
   que ele anuncia. Não é uma fronteira forte; é MARCA DE CAPÍTULO, e é
   assim que ela deve ser apresentada à cliente.

   ::after e não ::before: corporativo/corporativo.css:391 e :412 já
   usam o ::before de .section--photo e .section--respiro para o véu
   fotográfico, e um `block-size: 1px` sem competidor colapsaria esse
   véu numa tira de 1px, levando com ele os 5,6:1 medidos para o título
   branco sobre a foto aérea. Nenhum .section::after está ocupado.

   Desenha DENTRO da caixa, sem sangria: .section tem overflow-x: clip
   com fallback overflow-x: hidden (social.css:285-286), e hidden
   blockifica os dois eixos.

   Contraste de luminância sub-relata troca de MATIZ, e é essa a régua
   que decide onde o vinco existe: rosa contra creme mede 1,385:1 e LÊ,
   porque é outro matiz; mesa contra sand-50 mede 1,056:1 e não lê,
   porque é o mesmo matiz. O vinco atende o segundo caso e nunca o
   primeiro. */
.laje { position: relative; }   /* .eventos e .contato não são .section
                                   e não tinham containing block */

:is(.section, .laje) + :is(.section, .laje) { --dobra-fio: var(--ui-sombra-fio); }

/* Onde a cor já é evento, o vinco sai: um segundo traço numa aresta de
   14:1 é ruído. A lista tem de incluir as três faixas escuras do
   corporativo (.section--petrol, .section--photo, .section--respiro),
   porque base.css é compartilhado e a sequência real daquela rota é
   photo → petrol → paper. */
:is(.section--invert, .on-dark, .respiro-foto, .section--rose,
    .section--petrol, .section--photo, .section--respiro) + :is(.section, .laje),
:is(.section, .laje):is(.section--invert, .on-dark, .section--rose,
    .section--petrol, .section--photo, .section--respiro) {
  --dobra-fio: transparent;
}

/* E sai entre vizinhas de MESMA tinta, que é decisão já registrada em
   base.css:1301-1310: "eles nunca tiveram fronteira, e nada aqui
   inventa uma". Alcança o par #clientes/#manifesto do corporativo e o
   par #depoimento/#perguntas das quatro casas. */
.section--paper + .section--paper,
.section:not([class*="--"]) + .section:not([class*="--"]) { --dobra-fio: transparent; }

:is(.section, .laje)::after {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  block-size: 1px;
  background: var(--dobra-fio, transparent);
  transform-origin: left;
  transform: scaleX(var(--dobra-vinco, 1));
  z-index: 0;              /* sobre o fundo, sob o conteúdo: .section >
                              .wrap já é z-index 1 (social.css:109) */
  pointer-events: none;
}

/* O fio se desenha preso à rolagem, no mesmo padrão @property +
   animation-timeline que o .acende estabeleceu (base.css:1199). A
   animação mora na SEÇÃO e não no pseudo de 1px: uma tira de 1px de
   altura entra e sai de quadro no mesmo pixel de rolagem. */
@property --dobra-vinco {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .js :is(.section, .laje) + :is(.section, .laje) {
      animation: dobraVinco linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 60%;
    }
    @keyframes dobraVinco { from { --dobra-vinco: 0; } to { --dobra-vinco: 1; } }
  }
}
/* Movimento reduzido NÃO precisa de bloco, e isso é de propósito: o
   estado sem animação já é o fio inteiro (initial-value: 1), então a
   armadilha do gate global (animação completa uma volta instantânea e
   ESTACIONA no estado final) trabalha a favor. Se o gesto fosse por
   transition de transform, o gate tira `transform` da lista de
   transition-property e o fio ficaria em scaleX(0) para sempre,
   invisível justamente para quem mais precisa da fronteira. */


/* ═══ 3 de 3 · assets/css/base.css, depois do vinco ════════════════

   FUSÃO DA FAMÍLIA CLARA

   base.css:1304 já funde pares de MESMA classe, com o argumento
   escrito. O que falta é reconhecer a FAMÍLIA: mesa, sand-50 e paper
   estão dentro de 1,2:1 uma da outra, e três valores dentro de 1,2:1
   não são três dobras. Fundir aqui é tirar UMA das duas paradas.

   --section-y-tight e NÃO 0px. Numa página que vende casamento no
   interior o vão de creme não é desperdício, é o registro: é o que faz
   a página parecer caro (a referência do hero é a Sarah Haywood, e ar é
   metade do argumento dela). Com 0px a primeira coisa que a cliente
   nota é que a página encurtou de 160 a 700px, e página mais curta lê
   como mais apertada, não como mais viva. Meia parada de ar some, a
   dobra aperta, e .section--tight e .section--loose continuam sendo os
   botões de ritmo declarados do site.

   Especificidade 0,4,0 de propósito: .eventos e .contato escrevem
   `padding: var(--section-y) 0` em shorthand (social.css:342 e :502) e
   os modificadores de ritmo escrevem padding-block. A longhand com
   0,4,0 vence as três sem depender da ordem dos arquivos.

   As três faixas escuras do corporativo entram no :not() pela mesma
   razão do vinco, e o par .section--paper + .section--paper fica de
   fora para não mexer na altura de #clientes/#manifesto, que
   base.css:1304 protege por nome. */
:root { --dobra-funde: var(--section-y-tight); }

:is(.section, .laje):not(:is(.section--invert, .on-dark, .section--rose,
    .section--petrol, .section--photo, .section--respiro))
+ :is(.section, .laje):not(:is(.section--invert, .on-dark, .section--rose,
    .section--petrol, .section--photo, .section--respiro)) {
  padding-block-start: var(--dobra-funde);
}
.section--paper + .section--paper { padding-block-start: var(--section-y); }
```

**Antes de publicar:** varrer as 11 internas por faixa cujo **primeiro filho é mídia** (um `.split` com `.split__media` primeiro, um `.evento__galeria`). Onde for, a foto encosta no vinco e ele lê como borda da imagem; ali o `--dobra-funde` fica em `--section-y`. E o `.ornament--tr` nasce em `top: 10px`: com o padding reduzido ele passa a nascer mais perto do fio, o que é o desejado, mas vale um olhar nas rotas que têm ornamento na faixa que chega.

---

### 8 · O fio que se desenha, nas casas e na cronologia

**O que o visitante vê:** nas páginas de casa aparece um traço fino que se desenha da esquerda quando o bloco de contato entra. Na linha do tempo de `/sobre`, a cronologia passa a ser desenhada conforme a pessoa desce.

Este é o caso mais claro de componente que existe por acidente. `<span class="deco-line rise">` está no HTML das quatro casas (linha 414 nas quatro) e a regra vive em `social/home.css:52-60`, que **só `/social` carrega**. Nas casas o fio não é desenhado, não ocupa espaço e não tem uma única declaração: o HTML pede um componente que a folha não tem.

```css
/* ═══ 1 de 2 · social/social.css, e APAGAR de social/home.css:52-60

   O FIO QUE SE DESENHA

   `display: block` NÃO é detalhe: nas quatro casas o elemento é um
   <span>, e caixa inline ignora width e height. Sem esta linha a
   promoção não entrega nada, que é exatamente o bug que ela existe para
   consertar. (home.css:55 tem; a reescrita é que esquecia.)

   currentColor e não um token de cor: o fio herda a tinta do bloco,
   então o mesmo componente serve a mesa e o royal sem uma segunda
   regra, e a sobrescrita local de home.css:521 (branco a .3 no banner)
   deixa de ser necessária. Isso NÃO vale como precedente: passa aqui só
   porque a tinta do bloco pai já veio de um token. Nas casas o fio fica
   em .contato-text sobre papel, onde a tinta é --ui-text (royal), e
   royal a 20% é numericamente vizinho do --ui-border que já está na
   página. Se um dia ele carregar informação, o token passa a ser
   --ui-accent-on-dark.

   O atraso fixo de .2s sai: o fio é um irmão como qualquer outro e o
   --rev-atraso do item 5 já o numera. */
.deco-line {
  display: block;
  width: var(--fio-medida, 48px);
  height: 1px;
  background: currentColor;
  opacity: .2;
  transform-origin: left;
}
.js .deco-line { transform: scaleX(0); }
.deco-line.is-in {
  transform: scaleX(1);
  transition: transform var(--dur-slow) var(--ease-out) var(--rev-atraso, 0s);
}

@media (prefers-reduced-motion: reduce) {
  /* o fio FICA, porque é separação de conteúdo; o que sai é o desenho */
  .js .deco-line { transform: none; }
}


/* ═══ 2 de 2 · assets/css/melhorias.css, depois do bloco .tempo (79) ═

   A CRONOLOGIA SE DESENHA

   Os cinco marcos de /sobre#linha-do-tempo já escalonam, mas a régua de
   1px que os liga (.tempo::before) é estática, então a página lê como
   cinco parágrafos numerados. Preso à rolagem, o fio vira o eixo do
   tempo, e o gesto é o mesmo do .deco-line: linha sendo desenhada
   enquanto se lê, que é o argumento que base.css:941 já escreveu para o
   título por máscara.

   Escapa da armadilha que matava o parallax (item 1) porque o único
   ancestral não-visível de .tempo é a seção-laje em `overflow-x: clip`,
   e clip não cria scroll container. Medido: source = HTML, currentTime
   de 60% a 82% ao rolar 300px.

   transform e não width: escalar não relayouta, e a régua é absoluta
   dentro de um grid de cinco colunas que não deve ser remedido por
   quadro.

   O EIXO MUDA a 900px (melhorias.css:79 vira vertical) e o .tempo--3 é
   vertical sempre (linha 130). Escalar no eixo errado não faz nada
   visível e passa por "não funcionou" em vez de erro. Usar o limite
   exato da folha, 900px, não 900.98px. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .js .tempo { position: relative; }
    .js .tempo::before {
      transform-origin: left center;
      animation: fioCorre linear both;
      animation-timeline: view();
      animation-range: entry 35% cover 45%;
    }
    @keyframes fioCorre { from { transform: scaleX(0); } to { transform: scaleX(1); } }

    .js .tempo--3::before { transform-origin: center top; animation-name: fioDesce; }
    @media (max-width: 900px) {
      .js .tempo::before { transform-origin: center top; animation-name: fioDesce; }
    }
    @keyframes fioDesce { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  }
}

/* Movimento reduzido: o fio nasce inteiro. */
@media (prefers-reduced-motion: reduce) {
  .tempo::before, .tempo--3::before { animation: none; transform: none; }
}

/* IMPRESSÃO. /proposta é feita para imprimir (melhorias.css:215 e o
   @media print de 230-237) e .prop__percurso .tempo--3 herda o gesto de
   graça. Em impressão não existe rolagem, então uma animação presa à
   rolagem imprime no ESTADO INICIAL: o fio sai da folha em scaleY(0) e
   o percurso da visita vira cinco pontos soltos, num documento que vai
   para a mão da cliente. */
@media print {
  .tempo::before, .tempo--3::before { animation: none; transform: none; }
}
```

**Troca de coerência que vem junto, custo de uma palavra:** `ol.tempo--3` em `social/fornecedores/index.html:127` é hoje um `.rise` e passa a `.cascata` (os três passos são a única narrativa sequencial da rota e chegam num quadro só), e `ul.spec` em `sobre/index.html:114` passa a `spec cascata`, porque o **mesmo componente já é `.cascata` nas páginas de casa** (`a-querencia.html:214`). Duas rotas vizinhas com o mesmo bloco se comportando de dois jeitos é o tipo de divergência que faz o site parecer montado por pedaços.

---

### 9 · Manchete nas rotas de tese

**O que o visitante vê:** o primeiro título de cada página de casa e de solução fica grande o bastante e com as linhas juntas o bastante para ser lido como um bloco único, e não como três linhas empilhadas.

Tipografia pura: zero JS, zero movimento, zero camada de composição, zero competição com a foto. É a única proposta do conjunto que a cliente não tem como ler como excesso, e é a que ela tem mais chance de nomear como "vida". Vale dizer isso a ela com essas palavras, porque ela pediu movimento e já recusou excesso duas vezes.

```css
/* ═══ 1 de 3 · assets/css/base.css, no :root (junto de --leading-display) */

  /* A manchete é o degrau que existe para uma frase valer por um
     parágrafo, e a ENTRELINHA é o que faz as linhas virarem um objeto só
     em vez de linhas empilhadas. Estava em 1.02, que é entrelinha de
     título de seção.

     .97 e não a .94 da referência: lá a display é uma sans de
     descendente curto; a Instrument Serif desce a -0,310 do em (medida
     anotada em base.css:947, contra -0,287 da Cormorant que saiu), e a
     .94 o "ç" de uma linha encosta no "l" da seguinte. .97 é o piso que
     ainda lê como bloco único sem colisão. Título de UMA linha aguenta
     .94. */
  --leading-manchete: .97;

  /* -.016em SOLTA um pouco a partir do -.02em de hoje. A Instrument
     Serif é 19% mais estreita que a Cormorant que saiu (base.css:216) e
     -.02em nessa face fecha os miolos. O valor continua na ordem do
     -1,4px sobre 112px da referência (-.016em em 6rem = -1,5px), mas o
     movimento aqui é para FORA, não para dentro: escrever o contrário
     no comentário é o tipo de PORQUÊ errado que a disciplina deste
     repositório existe para impedir. */
  --tracking-display: -.016em;


/* ═══ 2 de 3 · assets/css/base.css, substitui o .manchete (986-991) ═

   `text-wrap: balance` JÁ está na regra de hoje: não apresentar como
   novidade. */
.manchete {
  font-size: var(--text-manchete);
  line-height: var(--leading-manchete);
  letter-spacing: var(--tracking-display);
  text-wrap: balance;
}

/* A máscara do .linhas é calibrada pela entrelinha: o respiro de .16em
   (base.css:951) foi medido contra 1.02, e a nota da linha 946 registra
   que ele já subiu de .14em por causa desta mesma face. Com .97 o
   recorte volta a cortar o descendente, então sobe para .19em SÓ na
   manchete, com a margem negativa devolvendo o espaço ao fluxo. Baixar
   a entrelinha sem mexer aqui corta o "ç" e o "p" de toda linha que não
   seja a última. */
.manchete .linhas__l { padding-bottom: .19em; margin-bottom: -.19em; }

/* Tracking negativo é medida de corpo grande. No celular a manchete cai
   para o piso do clamp (2,75rem) e o mesmo valor fecharia o miolo da
   letra, apagando a haste fina que é o desenho da serifada de display. */
@media (max-width: 600px) { .manchete { letter-spacing: -.004em; } }


/* ═══ 3 de 3 · social/home.css:34, ESTENDER a regra que já existe ═══

   BLOQUEANTE para a home social, e o próprio arquivo já documenta a
   armadilha: home.css:32-34 registra que .heading-lg vencia o empate
   com .manchete e consertou SÓ o font-size. .heading-lg declara
   line-height 1.08 e letter-spacing -.008em em (0,1,0) numa folha que
   carrega DEPOIS do base.css, então venceria .manchete nas duas
   propriedades novas. social/index.html:158 é
   `h2.heading-lg.manchete.linhas`: receberia o respiro de máscara de
   .19em mantendo entrelinha 1.08, ou seja, a compensação sem a
   mudança. */
.heading-lg.manchete {
  font-size: var(--text-manchete);
  line-height: var(--leading-manchete);
  letter-spacing: var(--tracking-display);
}
```

**Onde aplicar no HTML:** acrescentar `manchete` ao **primeiro** `h2.h-section.linhas` de cada uma das 4 casas (`a-querencia.html:172` e irmãs) e das 5 soluções. Hoje `.manchete` tem 6 consumidores em 4 rotas (`corporativo:208` e `:254`, `social/index:98` e `:158`, `solucoes/index:63`, `espacos/index:63`); `casamento.html` **não tem** (o grep bate dentro de um comentário).

**Deixar de fora `/sobre` e `/social/fornecedores`.** O risco aqui não é repetição, é ubiquidade: se toda rota abre em 6rem, o degrau deixa de ser degrau. Aplicar onde a primeira seção carrega tese. E conferir separado o `corporativo:208`, que usa `manchete acende` no mesmo elemento: ali a entrelinha nova cai num título sem máscara.

---

### 10 · Controle de parada do rodízio no celular

Não é percepção, é conformidade, e o problema é sério. Abaixo de 940px o `.switch__stage` é `display: none` (`base.css:631`), **mas o rodízio continua rodando** e o que ele troca na lista é o painel aberto, a cada 6 segundos. As três pausas existentes não alcançam quem está lendo: `mouseenter` não existe em toque, `focusin` só se a pessoa tabular, e `escolher()` só dispara se ela tocar num cartão. Quem só rola e lê tem o painel fechando embaixo do olho. É conteúdo em movimento automático acima de 5s sem controle de parada (WCAG 2.2.2), em 5 rotas.

O **anel de progresso** que foi proposto para isso está descartado (ver a seção final): ele se anula tecnicamente e é vocabulário de outra marca. O que entra é um botão de texto no padrão de rótulo que o site já usa.

```html
<!-- último filho de #venueSwitch, depois da .switch__list -->
<button class="switch__parar" type="button" data-switch-pausa aria-pressed="false">
  <span data-switch-rotulo>Pausar</span>
</button>
```

```css
/* assets/css/base.css, junto da régua do rodízio (linha ~734)

   O indicador de tempo continua sendo o fio que já atravessa o cartão
   ativo (.vcard.is-on::after, alimentado pelo mesmo --rp do relógio):
   no celular ele fica exatamente sob o painel que a pessoa está lendo.
   Não acrescentar um segundo indicador para o mesmo número, que é o que
   switch.js:94-97 chama de "dois mecanismos para um efeito só".

   O botão NÃO pode ler --ro: pausar() chama pintarRegua(false), que
   escreve --ro: 0, então o controle que a pessoa acabou de apertar
   desapareceria. Fica sempre visível enquanto o rodízio existir. */
.switch__parar {
  display: inline-flex; align-items: center; gap: 10px;
  margin-top: var(--space-4); padding: 0;
  background: none; border: 0; cursor: pointer;
  color: var(--ui-text-muted);
  font-size: var(--text-xs); letter-spacing: .12em; text-transform: uppercase;
  transition: color var(--dur-fast) var(--ease);
}
.switch__parar:hover { color: var(--ui-text); }
.on-dark .switch__parar,
.section--invert .switch__parar { color: var(--ui-text-invert-muted); }

/* Em movimento reduzido o switch.js nem instala o rodízio (o bloco
   `if (!reduz)` da linha 137), então não há o que parar: o controle sai
   de cena junto com a régua. Isto é contrato explícito com o JS, não
   decoração. */
@media (prefers-reduced-motion: reduce) { .switch__parar { display: none; } }
```

```js
/* assets/switch.js, dentro do bloco `if (!reduz)` */
var botao  = sw.querySelector('[data-switch-pausa]');
var rotulo = sw.querySelector('[data-switch-rotulo]');

/* o estado do botão e o estado do relógio saem da MESMA variável, então
   não há como o rótulo dizer Pausar com o rodízio parado. Rótulo que
   mente é pior que ausência de rótulo. */
var pintarBotao = function () {
  if (!botao) return;
  botao.setAttribute('aria-pressed', String(escolhido));
  if (rotulo) rotulo.textContent = escolhido ? 'Retomar' : 'Pausar';
};

if (botao) {
  botao.addEventListener('click', function () {
    escolhido = !escolhido;
    if (escolhido) { pausar(); decorrido = 0; pintarRegua(false); }
    else {
      /* pausado TAMBÉM precisa zerar: o botão vive dentro do #venueSwitch
         e o focusin da linha 143 já pôs pausado = true ao focá-lo, então
         sem esta linha o tocar() volta cedo e o rótulo passa a oferecer
         Pausar com o relógio parado. */
      pausado = false;
      tocar();
    }
    pintarBotao();
  });
}

/* escolher() já para de vez quando a pessoa escolhe uma casa: o rótulo
   tem de acompanhar, senão continua oferecendo Pausar o que já parou */
var escolher = function () {
  escolhido = true;
  pausar();
  decorrido = 0;
  pintarRegua(false);
  pintarBotao();
};
```

**Onde aplicar:** `#venueSwitch` das 5 rotas que carregam `switch.js` (as 3 LPs de ocasião, `/social` e `/corporativo`). O botão precisa ficar **dentro** do `#venueSwitch`, que é onde o `switch.js` escreve as variáveis. Não estender ao álbum de `/social/prova-album` nesta rodada: ele já tem botão de pausa próprio.

---

## Onda 2 · componentes novos

| # | Item | Onde | Esforço | Impacto | Rotas |
|---|---|---|---|---|---|
| 1 | O lightbox ganha entrada e fusão, e as 25 figuras das soluções passam a ampliar | `melhorias.css`, `melhorias.js`, 5 HTML | M | alto | 12 |
| 2 | As galerias de lightbox passam a ser descobertas | `melhorias.css`, `evento.css`, `site.js` | M | alto | 6 |
| 3 | Trilho único, substituindo as quatro escritas | `melhorias.css` + HTML | M | médio | 7 |

---

### 1 · O lightbox ganha entrada e fusão

**O que o visitante vê:** a foto ampliada abre surgindo por cima da página em vez de aparecer de um quadro para o outro, e ao avançar com a seta uma foto se dissolve na outra, sem piscar o fundo escuro no meio. E nas cinco páginas de solução, as figuras que hoje revelam mas não ampliam passam a abrir no clique.

É a única superfície do site onde o visitante **pede** a fotografia, em 7 rotas e 50 fotos, e a única sem gesto nenhum: `melhorias.css:43-51` é `display: none → flex` e `melhorias.js:39-44` troca o `src` no lugar. Confirmado também que `grep -c data-lightbox social/solucoes/gastronomia.html` retorna **0**: as 25 figuras das cinco soluções respondem ao olho e não ao clique.

```css
/* ═══ assets/css/melhorias.css, substitui as linhas 43-65 ═══════════

   visibility + opacity e não display: display não transiciona (nem na
   entrada nem na saída), e visibility: hidden tira os botões da ordem
   de Tab, que é o que o display fazia de graça.

   AS TRAVAS DE TAMANHO FICAM NO <img>, não num palco novo. Um palco em
   grid tem altura indefinida (vem das próprias imagens), e
   `max-height: 100%` contra altura indefinida resolve como `none`: as
   fotos das casas são 1400x1875 em retrato e passariam a renderizar na
   altura intrínseca, estourando a tela. O código de hoje funciona
   justamente porque a medida é ABSOLUTA. */
.lb {
  position: fixed; inset: 0; z-index: 400;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--ui-bg-invert) 94%, transparent);
  padding: clamp(16px, 4vw, 48px);
  visibility: hidden; opacity: 0;
  /* visibility precisa estar listada explicitamente, senão a saída é
     instantânea e a foto desaparece antes do véu */
  transition: opacity var(--dur) var(--ease-out), visibility var(--dur);
}
.lb.is-open { visibility: visible; opacity: 1; }

/* o palco empilha as duas camadas no mesmo lugar; sem ele, com as
   imagens em position absolute, não haveria medida nenhuma */
.lb__palco { position: relative; display: grid; max-width: 100%; }
.lb__palco img {
  grid-area: 1 / 1;
  max-width: 100%;
  /* svh depois de vh, na ordem que o base.css já usa: com a barra de
     endereço recolhida o vh é maior que a tela real e a foto sai
     cortada embaixo no celular */
  max-height: calc(100vh  - 2 * clamp(16px, 4vw, 48px));
  max-height: calc(100svh - 2 * clamp(16px, 4vw, 48px));
  object-fit: contain; display: block;
  box-shadow: var(--elev-1);
  opacity: 0;
  /* a foto entra 2% maior e assenta. --dur-slow e não --dur-foto: o
     token de 1,4s descreve "foto que assenta ao entrar em quadro", e
     aqui a pessoa acabou de clicar e está esperando. */
  transform: scale(1.02);
  transition: opacity var(--dur) var(--ease-out),
              transform var(--dur-slow) var(--ease-out);
}
.lb.is-open .lb__palco img.is-on { opacity: 1; transform: none; }

/* NO CELULAR as setas laterais cobrem 96px de foto numa tela de 390px.
   Descem para a base, com a legenda entre elas. */
@media (max-width: 600px) {
  .lb { padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px)); }
  .lb__ant, .lb__prox { top: auto; bottom: calc(8px + env(safe-area-inset-bottom, 0px)); transform: none; }
  .lb__ant { left: 14px; } .lb__prox { right: 14px; }
}

@media (prefers-reduced-motion: reduce) {
  /* o véu ainda esmaece em 150ms, porque é ele que confirma que algo
     abriu, e o gate global preserva opacity de propósito. O que sai é
     a escala: sem a transição de transform ela ficaria presa. */
  .lb__palco img { transform: none; }
}
```

```js
/* ═══ assets/melhorias.js, no bloco do lightbox ═════════════════════ */

/* duas camadas no lugar de um <img> só, dentro do lb.innerHTML */
'<div class="lb__palco"><img alt="" class="is-on"><img alt="" aria-hidden="true"></div>'

var camadas = lb.querySelectorAll('.lb__palco img');
var frente = 0;

var mostrar = function (i) {
  atual = (i + grupo.length) % grupo.length;
  var a = grupo[atual];
  var vem = camadas[1 - frente];
  var vai = camadas[frente];
  vem.src = a.getAttribute('href');
  vem.alt = (a.querySelector('img') || {}).alt || '';

  var trocar = function () {
    vem.classList.add('is-on');
    vem.removeAttribute('aria-hidden');
    vai.classList.remove('is-on');
    /* aria-hidden na camada fora de cena é obrigatório: ela continua com
       um src carregado e o leitor de tela anunciaria duas imagens */
    vai.setAttribute('aria-hidden', 'true');
    frente = 1 - frente;
  };
  /* decode antes de trocar: sem isso a camada nova entra em branco e o
     cross-fade mostra o véu escuro no meio, que é justamente o defeito
     que a fusão veio resolver. O catch existe porque decode() rejeita
     se o src for trocado antes de terminar (seta apertada duas vezes
     rápido), e sem ele o lightbox congela na foto anterior. */
  if (vem.decode) vem.decode().then(trocar).catch(trocar); else trocar();

  legenda.textContent = (atual + 1) + ' / ' + grupo.length + (vem.alt ? ' · ' + vem.alt : '');
};

/* o fechar-por-fundo (e.target === lb) deixa de disparar em cima do
   palco: aceitar os dois */
if (e.target === lb || e.target.classList.contains('lb__palco')) fechar();

/* NÃO atrasar o inert nem o retorno de foco para acompanhar a animação:
   movimento nunca atrasa foco. O document.body.style.overflow e o
   prender(true) continuam imediatos. */
```

**Metade que é HTML:** envolver as 5 figuras da `.gallery` de cada solução em `<a data-lightbox="gastronomia" href="...">`, com a lupa que a `.galeria-oc` já desenha promovida para `social/social.css` **como está, com o comentário das linhas 459-460 inteiro**. Esse comentário é o que registra que a lupa é affordance e não legenda, e é o que impede a próxima pessoa de pôr um disco translúcido sobre a fotografia, que a cliente vetou por escrito (`melhorias.css:200-203`).

---

### 2 · As galerias de lightbox passam a ser descobertas

**O que o visitante vê:** nas páginas de casa, o mosaico de sete fotos vai sendo descoberto conforme a pessoa desce, em vez de já estar inteiro na tela.

As 7 âncoras do `#galeria` de cada casa e as 4 do `#destino` de casamento e bodas são as **únicas** fotos dessas rotas sem revelação, enquanto a `.galeria-oc`, três seções abaixo na mesma página, revela escalonada. Mesmo conteúdo, dois comportamentos, uma rota.

Duas correções incorporadas:

- **Não usar clip-path.** O gesto tem de ir no próprio `<a>`, que é o elemento com `overflow: hidden` e `border-radius` (`melhorias.css:31-34`), e `base.css:872-874` documenta exatamente esse caso: "sobrepor os dois no mesmo elemento faz a borda arredondada tremer durante a transição". Foi por isso que o `.reveal-shot` separou o clip da figura e a escala da imagem. Aqui o gesto é fade mais subida, que o raio não disputa.
- **Não animar a imagem.** A âncora já tem zoom de hover de 1,1s no `<img>` (`melhorias.css:36`); escalar na entrada disputaria a mesma propriedade e a foto revelada pararia de responder ao mouse, que é a dívida de 05/09/2026 em 36 fotos em vez de 5.

```css
/* assets/css/melhorias.css, junto do .evento__galeria (linha 30)

   Um gesto por propriedade: a entrada mexe em opacity e transform da
   ÂNCORA, o hover mexe em transform da IMAGEM. Nada se sobrepõe e não
   é preciso remover classe nenhuma. */
.evento__galeria { --rev-passo: .09s; --rev-teto: 6; }

.js .evento__galeria > a { opacity: 0; transform: translateY(14px); }
.evento__galeria > a { --rev-atraso: calc(min(var(--i, 0), var(--rev-teto)) * var(--rev-passo)); }
.evento__galeria.is-in > a {
  opacity: 1; transform: none;
  transition:
    opacity   var(--dur)      var(--ease-out) var(--rev-atraso, 0s),
    transform var(--rev-desl) var(--ease-out) var(--rev-atraso, 0s);
}

/* O índice sai do nth-child do item 5: `data-ritmo` no contêiner das 6
   rotas resolve, sem nenhum atributo por foto. As quatro casas são um
   arquivo repetido quatro vezes e tools/gerar-paginas.py está travado,
   então o gesto tem de morar em folha compartilhada. */

/* Movimento reduzido: o estado inicial escondido é declaração nossa e
   tem de ser desfeito aqui, como as linhas 1161-1162 do base.css fazem
   para o .reveal-shot. */
@media (prefers-reduced-motion: reduce) {
  .js .evento__galeria > a { opacity: 1; transform: none; }
}
```

```js
/* assets/site.js:261, uma string a mais no seletor do observer que já
   existe. Nenhum observer novo. */
var blocos = document.querySelectorAll(
  '.rise, .reveal-shot, .cascata, .linhas, .deco-line, .evento__galeria');
```

**Não mexer no `aspect-ratio`.** A proposta de que "a primeira foto reflui e empurra as seis de baixo" **não se confirma**: `social/espaco.css:238-239` declara `#galeria .evento__galeria a { aspect-ratio: 3/4 }` e `:nth-child(1) { aspect-ratio: 3/2 }`, e `social/evento.css:267` faz o equivalente no `#destino`. São seletores de ID e vencem `melhorias.css:35` por especificidade em qualquer ordem de folha. A caixa já está reservada nas seis rotas, o `aspect-ratio: auto` do melhorias é regra inerte, e o valor 3/4 que foi proposto para a célula 2x2 cortaria **a única foto horizontal da galeria, que é a única fotografia real da cliente** (o comentário de `espaco.css:233-237` diz isso). Se quiser higiene, o conserto é apagar a regra morta, não trocar o valor.

**Antes de publicar:** conferir no aparelho, com a grade aberta na tela, que o mosaico não escalona na diagonal. As contas de coluna de desktop das propostas eram confiáveis; as de celular estavam todas erradas, e em rota de casamento o celular é o aparelho principal.

---

### 3 · Trilho único

**O que o visitante vê:** no celular, as faixas de cartões e de fotos se arrastam com o dedo e param exatamente num item por vez, em qualquer página, e nada é cortado pela metade na borda de baixo.

O ganho aqui é **substituir**, não acrescentar. Hoje são quatro trilhos escritos do zero: `.servicos` ≤720px em `social/espaco.css:119-136` e **de novo** em `social/evento.css` (o comentário do arquivo admite a cópia), `.reel__track` e `.rail` no corporativo, e `.gallery--percurso` em `melhorias.css:205`, que não tem um único consumidor. Nenhum compartilha medida de item, sangria ou `scroll-padding`. E os dois `padding-bottom: 6px` que existem são a compensação por estimativa de um corte que ninguém nomeou.

```css
/* assets/css/melhorias.css (última folha em todas as rotas, então um
   componente com seletor de uma classe não perde de .evento__galeria
   nem de .gallery, que carregam depois do base.css)

   TRILHO COM ENCAIXE

   O PAR padding-block / margin-block-end negativo não é acabamento.
   overflow-x cria contexto de recorte nos DOIS eixos: um item que nasce
   20px abaixo e sobe entra decapitado dentro do trilho. O padding abre
   o espaço por dentro, a margem negativa devolve ao fluxo, e a página
   não cresce um pixel. O valor é o MESMO --rev-sobe do gesto que causa
   o corte: escrever 6px porque parece suficiente é voltar ao estado de
   hoje com outro número.

   position: relative + z-index: 1 porque a margem negativa sobe o irmão
   seguinte 20px para dentro da área de overflow, e o fundo de uma seção
   posterior pintaria por cima dos itens.

   overscoll-behavior-x: contain NÃO é opcional no celular: sem ele o
   gesto horizontal pode sequestrar o voltar do navegador no iOS e o
   pull-to-refresh no Android, e a pessoa perde a página no meio da
   galeria. */
.trilho {
  position: relative; z-index: 1;
  display: flex; gap: var(--space-3);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; -ms-overflow-style: none;

  /* sangra até a borda da tela e devolve o respiro por dentro; o
     scroll-padding é o que faz o encaixe respeitar a goteira, senão o
     primeiro item prende no content box e o trilho nasce rolado. Conta
     já escrita e comentada em social/espaco.css:128-133. */
  margin-inline: calc(var(--gutter) * -1);
  padding-inline: var(--gutter);
  scroll-padding-inline: var(--gutter);

  padding-block: 2px var(--rev-sobe);
  margin-block-end: calc(var(--rev-sobe) * -1);
}
.trilho::-webkit-scrollbar { display: none; }

.trilho > * { flex: 0 0 var(--trilho-item, 68%); scroll-snap-align: start; }
/* `end` no último resolve o item inalcançável quando sobra menos que
   uma largura; num trilho de um item só ele empurraria o único cartão
   para a direita, daí o only-child */
.trilho > *:last-child { scroll-snap-align: end; }
.trilho > *:only-child { flex-basis: 100%; }

@media (prefers-reduced-motion: reduce) {
  /* o trilho FICA: arrastar não é animação, é navegação, e tirá-lo
     deixaria o conteúdo inalcançável. O que sai é a rolagem suave
     programática (aqui e no scrollBy do JS). */
  .trilho { scroll-behavior: auto; }
}
```

**Escopo, e ele é menor do que foi proposto:**

- **Substituir** os quatro trilhos existentes (as duas cópias de `.servicos`, `.reel__track`, `.rail`) e **apagar** a `.gallery--percurso` órfã. É aqui que o esforço se paga, e de brinde apaga duas cores literais que passam há tempos fora do verificador (`.reel__conta` e `.reel__btn` usam `#fff` e `rgba(255,255,255,.12)` em `corporativo/corporativo.css:552-568`).
- **Usar como forma nova** só onde não há mosaico decidido: a `.gallery` de 5 figuras das cinco soluções e o `#destino .evento__galeria` de casamento e bodas.
- **NÃO converter `#galeria` nem `.galeria-oc`.** As duas grades são decisão registrada com medida, e uma delas é de dois dias atrás: `social/espaco.css:231-246` foi redesenhada com `aspect-ratio: 3/4` por célula e quatro colunas justamente porque o acervo da casa é vertical, com a razão escrita ("com três, cada foto fica com cerca de 105px de largura e não dá para ver nada"). E a `.galeria-oc` é a resposta ao pedido literal da cliente por "um espaço com mais mídias": no celular o mosaico entrega quatro fotos por tela e o trilho entrega 1,1. Trocar volume por tamanho desfaz o pedido que originou o bloco.
- **Corporativo em passagem separada**, depois das internas: `.reel__track` e `.rail` são `display: grid` com `grid-auto-flow: column`, não flex, e vivem na única rota sem `site.js` e com runtime inline de ~400 linhas.

**Acessibilidade:** barra de rolagem escondida sem alvo focável é armadilha de teclado. Nos serviços os cartões são focáveis; onde os filhos não forem (uma galeria de figuras), o trilho precisa de `tabindex="0"` com `role="group"` e `aria-label`.

**Nunca pôr `.reveal-shot` por item dentro da pista:** a revelação viraria sorteio conforme a pessoa arrasta. A revelação vem do contêiner, como no item 2 desta onda.

---

## Onda 3 · unificação de sistema

Nada disso muda o que o visitante vê. Muda o custo de tudo o que vier depois.

**1 · Fechar a escala de tempo.** `--dur-foto` (1.4s) e `--dur-view` (.45s) têm zero consumidores enquanto os mesmos números vivem literais a poucas linhas (`base.css:256` escreve `.45s` a 135 linhas do token). Sete durações longas de fotografia (1.1, 1.3, 1.4, 1.6, 3.2, 3.4, 3.6s) e cinco escalas de entrada (1.04, 1.06, 1.07, 1.08, 1.1) vivem fora de qualquer token, em cinco folhas. Três decisões a tomar antes de tocar em qualquer consumidor: (a) `--dur-estado: .18s` entra como **degrau novo**, e `--dur-fast` (.25s, 45 consumidores) continua servindo o deslocamento pequeno, onde .25s é justo; migrar em bloco deixa o chevron do FAQ e a lupa da galeria nervosos. (b) `--dur-assenta` fica em **3.6s**, que é o número social, e o corporativo mantém override próprio de 3.2s na sua folha; tokenizar em 3.2s inverte a hierarquia em silêncio e deixa a LP de casamento mais apressada que a home corporativa. (c) **Não criar `--ease-progresso`.** Auditados os 8 usos de `linear` fora de gradiente: seis são `animation-timeline` presos à rolagem (obrigatoriamente linear, porque a medida é rolagem e não tempo) e dois são faixas infinitas. Não existe um único indicador de progresso no site, e o grep proposto reprovaria seis declarações corretas. Um site que vende casamento no interior não tem nada cujo progresso mostrar. Vale um comentário de uma linha no `:root` dizendo por que `linear` não tem token.

**2 · Os dois nomes de view-transition sem duração.** `melhorias.css:196-197` nomeia `pilula` e `titulo` e não há `::view-transition-group` para nenhum dos dois: caem no padrão do agente de usuário e ficam fora da escala que `base.css:257-259` definiu para `hero-foto`, `casa-foto` e `marca`. São duas linhas, e é justamente na troca de rota que a incoerência aparece. Faça primeiro, sozinho, que é o único item desta onda sem contrapartida.

**3 · Apagar o código morto.** Num commit só, sem substituir por nada: o bloco `.nav__progresso` (`base.css:968-977` e `:1169`), `var regua` e `pintarRegua()` (`site.js:341-348`), `regua` da condição do laço, `var nav` e o observer de `.is-stuck` (`site.js:21,28-34`), e a `.gallery--percurso` (`melhorias.css:205-206`). Verificado que `.nav.is-stuck` tem **um** consumidor no repositório inteiro, que é a própria barra, então a remoção é incondicionalmente segura; e que `pintarRegua` já sai por um guard, então o custo hoje é um teste de null e não desperdício por quadro. Consertar junto o comentário de `corporativo/corporativo.css:854`, que fica órfão afirmando um componente que não existe.

**4 · O parallax num endereço só.** Depois do conserto da onda 1, promover `.foto-desliza` para `base.css` como o único nome do gesto, com `--desliza-folga` e `--desliza-curso` em token, e apontar `.respiro-foto` e o `[data-parallax]` do corporativo para ele. Do jeito que foi proposto originalmente (tokens locais, propriedade diferente, números próprios) o repositório sairia com **três** parallaxes em vez de dois.

**5 · Alinhar o corporativo.** Ele não carrega `site.js` e mantém cópia própria do runtime a partir da linha 960, cuja lista de observados não inclui `.cascata` nem `.deco-line` e que nunca limpa classe nenhuma. Toda proposta que dependa da terceira fase precisa do trecho colado ali, senão aquela rota fica com `will-change` preso em ~25 elementos. A decisão real a tomar é se o corporativo passa a carregar o `site.js` (o comentário de `site.js:41` já diz que essa é a versão que fica) ou se as duas cópias continuam divergindo.

**6 · Estender o verificador.** `tools/verificar-paridade.py` só lê `base.css` procurando cor literal e `tema-*.css` procurando não-cor. Ele não alcança `social/*.css`, `corporativo.css` nem `melhorias.css`, e é por isso que as duas cores literais do `.reel` passam. Duas regras a acrescentar, no mesmo espírito: nenhuma declaração de `transition` com número literal (hoje o grep devolve 39 linhas) e nenhuma cor literal em folha alguma. A saída vazia é a meta, não o ponto de partida.

**7 · Destravar o `tools/gerar-paginas.py`.** Está travado com `sys.exit(1)` porque rodá-lo apaga o hero-palco e devolve 44 eyebrows que a cliente mandou tirar. Quatro itens desta rodada pedem edição de marcação nas 9 páginas geradas (4 casas + 5 soluções), o que é trabalho manual repetido nove vezes, e cada edição afasta mais o template do que está no ar. Vale orçar o destrave antes, não depois.

---

## Descartadas e por quê

Refutadas pelas **duas** lentes:

| Proposta | Motivo em uma linha |
|---|---|
| Frase do respiro que acende (`.acende` na `.script`) | `melhorias.css:213` e `social.css:33` declaram `color` em (0,1,0) em folhas posteriores e vencem o `color: transparent` do `.acende`: a classe não faz nada; e o trecho ainda apagado seria traço manuscrito a 20% sobre fotografia, sem contraste mensurável, sobre a única faixa que existe pela foto. |
| Faixa de acervo (marquee de tipografia gigante com fotos) | É a assinatura literal do Nubank e do marquee da home; o acervo não tem volume para dar (fora dos 16 arquivos de 15/09 tudo é IA, registrado no LEIA-ME) e reciclar as mesmas sete fotos entrega o tamanho do acervo em movimento. |
| Galeria unificada `.galeria` | O nome já é a seção das duas tiras de polaroides em `home.css:529`, e a regra nova destruiria aquela seção; e unificar as três galerias em 4:3 cortaria pela metade as fotos 1400x1875 da `.galeria-oc`, que são verticais. |
| "A foto da galeria reflui" (`aspect-ratio`) | A caixa já está reservada nas seis rotas por seletor de ID (`espaco.css:238-239`, `evento.css:267`); o `auto` do melhorias é regra inerte, e o valor proposto cortaria a única foto horizontal, que é a única fotografia real da cliente. |
| Limiar da tinta (eyebrow entrando na faixa escura) | `class="eyebrow"` não existe em nenhuma rota de vitrine, removido a pedido da cliente; os três candidatos de faixa escura já estão ocupados por `.linhas`, `.acende` e `.rise`. |
| Costura de dobra (ornamento cruzando a fronteira) | Os 36 ornamentos do repositório estão todos sobre chão claro; nenhum em faixa escura, então o seletor acerta zero elementos, e fazê-lo disparar exige inserir marcação nos 11 arquivos gerados que a proposta usou como argumento para descartar a alternativa. |
| Primeira dobra (fio na base do hero) | O véu do hero termina em 94% de royal, então a fronteira já mede ~14,8:1 e o fio de royal a 20% sobre royal é ~1:1; abaixo de 768px não há clip-path e ele nunca aparece; e é moldura desenhada sobre fotografia, que é o lado errado das duas recusas da cliente. |
| Anel de tempo no rodízio | Se anula: o botão lê `--ro`, e `pausar()` escreve `--ro: 0`, então o controle desaparece ao ser apertado e apaga no `mouseenter` antes de qualquer clique; o argumento inteiro era WCAG 2.2.2, e um controle invisível não cumpre 2.2.2. O problema real que ele encontrou virou o item 10 da onda 1. |
| Índice por coluna com media queries espelhando o grid | Tentado em três propostas independentes e errado em todas as três no celular, sempre na mesma direção; e descola em silêncio no dia em que alguém mexer no `grid-template-columns`. Substituído pelo índice corrido com teto. |

**Fora desta rodada, com o caminho registrado · a régua de leitura.** Tecnicamente funciona (`scroll(root)` nomeia o scroller e escapa da armadilha de overflow; medido indo de 0 a 1). Mas o componente foi desenhado para uma nav de largura total colada no topo, onde 2px leem como filete, e essa nav não existe mais: o que existe é uma cápsula flutuante de vidro com cantos de 28px, em que a barra precisa ser recuada para não ser cortada, ou seja, ela não atravessa a coisa em que está presa. O contraste não é mensurável (a pílula é `color-mix(--ui-bg-alt 64%, transparent)` sobre o que a página estiver passando, o que nas rotas de casa inclui faixas royal e fotografia, e a disciplina da casa exige a medida quando a cor muda). E ela não serve nenhuma das três decisões de compra, enquanto o CTA de agendar visita já mora na mesma linha de 54px. Se a cliente pedir sinal de orientação nas rotas longas, a tradução para a linguagem da casa é o fio que atravessa **dentro** do conteúdo, que é o item 8 da onda 1. Se ainda assim alguém insistir na barra, ela não pode sair em 19 rotas: só nas 4 casas e nas 3 ocasiões, com a tinta em `--ui-text` (royal, 14,8:1, medido em `tema-social.css:16`) e um trilho opaco próprio atrás do fio.

---

## O que eu recomendaria fazer primeiro, em três linhas

**Primeiro o item 1 da onda 1, sozinho, hoje:** três animações presas à rolagem estão inertes em produção porque `overflow: hidden` prende o `view()` à própria caixa, e nomear o timeline devolve movimento que já foi escrito, testado e aprovado pela cliente, em 8 rotas, sem uma linha de HTML.

**Depois os itens 2, 3 e 4 no mesmo commit** (entrada em duas velocidades com a curva de chegada, terceira fase por remoção de classe, abertura do herói sem tocar no h1): é o que muda a sensação de dureza em 19 rotas, e o item 4 tem a melhor procedência de todas, porque `social/evento.css:312` registra o pedido da cliente e nomeia esse gesto como parte da resposta que ela já aprovou.

**Na conversa com ela, liderar pela manchete (item 9):** é o único item do conjunto sem movimento nenhum dentro, é o que ela tem mais chance de nomear como "vida", e entregar escala tipográfica junto com movimento reduz a chance de uma terceira recusa por excesso, que é o histórico dela.
