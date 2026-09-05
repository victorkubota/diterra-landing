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

## Rodada de 05/09/2026 (benchmarks)

Mais 39 imagens e um vídeo gerados no Higgsfield (Nano Banana Pro 2k e
Seedance 2.5), para o cliente ver o comportamento das seções antes de
fornecer a fotografia real:

- `ocasioes/ocasiao-*.webp`: 4 horizontais (casamento, debutante,
  aniversário, formatura) para a pilha da home social.
- `percurso/<casa>-0N-*.webp`: 5 retratos por casa (chegada, cerimônia,
  coquetel, festa, saída) para o percurso das páginas de casa.
- `passos/<solucao>-N.webp`: 3 horizontais por solução para "Como
  acontece"; `passos/coquetelaria-video-poster.webp` e
  `assets/opt/video/coquetelaria-1280.mp4` (5 s) para o vídeo em cartão.
  O clipe de gastronomia não foi gerado por falta de créditos.

Vale o mesmo aviso: nada disto é a Di Terrá. Ao trocar, manter os
nomes de arquivo e rodar os dois scripts de `tools/`.

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
