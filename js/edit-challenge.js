/* Contains functions to edit a challenge's details

CONTENTS:
	1. 						Get the challenge ID out of the URL query string
	2. 						Insert all existing data into the page's form for editing
	3. addMilestone	()		Adds a row for a new milestone when creating a new challenge
	4. deleteMilestone ()	Deletes a milestone row, by unique ID passed from the row's delete button
*/

let milestoneCounter = 0; // Counter for number of milestones added, so that they each have a unique ID

// Get the challenge ID out of the URL query string
const parameters = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const challengeID = parameters.challenge_id;

// Insert all existing data into the page's form for editing

// Grab the challenge for easy editing
const challenge = challenges[challengeID];

// Grab the IDs of each form field
const editName = document.getElementById('challenge-edit-name');
const editCompany = document.getElementById('challenge-edit-company');
const editDistance = document.getElementById('challenge-edit-distance');
const editDistanceUnits = document.querySelectorAll('input[name="distance-edit"]');
const editProgress = document.getElementById('challenge-edit-progress');
const editComplete = document.getElementById('is-complete');
const editPeriod = document.getElementById('challenge-edit-period');
const editPeriodUnit = document.getElementById('challenge-edit-period-unit');
const editStart = document.getElementById('challenge-edit-start');
const editHasMilestones = document.getElementById('hasMilestones');
const editMilestones = document.getElementById('milestones-edit-container');

// Generate date string for inputting into form field
const currentStart = getDateString (challenge.start);

// Pass in all the values
editName.value = challenge.name.replace(/&amp;/g, '&');
editCompany.value = challenge.company;
editDistance.value = challenge.distance;
for (const unit of editDistanceUnits) { // Set radio button
	if (unit.value == challenge.unit) {
		unit.checked = true;
	} else {
		unit.checked = false;
	}
}
editProgress.value = parseFloat(challenge.progress.toFixed(2));
if (challenge.complete) { // Check completed box if challenge is completed
	editComplete.checked = true;
}
editPeriod.value = parseFloat(challenge.period); // Will be empty if no period specified
editPeriodUnit.value = 'day';
editStart.value = currentStart;

// Initialize milestones to empty and hasMilestones not checked
editMilestones.innerHTML = '';
editHasMilestones.checked = false;
document.getElementById('collapse-milestones').classList.remove('show');

// If milestones are present in the challenge data, check hasMilestones, show the div, and generate rows for editing the milestones
if (Object.keys(challenge.milestones).length > 0) {
	editHasMilestones.checked = true;
	document.getElementById('collapse-milestones').classList.add('show');

	for (const counter in challenge.milestones) {
		const milestone = challenge.milestones[counter];
		// Create new milestone row with unique ID
		let milestonesContent = '<div class="row mb-3" id="milestone' + milestoneCounter + '">';
		milestonesContent += '<div class="col-6"><input type="text" class="form-control" name="milestone' + milestoneCounter + '-name" id="milestone' + milestoneCounter + '-name" value="' + milestone.name + '" /></div>';
		milestonesContent += '<div class="col-5"><input type="number" class="form-control" name="milestone' + milestoneCounter + '-distance" id="milestone' + milestoneCounter + '-distance" value="' + milestone.distance + '" /></div>';
		milestonesContent += '<div class="col-1"><button class="btn btn-link btn-sm m-1" type="button" onclick="deleteMilestone(\'milestone' + milestoneCounter + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button></div></div>'; // Creates button to delete, with matching unique ID
		editMilestones.insertAdjacentHTML('beforeend', milestonesContent); // Adds the new row, without overwriting div contents like with innerHTML
		milestoneCounter++;
	}
}

// Adds a row for a new milestone when creating a new challenge
function addMilestone (container) {
	const milestonesDiv = document.getElementById(container); // Variable to put milestone content into
	let milestonesContent = '<div class="row mb-3" id="milestone' + milestoneCounter + '">';
	
	// Create new milestone row with unique ID
	milestonesContent += '<div class="col-6"><input type="text" class="form-control" name="milestone' + milestoneCounter + '-name" id="milestone' + milestoneCounter + '-name" placeholder="Milestone name" /></div>';
	milestonesContent += '<div class="col-5"><input type="number" class="form-control" name="milestone' + milestoneCounter + '-distance" id="milestone' + milestoneCounter + '-distance" placeholder="Distance" /></div>';
	milestonesContent += '<div class="col-1"><button class="btn btn-link btn-sm m-1" type="button" onclick="deleteMilestone(\'milestone' + milestoneCounter + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button></div></div>'; // Creates button to delete, with matching unique ID
	milestonesDiv.insertAdjacentHTML('beforeend', milestonesContent); // Adds the new row, without overwriting div contents like with innerHTML
	milestoneCounter++;
}

// Deletes a milestone row, by unique ID passed from the row's delete button
function deleteMilestone (milestoneID) {
	const milestone = document.getElementById(milestoneID);
	milestone.parentNode.removeChild(milestone);
}

function editChallenge () {
	// Get the new challenge data from the form
	const name = document.getElementById('challenge-edit-name').value;
	const company = document.getElementById('challenge-edit-company').value
	let distance;
	if (parseFloat(document.getElementById('challenge-edit-distance').value) > 0) {
		distance = parseFloat(document.getElementById('challenge-edit-distance').value); // Convert to number; will discard any non-numeric values
	} else if (parseFloat(document.getElementById('challenge-edit-distance').value) <= 0) {
		alert ('Error: invalid distance. Please enter a number greater than 0.');
		distance = challenge.distance;
		return;
	} else if (typeof document.getElementById('challenge-edit-distance').value == 'string') {
		alert ('Error: invalid format for distance. Please enter a number using the digits 0-9. Decimal places are allowed.');
		return;
	}
	const unitList = document.querySelectorAll('input[name="distance-edit"]');
	let distanceUnit;
	for (const unit of unitList) { // Get the selected unit from the list of units available
		if (unit.checked) {
			distanceUnit = unit.value;
			break;
		}
	}
	let progress;
	if (parseFloat(document.getElementById('challenge-edit-progress').value) >= 0) { // If the user entered a number, entered 0, or left it blank
		progress = parseFloat(document.getElementById('challenge-edit-progress').value); // Convert to number to prevent weird math errors; will discard any non-numeric values
	} else if (document.getElementById('challenge-edit-progress').value == '' || parseFloat(document.getElementById('challenge-edit-progress').value) < 0) {
		progress = 0;
	} else { // If the user entered an invalid value somehow
		alert ('Error: invalid format for progress. Please enter a number using the digits 0-9. Decimal places are allowed.');
		return;
	}
	const isComplete = document.getElementById('is-complete').checked;
	let period;
	if (parseFloat(document.getElementById('challenge-edit-period').value) > 0 || document.getElementById('challenge-edit-period').value == '') {
		period = parseFloat(document.getElementById('challenge-edit-period').value); // Convert to number to prevent weird math errors; will discard any non-numeric values
	} else if (parseFloat(document.getElementById('challenge-edit-period').value) <= 0) {
		alert ('Error: invalid time period. Please enter a number greater than 0.');
		return;
	} else {
		alert ('Error: invalid format for time period. Please enter a whole number without a decimal point using the digits 0-9.');
		return;
	}
	const periodUnit = document.getElementById('challenge-edit-period-unit').value;
	const start = document.getElementById('challenge-edit-start').value;
	const hasMilestones = document.getElementById('hasMilestones').checked;
	const milestones = document.getElementById('milestones-edit-container');
	
	// Calculate period in days using start date and number-unit combination from user entry
	let duration = false;
	if (period) {
		const startDate = new Date (start.split('-'));
		let endDate = new Date (start.split('-'));
		if (periodUnit == 'day') {
			endDate.setDate(endDate.getDate() + period + 1); // To correct off-by-one error
		} else if (periodUnit == 'month') {
			endDate.setMonth(endDate.getMonth() + period);
		} else if (periodUnit == 'year') {
			endDate.setYear(endDate.getFullYear() + period);
		} else {
			alert ('Error with date format entry');
			return;
		}
		duration = getDuration (startDate, endDate);
	}
	
	let milestonesArray = []; // Initialize milestones array to be empty
	if (milestones.innerHTML !== '' && hasMilestones) { // Only if the user entered content (milestones div is not empty), AND the milestones checkbox is checked
		for (let counter = 0; counter < milestones.children.length; counter++) { // Iterate through using a counter since milestone unique IDs may skip a number
			// Get the milestone's name and distance
			let milestoneID = milestones.children[counter].id; // Get HTML element's unique ID
			let milestoneName = document.getElementById(milestoneID + '-name').value; // Get the name of the milestone
			// Get distance of milestone, validated as a number
			let milestoneDistance;
			if (parseFloat(document.getElementById(milestoneID + '-distance').value)) {
				milestoneDistance = parseFloat(document.getElementById(milestoneID + '-distance').value); // Convert to number; will discard any non-numeric values
			} else if (typeof document.getElementById(milestoneID + '-distance').value == 'string') {
				alert ('Error: invalid format for milestone distance. Please enter a number using the digits 0-9. Decimal places are allowed.');
				return;
			}
			milestonesArray.push({ name: milestoneName.replace(/ /g, '\u00a0'), distance : milestoneDistance }); // Push new object into array with any spaces in name converted to &nbsp;
		}
	}
	
	// Store all new data into the challenge object
	challenge.name = name.replace(/&/g, '&amp;');
	challenge.company = company;
	challenge.distance = distance;
	challenge.unit = distanceUnit;
	challenge.period = duration;
	challenge.start = start + 'T00:00:00';
	challenge.progress = progress;
	if (isComplete && progress >= distance) {
		challenge.complete = new Date ();
	} else if (isComplete && !challenge.complete) {
		challenge.complete = new Date ();
		challenge.progress = distance
	} else {
		challenge.complete = false;
	}
	challenge.milestones = milestonesArray;
	
	saveChanges();
	window.location.href = './index.html';
}