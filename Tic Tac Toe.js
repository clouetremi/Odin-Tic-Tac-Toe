function Gameboard() {
    const row = 3;
    const column = 3;
    const board = [];

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(Cell());
        }
        ;
    }

    const getBoard = () => board;

    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addToken(player);
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, dropToken, printBoard };

};

function Cell() {

    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken, getValue
    }
}

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

    function checkWinner(board, playerToken) {
        const size = board.length;

        for (let i = 0; i < size; i++) {
            if (board[i].every(cell => cell.getValue() === playerToken)) {
                return true;
            }
            if (board.every(row => row[i].getValue() === playerToken)) {
                return true;
            }
        }
        if (board.every((row, i) => row[i].getValue() === playerToken)) {
            return true;
        }
        if (board.every((row, i) => row[size - 1 - i].getValue() === playerToken)) {
            return true;
        }
        return false;
    }


    printNewRound();

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
    const btnRestartGame = document.querySelector(".btn-restart-game");

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


    let gameOver = false;

    function clickHandleBoard(e) {
        if (gameOver) return;

        const selectedRow = parseInt(e.target.dataset.row);
        const selectedColumn = parseInt(e.target.dataset.column);
        if (selectedRow === undefined || selectedColumn === undefined) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
        displayWinner();
    }

    function displayWinner() {
        if (game.checkWinner(game.getBoard(), game.getActivePlayer().token)) {
            winnerDisplay.innerText = `the winner is ${game.getActivePlayer().name} !`
        } else if (game.getBoard().flat().every(cell => cell.getValue() !== 0)) {
            winnerDisplay.innerText = "It's a draw!";
            gameOver = true;
        };
    };

    btnRestartGame.addEventListener("click", () => {
        game = GameController();
        updateScreen();
        winnerDisplay.innerText = "";
    });

    boardDiv.addEventListener("click", clickHandleBoard);


    updateScreen();

};



let game = GameController();
ScreenController();
