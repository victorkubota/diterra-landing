# Plano de implementação — Site Di Terrá Eventos

Protótipo de avaliação. Cobre a página de entrada (bifurcação Social / Corporativo),
a home social existente e a página corporativa com identidade visual própria.

Base documental: *Mapa de Estrutura de Páginas — Site Di Terrá Eventos* e
*Di Terrá Corporativo — Guia da Marca V0 (dez/2025)*.

---

## 1. Arquitetura de URLs

```
/                          página de entrada, bifurcação Social / Corporativo
/social/                   home social
/social/espacos/           hub dos espaços
/social/espacos/*.html     4 páginas de espaço
/social/solucoes/          hub das soluções
/social/solucoes/*.html    5 páginas de solução
/corporativo/              página única com menu de ancoragem (ID visual própria)
/assets/                   imagens compartilhadas
/assets/brand/             marca, ornamentos e fotografia dos brandbooks
/tools/gerar-paginas.py    gerador das 11 páginas internas
```

As páginas internas do social são geradas por template:

```bash
python3 tools/gerar-paginas.py
```

Conteúdo, ficha técnica e imagens ficam nos dicionários `ESPACOS` e `SOLUCOES`
do script. Um ajuste de layout muda as 11 páginas de uma vez.

A bifurcação existe **somente na raiz**. Não há redirect, gate ou interstitial em
`/social/*` e `/corporativo/*`: quem chega por busca orgânica, campanha paga ou link
direto entra na página final sem clique intermediário.

### Escopo desta entrega

| Item | Decisão | Status |
|---|---|---|
| Bifurcação Social / Corporativo | Apenas as duas opções, sem terceira via | Implementado |
| Deep links fora da splash | Nenhum gate nas rotas internas | Implementado |
| Splash como página indexável | H1, texto, links crawláveis, JSON-LD | Implementado |
| Memória da escolha (localStorage) | Fora de escopo nesta fase | Não implementado |
| Rastreamento GA4/GTM na bifurcação | Fora de escopo nesta fase | Não implementado |
| Corporativo em página única | Mantido conforme briefing | Implementado |
| Espaços no lado corporativo | Ficha técnica por casa | Implementado |
| Plano de redirects 301 | Ver `mapa-redirects.md` e `vercel.json` | Implementado |
| Páginas ausentes (LGPD, obrigado, 404) | Fora de escopo nesta fase | Não implementado |
| Blog | Será transposto do site atual | Não implementado |
| Contato segmentado por público | Formulário B2B só no corporativo | Parcial |

---

## 2. Página de entrada

Split 50/50 no desktop, empilhado no mobile. Cada painel carrega a linguagem do seu
universo: o social em verde profundo e dourado, o corporativo em azul-marinho e azul
da marca corporativa.

**Por que não é apenas uma tela.** A raiz do domínio é a URL com mais autoridade do
site e precisa continuar rankeando para a marca. Por isso a página tem `<h1>` real,
descrição, rodapé com links rastreáveis para espaços, soluções e seções do corporativo,
e `Organization` em JSON-LD declarando as duas divisões.

**Marca na bifurcação.** A splash assina como **Di Terrá** (marca-mãe), com o subtítulo
"Casamentos, debutantes e aniversários | Corporativo". Cada painel identifica a divisão.
Esta é uma proposta: o Guia da Marca V0 não define a regra de coexistência entre
Di Terrá Eventos e Di Terrá Corporativo, e essa regra precisa ser formalizada.

**Motion.** Entrada com fade e deslocamento vertical; no hover, escala da fotografia e
expansão da linha do CTA. Apenas `transform`, `opacity` e `filter`. `prefers-reduced-motion`
desliga tudo.

---

## 3. Página corporativa

Página única com menu de ancoragem, conforme o briefing.

| Âncora | Seção | Origem do conteúdo |
|---|---|---|
| `#manifesto` | O enredo de um evento que acontece por inteiro | Guia da Marca, p.13 |
| — | Números da operação | A preencher |
| `#formatos` | Convenções, off-sites, lançamentos, integrações, celebrações, alinhamentos | Guia da Marca, p.14 |
| `#espacos` | Quatro casas com ficha técnica corporativa | Novo |
| `#estrutura` | Tudo em um só lugar + cinco soluções | Guia da Marca, p.15 |
| `#territorio` | Quando o interior vira destino corporativo | Guia da Marca, p.16 |
| `#proposta` | Formulário B2B | Guia da Marca, p.17 |

### Espaços na versão corporativa

Cada casa (A Querência, Casa Lucca, Palacete Monte Alegre, Espaço Terrá) recebe ficha
técnica com auditório, banquete, área coberta, salas de apoio e estacionamento.

**Nenhum número foi estimado.** Todos os campos aparecem como "a confirmar", marcados
visualmente, com aviso explícito na seção. Capacidade de espaço é dado comercial: um
número errado no site vira problema de contrato.

### Formulário

Campos: nome, empresa, e-mail corporativo, telefone, formato do evento, faixa de
participantes, janela de data, espaço de interesse, descrição. Sem endpoint conectado.
O lead corporativo deve ser roteado para o comercial B2B, separado do fluxo social.

---

## 3b. Marca aplicada, a partir dos arquivos oficiais

Os arquivos de marca entregues (`diterra-social-download` e
`diterra-corporativo-download`) substituíram todos os improvisos anteriores.

### Tipografia, agora conforme os manuais

| Universo | Manual | Aplicado |
|---|---|---|
| Social | Channe, Oooh Baby, Albert Sans (BRANDBOOK v2, p.8) | Albert Sans no corpo, Oooh Baby nos acentos, Cormorant Garamond substituindo Channe |
| Corporativo | Albert Sans (Guia V0, p.11) | Albert Sans no corpo, Cormorant Garamond no display |

A home social usava Cormorant Garamond e **Jost**, que não existe em nenhum dos
manuais. Foi trocada por Albert Sans, que é a fonte de texto dos dois brandbooks
e veio nos arquivos (`TIPOGRAFIA/*.ttf`).

**Channe é o único bloqueio tipográfico.** É licenciada e não veio nos arquivos.
Está declarada em primeiro lugar na pilha (`--font-display: 'Channe', 'Cormorant
Garamond', ...`), então basta hospedar o woff2 para que assuma sozinha, sem
tocar em CSS.

### Paleta social corrigida

A home usava creme, verde-petróleo e dourado, que não constam do brandbook.
Agora segue a p.6: azul royal `#111542`, rosa baby `#f4bfb3`, bege marfim
`#fefae0`, marrom tijolo `#c67139`.

### Marca e ícones

| Uso | Arquivo |
|---|---|
| Header social | `social-wordmark-white.png` |
| Rodapé social | `social-lockup-white.png` |
| Header corporativo | `corp-horizontal-white.png` |
| Rodapé corporativo | `corp-lockup-white.png` |
| Favicon social / corporativo | `favicon-social.png` / `favicon-corp.png` |

O SVG reconstruído à mão do símbolo em arco foi removido: agora as duas marcas
usam os PNGs oficiais. Todos os arquivos tiveram a margem transparente recortada,
senão o logo aparecia minúsculo dentro de uma caixa vazia. Os favicons foram
gerados a partir do símbolo isolado de cada marca.

**A pendência de lockup horizontal está resolvida:** os arquivos incluem versão
horizontal para os dois universos, que é a usada no header.

### Ornamentos e fotografia

Os ramos e flores em linha do brandbook social entraram como elemento gráfico
nas seções internas. As cinco fotografias limpas dos arquivos de marca
substituíram, nos heros, as imagens do site atual que têm lettering queimado.

---

## 4. Camada digital do Guia da Marca

O manual V0 entrega marca, paleta, tipografia e storytelling, mas não cobre web.
O que foi definido aqui, em `corporativo/corporativo.css`, é **proposta a validar**:

### Semântica de cor

O manual lista doze cores sem indicar função. Os papéis foram atribuídos assim:

| Token | Valor | Papel |
|---|---|---|
| `--ui-bg` | `#f5f1e8` | fundo padrão |
| `--ui-text` | `#1e325c` | texto |
| `--ui-action` | `#1e325c` | botão primário |
| `--ui-accent` | `#0094dc` | títulos grandes, linhas, ícones |
| `--blue-300` | `#7fc4ec` | acento sobre fundo escuro (fora do manual) |

### Contraste

| Combinação | Contraste | WCAG AA |
|---|---|---|
| `#1e325c` sobre branco | 12,6:1 | passa |
| branco sobre `#1e325c` | 12,6:1 | passa |
| branco sobre `#0094dc` | 3,3:1 | **reprova** em texto normal |
| `#1e325c` sobre `#0094dc` | 3,3:1 | **reprova** em texto normal |
| `#7fc4ec` sobre `#1e325c` | 7,4:1 | passa |

Consequência prática: **o botão primário é azul-marinho, não azul**. O azul `#0094dc`
fica restrito a títulos acima de 24px, linhas e ícones. Foi criado `#7fc4ec` para uso
sobre fundo escuro, porque nenhum tom do manual atende AA nessa condição.

### Tipografia

Albert Sans conforme manual. Cormorant Garamond entra apenas em display: é a ponte
com o logotipo serifado e com a marca-mãe. O manual só especifica corpo de texto
impresso (17pt / 120%), então a escala responsiva foi construída aqui.

### Elemento gráfico

O símbolo da janela em arco virou sistema: máscara de imagem nos cards de espaço e na
foto da seção de território. O manual trata o símbolo apenas como parte do logotipo.

### Fotografia

O banco atual é quente, romântico e voltado ao social. Aplicado duotone
(`grayscale` + `mix-blend-mode: luminosity` sobre azul-marinho) para alinhar a
fotografia à paleta corporativa. É contenção, não solução: o corporativo precisa de
ensaio fotográfico próprio.

---

## 5. Pendências para produção

**Bloqueadores de marca**
1. ~~SVG oficial do símbolo em arco~~ resolvido: PNGs oficiais em `assets/brand/`.
   Ainda vale pedir os SVG para nitidez em telas grandes.
2. ~~Lockup horizontal e assinatura reduzida~~ resolvido: os arquivos entregues
   trazem versão horizontal para os dois universos.
3. ~~Favicon~~ resolvido: gerado a partir do símbolo de cada marca. Falta o ícone
   de aplicativo em múltiplos tamanhos.
4. **Licença da fonte Channe** e o arquivo woff2. É a única fonte do brandbook
   social que não veio; hoje roda com Cormorant Garamond como substituta.
5. Regra de coexistência entre Di Terrá Eventos e Di Terrá Corporativo.
6. Direção de arte fotográfica corporativa. As fotos entregues são todas de
   eventos sociais.

**Bloqueadores de conteúdo**
6. Ficha técnica real das quatro casas.
7. Números da operação (eventos por ano, capacidade máxima, anos de atuação).
8. Distância de São Paulo, aeroporto e hospedagem na região.
9. Fotografia sem lettering queimado. As fotos atuais têm texto gravado no rodapé e
   logos de terceiros no topo, contornados por recorte via CSS.

**Bloqueadores técnicos**
10. Endpoint do formulário e roteamento do lead corporativo.
11. Confirmação dos destinos de `/escolar` e `/meia_lua` (ver `mapa-redirects.md`).
12. Decisão sobre canônica entre a LP corporativa de mídia paga e `/corporativo`.

**Fora de escopo desta fase, previstos no mapa original**
13. Mini homes de Espaços e Soluções.
14. Subpáginas de espaços e soluções do lado social.
15. Blog, política de privacidade, página de agradecimento, 404.
16. As 4 landing pages por assunto.

---

## 6. Como rodar

```bash
npx serve diterra-deploy -l 8081
```

Ou via preview configurado em `.claude/launch.json` (entrada `diterra-deploy`).
