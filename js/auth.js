// Get user data; if data does not exist, initialize
function getUserData (user) {
	const userData = db.collection('userData').doc(user.uid);
	userData.get().then((doc) => {
        if (doc.exists) {
			getProfileData (user);
		} else {
			userData.set({
				sort: 'progress-desc',
				unit: 'miles',
				total_challenges: 0,
				challenges: '',
				completed: 0,
				distance: 0
			}).then(() => {
				return;
			}).catch((error) => {
				console.error('Error writing document: ', error);
			});
		}
    }).catch((error) => {
		console.log('Error getting user data: ', error);
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

// Check whether the user is logged in
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		document.getElementById('signin-button').style.display = 'none';
		currentUser = user;
		getUserData(user);
	} else {
		document.getElementById('signin-button').style.display = 'inline-block';
		document.getElementById('signout-button').style.display = 'none';
		document.getElementById('user-settings').innerHTML = 'Please sign in to see your user profile.';
	}
});
