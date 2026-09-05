#!/usr/bin/env python3
"""
Gera as páginas internas do site social a partir de um único template.

    python3 tools/gerar-paginas.py

Produz:
    social/espacos/index.html   + 4 páginas de espaço
    social/solucoes/index.html  + 5 páginas de solução

O conteúdo vive nos dicionários ESPACOS/SOLUCOES abaixo. Marcação e estilo
ficam no template, então um ajuste de layout muda todas as páginas de uma vez.
Dados técnicos ainda não confirmados pela Di Terrá são marcados com TBD e
renderizados como "a confirmar": nada é estimado.
"""

import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TBD = "__TBD__"
NL = "\n"

# ══════════════════════════════════════════════════════════════════════════
# CONTEÚDO
# ══════════════════════════════════════════════════════════════════════════

ESPACOS = [
    {
        "slug": "a-querencia",
        "nome": "A Querência",
        "resumo": "Salão coberto e jardim para celebrações de grande porte.",
        "lead": "Área ampla, salão coberto e jardim aberto. A casa que recebe as "
                "celebrações de maior porte, com espaço para cerimônia ao ar livre "
                "e festa sob cobertura.",
        "imagem": "/assets/brand/foto-casal-noite.jpg",
        "alt": "Casal de noivos sob luzes no jardim da Querência",
        "prosa": [
            "A Querência nasceu para receber festas que pedem espaço. O jardim abre "
            "para a cerimônia ao entardecer e o salão coberto assume a noite, sem que "
            "os convidados precisem trocar de endereço.",
            "A transição entre os ambientes foi desenhada para acontecer sem corte: "
            "cerimônia, coquetel e festa se sucedem no mesmo terreno, com equipes "
            "trabalhando em paralelo enquanto a celebração segue.",
        ],
        "ficha": [
            ("Capacidade sentado", TBD),
            ("Capacidade em pé", TBD),
            ("Área coberta", TBD),
            ("Área de jardim", TBD),
            ("Estacionamento", TBD),
            ("Suíte dos noivos", TBD),
        ],
        "destaques": [
            "Cerimônia ao ar livre no jardim",
            "Salão coberto para a festa",
            "Área de apoio para fornecedores",
            "Suíte para preparação dos noivos",
            "Iluminação cênica no jardim",
            "Estacionamento no local",
        ],
    },
    {
        "slug": "palacete-monte-alegre",
        "nome": "Palacete Monte Alegre",
        "resumo": "Arquitetura histórica para celebrações de assinatura.",
        "lead": "Casarão histórico, pé-direito alto e janelas em arco. O endereço para "
                "quem quer uma festa com a formalidade de outro tempo.",
        "imagem": "/assets/brand/foto-noiva-janela.jpg",
        "alt": "Noiva junto à janela em arco do Palacete Monte Alegre",
        "prosa": [
            "O Palacete carrega a arquitetura que deu origem ao símbolo da marca: as "
            "janelas em arco dos casarões que compõem os espaços do grupo.",
            "É a casa com maior carga de memória. Os salões internos permitem "
            "celebrações independentes de clima, e a escadaria funciona como cenário "
            "natural para a entrada e para as fotos.",
        ],
        "ficha": [
            ("Capacidade sentado", TBD),
            ("Capacidade em pé", TBD),
            ("Salões internos", TBD),
            ("Área externa", TBD),
            ("Estacionamento", TBD),
            ("Suíte dos noivos", TBD),
        ],
        "destaques": [
            "Salões internos climatizados",
            "Escadaria para entrada e fotos",
            "Pé-direito alto",
            "Janelas em arco originais",
            "Celebração independente de clima",
            "Suíte para preparação",
        ],
    },
    {
        "slug": "casa-lucca",
        "nome": "Casa Lucca",
        "resumo": "Escala menor e ambiente reservado para celebrações intimistas.",
        "lead": "Para festas de convidados contados. Mesa longa na área externa, "
                "ambiente reservado e serviço próximo.",
        "imagem": "/assets/espaco-casa-lucca.png",
        "alt": "Mesa longa montada na área externa da Casa Lucca",
        "prosa": [
            "A Casa Lucca é a resposta para quem não quer uma festa grande. O formato "
            "favorece mesas longas, jantares servidos e conversas que atravessam a "
            "noite inteira sem competir com o som.",
            "A escala menor muda a operação: a equipe fica mais próxima dos convidados "
            "e o ritmo do serviço acompanha a mesa, não o cronograma.",
        ],
        "ficha": [
            ("Capacidade sentado", TBD),
            ("Capacidade em pé", TBD),
            ("Área coberta", TBD),
            ("Área externa", TBD),
            ("Estacionamento", TBD),
            ("Suíte dos noivos", TBD),
        ],
        "destaques": [
            "Formato de mesa longa",
            "Ambiente reservado",
            "Jantar servido à mesa",
            "Jardim de apoio",
            "Indicado para bodas e jantares",
            "Equipe dedicada",
        ],
    },
    {
        "slug": "espaco-terra",
        "nome": "Espaço Terrá",
        "resumo": "Estrutura versátil com horizonte aberto do interior paulista.",
        "lead": "Terreno aberto e vista limpa. O espaço mais versátil do grupo, "
                "preparado para montagens cenográficas de grande formato.",
        "imagem": "/assets/capa-video.png",
        "alt": "Vista do horizonte no Espaço Terrá, interior paulista",
        "prosa": [
            "O Espaço Terrá é o mais maleável dos quatro. A área aberta aceita "
            "montagem cenográfica do zero, o que permite que cada evento tenha uma "
            "configuração diferente do anterior.",
            "É também o espaço com a paisagem mais presente: o horizonte do interior "
            "paulista entra na composição e dispensa boa parte da ambientação.",
        ],
        "ficha": [
            ("Capacidade sentado", TBD),
            ("Capacidade em pé", TBD),
            ("Área coberta", TBD),
            ("Área aberta", TBD),
            ("Estacionamento", TBD),
            ("Suíte dos noivos", TBD),
        ],
        "destaques": [
            "Montagem cenográfica livre",
            "Horizonte aberto",
            "Área para estruturas temporárias",
            "Cerimônia ao pôr do sol",
            "Acesso para carga e descarga",
            "Estacionamento no local",
        ],
    },
]

SOLUCOES = [
    {
        "slug": "gastronomia",
        "nome": "Gastronomia",
        "resumo": "Menu autoral, do welcome ao doce da madrugada.",
        "lead": "Cozinha própria, menu construído com os noivos e serviço que acompanha "
                "o ritmo da festa do começo ao fim.",
        "imagem": "/assets/4.png",
        "alt": "Mesa de doces e sobremesas montada em evento da Di Terrá",
        "prosa": [
            "O menu não sai de um catálogo. É construído em degustação, ajustado ao "
            "perfil dos convidados e ao formato de serviço escolhido.",
            "A cozinha é própria, o que encurta o tempo entre a finalização e o prato "
            "na mesa, e permite absorver qualquer ajuste no cronograma da festa sem "
            "renegociar com terceiros.",
        ],
        "inclui": [
            "Degustação com os noivos",
            "Welcome drink e entradas",
            "Serviço de jantar",
            "Ilhas gastronômicas",
            "Mesa de doces e bolo",
            "Ceia da madrugada",
            "Menu infantil e restrições",
            "Equipe de salão e copa",
        ],
    },
    {
        "slug": "decoracao",
        "nome": "Decoração",
        "resumo": "Cenografia, flores e ambientação sob medida.",
        "lead": "Projeto de ambientação desenhado para o espaço escolhido, do arranjo "
                "de mesa à cenografia da cerimônia.",
        "imagem": "/assets/solucao-completa-decoracao-casamento.png",
        "alt": "Cenografia floral montada para cerimônia de casamento",
        "prosa": [
            "A decoração parte do espaço, não de um moodboard genérico. Cada casa tem "
            "proporções e luz próprias, e o projeto trabalha a favor delas.",
            "O trabalho cobre cerimônia, recepção e festa, com a mesma linguagem "
            "visual atravessando os três momentos.",
        ],
        "inclui": [
            "Projeto de ambientação",
            "Arranjos e flores",
            "Cenografia de cerimônia",
            "Mobiliário e louças",
            "Papelaria de mesa",
            "Iluminação decorativa",
            "Montagem e desmontagem",
            "Acompanhamento no dia",
        ],
    },
    {
        "slug": "coquetelaria",
        "nome": "Coquetelaria",
        "resumo": "Bar assinado, drinks autorais e serviço dedicado.",
        "lead": "Carta de drinks criada para a festa, com bar montado e equipe própria "
                "de bartenders.",
        "imagem": "/assets/1.png",
        "alt": "Drink autoral sendo finalizado no bar da Di Terrá",
        "prosa": [
            "A carta é montada junto com os noivos e costuma incluir dois drinks "
            "autorais que levam o nome do casal.",
            "O bar é montado no espaço e opera durante toda a festa, com reposição "
            "planejada para não gerar fila nos momentos de pico.",
        ],
        "inclui": [
            "Carta de drinks autorais",
            "Bar montado no espaço",
            "Equipe de bartenders",
            "Destilados e insumos",
            "Cristaleria e gelo",
            "Opções sem álcool",
            "Serviço volante",
            "Reposição durante a festa",
        ],
    },
    {
        "slug": "producao",
        "nome": "Produção",
        "resumo": "Planejamento, cronograma e operação no dia.",
        "lead": "A equipe que costura fornecedores, cronograma e imprevistos para que "
                "a festa aconteça sem que ninguém perceba a operação.",
        "imagem": "/assets/PRODUCAO-6.png",
        "alt": "Equipe de produção da Di Terrá em operação durante evento",
        "prosa": [
            "A produção começa muito antes do dia: definição de cronograma, "
            "alinhamento com fornecedores externos, ensaio da cerimônia e plano "
            "alternativo para clima.",
            "No dia, a equipe assume a régua do tempo. Cada bloco da festa tem "
            "responsável, e a família não precisa coordenar nada.",
        ],
        "inclui": [
            "Cronograma do evento",
            "Alinhamento com fornecedores",
            "Ensaio da cerimônia",
            "Plano alternativo para clima",
            "Coordenação no dia",
            "Equipe de apoio",
            "Controle de acesso",
            "Desmontagem",
        ],
    },
    {
        "slug": "tecnologia-audiovisual",
        "nome": "Tecnologia Audiovisual",
        "resumo": "Som, luz, projeção e transmissão.",
        "lead": "Estrutura técnica dimensionada para o espaço, da cerimônia ao último "
                "bloco da pista.",
        "imagem": "/assets/TECNOLOGIA-2.png",
        "alt": "Estrutura de som e luz durante show em evento da Di Terrá",
        "prosa": [
            "Som e luz são dimensionados por espaço. O que funciona no salão coberto "
            "da Querência não é o que funciona na área aberta do Espaço Terrá.",
            "A equipe técnica acompanha a festa inteira, com operador de som e de luz "
            "presentes do primeiro discurso ao último bloco.",
        ],
        "inclui": [
            "Sonorização da cerimônia",
            "Som de pista",
            "Iluminação cênica",
            "Projeção e telão",
            "Transmissão ao vivo",
            "Operador técnico no local",
            "Estrutura de palco",
            "Energia e contingência",
        ],
    },
]

GALERIA = [
    ("brand/foto-saida-noivos.jpg", "Saída dos noivos entre os convidados"),
    ("brand/foto-mesa-posta.jpg", "Mesa posta com arranjo central"),
    ("brand/foto-noiva-robe.jpg", "Noiva na preparação"),
    ("DECORACAO.png", "Cenografia floral da cerimônia"),
    ("brand/foto-casal-noite.jpg", "Casal sob luzes no jardim"),
]

# ══════════════════════════════════════════════════════════════════════════
# TEMPLATE
# ══════════════════════════════════════════════════════════════════════════

def cabeca(titulo, descricao, canonical, css, favicon):
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{descricao}">
<link rel="canonical" href="{canonical}">
<link rel="icon" type="image/png" href="{favicon}">
<meta name="theme-color" content="#111542">
<meta property="og:type" content="website">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{descricao}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400&family=Oooh+Baby&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/tema-social.css">
<link rel="stylesheet" href="/assets/css/base.css">
<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="{css}">
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
"""


def nav():
    return """
<nav class="nav" id="nav" aria-label="Navegação principal">
  <a class="nav__logo" href="/social" aria-label="Di Terrá Eventos, início">
    <img src="/assets/brand/social-wordmark-white.png" alt="Di Terrá Eventos" width="472" height="94">
  </a>
  <ul class="nav__links">
    <li><a href="/social#intro">O grupo</a></li>
    <li><a href="/social/espacos">Espaços</a></li>
    <li><a href="/social/solucoes">Soluções</a></li>
    <li><a href="/social#galeria">Galeria</a></li>
    <li><a href="/social#contato">Contato</a></li>
  </ul>
  <div class="nav__side">
    <a class="nav__switch" href="/corporativo">Corporativo &rarr;</a>
    <a class="btn btn--primary" href="/social#contato">Fale conosco</a>
    <button class="nav__toggle" id="navToggle" aria-expanded="false" aria-controls="navDrawer" aria-label="Abrir menu">
      <span></span><span></span>
    </button>
  </div>
  <span class="nav__progresso" aria-hidden="true"></span>
</nav>
<div class="nav__drawer" id="navDrawer">
  <a href="/social#intro">O grupo</a>
  <a href="/social/espacos">Espaços</a>
  <a href="/social/solucoes">Soluções</a>
  <a href="/social#galeria">Galeria</a>
  <a href="/social#contato">Contato</a>
  <a class="nav__switch" href="/corporativo">Ir para Corporativo &rarr;</a>
</div>
"""


def rodape():
    return """
<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div class="foot__logo">
        <img src="/assets/brand/social-lockup-white.png" alt="Di Terrá Eventos" width="454" height="288">
        <p style="font-size:var(--text-sm); color:rgba(254,250,224,.78); max-width:30ch">
          Quatro espaços no interior paulista para casamentos, debutantes, aniversários e bodas.
        </p>
      </div>
      <div>
        <h2>Espaços</h2>
        <ul>
          <li><a href="/social/espacos/a-querencia">A Querência</a></li>
          <li><a href="/social/espacos/palacete-monte-alegre">Palacete Monte Alegre</a></li>
          <li><a href="/social/espacos/casa-lucca">Casa Lucca</a></li>
          <li><a href="/social/espacos/espaco-terra">Espaço Terrá</a></li>
        </ul>
      </div>
      <div>
        <h2>Soluções</h2>
        <ul>
          <li><a href="/social/solucoes/gastronomia">Gastronomia</a></li>
          <li><a href="/social/solucoes/decoracao">Decoração</a></li>
          <li><a href="/social/solucoes/coquetelaria">Coquetelaria</a></li>
          <li><a href="/social/solucoes/producao">Produção</a></li>
          <li><a href="/social/solucoes/tecnologia-audiovisual">Tecnologia Audiovisual</a></li>
        </ul>
      </div>
      <div>
        <h2>Di Terrá</h2>
        <ul>
          <li><a href="/social">Home social</a></li>
          <li><a href="/corporativo">Corporativo</a></li>
          <li><a href="/social#contato">Contato</a></li>
          <li><a href="/">Página de entrada</a></li>
        </ul>
      </div>
    </div>
    <div class="foot__bar">
      <span>&copy; 2026 Di Terrá Eventos. Piracicaba e região, São Paulo.</span>
      <span>Protótipo de avaliação. Conteúdo sujeito a validação.</span>
    </div>
  </div>
</footer>

<!-- barra de ação do celular (base.css / site.js) -->
<div class="barra-acao on-dark" id="barraAcao">
  <a class="btn btn--primary on-dark" href="/social#contato">Fale conosco</a>
</div>
<a class="to-top" id="toTop" href="#topo" aria-label="Voltar ao topo da página">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" stroke-width="1.3"/>
  </svg>
</a>

<script src="/assets/site.js" defer></script>
</body>
</html>
"""


def cta():
    return """
<section class="section section--rose">
  <span class="ornament ornament--tr"><img src="/assets/brand/ornamento-ramo-navy.png" alt="" width="287" height="513"></span>
  <div class="wrap cta rise">
    <p class="script">Sua história começa aqui</p>
    <h2 class="h-section">Vamos conversar sobre a sua data?</h2>
    <div class="cta__actions">
      <a class="btn btn--primary" href="/social#contato">
        Falar com a equipe
        <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden="true"><path d="M0 4h16M13 1l3.4 3L13 7" stroke="currentColor" stroke-width="1.1"/></svg>
      </a>
      <a class="btn btn--ghost" href="/social/espacos">Conhecer os espaços</a>
    </div>
  </div>
</section>
"""


def ficha_html(itens):
    linhas = []
    for chave, valor in itens:
        v = ('<span class="v tbd">a confirmar</span>' if valor is TBD
             else f'<span class="v">{valor}</span>')
        linhas.append(f'        <li><span class="k">{chave}</span>{v}</li>')
    return NL.join(linhas)


def cards_html(itens, pasta, atual=None):
    saida = []
    for it in itens:
        if it["slug"] == atual:
            continue
        img = it["imagem"]
        saida.append(f"""      <a class="card rise" href="/social/{pasta}/{it['slug']}">
        <div class="card__media reveal-shot">
          <img src="{img}" alt="{it['alt']}" loading="lazy" style="object-position:center 35%">
          <span class="card__arch" aria-hidden="true"></span>
        </div>
        <div class="card__body">
          <h3 class="h-card">{it['nome']}</h3>
          <p>{it['resumo']}</p>
          <span class="card__more">Ver
            <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden="true"><path d="M0 4h16M13 1l3.4 3L13 7" stroke="currentColor" stroke-width="1.1"/></svg>
          </span>
        </div>
      </a>""")
    return NL.join(saida)


def galeria_html():
    # cada figura se descobre por conta, escalonada pelo --i; o .gallery
    # não leva mais .rise, senão o bloco piscaria inteiro por cima
    return NL.join(
        f'      <figure class="reveal-shot" style="--i:{i}"><img src="/assets/{arq}" '
        f'alt="{alt}" loading="lazy" style="object-position:center 35%"></figure>'
        for i, (arq, alt) in enumerate(GALERIA)
    )


def pagina_interna(item, tipo):
    e_espaco = tipo == "espacos"
    rotulo = "Espaços" if e_espaco else "Soluções"
    irmaos = ESPACOS if e_espaco else SOLUCOES
    titulo = f"{item['nome']} | Di Terrá Eventos"
    desc = item["resumo"]

    if e_espaco:
        destaques = NL.join(f'          <li>{d}</li>' for d in item['destaques'])
        bloco_dados = f"""
<section class="section section--paper">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow rise">Ficha do espaço</p>
      <h2 class="h-section linhas">Números e estrutura</h2>
    </div>
    <p class="notice rise">
      <span aria-hidden="true">&#9650;</span>
      <span><strong>Campos a preencher.</strong> Capacidades e metragens aguardam
      confirmação da Di Terrá. Nenhum valor foi estimado.</span>
    </p>
    <div class="split">
      <ul class="spec cascata">
{ficha_html(item['ficha'])}
      </ul>
      <div class="rise">
        <h3 class="h-card" style="margin-bottom:20px">O que este espaço oferece</h3>
        <ul class="checks cascata">
{destaques}
        </ul>
      </div>
    </div>
  </div>
</section>
"""
    else:
        inclui = NL.join(f'      <li>{d}</li>' for d in item['inclui'])
        bloco_dados = f"""
<section class="section section--paper">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow rise">O que está incluído</p>
      <h2 class="h-section linhas">Do planejamento à desmontagem</h2>
    </div>
    <ul class="checks cascata">
{inclui}
    </ul>
  </div>
</section>
"""

    prosa = NL.join(f'      <p>{p}</p>' for p in item['prosa'])
    titulo_irmaos = "Os outros espaços" if e_espaco else "As outras soluções"

    return (
        cabeca(titulo, desc, f"https://www.diterra.com.br/social/{tipo}/{item['slug']}",
               "/social/social.css", "/assets/brand/favicon-social.png")
        + nav()
        + f"""
<main id="conteudo">

<header class="page-hero" id="topo">
  <div class="page-hero__media">
    <img src="{item['imagem']}" alt="{item['alt']}" fetchpriority="high" width="1800" height="1013">
  </div>
  <div class="wrap on-dark">
    <ol class="crumbs">
      <li><a href="/">Di Terrá</a></li>
      <li><a href="/social">Social</a></li>
      <li><a href="/social/{tipo}">{rotulo}</a></li>
      <li aria-current="page">{item['nome']}</li>
    </ol>
    <h1 class="h-display linhas">{item['nome']}</h1>
    <p class="lead page-hero__lead">{item['lead']}</p>
  </div>
</header>

<section class="section">
  <span class="ornament ornament--tr"><img src="/assets/brand/ornamento-ramo-rose.png" alt="" width="305" height="621"></span>
  <div class="wrap split">
    <div class="prose rise">
      <p class="eyebrow">{rotulo}</p>
{prosa}
    </div>
    <div class="split__media reveal-shot">
      <img src="{item['imagem']}" alt="{item['alt']}" loading="lazy" width="1800" height="1013">
    </div>
  </div>
</section>
{bloco_dados}
<section class="section">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow rise">Registros</p>
      <h2 class="h-section linhas">Momentos na Di Terrá</h2>
    </div>
    <div class="gallery">
{galeria_html()}
    </div>
  </div>
</section>

<section class="section section--invert">
  <div class="wrap">
    <div class="section__head on-dark">
      <p class="eyebrow rise">Continue explorando</p>
      <h2 class="h-section linhas">{titulo_irmaos}</h2>
    </div>
    <div class="grid grid--3">
{cards_html(irmaos, tipo, atual=item['slug'])}
    </div>
  </div>
</section>
{cta()}
</main>
""" + rodape()
    )


def hub(tipo):
    e_espaco = tipo == "espacos"
    itens = ESPACOS if e_espaco else SOLUCOES

    if e_espaco:
        titulo = "Espaços | Di Terrá Eventos"
        desc = ("Quatro espaços no interior paulista para casamentos, debutantes, "
                "aniversários e bodas.")
        h1, chamada = "Espaços", "Escolha a casa"
        lead = ("Quatro casas, cada uma com uma escala e um caráter. A escolha do "
                "espaço é a primeira decisão da festa.")
        img, alt = "/assets/3.png", "Fachada e jardim de um dos espaços da Di Terrá"
        sub = "Cada casa recebe um tipo de festa"
        subtexto = ("Da celebração intimista de mesa longa à festa de grande porte "
                    "com cerimônia ao ar livre.")
    else:
        titulo = "Soluções | Di Terrá Eventos"
        desc = ("Gastronomia, decoração, coquetelaria, produção e tecnologia "
                "audiovisual em um único contrato.")
        h1, chamada = "Soluções", "O que fazemos"
        lead = ("Tudo o que a festa precisa sob um contrato só, sem coordenar "
                "fornecedor por fornecedor.")
        img, alt = "/assets/DECORACAO.png", "Cenografia floral montada em evento da Di Terrá"
        sub = "Cinco frentes, uma operação"
        subtexto = ("A mesma equipe cuida do menu, da ambientação, do bar, do "
                    "cronograma e da estrutura técnica.")

    return (
        cabeca(titulo, desc, f"https://www.diterra.com.br/social/{tipo}/",
               "/social/social.css", "/assets/brand/favicon-social.png")
        + nav()
        + f"""
<main id="conteudo">

<header class="page-hero" id="topo">
  <div class="page-hero__media">
    <img src="{img}" alt="{alt}" fetchpriority="high" width="1024" height="1024">
  </div>
  <div class="wrap on-dark">
    <ol class="crumbs">
      <li><a href="/">Di Terrá</a></li>
      <li><a href="/social">Social</a></li>
      <li aria-current="page">{h1}</li>
    </ol>
    <h1 class="h-display linhas">{h1}</h1>
    <p class="lead page-hero__lead">{lead}</p>
  </div>
</header>

<section class="section">
  <span class="ornament ornament--bl"><img src="/assets/brand/ornamento-ramo-rose.png" alt="" width="305" height="621"></span>
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow rise">{chamada}</p>
      <h2 class="h-section linhas">{sub}</h2>
      <p class="body-muted rise">{subtexto}</p>
    </div>
    <div class="grid grid--3">
{cards_html(itens, tipo)}
    </div>
  </div>
</section>
{cta()}
</main>
""" + rodape()
    )


# ══════════════════════════════════════════════════════════════════════════
# EXECUÇÃO
#
# Este script SOBRESCREVE as onze internas por inteiro. Toda classe de
# motion aplicada à mão nelas precisa existir aqui em cima também, senão
# uma execução apaga o trabalho. Em 05/09/2026 foi o que quase aconteceu
# com .reveal-shot e .cascata.
# ══════════════════════════════════════════════════════════════════════════

def escrever(caminho, conteudo):
    destino = os.path.join(RAIZ, caminho)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, "w", encoding="utf-8") as f:
        f.write(conteudo)
    print(f"  {caminho}")


def main():
    print("Gerando páginas internas do site social:")
    escrever("social/espacos/index.html", hub("espacos"))
    for item in ESPACOS:
        escrever(f"social/espacos/{item['slug']}.html", pagina_interna(item, "espacos"))

    escrever("social/solucoes/index.html", hub("solucoes"))
    for item in SOLUCOES:
        escrever(f"social/solucoes/{item['slug']}.html", pagina_interna(item, "solucoes"))
    print(f"\n{2 + len(ESPACOS) + len(SOLUCOES)} páginas geradas.")


# ══════════════════════════════════════════════════════════════════════════
# TRAVA
#
# Este template ficou para trás do que as onze páginas realmente contêm.
# Rodado em 05/09/2026, ele desfez trabalho de três PRs em uma execução:
#
#   · removeu o <div class="hero-palco"> das onze — o hero deixou de se
#     recolher em cartão ao rolar (fase 4)
#   · reinseriu 44 <p class="eyebrow">, que o cliente pediu para tirar
#     ("Em todas as seções remova os headlines")
#   · trouxe de volta /assets/DECORACAO.png, a peça de marketing com texto
#     queimado no pixel, substituída no PR victorkubota/diterra-landing#21
#
# As classes de motion já foram todas alinhadas aqui: .reveal-shot na
# fotografia, .cascata nas listas, --i na galeria, .linhas nos títulos de
# seção e a barra .nav__progresso na nav. O que continua desalinhado é o
# hero-palco, que sumiria, e os eyebrows, que voltariam. Enquanto esses
# dois não forem resolvidos, gerar é destrutivo.
#
# Para rodar mesmo assim, depois de alinhar o template:
#   python3 tools/gerar-paginas.py --eu-sei-o-que-estou-fazendo
# ══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import sys
    if "--eu-sei-o-que-estou-fazendo" not in sys.argv:
        print(__doc__ or "")
        print("RECUSADO: este gerador sobrescreve as onze internas por inteiro e")
        print("o template está desatualizado. Rodá-lo agora apaga o hero-palco,")
        print("devolve os eyebrows removidos a pedido do cliente e restaura uma")
        print("imagem legada. Leia o bloco TRAVA no fim deste arquivo.")
        sys.exit(1)
    main()
