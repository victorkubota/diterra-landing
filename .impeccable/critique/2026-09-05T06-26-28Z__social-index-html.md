---
target: site diterra-landing (14 rotas), alvo social/index.html
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:/Users/outsmartdigital/Desktop/Claude/projects/diterra-landing/social/index.html"
target_fingerprint: "sha256:d6ae11acc6e66987790a499839b419549c8140686ebb447b8fde9f3180a0a959"
target_path: /Users/outsmartdigital/Desktop/Claude/projects/diterra-landing/social/index.html
timestamp: 2026-09-05T06-26-28Z
slug: social-index-html
---
⚠️ DEGRADED: single-context (Assessment A e B rodaram no mesmo contexto)

Alvo representativo do site: social/index.html (crítica cobre as 14 rotas; plano completo em docs/plano-melhorias-impeccable.md).

## Design Health Score (Persuade; 7 e 10 n/a)
| # | Heurística | Score | Key Issue |
|---|---|---|---|
| 1 | Visibilidade do estado | 2 | formulários sem estado |
| 2 | Mundo real | 3 | "O Grupo" na nav |
| 3 | Controle | 3 | Lenis sequestra scroll |
| 4 | Consistência | 2 | home social diverge das 13 rotas; links .html |
| 5 | Prevenção de erro | 1 | novalidate, data livre, sem endpoint |
| 6 | Reconhecimento | 3 | raiz esconde nav |
| 7 | Flexibilidade | n/a | landing |
| 8 | Estética | 3 | preloader, noise, AOS, stack |
| 9 | Recuperação | 1 | nenhuma mensagem de erro |
| 10 | Ajuda | n/a | landing |
| Total | | 18/32 | Aceitável (56%) |

## Priority Issues
- [P1] Home social 10,9 MB + preloader 3s + 5 scripts em 3 CDNs → /impeccable optimize
- [P1] Conteúdo nasce invisível (.rise/.reveal-shot/.linhas/.cascata opacity:0 sem gate .js) → /impeccable polish
- [P1] Home social divergente (nav, btn, rodapé, fontes, reveal, links .html) → /impeccable polish, /impeccable layout
- [P1] Formulários sem validação/sucesso/erro/endpoint → /impeccable polish
- [P2] Contraste .tbd tijolo/rosa 2,2:1 em 11 páginas; rótulos 10,5px; 9,5px na raiz → /impeccable polish
- [P2] "Espaços que Inspiram" mostra ambientes genéricos, não as 4 casas → /impeccable bolder
- [P3] Motion sem tese na home social → /impeccable animate

## Persona Red Flags
Jordan: 3s de preloader; formulário sem confirmação. Casey: 11 MB; card stack sticky 85vh no celular; CTA fora do polegar; WhatsApp só no corp. Riley: dois URLs por casa; "Corporativos" no grid social; depoimentos fictícios perto de logos reais.

## Minor
design-system.html obsoleto (Jost/teal); alt dos logos; reduced-motion global .01ms; eyebrow chips nos 3 heros; transições de layout em nav e reel.

## Questions
Por onde começar? Manter GSAP/Lenis na home? Overdrive A/B/C? Escopo 10 PRs ou só P1?
