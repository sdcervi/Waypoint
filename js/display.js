/* Contains the function that generates the page's content in cards from the challenges object */
	
// If the challenges object is empty (length of keys array is 0), add default text instead
if (Object.keys(challenges).length === 0) {
	inProgress.innerHTML += '<p>Add some challenges to get&nbsp;started!</p>';
	const exportButton = document.getElementById('exportButton');
	if (exportButton != null) {
		exportButton.setAttribute('disabled', true);
		exportButton.setAttribute('tab-index', -1);
	}
}

// Tests whether there are any completed challenges, with fallback default text
let anyCompleted = false;
for (const counter in challenges) {
	if (challenges[counter].complete != false) {
		anyCompleted = true;
	}
}
if (anyCompleted == false) {
	complete.innerHTML += '<p>Looks like you haven&rsquo;t completed any challenges&nbsp;yet.</p>';
}

// For all challenges within the challenges container object, generate the challenge's card
/* for (const counter in challenges) {
	const challenge = challenges[counter];
	writeCard (challenge, counter);
} */

// Generates each challenge's card from data stored in localStorage object, and writes it to the page
function writeCard (counter) {
	const challenge = challenges[counter];
		
	// If a challenge's progress is 100% or greater to indicate being complete, and the challenge is not marked complete, set completion date to today (which will evaluate to true)
	if (challenge.progress >= challenge.distance && !challenge.complete) {
		challenge.complete = new Date();
	}

	// If the challenge is not complete
	if (!challenge.complete) {

		// Calculate the challenge's end date from the start date and period, and calculate how far along we are in the time window
		const today = new Date ();
		const startDate = new Date (challenge.start);
		let endDate = new Date (challenge.start);
		endDate.setDate(endDate.getDate() + challenge.period);
		let timeSoFar = getDuration(startDate.getTime(), today.getTime()); // Get difference in days between start time and today

		let progress = Math.floor((challenge.progress / challenge.distance) * 100); // Calculate progress toward goal in percentage and round down

		// Generate the card header, containing the challenge name and add/edit/delete buttons
		let cardContent = '<article class="col" id="' + counter +'"><div class="card race-card"><div class="card-header race-name">';
		cardContent += '<button class="btn btn-sm btn-primary progress-edit" data-bs-toggle="modal" data-bs-target="#deleteChallengeModal" data-bs-challenge="' + counter + '"><i class="bi bi-x-circle-fill" aria-label="Delete challenge"></i></button>'; // Delete button
		cardContent += '<button class="btn btn-sm btn-primary progress-edit"><a href="./edit-challenge.html?challenge_id=' + counter + '"><i class="bi bi-pencil-square" aria-label="Edit challenge"></i></a></button>'; // Edit button
		cardContent += '<button class="btn btn-sm btn-primary progress-edit" data-bs-toggle="modal" data-bs-target="#addProgressModal" data-bs-challenge="' + counter + '"><i class="bi bi-plus-lg" aria-label="Add progress"></i></button>'; // Add progress button
		cardContent += '<h3>' + challenge.name + '</h3></div>'; // Challenge name

		// If the challenge has a period specified, add it to the right of the challenge company name
		cardContent += '<div class="card-body">';
		if (challenge.period) {
			cardContent += '<p class="race-period">Finishes: ' + endDate.toDateString() + '</p>';
		}
		cardContent += '<h4 class="card-title race-company">' + challenge.company + '</h4>'; // Add the name of the company hosting/running the challenge

		//Generate the distance progress bar
		cardContent += '<div class="race-progress"><div class="row"><div class="col-3 progress-header">Distance</div><div class="col-9 progress-display"><div class="progress">';
		if (Object.keys(challenge.milestones).length > 0) { // If the challenge has milestones (milestones array length > 0)
			// Calculate total number of milestone steps; if the last milestone's distance isn't at 100% or near it, add another step to get to 100%
			let numSteps;
			if (challenge.milestones[Object.keys(challenge.milestones).length - 1].distance < challenge.progress) {
				numSteps = Object.keys(challenge.milestones).length + 1;
			} else {
				numSteps = Object.keys(challenge.milestones).length;
			}
			let stepCounter = 1; // Counter for number of steps in the milestone array
			let previousStep = 0; // Holder variable for previous step's distance
			let currentStep = 0; // Holder variable for current step's distance
			let stepSize = 0; // Difference between current step and previous step
			for (const step in challenge.milestones) { // For each milestone in the array
				const milestone = challenge.milestones[step]; // Pull milestone challenge into variable for easy access
				// If the challenge's overall progress is greater than the distance for this milestone, make this milestone's segment full
				if (challenge.progress > milestone.distance) {
					currentStep = milestone.distance;
					stepSize = currentStep - previousStep;
					const opacity = (100 / numSteps) * stepCounter;
					cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
					previousStep = currentStep;
				} else { // If the milestone is not complete
					currentStep = challenge.progress;
					stepSize = currentStep - previousStep;
					previousStep = currentStep;
					const opacity = (100 / numSteps) * stepCounter;
					cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
					break;
				}
				stepCounter++;
			}
			// If the last milestone isn't at 100% or near it, add another segment to the progress bar for remaining progress
			if (stepCounter == numSteps) {
				currentStep = challenge.progress;
				stepSize = currentStep - previousStep;
				previousStep = currentStep;
				const opacity = (100 / numSteps) * stepCounter;
				cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
			}
		} else { // If the challenge doesn't have any milestones, just make a simple progress bar
			cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + progress + '%;" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100">' + progress + '%</div>'
		}

		// If the challenge has a period specified, generate the time progress bar
		if (challenge.period) {
			cardContent += '</div></div></div><div class="row"><div class="col-3 progress-header">Time</div><div class="col-9 progress-display"><div class="progress">';
			cardContent += '<div class="progress-bar progress-time" role="progressbar" style="width: ' + (timeSoFar / challenge.period) * 100 + '%;" aria-valuenow="' + (timeSoFar / challenge.period) * 100 + '" aria-valuemin="0" aria-valuemax="100"></div>';
		}
		cardContent += '</div></div></div></div>';

		// Generate the challenge's details
		cardContent += '<div class="race-details"><p><strong>Goal:</strong> ' + challenge.distance + " " + challenge.unit + '</p><p><strong>Progress:</strong> ' + parseFloat(challenge.progress.toFixed(2)) + " " + challenge.unit + '</p></div>';
		if (Object.keys(challenge.milestones).length > 0) { // If the challenge has milestones (milestones array length > 0)
			cardContent += '<div class="milestone-progress">';
			cardContent += '<button class="btn btn-link btn-sm show-hide" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-' + counter + '" aria-expanded="false" aria-controls="collapse-' + counter + '" id="collapse-button-' + counter + '" onclick="showHide(\'collapse-button-' + counter + '\')">Show milestones</button>';
			cardContent += '<p><strong>Milestones:</strong></p>';
			cardContent += '<div class="table-responsive collapse" id="collapse-' + counter + '"><table class="table table-sm table-borderless milestone-table">';
			let stepCounter = 0; // Counter for number of steps in the milestone array
			let previousStep = 0; // Holder variable for previous step's distance
			let currentStep = 0; // Holder variable for current step's distance
			for (const step in challenge.milestones) { // For each milestone in the array
				const milestone = challenge.milestones[step];
				// If the challenge's overall progress is greater than the distance for this milestone, make this milestone's progress bar full
				if (challenge.progress > milestone.distance) {
					currentStep = milestone.distance;
					cardContent += '<tr><td class="progress-header">' + milestone.name + '</td>';
					cardContent += '<td class="milestone-start">' + previousStep + '</td>';
					cardContent += '<td class="progress-display"><div><div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Complete!</div></div></div></td>';
					cardContent += '<td class="milestone-end">' + milestone.distance + '</td>';
					cardContent += '</tr>';
					previousStep = currentStep;
				} else { // If the milestone is not complete, calculate the progress between previous milestone and upcoming milestone for this progress bar; milestones after this will be 0%
					currentStep = Math.max(challenge.progress - previousStep, 0);
					let nextStep = challenge.milestones[stepCounter].distance - previousStep;
					cardContent += '<tr><td class="progress-header">' + milestone.name + '</td>';
					cardContent += '<td class="milestone-start">' + previousStep + '</td>';
					cardContent += '<td class="progress-display"><div><div class="progress"><div class="progress-bar" role="progressbar" style="width: ' + (currentStep / nextStep) * 100 + '%;" aria-valuenow="' + nextStep + '" aria-valuemin="0" aria-valuemax="100">' + parseFloat(currentStep.toFixed(2)) + " / " + nextStep + '</div></div></div></td>';
					cardContent += '<td class="milestone-end">' + milestone.distance + '</td>';
					cardContent += '</tr>';
					previousStep = challenge.milestones[stepCounter].distance;
				}
				stepCounter++;
			}
			cardContent += '</table></div>';
		}
		cardContent += '</div></div></div></article>';

		// Write the card to the page
		inProgress.innerHTML += cardContent;

	} else { // If the challenge is marked complete
		const endDate = new Date (challenge.complete);

		// Generate the card header, containing the challenge name
		let cardContent = '<article class="col"><div class="card race-card">';
		cardContent += '<div class="card-header race-name">';
		cardContent += '<button class="btn btn-sm btn-primary progress-edit" data-bs-toggle="modal" data-bs-target="#deleteChallengeModal" data-bs-challenge="' + counter + '"><i class="bi bi-x-circle-fill" aria-label="Delete challenge"></i></button>'; // Delete button
		cardContent += '<button class="btn btn-sm btn-primary progress-edit" data-bs-toggle="modal" data-bs-target="#editChallengeModal" data-bs-challenge="' + counter + '"><i class="bi bi-pencil-square" aria-label="Edit challenge"></i></button>'; // Edit button
		cardContent += '<h3>' + challenge.name + '</h3></div>';

		// Generate completion date and add it to the right of the company name
		cardContent += '<div class="card-body">';
		cardContent += '<p class="race-period">Finished: ' + endDate.toDateString() + '</p>';
		cardContent += '<h4 class="card-title race-company">' + challenge.company + '</h4>';

		// Generate the distance progress bar
		cardContent += '<div class="race-progress"><div class="row"><div class="col-3 progress-header">Distance</div><div class="col-9 progress-display"><div class="progress">';
		if (Object.keys(challenge.milestones).length > 0) { // If the challenge has milestones (milestones array length > 0)
			// Calculate total number of milestone steps; if the last milestone's distance isn't at 100% or near it, add another step to get to 100%
			let numSteps;
			if (challenge.milestones[Object.keys(challenge.milestones).length - 1].distance < challenge.progress) {
				numSteps = Object.keys(challenge.milestones).length + 1;
			} else {
				numSteps = Object.keys(challenge.milestones).length;
			}
			let stepCounter = 1; // Counter for number of steps in the milestone array
			let previousStep = 0; // Holder variable for previous step's distance
			let currentStep = 0; // Holder variable for current step's distance
			let stepSize = 0; // Difference between current step and previous step
			for (const step in challenge.milestones) { // For each milestone in the array
				const milestone = challenge.milestones[step];
				currentStep = milestone.distance;
				stepSize = currentStep - previousStep;
				const opacity = (100 / numSteps) * stepCounter;
				cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
				previousStep = currentStep;
				stepCounter++;
			}
			// If the last milestone isn't at 100% or near it, add another segment to the progress bar for remaining progress
			if (stepCounter == numSteps) {
				currentStep = challenge.progress;
				stepSize = currentStep - previousStep;
				previousStep = currentStep;
				const opacity = (100 / numSteps) * stepCounter;
				cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
			}
		} else { // If the challenge doesn't have any milestones, just make a simple progress bar
			cardContent += '<div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Complete!</div>'
		}
		cardContent += '</div></div></div></div>';

		// Generate the challenge's details
		cardContent += '<div class="race-details"><p><strong>Goal:</strong> ' + challenge.distance + " " + challenge.unit + '</p><p><strong>Progress:</strong> ' + parseFloat(challenge.progress.toFixed(2)) + " " + challenge.unit + '</p></div>';
		if (Object.keys(challenge.milestones).length > 0) { // If the challenge has milestones (milestones array length > 0)
			cardContent += '<div class="milestone-progress">';
			cardContent += '<button class="btn btn-link btn-sm show-hide" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-' + counter + '" aria-expanded="false" aria-controls="collapse-' + counter + '" id="collapse-button-' + counter + '" onclick="showHide(\'collapse-button-' + counter + '\')">Show milestones</button>';
			cardContent += '<p><strong>Milestones:</strong></p>';
			cardContent += '<div class="table-responsive collapse" id="collapse-' + counter + '"><table class="table table-sm table-borderless milestone-table">';
			let stepCounter = 0;// Counter for number of steps in the milestone array
			let previousStep = 0; // Holder variable for previous step's distance
			let currentStep = 0; // Holder variable for current step's distance
			for (const step in challenge.milestones) { // For each milestone in the array, write a complete progress bar
				const milestone = challenge.milestones[step];
				currentStep = milestone.distance;
				cardContent += '<tr><td class="progress-header">' + milestone.name + '</td>';
				cardContent += '<td class="milestone-start">' + previousStep + '</td>';
				cardContent += '<td class="progress-display"><div><div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Complete!</div></div></div></td>';
				cardContent += '<td class="milestone-end">' + milestone.distance + '</td>';
				cardContent += '</tr>';
				previousStep = currentStep;
				stepCounter++;
			}
			cardContent += '</table></div>';
		}
		cardContent += '</div></div></div></article>';

		// Write the card to the page
		complete.innerHTML += cardContent;
	}
}