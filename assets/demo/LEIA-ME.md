# Assets de demonstração

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
