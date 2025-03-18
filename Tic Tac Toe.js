// On créer un objet GameBoard afin d'y mettre un tableau 
// qui va contenir notre gameboard
function Gameboard() {
    const row = 3;
    const column = 3;
    const board = [];

    // On fait une copie de notre tableau array pour y stocker
    //  le nouveau array 
    // On ajoute une fonction cell() dans chaque row/column
    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(cell());
        }
        ;
    }

    function cell() {
        console.log("it works")
    }
    
};

