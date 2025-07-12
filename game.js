let currentplayer = "x";
    let arr = Array(9).fill(null);
    let gameOver = false;

    function checkwinner() {
      if (
        (arr[0] !== null && arr[0] == arr[1] && arr[1] == arr[2]) ||
        (arr[3] !== null && arr[3] == arr[4] && arr[4] == arr[5]) ||
        (arr[6] !== null && arr[6] == arr[7] && arr[7] == arr[8]) ||
        (arr[0] !== null && arr[0] == arr[3] && arr[3] == arr[6]) ||
        (arr[1] !== null && arr[1] == arr[4] && arr[4] == arr[7]) ||
        (arr[2] !== null && arr[2] == arr[5] && arr[5] == arr[8]) ||
        (arr[2] !== null && arr[2] == arr[4] && arr[4] == arr[6]) ||
        (arr[0] !== null && arr[0] == arr[4] && arr[4] == arr[8])
      ) {
        document.getElementById("status").innerText = `Winner is ${currentplayer}`;
        gameOver = true;
        return;
      }

      if (!arr.some((e) => e === null)) {
        document.getElementById("status").innerText = "Draw!!";
        gameOver = true;
        return;
      }
    }

    function clickone(el) {
      if (gameOver) return;

      const id = Number(el.id);
      if (arr[id] !== null) return;

      arr[id] = currentplayer;
      el.innerText = currentplayer;

      checkwinner();

      if (!gameOver) {
        currentplayer = currentplayer === "x" ? "o" : "x";
      }
    }