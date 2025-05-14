const dfas = {
    1: {
      transitions: {
        "q0,0": "q1",
        "q0,1": "q0",
        "q1,0": "q1",
        "q1,1": "q0"
      },
    },
    2: {
      transitions: {
        "q0,0": "q1",
        "q0,1": "q0",
        "q1,0": "q0",
        "q1,1": "q1"
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
        "q3,1": "q3"
      },
      
    },
    4: {
      transitions: {
        "q0,a": "q1",
        "q0,b": "q2",
        "q1,a": "q1",
        "q1,b": "q1",
        "q2,a": "q2",
        "q2,b": "q2"
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
          "q4,1": "q3"
    },
  }
  };

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

  function testDFA() {
  const inputStr = document.getElementById("inputString").value.trim();
  const selectedDFA = document.getElementById("afdSelect").value; // Obtenha o valor selecionado diretamente
  const startStateInput = document.getElementById("startState").value.trim();
  const acceptStatesInput = document.getElementById("acceptStates").value.trim();

  const dfaConfig = dfas[selectedDFA];
  const transitions = dfaConfig.transitions;
  const startState = startStateInput || dfaConfig.defaultStartState;
  const acceptStates = acceptStatesInput
    ? acceptStatesInput.split(",").map((s) => s.trim())
    : dfaConfig.defaultAcceptStates;

  const { accepted, history } = simulateDFA(
    transitions,
    startState,
    acceptStates,
    inputStr
  );

  // Atualizar histórico de estados
  const historyUl = document.getElementById("history");
  historyUl.innerHTML = "";
  history.forEach((state) => {
    const li = document.createElement("li");
    li.textContent = `Estado: ${state}`;
    historyUl.appendChild(li);
  });

  // Adicionar resultado ao histórico de testes
  const testHistoryUl = document.getElementById("testHistory");
  const resultItem = document.createElement("li");
  resultItem.textContent = `String: "${inputStr}" - Resultado: ${
    accepted ? "Aceita" : "Rejeitada"
  }`;
  resultItem.className = accepted ? "accepted" : "rejected";
  testHistoryUl.appendChild(resultItem);
  };
  

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
