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
  const selectedDFA = document.getElementById("afdSelect").value;
  const startStateInput = document.getElementById("startState").value.trim();
  const acceptStatesInput = document.getElementById("acceptStates").value.trim();

  // Validação de entrada
  if (!selectedDFA) {
    alert("Por favor, selecione um AFD.");
    return;
  }
  if (!inputStr) {
    alert("Por favor, insira uma string de entrada.");
    return;
  }

  const dfaConfig = dfas[selectedDFA];
  if (!dfaConfig) {
    alert("Configuração do AFD não encontrada.");
    return;
  }

  const transitions = dfaConfig.transitions;
  const startState = startStateInput || "q0"; // Estado inicial padrão
  const acceptStates = acceptStatesInput
    ? acceptStatesInput.split(",").map((s) => s.trim())
    : ["q1"]; // Estados de aceitação padrão

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
  addTestResult(resultText, accepted,);
}

// Atualizar imagem do DFA com base na seleção
document.getElementById("afdSelect").addEventListener("change", function () {
  const selectedValue = this.value;
  const dfaImage = document.getElementById("dfaImage");

  // Atualize o caminho da imagem com base na seleção
  switch (selectedValue) {
    case "1":
      dfaImage.src = "images/const_1.svg"; // Caminho para a imagem do AFD 1
      break;
    case "2":
      dfaImage.src = "images/const_2.svg"; // Caminho para a imagem do AFD 2
      break;
    case "3":
      dfaImage.src = "images/const_3.svg"; // Caminho para a imagem do AFD 3
      break;
    case "4":
      dfaImage.src = "images/const_4.svg"; // Caminho para a imagem do AFD 4
      break;
    case "5":
      dfaImage.src = "images/const_5.svg"; // Caminho para a imagem do AFD 5
      break;
    default:
      dfaImage.src = "images/gif.gif"; // Caminho para a imagem padrão
  }
});
