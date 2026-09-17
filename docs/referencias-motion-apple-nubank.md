# Referências de motion · apple.com/os/ios e nubank.com.br

Rodada de 17/09/2026. O pedido foi olhar as duas páginas e achar componente e
animação que caibam nas páginas internas do Di Terrá, observando seis coisas: como
os textos aparecem, como o scroll é usado como gatilho, como as imagens são
apresentadas, como as dobras passam de uma para a outra, o que transmite
modernidade e o que faz os dois sites parecerem coerentes.

**Como esta coleta foi feita, para ninguém ter de repetir.** As duas páginas foram
abertas no navegador em 1440x900 e em 375x812. De cada uma foi lido o CSS de
verdade (`document.styleSheets`, percorrendo as regras e contando durações, curvas
e keyframes), medida a tipografia com `getComputedStyle`, e observado o mecanismo
de animação com um `MutationObserver` de `class` e `style` durante a rolagem, que é
o que revela se o movimento é gatilho discreto (entra uma classe) ou preso à
rolagem (o valor é reescrito quadro a quadro). Nada aqui vem de olhar screenshot.

Os números abaixo são fatos medidos naquele dia, nas versões daquele dia. As duas
fichas vêm primeiro; a comparação com o Di Terrá vem depois. O plano de execução
está em `docs/plano-motion-rodada-5.md`.

---

## Ficha 1 · apple.com/os/ios/ (iOS 27)

Coleta feita no navegador em 1440x900, lendo `document.styleSheets` (mesma origem,
7 folhas, 5821 seletores) e observando mutações de `class`/`style` durante a rolagem.

### Números da página

- Altura: 10.845 px = **12,1 telas** de 900px.
- 10 seções, cada uma entre 687 e 1216 px de altura (média ~1050). Nenhuma seção
  gigante: a página é longa porque tem MUITAS seções curtas.
- 46 `<img>`, 1 `<video>`, 0 `<canvas>`. Mídia é foto e vídeo comum, não canvas.
- 57 elementos com `data-staggered-item`. 31 `gallery-item`. 33 `card`/`tile`.

### 1. Como os textos aparecem (o mecanismo exato)

Componente `StaggeredFadeIn`, declarado no HTML por `data-component-list` e
governado por 4 tokens CSS:

```css
[data-component-list*="StaggeredFadeIn"] {
  --staggered-delay: 0.15;                 /* 150ms entre irmãos */
  --staggered-opacity-duration: 0.9;       /* 900ms de fade */
  --staggered-translate-y: 30px;           /* sobe 30px */
  --staggered-translate-y-duration: 0.7;   /* 700ms de deslocamento */
}
/* estado inicial */
[data-component-list*="StaggeredFadeIn"]:not(.staggered-end) [data-staggered-item] { opacity: 0 }
/* durante */
.staggered-start [data-staggered-item] { will-change: opacity, transform; visibility: visible }
/* depois */
.staggered-end [data-staggered-item] { will-change: auto }
```

Três detalhes que valem mais que os números:

1. **Opacidade dura mais que deslocamento** (0,9s contra 0,7s). O elemento chega ao
   lugar e só depois termina de firmar. Um único `transition: all` não produz isso.
2. **O ciclo tem três estados**, não dois: `:not(.staggered-end)` (escondido),
   `.staggered-start` (animando, com `will-change` ligado) e `.staggered-end`
   (`will-change: auto`). O `will-change` é ligado e DESLIGADO — não fica preso.
3. **Governado por classe no `<html>`**: `html.no-js`, `html.reduced-motion` e
   `html.no-reduced-motion` decidem se o gesto existe, em vez de só uma media query.

O `--staggered-delay` multiplica o índice do item; a página tem 57 itens marcados,
então o stagger não é "por bloco", é **por elemento de conteúdo** (cada parágrafo,
cada cartão, cada legenda).

### 2. Scroll como gatilho

Dois regimes distintos convivem:

- **Gatilho discreto** (entrou em quadro → anima uma vez): é o `StaggeredFadeIn`.
  O JS troca `staggered-start` por `staggered-end`; o CSS faz todo o resto.
- **Ligado à rolagem, quadro a quadro**: observei `li` recebendo
  `transform: matrix(1,0,0,1,0,27.53); opacity: 0.049` e, quadros depois,
  `...,0,7.12); opacity: 0.519` — valores INTERMEDIÁRIOS escritos inline. É o
  carrossel/faixa de destaques, que desloca e apaga cada item em função da posição.

Nenhuma regra usa `animation-timeline`, `view()` ou `scroll()`: **zero
scroll-driven CSS nativo**. Tudo é JS escrevendo classe (caso 1) ou estilo inline
(caso 2). A Apple ainda não confia no recurso nativo que o Di Terrá já usa.

### 3. Como as imagens são apresentadas

- **Galeria horizontal com trilho e encaixe**, não grade:
  ```css
  .scroll-gallery .scroll-container {
    overflow-x: scroll; scrollbar-width: none;
    scroll-snap-type: x mandatory; scroll-padding: var(--responsive-gutter-width);
    padding: 10px 0 var(--staggered-translate-y, 30px);
    margin-bottom: calc(var(--staggered-translate-y, 30px) * -1);
  }
  .scroll-gallery .gallery-item { scroll-snap-align: start }
  .scroll-gallery .gallery-item:last-child { scroll-snap-align: start end }
  ```
  O par `padding-bottom` + `margin-bottom` negativo existe para o deslocamento de
  30px do stagger não ser cortado pelo `overflow` do trilho. Quem combina trilho com
  revelação precisa disso.
- **Navegação em três camadas**: arrastar, setas (`paddlenav`, 44px de altura, gap
  18px, `.hide { visibility: hidden; opacity: 0 }`) e pontos (`dotnav`, 6 itens).
- **Legenda sob a mídia, nunca sobre**: `caption-tile` → `card-caption-heading` +
  `card-caption-content`, com `--frame-transition-duration: 200ms`.
- **Largura do tile muda conforme quantos irmãos existem**
  (`:first-child:nth-last-child(2) ~ .caption-tile`): dois tiles ficam largos, três
  ou mais ficam estreitos. Quantity query, sem JS.
- Vídeo: `muted playsinline`, `autoplay: false` — quem dá play é o JS quando entra
  em quadro. `data-media-type="static|video"` marca o que é cada bloco, e existe
  `static-fallback-only`.
- Conteúdo sobre mídia é posicionado por utilitários de **pin**: `pin-center`,
  `pin-center-left`, `pin-top-center`, com `--pin-offset-x/y` (81 regras).

### 4. Transição entre dobras

Não há gradiente nem máscara entre seções. A página muda de **bloco de cor**:

| ordem | seção | fundo | tinta |
| --- | --- | --- | --- |
| 1 | welcome | `#000000` | `#f5f5f7` |
| 2 | highlights | `#1d1d1f` | `#f5f5f7` |
| 3 | siri | `#1d1d1f` | `#f5f5f7` |
| 4 | apple-intelligence | `#f5f5f7` | `#1d1d1f` |
| 5 | child-safety | `#f5f5f7` | `#1d1d1f` |
| 6 | improvements | `#f5f5f7` | `#1d1d1f` |
| 7-9 | more / compatibility / developers | transparente | `#1d1d1f` |

Três observações: o preto puro aparece **uma vez só** (o hero); o escuro seguinte é
`#1d1d1f`, não `#000`; e a viagem é de escuro para claro, terminando em papel. As
seções vizinhas de mesma cor se fundem (`no-pad-top` remove o respiro entre elas),
o que faz a dobra desaparecer em vez de virar uma borda.

### 5. Tempo e curva (o que dá a sensação de moderno)

Durações mais usadas: **320ms (50 usos)**, 240ms (15), 0,3s (19), 0,24s (17),
0,32s (13), 0,4s (11). Curvas: `cubic-bezier(0.4, 0, 0.6, 1)` domina com **171
usos**; depois `cubic-bezier(0, 0, 0.2, 1)` (35).

Ou seja: **o movimento da Apple é curto**. A faixa de trabalho é 240-400ms para
estados e 700-900ms para entradas de conteúdo. Uma curva só, repetida em quase tudo.

### 6. O que faz parecer coerente

- Uma curva e uma escala de tempo para o site inteiro.
- Um raio de canto tokenizado: `--sk-tile-border-radius` (18px no tamanho grande),
  com variantes small/medium/large/xlarge. Tudo é `tile-rounded`.
- Todo bloco de conteúdo é o mesmo objeto: tile arredondado + legenda embaixo.
- Utilitários de posicionamento (`pin-*`) em vez de CSS por seção.
- Os componentes se declaram no HTML (`data-component-list="MediaCardGallery"`),
  então a folha de estilo é lida por componente, não por página.

### 7. Celular (375x812)

- A página vira 14,5 telas (contra 12,1 no desktop): o conteúdo não é cortado, é
  reempilhado.
- O trilho da galeria mantém `scroll-snap-type: x mandatory`, e o item mede **308 px
  numa tela de 375 px (82%)**: sobra uma faixa do próximo cartão, que é o que avisa
  "tem mais para o lado" sem precisar de seta. O Di Terrá já usa 82% em
  `.gallery--percurso` e 68% no trilho de serviços.
- `--staggered-translate-y` continua 30 px no celular: o deslocamento não é reduzido.


---

## Ficha 2 · nubank.com.br

Coleta no navegador em 1440x900. As 3 folhas principais são cross-origin (CORS),
mas o site injeta o CSS de componente inline (Emotion/styled-components): 2.114
regras acessíveis, 22 blocos de `@keyframes`. `window.MotionIsMounted` confirma
**Framer Motion**; `.swiper-initialized` confirma **Swiper** nos carrosséis.

### Números da página

- Altura: 8.741 px = **9,7 telas** de 900px.
- 102 `<img>`, **zero vídeo**, zero canvas. Uma seção sozinha tem 72 imagens.
- Seções com altura de tela cheia: 900, 900, 900, 836, 836, 828, 960, 904, 1026.
  Cada dobra é uma tela, não um bloco de texto que rola.
- Duas fontes da mesma família: `nuSansDisplay` (36 usos) e `nuSansText` (142).

### 1. Como os textos aparecem

Duas coisas distintas, e a segunda é a mais característica.

**Entrada.** Framer Motion escreve `opacity` e `transform` inline; em repouso os
blocos ficam com `opacity: 1; transform: none`. O header entra com
`animation: 0.6s cubic-bezier(0.22, 1, 0.36, 1)` — easeOutQuint, a curva que
desacelera forte no fim.

**Escala.** A tipografia display é o efeito principal, não o acessório:

| elemento | tamanho | entrelinha | peso | tracking |
| --- | --- | --- | --- | --- |
| h1 | 112 px | 105,3 px (**0,94**) | 600 | -1,4 px |
| h2 de seção | 72 px | 72 px (1,0) | 600 | -1,2 px |
| h4 | 72 px | 67,7 px (0,94) | 500/600 | -1,2 px |

Entrelinha MENOR que o corpo da letra, tracking negativo, peso semibold. Há dobras
em que a palavra é maior que a viewport e sangra pelas duas laterais (a faixa
"Junte-se aos 130 milhões").

### 2. Scroll como gatilho

O achado mais claro da coleta. Observando mutações de atributo durante a rolagem,
um `div` de fundo (`position: absolute; inset: 0; z-index: 0`) recebe:

```
transform: translateY(0.3px) → 6.3 → 10.5 → 16.65 → 35.55 → 50.25 → 68.85 → 94.95 → 127.65 → 162.15px
```

Valores intermediários, quadro a quadro: **parallax ligado à rolagem** na camada de
fundo, via `useScroll`/`useTransform`. O conteúdo anda na velocidade do dedo; o
fundo anda mais devagar. É o que dá profundidade sem nenhum efeito declarado.

Em repouso (3 s sem rolar, no topo) houve ZERO mutação: nada se move sozinho onde o
visitante ainda não chegou.

### 3. Como as imagens são apresentadas

- **Carrossel Swiper com autoplay de 9 s e anel de progresso.** Os keyframes
  `carouselButtonLoadingProgressA/B` animam `stroke-dashoffset` de um `<circle>`
  SVG em 9 s lineares: o contorno do botão "avançar" se desenha enquanto o slide
  espera. Há também um `carouselSectionLoadingProgressA` de 2 s e outro de 9 s
  animando `transform` (a barra da seção). Isso responde "quanto tempo ainda" sem
  texto nenhum.
- Variante `swiper-creative swiper-3d`: a troca de slide tem profundidade, não é só
  deslizar.
- Setas de navegação próprias (`carousel-content-navigation-prev/next`), 10 no
  documento: cada faixa tem o seu par.
- **Abas em pílula sobre ilustração de tela cheia** (Caixinhas · Conta ·
  Empréstimos · E muito mais): a mídia ocupa a dobra e o texto vem num cartão
  branco por cima, num canto.
- **Faixa rolante (marquee)** com tipografia gigante e fotos pequenas intercaladas:
  a seção de 72 imagens. Texto e foto no mesmo trilho horizontal.
- Dois elementos com `animation: 2.5s ease-in-out infinite` (transform): decoração
  que respira sem parar, devagar, e nunca chama atenção.

### 4. Transição entre dobras

Bloco de cor por dobra, com sobreposição. Sequência observada: branco (hero, foto
de tela cheia) → branco → **roxo `rgb(141, 13, 227)`** → branco → ilustração de
tela cheia → branco → roxo → amarelo claro (a faixa "130 milhões"). A passagem
não é um gradiente: é uma cor nova ocupando a tela inteira, muitas vezes com o
título da dobra seguinte já aparecendo por baixo do cartão da dobra atual.

### 5. Tempo e curva

Curvas: `linear` (10 usos, todas em indicador de progresso), `ease-in-out` (7),
`ease-out` (2), `cubic-bezier(0.22, 1, 0.36, 1)` (1, na entrada do header).
Durações: 0,15 s, 0,2 s (estados), 0,4 s, 0,6 s, 0,65 s (entradas), 1,6 s, 2 s,
2,5 s e 9 s (loops e progresso).

A leitura: **estados em 150-200 ms, entradas em 400-650 ms, loops em 2,5-9 s**. E
uma regra de ouro visível: indicador de progresso é SEMPRE linear; movimento de
conteúdo nunca é.

### 6. O que faz parecer coerente

- Uma família tipográfica em dois cortes (display e texto), e só.
- Raio de canto em dois valores (8 px e 16 px), nada além.
- Uma cor de marca usada como BLOCO inteiro, não como detalhe.
- Toda faixa horizontal tem a mesma tríade de navegação: arrastar, setas, progresso.
- O ritmo é uma dobra = uma tela: o visitante nunca vê meia ideia.

### 7. Celular (375x812)

O display cai de 112 px para **48 px**, mas mantém entrelinha 0,94 (45,12 px) e o
mesmo tracking de -1,4 px. A proporção do display é preservada; só a escala muda.
A página vira 11,4 telas.

### 8. Detalhes do botão do carrossel (medidos)

Botão de **44x44 px** (alvo de toque mínimo), `aria-label="Iniciar"` — ou seja, o
autoplay tem controle explícito de play/pausa, que é o que a WCAG 2.2.2 exige. O
anel é um `<circle>` SVG com `stroke-width: 2px`, `stroke-dasharray: 100px` e
`stroke-dashoffset` animando em 9 s lineares, na cor `rgb(236, 223, 255)` (o roxo
mais claro da paleta, quase branco).


---

## As duas referências × o Di Terrá

| Decisão | Apple | Nubank | Di Terrá hoje | Veredito |
|---|---|---|---|---|
| Curva dominante | uma, 171 usos | `cubic-bezier(.22,1,.36,1)` na entrada | duas, com papel documentado (120 + 41 usos) | **já melhor**, falta o `.rise` obedecer a própria doc |
| Duas durações no mesmo gesto | 0,9s opacidade × 0,7s deslocamento | 0,4 a 0,65s | só no `.switch__shot`; a entrada usa uma | **corrigir** (onda 1, item 2) |
| Faixa de estado | 240-320ms | 150-200ms | `--dur-fast: .25s`, acima da faixa | ajustar na onda 3 |
| Stagger | por elemento, 57 itens, teto | por elemento | por bloco, `--i` à mão, sem teto, ausente nas grades | **corrigir** (onda 1, item 5) |
| Ciclo do `will-change` | três estados declarados | não medido | só a pilha e o marquee | **corrigir** (onda 1, item 3) |
| Movimento preso à rolagem | não usa `animation-timeline` | JS escrevendo transform por quadro | CSS nativo em 5 lugares, **3 inertes** | **consertar** (onda 1, item 1) |
| Curva de progresso | linear em indicador | linear nos 10 usos, todos indicador | `linear` escrito à mão em 8 lugares, nenhum indicador | não criar token: o site não tem progresso |
| Legenda | sob a mídia, contraste contra token | idem | idem, e a cliente **exigiu** isso por escrito | **já certo**, não reabrir |
| Tipografia display | 112px / entrelinha 0,94 / -0,0125em | 112px / 0,94 / -1,4px | `--text-manchete` até 6rem com 6 consumidores em 4 rotas | **aplicar** onde falta (onda 1, item 9) |
| Dobra de cor | extremo uma vez, vizinhas iguais fundem | bloco de cor por dobra | vocabulário pronto e desligado no `:root` do melhorias | **corrigir** (onda 1, item 7) |
| Foco visível | bom | bom | melhor que as duas, com contraste medido por estado | **já certo** |
| Canvas / WebGL | zero | zero | zero | modernidade não vem de canvas |

---
