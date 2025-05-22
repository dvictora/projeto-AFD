# Projeto AFD

Este projeto é um simulador de Autômatos Finitos Determinísticos (AFDs). Ele permite que os usuários testem strings em relação a diferentes AFDs pré-definidos e também criem seus próprios AFDs para testes.

## Estrutura do Projeto

O projeto contém os seguintes arquivos:

- **main/index.html**: Página principal da aplicação. Inclui campos de entrada para o usuário inserir uma string, estado inicial e estados de aceitação, além de um dropdown para selecionar um AFD pré-definido e um botão para executar o teste do AFD.

- **main/create-dfa.html**: Página onde os usuários podem criar seus próprios AFDs para testes. Inclui campos de entrada para definir estados, transições e estados de aceitação, juntamente com um botão para salvar ou testar o AFD criado.

- **main/style.css**: Arquivo de estilos para as páginas HTML, definindo o layout, cores, fontes e outros aspectos visuais da aplicação.

- **main/script.js**: Código JavaScript que gerencia a lógica para testar AFDs, incluindo funções para processar a entrada do usuário, executar testes de AFD e atualizar a interface do usuário com base nos resultados.

## Como Usar

1. Abra o arquivo `index.html` em um navegador para acessar a página principal do simulador.
2. Insira a string que deseja testar, o estado inicial e os estados de aceitação.
3. Selecione um AFD pré-definido e clique no botão "Executar" para testar a string.
4. Para criar um novo AFD, acesse a página `create-dfa.html` e preencha os campos necessários para definir seu AFD.
5. Salve ou teste o AFD criado conforme necessário.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorias e correções.