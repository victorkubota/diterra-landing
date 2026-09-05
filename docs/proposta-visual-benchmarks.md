# Proposta visual a partir dos benchmarks

Data: 2026-09-05. Contexto: o cliente quer se comunicar pelo visual (imagens grandes), com sofisticação e modernidade (motion, transições). As homes já chegaram lá; as internas e a seção de ocasiões da home social ainda são comuns. Este documento lê cinco referências, extrai o que cada uma faz de específico e propõe como trazer isso para o Di Terrá sem inventar um segundo sistema.

Antes de tudo, sobre a home social: ela nunca teve uma seção de soluções. Em todos os commits anteriores a 05/09 "Soluções" era um link na nav e no rodapé, e segue nos dois. A seção 4 desta proposta cria essa presença.

---

## 1. O que cada benchmark faz, de fato

| Referência | O que é específico | O que serve ao Di Terrá | O que não serve |
|---|---|---|---|
| **Sarah Haywood** (principal) | Vídeo em tela cheia com a marca centrada e nada mais; três pilares editoriais (Weddings, Parties, Destinations) com foto presa à esquerda e texto rolando à direita, um botão por pilar; pilha de citações de imprensa em rotação lenta; um par tipográfico (serifa Meno para display, Manrope para texto); nav inteira numa gaveta; ritmo lento, muito espaço vazio | O ritmo e a contenção: um gesto por seção; o pilar editorial como estrutura das internas; a citação em tela cheia para depoimentos; a gaveta como nav única | O tom "no.1 do mundo" e a prova por imprensa: o Di Terrá é lugar, não planner. A prova dele é a casa e a operação |
| **Kobu** | Índice fotográfico: cada item é foto grande + nome + lugar + rótulo pequeno em mono ("SHOT BY KOBU"); fundo escuro que faz a foto brilhar; trilhos horizontais de retratos; captions como metadado, não como frase | O índice como forma de listar casas e soluções: foto, nome, cidade, um dado; a camada de metadados em rótulo pequeno; o trilho para "as outras casas" | A fonte mono como costume técnico; o Di Terrá tem Albert Sans em caixa alta com tracking para esse papel |
| **Oura** | Rolagem presa: a foto fica fixa e o texto avança em passos; números como argumento ("86% dos membros…"); cantos grandes (32–48 px) em superfícies claras; serifa editorial (Editorial New) com grotesk (Akkurat) | O scroller de passos para contar o percurso de um evento na casa (chegada, cerimônia, coquetel, festa); a ficha técnica como número grande quando os dados chegarem; o par serifa+grotesk que já temos (Cormorant + Albert) | O produto no centro: não há objeto, há lugar. Os números só entram quando forem reais |
| **Klarna** | Blocos de cor única por seção; cartões de raio 48 px com vídeo dentro; texto em escala gigante; pill nav; playful | O bloco de cor por seção (royal, rosa, marfim) como ritmo, que o brandbook social já pede; vídeo dentro de cartão para as soluções (gastronomia, coquetelaria) | O tom playful e a densidade de cartões; o raio 48 px briga com o arco do símbolo |
| **Superpower** | Hero com sequência de 184 quadros esfregada pela rolagem; "How it works" em passos numerados com uma foto por passo; alternância claro/escuro; página muito longa | A sequência esfregada para um único momento (a chegada numa casa, do portão ao salão), quando houver material filmado; os passos numerados para "como acontece" nas soluções | O peso: 184 imagens e 15 mil px de rolagem. Um momento assim, não uma página inteira |

O fio comum: **uma imagem por vez, grande, e um gesto de motion por seção**. Nenhum deles empilha efeitos; todos alternam densidade (uma foto em tela cheia, depois uma lista seca, depois uma citação).

---

## 2. Princípios para o Di Terrá

1. **A foto é o argumento.** Toda seção começa por uma foto de 50 a 100 % da tela; texto é legenda, não bloco.
2. **Um gesto por seção**, escolhido entre os que o sistema já tem: foto presa + lista (`switch`), pilha que recua (`pilha`), foto descoberta (`reveal-shot`), título por máscara (`linhas`), transição de página (`view-transition`). Novos gestos entram só onde nenhum desses conta a história.
3. **Ritmo por alternância**: tela cheia → lista seca → citação → grade. Nunca duas seções do mesmo tipo em sequência.
4. **Metadado como camada**: nome em serifa, dado em caixa alta pequena (cidade · capacidade · distância), como no índice do Kobu, com a Albert Sans que já existe.
5. **Cor por seção** (royal, marfim, rosa, branco) em blocos inteiros, como no Klarna, no lugar de cartões coloridos.
6. **Nada depende de foto de IA**: cada proposta abaixo diz o que precisa de fotografia real.

---

## 3. Home social · seção "Ocasiões" (casamentos, debutantes, aniversários, formaturas)

Hoje: quatro cartões iguais 3:4 com nome no hover. É a seção mais comum da home e a que mais interessa ao cliente.

### Opção A · Pilha em tela cheia (recomendada)
Cada ocasião é um cartão de 76vh que sobe por cima do anterior, que recua, desfoca e apaga (o mesmo mecanismo dos formatos do corporativo, `.pilha` + `.recua`). Dentro: foto full-bleed, nome da ocasião em `--text-manchete`, uma frase de promessa e um link "Ver soluções para casamentos" que leva às páginas de solução com a ocasião como filtro (`/social/solucoes?ocasiao=casamento`). No celular vira trilho horizontal com `scroll-snap`, um cartão por tela.

- Por que: transforma quatro vinhetas em quatro momentos de tela cheia, sem tirar nada da página; é o gesto que ainda não aparece na home social (a home usa `switch` nas casas e bento na galeria).
- Custo: P. O CSS e o JS da pilha já existem; a home social precisa carregar a medição de `--cp` (12 linhas em `site.js`).
- Precisa: quatro fotos horizontais reais, uma por ocasião.

### Opção B · Pilares editoriais (Sarah Haywood)
Quatro blocos meio a meio, foto presa à esquerda por 90svh enquanto o texto rola à direita, lados alternando. Cada pilar termina com um botão.

- Por que: é o benchmark principal, literal. Lê como revista.
- Custo: M. A página cresce quatro telas; o cliente já pediu para tirar os "headlines" das seções, e este formato pede mais texto do que temos.
- Precisa: quatro fotos verticais e quatro parágrafos aprovados.

### Opção C · Índice com foto que segue o cursor (Kobu)
Lista seca com as quatro ocasiões em serifa grande; ao passar o mouse a foto correspondente aparece e acompanha o cursor; no toque, vira trilho de retratos.

- Por que: elegante e leve; funciona como "índice" e não compete com as casas.
- Custo: P para o índice, M para o cursor (só desktop, `pointer: fine`).
- Precisa: quatro fotos verticais.

**Recomendação:** A na home. C fica para os hubs (§5).

---

## 4. Home social · presença de "Soluções"

Não existe hoje. Proposta: uma faixa entre as ocasiões e a galeria, fundo rosa (bloco de cor), com as cinco soluções como índice de uma linha cada: nome em serifa (`--text-xl`), rótulo em caixa alta ("Cozinha própria · Menu autoral"), seta. Ao passar o mouse a foto da solução aparece à direita em 3:4 (desktop); no celular cada linha abre a foto abaixo (acordeão, o `vcard__panel` que já existe). Link para `/social/solucoes/<slug>`.

- Custo: P. Reusa `switch`/`vcard` em variante clara.
- Precisa: cinco fotos verticais de solução (as de demo são horizontais 2400×1792; servem como placeholder).

---

## 5. Hubs `/social/espacos` e `/social/solucoes`

Hoje: hero em cartão + grade de cards 4:3 com "Ver". Proposta: **índice fotográfico** (Kobu): cada item ocupa uma linha inteira, foto de 62 % à esquerda ou direita alternando, nome em `--text-2xl`, metadados em caixa alta (Piracicaba · Salão coberto e jardim · Capacidade a confirmar) e um link. No desktop a foto entra por `reveal-shot` e o título por `linhas`; ao passar o mouse a foto ganha a moldura em arco. No celular, foto em cima, texto embaixo, um item por tela.

- Custo: M (é um template novo por hub, 2 arquivos).
- Precisa: uma foto por casa e por solução (as atuais servem).

---

## 6. Páginas internas de casa

Hoje: hero em cartão → texto + foto em arco → ficha "a confirmar" + checklist → galeria → outras casas → chamada. É correto e é comum. Proposta de estrutura, de cima para baixo, com um gesto por bloco:

1. **Hero 100svh** com vídeo curto da casa quando houver (hoje foto), título no canto inferior esquerdo (já está), e a foto chegando pela View Transition (já está).
2. **Percurso do evento** (novo, gesto de Oura/Superpower): foto presa à direita por 90svh (`palco-fixo`, já existe) e, à esquerda, cinco passos que trocam a foto ao entrar na tela: chegada · cerimônia · coquetel · festa · saída. Cada passo é um número em serifa, um título e uma frase. É a seção que faz a pessoa "andar pela casa". Custo M; precisa de cinco fotos da casa em sequência.
3. **Ficha técnica como número** (Oura): quando os dados chegarem, capacidade, área e distância viram numerais em `--text-3xl` com `tabular-nums` e rótulo em caixa alta, três por linha. Até lá, a lista com "a confirmar" fica. Custo P.
4. **Galeria como página dupla** (Kobu): em vez da grade de quadrados, ritmo 1 full-bleed + 2 retratos + 1 full-bleed, com legenda de metadado (momento · local) sob cada foto. O lightbox continua. Custo P.
5. **Citação em tela cheia** (Sarah Haywood): um depoimento de casal sobre a casa, em Cormorant itálico `--text-manchete`, fundo royal, foto do casal ao fundo com véu; troca lenta se houver mais de um. Só com depoimento real.
6. **As outras casas** em trilho horizontal de retratos 3:4 (Kobu), não em grade de cards. Custo P.
7. **Chamada final** como está.

O que sai: a checklist "O que este espaço oferece" (vira parte dos passos do percurso) e a foto em arco do bloco editorial, que compete com o hero.

---

## 7. Páginas internas de solução

Mesmo esqueleto, com dois blocos próprios:

1. **"Como acontece"** em passos numerados (Superpower), com pilha: cada passo é um cartão que sobe por cima do anterior, foto e uma frase ("Degustação com o casal", "Menu fechado 60 dias antes", "Serviço no dia"). Custo P, usa `.pilha`.
2. **"Em qual casa"**: as quatro casas em trilho, cada uma com uma linha sobre como a solução acontece ali. Custo P.
3. **Vídeo dentro de cartão** (Klarna) para gastronomia e coquetelaria: 8 segundos em laço, sem som, dentro de um cartão de raio `--radius-xl`, com botão de pausa. Só com vídeo real.

---

## 8. Sofisticação transversal

- **Hero da home social com vídeo**: raiz e corporativo já têm; a home social ainda usa a peça PNG de 1220 px. Trocar por `hero-social.mp4` (já existe) com a mesma lógica das outras rotas. Custo P.
- **Cursor "Ver"** sobre fotos clicáveis no desktop (Kobu): um círculo pequeno com a palavra, em `pointer: fine`. Custo P.
- **Título de hero por máscara** também nas internas (hoje só os H2 sobem). Custo P.
- **Depoimentos em rotação** na home social, formato citação de tela cheia. Depende de conteúdo real.
- **Blocos de cor** na home social: intro em marfim, casas em royal, ocasiões em branco, soluções em rosa, galeria em marfim, contato em branco, chamada em royal. Hoje a alternância é marfim/branco/royal; falta o rosa, que é cor do brandbook e só aparece na chamada final das internas.

---

## 9. Ordem sugerida e custo

| # | Item | Custo | Depende de foto real? |
|---|---|---|---|
| 1 | Ocasiões como pilha em tela cheia (§3-A) | P | Sim (4 fotos) |
| 2 | Presença de Soluções na home (§4) | P | Não (placeholder serve) |
| 3 | Hero da home social com vídeo (§8) | P | Não |
| 4 | Percurso do evento nas casas (§6-2) | M | Sim (5 fotos por casa) |
| 5 | Galeria como página dupla + trilho de outras casas (§6-4, 6-6) | P | Não |
| 6 | Hubs como índice fotográfico (§5) | M | Não |
| 7 | "Como acontece" nas soluções (§7-1) | P | Não |
| 8 | Cursor "Ver" + título de hero por máscara (§8) | P | Não |
| 9 | Ficha como número, citação em tela cheia, vídeo em cartão | P cada | Sim (dados, depoimento, vídeo) |

Os itens 2, 3, 5, 6, 7 e 8 podem entrar já, com o material atual. Os itens 1, 4 e 9 valem a espera pela fotografia, porque são justamente os que vendem o lugar.
