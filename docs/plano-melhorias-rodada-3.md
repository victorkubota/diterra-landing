# Plano de melhorias — rodada 3

Data: 2026-09-06. Base: produção em https://diterra-deploy.vercel.app (branch `main`, commit `dd918cd`).

Referências usadas em todo o plano:

- **SH** = sarahhaywood.com, inspiração visual declarada. Ritmo: hero em tela cheia, parágrafo de 60 a 130 palavras, carrossel, três pilares narrativos, grade de cards, rodapé. Sem preço, sem lista de serviços, CTAs suaves.
- **DS** = estudo de design system em `~/Desktop/cursos/Asimov/DiTerra/diterra-ds/` (secoes, wireframes, benchmarks). Esqueleto de home: hero → prova social → features → como funciona → showcase → CTA → rodapé.

Princípios decididos na entrevista (não reabrir sem motivo):

1. Escopo é melhoria, seções e páginas novas. Cores, tipografia e direção visual atuais ficam.
2. Ritmo e estética SH, esqueleto de seções DS. Quando conflitam, SH manda na estética e DS na ordem.
3. Social é prioridade. Portal duplo na raiz permanece, enriquecido, sem menu.
4. Sem preço, sem imprensa, sem FAQ, sem newsletter, sem loja, sem planta baixa.
5. CTA único em todo o site: **Agendar visita**. Abre painel curto. Formulário longo do Social permanece. Formulários sem destino nesta fase.
6. Dados fictícios entram limpos no deploy de teste, sem marcação. A lista de pendências vive neste documento.
7. Imagens: acervo demo de IA em `assets/demo/`, gerar novas só onde faltar. Vídeos de IA de `assets/opt/video/` entram nos heroes.
8. Texto do Corporativo é aprovado e não se altera. "A confirmar" é dado, não texto, e recebe mock.
9. Prova social do Social continua sendo o carrossel de polaroids.
10. Site segue com `noindex` até virar produção.

Legenda de veredito: **Manter** (sem mudança), **Ajustar** (seção existe, muda conteúdo ou comportamento), **Novo** (não existe), **Remover**.

---

## 0. Transversal (vale para todas as páginas)

### G1 · Navbar pílula com liquid glass — Novo (alternativa)

Pílula flutuante centralizada, fundo translúcido com desfoque, filete de 1px. Ao passar o mouse em um item, desce um dropdown:

- **Espaços**: quatro miniaturas (foto demo `espacos/*-vertical`), nome e uma linha de descrição. Sem capacidade.
- **Soluções**: lista das cinco frentes.
- **Sobre**: sem dropdown.
- **Blog**: foto de capa e título do último post, lidos da API do WordPress.
- Ponta da pílula: botão de troca Social ⇄ Corporativo.

Entra como alternativa ativada por `?nav=pilula` (persistida em `localStorage`) para comparação com a barra atual. Se aprovada, PR seguinte substitui a barra em todas as páginas.

- Porquê: o menu atual é a única porta para nove páginas internas (diagnóstico DS). A pílula expõe as casas com foto antes do clique.
- Referência: DS Navigation 02 (amigo/oura/cosmos) e 04 (alternador Social/Corporativo). SH faz o oposto (só logo e hambúrguer), por isso o teste lado a lado.
- Pendência: decisão pílula versus barra após comparação.
- Mock: nenhum dado; usa fotos demo.

### G2 · Barra inferior fixa no celular — Novo

Três ações: Início · Espaços · WhatsApp. Aparece abaixo de 768px, some quando o painel de visita está aberto.

- Porquê: no celular o noivo quer falar rápido; DS recomenda a barra (Celular 01). SH não tem nada fixo, mas é desktop-first.
- Referência: DS Celular 01.
- Pendência: confirmar número (19) 99677-7288 para o Social.
- Mock: número do Corporativo reaproveitado.

### G3 · Painel "Agendar visita" — Novo

Todo CTA do site passa a se chamar **Agendar visita** e abre um painel lateral com cinco campos: nome, WhatsApp, data pretendida, casa (pré-selecionada quando aberto de dentro de uma página de espaço) e número de convidados. Botão "Enviar". Sem destino: por ora mostra confirmação na tela e registra no console.

- Porquê: visita é a conversão natural de um venue; cinco campos qualificam sem o atrito do formulário longo.
- Referência: DS Contact 01 (formulário curto, corgi). Fluxo de visita é uma das lacunas que SH não cobre.
- Pendência: destino (n8n, e-mail ou CRM); texto de confirmação; horário de visitas.
- Mock: nenhum.

### G4 · Rodapé — Ajustar

Quatro colunas (duas no celular): (1) marca e uma linha de manifesto; (2) Espaços e Soluções; (3) Sobre, Fornecedores, Blog, Corporativo; (4) contato: WhatsApp, e-mail, Instagram, endereço. Sem CNPJ.

- Referência: DS Footer 01. SH usa quatro colunas com repetição do menu e ícones sociais.
- Pendência: endereço real, handle do Instagram, e-mail oficial do Social.
- Mock: "Estrada Municipal Piracicaba–Tupi, km 6 · Piracicaba, SP".

### G5 · Vídeo nos heroes — Ajustar

`hero-social` no Social, `hero-corporativo` no Corporativo, `coquetelaria` na página de Coquetelaria. Autoplay mudo em loop, poster = imagem atual, `prefers-reduced-motion` e conexões lentas recebem só a imagem. "Agendar visita" permanece sobre o vídeo, discreto, alinhado à direita.

- Porquê: SH abre com vídeo 4K; é o elemento que mais aproxima a primeira dobra da referência.
- Referência: SH home; DS Hero 03.
- Pendência: vídeo real dos espaços (os atuais são IA).

### G6 · "A confirmar" vira mock — Ajustar

24 ocorrências no gerador (`tools/gerar-paginas.py`, constante `TBD`) e 28 soltas em `corporativo/index.html`. Todas recebem os valores da tabela abaixo. O aviso "campos a preencher" das páginas de casa sai.

| Casa | Sentados | Em pé | Área coberta | Jardim / terreno | Vagas | Suíte | Auditório (corp.) | Salas de apoio |
|---|---|---|---|---|---|---|---|---|
| A Querência | 450 | 700 | 1.100 m² | 3.200 m² | 180 | sim | 400 | 3 |
| Palacete Monte Alegre | 220 | 350 | 640 m² | 900 m² | 90 | sim | 180 | 2 |
| Casa Lucca | 120 | 180 | 380 m² | 600 m² | 60 | sim | 80 | 2 |
| Espaço Terrá | 600 | 1.000 | 1.800 m² (montagem) | 8.000 m² | 250 | montada sob demanda | 600 | 4 |

Território (Corporativo e fichas): 165 km de São Paulo, 1h40 pela Rod. dos Bandeirantes; Viracopos a 75 km, 55 min; 1.200 leitos num raio de 15 km. Parceiros: Pousada Recanto das Águas (8 min), Hotel Fazenda Monte Alegre (15 min), suítes no centro (12 min), transfer em van executiva a partir de Campinas.

- Pendência: **todos** os números acima, a serem confirmados pela Di Terrá.

---

## 1. Portal `/`

| # | Seção | Veredito | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|---|
| P1 | Duas portas (Social / Corporativo) | Manter | Decisão do produto | — | — | — |
| P2 | Linha de manifesto abaixo das portas | Novo | Raiz hoje não tem texto indexável | DS diagnóstico | — | "Quatro casas no interior paulista para celebrar e reunir. Desde 2009." |
| P3 | Faixa dos quatro espaços | Novo | Segundo caminho de entrada com foto; quem já sabe a casa não precisa passar pelo Social | SH grid de destinos; DS wireframes | — | Fotos demo `espacos/*-amplitude`, nome e link para a página da casa |
| P4 | Rodapé | Novo | G4 | DS Footer 01 | Endereço | G4 |
| — | Menu | Não entra | As duas portas são a navegação do portal | — | — | — |

---

## 2. Social `/social`

| # | Seção | Veredito | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|---|
| S1 | Hero | Ajustar | Vídeo `hero-social`, CTA "Agendar visita" discreto | SH home; G5 | Vídeo real | Vídeo IA existente |
| S2 | Manifesto "Onde a natureza encontra a arte" | Manter | Equivale ao "Orchestrating the Exceptional" da SH | SH | — | — |
| S3 | Soluções em pilha | Manter | Refeito nos PRs 58 e 59 | — | — | — |
| S4 | Espaços 2+2 | Manter | Refeito no PR 62. Botão secundário vira "Agendar visita" com casa pré-selecionada | DS card 01 | — | — |
| S5 | Tipos de evento | Ajustar | Hoje sem link (diagnóstico DS). Corporativos → `/corporativo`; os demais abrem o painel de visita | DS diagnóstico | — | — |
| S6 | Banner "O lugar mais desejado" | Manter | — | — | — | — |
| S7 | Polaroids "Registros de momentos reais" | Manter | Prova social escolhida. Cada polaroid passa a linkar para o evento real da casa (C5) | DS Social proof 03 | Casais, datas e fotos reais | Casais atuais |
| S8 | Do blog | Novo | Três posts mais recentes via `GET diterra.com.br/wp-json/wp/v2/posts?per_page=3&_embed` (CORS liberado para a Vercel, capa incluída). Fallback estático com os três posts atuais se a API falhar. Botão "Ler o blog" | DS Blog 01, posição "entre showcase e CTA" | — | Nenhum: dados reais |
| S9 | Contato (formulário longo) | Manter | Segundo nível do funil | — | Destino | — |
| S10 | Encerramento "Pronto para começar?" | Manter | CTA passa a "Agendar visita" | — | — | — |

---

## 3. Espaços `/social/espacos`

| # | Seção | Veredito | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|---|
| E1 | Título e "Cada casa recebe um tipo de festa" | Manter | — | — | — | — |
| E2 | Quatro cards | Ajustar | Ganha uma linha "até N convidados sentados". A página diz que a escolha do espaço é a primeira decisão; sem escala não dá para decidir | DS card 06 (ficha) | Capacidades | Tabela G6 |
| E3 | CTA final | Manter | Rótulo "Agendar visita" | — | — | — |

---

## 4. Página de casa (×4) `/social/espacos/{casa}`

| # | Seção | Veredito | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|---|
| C1 | Hero | Ajustar | Foto demo `espacos/{casa}-amplitude` em tela cheia. Sem vídeo (não há por casa) | SH hero full-bleed | Foto real | Demo |
| C2 | Texto de abertura (2 parágrafos) | Manter | Já está no tamanho SH | — | — | — |
| C3 | Ficha "Números e estrutura" | Ajustar | Mock da tabela G6, sai o aviso, entra a linha "Distância de São Paulo: 165 km · 1h40 pela Rod. dos Bandeirantes" | DS Stats 02; lacuna SH | Todos os números | G6 |
| C4 | "O que este espaço oferece" | Manter | — | — | — | — |
| C5 | Evento real | Novo | Um casal por casa, narrativa de 100 a 150 palavras (como o dia correu, do entardecer à madrugada), número de convidados, galeria de 12 a 16 fotos em lightbox, crédito do fotógrafo. Sem lista de fornecedores | SH case study (narrativa + galeria) | Evento real, autorização do casal, fotos, crédito | Ver tabela abaixo |
| C6 | "Momentos na Di Terrá" | Ajustar | Hoje vazia. Recebe as 5 fotos de percurso da casa (chegada → saída), que mostram o espaço sem festa | DS Showcase 01 | Fotos reais | `demo/percurso/{casa}-*` |
| C7 | "Os outros espaços" | Manter | — | — | — | — |
| C8 | CTA | Manter | Abre painel com a casa pré-selecionada | — | — | — |

Eventos reais mockados (reaproveitam os casais das polaroids):

| Casa | Casal | Data | Convidados | Fotógrafo (mock) |
|---|---|---|---|---|
| A Querência | Clara e Vitor | jun/24 | 380 | Estúdio Alameda |
| Palacete Monte Alegre | Marina e Téo | abr/25 | 190 | Lume Fotografia |
| Casa Lucca | Ana e Gabriel | fev/25 | 96 | Ateliê Ramos |
| Espaço Terrá | Bruna e Caio | nov/24 | 520 | Casa Norte Filmes |

Galeria: `demo/galeria/*`, `demo/eventos/casamento*`, `demo/percurso/{casa}-*`; gerar o que faltar no mesmo estilo.

---

## 5. Soluções `/social/solucoes`

| # | Seção | Veredito | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|---|
| L0 | Página inteira | Manter | Rótulo do CTA vira "Agendar visita" | — | — | — |

---

## 6. Página de solução (×5) `/social/solucoes/{solucao}`

| # | Seção | Veredito | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|---|
| L1 | Hero | Ajustar | Coquetelaria recebe vídeo `coquetelaria`; demais mantêm foto demo `solucoes/*` | G5 | Vídeo e fotos reais | Demo |
| L2 | Texto de abertura | Manter | — | — | — | — |
| L3 | Lista "Do planejamento à desmontagem" | Manter | — | — | — | — |
| L4 | Como funciona (etapas) | Novo | Três ou quatro etapas com foto (`demo/passos/*`), do primeiro encontro ao dia. A página hoje termina numa lista e não conta o processo | DS How it works 01; SH três pilares | Processo real de cada frente | Ver abaixo |
| L5 | "Momentos na Di Terrá" | Ajustar | Recebe 4 a 6 fotos demo da frente | DS Showcase | Fotos reais | Demo |
| L6 | "As outras soluções" | Manter | — | — | — | — |
| L7 | CTA | Manter | — | — | — | — |

Etapas mockadas:

- Gastronomia: degustação com os noivos → menu fechado → prova de serviço → dia da festa.
- Decoração: briefing e moodboard → projeto → prova de mesa → montagem na véspera.
- Coquetelaria: carta de drinks → degustação → bar montado no dia.
- Produção: cronograma → alinhamento de fornecedores → ensaio → operação.
- Tecnologia audiovisual: levantamento técnico → projeto de luz e som → passagem de som → operação.

---

## 7. Corporativo `/corporativo`

Texto aprovado: nenhuma frase muda. Só dados, mídia e componentes transversais.

| # | Seção | Veredito | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|---|
| K1 | Hero | Ajustar | Vídeo `hero-corporativo`; CTA "Agendar visita" | G5 | Vídeo real | Demo |
| K2 | Marcas que escolheram | Manter | 17 logos demo continuam | — | Logos e autorização | Demo |
| K3 | "O enredo de um evento" | Manter | — | — | — | — |
| K4 | Formatos de evento | Manter | — | — | — | — |
| K5 | Operação inteira (5 frentes) | Manter | — | — | — | — |
| K6 | Quatro casas, ficha | Ajustar | Mock G6 nas 20 células | — | Números | G6 |
| K7 | Território | Ajustar | Mock G6 nas 8 células. Opcional: mapa do Google embutido abaixo dos parceiros, sem tocar no texto | DS Footer 02 (mapa) | Distâncias, parceiros, rota | G6 |
| K8 | Depoimentos | Manter | Três fictícios já existentes | — | Depoimentos reais | Existentes |
| K9 | Encerramento e formulário longo | Manter | Botão vira "Agendar visita"; formulário longo permanece | — | Destino | — |
| — | Barra mobile, navbar pílula, rodapé | Transversal | G1, G2, G4 | — | — | — |

---

## 8. Sobre `/sobre` — página nova

Acessível dos dois menus. Uma página só concentra a história para noivos e empresas.

| # | Seção | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|
| A1 | Hero em tela cheia, título "Uma casa que começou em 2009" | Padrão SH de página interna | SH About | Foto real | `demo/apoio/*` |
| A2 | História com assinatura | Texto em primeira pessoa (120 palavras), foto em arco, assinatura manuscrita (único uso da fonte Oooh Baby), três números: desde 2009 · 4 casas · 1.200 eventos | DS About 01 (SH) | História real, nome de quem assina, número de eventos | Texto e números mock |
| A3 | Linha do tempo | 2009 primeira casa · 2014 Palacete · 2019 Espaço Terrá · 2023 frente corporativa · 2025 Casa Lucca | DS About 02 | Datas reais | Mock |
| A4 | Quatro valores | Hospitalidade · Curadoria · Discrição · Operação inteira, 40 palavras cada | SH "The Experience" | — | Texto mock |
| A5 | Território | Bloco foto e texto: "A 1h40 de São Paulo pela Rod. dos Bandeirantes, 12 minutos do centro de Piracicaba", foto `demo/territorio/estrada` | Decisão Q2 rodada 3 | Distâncias | G6 |
| A6 | Equipe | Seis retratos de IA, nome e cargo, sem depoimentos: direção, produção, gastronomia, decoração, comercial social, comercial corporativo | DS About 03 | Equipe real, fotos, autorização | Gerar retratos |
| A7 | CTA "Agendar visita" | — | — | — | — |

---

## 9. Fornecedores `/social/fornecedores` — página nova

Acessível pelo rodapé. Formato: lista editorial por categoria, nome e cidade, sem logo.

| # | Seção | Porquê | Referência | Pendência | Mock |
|---|---|---|---|---|---|
| F1 | Título e abertura | "Uma lista sugerida, não obrigatória. Quem já tem fornecedor de confiança é bem-vindo." (assumido) | DS card 04 (lista editorial, kobu) | Política real: lista fechada, sugerida ou livre | Texto |
| F2 | Lista por categoria | Fotografia · Filme · Música e DJ · Cerimonial e assessoria · Beleza · Papelaria e convites. Três a quatro nomes por categoria com cidade | — | Nomes reais e autorização | "Estúdio Alameda · Piracicaba" etc. |
| F3 | Como funciona com fornecedor externo | Três linhas: cadastro prévio, alinhamento com a produção, acesso e horários | — | Regras reais | Texto |
| F4 | CTA "Agendar visita" | — | — | — | — |

---

## Fora do escopo desta rodada (decidido)

Preço e pacotes · Imprensa · FAQ · Newsletter · Loja · Planta baixa · Página "Como chegar" (o conteúdo vai para fichas, Sobre e Território) · Edição do texto do Corporativo · Mudança de cores ou tipografia · Destino dos formulários · Depoimentos individuais da equipe · Faixa de citações no Social · Capacidade no menu.

---

## Pendências consolidadas para a Di Terrá

**Dados dos espaços**: capacidades sentado e em pé, área coberta, jardim ou terreno, vagas, suíte, auditório e salas de apoio das quatro casas.
**Território**: distância e tempo de SP e de Viracopos, hospedagem parceira com distâncias, transfer.
**Contato**: número de WhatsApp do Social, e-mail oficial do Social, endereço completo, handle do Instagram, horário de visitas, destino dos formulários.
**Eventos reais**: um casal por casa com autorização, data, número de convidados, fotos e crédito do fotógrafo.
**Sobre**: história real, quem assina, datas da linha do tempo, número de eventos, equipe com fotos e autorização.
**Fornecedores**: política (fechada, sugerida ou livre), lista com autorização, regras para externo.
**Corporativo**: logos com autorização, depoimentos reais.
**Mídia**: fotos reais por casa e por solução, vídeo real dos espaços, fotos de percurso.
**Decisões**: navbar pílula versus barra atual após comparação.

---

## Ordem dos PRs

| # | Branch | Escopo | Depende de |
|---|---|---|---|
| 1 | `feat/navbar-pilula` | G1 como alternativa por `?nav=pilula`, dropdown do blog com API | — |
| 2 | `feat/portal-enriquecido` | P2, P3, P4 (rodapé novo G4 vira componente compartilhado) | — |
| 3 | `feat/casas-ficha-evento-real` | G6 no gerador, C1, C3, C5, C6, E2 | — |
| 4 | `feat/pagina-sobre` | A1 a A7, entradas nos menus | 2 (rodapé) |
| 5 | `feat/solucoes-etapas` | L1, L4, L5 | — |
| 6 | `feat/blog-social` | S8 com API real e fallback | — |
| 7 | `feat/fornecedores` | F1 a F4, link no rodapé | 2 |
| 8 | `feat/visita-e-mobile` | G3 painel, G2 barra, troca de rótulo dos CTAs, S4/S5/S10/C8/K9 | — |
| 9 | `feat/video-heroes` | G5 em S1, K1, L1 (coquetelaria); G6 no Corporativo (K6, K7) | — |

Cada PR é pequeno, revisável e reversível. Nenhum toca texto do Corporativo.
