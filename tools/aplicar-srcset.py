#!/usr/bin/env python3
"""Reescreve <img> das páginas principais com <picture>, srcset e sizes.

Para cada <img src="/assets/…"> cuja origem tem variantes em assets/opt
(geradas por tools/otimizar-imagens.py), o elemento vira:

    <picture>
      <source type="image/avif" srcset="… 800w, … 1400w" sizes="…">
      <img src="/assets/opt/<nome>-1400.webp" srcset="… 800w, …" sizes="…" …atributos originais…>
    </picture>

Os atributos originais (alt, width, height, id, class, style, loading,
fetchpriority, decoding) são preservados. Imagens sem fetchpriority="high"
ganham loading="lazy" e decoding="async" quando não têm.

A medida (sizes) vem de SIZES, indexada por página e por trecho do caminho.
Idempotente: uma <img> que já está dentro de <picture> não é tocada.

Uso:
    python3 tools/aplicar-srcset.py
"""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
OPT = RAIZ / "assets" / "opt"

PAGINAS = ("index.html", "social/index.html", "corporativo/index.html") + tuple(
    str(p.relative_to(RAIZ)) for p in sorted((RAIZ / "social").rglob("*.html")) if p != RAIZ / "social" / "index.html")

CHEIA = "100vw"
METADE = "(min-width: 940px) 50vw, 100vw"

# (página, trecho do src) -> sizes. A primeira regra que casa vence;
# sem regra, a imagem é tratada como tela cheia.
SIZES: list[tuple[str, str, str]] = [
    ("social/index.html", "solucoes/decoracao", METADE),                              # intro
    ("social/index.html", "espacos/", METADE),                                          # as quatro casas
    ("social/index.html", "eventos/", "(min-width: 1025px) 25vw, (min-width: 481px) 50vw, 100vw"),
    ("social/index.html", "apoio/offsite", "(min-width: 1025px) 25vw, (min-width: 481px) 50vw, 100vw"),
    ("social/index.html", "CASAMENTO", "(min-width: 1025px) 25vw, (min-width: 481px) 50vw, 100vw"),
    ("social/index.html", "ANIVERSARIO", "(min-width: 1025px) 25vw, (min-width: 481px) 50vw, 100vw"),
    ("social/index.html", "galeria/propriedade", "(min-width: 1025px) 66vw, (min-width: 481px) 50vw, 100vw"),
    ("social/index.html", "galeria/", "(min-width: 1025px) 34vw, (min-width: 481px) 50vw, 100vw"),
    ("social/index.html", "apoio/numeros", CHEIA),
    ("corporativo/index.html", "apoio/offsite", "(min-width: 900px) 62vw, 100vw"),   # manifesto
    ("corporativo/index.html", "formatos/", CHEIA),
    ("corporativo/index.html", "apoio/numeros", CHEIA),
    ("corporativo/index.html", "solucoes/", "(min-width: 1000px) 27vw, (min-width: 640px) 42vw, 74vw"),
    ("corporativo/index.html", "espacos/", METADE),
    ("corporativo/index.html", "territorio/estrada", "(min-width: 900px) 62vw, 100vw"),
    ("corporativo/index.html", "territorio/", "(min-width: 1000px) 25vw, 30vw"),
    # internas (social/espacos/*, social/solucoes/*): hero, bloco editorial,
    # galeria e cards das outras casas
    ("social/", "brand/foto-", "(min-width: 900px) 50vw, 100vw"),
    ("social/", "espacos/", "(min-width: 1040px) 33vw, (min-width: 680px) 50vw, 100vw"),
    ("social/", "solucoes/", "(min-width: 860px) 25vw, 50vw"),
]

IMG_RE = re.compile(r"<img\b([^>]*?)>", re.S)
SRC_RE = re.compile(r'\bsrc="(/assets/[^"]+)"')
OPT_RE = re.compile(r"/assets/opt/(.+?)-\d+\.(?:avif|webp)$")
PICTURE_RE = re.compile(r"<picture><source[^>]*>(<img\b[^>]*?>)</picture>", re.S)
GERADOS_RE = re.compile(r'\s+(?:srcset|sizes)="[^"]*"')


def variantes(stem: str, formato: str) -> list[tuple[int, Path]]:
    achados = []
    for arq in OPT.glob(f"{stem}-*.{formato}"):
        largura = arq.stem.rsplit("-", 1)[-1]
        if largura.isdigit():
            achados.append((int(largura), arq))
    return sorted(achados)


def srcset(vs: list[tuple[int, Path]]) -> str:
    return ", ".join(f"/assets/opt/{p.name} {w}w" for w, p in vs)


def medida(pagina: str, src: str, atributos: str = "") -> str:
    # o hero de página interna é sempre tela cheia
    if 'fetchpriority="high"' in atributos:
        return CHEIA
    for pag, trecho, sizes in SIZES:
        if pagina.startswith(pag) and trecho in src:
            return sizes
    return CHEIA


def reescrever(pagina: str) -> int:
    caminho = RAIZ / pagina
    html = caminho.read_text(encoding="utf-8")
    trocas = 0

    def troca(m: re.Match) -> str:
        nonlocal trocas
        atributos = m.group(1)
        src_m = SRC_RE.search(atributos)
        if not src_m:
            return m.group(0)
        src = src_m.group(1)
        opt_m = OPT_RE.match(src)
        if opt_m:
            # já reescrita numa rodada anterior: refaz a partir das variantes
            # que existem hoje, descartando srcset e sizes antigos
            stem = opt_m.group(1)
            atributos = GERADOS_RE.sub("", atributos)
        else:
            stem = Path(src).stem
        avif = variantes(stem, "avif")
        webp = variantes(stem, "webp")
        if not avif or not webp:
            return m.group(0)

        sizes = medida(pagina, src, atributos)
        # fallback: a maior variante até 1400, ou a única existente
        candidatos = [p for w, p in webp if w <= 1400] or [webp[0][1]]
        fallback = f"/assets/opt/{candidatos[-1].name}"

        novos = atributos.replace(src_m.group(0), f'src="{fallback}"', 1)
        novos = novos.rstrip()
        # sem width/height o navegador não reserva a área e a página pula
        if "width=" not in novos or "height=" not in novos:
            with Image.open(RAIZ / "assets" / "opt" / webp[-1][1].name) as im:
                novos = re.sub(r'\s+(width|height)="[^"]*"', "", novos)
                novos += f' width="{im.width}" height="{im.height}"'
        if 'fetchpriority="high"' not in novos:
            if "loading=" not in novos:
                novos += ' loading="lazy"'
            if "decoding=" not in novos:
                novos += ' decoding="async"'
        novos += f' srcset="{srcset(webp)}" sizes="{sizes}"'
        trocas += 1
        return (
            "<picture>"
            f'<source type="image/avif" srcset="{srcset(avif)}" sizes="{sizes}">'
            f"<img{novos}>"
            "</picture>"
        )

    # <picture> gerados numa rodada anterior voltam a ser <img> simples e
    # passam pela mesma reescrita, para acompanhar as variantes atuais
    desembrulhado = PICTURE_RE.sub(r"\1", html)
    novo = IMG_RE.sub(troca, desembrulhado)
    if novo != html:
        caminho.write_text(novo, encoding="utf-8")
    print(f"{pagina}: {trocas} imagens reescritas")
    return trocas


def main() -> int:
    total = sum(reescrever(p) for p in PAGINAS)
    print(f"total: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
