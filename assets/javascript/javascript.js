//firebase database key and creation
var config = {
	apiKey: "AIzaSyBrlaiJCxgsUjbXMvIPQ8HRT8MxlV2eZV4",
	authDomain: "train-schedule-89121.firebaseapp.com",
	databaseURL: "https://train-schedule-89121.firebaseio.com",
	storageBucket: "train-schedule-89121.appspot.com",
	messagingSenderId: "1007543156147"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainSchedule = database.ref("trainData");

// Whenever a user clicks the click button
$("#submit-record").on("click", function() {

	// Get the input values
	name = $('#train-name').val().trim();
	destination = $('#destination-name').val().trim();
	firstTrain = $('#first-train').val().trim();
	frequency = $('#freq').val().trim();

	$('.form-group').children('input').val('');

	// add user inputs to the database
	trainSchedule.push({
		name: name,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency,
		dateAdded: firebase.database.ServerValue.TIMESTAMP,
	});

	// Return False to allow "enter"
	return false;

});

//get child data back
trainSchedule.on("child_added",function(childSnapshot){

	var nextTrain = getNextTrain(childSnapshot.val().firstTrain,childSnapshot.val().frequency);
	var waitTime = getWaitTime(nextTrain)

	nextTrain = nextTrain.format('LT');

	$('tbody').append('<tr><td>' + childSnapshot.val().name +
		'</td><td>' + childSnapshot.val().destination + '</td><td>' +
		childSnapshot.val().frequency + '</td><td>' +
		nextTrain + '</td><td>' +
		waitTime + '</td>')

})

function convertMilTime(trainTime){
	trainTime = trainTime.split(':');
	var hours = parseInt(trainTime[0]);
	var minutes = parseInt(trainTime[1]);
	var timeValue = new Date();

	timeValue.setHours(hours,minutes);
	timeValue = moment(timeValue);

	return timeValue;
}

function getNextTrain(trainTime,frequency){
	var now = moment(new Date());
	var firstTrain = convertMilTime(trainTime);

	// assume the first train hasn't come yet. . .
	var nextTrain = firstTrain;

	// . . . unless the first train was in the past
	// then find the next train until it's in the future
	var foundTrain = false;
	if (nextTrain < now){	
		do {
		    nextTrain = moment(nextTrain).add(frequency, 'minutes');
			if (nextTrain > now){
				foundTrain = true;
			}
		}
		while (foundTrain === false);
	}
	return nextTrain;
}

function getWaitTime(trainTime){
	var now = moment(new Date());
	var waitTime = trainTime.diff(now, 'minutes');
	return waitTime;
}