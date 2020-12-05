// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

// start quiz
function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  // un-hide questions section
  questionsEl.removeAttribute("class");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}
// get current question object from array
function getQuestion() {
  
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = "";

  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // attach click event listener to each choice
    choiceNode.onclick = questionClick;

    // display on the page
    choicesEl.appendChild(choiceNode);
  });
}
 // check if user guessed wrong and penalize time
function questionClick() {
  
  if (this.value !== questions[currentQuestionIndex].answer) {
    
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerEl.textContent = time;
    // feed back for wrong answer
    feedbackEl.textContent = "Wrong!";
  } else {
    // feedback right answer
    feedbackEl.textContent = "Correct!";
    feedbackEl.setAttribute("class", "feedback correct");
  }

  // flash right/wrong feedback on page for .2 of a second
  if (feedbackEl.textContent === "Correct!")
    feedbackEl.setAttribute("class", "feedback correct");
  else if (feedbackEl.textContent === "Wrong!")
    feedbackEl.setAttribute("class", "feedback wrong");
  else
    feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 200);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}
// update time
function clockTick() {
  
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty and met standard length
  if (initials !== "") {
      if (initials.length >= 5 )
        initials = initials.substr(0,5);
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page
    window.location.href = "highscore.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;

