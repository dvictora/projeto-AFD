// Variáveis globais para armazenar o AFD
let estados = []; // Ex: ["q0", "q1"]
let transicoes = {}; // Ex: { "q0,0": "q1", "q1,1": "q0" }
let estadoInicial = null;
let estadosFinais = [];
let cy; // Variável global para o Cytoscape

// Inicializa o Cytoscape quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  cy = cytoscape({
    container: document.getElementById('canvas'),
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'width': 40,
          'height': 40,
          'border-width': 2,
          'border-color': '#fff',
          'font-size': '12px'
        }
      },
      {
        selector: 'node.inicial',
        style: {
          'border-width': 4,
          'border-color': '#4CAF50'
        }
      },
      {
        selector: 'node.final',
        style: {
          'border-width': 4,
          'border-color': '#FF5722'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#999',
          'target-arrow-color': '#999',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': '10px',
          'text-background-color': '#fff',
          'text-background-opacity': 1,
          'text-background-padding': '2px'
        }
      }
    ],
    layout: {
      name: 'circle'
    }
  });

  // Atualiza o canvas inicialmente
  atualizarCanvas();

  // Manipula cliques nos nós para criar transições
  cy.on('tap', 'node', function(evt) {
    if (!criandoTransicao) return;

    const noClicado = evt.target;

    if (noOrigemTransicao === null) {
      // Primeiro clique - definir origem
      noOrigemTransicao = noClicado;
      noClicado.style('border-color', 'red');
    } else {
      // Segundo clique - definir destino
      const simbolo = prompt("Digite o símbolo da transição:");
      const alfabeto = document.getElementById('alfabeto').value.split(',').map(s => s.trim());
      if (!simbolo || !alfabeto.includes(simbolo.trim())) {
        alert("Símbolo inválido ou fora do alfabeto!");
        noOrigemTransicao.style('border-color', '#fff');
        noOrigemTransicao = null;
        criandoTransicao = false;
        return;
      }
      const chave = `${noOrigemTransicao.id()},${simbolo.trim()}`;
      transicoes[chave] = noClicado.id();
      atualizarCanvas(); // Só atualiza aqui, após o segundo clique

      // Reseta o modo de transição
      noOrigemTransicao.style('border-color', '#fff');
      noOrigemTransicao = null;
      criandoTransicao = false;
    }
  });
});

// Função para atualizar a visualização do AFD
function atualizarCanvas() {
  if (!cy) return;

  // Adiciona apenas novos nós
  estados.forEach(estado => {
    if (cy.$id(estado).length === 0) {
      cy.add({
        group: 'nodes',
        data: { id: estado, label: estado },
        classes: [
          estado === estadoInicial ? 'inicial' : '',
          estadosFinais.includes(estado) ? 'final' : ''
        ].join(' ')
      });
    }
  });

  // Remove nós que não existem mais
  cy.nodes().forEach(node => {
    if (!estados.includes(node.id())) {
      cy.remove(node);
    }
  });

  // Adiciona apenas novas arestas
  Object.entries(transicoes).forEach(([key, destino]) => {
    const [origem, simbolo] = key.split(',');
    const edgeId = `${origem}-${destino}-${simbolo}`;
    if (cy.$id(edgeId).length === 0) {
      cy.add({
        group: 'edges',
        data: { 
          id: edgeId,
          source: origem, 
          target: destino, 
          label: simbolo 
        }
      });
    }
  });

  // Remove arestas que não existem mais
  cy.edges().forEach(edge => {
    const origem = edge.source().id();
    const destino = edge.target().id();
    const simbolo = edge.data('label');
    const key = `${origem},${simbolo}`;
    if (!transicoes[key] || transicoes[key] !== destino) {
      cy.remove(edge);
    }
  });

  // Atualiza classes dos nós (inicial/final)
  cy.nodes().forEach(node => {
    node.removeClass('inicial');
    node.removeClass('final');
  });
  if (estadoInicial) {
    cy.$id(estadoInicial).addClass('inicial');
  }
  estadosFinais.forEach(final => {
    cy.$id(final).addClass('final');
  });

  // Reaplica o layout para organizar
  cy.layout({ name: 'circle' }).run();
}

// Adicionar Estado
function adicionarEstado() {
  const nome = prompt("Nome do estado (ex: q0):");
  if (nome && nome.trim() !== '') {
    const nomeFormatado = nome.trim();
    if (!estados.includes(nomeFormatado)) {
      estados.push(nomeFormatado);
      atualizarCanvas();
    } else {
      alert("Estado já existe!");
    }
  }
}

// Variáveis para controle de criação de transição
let criandoTransicao = false;
let noOrigemTransicao = null;

// Ativar modo de criação de transição
function ativarModoTransicao() {
  if (estados.length < 2) {
    alert("Adicione pelo menos dois estados para criar uma transição!");
    return;
  }
  // Verifica se o usuário já pediu para não mostrar novamente
  if (!localStorage.getItem('naoMostrarAlertaTransicao')) {
    // Mostra o alerta com opção de não mostrar novamente
    const naoMostrar = confirm("Modo de criação de transição ativado. Clique no estado de origem e depois no estado de destino.\n\nMarque OK para não mostrar novamente.");
    if (naoMostrar) {
      localStorage.setItem('naoMostrarAlertaTransicao', '1');
    }
  }
  criandoTransicao = true;
  noOrigemTransicao = null;
}

// Definir Estado Inicial
function definirInicial() {
  if (estados.length === 0) {
    alert("Adicione estados primeiro!");
    return;
  }
  
  const nome = prompt(`Qual estado será o inicial? (Estados: ${estados.join(', ')})`);
  if (nome && estados.includes(nome.trim())) {
    estadoInicial = nome.trim();
    atualizarCanvas();
  } else {
    alert("Estado inválido!");
  }
}

// Definir Estado Final
function definirFinal() {
  if (estados.length === 0) {
    alert("Adicione estados primeiro!");
    return;
  }
  
  const nome = prompt(`Qual estado será final? (Estados: ${estados.join(', ')})`);
  if (nome && estados.includes(nome.trim())) {
    if (!estadosFinais.includes(nome.trim())) {
      estadosFinais.push(nome.trim());
      atualizarCanvas();
    } else {
      alert("Este estado já é final!");
    }
  } else {
    alert("Estado inválido!");
  }
}

// Limpar Tudo
function limparTudo() {
  estados = [];
  transicoes = {};
  estadoInicial = null;
  estadosFinais = [];
  atualizarCanvas();
}

// Testar String
function testarString() {
  const alfabeto = document.getElementById('alfabeto').value.split(',').map(s => s.trim());
  const entrada = document.getElementById('entrada').value.trim();

  if (!validarStringComAlfabeto(entrada, alfabeto)) {
    document.getElementById('log').innerText = "A string de entrada contém símbolos fora do alfabeto permitido!";
    return;
  }

  if (!estadoInicial) {
    alert("Defina um estado inicial primeiro!");
    return;
  }
  
  if (estadosFinais.length === 0) {
    alert("Defina pelo menos um estado final!");
    return;
  }
  
  if (entrada === '') {
    alert("Digite uma string para testar!");
    return;
  }
  
  let estadoAtual = estadoInicial;
  const caminho = [estadoAtual];
  
  // Destaque o estado inicial
  cy.$(`#${estadoAtual}`).style('background-color', '#4CAF50');
  
  // Simula passo a passo com delay para animação
  let i = 0;
  const interval = setInterval(() => {
    if (i >= entrada.length) {
      clearInterval(interval);
      
      // Verifica se terminou em estado final
      const aceito = estadosFinais.includes(estadoAtual);
      
      // Destaque o estado final
      cy.$(`#${estadoAtual}`).style('background-color', aceito ? '#8BC34A' : '#FF5722');
      
      setTimeout(() => {
        alert(`A string foi ${aceito ? 'ACEITA' : 'REJEITADA'}!\nCaminho: ${caminho.join(' → ')}`);
        
        // Resetar cores
        cy.nodes().style('background-color', '#666');
      }, 500);
      
      return;
    }
    
    const simbolo = entrada[i];
    const chave = `${estadoAtual},${simbolo}`;
    
    if (transicoes[chave]) {
      // Remove destaque do estado atual
      cy.$(`#${estadoAtual}`).style('background-color', '#666');
      
      // Atualiza para o próximo estado
      estadoAtual = transicoes[chave];
      caminho.push(estadoAtual);
      
      // Destaque o novo estado atual
      cy.$(`#${estadoAtual}`).style('background-color', '#4CAF50');
      
      i++;
    } else {
      clearInterval(interval);
      cy.$(`#${estadoAtual}`).style('background-color', '#FF5722');
      alert(`Transição não definida para (${estadoAtual}, ${simbolo})`);
      setTimeout(() => {
        cy.nodes().style('background-color', '#666');
      }, 500);
      return;
    }
  }, 800);
}

// Função para validar string com alfabeto
function validarStringComAlfabeto(str, alfabeto) {
  for (let c of str) {
    if (!alfabeto.includes(c)) return false;
  }
  return true;
}

function criarTransicao() {
  const alfabeto = document.getElementById('alfabeto').value.split(',').map(s => s.trim());
  const origem = prompt("Estado de origem:");
  const simbolo = prompt("Símbolo:");
  const destino = prompt("Estado de destino:");
  if (!origem || !destino || !simbolo) {
    alert("Preencha todos os campos!");
    return;
  }
  if (!estados.includes(origem.trim()) || !estados.includes(destino.trim())) {
    alert("Estados de origem/destino inválidos!");
    return;
  }
  if (!alfabeto.includes(simbolo.trim())) {
    alert("Símbolo não pertence ao alfabeto definido!");
    return;
  }
  const chave = `${origem.trim()},${simbolo.trim()}`;
  transicoes[chave] = destino.trim();
  atualizarCanvas();
}