dfa5 = {
    "states": {"q0", "q1", "q2", "q3", "q4"},
    "alphabet": {"0", "1"},
    "transitions": {
        ("q0", "0"): "q1",
        ("q0", "1"): "q2",
        ("q1", "0"): "q1",
        ("q1", "1"): "q3",
        ("q2", "1"): "q2",
        ("q2", "0"): "q4",
        ("q3", "0"): "q1",
        ("q3", "1"): "q3",
        ("q4", "1"): "q2",
        ("q4", "0"): "q4"
    },
    "start": "q0",
    "accept": {"q1", "q2"}
}

def simulate_dfa(dfa, input_str):
    state = dfa["start"]
    for symbol in input_str:
        if (state, symbol) in dfa["transitions"]:
            state = dfa["transitions"][(state, symbol)]
        else:
            return False
    return state in dfa["accept"]


test_strings = ["0", "1", "01", "1001", "11011", "000"]
for s in test_strings:
    result = simulate_dfa(dfa5, s)
    print(f"{s}: {'Aceita' if result else 'Rejeita'}")
