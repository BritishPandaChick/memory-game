/*
 * Create a list that holds all of your cards
 */
 /* const card = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
 "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-diamond", "fa-bomb",
 "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"]; */

const deck = document.querySelector('.deck');

//Global Variables
let flippedCards = [];
let moves = 0;
let timerOff = true;
let time = 0;
let timerId;
let matchedCards = 0;


//ShuffleDeck function
function deckShuffle() {
  const cardsNeedShuffled = Array.from(document.querySelectorAll('.deck li'));
  const cardsBeenShuffled = shuffle(cardsNeedShuffled);
  for (card of cardsBeenShuffled) {
    deck.appendChild(card);
  }
}
deckShuffle();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/** set up the event listener for a card.*/
//const cards = document.querySelectorAll('.card');
/* for (card of cards) {
  card.addEventListener('click', () => {
    console.log("Hello, I'm a card!");
  });
} */

 /*
 If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 deck.addEventListener('click', event => {
   const clickEvent = event.target;
    if (doubleCheckClicks(clickEvent)) {
      if (timerOff) {
        beginTimer();
        timerOff = false;
      }
      flipCard(clickEvent);
      addFlippedCards(clickEvent);
      if (flippedCards.length === 2) {
        findMatch();
        increaseMove();
        checkStars();
      }
    }
});

 //isClickValid function
 function doubleCheckClicks(clickEvent) {
   return (
     clickEvent.classList.contains('card') &&
     !clickEvent.classList.contains('match') &&
     flippedCards.length < 2 &&
     !flippedCards.includes(clickEvent)
   );
 }

 //Start clock function
 function beginTimer() {
   timerId = setInterval(() => {
     time++;
     showTimer();
   }, 1000);
 }

 //Display time fucntion
 function showTimer() {
   const timer = document.querySelector('.timer');
   const minutes = Math.floor(time / 60);
   const seconds = time % 60;

   if (seconds < 10) {
     timer.innerHTML = `${minutes}:0${seconds}`;
   } else {
     timer.innerHTML = `${minutes}:${seconds}`;
   }
 }

 //Toggle Card Function
 function flipCard(card) {
   card.classList.toggle('open');
   card.classList.toggle('show');
 }

 //Add to toggleCard array
 function addFlippedCards(clickTarget) {
   flippedCards.push(clickTarget);
 }

 //Check for a match
 function findMatch() {
  const totalMatches = 8;

  if (flippedCards[0].firstElementChild.className ===
    flippedCards[1].firstElementChild.className) {
    flippedCards[0].classList.toggle('match');
    flippedCards[1].classList.toggle('match');
    flippedCards = [];
    matchedCards++;
    if (matchedCards === totalMatches) {
      endGame();
    }
  } else {
    setTimeout(() => {
      flipCard(flippedCards[0]);
      flipCard(flippedCards[1]);
      flippedCards = [];
    }, 1000);
  }
 }

/* Game over function */
 function endGame() {
   endTimer();
   createModalData();
   displayModal();
 }

 //function stopClock
 function endTimer() {
   clearInterval(timerId);
 }

 //Add move function
 function increaseMove() {
   moves++;
   const moveText = document.querySelector('.moves');
   moveText.innerHTML = moves;
 }

 //Function checkScore
 function checkStars() {
   if (moves === 16 || moves === 24) {
     removeStar();
   }
 }

 //Remove Star
 function removeStar() {
   const starRatings = document.querySelectorAll('.stars li');
   for (star of starRatings) {
     if (star.style.display !== 'none') {
       star.style.display = 'none';
       break;
     }
   }
 }

/* ToggleModal function */
function displayModal() {
  const modal = document.querySelector('.modal-container');
  modal.classList.toggle('hide');
}

/* writeModalStats function */
function createModalData() {
  const timeData = document.querySelector('.modal-time');
  const clockTime = document.querySelector('.timer').innerHTML;
  const movesData = document.querySelector('.modal-moves');
  const starsData = document.querySelector('.modal-stars');
  const stars = findStars();

  timeData.innerHTML = `Time = ${clockTime}`;
  movesData.innerHTML = `Moves = ${moves}`;
  starsData.innerHTML = `Stars = ${stars}`;
}

/* Getstars function */
function findStars() {
  stars = document.querySelectorAll('.stars li');
  starNumber = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starNumber++;
    }
  }
  console.log(starNumber);
  return starNumber;
}

/* Cancel Button */
document.querySelector('.modal-cancel').addEventListener('click', () => {
  displayModal();
});

/* Replay Button */
document.querySelector('.modal-replay').addEventListener('click', () => {
  //Call reset game here
  playAgain();
});

/* Resetgame function */
function gameReset() {
  resetTimer();
  restartMoves();
  restartStars();
  deckShuffle();
  resetAllCards();
}

/*ResetClockandTime Function */
function resetTimer() {
  endTimer();
  timerOff = true;
  time = 0;
  showTimer();
}

/* Reset Moves Function */
function restartMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

/* Reset Stars Function */
function restartStars() {
  stars = 0;
  const listOfStars = document.querySelectorAll('.stars li');
  for (stars of listOfStars) {
    star.style.display = 'inline';
  }
}

/* Reset Button */
document.querySelector('.restart').addEventListener('click', gameReset);

/* ReplayGame function */
function playAgain() {
  gameReset();
  displayModal();
}

/*Resetcards function */
function resetAllCards () {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    card.className = 'card';
  }
}
