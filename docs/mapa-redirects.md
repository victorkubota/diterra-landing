# Mapa de redirects — migração do site atual

Origem das URLs: links internos extraídos do HTML do site em produção
(`diterra.com.br`, WordPress). Toda URL que hoje recebe tráfego precisa de 301 para o
equivalente mais próximo na nova estrutura. Redirect ausente vira 404, e 404 em página
que rankeia significa perda direta de tráfego orgânico.

Implementação em `vercel.json` (301 no edge, `permanent: true`).

---

## Espaços

| URL atual | Destino nesta fase | Destino final (mapa completo) |
|---|---|---|
| `/fazendaquerencia` | `/social#espacos` | `/social/espacos/a-querencia` |
| `/palacetemontealegre` | `/social#espacos` | `/social/espacos/palacete` |
| `/casa-lucca` | `/social#espacos` | `/social/espacos/casa-lucca` |
| `/espaco-terra` | `/social#espacos` | `/social/espacos/espaco-terra` |
| `/meia_lua` | `/social#espacos` | **a confirmar** |

`/meia_lua` não corresponde a nenhuma das quatro casas do mapa. Se for um salão interno
de um dos espaços, o destino correto é a página daquela casa.

## Soluções

| URL atual | Destino nesta fase | Destino final |
|---|---|---|
| `/gastronomia/` | `/social#eventos` | `/social/solucoes/gastronomia` |
| `/alta-confeitaria/` | `/social#eventos` | `/social/solucoes/gastronomia` |
| `/banquete-3/` | `/social#eventos` | `/social/solucoes/gastronomia` |
| `/coquetel/` | `/social#eventos` | `/social/solucoes/coquetelaria` |
| `/bar/` | `/social#eventos` | `/social/solucoes/coquetelaria` |
| `/decoracao/` | `/social#eventos` | `/social/solucoes/decoracao` |

Três URLs de gastronomia e duas de coquetelaria convergem para uma página cada. É a
consolidação prevista no mapa (LP por assunto em vez de LP por espaço). Consolidar
concentra autoridade, mas some com termos de cauda longa: se `/alta-confeitaria`
rankeia hoje para busca própria, a nova página de gastronomia precisa cobrir o tema
em uma seção com título próprio.

## Corporativo

| URL atual | Destino nesta fase | Destino final |
|---|---|---|
| `/espaco-para-evento-corporativo/` | `/corporativo` | `/corporativo` |
| `/auditorio/` | `/corporativo#espacos` | `/corporativo#espacos` |

`/espaco-para-evento-corporativo/` é a URL corporativa que já acumula histórico de
busca. É o redirect mais sensível da migração: o destino precisa estar no ar antes de
a URL antiga sair.

## Demais

| URL atual | Destino nesta fase | Destino final |
|---|---|---|
| `/contato` | `/social#contato` | `/social/contato` |
| `/blog` | `/social` | `/social/blog` |
| `/escolar/` | `/social` | **a confirmar** |
| `/` | mantém | `/` (página de entrada) |

`/escolar` provavelmente trata de formaturas. O mapa não prevê destino para o tema.
Duas saídas: incluir formaturas na LP de debutantes/aniversários, ou criar uma quinta LP.

---

## Checklist de corte

1. Publicar a nova estrutura completa antes de apontar o domínio.
2. Aplicar os 301 na mesma janela da troca. Redirect em cadeia (301 para 301) dilui
   autoridade: cada URL antiga deve apontar direto ao destino final.
3. Manter os redirects por no mínimo 12 meses.
4. Enviar o novo sitemap.xml no Search Console e solicitar reindexação das URLs
   consolidadas.
5. Monitorar Cobertura no Search Console por 30 dias. Pico de 404 significa URL de
   origem fora deste mapa.
6. Conferir links externos apontando para URLs antigas (Instagram, Google Meu Negócio,
   diretórios de fornecedores de casamento, portais de eventos).
7. Preservar os caminhos de `/wp-content/uploads/` ou redirecionar as imagens que
   rankeiam em busca por imagem.

## Pendências

- Confirmar destino de `/meia_lua` e `/escolar`.
- Levantar URLs que não aparecem na navegação: posts do blog, páginas órfãs, páginas
  de campanha. Este mapa cobre apenas o que está linkado no HTML da home.
- Exportar a lista completa de URLs indexadas do Search Console e cruzar com esta
  tabela antes do corte.
