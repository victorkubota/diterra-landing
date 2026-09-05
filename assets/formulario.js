/* ══════════════════════════════════════════════════════════════════════
   Estados do formulário de contato, social e corporativo.

   Quatro estados que o visitante vê: campo com erro (na hora, ao sair
   do campo e no envio), enviando, enviado, falha. O que muda entre os
   dois universos vem de data-atributos no <form>:

     data-destino   e-mail que recebe o lead (obrigatório)
     data-assunto   assunto da mensagem
     data-endpoint  URL que aceita POST com FormData (opcional)

   Sem endpoint, o envio abre o e-mail do visitante com a mensagem
   pronta para o destino. É o que existe até o comercial ter um
   destino conectado; a página diz isso na confirmação, não esconde.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MENSAGENS = {
    obrigatorio: 'Preencha este campo.',
    email: 'Confira o e-mail: falta o @ ou o domínio.',
    telefone: 'Use só números, com DDD.',
    enviando: 'Enviando…',
    falha: 'Não conseguimos enviar agora. Tente de novo ou fale pelo WhatsApp.'
  };

  var formularios = document.querySelectorAll('form[data-destino]');
  Array.prototype.forEach.call(formularios, montar);

  function montar(form) {
    form.setAttribute('novalidate', '');
    var campos = form.querySelectorAll('input, select, textarea');
    var botao = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.form-status');
    var rotuloBotao = botao ? botao.innerHTML : '';

    Array.prototype.forEach.call(campos, function (campo) {
      campo.addEventListener('blur', function () { validar(campo); });
      campo.addEventListener('input', function () {
        if (campo.getAttribute('aria-invalid') === 'true') validar(campo);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalidos = Array.prototype.filter.call(campos, function (c) { return !validar(c); });
      if (invalidos.length) { invalidos[0].focus(); return; }
      enviar(form, botao, status, rotuloBotao);
    });
  }

  /* ── validação por campo ──────────────────────────────────────── */
  function validar(campo) {
    var valor = campo.value.trim();
    var erro = '';
    if (campo.required && !valor) erro = MENSAGENS.obrigatorio;
    else if (valor && campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) erro = MENSAGENS.email;
    else if (valor && campo.type === 'tel' && !/^[\d\s()+-]{8,}$/.test(valor)) erro = MENSAGENS.telefone;
    mostrarErro(campo, erro);
    return !erro;
  }

  function mostrarErro(campo, erro) {
    var id = campo.id + '-erro';
    var aviso = document.getElementById(id);
    if (erro) {
      if (!aviso) {
        aviso = document.createElement('p');
        aviso.id = id;
        aviso.className = 'campo-erro';
        campo.insertAdjacentElement('afterend', aviso);
      }
      aviso.textContent = erro;
      campo.setAttribute('aria-invalid', 'true');
      campo.setAttribute('aria-describedby', id);
    } else {
      if (aviso) aviso.remove();
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
    }
  }

  /* ── envio ────────────────────────────────────────────────────── */
  function enviar(form, botao, status, rotuloBotao) {
    var dados = new FormData(form);
    var destino = form.getAttribute('data-destino');
    var assunto = form.getAttribute('data-assunto') || 'Contato pelo site';
    var endpoint = form.getAttribute('data-endpoint');

    ocupado(botao, true, rotuloBotao);
    pintarStatus(status, '', '');

    if (endpoint) {
      fetch(endpoint, { method: 'POST', body: dados, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); concluir(form, botao, status, rotuloBotao, dados, destino, false); })
        .catch(function () { ocupado(botao, false, rotuloBotao); pintarStatus(status, MENSAGENS.falha, 'erro'); });
      return;
    }

    /* sem endpoint: o e-mail do visitante abre com a mensagem pronta */
    var linhas = [];
    dados.forEach(function (v, k) { if (String(v).trim()) linhas.push(rotulo(form, k) + ': ' + v); });
    window.location.href = 'mailto:' + destino +
      '?subject=' + encodeURIComponent(assunto) +
      '&body=' + encodeURIComponent(linhas.join('\n'));
    window.setTimeout(function () { concluir(form, botao, status, rotuloBotao, dados, destino, true); }, 600);
  }

  function concluir(form, botao, status, rotuloBotao, dados, destino, viaEmail) {
    ocupado(botao, false, rotuloBotao);
    var resumo = [];
    var data = dados.get('data');
    var espaco = dados.get('espaco');
    var tipo = dados.get('evento') || dados.get('formato');
    if (tipo) resumo.push(tipo);
    if (espaco) resumo.push(espaco);
    if (data) resumo.push(data);
    var texto = viaEmail
      ? 'Seu e-mail abriu com a solicitação pronta para ' + destino + '. Se não abriu, escreva para esse endereço' +
        (resumo.length ? ' mencionando ' + resumo.join(', ') : '') + '. A equipe comercial responde por e-mail ou WhatsApp.'
      : 'Recebemos sua solicitação' + (resumo.length ? ' para ' + resumo.join(', ') : '') +
        '. A equipe comercial responde por e-mail ou WhatsApp.';
    pintarStatus(status, texto, 'ok');
    form.reset();
    if (status) status.focus();
  }

  function ocupado(botao, sim, rotuloBotao) {
    if (!botao) return;
    botao.disabled = sim;
    botao.setAttribute('aria-busy', String(sim));
    botao.innerHTML = sim ? MENSAGENS.enviando : rotuloBotao;
  }

  function pintarStatus(status, texto, tipo) {
    if (!status) return;
    status.textContent = texto;
    status.hidden = !texto;
    status.className = 'form-status' + (tipo ? ' form-status--' + tipo : '');
  }

  function rotulo(form, nome) {
    var campo = form.elements[nome];
    var label = campo && campo.id ? form.querySelector('label[for="' + campo.id + '"]') : null;
    return label ? label.textContent.replace(/\s*\*\s*$/, '').trim() : nome;
  }
})();
