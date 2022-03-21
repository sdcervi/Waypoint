// Global variables for database and current user
const db = firebase.firestore();

const user = firebase.auth().currentUser;
console.log (user);

function getProfileData (user) {
	const userData = db.collection('userData').doc(user.uid);
	document.getElementById('user-name').innerHTML = user.displayName;
	userData.onSnapshot((doc) => {
		const data = doc.data();
		const details = document.getElementById('user-details');
		const settings = document.getElementById('user-settings');
		
		let detailsContent = `<h4>Your information</h4>`;
		detailsContent += `<p><strong>Email address:</strong> ${user.email}</p>`;
		detailsContent += `<p><strong>Linked accounts:</strong></p>`;
		detailsContent += `<ul>`;
		user.providerData.forEach((profile) => {
			detailsContent += `<li>`;
			const provider = profile.providerId;
			switch (provider) {
				case 'google.com':
					detailsContent += `Google`;
					break;
				default:
					alert ('Error getting linked accounts');
			}
			detailsContent += `</li>`;
		});
		detailsContent += `</ul>`;
		details.innerHTML = detailsContent;
		
		let settingsContent = `<h4>Settings</h4>`;
		settingsContent += `<p><strong>Default sort method:</strong> ${data.sort}<br><strong>Default unit:</strong> ${data.unit}</p>`;
		settingsContent += `<p><strong>Challenges completed:</strong> ${data.completed}</p>`;
		settings.innerHTML = settingsContent;
    });	
}

// Get user data; if data does not exist, initialize
function getUserData (user) {
	const userData = db.collection('userData').doc(user.uid);
	userData.onSnapshot((doc) => {
        if (doc.exists) {
			getProfileData (user);
		} else {
			db.collection('userData').doc(userID).set({
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

// Log the user out
function logout () {
	firebase.auth().signOut()
		.then(function() {
			location.href = 'index.html';
		})
		.catch(function(error) {
			console.log ('Sign out error');
		});
}

function deleteAccount () {
	
}

// If the user is logged in
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		document.getElementById('signin-button').style.display = 'none';
		getUserData(user);
	} else {
		document.getElementById('signin-button').style.display = 'inline-block';
		document.getElementById('signout-button').style.display = 'none';
		document.getElementById('user-settings').innerHTML = 'Please sign in to see your user profile.';
	}
});