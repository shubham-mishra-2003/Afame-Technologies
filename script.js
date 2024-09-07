const inputField = document.querySelector(".display input");
const expressionDisplay = document.getElementById("expressionDisplay");
const historyToggle = document.getElementById("historyToggle");
const historyContainer = document.querySelector(".history-container");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let currentExpression = "";
let isResultDisplayed = false;
let history = [];

const MAX_CHAR_LENGTH = 10;
const SCALE_FACTOR = 50;

function updateInput(value) {
  if (isResultDisplayed) {
    inputField.value = "";
    isResultDisplayed = false;
  }

  const lastChar = inputField.value[inputField.value.length - 1];
  if (
    (lastChar === "+" ||
      lastChar === "-" ||
      lastChar === "*" ||
      lastChar === "/" ||
      lastChar === "%") &&
    (value === "+" ||
      value === "-" ||
      value === "*" ||
      value === "/" ||
      value === "%")
  ) {
    return;
  }

  inputField.value += value;
  adjustFontSize();
}

function deleteLastCharacter() {
  inputField.value = inputField.value.slice(0, -1);
  adjustFontSize();
}

function adjustFontSize() {
  const valueLength = inputField.value.length;

  if (valueLength > MAX_CHAR_LENGTH) {
    const scale = Math.max(SCALE_FACTOR, MAX_CHAR_LENGTH / valueLength);
    inputField.style.fontSize = `${scale}px`;
  } else {
    inputField.style.fontSize = "60px"; // Default font size
  }
}

function addToHistory(expression, result) {
  history.push(`${expression} = ${result}`);
  localStorage.setItem("calculatorHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyContainer.innerHTML = "";
  if (history.length === 0) {
    const noHistoryMessage = document.createElement("span");
    noHistoryMessage.innerText = "No history available";
    noHistoryMessage.style.color = "#a19f9f";
    historyContainer.appendChild(noHistoryMessage);
  } else {
    history.forEach((entry, index) => {
      const historyEntry = document.createElement("span");
      historyEntry.innerHTML = `<b>${index + 1}.)</b> ${entry}`;
      historyContainer.appendChild(historyEntry);
    });
  }
}

function loadHistory() {
  const storedHistory = localStorage.getItem("calculatorHistory");
  if (storedHistory) {
    history = JSON.parse(storedHistory);
  }
  renderHistory();
}

document.querySelectorAll(".buttons button").forEach(button => {
  button.addEventListener("click", event => {
    const value = event.target.innerText;

    if (value === "=") {
      if (inputField.value !== "") {
        try {
          currentExpression = inputField.value;
          const result = eval(
            currentExpression.replace("×", "*").replace("÷", "/")
          );
          expressionDisplay.innerText = `${currentExpression}`;
          inputField.value = result;
          isResultDisplayed = true;
          addToHistory(currentExpression, result);
        } catch (error) {
          inputField.value = "Error";
        }
      }
    } else if (value === "C") {
      inputField.value = "";
      expressionDisplay.innerText = "";
      inputField.style.fontSize = "60px"; // Reset font size
    }else {
      updateInput(value);
    }
  });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  inputField.value = "";
  expressionDisplay.innerText = "";
  inputField.style.fontSize = "60px";
});

historyToggle.addEventListener("change", () => {
  const historyElement = document.getElementById("history");
  historyElement.style.display = historyToggle.checked ? "flex" : "none";
});
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("calculatorHistory");
  renderHistory();
});

window.addEventListener("load", loadHistory);
