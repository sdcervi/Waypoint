/* Contains the function that generates the page's content in cards from the challenges object */

/* Contains functions that generate the page's content in cards from the challenges object

CONTENTS:
	1. Global variables for database and current user, event listeners
	2. writeCard ()			Generates each challenge's card from data stored in localStorage object, and writes it to the page
	3. writeData ()			Writes the user's data to the page
	3. getProfileData ()	Fetch the database's profile data for the user and display it
*/

// Global variables for database and challenges
let challenges = {}; // Initialize challenges object to empty
let sortBy;

// Sort modal and selecting correct radio button when opened
const sortModal = document.getElementById('sortModal');
sortModal.addEventListener('show.bs.modal', function (event) {
	const sortMethods = sortModal.querySelectorAll('input[name="sort-by"]');
	for (const sortMethod of sortMethods) {
		if (sortBy == sortMethod.value) {
			sortMethod.checked = true;
		} else {
			sortMethod.checked = false;
		}
	}
});

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
		endDate.setDate(endDate.getDate() + (challenge.period - 1));
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
		
		// If the challenge has a period specified, calculate how far to go each day to meet the goal
		if (challenge.period) {
			const perDay = (challenge.distance - challenge.progress) / (challenge.period - timeSoFar);
			cardContent += '<div class="per-day">Move ' + parseFloat(perDay.toFixed(2)) + ' ' + challenge.unit + ' per day to meet your goal!</div>';
		}

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

function setSortMethod () {
	const sortOptions = document.querySelectorAll('input[name="sort-by"]');
	let userSort;
	for (const sortOption of sortOptions) { // Get the selected unit from the list of units available
		if (sortOption.checked) {
			userSort = sortOption.value;
			break;
		}
	}
	sortBy = userSort;
	if (!sortBy) {
		sortBy = 'progress-desc'; // Set sort by progress to default if no saved value
	}
	
	const user = firebase.auth().currentUser;
	const userData = db.collection('userData').doc(user.uid);
	userData.update({
		sort: sortBy
	}).then(() => {
		location.reload();
	}).catch((error) => {
		console.error('Error writing document: ', error);
	});
}

// Sort the array of challenge IDs according to the corresponding properties, then output the data to screen
function sortCards (challengesArray) {
	// Perform the sort
	const method = sortBy.split("-")[0];
	challengesArray.sort (function(a, b) {
		let distanceA = challenges[a].distance;
		let distanceB = challenges[b].distance;
		const unitA = challenges[a].unit;
		const unitB = challenges[b].unit;
		let endDateA;
		let endDateB;
		if (challenges[a].period) {
			endDateA = new Date (challenges[a].start);
			endDateA.setDate(endDateA.getDate() + challenges[a].period);
		}
		if (challenges[b].period) {
			endDateB = new Date (challenges[b].start);
			endDateB.setDate(endDateB.getDate() + challenges[b].period);
		}
		switch (sortBy) {
			case 'progress-desc':
				if ((challenges[a].progress / challenges[a].distance) > (challenges[b].progress / challenges[b].distance)) { // If a's property comes after b's property
				return -1;
				} else if ((challenges[a].progress / challenges[a].distance) < (challenges[b].progress / challenges[b].distance)) { // If b's property comes after a's property
					return 1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			case 'progress-asc':
				if ((challenges[a].progress / challenges[a].distance) > (challenges[b].progress / challenges[b].distance)) { // If a's property comes after b's property
					return 1;
				} else if ((challenges[a].progress / challenges[a].distance) < (challenges[b].progress / challenges[b].distance)) { // If b's property comes after a's property
					return -1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			case 'calendar-desc':
				if (!endDateA && endDateB) {
					return 1;
				} else if (endDateA && !endDateB) {
					return -1;
				}
				if (endDateA > endDateB) { // If a's property comes after b's property
					return 1;
				} else if (endDateA < endDateB) { // If b's property comes after a's property
					return -1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			case 'calendar-asc':
				if (!endDateA && endDateB) {
					return 1;
				} else if (endDateA && !endDateB) {
					return -1;
				}
				if (endDateA > endDateB) { // If a's property comes after b's property
					return -1;
				} else if (endDateA < endDateB) { // If b's property comes after a's property
					return 1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			case 'name-asc':
				if (challenges[a][method] > challenges[b][method]) { // If a's property comes after b's property
					return 1;
				} else if (challenges[a][method] < challenges[b][method]) { // If b's property comes after a's property
					return -1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			case 'name-desc':
				if (challenges[a][method] > challenges[b][method]) { // If a's property comes after b's property
					return -1;
				} else if (challenges[a][method] < challenges[b][method]) { // If b's property comes after a's property
					return 1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			case 'distance-asc':
				// Convert km to mi for accurate comparison
				if (unitA == 'kilometers') {
					distanceA *= 0.621371;
				}
				if (unitB == 'kilometers') {
					distanceB *= 0.621371;
				}
				if (distanceA > distanceB) { // If a's property comes after b's property
					return 1;
				} else if (distanceA < distanceB) { // If b's property comes after a's property
					return -1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			case 'distance-desc':
				// Convert km to mi for accurate comparison
				if (unitA == 'kilometers') {
					distanceA *= 0.621371;
				}
				if (unitB == 'kilometers') {
					distanceB *= 0.621371;
				}
				if (distanceA > distanceB) { // If a's property comes after b's property
					return -1;
				} else if (distanceA < distanceB) { // If b's property comes after a's property
					return 1;
				} else { // If a and b's properties are equal
					if (challenges[a].name > challenges[b].name) {
						return 1;
					} else if (challenges[a].name < challenges[b].name) {
						return -1;
					}
				}
				break;
				
			default:
				alert ('Error in sorting function');
		}
	});
	
	inProgress.innerHTML = '';
	complete.innerHTML = '';

	for (const counter in challengesArray) {
		writeCard (challengesArray[counter]);
	}
}

// Writes the user's data to the page
function writeData (userSort) {
	// Tests whether there are any completed challenges, with fallback default text
	let anyCompleted = false;
	for (const counter in challenges) {
		if (challenges[counter].complete != false) {
			anyCompleted = true;
		}
	}
	if (anyCompleted == false) {
		complete.innerHTML = '<p>Looks like you haven&rsquo;t completed any challenges&nbsp;yet.</p>';
	}
	
	sortBy = userSort;

	// Create challenges array to perform sort upon
	let challengesArray = [];
	for (const counter in challenges) {
		challengesArray.push(counter);
	}
	
	sortCards(challengesArray);
}

// Fetch the database's profile data for the user and display it
function getProfileData (user) {
	// Fetch the user's data
	const userData = db.collection('userData').doc(user.uid);
	
	// Check to see if user has challenges in the database
	userData.get().then((doc) => {
		const data = doc.data();
		// If the user's db data contains a challenges JSON string, copy that data into our challenges object
		if (data.challenges) {
			challenges = JSON.parse(data.challenges);
			writeData(data.sort);
		} else {
			inProgress.innerHTML = '<p>Add some challenges to get&nbsp;started!</p>';
			complete.innerHTML = '<p>Looks like you haven&rsquo;t completed any challenges&nbsp;yet.</p>';
			const exportButton = document.getElementById('exportButton');
			if (exportButton != null) {
				exportButton.setAttribute('disabled', true);
				exportButton.setAttribute('tab-index', -1);
			}
		}
	}).catch((error) => {
		console.log('Error getting user data: ', error);
	});
}

let deleteChallengeID = '';
// Deletes a challenge based on ID passed by the button that opens the modal, after confirming deletion via modal
if (document.getElementById('deleteChallengeModal')) {
	const deleteChallengeModal = document.getElementById('deleteChallengeModal');
	deleteChallengeModal.addEventListener('show.bs.modal', function (event) {
		const button = event.relatedTarget;
		deleteChallengeID = button.getAttribute('data-bs-challenge');
		const modalBodyInput = deleteChallengeModal.querySelector('.modal-body #challenge-delete-name');
		modalBodyInput.value = challenges[deleteChallengeID].name.replace(/&amp;/g, '&');
	});
}

function deleteChallenge () {
	delete challenges[deleteChallengeID];
	saveChanges ();
}	