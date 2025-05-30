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
          'border-width': 3,
          'border-color': '#4CAF50'
        }
      },
      {
        selector: 'node.final',
        style: {
          'border-width': 3,
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
      if (simbolo && simbolo.trim() !== '') {
        const chave = `${noOrigemTransicao.id()},${simbolo.trim()}`;
        transicoes[chave] = noClicado.id();
        atualizarCanvas();
      }
      
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
  // Limpa todos os elementos existentes
  cy.elements().remove();

  // Adiciona os nós (estados)
  estados.forEach(estado => {
    cy.add({
      group: 'nodes',
      data: { id: estado, label: estado },
      classes: [
        estado === estadoInicial ? 'inicial' : '',
        estadosFinais.includes(estado) ? 'final' : ''
      ].join(' ')
    });
  });

  // Adiciona as arestas (transições)
  Object.entries(transicoes).forEach(([key, destino]) => {
    const [origem, simbolo] = key.split(',');
    cy.add({
      group: 'edges',
      data: { 
        id: `${origem}-${destino}-${simbolo}`,
        source: origem, 
        target: destino, 
        label: simbolo 
      }
    });
  });

  // Aplica um layout para organizar os nós
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
  criandoTransicao = true;
  noOrigemTransicao = null;
  alert("Modo de criação de transição ativado. Clique no estado de origem e depois no estado de destino.");
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
  const entrada = document.getElementById('entrada').value.trim();
  
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