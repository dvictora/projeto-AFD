// Função para simular o AFD
function simularAFD(estados, alfabeto, inicial, finais, transicoes, entrada) {
  let estadoAtual = inicial;
  for (let simbolo of entrada) {
    let chave = estadoAtual + ',' + simbolo;
    if (!(chave in transicoes)) {
      return false; // Transição não definida
    }
    estadoAtual = transicoes[chave];
  }
  return finais.includes(estadoAtual);
}

function testarAFD() {
  // Limpa avisos anteriores
  let aviso = document.getElementById('avisoTransicao');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'avisoTransicao';
    aviso.style.color = 'red';
    document.querySelector('.result-box').prepend(aviso);
  }
  aviso.innerText = '';

  const estados = document.getElementById('states').value.split(',').map(s => s.trim());
  const alfabeto = document.getElementById('alphabet').value.split(',').map(s => s.trim());
  const inicial = document.getElementById('start').value.trim();
  const finais = document.getElementById('accept').value.split(',').map(s => s.trim());
  const transicoesInput = document.getElementById('transitions').value.split(';');
  const entrada = document.getElementById('testString').value.trim();

  // Validação dos campos principais
  if (!estados.includes(inicial)) {
    aviso.innerText = '⚠️ Erro: O estado inicial não está na lista de estados!';
    return;
  }
  for (let f of finais) {
    if (!estados.includes(f)) {
      aviso.innerText = `⚠️ Erro: O estado de aceitação "${f}" não está na lista de estados!`;
      return;
    }
  }

  // Monta o objeto de transições com validação extra
  let transicoes = {};
  for (let t of transicoesInput) {
    if (t.trim() === '') continue;
    if (!t.includes('=') || !t.includes(',')) {
      aviso.innerText = '⚠️ Erro: Cada transição deve estar no formato estado,símbolo=destino!';
      return;
    }
    let [esq, dest] = t.split('=');
    if (!esq || !dest || !esq.includes(',')) {
      aviso.innerText = '⚠️ Erro: Cada transição deve estar no formato estado,símbolo=destino!';
      return;
    }
    let [origem, simbolo] = esq.split(',');
    if (!origem || !simbolo || !dest.trim()) {
      aviso.innerText = '⚠️ Erro: Cada transição deve estar no formato estado,símbolo=destino!';
      return;
    }
    // Validação dos estados e símbolos
    if (!estados.includes(origem.trim())) {
      aviso.innerText = `⚠️ Erro: O estado "${origem.trim()}" não está na lista de estados!`;
      return;
    }
    if (!estados.includes(dest.trim())) {
      aviso.innerText = `⚠️ Erro: O estado de destino "${dest.trim()}" não está na lista de estados!`;
      return;
    }
    if (!alfabeto.includes(simbolo.trim())) {
      aviso.innerText = `⚠️ Erro: O símbolo "${simbolo.trim()}" não está no alfabeto!`;
      return;
    }
    transicoes[origem.trim() + ',' + simbolo.trim()] = dest.trim();
  }

  function simulateDFA(transitions, startState, acceptStates, inputStr) {
    let state = startState.trim();
    const history = [state];

    for (let symbol of inputStr) {
      const key = `${state},${symbol}`;
      if (transitions[key]) {
        state = transitions[key].trim();
        history.push(state);
      } else {
        return { accepted: false, history };
      }
    }
    return { accepted: acceptStates.map(s => s.trim()).includes(state), history };
  }

  const resultado = simulateDFA(transicoes, inicial, finais, entrada);

  const resultMsg = resultado.accepted
    ? 'A string foi <b>ACEITA</b> pelo AFD!'
    : 'A string foi <b>REJEITADA</b> pelo AFD.';
  const caminho = resultado.history.join(' → ');
  const li = document.createElement('li');
  li.innerHTML = `${resultMsg} Caminho: ${caminho}`;
  const afdResult = document.getElementById('afdResult');
  afdResult.appendChild(li);

  while (afdResult.children.length > 5) {
    afdResult.removeChild(afdResult.firstChild);
  }
}