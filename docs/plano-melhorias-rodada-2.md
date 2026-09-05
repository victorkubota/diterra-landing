# Plano de melhorias — rodada 2

Data: 2026-09-05. Base: `main` no commit `b601c03`, isto é, o site depois dos 10 PRs da rodada 1 (#26 a #35) e depois do rollback da proposta visual (#43). As 14 rotas foram servidas localmente e inspecionadas por CDP em 1440×900 e 375×812, com rolagem real e viewport emulado, para que as unidades `svh` resolvessem como no navegador do visitante.

Método: ⚠️ DEGRADED: single-context. As duas avaliações isoladas que o critique, o typeset e o layout pedem rodaram no mesmo contexto, não em sub-agentes separados.

Decisões do Victor que enquadram esta rodada:

1. Refinar o que está no ar. A linguagem atual permanece; nada de proposta visual nova.
2. Fotografia real das quatro casas entra nas próximas semanas.
3. Executar as correções P1 nesta sessão, uma branch e um PR por correção.

Comandos cobertos: critique, audit, polish, bolder, animate, typeset, layout, delight, overdrive, adapt, optimize.

---

## 1. O que mudou desde a rodada 1

A rodada 1 fechou em 26/32 no critique e 17/20 no audit. Esta rodada pontua 25/32 e 16/20. O site não regrediu: nenhum commit tocou nas rotas depois do rollback. A diferença vem de onde a inspeção chegou. A rodada 1 avaliou marcação, tokens e desempenho; esta abriu os arquivos de imagem, mediu a composição tipográfica renderizada e amostrou o pixel atrás dos rótulos. Três defeitos que estavam invisíveis nessas duas dimensões apareceram, e todos ficam nas superfícies de maior tráfego.

---

## 2. Diagnóstico

### 2.1 Critique — heurísticas de Nielsen

Superfície: Persuade. Heurísticas 7 e 10 não se aplicam. Máximo aplicável: 32.

| # | Heurística | Nota | Achado principal |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | Formulário tem os quatro estados; falta endpoint; o telefone da home social é `(19) 99999-9999` |
| 2 | Correspondência com o mundo real | 3 | "O grupo" ainda rotula a intro; "Corporativos" segue como uma das quatro ocasiões sociais |
| 3 | Controle e liberdade | 4 | Sem sequestro de rolagem, Esc fecha a gaveta, faixa de logos pausa |
| 4 | Consistência e padrões | 4 | Um sistema nas 14 rotas; sobram dois estilos de `select` (custom no social, nativo no corporativo) |
| 5 | Prevenção de erro | 3 | Validação inline e `autocomplete`; data ainda em texto livre |
| 6 | Reconhecimento | 3 | A raiz continua escondendo 100% da navegação atrás do chevron |
| 7 | Flexibilidade | n/a | landing |
| 8 | Estética e minimalismo | 2 | Duas das quatro fotos de ocasião trazem o nome da ocasião **queimado dentro do arquivo**, em tipografia estranha à marca; o card do Palacete no hub é 45% bloco azul chapado; as duas maiores manchetes quebram em composição que ninguém escolheu; "Vamos conversar" aparece duas vezes na mesma página |
| 9 | Recuperação de erros | 3 | Erros nomeiam problema e saída |
| 10 | Ajuda | n/a | landing |
| **Total** | | **25/32** | **78%, Bom** |

**Veredito de especificidade.** O corporativo e as 11 internas continuam desenhados para esta marca: ficha técnica honesta, ornamento do brandbook, arco da janela, título por máscara, lista que troca a foto. A home social também já pertence ao sistema depois da rodada 1. O que ainda não pertence são três assets: dois JPEGs de ocasião com texto impresso e uma peça de marketing composta usada como se fosse fotografia.

### 2.2 Audit técnico

| # | Dimensão | Nota | Achado |
|---|---|---|---|
| 1 | Acessibilidade | 3 | `.evento-tag` mede **3,08:1** sobre o card corporativo (reprova AA, que exige 4,5:1 abaixo de 18,66 px); alvos entre 26 e 40 px, que passam no WCAG 2.2 AA (mínimo 24 px) e ficam abaixo da diretriz de plataforma de 44 px |
| 2 | Performance | 3 | Sem erro de console, `loading="lazy"` e AVIF/WebP com `srcset` em toda parte; 34 das 38 declarações de `sizes` na home social são `100vw`, o que é impreciso mas custa pouco na prática (só 1 das 17 imagens baixa mais que 2,2× do necessário); 9,9 MB de PNG legado sem referência em HTML |
| 3 | Responsivo | 4 | Nenhum estouro horizontal em 375; barra de ação no polegar; o botão "ao topo" colide com essa barra |
| 4 | Theming | 4 | Escala de tokens em `base.css` usada com disciplina nas 14 rotas |
| 5 | Integridade de implementação | 2 | Texto de marketing dentro de duas fotos; peça composta no lugar de foto; telefone placeholder em produção; 26 campos "a confirmar" |
| **Total** | | **16/20** | **Bom** |

Detector Impeccable: 4 achados nas 7 rotas amostradas, todos falso-positivo de breadcrumb lido como eyebrow. Mecanicamente o repositório está limpo.

### 2.3 Os cinco defeitos com evidência

**D1. Duas das quatro fotos de ocasião têm o nome impresso dentro do arquivo.**
`assets/opt/CASAMENTO-v2-*.webp` traz "CASAMENTO" e `ANIVERSARIO-v2-*.webp` traz "ANIVERSÁRIO", ambos em sans bold com vinheta escura, em tipografia que não é a do site. O HTML ainda coloca por cima um `<h3>Casamentos</h3>` e um `.evento-tag`. Resultado: em quatro cards iguais, dois exibem um rótulo grande de origem desconhecida e dois não exibem rótulo nenhum até o hover. É a seção que o cliente já apontou como comum, e a razão de ela parecer comum está dentro do JPEG.
Os quatro arquivos ainda têm três proporções diferentes (1024×1024, 1856×2304, 2400×1340) recortadas na mesma grade, o que desalinha o enquadramento.

**D2. O card do Palacete Monte Alegre é 45% bloco azul.**
`social/espacos/index.html:96` usa `foto-noiva-janela-1400.webp`, que não é uma fotografia: é uma peça composta, com a foto ocupando a metade esquerda e um retângulo `--royal` chapado na direita. Como `.card__media` tem `background: var(--royal)`, o bloco funde com o fundo do card e a coisa lê como imagem que falhou ao carregar. Acontece na página cujo trabalho inteiro é vender as quatro casas.

**D3. As duas maiores manchetes quebram numa composição que ninguém escolheu.**
A manchete do hero social tem um `<br>` no HTML, ou seja, foi composta em duas linhas. Renderiza em **quatro** linhas, tanto em 1440 (96 px, caixa de 885 px dentro de container de 1000 px) quanto em 375 (44,6 px). A linha 2 vira a órfã "PARA". O blockquote do banner tem dois `<br>`, foi composto em três linhas e renderiza em **cinco**, com "DE" pendurada no fim da primeira. O hero do corporativo quebra "ONDE MARCAS SE / EXPRESSAM", deixando "SE" no fim da linha.
Causa única: `text-wrap: wrap`, `max-width: none` e um `clamp()` de tamanho que não conversa com a largura do container. As quebras autorais existem e são atropeladas pela quebra automática.

**D4. O rótulo secundário das ocasiões reprova contraste.**
`.evento-tag` é `rgba(255,255,255,.5)` a 12 px e peso 300. Medindo o pixel real atrás de "CONFERÊNCIAS & GALA" no card corporativo (fundo RGB 98,88,76), a razão é **3,08:1**. O `<h3>` branco sólido no mesmo lugar dá 6,98:1 e passa. O problema é a opacidade de 50%, não o scrim.

**D5. Nenhum. Suspeita levantada e descartada.**
Entrei nesta rodada esperando o corte global de `.01ms` que costuma sobrar depois de uma passada de acessibilidade. Não é o caso. `base.css:888` corta só `animation-duration`, mantém `transition-duration` em 150 ms e restringe `transition-property` a opacidade, cor, fundo, borda, sombra e contorno. O deslocamento sai e o retorno de hover, foco e envio fica, que é o que a preferência pede. Sobra um `animation-duration: .01ms` no seletor universal, sem vítima hoje: não há animação que carregue significado no site. P3, e só se aparecer uma.

### 2.4 Personas, no estado de hoje

- **Jordan (noiva, primeiro contato):** chega pela raiz, entra no social, lê a manchete quebrada em quatro linhas, rola até as ocasiões e vê dois cards rotulados por dentro da foto e dois sem rótulo. Preenche o formulário, recebe confirmação e vê um telefone que não existe.
- **Casey (celular, 4G):** a página não estoura na horizontal e a barra de ação fica no polegar. O botão "ao topo" pousa em cima da barra. Os links de contato têm 26 px de altura.
- **Riley (testa os limites):** liga `prefers-reduced-motion` e perde junto o retorno visual de hover e foco. Abre o hub de espaços e encontra uma das quatro casas representada por meio retângulo azul.

---

## 3. As onze lentes, e o que cada uma pede

### polish — P1
D1, D2, D4 e o telefone placeholder são defeitos de acabamento sobre um sistema que já existe. Nenhum deles pede componente novo: pedem trocar asset, trocar um valor de cor e remover uma informação falsa.

### typeset — P1
D3. Prender a composição autoral: `text-wrap: balance` nos três blocos de display, `max-width` em `ch` derivada do `clamp()` de cada papel, e `<br>` ativo só acima do ponto em que a linha inteira cabe. Segundo item, de P2: o corpo do site é 15 px (`--text-base: .9375rem`). Para uma página que argumenta por texto corrido, 16 px é o piso confortável, e a mudança é de uma linha em `base.css` com verificação de refluxo nas 14 rotas.

### layout — P2
Três intervalos verticais medidos que sobraram:
- `.intro` da home social abre com 647 px de vazio antes da primeira linha, quase uma tela inteira em 900 px de viewport.
- A seção de casas termina com cerca de 250 px de azul vazio abaixo da lista, porque a foto é mais alta que a lista de quatro itens.
- O contato deixa um bloco grande à direita de "VAMOS CONVERSAR" e outro abaixo do formulário.
Nada disso é erro; é ritmo repetido. A correção é diferenciar os intervalos, não encolher todos.

### adapt — P1 (um item) e P2 (o resto)
P1: o botão "ao topo" colide com a barra de ação no mobile.
P2: alvos de toque em 39-40 px passam no WCAG 2.2 AA (mínimo de 24 px) mas ficam abaixo da diretriz de plataforma de 44 px. Subir os oito links de card e os três links de contato custa pouco.

### optimize — P2
Medido, o desperdício de imagem é pequeno: das 17 imagens da home social, uma baixa mais que 2,2× do necessário. O `sizes="100vw"` em 34 declarações continua impreciso e vale corrigir por higiene, com ganho real só em telas intermediárias. O que pesa de verdade é fora do site: 9,9 MB de PNG legado (`solucao-completa-decoracao-casamento.png`, `corporativo-auditorio.png`, `CASAMENTO-v2.png`, `espaco-lounge.png`) que nenhum HTML referencia.

### audit — P1
D4, e só D4: trocar a opacidade do rótulo por uma cor do sistema. O bloco de `prefers-reduced-motion` foi lido linha a linha e está correto (ver D5).

### bolder — P2, depois da fotografia
A seção de ocasiões é a candidata óbvia, e é a que o cliente já apontou. Com D1 corrigido ela deixa de ter defeito, mas continua sendo quatro cards iguais. O sistema já tem o gesto para levantá-la sem inventar nada: `.switch`, usado nas casas logo acima, e a pilha `.recua`, usada nos formatos do corporativo. Escolher um dos dois, não os dois. Isso só vale a pena depois que as fotos reais chegarem, porque a seção passa a ser vendida pela foto.

### animate — nada a fazer
Sem GSAP, sem AOS, sem Lenis; revelações em CSS com fallback de IntersectionObserver; um gesto por seção; `prefers-reduced-motion` escrito com critério. O comando pede que se anime onde a ausência de movimento custaria significado, e esse lugar não existe aqui. Abrir animate nesta rodada seria criar dívida.

### delight — P2
Dois momentos concretos, ambos usando linguagem que o produto já tem:
- A confirmação do formulário devolve a data digitada e o prazo de resposta ("Recebemos. Respondemos até quarta, 8 de setembro").
- Os 26 campos "a confirmar" da ficha técnica são hoje um texto pontilhado inerte. Um título que explique ("medida em conferência com a operação") transforma uma lacuna em transparência.

### overdrive — P3, com ressalva
As View Transitions cross-document entre as rotas já entraram na rodada 1 (PR #34). É o teto certo para este site. Empilhar um segundo efeito extraordinário contraria a própria regra do comando, que pede foco em um. Recomendação: não abrir overdrive nesta rodada.

### critique — reexecutar no fim
Fechar o snapshot atual e comparar contra 25/32 e 16/20.

---

## 4. Duas decisões que não são de design

**Eyebrows dos heros.** O `.impeccable/config.json` registra o eyebrow do hero social como sancionado por decisão de composição do cliente, com referência a Sarah Haywood e Cipriani, e anota que não foi confirmado pelo usuário. O piso de ofício do Impeccable trata o eyebrow como banimento, não como padrão. Os dois não podem estar certos ao mesmo tempo. Vale confirmar com o cliente antes da próxima rodada; enquanto isso, permanece como está.

**"Corporativos" entre as ocasiões sociais.** O universo corporativo tem página própria e nav própria. Manter corporativo como uma das quatro ocasiões da home social pode ser intenção comercial. Não mexo sem sua palavra.

**"Vamos conversar" duas vezes.** A seção de contato e a seção de fechamento usam a mesma manchete, separadas por uma tela. Trocar exige reescrever copy factual, o que não faço sem aprovação. Sugestão para a de fechamento: usar a promessa em vez do convite.

---

## 5. Ordem, esforço e aceite

| PR | Comando | O que entra | Esforço | Aceite |
|---|---|---|---|---|
| 01 | typeset | Manchetes do hero social, do banner e do hero corporativo respeitam as quebras autorais | P | 2 linhas no hero, 3 no banner, 2 no corporativo, em 375, 768, 1024 e 1440 |
| 02 | polish | Fotos de ocasião sem texto queimado, quatro na mesma proporção | P | O único rótulo visível vem do HTML |
| 03 | polish | Card do Palacete com fotografia de verdade | P | Nenhum bloco chapado no hub |
| 04 | audit | `.evento-tag` sólido sobre scrim medido | P | Rótulo ≥ 4,5:1 na pior foto da grade |
| 05 | adapt | Botão "ao topo" sai de cima da barra de ação | P | Sem sobreposição de 320 a 430 px |
| 06 | polish | Telefone placeholder sai da home social | P | Nenhum dado falso no ar |
| 07 | typeset | Corpo a 16 px | P | Sem refluxo quebrado nas 14 rotas |
| 08 | layout | Três intervalos de seção diferenciados | M | `.intro`, casas e contato sem vazio de quase uma tela |
| 09 | adapt | Alvos de toque a 44 px | P | 44 px nos links de card e de contato |
| 10 | optimize | `sizes` reais e limpeza dos PNGs órfãos | P | Repositório 9,9 MB menor |
| 11 | delight | Confirmação com data e prazo; título nos "a confirmar" | P | Formulário devolve o que a pessoa escreveu |
| 12 | bolder | Ocasiões levantadas com um gesto do sistema | M | Depois da fotografia |

PRs 01 a 06 são os P1 desta sessão. P = até meio dia, M = 1 a 2 dias.

---

## 6. O que continua travado fora do design

1. Fotografia real das quatro casas. Confirmado para as próximas semanas; `assets/demo` segue sendo IA.
2. Depoimentos reais com autorização de imagem.
3. Ficha técnica: 26 campos "a confirmar" mais 3 do território.
4. Endpoint do formulário. `assets/formulario.js` já aceita `data-endpoint`; até lá o botão abre o e-mail do visitante.
5. Telefone e WhatsApp do social.
6. Channe: licenciar ou retirar do stack.
7. Remover `X-Robots-Tag` e `Disallow` na promoção.
8. `tools/gerar-paginas.py` segue travado; as 11 internas são a fonte de verdade.
