# Plano de melhorias — rodada 4 (Impeccable)

Data: 2026-09-07. Base: `main` em `521f33b` (rodada 3 mergeada). Produção: https://diterra-deploy.vercel.app

Método: onze lentes do Impeccable (critique, audit, adapt, optimize, polish, layout, typeset, bolder, delight, overdrive, animate) rodadas em três passes independentes sobre o código, mais o detector mecânico. Sem alteração de código nesta rodada: é plano para aprovação.

Premissas mantidas da rodada 3: cores e fontes atuais, portal duplo, polaroids como prova social, texto do Corporativo aprovado, dados mockados até a Di Terrá confirmar. Onde uma lente pede algo que contraria uma decisão anterior, o item aparece marcado **decisão do cliente** e não entra sem o seu ok.

---

## Diagnóstico em números

| Superfície | Critique (0 a 32) | Observação |
|---|---|---|
| Portal | 25 | Termina antes de dizer algo; hierarquia tímida |
| Home social | 22 | CTA some no celular, hero rotativo genérico, painel sem destino |
| Página de casa | 25 | Fotografia repetida entre hero, split e galeria |
| Página de solução | 26 | — |
| Sobre | 27 | Retratos duplicados com os depoimentos do Corporativo |
| Fornecedores | 27 | — |
| Corporativo | 23 | Vídeo sem pausa, script duplicado |

Audit: 15 de 20 (acessibilidade 2, performance 3, responsivo 3, theming 4, integridade 3).

Detector mecânico: texto com gradiente na home social (duas ocorrências) e o carrossel automático de polaroids. O carrossel é decisão sua; o gradiente entra na lista.

Peso estimado por rota no desktop, primeira dobra: portal 740 KB (mais 1,3 MB de vídeo), home social 600 KB (mais 1,3 MB), casa 620 KB, corporativo 480 KB (mais 750 KB). Rolagem completa da home chega a 3 MB; do Corporativo, 3,5 MB.

---

## O que cada lente encontrou

### Typeset
- Onze tokens de escala em `base.css` e pelo menos 22 tamanhos fora deles (home.css, corporativo.css, melhorias.css, nav-pilula.css, index.html).
- A mesma classe `.h-card` é Albert 500 na base e vira Cormorant 400 em duas seções. Quatro pesos de Cormorant em uso; abaixo de 24 px a serifa fica esquelética (numerais das etapas e da linha do tempo, nome dos casais nas polaroids).
- Caixa alta em display grande (`.heading-lg`, banner, chamada final, hero do Corporativo, título do portal) com três trackings diferentes. As internas usam caixa baixa: dois sistemas convivendo.
- Title Case só na home ("Espaços que Inspiram", "Cada Evento, Uma Narrativa Única"); sentence case no resto. `<br>` forçados onde o script `.linhas` já quebra.
- Seis entrelinhas para corpo; corpo a 15 px peso 300.
- Escala proposta: xs 12, sm 14, base 16 (peso 400), lg 18 a 20, xl 24 a 32, 2xl 32 a 56, 3xl 42 a 80, manchete até 96 (teto do craft floor). Cormorant 300 acima de 40 px, 400 entre 24 e 40, nunca abaixo de 24. Uppercase só em xs e sm, um tracking (.18em).

### Layout
- Ritmo vertical reimplementado por seção; três valores para a margem do cabeçalho; eyebrow → h2 e h2 → parágrafo com distâncias quase iguais.
- Catorze escalas de `gap` para a mesma relação. Proposta: `--space-2` a `--space-7` (8 px a 120 px).
- Alinhamento alterna centrado e à esquerda sem regra. Proposta: à esquerda por padrão; só banner, respiro fotográfico e CTA final centram.
- Grades com órfãos: galeria de 6 em 4 colunas, evento real com 13 em 3 colunas, fornecedores com listas de 3 e 4.
- Cards carimbados: fundo, borda, sombra, raio, levante no hover e arco decorativo, cinco dispositivos num cartão repetido 3 a 4 vezes por seção. Proposta: foto, nome, linha, filete entre irmãos.

### Polish
- Cinco raios mais pílulas, com as seções agora retas: contradição visível na home. Proposta: `--radius: 2px` único; 999 px só em botão circular de ícone.
- `--elev-foto` em fotografia contradiz os filetes da referência. `.notice` com borda esquerda de 2 px está na lista de recusa do craft floor.
- Quatro botões primários diferentes (nav, barra mobile, pílula, portal).
- Ícones em quatro espessuras, dois desenhos de WhatsApp, ícones preenchidos do Bootstrap no contato, `&rarr;` como texto.
- `sizes` errado em várias imagens; polaroids 16:9 forçadas em janela quadrada; mesma foto de amplitude em três enquadramentos.
- Placeholders que envelhecem mal: três tiles de iniciais na equipe, os mesmos três retratos como equipe e como clientes do Corporativo, "Ler no blog" três vezes mais o botão, "Ex: Março 2026", "toque para ampliar" no desktop, "Protótipo de avaliação" em todos os rodapés.
- Três rodapés diferentes (portal, social, corporativo); só o portal tem contato.
- `outline: none` em três componentes novos; sem `color-scheme`; `a { color: inherit }` esconde links dentro de prosa.
- Código morto e duplicado: `.word-inner`, `.hero-scroll`, bloco de reduced-motion repetido no portal, 16 KB do `site.js` colados no Corporativo.

### Critique
1. O CTA único some da primeira dobra no celular: botão oculto abaixo de 480 px, gaveta sem "Agendar visita", hero sem botão, barra inferior só após meia tela.
2. O painel "Agendar visita" promete confirmação por WhatsApp e descarta o pedido. No protótipo o cliente vai testar e esperar retorno.
3. Cards de tipo de evento levam a um formulário quando o visitante espera conteúdo.
4. Fotografia repetida dilui a especificidade das casas.
5. Hero rotativo com três frases genéricas competindo com o lockup.

### Audit
- Vídeo de fundo em loop sem pausa (WCAG 2.2.2) no social e no corporativo.
- Painel de visita, lightbox e gaveta sem trap de foco; `role="tab"` fora do `tablist`; lâminas inativas do hero na árvore de acessibilidade.
- Contraste de borda de campo abaixo de 3:1; foco tijolo sobre rosa a 2,2:1.
- Sem `og:image`; home social sem canonical; JSON-LD só na raiz.

### Adapt
- 320 px: manchete do Corporativo em caixa alta corta.
- Tablet: nav colapsa em 1024 e a pílula perde o CTA em ≤1024.
- 1440 e 1920: lista de fornecedores com nome e cidade afastados 400 px; banner da home estica um arquivo de 500 px.
- Alvos de toque abaixo de 44 px nos crumbs, no toggle da pílula e no botão de pausar polaroids.
- A pílula persiste em `localStorage` mas a raiz não a carrega: quem testa vê barra na raiz e pílula dentro.

### Optimize
1. Cache `immutable` de um ano em CSS e JS sem hash: visitante recorrente fica com código antigo após cada deploy.
2. LCP da home social é background CSS, descoberto só após seis folhas bloqueantes.
3. Hero da raiz escolhe o AVIF de 2400 (477 KB) em 1440 px.
4. `nav-pilula.js` síncrono no head de 13 rotas para um teste que quase ninguém ativa.
5. Vídeo disputa banda com o LCP; sem `saveData`.
6. `will-change` permanente em todos os cartões da pilha.
7. Fontes em duas origens, render-blocking, 7 a 8 pesos.
8. 41 MB de `assets/demo` e 13 MB de PNG legados no deploy.

### Bolder
- Portal: H1 repete o lockup; portas em 13 px; a página termina antes de dizer algo.
- Hero social: título em tamanho de legenda, rodízio de frases genéricas; o token `--text-hero` existe e não é usado.
- Botão primário chega contornado, igual ao ghost; "Agendar visita" e "Conhecer os espaços" com o mesmo peso.
- Nenhuma interna sangra uma foto de borda a borda. Texturas do brandbook nunca usadas. Home mostra duas das quatro cores.

### Delight
Toques com dado, não com efeito: confirmação que repete casa, data e convidados; percurso do dia com hora; campo de data que responde com o pôr do sol do mês em Piracicaba; miniatura da casa no painel de visita; numeração "03 / 04" das casas; hora do dia escolhendo o poster do portal; polaroid que abre o lightbox e leva ao evento real; números que assentam uma vez.

### Overdrive
Quatro ideias com custo: o dia em scroll (3 a 4 dias, arriscado sem fotos reais); seletor que retinge a página (1 a 2 dias, contraria o brandbook); mapa da propriedade com pinos (2 dias com foto aérea); proposta imprimível gerada do painel de visita (2 a 3 dias, seguro e útil ao comercial).

### Animate
- Dezesseis durações e três famílias de easing; zoom de foto em cinco magnitudes.
- Animações fora do compositor: `scrollPulse` em `top`, acordeão de eventos em `flex-grow`, mega menu e vcard em `grid-template-rows`.
- Reduced-motion resolvido na base mas duplicado no portal e tratado de forma diferente em três componentes.
- Pílula montada por JS pisca a cada navegação; internas não compartilham elemento nas view transitions.
- Sistema proposto: um easing de chegada, `--dur-focal` .9 s, `--dur-foto` 1.4 s, `--dur-view` .45 s; dez animações definidas (entrada do hero, hero vira cartão por scroll-timeline, troca de casa, foto revelada, botão, painel e lightbox, percurso, polaroids sem marquee, nav, transição entre rotas). Remover: rodízio de lâminas, chev em loop, segunda fileira do marquee, parallax sobre arquivo de 500 px, CSS morto.

---

## Backlog consolidado

Esforço: XS até meio dia, S um dia, M dois a três dias, L acima de três.

### Fase A · Fundamentos do sistema (seguro)

| # | Item | Lentes | Esforço |
|---|---|---|---|
| A1 | Raio único de 2 px; 999 px só em botão circular de ícone. Varrer 14 literais | polish | S |
| A2 | Sentence case em todo título; uppercase só em xs e sm com um tracking. Reescrever os cinco títulos da home. Remover `<br>` forçados | typeset | S |
| A3 | Escala tipográfica consolidada: novos tokens, `.h-card--display`, Cormorant com piso de 24 px, corpo 16/400, `text-wrap: balance` nos títulos, remover peso 600 e itálico não usados | typeset | M |
| A4 | Tokens de motion: um easing de chegada, três durações; zoom unificado 1.04; trocar `top`, `flex-grow` e `grid-template-rows` por transform, opacity e clip-path; apagar CSS morto e o reduced-motion duplicado | animate | S |
| A5 | Subtração: `--elev-foto` vira filete; card sem fundo, borda, sombra e levante; `.notice` sem borda esquerda; um gesto de hover por componente | polish, layout | M |
| A6 | Escala `--space-*` aplicada a seções, cabeçalhos e grades; alinhamento à esquerda por padrão; contagens fixas nas grades para não sobrar órfão | layout | M |
| A7 | Rodapé único com contato, sem estilo inline, uma linha legal; usado nas 16 rotas | polish | S |
| A8 | Sistema de ícones: traço 1.25, uma seta, um WhatsApp, sem ícone preenchido e sem `&rarr;` em texto | polish | S |
| A9 | Botão primário único: sólido royal (marfim sobre escuro), 2 px, só em "Agendar visita"; todo o resto ghost | bolder, polish | XS |

### Fase B · Conversão e credibilidade (seguro)

| # | Item | Lentes | Esforço |
|---|---|---|---|
| B1 | Painel de visita: fallback `mailto:` até o n8n; texto de sucesso honesto; confirmação repete casa, data e convidados | critique, delight | S |
| B2 | "Agendar visita" na gaveta, no hero social e na barra inferior desde o fim do hero; CTA da pílula mantido no tablet; toggle da pílula com 44 px | critique, adapt | S |
| B3 | Hero social com uma frase fixa em `--text-hero`, com lugar, escala e ano; rodízio removido | bolder, critique, animate | XS |
| B4 | Cards de tipo de evento apontam para conteúdo (casa ou solução afim), não para o formulário | critique | XS |
| B5 | Purga de placeholders: retratos duplicados entre equipe e depoimentos, tiles de iniciais, "Ler no blog" repetido, data de exemplo, "toque para ampliar" no desktop | polish | S |
| B6 | Mapa de fotos único por slot e por rota; proibir reuso na mesma página; alt descritivo | critique, polish | M |
| B7 | Remover eyebrows decorativos e a numeração 01 a 04 das casas onde não carrega informação; manter nas etapas | polish | XS |
| B8 | Texto com gradiente na home vira cor sólida | detector | XS |

### Fase C · Performance e acessibilidade (seguro)

| # | Item | Lentes | Esforço |
|---|---|---|---|
| C1 | `vercel.json`: `immutable` só em `/assets/opt/` e `/assets/brand/`; CSS e JS revalidam | optimize | XS |
| C2 | Preload do LCP da home social; variante 1800 e reencode dos AVIF 2400; `sizes` corretos no switch, na intro e nas miniaturas da raiz | optimize | M |
| C3 | Vídeo: botão pausar nos heroes; `src` só após `load` e `requestIdleCallback`; respeitar `saveData` | audit, optimize | S |
| C4 | `inert` no conteúdo enquanto painel, lightbox ou gaveta estão abertos; `role="presentation"` nos articles do tablist; lâminas inativas fora da árvore; foco visível sem `outline: none`; borda de campo a 3:1; foco legível sobre rosa | audit | S |
| C5 | Gate inline da pílula no head; CSS e JS da pílula só quando ativa; pílula também na raiz ou em lugar nenhum | optimize, adapt | S |
| C6 | Fontes self-host em woff2 latin, preload dos dois arquivos críticos | optimize | S |
| C7 | Minify de CSS pelo `tools/`; Corporativo carrega `site.js` em vez de duplicar 16 KB; um laço de scroll só | optimize, animate | S |
| C8 | `will-change` só no cartão em transição; blur limitado a dois cartões | optimize | XS |
| C9 | `assets/demo` e PNGs legados fora do deploy (`.vercelignore` ou `_archive`) | optimize | XS |
| C10 | `og:image` em todas as rotas, canonical na home social, JSON-LD `EventVenue` nas casas, `color-scheme: light` | audit, polish | S |
| C11 | Manchete do Corporativo com piso menor abaixo de 360 px; lista de fornecedores com `max-width`; alvos de toque de 44 px nos crumbs e no botão das polaroids | adapt | XS |

### Fase D · Assinatura e encanto

| # | Item | Lentes | Esforço | Risco |
|---|---|---|---|---|
| D1 | Campo de data em mês/ano com o pôr do sol de Piracicaba no mês escolhido (tabela estática) | delight | S | seguro |
| D2 | Percurso do dia com hora nas páginas de casa, trilho com snap no celular | delight, animate | M | seguro, depende de fotos |
| D3 | Um respiro fotográfico de tela cheia por interna; banner da home com foto real de 2400 | bolder | S | seguro, depende de fotos |
| D4 | View transitions entre internas (foto do hero, título) e na pílula | animate | XS | seguro |
| D5 | Portal com segundo quadro: frase em manchete, portas em display, switch das casas e números | bolder | M | seguro |
| D6 | Miniatura da casa no painel de visita e nota quando convidados excedem a capacidade | delight | S | depende da ficha real |
| D7 | Proposta imprimível gerada do painel (`/proposta?casa=&data=&convidados=`) | overdrive | M | seguro |
| D8 | Mapa da propriedade com pinos e transição para a casa | overdrive | M | depende de foto aérea |
| D9 | Polaroids como mesa editorial: seis peças, sem marquee, trilho com snap, cada uma leva ao evento real | bolder, animate, detector | S | **decisão do cliente** |
| D10 | O dia em scroll: cinco fotos trocando presas à rolagem com o céu mudando de cor | overdrive | L | arriscado, só com fotos reais |

### Decisões que só o cliente pode tomar

1. **Uma navegação só.** Pílula ou barra; a outra sai do código. Hoje as duas carregam em todas as páginas.
2. **Polaroids.** Manter o carrossel automático ou virar mesa editorial estática (D9).
3. **Títulos da home.** Trocar Title Case e caixa alta por sentence case (A2) muda a cara da home mais do que qualquer outro item.
4. **Hero rotativo.** Uma frase fixa (B3) ou manter o rodízio.
5. **Eyebrows.** Remover os rótulos acima dos títulos (B7) ou manter como está.
6. **Seletor que retinge a página** por casa: fora do brandbook; não recomendado.

---

## Ordem sugerida de PRs

| PR | Conteúdo | Esforço |
|---|---|---|
| 1 | C1, C8, C9, B8, C11 (rápidos, sem impacto visual) | XS |
| 2 | A1, A9, A4 (raio, botão, motion) | S |
| 3 | A2, A3, B7 (tipografia) · aguarda decisões 3 e 5 | M |
| 4 | B1, B2, B3, B4 (conversão) · aguarda decisão 4 | S |
| 5 | A5, A6 (subtração e espaço) | M |
| 6 | A7, A8, B5 (rodapé, ícones, placeholders) | S |
| 7 | C2, C3, C6, C7 (performance) | M |
| 8 | C4, C10 (acessibilidade e meta) | S |
| 9 | C5 mais a navegação escolhida · aguarda decisão 1 | S |
| 10 | D1, D4, D6 (delight sem depender de assets) | S |
| 11 | D2, D3, D5, D7, D8 (assinatura) · aguarda fotos reais | L |
| 12 | D9 · aguarda decisão 2 | S |

Total estimado: 18 a 24 dias de trabalho, sendo 12 a 15 sem depender de nenhuma decisão ou asset do cliente.
