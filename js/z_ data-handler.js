/* Contains functions to process data

CONTENTS:
	1. Global variables for database and current user


	1. Global variable for challenges object, initialized to empty, then filled with localStorage data if it exists
	2. deleteChallengeModal		Variables and function to delete a challenge
	3. saveChanges ()			Saves the challenges object into localStorage
	4. exportFile ()			Exports localStorage to file and downloads it to the user's device
	5. importFile ()			Imports data from a user-uploaded file and validates the contents
	6. deleteData ()			Deletes all distance tracker user data from localStorage
*/

// Global variables for database and current user
const db = firebase.firestore();

function getUserData (user) {
	const userData = db.collection('userData').doc(user.uid);
	const displayName = user.displayName;
	const userID = user.uid;
	userData.onSnapshot((doc) => {
        if (doc.exists) {
			return;
		} else {
			db.collection('userData').doc(user.uid).set({
				sort: 'progress-desc',
				unit: 'mile',
				completed: 0
			}).then(() => {
				return;
			}).catch((error) => {
				console.error("Error writing document: ", error);
			});
		}
    });
}

function logout () {
	firebase.auth().signOut()
		.then(function() {
			location.href = 'index.html';
		})
		.catch(function(error) {
			console.log ('Sign out error');
		});
}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		document.getElementById('signin-button').style.display = 'none';
		getUserData(user);
	} else {
		document.getElementById('signin-button').style.display = 'inline-block';
	}
});


/*


function saveData () {
	if (currentUser) {
		const userData = db.collection('userData').doc(currentUser.uid);
		const key = document.getElementById('newProperty').value;
		const value = document.getElementById('newValue').value;
		userData.update({
			[key]: value
		}).then(() => {
			return;
		}).catch ((error) => {
			console.error ('Error updating user data: ', error);
		});		
	} else {
		return;
	}
}


			const data = doc.data();
			document.getElementById('user-data').innerHTML = '';
			for (const property in data) {
				let userDBData = property + ': ' + data[property] + '<br>';
				document.getElementById('user-data').insertAdjacentHTML('beforeend', userDBData);
			};




function updateCals (event) {
	const db = firebase.firestore();
	const myFood = db.collection('foods').doc('hills-rx-diet-feline-zd');
	myFood.update({
		cal_per_kg: event.target.value
	});
}
*/

/*

How to query multiple documents

const db = firebase.firestore();
const collectionName = db.collection('collectionName');

Query1: query field
Operator: logical operator (>, <, ==, etc)
Value: What you're comparing to

const query = collectionName.where (query1, operator, value)
query.get().then(products => {
	products.forEach(doc => {
		data = doc.data();
		document.write(`${data.name} at $${data.price}`);
	});
});

Use orderBy to return documents in a specific order

Query1: query field
Method: asc or desc
const query = collectionName.orderBy (query1, method);

Use .limit(num) to limit to that number of documents, best for large data sets






For user-uploaded files:

<input type="file" onchange="uploadFile(this.files)">

function uploadFile(files) {
    const storageRef = firebase.storage().ref();
    const imgRef = storageRef.child('horse.jpg');

    const file = files.item(0);

    const task = imgRef.put(file)

    // successful upload
    task.then(snapshot => {
        const url = snapshot.downloadURL
		document.querySelector('#imgContainer).setAttribute('src', url);
    })

    // monitor progress
    task.on('state_changed', snapshot => {
        console.log(snapshot)

    })
}
	
*/

/*
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
*/