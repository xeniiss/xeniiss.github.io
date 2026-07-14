const header = document.querySelector("[data-nav]");
const navToggle = document.querySelector(".nav-toggle");
const yearNode = document.querySelector("[data-year]");
const gameShell = document.querySelector("[data-game-shell]");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (header && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.getAttribute("data-nav-open") === "true";
    const nextState = String(!isOpen);
    header.setAttribute("data-nav-open", nextState);
    navToggle.setAttribute("aria-expanded", nextState);
  });

  header.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.setAttribute("data-nav-open", "false");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (gameShell) {
  const difficultySelect = gameShell.querySelector("[data-difficulty]");
  const roundsSelect = gameShell.querySelector("[data-rounds]");
  const pauseButton = gameShell.querySelector("[data-pause]");
  const restartButton = gameShell.querySelector("[data-restart]");
  const leftOperandNode = gameShell.querySelector("[data-left]");
  const rightOperandNode = gameShell.querySelector("[data-right]");
  const partialRowsNode = gameShell.querySelector("[data-partial-rows]");
  const answerRow = gameShell.querySelector("[data-answer-row]");
  const feedbackNode = gameShell.querySelector("[data-feedback]");
  const scoreNode = gameShell.querySelector("[data-score]");
  const bestScoreNode = gameShell.querySelector("[data-best-score]");
  const remainingNode = gameShell.querySelector("[data-remaining]");
  const timerNode = gameShell.querySelector("[data-timer]");
  const keypadButtons = Array.from(gameShell.querySelectorAll("[data-key]"));
  const clearButton = gameShell.querySelector("[data-clear]");
  const submitButton = gameShell.querySelector("[data-submit]");

  const bestScoreKey = "xeniiss-multiplication-best-score";
  const difficultyMap = {
    1: { multiplicandDigits: 1, multiplierDigits: 1, label: "1자리 × 1자리" },
    2: { multiplicandDigits: 2, multiplierDigits: 1, label: "2자리 × 1자리" },
    3: { multiplicandDigits: 2, multiplierDigits: 2, label: "2자리 × 2자리" },
  };

  const interactiveSelector = "button, select, option, input, textarea, a, label";

  const state = {
    active: false,
    paused: false,
    score: 0,
    bestScore: readBestScore(),
    roundsTotal: 10,
    roundsRemaining: 10,
    elapsedSeconds: 0,
    timerId: null,
    autoSubmitTimer: null,
    currentProblem: null,
    partialEntries: [],
    answerEntries: [],
  };

  function readBestScore() {
    try {
      return Number(localStorage.getItem(bestScoreKey) || "0");
    } catch {
      return 0;
    }
  }

  function saveBestScore(value) {
    try {
      localStorage.setItem(bestScoreKey, String(value));
    } catch {
      // ignore storage failures in restricted browsers
    }
  }

  const padNumber = (value, length = 2) => String(value).padStart(length, "0");
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const clearAutoSubmitTimer = () => {
    if (state.autoSubmitTimer) {
      clearTimeout(state.autoSubmitTimer);
      state.autoSubmitTimer = null;
    }
  };

  const setMessage = (message, tone = "neutral") => {
    if (!feedbackNode) return;
    feedbackNode.textContent = message;
    feedbackNode.dataset.tone = tone;
  };

  const updateTimer = () => {
    if (!timerNode) return;
    const minutes = Math.floor(state.elapsedSeconds / 60);
    const seconds = state.elapsedSeconds % 60;
    timerNode.textContent = `${padNumber(minutes)}:${padNumber(seconds)}`;
  };

  const updateBestScore = () => {
    if (bestScoreNode) {
      bestScoreNode.textContent = String(state.bestScore);
    }
  };

  const updateScoreboard = () => {
    if (scoreNode) scoreNode.textContent = String(state.score);
    if (remainingNode) {
      remainingNode.textContent = state.roundsTotal === 0 ? "∞" : String(state.roundsRemaining);
    }
    updateBestScore();
    updateTimer();
  };

  const getCurrentField = () => {
    for (let rowIndex = 0; rowIndex < state.partialEntries.length; rowIndex += 1) {
      const row = state.partialEntries[rowIndex];
      for (let slotIndex = 0; slotIndex < row.length; slotIndex += 1) {
        if (!row[slotIndex]) {
          return { type: "partial", rowIndex, slotIndex };
        }
      }
    }

    for (let slotIndex = 0; slotIndex < state.answerEntries.length; slotIndex += 1) {
      if (!state.answerEntries[slotIndex]) {
        return { type: "answer", rowIndex: 0, slotIndex };
      }
    }

    return null;
  };

  const isProblemComplete = () =>
    state.partialEntries.every((row) => row.every(Boolean)) && state.answerEntries.every(Boolean);

  const scheduleAutoSubmit = () => {
    clearAutoSubmitTimer();
    if (isProblemComplete()) {
      state.autoSubmitTimer = window.setTimeout(() => {
        submitAnswer();
      }, 220);
    }
  };

  const createCell = (type, rowIndex, slotIndex, value, active) => {
    const cell = document.createElement("div");
    cell.className = `math-cell math-cell--${type}`;
    cell.dataset.rowIndex = String(rowIndex);
    cell.dataset.slotIndex = String(slotIndex);
    cell.textContent = value || "";
    cell.classList.toggle("is-empty", !value);
    cell.classList.toggle("is-active", active);
    return cell;
  };

  const renderRows = () => {
    if (!partialRowsNode || !answerRow) return;

    partialRowsNode.innerHTML = "";
    answerRow.innerHTML = "";

    state.partialEntries = state.currentProblem.partialRows.map((row) =>
      Array(row.expectedDigits.length).fill("")
    );
    state.answerEntries = Array(state.currentProblem.answerDigits.length).fill("");

    state.currentProblem.partialRows.forEach((row, rowIndex) => {
      const rowElement = document.createElement("div");
      rowElement.className = "math-row";
      rowElement.dataset.rowIndex = String(rowIndex);

      const label = document.createElement("div");
      label.className = "math-row-label";
      label.textContent = row.label;

      const cells = document.createElement("div");
      cells.className = "math-row-cells";

      row.expectedDigits.forEach((_, slotIndex) => {
        cells.appendChild(createCell("partial", rowIndex, slotIndex, "", false));
      });

      rowElement.appendChild(label);
      rowElement.appendChild(cells);
      partialRowsNode.appendChild(rowElement);
    });

    state.currentProblem.answerDigits.forEach((_, slotIndex) => {
      answerRow.appendChild(createCell("answer", 0, slotIndex, "", false));
    });

    refreshSlots();
  };

  const refreshSlots = () => {
    const currentField = getCurrentField();

    const rowElements = Array.from(partialRowsNode?.querySelectorAll(".math-row") || []);
    rowElements.forEach((rowElement, rowIndex) => {
      const slots = Array.from(rowElement.querySelectorAll(".math-cell"));
      slots.forEach((slot, slotIndex) => {
        const active =
          currentField?.type === "partial" &&
          currentField.rowIndex === rowIndex &&
          currentField.slotIndex === slotIndex;
        const value = state.partialEntries[rowIndex]?.[slotIndex] || "";
        slot.textContent = value;
        slot.classList.toggle("is-empty", !value);
        slot.classList.toggle("is-active", active);
      });
    });

    Array.from(answerRow?.querySelectorAll(".math-cell") || []).forEach((slot, slotIndex) => {
      const active =
        currentField?.type === "answer" && currentField.rowIndex === 0 && currentField.slotIndex === slotIndex;
      const value = state.answerEntries[slotIndex] || "";
      slot.textContent = value;
      slot.classList.toggle("is-empty", !value);
      slot.classList.toggle("is-active", active);
    });
  };

  const getDifficulty = () => {
    const level = Number(difficultySelect?.value || "2");
    return difficultyMap[level] || difficultyMap[2];
  };

  const buildPartialRows = (multiplicand, multiplier) => {
    const multiplierDigits = String(multiplier)
      .split("")
      .map(Number)
      .reverse();

    return multiplierDigits.map((digit, rowIndex) => {
      const rawValue = multiplicand * digit;
      const shiftedValue = `${rawValue}${"0".repeat(rowIndex)}`;
      return {
        digit,
        label: rowIndex === 0 ? `1의 자리 × ${digit}` : `10의 자리 × ${digit}`,
        expectedDigits: shiftedValue
          .split("")
          .map(Number)
          .reverse(),
      };
    });
  };

  const generateProblem = () => {
    const difficulty = getDifficulty();
    const multiplicandMin = difficulty.multiplicandDigits <= 1 ? 1 : 10 ** (difficulty.multiplicandDigits - 1);
    const multiplicandMax = 10 ** difficulty.multiplicandDigits - 1;
    const multiplierMin = difficulty.multiplierDigits <= 1 ? 2 : 10 ** (difficulty.multiplierDigits - 1);
    const multiplierMax = difficulty.multiplierDigits <= 1 ? 9 : 10 ** difficulty.multiplierDigits - 1;

    const multiplicand = randomInt(multiplicandMin, multiplicandMax);
    const multiplier = randomInt(multiplierMin, multiplierMax);
    const partialRows = buildPartialRows(multiplicand, multiplier);
    const answerValue = String(multiplicand * multiplier);

    state.currentProblem = {
      multiplicand,
      multiplier,
      partialRows,
      answerDigits: answerValue.split("").map(Number).reverse(),
    };

    if (leftOperandNode) leftOperandNode.textContent = String(multiplicand);
    if (rightOperandNode) rightOperandNode.textContent = String(multiplier);

    renderRows();
  };

  const startTimer = () => {
    if (state.timerId) return;

    state.timerId = window.setInterval(() => {
      if (!state.active || state.paused) return;
      state.elapsedSeconds += 1;
      updateTimer();
    }, 1000);
  };

  const stopTimer = () => {
    if (!state.timerId) return;
    clearInterval(state.timerId);
    state.timerId = null;
  };

  const resetGame = () => {
    clearAutoSubmitTimer();
    stopTimer();
    state.active = false;
    state.paused = false;
    state.score = 0;
    state.roundsTotal = Number(roundsSelect?.value || "10");
    state.roundsRemaining = state.roundsTotal === 0 ? 0 : state.roundsTotal;
    state.elapsedSeconds = 0;
    state.currentProblem = null;
    state.partialEntries = [];
    state.answerEntries = [];

    if (pauseButton) pauseButton.textContent = "일시정지";
    if (leftOperandNode) leftOperandNode.textContent = "";
    if (rightOperandNode) rightOperandNode.textContent = "";
    if (partialRowsNode) partialRowsNode.innerHTML = "";
    if (answerRow) answerRow.innerHTML = "";

    setMessage("화면을 누르면 첫 문제가 시작됩니다.");
    updateScoreboard();
  };

  const finishRound = () => {
    if (state.roundsTotal !== 0) {
      state.roundsRemaining -= 1;
      if (state.roundsRemaining <= 0) {
        state.active = false;
        stopTimer();
        clearAutoSubmitTimer();
        if (state.score > state.bestScore) {
          state.bestScore = state.score;
          saveBestScore(state.bestScore);
        }
        updateScoreboard();
        setMessage(`세트 완료! 최종 점수는 ${state.score}점입니다. 다시 시작을 눌러 새 세트를 시작하세요.`, "success");
        return;
      }
    }

    generateProblem();
    updateScoreboard();
    setMessage("좋아요. 다음 문제예요.", "success");
  };

  const startGame = () => {
    resetGame();
    state.active = true;
    generateProblem();
    setMessage("각 자리수의 곱을 오른쪽부터 입력하고, 마지막에 정답을 맞혀요.");
    startTimer();
  };

  const submitAnswer = () => {
    clearAutoSubmitTimer();

    if (!state.active || state.paused) {
      setMessage("먼저 화면을 눌러 시작해 주세요.");
      return;
    }

    if (!isProblemComplete()) {
      setMessage("빈칸을 모두 채워 주세요.");
      return;
    }

    const expectedPartialRows = state.currentProblem.partialRows.map((row) => row.expectedDigits.join(""));
    const expectedPartialEntries = state.partialEntries.map((row) => row.join(""));
    const expectedAnswer = state.currentProblem.answerDigits.join("");
    const actualAnswer = state.answerEntries.join("");

    const partialsCorrect =
      expectedPartialRows.length === expectedPartialEntries.length &&
      expectedPartialRows.every((expected, index) => expected === expectedPartialEntries[index]);

    if (partialsCorrect && actualAnswer === expectedAnswer) {
      state.score += 1;
      if (state.score > state.bestScore) {
        state.bestScore = state.score;
        saveBestScore(state.bestScore);
      }
      updateScoreboard();
      setMessage(
        `정답이에요! ${state.currentProblem.multiplicand} × ${state.currentProblem.multiplier} = ${
          state.currentProblem.multiplicand * state.currentProblem.multiplier
        }`,
        "success"
      );
      window.setTimeout(() => {
        finishRound();
      }, 500);
      return;
    }

    updateScoreboard();
    setMessage(
      `아쉬워요. 정답은 ${state.currentProblem.multiplicand} × ${state.currentProblem.multiplier} = ${
        state.currentProblem.multiplicand * state.currentProblem.multiplier
      }였어요.`,
      "error"
    );
    window.setTimeout(() => {
      finishRound();
    }, 750);
  };

  const inputDigit = (digit) => {
    if (!state.active || state.paused) return;
    const field = getCurrentField();
    if (!field) return;

    if (field.type === "partial") {
      state.partialEntries[field.rowIndex][field.slotIndex] = digit;
    } else {
      state.answerEntries[field.slotIndex] = digit;
    }

    refreshSlots();
    scheduleAutoSubmit();
  };

  const deleteDigit = () => {
    if (!state.active || state.paused) return;
    clearAutoSubmitTimer();

    for (let rowIndex = state.answerEntries.length - 1; rowIndex >= 0; rowIndex -= 1) {
      if (state.answerEntries[rowIndex]) {
        state.answerEntries[rowIndex] = "";
        refreshSlots();
        return;
      }
    }

    for (let partialIndex = state.partialEntries.length - 1; partialIndex >= 0; partialIndex -= 1) {
      const row = state.partialEntries[partialIndex];
      for (let slotIndex = row.length - 1; slotIndex >= 0; slotIndex -= 1) {
        if (row[slotIndex]) {
          row[slotIndex] = "";
          refreshSlots();
          return;
        }
      }
    }

    refreshSlots();
  };

  const clearDigits = () => {
    if (!state.active || state.paused) return;
    clearAutoSubmitTimer();
    state.partialEntries = state.partialEntries.map((row) => row.map(() => ""));
    state.answerEntries = state.answerEntries.map(() => "");
    refreshSlots();
  };

  const togglePause = () => {
    if (!state.active) {
      setMessage("화면을 눌러 먼저 시작해 주세요.");
      return;
    }

    state.paused = !state.paused;
    if (pauseButton) pauseButton.textContent = state.paused ? "재개" : "일시정지";
    setMessage(state.paused ? "게임이 잠시 멈췄어요." : "게임이 다시 시작됐어요.");
    refreshSlots();
  };

  const shouldIgnoreStartTarget = (target) =>
    target instanceof Element && Boolean(target.closest(interactiveSelector));

  gameShell.addEventListener("pointerdown", (event) => {
    if (state.active || shouldIgnoreStartTarget(event.target)) return;
    startGame();
  });

  difficultySelect?.addEventListener("change", () => {
    if (state.active) {
      startGame();
    }
  });

  roundsSelect?.addEventListener("change", () => {
    if (state.active) {
      startGame();
    } else {
      state.roundsTotal = Number(roundsSelect.value || "10");
      state.roundsRemaining = state.roundsTotal === 0 ? 0 : state.roundsTotal;
      updateScoreboard();
    }
  });

  pauseButton?.addEventListener("click", togglePause);
  restartButton?.addEventListener("click", startGame);

  keypadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const digit = button.dataset.key;
      if (digit) inputDigit(digit);
    });
  });

  clearButton?.addEventListener("click", clearDigits);
  submitButton?.addEventListener("click", submitAnswer);

  document.addEventListener("keydown", (event) => {
    if (!state.active || state.paused) return;

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      inputDigit(event.key);
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      deleteDigit();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      submitAnswer();
    }
  });

  updateBestScore();
  resetGame();
}
