
$(document).ready(function() {

// Quiz Object
	var quizObj = {
		takeQuiz: false,
		questionNumbers: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
		questionNumber: 0,
		correct: 0,
		incorrect: 0,
		selected: [],
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
			console.log(response);
			console.log(quizObj);			
			questionCall();
			quizObj.takeQuiz = true;			

		});
	};
// Select Question in Random Order
	function questionCall(num){

			var num = Math.floor(Math.random() * 15);
			quizObj.selected.push(num);
			if(quizObj.questions.indexOf(num) === -1){

				quizObj.time = 15;
				quizObj.questionNumber = num;
				$("#question").html(quizObj.questions[num]);
				
				
				console.log(quizObj.questionNumber);
				
				answerCall();

				// quizObj.questions.splice(num,1);

			}
			
	}	
// Puts Answers in Random Order
	function answerCall(){
		
		for(i=0; i <= 3; i++){
			if(i === 0){
				quizObj.answers.push(quizObj.correctAnswer[quizObj.questionNumber]);
				
			}
			else{
				quizObj.answers.push(quizObj.incorrectAnswers[quizObj.questionNumber][i-1]);
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
			console.log(quizObj.checkedVal);
			console.log(quizObj.correctAnswer[quizObj.questionNumber]);
		});
	}
// Submit
	$(".submit").on("click", function(event){
		quizLogic();
		qReset();
		questionCall();
		console.log(quizObj.selected);
		console.log(quizObj.answers);
	});
// Question Reset
	function qReset(){
		quizObj.answers = [];
		quizObj.checkedVal = 0;
	}

// Correct Answer Logic
	function quizLogic(){
		if(quizObj.checkedVal === quizObj.correctAnswer[quizObj.questionNumber]){
			quizObj.correct += 1;
			console.log(quizObj.correct);
		}
		if (quizObj.selected.length === 15){
			quizObj.selected = [];
			completeQuiz();
			qReset();
			quizCall();

	}
		}
// Complete Quiz
function completeQuiz(){
	$("body").html("<h1>FINISHED!!!!</h1>");
	var grade = (quizObj.correct / 15) * 100;
	quizObj.time = 5;
	count();
};
// Clock Start
var questionTime = setInterval(function(){
	count();
		
}, 1000);

$(".stop").on("click", function(event){
	clearInterval(questionTime);
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
		qReset();
		quizCall();

	}

}
// Onload Commands
window.onload = quizCall();

});