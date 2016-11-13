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
	// console.log(childSnapshot.val().name);
	// console.log(childSnapshot.val().role);
	// console.log(childSnapshot.val().startDate);
	// console.log(childSnapshot.val().rate);

	var newStartDate = new Date(childSnapshot.val().firstTrain);
	console.log("snapshot first train: " + childSnapshot.val().firstTrain);
	console.log("newStartDate: " + newStartDate);

	$('tbody').append('<tr><td>' + childSnapshot.val().name +
		'</td><td>' + childSnapshot.val().destination +'</td><td>'+
		childSnapshot.val().frequency + '</td><td>')
	// console.log(childSnapshot.val().startDate.getMonth());

})
