
$(document).ready(function() {

// Quiz Object
	var quizObj = {
		takeQuiz: false,
		questionNumbers: [],
		questionNumber: 0,
		correct: 0,
		incorrect: 0,
		checkedVal:0,
		questionsAnswered: [],		
		answers: [],
		questions:[],
		correctAnswer: [],
		incorrectAnswers: new Array(15),		
		time: 0,

	};
// Quiz Load Function
	function quizCall(){
		quizObj.correct = 0;
		quizObj.incorrect = 0;
		quizObj.questions = [];
		quizObj.correctAnswer = [];
		quizObj.takeQuiz = true;
		quizObj.questionNumber = 0;
		quizObj.questionNumbers = [];

		var queryURL = "https://opentdb.com/api.php?amount=15&category=9&type=multiple";
		
		$.ajax({
		type: "GET",
	    url: queryURL,
	    data: { get_param: "results"},
	    dataType: "json",
	    success: function(data){
	    	for(i=0; i < data.results.length; i++){
	    		quizObj.questions.push(data.results[i].question);
	    		quizObj.correctAnswer.push(data.results[i].correct_answer);
	    		quizObj.incorrectAnswers[i] = new Array(3);
	    	for(j=0; j < 3; j++){
	    		quizObj.incorrectAnswers[i][j] = data.results[i].incorrect_answers[j];	
	    		}
	    	}
	    }
	    
	    }).done(function(response) {

			$(".submit").removeClass("hide");
			$("#time-remaining").removeClass("hide");
			$("#question").removeClass("hide");
			$(".answers").removeClass("hide");

			$(".play-again").addClass("hide");
			$("#grade").empty();
			quizObj.questionNumbers = shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);			
			questionCall();
						

		});
	};
// Sort Questions in Random Order		
	function shuffle(array) {
	    var i = array.length,
	        j = 0,
	        temp;
	    	while (i--) {

		        j = Math.floor(Math.random() * (i+1));

		        // swap randomly chosen element with current element
		        temp = array[i];
		        array[i] = array[j];
		        array[j] = temp;
	    	}
	    return array;
	}

	function questionCall(num){					
			$("correct-incorrect").empty();	
			quizObj.time = 15;
			$("#question").html(quizObj.questions[quizObj.questionNumbers[quizObj.questionNumber]]);			
			answerCall();		
	}	
// Puts Answers in Random Order
	function answerCall(){
		
		for(i=0; i <= 3; i++){
			if(i === 0){
				quizObj.answers.push(quizObj.correctAnswer[quizObj.questionNumbers[quizObj.questionNumber]]).innerText;
				
			}
			else{
				quizObj.answers.push(quizObj.incorrectAnswers[quizObj.questionNumbers[quizObj.questionNumber]][i-1]).innerText;
			}

		}
		quizObj.answers.sort(function(a,b){return 0.5 - Math.random()});
		$("#0").html('<input type="radio" name="optionsRadios" id="optionsRadios0" value="' + quizObj.answers[0] + '">' + quizObj.answers[0]);
		$("#1").html('<input type="radio" name="optionsRadios" id="optionsRadios1" value="' + quizObj.answers[1] + '">' + quizObj.answers[1]);
		$("#2").html('<input type="radio" name="optionsRadios" id="optionsRadios2" value="' + quizObj.answers[2] + '">' + quizObj.answers[2]);
		$("#3").html('<input type="radio" name="optionsRadios" id="optionsRadios3" value="' + quizObj.answers[3] + '">' + quizObj.answers[3]);


// Selects Checked Radio Button
	$(this).on("click", function(){
		quizObj.checkedVal = $("input:checked").val();			
		});
	}
// Submit
	$(".submit").on("click", function(event){
		$("#correct-incorrect").removeClass("hide");
		quizLogic();
		qReset();
		questionCall();
	});
// Question Reset
	function qReset(){
		quizObj.answers = [];
		quizObj.checkedVal = 0;
	}
// Time Reset
// Correct Answer Logic
	function quizLogic(){
		if(quizObj.checkedVal === quizObj.correctAnswer[quizObj.questionNumbers[quizObj.questionNumber]]){
			quizObj.correct++;
			quizObj.questionNumber++;
			$("#correct-incorrect").removeClass("incorrect");
			$("#correct-incorrect").addClass("correct").text("Correct!");
			
		}
		else{
			quizObj.incorrect++;
			quizObj.questionNumber++;
			$("#correct-incorrect").removeClass("correct");
			$("#correct-incorrect").addClass("incorrect").text("Inorrect!");
		}
		if (quizObj.questionNumber === 15){
			quizObj.takeQuiz = false;
			completeQuiz();
			qReset();
	}
		}
// Complete Quiz
function completeQuiz(){
	$(".submit").addClass("hide");
	$("#time-remaining").addClass("hide");
	$("#question").addClass("hide");
	$(".answers").addClass("hide");
	$("#correct-incorrect").addClass("hide");
	$(".play-again").removeClass("hide");
	var grade = Math.floor((quizObj.correct / 15) * 100);
	clearInterval(questionTime);
	$("#grade").html("Your Grade: " + grade + "/100 <br> Correct: " + quizObj.correct + "/15 <br> Incorrect: " + quizObj.incorrect + "/15");
	

};
// Clock Start
var questionTime = setInterval(function(){
	count();		
}, 1000);
// Play Again
$(".play-again").on("click", function(event){
	quizCall();
	qReset();
	count()
	questionTime = setInterval(function(){
	count();		
	}, 1000);
	
});
// Count
function count(){
	$("#time-remaining").text(quizObj.time);
	quizObj.time--;
	if(quizObj.time < 0 && quizObj.takeQuiz === true){
		quizObj.time = 0;
		quizLogic();
		qReset();
		questionCall();
		return;
	}
	else if(quizObj.time < 0 && quizObj.takeQuiz === false){
		quizObj.time = 0;
		quizLogic();
		quizCall();
		qReset();
		

	}

}
// Onload Commands
window.onload = quizCall();

});