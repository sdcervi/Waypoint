const db = firebase.firestore();

// Get user data; if data does not exist, initialize
function getUserData (user) {
	const userData = db.collection('userData').doc(user.uid);
	userData.get().then((doc) => {
        if (doc.exists) {
			if (document.location.pathname == '/add-challenge.html' || document.location.pathname == '/edit-challenge.html' || document.location.pathname == '/dashboard.html' || document.location.pathname == '/profile.html' ) {
				getProfileData (user);
			} else {
				return;
			}
		} else {
			userData.set({
				sort: 'progress-desc',
				unit: 'miles',
				total_challenges: 0,
				challenges: '',
				completed: 0
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
		document.getElementById('signin-button').remove();
		document.getElementById('profileDropdown').style.display = 'block';
		document.getElementById('profileUserNavbar').textContent = user.displayName;
		getUserData(user);
	} else {
		document.getElementById('signin-button').firstElementChild.style.display = 'inline-block';
		document.getElementById('profileDropdown').remove();
		if (document.getElementById('signout-button')) {
			document.getElementById('signout-button').remove();
		}
		if (document.getElementById('please-sign-in')) {
			document.getElementById('please-sign-in').innerHTML = 'Please <a href="./signin.html">sign in</a> to see this page.';
			document.getElementById('please-sign-in').style.marginTop = '10vh';
		}
		if (document.getElementById('signed-in')) {
			document.getElementById('signed-in').remove();
		}
	}
});
