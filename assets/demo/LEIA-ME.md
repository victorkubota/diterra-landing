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
