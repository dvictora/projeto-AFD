# Projeto AFD

Este projeto é um simulador de Autômatos Finitos Determinísticos (AFDs). Ele permite que os usuários testem strings em relação a diferentes AFDs pré-definidos e também criem seus próprios AFDs para testes.

---

## Estrutura do Projeto

- **main/index.html**: Página principal da aplicação. Inclui campos de entrada para o usuário inserir uma string, estado inicial e estados de aceitação, além de um dropdown para selecionar um AFD pré-definido e um botão para executar o teste do AFD.
- **main/create-dfa.html**: Página onde os usuários podem criar seus próprios AFDs para testes. Inclui campos de entrada para definir estados, transições e estados de aceitação, juntamente com um botão para salvar ou testar o AFD criado.
- **main/style.css**: Arquivo de estilos para as páginas HTML, definindo o layout, cores, fontes e outros aspectos visuais da aplicação.
- **main/script.js**: Código JavaScript que gerencia a lógica para testar AFDs, incluindo funções para processar a entrada do usuário, executar testes de AFD e atualizar a interface do usuário com base nos resultados.

---

## Como Usar

1. Acesse a página principal (`index.html`) para visualizar o dashboard do projeto.
2. Para testar um AFD existente, utilize a opção de exemplos ou simulador disponível no menu.
3. Para criar seu próprio AFD, acesse a página de criação (por exemplo, `src/criar_afd/index.html` ou pelo botão "Criar AFD" no dashboard).
4. Na interface de criação, adicione estados, defina o alfabeto, crie transições, marque o estado inicial e os estados finais.
5. Insira a string de entrada e clique em **Executar** para simular o funcionamento do seu AFD.
6. Você pode salvar, limpar ou reorganizar o autômato conforme desejar pela própria interface.


## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorias e correções.