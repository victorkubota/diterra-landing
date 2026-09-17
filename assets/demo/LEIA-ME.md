# Assets de demonstração

## 15/09/2026 — dezesseis arquivos já são fotografia oficial da cliente

Vieram da pasta "home" compartilhada pela Di Terrá em 14/09/2026 e substituem
a imagem gerada por IA que ocupava o lugar. O aviso abaixo continua valendo
para todo o resto da pasta.

| Arquivo | Origem no Drive | Crédito |
| --- | --- | --- |
| `espacos/a-querencia-amplitude.webp` · `-vertical.webp` | nossos espaços | @dayaneankosqui_photo |
| `espacos/palacete-monte-alegre-amplitude.webp` · `-vertical.webp` | nossos espaços | @jaisonsampaio |
| `espacos/casa-lucca-amplitude.webp` · `-vertical.webp` | nossos espaços | @cadubritofotografia |
| `espacos/espaco-terra-amplitude.webp` · `-vertical.webp` | nossos espaços | @fernandoremediofotografia |
| `solucoes/gastronomia.webp` | bloco serviços / gastronomia | sem crédito informado |
| `solucoes/decoracao.webp` | bloco serviços / decoração | sem crédito informado |
| `solucoes/coquetelaria.webp` | bloco serviços / coquetelaria | sem crédito informado |
| `ocasioes/ocasiao-casamento.webp` | tipos de evento | sem crédito informado |
| `ocasioes/ocasiao-corporativo.webp` | tipos de evento | sem crédito informado |
| `ocasioes/ocasiao-debutante.webp` | tipos de evento | sem crédito informado |
| `ocasioes/ocasiao-aniversario.webp` | tipos de evento (bodas & aniversários) | sem crédito informado |
| `apoio/natureza-cta.webp` | cta pós-serviço (natureza) | sem crédito informado |

Pendências que ficaram desta rodada: a cliente não mandou foto de produção,
tecnologia audiovisual, hero, galeria, percurso, território e depoimentos, e
`espaco-terra` veio em 2048 px (as outras três casas vieram acima de 2900 px).
A página corporativa passa a exibir as mesmas fotos das casas em contexto
social — precisa de uma seleção própria.

## 16/09/2026 — o que as LPs por ocasião deixaram pendente

Entraram `/social/eventos/debutante` e `/social/eventos/bodas-aniversarios`,
que completam a coleção aberta pela LP de casamento. Duas pendências de
acervo ficaram registradas aqui para não se perderem.

**Foto de ocasião por casa.** As quatro casas aparecem nas três LPs com a
mesma fotografia, que é a fotografia oficial de cada casa. Ela descreve a
casa, e não a ocasião: a da Querência mostra um casal diante da capela e a
da Casa Lucca mostra uma mesa longa posta. Numa página de festa de quinze
isso não mente sobre a imagem, mas também não mostra nada de festa de
quinze. Em 16/09 o texto alternativo da Querência deixou de dizer "os
noivos" e passou a dizer "casal" nas oito rotas que usam essa foto, porque
a mesma imagem serve casamento, debutante e bodas. É o que dá para fazer
sem acervo. O conserto de verdade é uma foto de debutante e uma de festa de
família por casa, na próxima sessão fotográfica. Quando elas chegarem, o
alt volta a ser específico por rota.

**Tarja de IA: qual é o alcance.** Hoje a tarja visível
(`<p class="evento__mais">`) cobre a galeria de hospedagem da LP de bodas, e
só ela. Os cartões 04 Produção e 05 Tecnologia audiovisual e o retrato do
depoimento continuam sendo imagem gerada por IA nas três LPs, sem tarja
própria. Isso é decisão, não esquecimento, e vale para as três de uma vez:
a hospedagem leva tarja porque a imagem poderia ser lida como um parceiro
real da região, enquanto o resto está coberto pela linha do rodapé de todas
as catorze rotas ("Protótipo de avaliação. Fotografia ilustrativa e dados
sujeitos a validação."). Se a decisão mudar, ela muda nas TRÊS LPs no mesmo
commit, incluindo a de casamento que já está no ar: tarjar só as páginas
novas criaria incoerência entre rotas irmãs.

## 17/09/2026 — a galeria das LPs de ocasião

As três rotas de `/social/eventos/` ganharam uma galeria de oito fotos, pedida
pela cliente no retorno do dia 17 ("a página de ocasião precisa de um espaço
com mais mídias, como se fosse uma galeria"). O acervo dela sai desta pasta e
por isso entra aqui.

Cada galeria mistura o percurso das quatro casas (`01-chegada` … `05-saida`,
tudo IA) com fotos de apoio (`mesa-posta`, `pista-noite`, `brinde-por-do-sol`,
`propriedade-anoitecer`, também IA). Só as `-amplitude` e `-vertical` das casas
são fotografia da cliente, e elas não entram nesta seleção porque já aparecem
no bloco das quatro casas, mais acima na mesma página.

Duas regras que a seleção seguiu, e que quem trocar as fotos precisa manter:

1. **Nada de "os noivos" fora do casamento.** Os textos alternativos de
   `05-saida` nomeiam os noivos, então essas fotos só entram na LP de
   casamento. Debutante e bodas usam chegada, coquetel, jantar e pista, que
   servem a qualquer ocasião.
2. **Sem repetir a foto de serviço da mesma página.** `gastronomia`,
   `coquetelaria`, `decoracao`, `producao` e `tecnologia-audiovisual` já são os
   cinco cartões da seção "um contrato": repeti-las na galeria logo abaixo
   entrega o tamanho do acervo.

A galeria NÃO leva tarja de IA, pela mesma decisão registrada acima: a tarja
visível cobre a hospedagem, e o resto está coberto pela linha do rodapé. Se a
decisão mudar, muda nas três LPs e nas quatro páginas de casa no mesmo commit.

## O resto da pasta segue sendo IA

**Estas imagens NÃO são as casas da Di Terrá.** São cenários gerados por IA
(Higgsfield · Nano Banana Pro 2K e Seedance 2.5) a partir da descrição textual
de cada espaço, para a discussão de layout sair do abstrato na apresentação.

Nenhuma pode ir para produção: um cliente que visita A Querência e não reconhece
nada do que viu no site é problema comercial, e anunciar um espaço com imagem de
outro lugar é propaganda enganosa. São substituídas na íntegra pela sessão
fotográfica da Di Terrá.

## Estas imagens agora estão no ar nas catorze rotas

Até 04/09/2026 elas viviam só nesta pasta e as páginas usavam nove arquivos
legados de marketing — peças com texto queimado no pixel ("COQUETELARIA",
"PRODUÇÃO"), um frame de player de vídeo com botão de play falso servindo de
hero do Espaço Terrá, e um PNG com ilustração floral laranja e moldura
embutidas. Foram trocadas por estas, que ao menos são fotográficas e têm
2400px.

Isso não afrouxa nada do aviso acima: aumenta a urgência. O que antes era um
problema de layout agora é o que o visitante vê.

## Pendências antes de qualquer publicação

- Substituir todos os arquivos desta pasta por fotografia real. Depois,
  rodar `tools/otimizar-imagens.py --limpar` e `tools/aplicar-srcset.py`
  para regenerar as variantes em `assets/opt/`.
- ~~Recomprimir `hero/*.mp4`~~ feito em 05/09/2026: os HEVC originais
  saíram do repositório; os H.264 de 1920 e 1280 px vivem em
  `assets/opt/video/` (1,3 MB e 1,0 MB no social, 0,75 MB e 0,4 MB no
  corporativo). O celular segue com o poster.
- Preencher os 26 campos marcados "a confirmar" na página corporativa.

Gerado em 23/08/2026. Inventário completo do que ainda falta: ver o documento
de mídia entregue junto com esta rodada.
