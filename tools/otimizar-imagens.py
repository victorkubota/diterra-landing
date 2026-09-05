#!/usr/bin/env python3
"""Gera variantes AVIF e WebP responsivas das fotos do site.

Saída em assets/opt/<nome>-<largura>.<avif|webp>. Larguras: 800, 1400 e 2400,
limitadas à largura da origem; origens menores que 2400 também recebem a
própria largura nativa, para nunca ampliar pixel.

Só entram as fotos de assets/demo citadas em algum HTML, CSS ou no gerador
das internas, mais as peças legadas listadas em LEGADAS.

Uso:
    python3 tools/otimizar-imagens.py            # converte o que falta
    python3 tools/otimizar-imagens.py --forcar   # reconverte tudo
    python3 tools/otimizar-imagens.py --limpar   # apaga variantes órfãs

Requer Pillow >= 11.2 com suporte a AVIF (python3 -c "from PIL import features;
print(features.check('avif'))").
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

from PIL import Image, features

RAIZ = Path(__file__).resolve().parent.parent
ASSETS = RAIZ / "assets"
SAIDA = ASSETS / "opt"

LARGURAS = (800, 1400, 2400)
QUALIDADE_AVIF = 52
QUALIDADE_WEBP = 80

# Pastas de demonstração que recebem srcset. Logos e retratos ficam de fora:
# já são pequenos e servidos no tamanho em que aparecem.
PASTAS_DEMO = ("hero", "espacos", "solucoes", "eventos", "formatos", "galeria",
               "apoio", "territorio")

# Peças legadas ainda em uso na home social. Ficam no tamanho nativo porque
# não há pixel para ampliar (o hero tem 1220 px, o banner 500 px).
LEGADAS = (
    "solucao-completa-decoracao-casamento.png",
    "3.png",
    "CASAMENTO-v2.png",
    "ANIVERSARIO-v2.png",
)


# Uma foto conta como usada se algum HTML, CSS ou o gerador cita a origem em
# assets/demo/ OU uma variante já reescrita em assets/opt/<nome>-<largura>.
REF_DEMO_RE = re.compile(r"assets/(?:demo/(?:%s)|brand)/([A-Za-z0-9_-]+)\.(?:webp|jpg)" % "|".join(PASTAS_DEMO))
REF_OPT_RE = re.compile(r"assets/opt/([A-Za-z0-9_-]+?)-\d+\.(?:avif|webp)")


def candidatas() -> dict[str, Path]:
    """nome (stem) -> arquivo de origem, para todas as fotos elegíveis."""
    mapa: dict[str, Path] = {}
    for pasta in PASTAS_DEMO:
        for arq in sorted((ASSETS / "demo" / pasta).glob("*.webp")):
            mapa[arq.stem] = arq
    # fotografia dos arquivos de marca (1800 px), usada nas internas
    for arq in sorted((ASSETS / "brand").glob("foto-*.jpg")):
        mapa[arq.stem] = arq
    for nome in LEGADAS:
        arq = ASSETS / nome
        if arq.exists():
            mapa[arq.stem] = arq
    return mapa


def referenciadas() -> set[str]:
    """Stems citados em HTML, CSS e no gerador; design-system.html fica de
    fora porque documenta um sistema que não está mais no ar."""
    citadas: set[str] = set()
    for arq in list(RAIZ.rglob("*.html")) + list(RAIZ.rglob("*.css")) + [RAIZ / "tools" / "gerar-paginas.py"]:
        if arq.name == "design-system.html" or "node_modules" in arq.parts:
            continue
        texto = arq.read_text(encoding="utf-8", errors="ignore")
        citadas.update(REF_DEMO_RE.findall(texto))
        citadas.update(REF_OPT_RE.findall(texto))
    return citadas


def origens() -> list[Path]:
    mapa = candidatas()
    usadas = referenciadas() | {Path(n).stem for n in LEGADAS}
    return [mapa[s] for s in sorted(mapa) if s in usadas]


def limpar(fontes: list[Path]) -> int:
    """Remove de assets/opt o que não pertence a nenhuma origem atual."""
    validos: dict[str, set[int]] = {}
    for origem in fontes:
        with Image.open(origem) as im:
            validos[origem.stem] = set(larguras_para(im.width, origem))
    removidos = 0
    for arq in SAIDA.glob("*.*"):
        if arq.suffix not in (".avif", ".webp"):
            continue
        stem, _, largura = arq.stem.rpartition("-")
        if stem not in validos or not largura.isdigit() or int(largura) not in validos[stem]:
            arq.unlink()
            removidos += 1
    return removidos


# Só fotos que ocupam a tela inteira (hero, pilha de formatos, respiro
# fotográfico) precisam da variante de 2400 px. As demais aparecem em
# metade ou um quarto da largura e param em 1400.
PASTAS_CHEIAS = ("hero", "formatos", "apoio")


def larguras_para(largura_origem: int, origem: Path) -> list[int]:
    teto = LARGURAS[-1] if origem.parent.name in PASTAS_CHEIAS else 1400
    alvos = [w for w in LARGURAS if w <= min(largura_origem, teto)]
    if largura_origem < teto and largura_origem not in alvos:
        alvos.append(largura_origem)
    return sorted(set(alvos))


def nome_saida(origem: Path, largura: int, formato: str) -> Path:
    return SAIDA / f"{origem.stem}-{largura}.{formato}"


def precisa(origem: Path, destino: Path, forcar: bool) -> bool:
    if forcar or not destino.exists():
        return True
    return destino.stat().st_mtime < origem.stat().st_mtime


def converter(origem: Path, forcar: bool) -> list[tuple[Path, int]]:
    feitos: list[tuple[Path, int]] = []
    with Image.open(origem) as im:
        im = im.convert("RGB")
        for largura in larguras_para(im.width, origem):
            altura = round(im.height * largura / im.width)
            redimensionada = im if largura == im.width else im.resize(
                (largura, altura), Image.Resampling.LANCZOS)
            for formato, params in (
                ("avif", {"quality": QUALIDADE_AVIF, "speed": 6}),
                ("webp", {"quality": QUALIDADE_WEBP, "method": 6}),
            ):
                destino = nome_saida(origem, largura, formato)
                if not precisa(origem, destino, forcar):
                    continue
                redimensionada.save(destino, **params)
                feitos.append((destino, destino.stat().st_size))
    return feitos


def main() -> int:
    if not features.check("avif"):
        print("Pillow sem suporte a AVIF; atualize para >= 11.2.", file=sys.stderr)
        return 1
    forcar = "--forcar" in sys.argv
    SAIDA.mkdir(parents=True, exist_ok=True)
    fontes = origens()
    if "--limpar" in sys.argv:
        print(f"removidas {limpar(fontes)} variantes sem origem referenciada")
    total_origem = 0
    total_saida = 0
    for origem in fontes:
        total_origem += origem.stat().st_size
        feitos = converter(origem, forcar)
        for destino, tamanho in feitos:
            total_saida += tamanho
            print(f"{destino.relative_to(RAIZ)}  {tamanho // 1024:5d} KB")
    print(f"\norigens: {total_origem // 1024} KB · geradas nesta rodada: {total_saida // 1024} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
