// Global variables for database and current user
const db = firebase.firestore();

// Fetch the database's profile data for the user and display it
function getProfileData (user) {
	// Fetch the user's data
	const userData = db.collection('userData').doc(user.uid);
	
	// Display the user's high-res photo, if one exists
	if (user.photoURL) {
		let photoURL = user.photoURL;
		user.providerData.forEach((profile) => {
			const provider = profile.providerId;
			switch (provider) {
				case 'google.com':
					photoURL = user.photoURL.replace('s96-c', 's300-c');
					break;
				default:
					alert ('Error upscaling profile image.');
			}
		});
		document.getElementById('profile-img').innerHTML = `<img src="${photoURL}" alt="Your profile picture" class="profile-img">`;
	} else {
		document.getElementById('profile-img').innerHTML = `<i class="bi bi-person-square default-profile-img"></i>`;
	}
	
	// Display the user's name
	document.getElementById('user-name').innerHTML = user.displayName + '<button type="button" class="btn btn-sm btn-link btn-edit" data-bs-toggle="modal" data-bs-target="#editDisplayNameModal"><i class="bi bi-pencil-square"></i></button>';
	
	// Display the user's account details
	const details = document.getElementById('user-details');
	let detailsContent = `<h4>Your information</h4>`;
	detailsContent += `<div class="row"><div class="col-6"><p><strong>Email</strong></p></div><div class="col-6"><p>${user.email}<button type="button" class="btn btn-sm btn-link btn-edit" data-bs-toggle="modal" data-bs-target="#editEmailModal"><i class="bi bi-pencil-square"></i></button></p></div></div>`;
	detailsContent += `<div class="row"><div class="col-6"><p><strong>Linked accounts</strong></p></div>`;
	detailsContent += `<div class="col-6">`;
	user.providerData.forEach((profile) => {
		const provider = profile.providerId;
		switch (provider) {
			case 'google.com':
				detailsContent += '<img src="assets/providers/google.svg" class="provider" alt="Google">';
				break;
			default:
				alert ('Error getting linked accounts');
		}
	});
	detailsContent += `</div>`;
	detailsContent += `<div class="col-12 text-center"><button class="btn btn-sm btn-link" onclick="resetPassword()">Send password reset email</button></div></row>`;
	details.innerHTML = detailsContent;
	
	// Display the user's statistics and settings
	userData.onSnapshot((doc) => {
        const settings = document.getElementById('user-settings');
		const stats = document.getElementById('user-stats');
		const deleteDiv = document.getElementById('deleteDiv');
		const data = doc.data();
		const sort = data.sort;
		
		let statsContent = `<h4>Statistics</h4>`;
		statsContent += `<div class="row"><div class="col-6"><strong>Active challenges</strong></p></div><div class="col-6"><p>${data.total_challenges - data.completed}</p></div></div>`;
		statsContent += `<div class="row"><div class="col-6"><strong>Challenges completed</strong></p></div><div class="col-6"><p>${data.completed}</p></div></div>`;
		statsContent += `<div class="row"><div class="col-6"><strong>Distance tracked</strong></p></div><div class="col-6"><p>${parseFloat(data.distance.toFixed(2))} ${data.unit}</p></div></div>`;
		stats.innerHTML = statsContent;
		
		let settingsContent = `<h4>Settings</h4>`;
		settingsContent += `<p><strong>Default sort method:</strong>`;
		settingsContent += `<div class="col-10 offset-1">`;
		settingsContent += `<div class="mb-3"><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="name-asc" id="name-asc"><label class="form-check-label" for="name-asc"><i class="bi bi-sort-alpha-down"></i> Name <span class="small text-muted">ascending</span></label></div><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="name-desc" id="name-desc"><label class="form-check-label" for="name-desc"><i class="bi bi-sort-alpha-down-alt"></i> Name <span class="small text-muted">descending</span></label></div></div>`;
		settingsContent += `<div class="mb-3"><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="distance-desc" id="distance-desc"><label class="form-check-label" for="distance-desc"><i class="bi bi-sort-down"></i> Distance goal <span class="small text-muted">descending</span></label></div><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="distance-asc" id="distance-asc"><label class="form-check-label" for="distance-asc"><i class="bi bi-sort-down-alt"></i> Distance goal <span class="small text-muted">ascending</span></label></div></div>`;
		settingsContent += `<div class="mb-3"><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="progress-desc" id="progress-desc"><label class="form-check-label" for="progress-desc"><i class="bi bi-sort-down"></i> Progress <span class="small text-muted">descending</span></label></div><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="progress-asc" id="progress-asc"><label class="form-check-label" for="progress-asc"><i class="bi bi-sort-down-alt"></i> Progress <span class="small text-muted">ascending</span></label></div></div>`;
		settingsContent += `<div class="mb-3"><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="calendar-desc" id="calendar-desc"><label class="form-check-label" for="calendar-desc"><i class="bi bi-sort-down"></i> Completion date <span class="small text-muted">soonest first</span></label></div><div class="form-check sort-radio"><input class="form-check-input" type="radio" name="sort-by" value="calendar-asc" id="calendar-asc"><label class="form-check-label" for="calendar-asc"><i class="bi bi-sort-down-alt"></i> Completion date <span class="small text-muted">soonest last</span></label></div></div></div>`;
		settingsContent += `<p class="mb-0"><strong>Default unit:</strong></p>`;
		settingsContent += `<div class="col-10 mb-2 offset-1">`;
		settingsContent += `<div class="form-check"><input class="form-check-input" type="radio" name="default-unit" value="miles" id="miles"><label class="form-check-label" for="miles">miles</label></div>`;
		settingsContent += `<div class="form-check"><input class="form-check-input" type="radio" name="default-unit" value="kilometers" id="kilometers"><label class="form-check-label" for="kilometers">kilometers</label></div></div>`;
		settingsContent += `<div class="text-center"><button class="btn btn-primary" onclick="saveChanges()">Save changes</button></div>`;
		settings.innerHTML = settingsContent;
		
		deleteDiv.innerHTML = '<hr><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete my account and data</button>';
		
		const sortMethods = settings.querySelectorAll('input[name="sort-by"]');
		for (const sortMethod of sortMethods) {
			if (sort == sortMethod.value) {
				sortMethod.checked = true;
			} else {
				sortMethod.checked = false;
			}
		}
		const unitList = settings.querySelectorAll('input[name="default-unit"]');
		for (const unit of unitList) {
			if (data.unit == unit.value) {
				unit.checked = true;
			} else {
				unit.checked = false;
			}
		}
    });
}

// Save user settings changes
function saveChanges () {
	// Get the new sort setting
	const sortOptions = document.querySelectorAll('input[name="sort-by"]');
	let newSort;
	for (const sortOption of sortOptions) {
		if (sortOption.checked) {
			newSort = sortOption.value;
			break;
		}
	}
	
	// Get the new unit setting
	const unitOptions = document.querySelectorAll('input[name="default-unit"]');
	let newUnit;
	for (const unit of unitOptions) {
		if (unit.checked) {
			newUnit = unit.value;
		}
	}
	
	// Update the database with the new settings
	const user = firebase.auth().currentUser;
	const userData = db.collection('userData').doc(user.uid);
	
	// Check to see if distance needs converting with unit change
	let conversion;
	let newDistance;
	userData.get().then((doc) => {
		const data = doc.data();
		newDistance = data.distance;
		if (data.unit == 'miles' && newUnit == 'kilometers') {
			conversion = 1.60934;
		} else if (data.unit == 'kilometers' && newUnit == 'miles') {
			conversion = 0.621371;
		} else if (data.unit == newUnit) {
			conversion = 1;
		} else {
			alert ('Error converting distance when saving new unit.');
		}
		newDistance *= conversion;
		
		// Save the new data
		userData.update({
			sort: newSort,
			unit: newUnit,
			distance: newDistance
		});
	}).catch((error) => {
		console.log('Error getting user data: ', error);
	});
	
	userData.onSnapshot((doc) => {
        const data = doc.data();
		if (data.sort == newSort && data.unit == newUnit) {
			const toastDiv = document.getElementById('toast-container');
			toastDiv.innerHTML = `<div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="successToast"><div class="d-flex"><div class="toast-body">Settings saved.</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
			const successToast = document.getElementById('successToast');
			const toast = new bootstrap.Toast(successToast);
    		toast.show();
		}
    });
}

// Changes the user's displayName
function changeName () {
	// Get the new name entered
	const newName = document.getElementById('newName').value;
	
	// If the user didn't enter a new name
	if (newName == null) {
		alert ('Please enter a new name.');
		return;
	}
	
	// Update the database with the new name
	const user = firebase.auth().currentUser;
	user.updateProfile({
		displayName: newName
	}).then(() => {
		location.reload();
	}).catch((error) => {
		console.log ('Error updating name: ', error);
	});
}

function changeEmail () {
	// Get the new name entered
	const newEmail = document.getElementById('newEmail').value;
	
	// If the user didn't enter a new name
	if (newEmail == null) {
		alert ('Please enter a new email address.');
		return;
	}
	
	const user = firebase.auth().currentUser;
	
	user.updateEmail(newEmail).then(() => {
		location.reload();
	}).catch((error) => {
		alert ('Please sign in again to continue.');
		location.href = './signin.html';
	});
}

function resetPassword () {
	const user = firebase.auth().currentUser;
	const email = user.email;  
	firebase.auth().sendPasswordResetEmail(email)
	.then(() => {
		const toastDiv = document.getElementById('toast-container');
		toastDiv.innerHTML = `<div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="resetToast"><div class="d-flex"><div class="toast-body">Password reset email sent.</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
		const resetToast = document.getElementById('resetToast');
		const toast = new bootstrap.Toast(resetToast);
		toast.show();
	})
	.catch((error) => {
		console.log ('Error resetting password', error);
	});
}

function deleteUser () {
	const user = firebase.auth().currentUser;
	const userData = db.collection('userData').doc(user.uid);
	
	userData.delete().then(() => {
		user.delete().then(() => {
			alert ('Your account and data has been deleted.');
			location.href = './index.html';
		}).catch((error) => {
			alert ('Please sign in again to continue.');
			location.href = './signin.html';
		});
	}).catch((error) => {
		console.error('Error deleting user data: ', error);
	});
}