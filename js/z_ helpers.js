/* Contains helper functions that other larger functions call

CONTENTS:
	1. Global variables for container divs
	2. resetPage()			Resets container divs to blank and rewrites page data
	3. showHide ()			Toggles show/hide text in button for showing/hiding milestones
	4. getDuration ()		Converts a millisecond difference between two dates to days
	5. getDateString ()		Converts a date-format variable into a YYYY-MM-DD string for use in form fields
	6. validateUpload ()	Validates user-uploaded data
*/

// Set variables to put JS-generated HTML cards into
const inProgress = document.getElementById('in-progress');
const complete = document.getElementById('complete');

// Resets container divs to blank and rewrites page data
function resetPage () {
	inProgress.innerHTML = '';
	complete.innerHTML = '';
	saveChanges();
	location.reload();
	writeCard();
}

// Toggles show/hide text in button for showing/hiding milestones
function showHide (button) {
	button = document.getElementById(button);
	if (button.innerHTML == 'Show milestones') {
		button.innerHTML = 'Hide milestones';
	} else if (button.innerHTML == 'Hide milestones') {
		button.innerHTML = 'Show milestones';
	} else {
		alert ('Error in milestones show/hide function');
	}
}

function getDuration (start, end) {
	return Math.floor((end - start) / (1000 * 3600 * 24));
}

function getDateString (inputDate) {
	const date = new Date (inputDate);
	let dateString = '';
	let year = date.getFullYear();
	let month = date.getMonth();
	let day = date.getDate();
	dateString += year + '-';
	if (month < 10) {
		dateString += '0' + (month + 1) + '-';
	} else {
		dateString += month + '-';
	}
	if (day < 10) {
		dateString += '0' + day;
	} else {
		dateString += day;
	}
	return dateString;
}

function validateUpload (userData, e) {
	for (const counter in userData) {
		const challenge = userData[counter];

		// Validate that all values for each key have the correct data type
		if (typeof challenge.name != 'string') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.name + ' is not a string');
			break;
		}
		if (typeof challenge.company != 'string') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.company + ' is not a string');
			break;
		} 
		if (typeof parseFloat(challenge.distance) != 'number') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.distance + ' is not a number');
			break;
		} 
		if (typeof challenge.unit != 'string') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.unit + ' is not a string');
			break;
		} 
		if (typeof challenge.period != 'boolean' && typeof parseFloat(challenge.period) != 'number') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.period + ' is not a number or boolean');
			break;
		} 
		if (typeof challenge.start != 'string') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.start + ' is not a string');
			break;
		} 
		if (typeof parseFloat(challenge.progress) != 'number') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.progress + ' is not a number');
			break;
		}
		if (typeof challenge.complete != 'boolean' && typeof challenge.complete != 'string') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.complete + ' is not a string or boolean');
			break;
		}
		if (typeof challenge.milestones != 'object') {
			alert ('File validation error: invalid data in ' + challenge.name + '\r\n' + challenge.milestones + ' is not an object');
			break;
		}
	}
	window.localStorage.setItem('distanceTracker', JSON.stringify(userData)); // Load contents of file into localStorage object
	challenges = userData;
	document.getElementById('upload-success').innerHTML = '<div class="alert alert-success">File uploaded successfully.</div>';
}