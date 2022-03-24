/* Contains helper functions that other larger functions call

CONTENTS:
	1. Global variables for container divs
	2. saveChanges()		Saves changes to database and reloads page
	3. showHide ()			Toggles show/hide text in button for showing/hiding milestones
	4. getDuration ()		Converts a millisecond difference between two dates to days
	5. getDateString ()		Converts a date-format variable into a YYYY-MM-DD string for use in form fields
	6. validateUpload ()	Validates user-uploaded data
*/

// Set variables to put JS-generated HTML cards into
const inProgress = document.getElementById('in-progress');
const complete = document.getElementById('complete');

// Saves changes to database and reloads page
function saveChanges () {
	const user = firebase.auth().currentUser;
	let activeChallenges = Object.keys(challenges).length;
	let completedChallenges = 0;
	for (const counter in challenges) {
		const challenge = challenges[counter];
		if (challenge.complete) {
			completedChallenges++;
		}
	}
	if (user) {
		const userData = db.collection('userData').doc(user.uid);
		userData.update({
			challenges: JSON.stringify(challenges),
			completed: completedChallenges,
			total_challenges: activeChallenges
		}).then(() => {
			location.href = './dashboard.html';
		}).catch ((error) => {
			console.error ('Error updating user data: ', error);
		});
	} else {
		alert ('Error saving user data');
	}
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
	return Math.floor ((end - start) / (1000 * 3600 * 24));
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