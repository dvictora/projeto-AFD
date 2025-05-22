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

document.getElementById('afdForm').onsubmit = function(e) {
  e.preventDefault();

  // Coleta dos dados do formulário
  const estados = document.getElementById('states').value.split(',').map(s => s.trim());
  const alfabeto = document.getElementById('alphabet').value.split(',').map(s => s.trim());
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
    transicoes[origem.trim() + ',' + simbolo.trim()] = dest.trim();
  }

  // Simula o AFD
  const resultado = simularAFD(estados, alfabeto, inicial, finais, transicoes, entrada);

  // Mostra o resultado
  document.getElementById('afdResult').innerText = resultado
    ? 'A string foi ACEITA pelo AFD!'
    : 'A string foi REJEITADA pelo AFD.';
};