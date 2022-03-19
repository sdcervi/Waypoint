/* Contains functions to process data

CONTENTS:
	1. Global variable for challenges object, initialized to empty, then filled with localStorage data if it exists
	2. deleteChallengeModal		Variables and function to delete a challenge
	3. saveChanges ()			Saves the challenges object into localStorage
	4. exportFile ()			Exports localStorage to file and downloads it to the user's device
	5. importFile ()			Imports data from a user-uploaded file and validates the contents
	6. deleteData ()			Deletes all distance tracker user data from localStorage
*/


let challenges = {}; // Initialize challenges object to empty

// If localStorage contains a challenges object, copy that data into our challenges object
if (JSON.parse(window.localStorage.getItem('distanceTracker'))) {
	challenges = JSON.parse(window.localStorage.getItem('distanceTracker'));
}

// Deletes a challenge based on ID passed by the button that opens the modal, after confirming deletion via modal
if (document.getElementById('deleteChallengeModal')) {
	const deleteChallengeModal = document.getElementById('deleteChallengeModal');
	let deleteChallengeID = '';
	deleteChallengeModal.addEventListener('show.bs.modal', function (event) {
		const button = event.relatedTarget;
		deleteChallengeID = button.getAttribute('data-bs-challenge');
		const modalBodyInput = deleteChallengeModal.querySelector('.modal-body #challenge-delete-name');
		modalBodyInput.value = challenges[deleteChallengeID].name.replace(/&amp;/g, '&');
	});
	function deleteChallenge () {
		delete challenges[deleteChallengeID];
		resetPage ();
	}	
}

// Saves the challenges object into localStorage
function saveChanges () {
	window.localStorage.setItem('distanceTracker', JSON.stringify(challenges));
}

// Exports localStorage to file and downloads it to the user's device
function exportFile () {
	let fileOutput = document.createElement("a"); // Creates a link element to download the file
	fileOutput.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(challenges))); // Sets link target to JSON string from challenges object
	fileOutput.setAttribute("download", "distance-tracker-data-export.txt"); // Tells the browser to download the data, using the specified filename
	fileOutput.style.display = "none"; // Hides the link from view
	document.body.appendChild(fileOutput); // Adds the link to the end of the HTML document
	fileOutput.click(); // Triggers a click event on the link
	document.body.removeChild(fileOutput); // Removes the link from the end of the HTML document
}

// Imports data from a user-uploaded file and validates the contents
function importFile (event) {
	let userUpload = event.target.files; // When a user uploads a file
	let file = userUpload[0]; // Get the data from the first item in the array
	
	// Validate file name, file size, and file type
	if (file.name === 'distance-tracker-data-export.txt' && file.size < 5000 && file.size > 50 && file.type === 'text/plain') { 
		let reader = new FileReader(); // Create a new reader object
		reader.onload = (function(theFile) { // When the reader is invoked
			return function(e) {
				if (e.target.result.charAt(0) != '\{') {
					alert ('File validation error: incorrect file contents');
					return;
				}
				let userData = JSON.parse(e.target.result); // Parse the JSON and load that into a temporary holding object
				if (Object.keys(userData).length === 0) { // Check to see if there is usable data in that object
					alert ('File validation error: empty file');
				} else {
					validateUpload(userData);
				}
			};
		})(file); // Pass the user-uploaded file into the anonymous function
		reader.readAsText(file); // Invoke reader on the user-uploaded file
	} else if (file.name != 'distance-tracker-data-export.txt') {
		alert ('File validation error: file name incorrect.');
	} else if (file.size == 0) {
		alert ('File validation error: file too small');
	} else if (file.size > 5000) {
		alert ('File validation error: file too large');
	} else if (file.type != 'text/plain') {
		alert ('File validation error: incorrect file type');
	} else {
		alert ('File validation error: unknown error');
	}
}
if (document.getElementById('uploadFile')) {
	document.getElementById('uploadFile').addEventListener('change', importFile, false); // Event handler to trigger upload once user selects a file with the browser
}

// Deletes all distance tracker user data from localStorage
function deleteData () {
	window.localStorage.removeItem('distanceTracker'); // Removes distanceTracker from localStorage
	challenges = {}; // Sets challenges object to empty
	resetPage ();
}