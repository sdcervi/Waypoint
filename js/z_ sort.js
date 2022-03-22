/* Contains the functions that sort the challenges */

// Check to see if the user has a saved sort method
let sortBy;
if (window.localStorage.getItem('distanceTracker-sortBy')) {
	sortBy = window.localStorage.getItem('distanceTracker-sortBy');
} else {
	sortBy = 'progress-desc';
	window.localStorage.setItem('distanceTracker-sortBy', sortBy);
}

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

// Create challenges array to perform sort upon
let challengesArray = [];
for (const counter in challenges) {
	challengesArray.push(counter);
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
	window.localStorage.setItem('distanceTracker-sortBy', sortBy);
	location.reload();
}

// Sort the array of challenge IDs according to the corresponding properties, then output the data to screen
function sortCards () {
	// Perform the sort
	const method = sortBy.split("-")[0];
	const direction = sortBy.split("-")[1];
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

sortCards ();