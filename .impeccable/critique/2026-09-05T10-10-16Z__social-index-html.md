---
target: site diterra-landing após os 10 PRs, alvo social/index.html
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/Users/outsmartdigital/Desktop/Claude/projects/diterra-landing/social/index.html"
target_fingerprint: "sha256:dfedf77311bcabf3c4b38a15f1164b37b9bd3470c7f98cbb7fb9012260d98dd9"
target_path: /Users/outsmartdigital/Desktop/Claude/projects/diterra-landing/social/index.html
timestamp: 2026-09-05T10-10-16Z
slug: social-index-html
---
⚠️ DEGRADED: single-context (re-critique após os 10 PRs, no mesmo contexto)

Alvo representativo: social/index.html (crítica cobre as 14 rotas). Comparação com o snapshot de 2026-09-05T06-26-28Z (18/32).

## Design Health Score (Persuade; 7 e 10 n/a)
| # | Heurística | Score | Key Issue |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | formulários com 4 estados; régua; pausa da faixa. Falta endpoint real |
| 2 | Mundo real | 3 | "O grupo" segue como rótulo da intro |
| 3 | Controle | 3 | sem Lenis; Esc; rodízio pausa; pausa visível nos logos |
| 4 | Consistência | 4 | um sistema nas 14 rotas; cleanUrls; switch compartilhado |
| 5 | Prevenção de erro | 3 | validação inline e autocomplete; data ainda em texto livre |
| 6 | Reconhecimento | 3 | gaveta com miniaturas; raiz ainda esconde a nav |
| 7 | Flexibilidade | n/a | landing |
| 8 | Estética | 4 | home social sem preloader/noise/AOS/GSAP; quatro casas reais |
| 9 | Recuperação | 3 | erros nomeiam problema e saída (WhatsApp) |
| 10 | Ajuda | n/a | landing |
| Total | | 26/32 | Bom (81%) |

## Priority Issues restantes
- [P2] Telefone da home social é placeholder (99999-9999); a barra de ação social só leva ao contato → conteúdo
- [P2] Formulários sem endpoint: abrem o e-mail do visitante (dito na confirmação) → técnico
- [P2] Eyebrows dos heros social/corporativo mantidos por decisão de composição do cliente → revisar com o cliente
- [P3] Rótulos em caixa alta acima de 30 caracteres na raiz e na home → clarify

## Audit (re-run)
A11y 3 · Perf 3 · Responsivo 4 · Theming 4 · Integridade 3 → 17/20 (Bom). Detector: 18 achados (de 428), todos rótulos/eyebrows/breadcrumbs.
