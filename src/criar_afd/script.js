// Variáveis globais para armazenar o AFD
let estados = [];
let transicoes = {};
let estadoInicial = null;
let estadosFinais = [];
let cy;
let nodePositions = {}; // NOVO: armazena posições dos nós
let modoExclusao = false;
let elementoSelecionado = null;

document.addEventListener('DOMContentLoaded', function() {
  cy = cytoscape({
    container: document.getElementById('canvas'),
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#bad2e9', 
          'label': 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'width': 50,
          'height': 50,
          'border-width': 1,
          'border-color': '#000',
          'font-size': '17px'
        }
      },
      {
        selector: 'node.inicial',
        style: {
          'border-width': 4,
          'border-color': '#1cc422'
        }
      },
      {
        selector: 'node.final',
        style: {
          'border-width': 4,
          'border-color': '#e00808'
        }
      },
      {
        selector: 'node.visitado',
        style: {
          'background-color': '#1cc422'
        }
      },
      {
        selector: 'node.aceito',
        style: {
          'background-color': '#8BC34A'
        }
      },
      {
        selector: 'node.rejeitado',
        style: {
          'background-color': '#FF5722'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#000',
          'target-arrow-color': '#000',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': '17px',
          'text-background-color': '#fff',
          'text-background-opacity': 1,
          'text-background-padding': '2px'
        }
      }
    ],
    layout: {
      name: 'preset',
      fit: true,
      padding: 30
    }
  });

  atualizarCanvas();

  // Permite arrastar nós e salva posição
  cy.on('dragfree', 'node', function(event) {
    const node = event.target;
    nodePositions[node.id()] = node.position();
  });

  // Manipula cliques nos nós para criar transições
  cy.on('tap', 'node', function(evt) {
    if (modoExclusao) {
      tratarCliqueExclusao(evt.target);
      return;
    }
    if (!criandoTransicao) return;

    const noClicado = evt.target;

    if (noOrigemTransicao === null) {
      // Primeiro clique - definir origem
      noOrigemTransicao = noClicado;
      noClicado.addClass('visitado');
    } else {
      // Segundo clique - definir destino
      const simbolo = prompt("Digite o símbolo da transição:");
      const alfabeto = document.getElementById('alfabeto').value.split(',').map(s => s.trim());
      if (!simbolo || !alfabeto.includes(simbolo.trim())) {
        alert("Símbolo inválido ou fora do alfabeto!");
        noOrigemTransicao.removeClass('visitado');
        noOrigemTransicao = null;
        criandoTransicao = false;
        return;
      }
      const chave = `${noOrigemTransicao.id()},${simbolo.trim()}`;
      transicoes[chave] = noClicado.id();
      atualizarCanvas(); // Só atualiza aqui, após o segundo clique

      // Reseta o modo de transição
      noOrigemTransicao.removeClass('visitado');
      noOrigemTransicao = null;
      criandoTransicao = false;
    }
  });

  cy.on('tap', 'edge', function(evt) {
    if (modoExclusao) {
      tratarCliqueExclusao(evt.target);
      return;
    }
    // ...seu código normal de clique em aresta...
  });
});

// Função para atualizar a visualização do AFD
function atualizarCanvas() {
  if (!cy) return;

  // Salva as posições atuais dos nós antes de remover
  cy.nodes().forEach(node => {
    nodePositions[node.id()] = node.position();
  });

  cy.elements().remove();

  // Adiciona os nós (estados) com suas posições salvas ou novas posições
  estados.forEach(estado => {
    const posicao = nodePositions[estado] || {
      x: 300 + (Math.random() * 100 - 50),
      y: 200 + (Math.random() * 100 - 50)
    };

    cy.add({
      group: 'nodes',
      data: { id: estado, label: estado },
      position: posicao
    });
  });

  // Adiciona as arestas (transições)
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

  // Só aplica layout automático se não houver posições salvas
  if (Object.keys(nodePositions).length === 0) {
    cy.layout({
      name: 'circle',
      fit: true,
      padding: 30
    }).run();
  }
}

// Adicionar Estado
function adicionarEstado() {
  const nome = prompt("Nome do estado (ex: q0):");
  if (nome && nome.trim() !== '') {
    const nomeFormatado = nome.trim();
    if (!estados.includes(nomeFormatado)) {
      estados.push(nomeFormatado);

      // Posiciona novo nó próximo ao centro
      nodePositions[nomeFormatado] = {
        x: 300 + (Math.random() * 100 - 50),
        y: 200 + (Math.random() * 100 - 50)
      };

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
  nodePositions = {}; // Limpa posições também
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

  // Remove classe visitado de todos antes de começar
  cy.nodes().removeClass('visitado');
  // Destaca o estado inicial
  cy.$id(estadoAtual).addClass('visitado');

  let i = 0;
  const interval = setInterval(() => {
    if (i >= entrada.length) {
      clearInterval(interval);

      const aceito = estadosFinais.includes(estadoAtual);
      // Destaca o estado final (aceito ou rejeitado)
      cy.$id(estadoAtual).addClass(aceito ? 'aceito' : 'rejeitado');

      setTimeout(() => {
        alert(`A string foi ${aceito ? 'ACEITA' : 'REJEITADA'}!\nCaminho: ${caminho.join(' → ')}`);
        // Remove destaques temporários
        cy.nodes().removeClass('visitado aceito rejeitado');
      }, 150);

      return;
    }

    const simbolo = entrada[i];
    const chave = `${estadoAtual},${simbolo}`;

    if (transicoes[chave]) {
      // Remove destaque do estado atual
      cy.$id(estadoAtual).removeClass('visitado');

      // Atualiza para o próximo estado
      estadoAtual = transicoes[chave];
      caminho.push(estadoAtual);

      // Destaca o novo estado atual
      cy.$id(estadoAtual).addClass('visitado');

      i++;
    } else {
      clearInterval(interval);
      cy.$id(estadoAtual).addClass('rejeitado');
      alert(`Transição não definida para (${estadoAtual}, ${simbolo})`);
      setTimeout(() => {
        cy.nodes().removeClass('visitado aceito rejeitado');
      }, 150);
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

// (Opcional) Botão para reorganizar estados
function reorganizarEstados() {
  nodePositions = {};
  cy.layout({
    name: 'circle',
    fit: true,
    padding: 30,
    animate: true
  }).run();
}

// Novo: Ativar modo de exclusão
function ativarModoExclusao() {
  modoExclusao = true;
  cy.nodes().style('border-color', '#ff0000');
  cy.edges().style('line-color', '#ff0000');
  // Verifica se o usuário já pediu para não mostrar novamente
  if (!localStorage.getItem('naoMostrarAlertaExclusao')) {
    const naoMostrar = confirm(
      "Modo de exclusão ativado. Clique no elemento que deseja remover.\n\nMarque OK para não mostrar novamente."
    );
    if (naoMostrar) {
      localStorage.setItem('naoMostrarAlertaExclusao', '1');
    }
  }
}

function desativarModoExclusao() {
  modoExclusao = false;
  if (elementoSelecionado) {
    elementoSelecionado.unselect();
    elementoSelecionado = null;
  }
  atualizarCanvas(); // Restaura as cores corretas dos nós e arestas
}

function tratarCliqueExclusao(target) {
  if (elementoSelecionado) {
    elementoSelecionado.unselect();
  }
  target.select();
  elementoSelecionado = target;

  const tipo = target.isNode() ? 'estado' : 'transição';
  const confirmacao = confirm(`Deseja remover este ${tipo}?`);

  if (confirmacao) {
    if (target.isNode()) {
      removerEstado(target.id());
    } else {
      removerTransicao(target.data('source'), target.data('label'));
    }
    atualizarCanvas();
  }
  desativarModoExclusao();
}

function removerEstado(estado) {
  estados = estados.filter(e => e !== estado);
  Object.keys(transicoes).forEach(key => {
    if (key.startsWith(estado + ',') || transicoes[key] === estado) {
      delete transicoes[key];
    }
  });
  if (estadoInicial === estado) estadoInicial = null;
  estadosFinais = estadosFinais.filter(e => e !== estado);
  delete nodePositions[estado];
}

function removerTransicao(origem, simbolo) {
  delete transicoes[`${origem},${simbolo}`];
}

