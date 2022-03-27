/* Contains functions to edit a challenge's details and add progress to it

CONTENTS:
	1. Global variables for edit and add modals
	2. addProgressModal event listener			Gets a challenge's name via challenge ID passed by button, and places that into the modal for reference
	3. addProgress ()							Add to a challenge's progress, incrementing by user-entered amount
*/

let challengeID = '';

// Set variables to access modals for editing a challenge's details and progress
const addProgressModal = document.getElementById('addProgressModal');

// Toggle all challenges for bulk add
function toggleAlsoAdd () {
	const initialState = document.getElementById('alsoAddSelectAll').checked;
	const alsoAddArray = document.querySelectorAll('input[name="alsoAddChecklist"]');
	if (initialState) {
		document.getElementById('alsoAddSelectAllLabel').innerHTML = 'Deselect All';
		alsoAddArray.forEach(element => {
			element.checked = true;
		});
	} else {
		document.getElementById('alsoAddSelectAllLabel').innerHTML = 'Select All';
		alsoAddArray.forEach(element => {
			element.checked = false;
		});
	}
}

// Gets a challenge's name via challenge ID passed by button, and places that into the modal for reference
// Also shows "Also add to other challenges?" prompt if other challenges are in progress too
addProgressModal.addEventListener('show.bs.modal', function (event) {
	// Populate challenge name
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge'); // Get the challenge's ID from the button clicked
	const modalBodyInput = addProgressModal.querySelector('.modal-body #challenge-add-name');
	modalBodyInput.value = challenges[challengeID].name.replace(/&amp;/g, '&'); // Send the challenge name to the modal, replacing any escaped ampersands with the character
	
	// Create also add prompt if needed
	const alsoAddArray = [];
	for (const counter in challenges) {
		const challenge = challenges[counter];
		if (challenge.progress > 0 && !challenge.complete && counter != challengeID) {
			alsoAddArray.push(counter);
		}
	}
	// Output each challenge in the array
	if (alsoAddArray.length > 0) {
		const alsoAddDiv = document.getElementById('alsoAdd');
		let alsoAddContent = '<p>Also add this progress to your other active challenges?</p>';
		alsoAddContent += '<div class="form-check" id="selectAll"><label class="form-check-label" for="alsoAddSelectAll" id="alsoAddSelectAllLabel">Select All</label><input class="form-check-input" type="checkbox" value="" id="alsoAddSelectAll" onclick="toggleAlsoAdd()"></div>';
		for (let counter = 0; counter < alsoAddArray.length; counter++) {
			const challengeID = alsoAddArray[counter];
			alsoAddContent += `<div class="form-check"><input class="form-check-input" type="checkbox" name="alsoAddChecklist" value="" id="alsoAdd${challengeID}"><label class="form-check-label" for="alsoAdd${challengeID}">${challenges[challengeID].name}</label></div>`;
		}
		alsoAddDiv.innerHTML = alsoAddContent;
	}
});

// Add to a challenge's progress, incrementing by user-entered amount
function addProgress () {
	// Get the user's entered amount and convert it to a number
	let distance;
	if (parseFloat(document.getElementById('enter-distance-add').value)) {
		distance = parseFloat(document.getElementById('enter-distance-add').value); // Convert to number; will discard any non-numeric values
	} else if (typeof document.getElementById('enter-distance-add').value == 'string') {
		alert ('Error: invalid format for distance. Please enter a number using the digits 0-9. Decimal places are allowed.');
		return;
	}
	
	// Get the selected unit from the list of units
	const units = document.querySelectorAll('input[name="distance-add"]');
	const challenge = challenges[challengeID];
	let selectedUnit;
	for (const unit of units) {
		if (unit.checked) {
			selectedUnit = unit.value;
			break;
		}
	}
	
	// Convert distance if needed
	if (selectedUnit == challenge.unit) {
		distance *= 1;
	} else if (selectedUnit == 'miles' && challenge.unit == 'kilometers') {
		distance *= 1.60934;
	} else if (selectedUnit == 'kilometers' && challenge.unit == 'miles') {
		distance *= 0.621371;
	} else {
		alert ('Unit conversion error.');
		return;
	}
	
	// Make sure that it won't make the challenge's progress negative
	if (distance < 0 && challenge.progress + distance < 0) {
		challenge.progress = 0;
	} else {
		challenge.progress += distance;
	}
	
	// Check whether bulk-add has been selected, and if so, apply that
	const alsoAddChecklist = document.querySelectorAll('input[name="alsoAddChecklist"]');
	if (alsoAddChecklist.length > 0) {
		let distanceMi;
		let distanceKm;
		if (selectedUnit == 'miles') {
			distanceMi = distance;
			distanceKm = distance * 1.60934;
		} else if (selectedUnit == 'kilometers') {
			distanceMi = distance * 0.621371;
			distanceKm = distance;
		}
		alsoAddChecklist.forEach(element => {
			if (element.checked == true) {
				const challengeID = element.id.slice(7);
				const challenge = challenges[challengeID];
				if (challenge.unit == 'miles') {
					challenge.progress += distanceMi;
				} else if (challenge.unit == 'kilometers') {
					challenge.progress += distanceKm;
				} else {
					alert ('Error adding progress to additional challenges.');
				}
			}
		});
	}
	
	// Save the updated data
	saveChanges ();
}