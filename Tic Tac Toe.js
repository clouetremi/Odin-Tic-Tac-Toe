// On crée une fonction constructor Gameboard afin d'y mettre un tableau 
// qui va contenir notre gameboard
function Gameboard() {
    const row = 3;
    const column = 3;
    const board = [];

    // On fait une copie de notre tableau Board pour y stocker
    //  le nouveau array 
    // On ajoute une fonction cell() dans chaque row/column
    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(Cell());
        }
        ;
    }

    // La variable getBoard pour avoir une méthode 
    // afin d'obtenir tout notre board
    // car notre UI aura besoin de le mettre à jour
    const getBoard = () => board;



    // On crée notre méthode qui prend row, column et player en argument
    // si la valeur de notre cell dans row et column est vide
    // alors on applique la méthode addToken 
    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addToken(player);
        }
    }

    // Cette variable/méthode va servir à visu notre board dans la console
    // C'est utile de voir à quoi le board ressemble après chaque tour
    // On en aura pas besoin une fois qu'on aura construit notre UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    // On donne ensuite une interface pour le reste
    // de notre app afin de pouvoir interagir avec le board
    return { getBoard, dropToken, printBoard };

};


// On crée notre fonction constructor Cell()
// valeur de cell à 0 pour les cell vide
// et à 1 pour player1 puis 2 pour player2
function Cell() {

    let value = 0;

    // Accepte un jeton du joueur pour changer la valeur de cell
    const addToken = (player) => {
        value = player;
    };

    // variable pour retrouver la valeur actuelle de la cell à travers la closure
    const getValue = () => value;

    return {
        addToken, getValue
    }
}

// Le GameController va être en charge de contrôler 
// le flow et l'état des tours du jeu
// tout comme qui gagne le jeu
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const player = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = player[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player[0] ? player[1] : player[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        // Met un jeton dans le joueur actuel
        console.log(
            `Dropping ${getActivePlayer().name}'s token into row ${row} and ${column}...`
        );
        board.dropToken(row, column, getActivePlayer().token);
        if (checkWinner(board.getBoard(), getActivePlayer().token)) {
            console.log(`${getActivePlayer().name} a gagné !`);
        } else {
            switchPlayerTurn();
            printNewRound();
        }
    };

    // C'est ici qu'on va vérifier le gagnant 
    // et gérer cette logique
    // avec un message de victoire
    function checkWinner(board, playerToken) {
        const size = board.length;

        // Vérifie les lignes et les colonnes
        for (let i = 0; i < size; i++) {
            // Vérifie la ligne i
            if (board[i].every(cell => cell.getValue() === playerToken)) {
                return true;
            }

            // Vérifie la colonne i 
            if (board.every(row => row[i].getValue() === playerToken)) {
                return true;
            }
        }

        // Vérifie la diagonale principale (de haut gauche à bas-droite)
        if (board.every((row, i) => row[i].getValue() === playerToken)) {
            return true;
        }

        // Vérifie la diagonale principale (de haut-droite à bas-gauche)
        if (board.every((row, i) => row[size - 1 - i].getValue() === playerToken)) {
            return true;
        }
        return false;
    }

    // Message pour le début de jeu
    printNewRound();

    // Pour la version console, on utilise seulemennt playRound
    // mais on aura besoin de getActivePlayer pour notre UI
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        checkWinner
    };
}


function ScreenController() {
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const winnerDisplay = document.querySelector(".winner-display");

    const updateScreen = () => {
        boardDiv.textContent = "";

        // Obtenir la dernière version du board et du joueur
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        });
    };

    function displayWinner() {
        if (game.checkWinner(game.getBoard(), game.getActivePlayer().token)) {
            winnerDisplay.innerText = `the winner is ${game.getActivePlayer().name} !`
        }

    }

    function clickHandleBoard(e) {
        const selectedRow = parseInt(e.target.dataset.row);
        const selectedColumn = parseInt(e.target.dataset.column);
        if (selectedRow === undefined || selectedColumn === undefined) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
        displayWinner();
    }

    boardDiv.addEventListener("click", clickHandleBoard);


    updateScreen();

};

const game = GameController();
ScreenController();
