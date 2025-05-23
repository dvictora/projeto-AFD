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
  const inicial = document.getElementById('start').value.trim();
  const finais = document.getElementById('accept').value.split(',').map(s => s.trim());
  const transicoesInput = document.getElementById('transitions').value.split(';');
  const entrada = document.getElementById('testString').value.trim();

  // Monta o objeto de transições
  let transicoes = {};
  for (let t of transicoesInput) {
    if (t.trim() === '') continue;
    let [esq, dest] = t.split('=');
    let [origem, simbolo] = esq.split(',');
    transicoes[origem.trim() + ',' + simbolo.trim()] = dest.trim().trim();
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
    // Garante que a comparação não falhe por espaços extras
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