# Plano de melhorias — diterra-landing

Data: 2026-09-05. Base: código das 14 rotas do repo, detector Impeccable (428 achados), deploy `diterra-deploy.vercel.app` inspecionado em 1440×900 e 375×812.

Método: ⚠️ DEGRADED: single-context (as duas avaliações do critique, revisão de design e evidência do detector/browser, rodaram no mesmo contexto, não em sub-agentes isolados).

Comandos cobertos, na ordem em que entram no plano: audit, critique, optimize, polish, typeset, layout, bolder, animate, delight, overdrive, adapt.

---

## 1. Diagnóstico

### 1.1 Critique — heurísticas de Nielsen

Superfície: Persuade (landing). Heurísticas 7 e 10 não se aplicam. Máximo aplicável: 32.

| # | Heurística | Nota | Achado principal |
|---|---|---|---|
| 1 | Visibilidade do estado | 2 | Régua de leitura e contador do carrossel existem; formulários não têm estado nenhum (enviando, sucesso, erro) |
| 2 | Correspondência com o mundo real | 3 | Linguagem certa nos dois universos; "O Grupo" na nav social não descreve a seção (é a intro) |
| 3 | Controle e liberdade | 3 | Esc fecha gavetas; rodízio das casas pausa por foco/hover; Lenis sequestra a rolagem na home social |
| 4 | Consistência e padrões | 2 | Home social diverge das outras 13 rotas em nav, botão, rodapé, pesos de fonte e mecanismo de revelação; links `.html` na raiz e no corporativo contra `cleanUrls` nas internas |
| 5 | Prevenção de erro | 1 | Data em texto livre, `novalidate` no corporativo, `onsubmit="return false"` no social, sem endpoint |
| 6 | Reconhecimento | 3 | Breadcrumbs nas internas, nav com rótulos; a raiz esconde toda a navegação atrás do hambúrguer |
| 7 | Flexibilidade | n/a | landing |
| 8 | Estética e minimalismo | 3 | Corporativo e internas são específicos; home social acumula preloader, noise, parallax, AOS e stack de cards |
| 9 | Recuperação de erros | 1 | Nenhuma mensagem de erro existe no site |
| 10 | Ajuda | n/a | landing |
| **Total** | | **18/32** | **56 %, Aceitável** |

**Veredito de especificidade.** Corporativo e as 11 internas foram desenhados para esta marca: ficha técnica honesta com "a confirmar", ornamento floral do brandbook, arco da janela, título que sobe por máscara, lista que troca a foto. A home social é a exceção: os comentários do próprio código a rastreiam ao template "parallax-clean" (preloader, noise overlay, Lenis, card stack, footer fixo atrás do wrapper). Ela mostra "Jardim, Salão, Lounge" em vez das quatro casas e lista "Corporativos" como tipo de evento social. É a rota que a decisão de 23/08 elegeu para definir a linguagem do site, e é a que menos pertence à marca.

**Cognitive load.** 2 falhas de 8: a raiz esconde 100 % da navegação; a home social tem 9 links no rodapé fixo mais 6 na nav com âncoras que se sobrepõem (Ambientes/Espaços).

**Jornada emocional.** Pico certo: hero e o "Vamos conversar" em 72px no rodapé social. Vale: 3 s de preloader antes de qualquer conteúdo na home social; formulário termina em silêncio.

### 1.2 Issues prioritários

| P | Problema | Por que importa | Comando |
|---|---|---|---|
| P1 | Home social pesa 10,9 MB (hero PNG 3,7 MB, mais 3 PNG de 0,5 a 1,9 MB) e fica 3 s atrás de um preloader que depende de 5 scripts em 3 CDNs | Casey (celular, 4G) abandona; LCP muito acima de 2,5 s | optimize |
| P1 | Conteúdo nasce invisível: `.rise`, `.reveal-shot`, `.linhas` e `.cascata` têm `opacity:0` sem gate de JS. Na captura da raiz e das seções roladas do corporativo, quando rAF/IntersectionObserver não rodaram, a página ficou vazia | Falha de script, aba em segundo plano ou leitor de conteúdo mostram página em branco | polish |
| P1 | Home social divergente das 13 rotas (nav, botão, rodapé, fontes, reveal, links `.html`) | Quebra a coerência que base.css já entregou ao resto | polish, layout |
| P1 | Formulários sem validação visível, sem sucesso, sem erro, sem endpoint | Único ponto de conversão do site não conversa de volta | polish (estados), fora do escopo: endpoint |
| P2 | Contraste: `.tbd` tijolo sobre rosa 2,2:1 em 11 páginas; rótulos de contato 10,5 px; raiz com 9,5 px | WCAG AA reprovado onde o dado mais sensível (capacidade) aparece | polish |
| P2 | "Espaços que Inspiram" mostra ambientes genéricos, não as 4 casas | A seção mais forte da home não vende o ativo real | bolder |
| P3 | Motion sem tese na home social: preloader, noise, letra a letra, parallax, 14 `data-aos` | Sensação de template; custo em rAF | animate |

### 1.3 Personas

- **Jordan (noiva, primeira vez):** raiz clara em 5 s. Na home social espera 3 s olhando "DI TERRÁ". Preenche o formulário e nada acontece. Não sabe se foi enviado.
- **Casey (celular, no ônibus):** baixa 11 MB. Card stack com `height: 85vh` e `position: sticky` por cartão no celular. CTA "Solicitar proposta" no topo, fora do polegar. WhatsApp flutuante só existe no corporativo.
- **Riley (testa os limites):** links `/social/espacos/a-querencia.html` e `/social/espacos/a-querencia` para a mesma página; "Corporativos" no grid de eventos sociais; depoimentos fictícios a duas seções dos logos de B3, Itaú e Heineken.

### 1.4 Audit técnico

| # | Dimensão | Nota | Achado |
|---|---|---|---|
| 1 | Acessibilidade | 2 | Contraste em 11 páginas; texto funcional abaixo de 11 px; `prefers-reduced-motion` mata toda transição em `.01ms` (perde feedback útil); `alt="alice"`, `alt="b3"` nos logos |
| 2 | Performance | 1 | 10,9 MB na home social; nenhum `srcset`; PNGs de 2400 px servidos a 300 px; mp4 de 7,4 MB; 5 scripts de terceiros bloqueando `initSite()` |
| 3 | Responsivo | 3 | Sem overflow horizontal em 375; alvos de 44 px; breakpoints de colapso da nav diferem (1000 social, 1080 corp, 768 home) |
| 4 | Theming | 3 | Tokens `--ui-*` bem separados de forma; home.css e corporativo.css ainda têm `#1a1a1a`, `rgba(30,50,92,…)`, `15px` literais |
| 5 | Integridade | 2 | `design-system.html` documenta Jost, teal e dourado, um sistema que não existe mais (284 dos 428 achados são dele); imagens IA e depoimentos fictícios em produção de avaliação |
| **Total** | | **11/20** | **Aceitável** |

**Detector, sem `design-system.html`:** 144 achados nas 14 rotas. Reais: 11 contrastes tijolo/rosa, 5 rótulos de 10,5 px, 2 de 9,5 px, 2 transições de layout (`padding` na nav, `width` na barra do reel), 3 eyebrow chips. Falsos positivos: 19 "texto `#1e325c` sobre `#1e325c`" no corporativo (o detector lê `option` dentro de `select`), "cramped padding" em seções full-bleed, `cream-palette` (é a paleta do brandbook), `marquee` (pausa no hover e some com reduced-motion).

**O que já está bom e deve ser preservado:** separação tema/base; `.tbd` como estado honesto; hero que vira cartão; ficha técnica com `tabular-nums`; menu mobile único em base.css; gerador Python das 11 internas; redirects 301 documentados; `wa.me` e `tel:` reais no corporativo.

---

## 2. Plano por comando

Cada PR é pequeno, revisável e reversível. Ordem de fases respeita dependências: nada de expressão sobre uma base pesada e inconsistente.

### Fase 0 — Fundação

**PR-01 · optimize** (esforço M)
- Converter os 4 PNG da home social (`solucao-completa-decoracao-casamento`, `CASAMENTO-v2`, `ANIVERSARIO-v2`, `3.png`) para AVIF + WebP em 800/1400/2400 com `srcset` e `sizes`.
- Hero social em `<picture>` com corte vertical para celular; `fetchpriority="high"` já existe, falta `<link rel="preload">` nos dois universos.
- Recomprimir `hero-social.mp4` (7,4 MB → ~1,5 MB) e gerar versão 720p para tablet; celular segue com poster.
- `loading="lazy"` no grid de eventos, card stack, banner e rodapé.
- Self-host GSAP + ScrollTrigger (um domínio, cache imutável do `vercel.json`); remover AOS e Lenis da home; GLightbox só no primeiro clique da galeria.
- Fontes: só pesos usados; `<link rel="preload">` do Cormorant 400 e Albert 300.
- Aceite: home social < 2,5 MB, LCP < 2,5 s em 4G simulado, CLS < 0,1.

**PR-02 · audit, correções** (esforço P)
- Novo token `--ui-tbd-on-rose` (royal a 80 %) e revisão de `.tbd` sobre `.section--rose`.
- Piso de 12 px para rótulos funcionais (`.contact__k`, `.stage__foot`, `.pill` no celular, `.hero-scroll span`).
- `html.js` escrito no `<head>` e todo `opacity:0` de revelação condicionado a `.js`. Sem script, tudo visível.
- `prefers-reduced-motion`: manter transições de opacidade e cor em 200 ms; cortar só transform, clip-path e parallax.
- `alt` real nos 17 logos ("Logo B3"), `aria-live="polite"` no bloco de resposta do formulário, `autocomplete` nos campos do social.
- Trocar as duas transições de layout por `transform`.

### Fase 1 — Coerência

**PR-03 · polish** (esforço M)
- Home social passa a carregar `social.css` e usar `.nav`, `.btn`, `.nav__drawer`, `.foot` do sistema; sai o rodapé fixo atrás do wrapper.
- Remover preloader e noise overlay. `initSite()` deixa de esperar timeline.
- Um só mecanismo de revelação nas 14 rotas: `.rise` / `.reveal-shot` / `.linhas` + IntersectionObserver de `site.js`. GSAP fica só no card stack e no hero da home, ou sai na PR-07.
- Links sem `.html` em raiz e corporativo (já resolvidos por `cleanUrls`).
- Estados de formulário: validação inline em blur, botão em "Enviando…", bloco de sucesso com o que foi enviado e prazo de resposta, erro com o campo apontado. Endpoint continua pendente; enquanto isso, `mailto:` estruturado ou Formspree como stub.
- `design-system.html`: regenerar a partir de base.css + temas, ou mover para `_archive/`.

**PR-04 · typeset** (esforço P)
- Escala única de papéis: `home.css` sai de 15/13/11/10/9 px literais para `--text-*`.
- Medida: `.body-text` 520 px → `--max-text`; parágrafos do manifesto e da proposta em 45–75 ch.
- Eyebrows de hero 13 px / .3em → 11–12 px / .25em, alinhados com `.eyebrow`. `.depo__cargo` tracking .08em → .04em.
- Fallback métrico: `@font-face` local com `size-adjust` para Georgia e Arial, para `montarLinhas()` medir certo antes de a Cormorant chegar.
- Decisão sobre Channe: comprar a licença e hospedar o woff2 ou retirar do stack e assumir Cormorant como display definitivo.
- Compensar texto claro sobre navy/royal: +.02em de tracking e peso 400 no corpo dos blocos `on-dark`.

**PR-05 · layout** (esforço M)
- Ritmo: hoje `--section-y` é igual em toda seção. Definir três intervalos (apertado entre seções irmãs, normal, respiro fotográfico) e aplicar na home social o que o corporativo já faz com `section--respiro`.
- Card stack no celular vira grade simples de três cartões, sem sticky.
- Galeria bento consistente: 3 → 2 → 1 colunas com o mesmo `span` do item 1 em tablet.
- `section__head` centrado vs alinhado à esquerda: regra única por tipo de seção.
- Gaveta da raiz: três colunas viram lista única com as quatro casas em destaque no celular.
- `.cta-inline` do corporativo: alinhar à grade do `section__head`.

### Fase 2 — Expressão

**PR-06 · bolder** (esforço M) — alvo: seção "Espaços que Inspiram" da home social. Tudo fora dela permanece.
- Substituir Jardim/Salão/Lounge pelas quatro casas com o componente `switch` do corporativo (foto 90svh fixa, lista que troca a foto, rodízio com pausa).
- Nome da casa em `--text-2xl` display, número tabular, um dado real por casa quando confirmado.
- Arco da janela do símbolo como moldura fina (1 px) sobre a foto, não como máscara. O cliente tirou a máscara; a moldura mantém o motivo sem recortar a imagem.
- Teste do esqueleto: sem texto, a seção ainda lê como "quatro lugares para escolher".

**PR-07 · animate** (esforço M)
- Tese de motion por página: um momento focal (hero recolhendo em cartão, já existe), continuidade (transição entre internas), feedback (botões, formulário). O resto sai.
- Sai: preloader, letra a letra em "Marcas que escolheram", parallax do banner, `data-aos`, noise.
- Reveals migram para `animation-timeline: view()` dentro de `@supports`, com o IntersectionObserver atual como fallback. Isso permite tirar GSAP e ScrollTrigger da home.
- Card stack (`--cp`) e hero (`--hp`) passam para `animation-timeline: scroll()` com o mesmo fallback.
- Reduced motion preserva opacidade e cor.
- Faixa de logos: 64 s de laço fica; adicionar botão pausar visível.

**PR-08 · delight** (esforço P)
Tese: a Di Terrá cuida de tudo para que o casal ou a empresa só apareça. Cada momento de delight precisa provar isso.
- Sucesso do formulário repete a data e o espaço escolhidos e diz quem responde e em quanto tempo.
- "a confirmar" ganha `title`/tooltip: "estamos confirmando com a casa; pergunte na proposta".
- Gaveta da raiz: as quatro casas com miniatura.
- Hover/foco no card da casa mostra distância de Piracicaba e de São Paulo (depende do dado real).
- Ornamento floral das internas com parallax de 4 px no scroll.
- Favicon e `theme-color` por universo.

**PR-09 · overdrive** (esforço G) — não implementar antes de escolher uma direção:
- **A · Transições entre universos.** View Transitions cross-document entre raiz, social, corporativo e as quatro casas, com a foto do hero como elemento compartilhado. Chrome/Edge/Safari; Firefox recebe navegação normal. Custo baixo, efeito alto, zero dependência.
- **B · Céu que acompanha a hora.** Na raiz, a foto do hero recebe uma camada WebGL (ou gradiente animado por `@property`) que muda do entardecer para a noite conforme a hora local do visitante, com fallback estático. Alto impacto sensorial, exige ensaio fotográfico compatível.
- **C · Comparador das casas.** Planta esquemática interativa com capacidade por layout (auditório, banquete, U) e distância, com transição animada entre casas. Só faz sentido depois da ficha técnica real.

### Fase 3 — Adaptação

**PR-10 · adapt** (esforço M)
- Barra de ação fixa no rodapé do celular nos dois universos: "Solicitar proposta" + WhatsApp, `env(safe-area-inset-bottom)`, `viewport-fit=cover`.
- Card stack e reel viram trilhos horizontais com `scroll-snap` no celular.
- Unificar o ponto de colapso da nav (1000/1080/768 → 1024) e `pointer: coarse` para aumentar alvos.
- Overlay do `evento-card` sempre visível em toque (já abaixo de 768; cobrir tablet touch).
- Tablet 768–1023: duas colunas em intro, contato e proposta.
- `sizes` por breakpoint em todas as `<img>` responsivas da PR-01.
- Testar 320, 375, 768, 1024, 1440; paisagem em celular; zoom 200 %.

### Fase 4 — Polish final e re-critique

Rodar `/impeccable polish` sobre o caminho completo, fechar o snapshot, rodar `/impeccable critique` e `/impeccable audit` de novo e comparar com 18/32 e 11/20.

---

## 3. Bloqueadores fora do design

Não são resolvidos por nenhum comando acima e travam a publicação:

1. Fotografia real das quatro casas (todas as imagens em `assets/demo` são geradas por IA, ver `assets/demo/LEIA-ME.md`).
2. Depoimentos reais com autorização de imagem.
3. 26 campos "a confirmar" da ficha técnica e os 3 do território.
4. Endpoint do formulário e roteamento do lead corporativo.
5. Licença da Channe ou decisão de abandoná-la.
6. Remover `X-Robots-Tag` e `Disallow` ao promover.

---

## 4. Ordem, esforço e aceite

| PR | Comando | Esforço | Critério de aceite |
|---|---|---|---|
| 01 | optimize | M | home social < 2,5 MB, LCP < 2,5 s |
| 02 | audit fixes | P | detector sem contraste real; página legível sem JS |
| 03 | polish | M | 14 rotas com a mesma nav, botão e rodapé; formulários com 4 estados |
| 04 | typeset | P | zero px literal de fonte fora de base.css; medida 45–75 ch |
| 05 | layout | M | três intervalos de seção; card stack sem sticky no celular |
| 06 | bolder | M | quatro casas na home social; nada mais mudou |
| 07 | animate | M | GSAP/AOS/Lenis fora da home; reveals em CSS com fallback |
| 08 | delight | P | formulário devolve data e prazo; tooltip em "a confirmar" |
| 09 | overdrive | G | direção escolhida, funciona sem o efeito |
| 10 | adapt | M | barra de ação no polegar; 5 larguras sem overflow |

P = até meio dia, M = 1 a 2 dias, G = 3 dias ou mais.

---

## 5. Decisões (Victor, 2026-09-05)

1. **Começar pela Fase 0** (peso e robustez): PR-01 optimize e PR-02 audit fixes.
2. **Home social migra para base.css.** Reveals em CSS scroll-driven com IntersectionObserver de fallback; GSAP, ScrollTrigger, Lenis e AOS saem da home. Consequência: a PR-07 (animate) absorve a retirada do GSAP que a PR-03 deixava em aberto, e a PR-01 já pode remover os 5 scripts em vez de self-hostar.
3. **Overdrive: direção A**, View Transitions cross-document entre raiz, social, corporativo e casas, com a foto do hero como elemento compartilhado.
4. **Escopo: os 10 PRs**, um por vez, cada um com branch própria e revisão antes do próximo.

Ordem de execução resultante: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 (A) → 10 → polish final e re-critique.

---

## 6. Resultado (2026-09-05, os 10 PRs mergeados: #26 a #35)

| Medida | Antes | Depois |
|---|---|---|
| Critique (Nielsen, /32) | 18 (56 %) | 26 (81 %) |
| Audit técnico (/20) | 11 | 17 |
| Detector Impeccable, todas as rotas | 428 (144 sem `design-system.html`) | 18 (rótulos em caixa alta, eyebrows dos heros, breadcrumbs) |
| Home social, transferência inicial | 10,9 MB | 1,1 MB |
| Scripts de terceiros na home social | 5 (3 CDNs) | 0 |
| Rotas sem JS legíveis | não (`opacity: 0` sem gate) | sim (`html.js`) |
| Vídeo de hero | HEVC 7,4 MB (não toca em Chrome Windows/Android nem Firefox) | H.264 1,3 MB / 1,0 MB |

O que cada PR entregou está no histórico (`git log --merges`). O que continua fora do design e trava a publicação:

1. Fotografia real das quatro casas (`assets/demo` é IA).
2. Depoimentos reais com autorização.
3. Ficha técnica: 26 + 3 campos "a confirmar".
4. Endpoint do formulário (`data-endpoint` já é suportado por `assets/formulario.js`; até lá o botão abre o e-mail do visitante).
5. Telefone e WhatsApp do social: o número da home é placeholder, por isso a barra de ação social leva só ao contato.
6. Channe: licenciar ou retirar do stack.
7. Remover `X-Robots-Tag` e `Disallow` ao promover.
8. `tools/gerar-paginas.py` segue travado (TRAVA): as 11 internas são a fonte de verdade; regenerar exige alinhar o template antes.

Risco de ambiente: `~/Desktop` está no iCloud Drive (CloudDesktop). Durante a execução surgiram 158 cópias "nome 2.ext" não rastreadas dentro do repositório, apagadas antes dos commits. Repositórios git em pasta sincronizada pelo iCloud repetem isso; vale mover `projects/` para fora do Desktop ou desligar a sincronização.
