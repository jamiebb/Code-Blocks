$(document).ready(function(){

	// STORES WHAT CODE TYPES / HOW MANY PLAYERS ARE SELECTED

	let htmlPicked = 0;
	let cssPicked = 0;
	let jsPicked = 0;
	let playerCount = 1;

	// ADJUSTS BUTTON OPACITIES ON CLICK, WHAT CODE TYPES / AMOUNT OF PLAYERS PICKED

	$('#html').css('opacity', .5);
	$('#css').css('opacity', .5);
	$('#js').css('opacity', .5);

	$('#html').click(() => {
		if ($('#html').css('opacity') === '0.5') {
			$('#html').css('opacity', 1);
			htmlPicked = 1;
		} else {
			$('#html').css('opacity', .5);
			htmlPicked = 0;
		}
	});

	$('#css').click(() => {
		if ($('#css').css('opacity') === '0.5') {
			$('#css').css('opacity', 1);
			cssPicked = 1;
		} else {
			$('#css').css('opacity', .5);
			cssPicked = 0;
		}
	});

	$('#js').click(() => {
		if ($('#js').css('opacity') === '0.5') {
			$('#js').css('opacity', 1);
			jsPicked = 1;
		} else {
			$('#js').css('opacity', .5);
			jsPicked = 0;
		}
	});

	$('#solo').click(() => {
		$('#solo').css('opacity', 1);
		$('#versus').css('opacity', .5);
		playerCount = 1;
	});

	$('#versus').click(() => {
		$('#solo').css('opacity', .5);
		$('#versus').css('opacity', 1);
		playerCount = 2;
	});

	// START BUTTON, ASSIGNING VALUES TO LOCAL STORAGE FOR MAIN.HTML'S USE

	$('#start').click(() => {
		if (!htmlPicked && !cssPicked && !jsPicked) {
			console.log('cannot start!');
		} else {
			$('#setup').css('display', 'none');
			$('#game').css('display', 'block');
			game();
		}
	})

// GAME

	let game = () => {

// ENABLES YOU TO PRESS ENTER TO MOVE BETWEEN (SOME) PAGES

		$(document).keypress((key) => {
			if (key.which === 13) {
				if ($("#displayQuestion").css("display") === "block") {
					guessPress();
				} else if ($("#displayAnswer").css("display") === "block") {
					continuePress();
				} else if ($("#displayFinish").css("display") === "block") {
					replayPress();
				}
			}
		})

		// TAKES IN QUESTIONS FROM THE JSON FILE

		let questionsArray = [];

		let getQuestions = () => {
			$.getJSON("html.json", (data) => {
				if (htmlPicked === 1) {
					questionsArray.push(...data.questions);
				}				
			}).done(() => {
				$.getJSON("css.json", function(data) {
					if (cssPicked === 1) {
						questionsArray.push(...data.questions);
					}				
				}).done(() => {
					$.getJSON("js.json", function(data) {
						if (jsPicked === 1) {
							questionsArray.push(...data.questions);
						}			
					}).done(() => {
						setQuestion();	
					})
				})
			})
		}

		getQuestions();

		// KEEPS TRACK OF WHAT TURN IT IS

		let turn = 0;

		// SETS THE PLAYER TO PLAYER 1, CHANGING TO PLAYER 2 LATER IF NEEDED

		let player = "#player1";
		let playerText = "PLAYER 1";


		// SETS QUESTIONS FOR CODE TYPES SELECTED ON INDEX.HTML

			//VARIABLES USED

				// USED TO SET A RANDOM QUESTION, ITS ANSWER, AND ITS CODE TYPE

					let questionSet;
					let answerSet;
					let typeSet;

				// ARRAY TO ADD USED QUESTIONS TO, USING THE NEWLY PUSHED QUESTION, QUESTIONSUSED[0],
				// AS THE CURRENT QUESTION

					let questionsUsed = [];

		// PICKS RANDOMIZED QUESTION TO USE FROM SELECTED CODE TYPES

		let setQuestion = () => {

			// ONLY WHEN THERE AREN'T ANYMORE QUESTIONS, IT TAKES
			// REPEATS FROM THE JSON FILE

			if(questionsArray.length == 0) {
				getQuestions();
			} else {
				num = Math.floor(Math.random() * questionsArray.length);
				questionsUsed.unshift(questionsArray[num]);
				questionsArray.splice(num, 1);

				questionSet = questionsUsed[0].question;
				answerSet = questionsUsed[0].answer;
				typeSet = questionsUsed[0].type;
				descriptionSet = questionsUsed[0].description;
				linkSet = questionsUsed[0].link;
				aboutSet = questionsUsed[0].about;
			}
		}

		// SWITCH FROM PLAYER 1/2 BLOCKS PAGE TO THE QUESTION PAGE

			// VARIABLES USED

				// PICKS A COLOR FOR THE QUESTION/ANSWER HEADER BACKGROUND AND THE BLOCKS' IMAGES
				// THAT CORRESPOND TO THE CODE TYPE

					let color;
					let images;

		let questions = () => {

			$('#banner').css("display", "none");

			$('.question').css("display", "block");

			// AUTO FOCUSES ON TEXT BOX

			if ($("#displayQuestion").css("display") == "block") {
				$("#inputAnswer").focus();
			}

			$('#question').text(questionSet);

			if (typeSet == "html") {
				color = "#E44D26";
				images = "url(\"./img/HTML_Full.png\")";
			} else if (typeSet === "css") {
				color = "#0070BA";
				images = "url(\"./img/CSS_Full.png\")";
			} else if (typeSet === "javascript") {
				color = "#63A814";
				images = "url(\"./img/JavaScript_Full.png\")";
			}

			$('#questionType').text(typeSet.toUpperCase());
			$('#questionType').css("background-color", color);
			$('#guess').css("background-color", color);
			$('#answerType').css("background-color", color);
			$('#continue').css("background-color", color);
			
		}

		// BASED ON THE TURN, AND PLAYER COUNT: SETS UP THE BOARD

		let setup = () => {

			if (playerCount == 1) {
				$('#turn').text("PRACTICE");
			}

			if (turn === 0 || playerCount == 1) {
				setTimeout(() => {$(player).css("display", "none"); }, 3000);
				setTimeout(questions, 3000);
			} 
			else {
				let setPlayer = () => {
					if (player === '#player1') {
						player = '#player2';
						playerText = 'PLAYER 2';
					} else {
						player = '#player1'
						playerText = 'PLAYER 1'
					}
				}

				setTimeout(() => { $(player).css("display", "none"), setPlayer() }, 3000);

				setTimeout(() => { $(player).css("display", "block");
					$("#turn").text(playerText); 
				}, 3000);

				setTimeout(() => { $(player).css("display", "none");
					questions();
				}, 6000);			
			}
		}

		setup();

		// RESULTS PAGE
		
		let breakdown = () => {

		// TURNS ON/OFF SECTION DISPLAYS PROPERLY

			$('.answer').css("display", "none");
			$(player).css("display", "block");
			$('#banner').css("display", "block");

		// CREATES A BANNER FOR WHO WON ("BLOCK COMPLETED" FOR SOLO PLAY)

			$('h1').css("visibility", "hidden");

			if (playerCount == 1) {
				$('#banner').text("BLOCK COMPLETED");

			} else if (player1Points > player2Points) {
				$('#banner').text("PLAYER 1 WINS");

			} else if (player2Points > player1Points) {
				$('#banner').text("PLAYER 2 WINS");
			}

		// AFTER SOME TIME HAS PASSED VIEWING THE WINNING BLOCK AND PLAYER...

		setTimeout(() => {

			$('h1').css("visibility", "visible");

		// TURNS ON/OFF SECTION DISPLAYS PROPERLY

			$('#turn').css("display", "none");
			$('#banner').css("display", "none");
			$(player).css("display", "none");
			$('.finish').css("display", "block");

		// APPENDS ALL THE CORRECT AND INCORRECT ANSWERS TO DISPLAY ON THE RESULTS PAGE

			for (i = 0; i <= questionsUsed.length; i++) {
				$('#player1Correct').append(player1Correct[i]);
				$('#player1Incorrect').append(player1Incorrect[i]);
				$('#player2Correct').append(player2Correct[i]);
				$('#player2Incorrect').append(player2Incorrect[i]);
			}

		// CHANGES THE DISPLAY IF SOLO PLAY IS ENABLED (LIKE REMOVING PLAYER 2 CONTENT)

			if(playerCount == 1) {
				$('#player1Finish').text("OVERVIEW");
				$('#player2Finish').css("display", "none");
				$('#player2Correct').css("display", "none");
				$('#player2Incorrect').css("display", "none");
				$('#player2Finish').css("display", "none");
			}
			}, 5000)

		}

		// CHECKS IF THERE IS A WINNER BASED ON THE TURN

		let checkWin = () => {
			if (lastTurn === 1 && player1Points === 9 && player2Points === 9) {
				suddenDeath = 1;
				turn = 0;
				player1Points = 0;
				player2Points = 0;

			} else if ((lastTurn === 1 && player1Points === 9 && player2Points === 8) || (player2Points === 9 && player1Points !== 9) || (player1Points === 9 && player2Points < 8)) {
				breakdown();
			} else if (player1Points === 9 && player2Points === 8) {
				lastTurn = 1;
			}
		}

		// SWITCHES THE DISPLAY FROM THE QUESTION SECTION TO THE ANSWER SECTION

		let answers = () => {
			$('.question').css("display", "none");
			$('.answer').css("display", "block");
		}	

		// WHEN GUESS IS CLICKED ON THE ANSWER PAGE: GOES TO REVEAL THE CORRECT ANSWER
		// AND DETERMINE IF THE USER IS CORRECT / INCORRECT

			// VARIABLES

				// WHEN THE CONTINUE BUTTON IS CLICKED LATER, THIS VALUES MAKES SURE THAT THE
				// CURRENT BLOCK ONLY GETS ANIMATED IF IT WAS JUST CORRECTLY ANSWERED AND NOT
				// FOR A TURN OR MULTIPLE TURNS AGO

				let rightAnswer = 0;

		let guessPress = () => {

			$('#answerLink').text(aboutSet);
			$('#description').text(descriptionSet);
			$('#answerLink').attr("href", linkSet);
			$('#answerLink').attr("class", "helpfulLink");

			if ($('#inputAnswer').val().toLowerCase() == answerSet.toLowerCase() || $('#inputAnswer').val().toLowerCase() == "cheat") {
				$('#answerType').text("CORRECT!");
				rightAnswer = 1;
				answers();
				correct();
			} else if ($('#inputAnswer').val() === "") {
				$('#inputAnswer').attr("placeholder", "Don't forget to answer!");
			} else {
				$('#answerType').text("INCORRECT.");
				$('#description').text(descriptionSet);

				if(player === "#player1") {
					player1Incorrect.push(`<p class='helpfulLink'><a target=\"_blank\" href='${linkSet}'> ${aboutSet} </a></p>`);
				} else if (player === "#player2") {
					player2Incorrect.push(`<p class='helpfulLink'><a target=\"_blank\" href='${linkSet}'> ${aboutSet} </a></p>`);
				}
				answers();
				checkWin();
			}
			$('#inputAnswer').val("");
		}

		$('#guess').click(guessPress);

		// CALLED UPON IF A PLAYER GUESSES AN ANSWER CORRECTLY

			// VARIABLES USED

				// HOW MANY POINTS THE PLAYERS CURRENTLY HAVE, DETERMINING WINNER/LOSER/SUDDEN DEATH

					let player1Points = 0;
					let player2Points = 0;

				// ATTACHES THE POINT VALUE OF THE CURRENT PLAYER TO THIS VARIABLE SO
				// THE CORRECT BLOCK WILL BE MOVED, AND FOR THE RIGHT PLAYER, AFTER CONTINUE IS PRESSED

					let currentPlayer;

				// USED TO STORE THE CURRENT BLOCK FOR PLAYER 1 OR 2 TO BE MANIPULATED

					let blocks;

				// HELPS FIGURE OUT WHICH BLOCK SHOULD BE MANIPULATED	

					let player1Blocks = 1;
					let printPlayer1Blocks = '#block1_' + player1Blocks;
					let player2Blocks = 1;
					let printPlayer2Blocks = '#block2_' + player2Blocks;

				// ARRAYS HOLDING ON TO CORRECT/INCORRECT CHOICES BY PLAYERS TO SHOW IN RESULTS PAGE

					let player1Correct = [];
					let player1Incorrect = [];

					let player2Correct = [];
					let player2Incorrect = [];

		function correct() {

			if (player === "#player1") {
				blocks = printPlayer1Blocks;
				player1Points++;
				player1Correct.push("<p class='helpfulLink'><a target=\"_blank\" href='" + linkSet +"'>" + aboutSet + "</a></p>");
				
			} else if (player === "#player2") {
				blocks = printPlayer2Blocks;
				player2Points++;
				player2Correct.push("<p class='helpfulLink'><a target=\"_blank\" href='" + linkSet +"'>" + aboutSet + "</a></p>");
			}

			$(blocks).css("background-image", images);
			$(blocks).css("background-size", "cover");

			if (player === "#player1") {
				currentPlayer = player1Points;

			} else {
				currentPlayer = player2Points;
			}

			if (player === "#player1") {
				player1Blocks++;
				printPlayer1Blocks = "#block1_" + player1Blocks;

			} else if (player === "#player2") {
				player2Blocks++;
				printPlayer2Blocks = "#block2_" + player2Blocks;
			}
			checkWin();
			}

		// CHECKS TO SEE IF THERE IS A WINNER ON THIS TURN

			// VARIABLES USED

				// SET TO 1 IF PLAYER 1 COMPLETES THE BLOCK AND PLAYER 2 HAS A CHANCE TO AS WELL ON
				// THE NEXT TURN, GIVING EACH PLAYER AN EQUAL SHOT TO WIN

					let lastTurn = 0;

				// SET TO 1 IF EACH PLAYER HAS THE SAME AMOUNT OF POINTS AT THE END OF THE GAME OR
				// DURING SUDDEN DEATH, TAKING PLACE AFTER THAT OUTCOME

					let suddenDeath = 0;

		// WHEN CONTINUE IS PRESSED ON THE ANSWERS SCREEN...

		$('#continue').click(continuePress);

		function continuePress() {

		// // IF THE ANSWER IS CORRECT, THE NEWLY FILLED IN BLOCK WILL ANIMATE PROPERLY

			if (rightAnswer === 1) {
				let move;
				if (currentPlayer === 1 || currentPlayer === 4 || currentPlayer === 7) {
					move = "left";
				} else if (currentPlayer === 2 || currentPlayer === 5 ||currentPlayer === 8) {
					move = "top";
				} else if (currentPlayer === 3 || currentPlayer === 6 ||currentPlayer === 9) {
					move = "right";
				}

				$(blocks).animate({[move]: "-=800px"}, 0);
				$(blocks).animate({[move]: "+=400px"}, 750, "linear");
				$(blocks).animate({[move]: "+=400px"}, 750, "linear");

				rightAnswer = 0;
			}

			// IF IT'S SUDDEN DEATH, IT WILL SAY SO AND THEN GO TO SET UP ANOTHER QUESTION
			// UNLESS A PLAYER WINS AND THEN IT SENDS THE PLAYER OVER TO THE RESULTS PAGE

			let nextTurn = () => {
				turn++;
				$('.answer').css("display", "none");
				$(player).css("display", "block");
				setQuestion();
				setup();
			}

			if (suddenDeath === 1) {
					$('#banner').css("display", "block");
					$('#banner').text("SUDDEN DEATH");
				if ((turn%2 === 0 && (player1Points > player2Points)) || (turn%2 === 0 && (player2Points > player1Points))) {
					breakdown();
				} else {
					nextTurn();
				}
			} 

			nextTurn();
		}
		// WHEN REPLAY IS CLICKED, IT RESETS ALL OF THE CONTENT TO SET UP A NEW GAME AND CHANGES DISPLAYS

		$('#replay').click(replayPress);

		function replayPress() {

			$('.finish').css("display", "none");

			player1Correct = [];
			player1Incorrect = [];
			player2Correct = [];
			player2Incorrect = [];
			player1Points = 0;
			player2Points = 0;
			currentPlayer = 0;
			lastTurn = 0;
			suddenDeath = 0;
			player1Blocks = 1;
			player2Blocks = 1;
			printPlayer1Blocks = '#block1_' + player1Blocks;
			printPlayer2Blocks = '#block2_' + player2Blocks;
			turn = 0;
			player = "#player1";

			$(".colorBlock").css("background-image", "none");
			$('#player1').css("display", "block");
			$('#turn').css("display", "block");
			$("#turn").text("PLAYER 1"); 

			setup();

			}
	}
})