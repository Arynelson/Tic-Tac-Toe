document.addEventListener("DOMContentLoaded", () => {
    // Elementos DOM importantes
    const setupScreen = document.getElementById("game-setup"); // Tela de configuração inicial
    const gameBoard = document.getElementById("game-board"); // Tela do tabuleiro
    const playerModeSelect = document.getElementById("player-mode"); // Seleção de modo de jogo
    const player1Input = document.getElementById("player1-name"); // Campo de texto para Jogador 1
    const player2Input = document.getElementById("player2-name"); // Campo de texto para Jogador 2
    const startButton = document.getElementById("start-game"); // Botão "Iniciar Jogo"
    const resetButton = document.getElementById("reset-game"); // Botão "Reiniciar"
    const playerTurnDisplay = document.getElementById("player-turn"); // Exibição de turno
    const cells = document.querySelectorAll(".cell"); // Todas as células do tabuleiro
  
    
    let board = Array(9).fill(null); // Representação do tabuleiro
    let currentPlayer = "X"; // Jogador atual (X ou O)
    let player1 = ""; // Nome do Jogador 1
    let player2 = "Computador"; // Nome do Jogador 2 ou Computador
    let isSinglePlayer = true; // Controle de modo de jogo (true = 1 jogador)
  
    
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
      [0, 4, 8], [2, 4, 6] // Diagonais
    ];
  
    // Mensagens aleatórias para o vencedor
    const randomMessages = [
      "Parabéns, você é incrível!",
      "Mandou muito bem!",
      "Você é o(a) grande campeão(ã)!",
      "Jogo espetacular!",
      "Que jogada fantástica!"
    ];
  
    /**
     * Função para iniciar o jogo
     * Configura os nomes dos jogadores e alterna para a tela do tabuleiro.
     */
    function startGame() {
      const mode = playerModeSelect.value; // Verifica se é 1 jogador ou 2 jogadores
      isSinglePlayer = mode === "1"; // Define o modo de jogo (1 jogador ou 2)
      player1 = player1Input.value || "Jogador 1"; // Nome do Jogador 1
      player2 = isSinglePlayer ? "Computador" : (player2Input.value || "Jogador 2"); // Nome do Jogador 2 ou Computador
  
      // Alterna as telas: oculta a tela de configuração e mostra o tabuleiro
      setupScreen.classList.add("hidden");
      gameBoard.classList.remove("hidden");
  
      updatePlayerTurn(); // Exibe quem inicia o jogo
    }
  
    /**
     * Atualiza a exibição do turno atual no topo da tela.
     */
    function updatePlayerTurn() {
      playerTurnDisplay.textContent = `Turno de: ${currentPlayer === "X" ? player1 : player2}`;
    }
  
    /**
     * Verifica se há um vencedor ou empate no jogo.
     * @returns {string|null} Retorna "X", "O", "Empate" ou null se o jogo continuar.
     */
    function checkWinner() {
      for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a]; // Retorna "X" ou "O" se houver vencedor
        }
      }
      return board.includes(null) ? null : "Empate"; // Retorna "Empate" ou null
    }
  
    /**
     * Realiza o movimento do computador em modo 1 jogador.
     */
    function computerMove() {
      let emptyCells = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
      let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]; // Escolhe uma célula aleatória vazia
      board[randomCell] = "O"; // Marca a célula como "O"
      cells[randomCell].textContent = "O";
      cells[randomCell].classList.add("taken");
    }
  
    /**
     * Gerencia o clique do jogador em uma célula do tabuleiro.
     */
    function handleCellClick(event) {
      const index = event.target.dataset.index; // Índice da célula clicada
  
      // Ignora cliques em células já ocupadas
      if (board[index] || event.target.classList.contains("taken")) return;
  
      // Marca a célula clicada com o símbolo do jogador atual
      board[index] = currentPlayer;
      event.target.textContent = currentPlayer;
      event.target.classList.add("taken");
  
      // Verifica se há um vencedor ou empate
      const winner = checkWinner();
  
      if (winner) {
        alert(
          winner === "Empate"
            ? "O jogo terminou em empate!"
            : `${winner === "X" ? player1 : player2} venceu! ${randomMessages[Math.floor(Math.random() * randomMessages.length)]}`
        );
        resetToSetup(); // Reinicia o jogo para a tela inicial
        return;
      }
  
      // Alterna o jogador
      currentPlayer = currentPlayer === "X" ? "O" : "X";
  
      // Se for o turno do computador em modo 1 jogador, realiza o movimento
      if (isSinglePlayer && currentPlayer === "O") {
        computerMove();
        const winnerAfterComputer = checkWinner();
        if (winnerAfterComputer) {
          alert(
            winnerAfterComputer === "Empate"
              ? "O jogo terminou em empate!"
              : `${player2} venceu! ${randomMessages[Math.floor(Math.random() * randomMessages.length)]}`
          );
          resetToSetup(); // Reinicia o jogo para a tela inicial
        }
        currentPlayer = "X";
      }
  
      updatePlayerTurn(); // Atualiza o turno exibido
    }
  
    /**
     * Reinicia o jogo e volta para a tela inicial.
     */
    function resetToSetup() {
      board.fill(null); // Limpa o tabuleiro
      cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken"); // Remove classes de células ocupadas
      });
      currentPlayer = "X"; // Reseta o jogador inicial
      setupScreen.classList.remove("hidden"); // Mostra a tela de configuração inicial
      gameBoard.classList.add("hidden"); // Oculta o tabuleiro
      player1Input.value = ""; // Limpa o campo de nome do Jogador 1
      player2Input.value = ""; // Limpa o campo de nome do Jogador 2
    }
  
    // Adiciona eventos aos botões e células
    startButton.addEventListener("click", startGame); // Inicia o jogo
    resetButton.addEventListener("click", resetToSetup); // Reinicia o jogo para a tela inicial
    cells.forEach(cell => cell.addEventListener("click", handleCellClick)); // Gerencia cliques nas células do tabuleiro
  });
  