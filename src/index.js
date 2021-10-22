//BoardGame Code
/* startup */
const cards = document.querySelectorAll(".card");
const answerCard = document.querySelector(".card--answer");
const questionCard = document.querySelector(".card--question");
const randomAnswerCard = document.querySelector(".card--random");

let locked = false;
let score = 0;

//Clicks to update user on webpage
let tries = 0;
let triesElem = document.querySelector(".tries"); //

/* api */
function getQuestion() {
  axios
    .get("https://jservice.io/api/random")
    .then((result) => {
      clearCards();
      // create question
      const question = result.data[0].question;
      createCardText(questionCard, question);
      // create answer
      const correctAnswer = result.data[0].answer;
      createCardText(answerCard, correctAnswer);
      answerCard.setAttribute("score", result.data[0].value);
      // create random answer
      getRandomAnswer();
      // wait for click
      // set score to an attribute on the card
    })
    .catch((error) => {
      console.log(error);
    });
}
answerCard.addEventListener("click", (e) => {
  console.log("good job!");
  addScore(Number(e.target.getAttribute("score")));
  setTimeout(() => {
    e.target.classList.remove("answer--right");
    getQuestion();
  }, 1000);
  e.target.classList.add("answer--right");
});
randomAnswerCard.addEventListener("click", (e) => {
  incrementTries();
  console.log("too bad!");
  setTimeout(() => {
    console.log(e.target);
    e.target.classList.remove("answer--wrong");
    getQuestion();
  }, 1000);
  e.target.classList.add("answer--wrong");
});

function getRandomAnswer() {
  axios
    .get("https://jservice.io/api/random")
    .then((result) => {
      const randomAnswer = result.data[0].answer;
      createCardText(randomAnswerCard, randomAnswer);
    })
    .catch((error) => {
      console.log(error);
    });
}

/* gameplay */

function incrementTries() {
  tries++;
  triesElem.innerText = `Tries: ${tries}`;
}

function addScore(points) {
  const scoreElem = document.querySelector(".score");
  score += points;
  scoreElem.innerText = `Score: ${score}`;
  checkForWin();
}

//Check for a win alert Winner
function checkForWin() {
  if (score >= 3000) {
    alert("Winner");
    resetGame();
  }
}

//reset turn clears the classes from the cards that are not matches and allows a new first card to be clicked.

//reset gameboard resets score and clicks to 0
function resetGame() {
  locked = false; // TODO: what does lockboard do?
  tries = 0;
  score = 0;
  console.log(score);
  document.querySelector(".score").innerHTML = `Score: ${score}`;
  document.querySelector(".tries").innerHTML = `Tries: ${tries}`;

  setTimeout(() => {
    getQuestion();
    locked = false;
  }, 1000);
}
//Reset Game button (New Game Btn on html)
(function startGame() {
  resetGame();
  document
    .querySelector(".sidebar__button")
    .addEventListener("click", resetGame);
})();

/* DOM */
function createCardText(cardElem, cardText) {
  const cardTextElem = document.createElement("p");
  cardTextElem.classList.add("card__text");
  cardTextElem.innerHTML = cardText; // some answers are italic
  cardElem.appendChild(cardTextElem);
}

function clearCards() {
  cards.forEach((card) => {
    card.innerHTML = "";
  });
}
