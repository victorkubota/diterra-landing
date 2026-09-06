#!/usr/bin/env python3
"""
Verifica as duas regras que sustentam "social e corporativo só diferem
na cor". Rodar antes de publicar:

    python3 tools/verificar-paridade.py

Regra 1 — assets/css/base.css não pode ter cor literal.
          Toda cor vem de um token --ui-*, definido nos temas.

Regra 2 — assets/css/tema-*.css só pode declarar cor.
          Raio, tamanho de fonte, espaçamento, duração e layout vivem no
          base, e valem para os dois universos de uma vez.

Regra 3 — os temas precisam declarar exatamente o mesmo conjunto de
          tokens --ui-*. Um token que existe só de um lado é uma
          divergência esperando para acontecer.

Sai com código 1 se alguma regra for violada.
"""

import glob
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(RAIZ, 'assets/css/base.css')
TEMAS = sorted(glob.glob(os.path.join(RAIZ, 'assets/css/tema-*.css')))

# nomes de paleta que um tema pode definir, além dos --ui-*
PALETA = r'--(?:ui-|royal|rose|ivory|brick|navy|blue|petrol|taupe|sand|white|black|ink|paper|accent)'

PROPRIEDADE_NAO_COR = re.compile(
    r'^\s*(padding|margin|font-size|font-family|font-weight|border-radius|border-width'
    r'|width|height|gap|line-height|letter-spacing|transition|animation|display'
    r'|position|top|right|bottom|left|z-index|grid|flex)\b\s*:', re.I)

TOKEN_NAO_PALETA = re.compile(r'^(--[\w-]+)\s*:')
COR_LITERAL = re.compile(r'#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(')


def sem_comentarios(css):
    return re.sub(r'/\*.*?\*/', '', css, flags=re.S)


def rel(caminho):
    return os.path.relpath(caminho, RAIZ)


def declaracoes(css):
    """(numero_da_linha, 'prop: valor') para cada declaração.

    Separa por ';' e não por quebra de linha: `:root { --raio: 9px; }`
    numa linha só precisa ser pego igual.
    """
    fora = []
    linha = 1
    atual = []
    for ch in css:
        if ch == '\n':
            linha += 1
        if ch in ';{}':
            texto = ''.join(atual).strip()
            if ':' in texto:
                fora.append((linha, texto))
            atual = []
        else:
            atual.append(ch)
    texto = ''.join(atual).strip()
    if ':' in texto:
        fora.append((linha, texto))
    return fora


def main():
    falhas = []

    # ── regra 1 ───────────────────────────────────────────────────────
    if not os.path.exists(BASE):
        falhas.append(f'{rel(BASE)} não existe')
    else:
        for n, linha in enumerate(sem_comentarios(open(BASE, encoding='utf-8').read()).split('\n'), 1):
            if COR_LITERAL.search(linha):
                falhas.append(f'{rel(BASE)}:{n}: cor literal no base — mova para um tema\n      {linha.strip()}')

    # ── regras 2 e 3 ──────────────────────────────────────────────────
    tokens_por_tema = {}
    for tema in TEMAS:
        css = sem_comentarios(open(tema, encoding='utf-8').read())
        tokens = set()
        for n, decl in declaracoes(css):
            if PROPRIEDADE_NAO_COR.match(decl):
                falhas.append(f'{rel(tema)}:{n}: tema declarando algo que não é cor — mova para o base\n      {decl}')
            m = TOKEN_NAO_PALETA.match(decl)
            if m:
                nome = m.group(1)
                if not re.match(PALETA, nome):
                    falhas.append(f'{rel(tema)}:{n}: token fora do vocabulário de cor: {nome}')
                elif not COR_LITERAL.search(decl) and 'var(' not in decl:
                    falhas.append(f'{rel(tema)}:{n}: token de tema sem valor de cor: {decl}')
                if nome.startswith('--ui-'):
                    tokens.add(nome)
        tokens_por_tema[rel(tema)] = tokens

    if len(tokens_por_tema) > 1:
        nomes = list(tokens_por_tema)
        referencia = tokens_por_tema[nomes[0]]
        for outro in nomes[1:]:
            faltando = referencia - tokens_por_tema[outro]
            sobrando = tokens_por_tema[outro] - referencia
            for t in sorted(faltando):
                falhas.append(f'{outro}: falta o token {t}, que existe em {nomes[0]}')
            for t in sorted(sobrando):
                falhas.append(f'{nomes[0]}: falta o token {t}, que existe em {outro}')

    # ── resultado ─────────────────────────────────────────────────────
    if falhas:
        print('PARIDADE QUEBRADA\n')
        for f in falhas:
            print(f'  · {f}')
        print(f'\n{len(falhas)} problema(s).')
        return 1

    n_tokens = len(next(iter(tokens_por_tema.values()))) if tokens_por_tema else 0
    print('Paridade OK')
    print(f'  · {rel(BASE)} sem cor literal')
    print(f'  · {len(TEMAS)} temas, só com cor')
    print(f'  · {n_tokens} tokens --ui-* idênticos em nome nos dois')
    return 0


if __name__ == '__main__':
    sys.exit(main())
