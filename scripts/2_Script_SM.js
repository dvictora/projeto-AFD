// Este arquivo contém a lógica para simular autômatos finitos determinísticos (AFDs) e atualizar a interface do usuário.
// AFD's pré-definidos em "const dfas".

const dfas = {
  1: {
    transitions: {
      "q0,0": "q1",
      "q0,1": "q0",
      "q1,0": "q1",
      "q1,1": "q0",
    },
  },
  2: {
    transitions: {
      "q0,0": "q1",
      "q0,1": "q0",
      "q1,0": "q0",
      "q1,1": "q1",
    },
  },
  3: {
    transitions: {
      "q0,0": "q0",
      "q0,1": "q1",
      "q1,0": "q1",
      "q1,1": "q2",
      "q2,0": "q2",
      "q2,1": "q3",
      "q3,0": "q3",
      "q3,1": "q3",
    },
  },
  4: {
    transitions: {
      "q0,0": "q1",
      "q0,1": "q2",
      "q1,0": "q1",
      "q1,1": "q1",
      "q2,0": "q2",
      "q2,1": "q2",
    },
  },
  5: {
    transitions: {
      "q0,0": "q1",
      "q0,1": "q3",
      "q1,0": "q1",
      "q1,1": "q2",
      "q2,0": "q1",
      "q2,1": "q2",
      "q3,0": "q4",
      "q3,1": "q3",
      "q4,0": "q4",
      "q4,1": "q3",
    },
  },
};

// A função `simulateDFA` simula o funcionamento de um AFD com base nas transições, estado inicial e estados de aceitação fornecidos.
function simulateDFA(transitions, startState, acceptStates, inputStr) {
  let state = startState;
  const history = [state];

  for (let symbol of inputStr) {
    const key = `${state},${symbol}`;
    if (transitions[key]) {
      state = transitions[key];
      history.push(state);
    } else {
      return { accepted: false, history };
    }
  }
  return { accepted: acceptStates.includes(state), history };
}

// Função para adicionar resultados ao histórico de testes
function addTestResult(result, accepted,) {
  const testHistory = document.getElementById("testHistory");
  const newItem = document.createElement("li");
  newItem.textContent = result;
  newItem.className = accepted ? "accepted" : "rejected"; // Adiciona a classe de cor
 
  testHistory.appendChild(newItem);

  // Limitar o número de itens a 5
  while (testHistory.children.length > 5) {
    testHistory.removeChild(testHistory.firstChild);
  }
}

// Função principal para testar o DFA
function testDFA() {
  const inputStr = document.getElementById("inputString").value.trim();
  const startState = document.getElementById("startState").value.trim();
  const acceptStates = document.getElementById("acceptStates").value.trim();
  const selectedDFA = document.getElementById("afdSelect").value;

  // Validação obrigatória para inicial e finais
  if (!startState) {
    alert("Defina o estado inicial!");
    return;
  }
  if (!acceptStates) {
    alert("Defina pelo menos um estado final!");
    return;
  }

  // Se veio um AFD personalizado pela URL, use ele
  if (afdSelecionado) {
    const transitions = afdSelecionado.afd.transicoes;
    const startState = document.getElementById("startState").value.trim();
    const acceptStates = document.getElementById("acceptStates").value.split(",").map(s => s.trim());
    const { accepted, history } = simulateDFA(
      transitions,
      startState,
      acceptStates,
      inputStr
    );

    // Atualizar Visualização de estados
    const historyUl = document.getElementById("history");
    historyUl.innerHTML = "";
    history.forEach((state) => {
      const li = document.createElement("li");
      li.textContent = `Estado: ${state}`;
      historyUl.appendChild(li);
    });

    // Adicionar resultado ao histórico de testes
    const resultText = `String: "${inputStr}" - Resultado: ${
      accepted ? "Aceita" : "Rejeitada"
    }`;
    addTestResult(resultText, accepted);
    return;
  }

  // Caso contrário, usa o AFD pré-definido
  if (!selectedDFA) {
    alert("Por favor, selecione um AFD.");
    return;
  }

  const dfaConfig = dfas[selectedDFA];
  if (!dfaConfig) {
    alert("Configuração do AFD não encontrada.");
    return;
  }

  const transitions = dfaConfig.transitions;
  const start = startState;
  const accepts = acceptStates.split(",").map(s => s.trim());
  const { accepted, history } = simulateDFA(
    transitions,
    start,
    accepts,
    inputStr
  );

  // Atualizar Visualização de estados
  const historyUl = document.getElementById("history");
  historyUl.innerHTML = "";
  history.forEach((state) => {
    const li = document.createElement("li");
    li.textContent = `Estado: ${state}`;
    historyUl.appendChild(li);
  });

  // Adicionar resultado ao histórico de testes
  const resultText = `String: "${inputStr}" - Resultado: ${
    accepted ? "Aceita" : "Rejeitada"
  }`;
  addTestResult(resultText, accepted);
}

// Função para obter o AFD da URL
function getAFDFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return null;
  const historico = JSON.parse(localStorage.getItem("historicoAFDs")) || [];
  return historico.find(item => String(item.id) === id);
}

const afdSelecionado = getAFDFromURL();
if (afdSelecionado) {
  document.getElementById("startState").value = afdSelecionado.afd.estadoInicial || "";
  document.getElementById("acceptStates").value = (afdSelecionado.afd.estadosFinais || []).join(",");

  const dfaImage = document.getElementById("dfaImage");
  const estados = afdSelecionado.afd.estados;
  const finais = afdSelecionado.afd.estadosFinais;
  const inicial = afdSelecionado.afd.estadoInicial;
  const transicoes = afdSelecionado.afd.transicoes;

  // Layout circular simples
  const svgWidth = 350, svgHeight = 300;
  const cx = svgWidth / 2, cy = svgHeight / 2, r = 80;
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" style="background:#ffffff;display:block;">`;

  // Calcula posições dos estados
  const pos = estados.map((_, i, arr) => {
    const ang = (2 * Math.PI * i) / arr.length;
    return {
      x: cx + r * Math.cos(ang),
      y: cy + r * Math.sin(ang)
    };
  });

  // Desenha transições (setas)
  Object.entries(transicoes).forEach(([chave, destino]) => {
    const [origem, simbolo] = chave.split(",");
    const i = estados.indexOf(origem);
    const j = estados.indexOf(destino);
    if (i === -1 || j === -1) return;
    const x1 = pos[i].x, y1 = pos[i].y, x2 = pos[j].x, y2 = pos[j].y;
    if (i === j) {
      // Loop (auto-transição)
      svg += `<path d="M${x1} ${y1-22} C ${x1-30} ${y1-50}, ${x1+30} ${y1-50}, ${x1} ${y1-22}" stroke="#198754" fill="none" stroke-width="2"/>
              <text x="${x1}" y="${y1-50}" font-size="20" fill="#198754" text-anchor="middle">${simbolo}</text>`;
    } else {
      const dx = x2 - x1, dy = y2 - y1;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const off = 28;
      const tx1 = x1 + (dx/dist)*off, ty1 = y1 + (dy/dist)*off;
      const tx2 = x2 - (dx/dist)*off, ty2 = y2 - (dy/dist)*off;
      svg += `<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10" fill="#198754"/></marker></defs>`;
      svg += `<line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="#198754" stroke-width="2" marker-end="url(#arrow)"/>`;
      svg += `<text x="${(tx1+tx2)/2}" y="${(ty1+ty2)/2 - 5}" font-size="13" fill="#198754" text-anchor="middle">${simbolo}</text>`;
    }
  });

  // Desenha estados (círculos)
  estados.forEach((estado, i) => {
    const x = pos[i].x, y = pos[i].y;
    const isFinal = finais.includes(estado);
    const isInicial = estado === inicial;
    svg += `<circle cx="${x}" cy="${y}" r="22" fill="#fff" stroke="#198754" stroke-width="3"/>`;
    if (isFinal) svg += `<circle cx="${x}" cy="${y}" r="17" fill="none" stroke="#198754" stroke-width="2"/>`;
    svg += `<text x="${x}" y="${y+5}" font-size="18" fill="#198754" text-anchor="middle">${estado}</text>`;
    if (isInicial) svg += `<text x="${x-30}" y="${y-20}" font-size="13" fill="#0d6efd" text-anchor="middle"></text>`;
  });

  svg += `</svg>`;
  dfaImage.innerHTML = svg;
  dfaImage.classList.remove("loader");
}

// Atualizar imagem do DFA com base na seleção
document.getElementById("afdSelect").addEventListener("change", function () {
  const selectedValue = this.value;
  const dfaImage = document.getElementById("dfaImage");

  let imgSrc = "";
  switch (selectedValue) {
    case "1":
      imgSrc = "../assets/imagens/const_1.svg";
      break;
    case "2":
      imgSrc = "../assets/imagens/const_2.svg";
      break;
    case "3":
      imgSrc = "../assets/imagens/const_3.svg";
      break;
    case "4":
      imgSrc = "../assets/imagens/const_4.svg";
      break;
    case "5":
      imgSrc = "../assets/imagens/const_5.svg";
      break;
    default:
      dfaImage.innerHTML = '<div class="loader"></div>';
      return;
  }
  dfaImage.innerHTML = `<img src="${imgSrc}" alt="DFA" style="max-width:100%;height:auto;">`;
  dfaImage.classList.remove("loader"); 
});

// Função que redesenha o SVG com os valores atuais dos inputs
function desenharSVGPersonalizado() {
  if (!afdSelecionado) return;
  const dfaImage = document.getElementById("dfaImage");
  const estados = afdSelecionado.afd.estados;
  const finais = document.getElementById("acceptStates").value.split(",").map(s => s.trim());
  const inicial = document.getElementById("startState").value.trim();
  const transicoes = afdSelecionado.afd.transicoes;

  // Layout circular simples
  const svgWidth = 350, svgHeight = 300;
  const cx = svgWidth / 2, cy = svgHeight / 2, r = 80;
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" style="background:#ffffff;display:block;">`;

  // Calcula posições dos estados
  const pos = estados.map((_, i, arr) => {
    const ang = (2 * Math.PI * i) / arr.length;
    return {
      x: cx + r * Math.cos(ang),
      y: cy + r * Math.sin(ang)
    };
  });

  // Desenha transições (setas)
  Object.entries(transicoes).forEach(([chave, destino]) => {
    const [origem, simbolo] = chave.split(",");
    const i = estados.indexOf(origem);
    const j = estados.indexOf(destino);
    if (i === -1 || j === -1) return;
    const x1 = pos[i].x, y1 = pos[i].y, x2 = pos[j].x, y2 = pos[j].y;
    if (i === j) {
      // Loop (auto-transição)
      svg += `<path d="M${x1} ${y1-22} C ${x1-30} ${y1-50}, ${x1+30} ${y1-50}, ${x1} ${y1-22}" stroke="#198754" fill="none" stroke-width="2"/>
              <text x="${x1}" y="${y1-50}" font-size="20" fill="#198754" text-anchor="middle">${simbolo}</text>`;
    } else {
      const dx = x2 - x1, dy = y2 - y1;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const off = 28;
      const tx1 = x1 + (dx/dist)*off, ty1 = y1 + (dy/dist)*off;
      const tx2 = x2 - (dx/dist)*off, ty2 = y2 - (dy/dist)*off;
      svg += `<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10" fill="#198754"/></marker></defs>`;
      svg += `<line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="#198754" stroke-width="2" marker-end="url(#arrow)"/>`;
      svg += `<text x="${(tx1+tx2)/2}" y="${(ty1+ty2)/2 - 5}" font-size="13" fill="#198754" text-anchor="middle">${simbolo}</text>`;
    }
  });

  // Desenha estados (círculos)
  estados.forEach((estado, i) => {
    const x = pos[i].x, y = pos[i].y;
    const isFinal = finais.includes(estado);
    const isInicial = estado === inicial;
    svg += `<circle cx="${x}" cy="${y}" r="22" fill="#fff" stroke="#198754" stroke-width="3"/>`;
    if (isFinal) svg += `<circle cx="${x}" cy="${y}" r="17" fill="none" stroke="#198754" stroke-width="2"/>`;
    svg += `<text x="${x}" y="${y+5}" font-size="18" fill="#198754" text-anchor="middle">${estado}</text>`;
    if (isInicial) svg += `<text x="${x-30}" y="${y-20}" font-size="13" fill="#0d6efd" text-anchor="middle"></text>`;
  });

  svg += `</svg>`;
  dfaImage.innerHTML = svg;
  dfaImage.classList.remove("loader");
}

document.getElementById("startState").addEventListener("input", desenharSVGPersonalizado);
document.getElementById("acceptStates").addEventListener("input", desenharSVGPersonalizado);
