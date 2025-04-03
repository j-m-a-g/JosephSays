// OBJECTS TO BE CALLED
let playerName = document.getElementById("playerName");
let playButton = document.getElementById("playButton");

let introductionText = document.getElementById("introductionText");
let continueToPlay = document.getElementById("continueToPlay");
let noChoiceButContinue = document.getElementById("noChoiceButContinue");

let getReadyText = document.getElementById("getReadyText");
let getReadyCounter = document.getElementById("getReadyCounter");

let remainingTimeText = document.getElementById("remainingTimeText");

let fromOneToTenInput = document.getElementById("fromOneToTenInput");
let youLostText = document.getElementById("youLostText");

let computerMouseGraphic = document.getElementById("computerMouseGraphic");
let moveMouseBar = document.getElementById("moveMouseBar");
let cheeseForMouse = document.getElementById("cheeseForMouse");

let playerInputMathProblem = document.getElementById("playerInputMathProblem");

let greenArrow = document.getElementById("greenArrow");

let mouseToCheese = document.getElementById("mouseToCheese");
let solveMathProblem = document.getElementById("solveMathProblem");
let landOnMiddle = document.getElementById("landOnMiddle");
let formImageFromButtons = document.getElementById("formImageFromButtons");

let youWonText = document.getElementById("youWonText");
let timeTakenForTasks = document.getElementById("timeTakenForTasks");
let gameOverScreen = document.getElementById("gameOverScreen");
let previousTimesDisplay = document.getElementById("previousTimesDisplay");

// NORMAL VARIABLES
let gameTotalTime = 25; // 5-second buffer to account for the, "Get Ready," countdown
let secondPhrase = "And you'd be right!";
let thirdPhrase = "The twist? There aren't any tricks!<br>(For example, not specifically saying \"Joseph Says\" to complete a task)";
let fourthPhrase = "But, you only have <span style=\"font-family: monospace; font-size: 1.2em\">20 SECONDS</span> to get through the tasks!"
let fontScale = undefined;
let tasksDone = [];
let formImageFromButtonsClickCount = 0;

// Mitigates the chance where the player inputs a blank response
// or one with a space at the beginning or end, resulting in an
// incorrect appearance for a displayed message
function checkForWhitespace(textObject, appliedTo, messagePrefix) {
  if (textObject.value === "" || textObject.value === " ") {
    appliedTo.innerHTML = messagePrefix + "!";
  }
  else {
    appliedTo.innerHTML = messagePrefix + " " + textObject.value + "!";
  }
}

// Modifies the play button's greeting text to correspond to the player's name
function updatePlayButtonText() {
  checkForWhitespace(playerName, playButton, "Let's Play");
}

// Allows the game to progress through each, "stage"
function hideAndShow(hiddenContainer, shownContainer) {
  document.getElementById(hiddenContainer).hidden = true;
  document.getElementById(shownContainer).hidden = false;
}

function initializeGetReadyCountdown() {
  hideAndShow("gameOverview", "getReadyCountdown");
  updateGetReadyCounter(4);
  updateRemainingTimeCounter(gameTotalTime);

  getComponentsReady();
}

function flipThroughIntro() {
  // Sequentially cycles through a brief explanation of the game
  // each time the, "Continue," button is clicked
  if (introductionText.innerHTML === "You might be thinking that this is just a spin-off of Simon Says...") {
    introductionText.innerHTML = secondPhrase;
  }
  else if (introductionText.innerHTML === secondPhrase) {
    introductionText.innerHTML = thirdPhrase;
  }
  else if (introductionText.innerHTML === thirdPhrase) {
    introductionText.innerHTML = fourthPhrase;
  }
  else if (introductionText.innerHTML === fourthPhrase) {
    introductionText.innerHTML = "So, you up for the challenge?";
    continueToPlay.innerHTML = "Yes!";

    noChoiceButContinue.hidden = false;
  }
  else if (continueToPlay.innerHTML === "Yes!") {
    // The button's text turns to, "Yes," at the end of the introduction
    // to then initialize the game when clicked (after the quick, "Get
    // Ready," countdown)
    initializeGetReadyCountdown();
  }
}

function updateGetReadyCounter(allottedTime) {
  // When we are dealing with the getReadyCountdown section before the
  // start of the game, its parent, "div," is hidden and the game
  // will begin after the timer briefly displays, "Start!"
  if (allottedTime <= 1) {
    getReadyText.hidden = true;
    getReadyCounter.innerHTML = "Start!"
    setTimeout(hideAndShow, 1000, "getReadyCountdown", "mainGameplay");
  }
  else {
    allottedTime--;
    getReadyCounter.innerHTML = allottedTime;
    setTimeout(updateGetReadyCounter, 1000, allottedTime);
  }
}

function updateRemainingTimeCounter(allottedTime) {
  // Counts down the total remaining time until it has reached zero
  // to then display a, "Game Over," screen
  if (allottedTime <= 0) {
    hideAndShow("mainGameplay", "gameOverScreen");
  }
  else if (allottedTime <= 6) {
    fontScale = 40 - allottedTime * 2;
    remainingTimeText.style = "font-size: " + fontScale + "px; color: yellow";

    allottedTime--;
    remainingTimeText.innerHTML = "Time left (seconds): " + allottedTime;
    setTimeout(updateRemainingTimeCounter, 1000, allottedTime);
  }
  else {
    allottedTime--;
    remainingTimeText.innerHTML = "Time left (seconds): " + allottedTime;
    setTimeout(updateRemainingTimeCounter, 1000, allottedTime);
  }
}

// FUNCTIONS FOR MAIN GAMEPLAY

function getComponentsReady() {
  // Makes where the initial value of the input for picking
  // a number from 1 to 10 is random between games (10 not
  // is generated to allow at least 1 increment)
  fromOneToTenInput.value = Math.floor(Math.random() * 10);

  if (fromOneToTenInput.value === 0) {
    getComponentsReady();
  }

  // Tailors Game Over screen to include the player's name
  checkForWhitespace(playerName, youLostText, "Game Over");

  // Allows the task involving the green arrow to repeatedly shift it
  shiftGreenArrowPosition(950);
}

function determineNextTaskFromRange() {
  if (fromOneToTenInput.value <= 2) {
    hideAndShow("selectNumFromRange", "mouseToCheese");
    tasksDone.push("mouseToCheese");
  }
  else if (fromOneToTenInput.value <= 4) {
    hideAndShow("selectNumFromRange", "solveMathProblem");
    tasksDone.push("solveMathProblem");
  }
  else if (fromOneToTenInput.value <= 6) {
    hideAndShow("selectNumFromRange", "landOnMiddle");
    tasksDone.push("landOnMiddle");
  }
  else if (fromOneToTenInput.value <= 8) {
    hideAndShow("selectNumFromRange", "formImageFromButtons");
    tasksDone.push("formImageFromButtons");
  }
  else {
    hideAndShow("selectNumFromRange", "mouseToCheese");
    tasksDone.push("mouseToCheese");
  }
}

// Picks a task to be displayed to the user on a randomized basis
function randomizeNextTask() {
  let randomTask = Math.floor(Math.random() * 4);

  // Checks whether the taskDone array already has the corresponding
  // task, "marked as done," to then recursively regenerate a new
  // random number until this is false
  try {
    switch (randomTask) {
      case 0:
        if (tasksDone.includes("mouseToCheese")) {
          randomizeNextTask();
        }
        else {
          mouseToCheese.hidden = false;
          tasksDone.push("mouseToCheese");
        }
        break;
      case 1:
        if (tasksDone.includes("solveMathProblem")) {
          randomizeNextTask();
        }
        else {
          solveMathProblem.hidden = false;
          tasksDone.push("solveMathProblem");
        }
        break;
      case 2:
        if (tasksDone.includes("landOnMiddle")) {
          randomizeNextTask();
        }
        else {
          landOnMiddle.hidden = false;
          tasksDone.push("landOnMiddle");
        }
        break;
      case 3:
        if (tasksDone.includes("formImageFromButtons")) {
          randomizeNextTask();
        }
        else {
          formImageFromButtons.hidden = false;
          tasksDone.push("formImageFromButtons");
        }
        break;
    }
  }
  catch (RangeError) {
    // If all tasks have been added to the tasksDone array and
    // a random number is being infinitely generated as of this,
    // simply show the player the gameSuccessScreen
    displaySuccessScreen();
  }
}

// Enables the player to increase a number input's value by
// pressing a button rather than fiddling with the spinner
function incrementDecrementNum() {
  if (fromOneToTenInput.value <= 9) {
    fromOneToTenInput.value++;
  }
}

function modifyComputerMousePosition() {
  computerMouseGraphic.style.marginLeft = moveMouseBar.value + "px";

  // Checks if the player has fully dragged the range's head
  // to the end of the bar and moves them on to the next task
  if (moveMouseBar.value === "650") {
    cheeseForMouse.hidden = true;
    setTimeout(() => {
      mouseToCheese.hidden = true;
      randomizeNextTask();
    }, 1000);
    setTimeout(() => {
      computerMouseGraphic.style.marginLeft = "0px";
      moveMouseBar.value = 0;
      cheeseForMouse.hidden = false;
    }, 1000);
  }
}

function checkMathProblemAnswer() {
  if (playerInputMathProblem.value === "12") {
    solveMathProblem.hidden = true;
    randomizeNextTask();
    playerInputMathProblem.value = 0;
  }
}

function shiftGreenArrowPosition(arrowLeftMargin) {
  if (arrowLeftMargin <= 0) {
    greenArrow.style.marginLeft = "0";
    shiftGreenArrowPosition(950);
  }
  else {
    arrowLeftMargin--;
    greenArrow.style = "margin-left: " + arrowLeftMargin + "px";
    setTimeout(shiftGreenArrowPosition, 4, arrowLeftMargin);
  }
}

function checkIfArrowOnMiddle() {
  let greenArrowMarginAsNum = Number(greenArrow.style.marginLeft.substring(0, 3));

  if (greenArrowMarginAsNum <= 225 || greenArrowMarginAsNum >= 170) {
    landOnMiddle.hidden = true;
    randomizeNextTask();
  }
}

// Indicates to the player which buttons they have selected
// for the, "Forming An Image From Buttons," task
function toggleFormImageButtonStyle(buttonToApplyStyle) {
  let currentButton = document.getElementById(buttonToApplyStyle);
  currentButton.style.backgroundColor = "yellow"
}

function verifyImageIsFormed() {
  if (formImageFromButtonsClickCount >= 9) {
    formImageFromButtons.hidden = true;
    randomizeNextTask();
  }
}

function displaySuccessScreen() {
  let secondsLeft = Number(remainingTimeText.innerHTML.substring(21));
  let calculatedTimeTaken = (gameTotalTime - 5) - secondsLeft;

  hideAndShow("mainGameplay", "gameSuccessScreen");
  checkForWhitespace(playerName, youWonText, "You Made it");
  timeTakenForTasks.innerHTML = "You went through all the tasks in <span style=\"font-family: monospace; font-size: 1.2em\">" + calculatedTimeTaken + " seconds</span>";

  if (localStorage.getItem("previousTimes") === null) {
    previousTimesDisplay.innerHTML = "None";
  }
  else {
    previousTimesDisplay.innerHTML = localStorage.getItem("previousTimes");
  }
  localStorage.setItem("previousTimes", localStorage.getItem("previousTimes") + calculatedTimeTaken + " s, ");

  let hidingDelay = secondsLeft + 1;

  // Ensures that the, "Game Over" screen does not arbitrarily appear
  // despite the updateRemainingTimeCounter function contradicting this
  gameOverScreen.style.marginTop = "2500px";
  setTimeout(() => {
    gameOverScreen.hidden = true;
  }, hidingDelay * 1000);
}
