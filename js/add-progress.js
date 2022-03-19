/* Contains functions to edit a challenge's details and add progress to it

CONTENTS:
	1. Global variables for edit and add modals
	2. addProgressModal event listener			Gets a challenge's name via challenge ID passed by button, and places that into the modal for reference
	3. addProgress ()							Add to a challenge's progress, incrementing by user-entered amount
*/

let challengeID = '';

// Set variables to access modals for editing a challenge's details and progress
const addProgressModal = document.getElementById('addProgressModal');

// Gets a challenge's name via challenge ID passed by button, and places that into the modal for reference
addProgressModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge'); // Get the challenge's ID from the button clicked
	const modalBodyInput = addProgressModal.querySelector('.modal-body #challenge-add-name');
	modalBodyInput.value = challenges[challengeID].name.replace(/&amp;/g, '&'); // Send the challenge name to the modal, replacing any escaped ampersands with the character
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
		distance += 0.621371;
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
	
	// Reset page contents, regenerate challenge cards, and save the updated data to localStorage
	resetPage();
}