const returningUser = window.localStorage.getItem('distanceTracker-returningUser');
if (!returningUser) {
	$(window).on('load', function () {
		$('#welcomeModal').modal('show');
	});
	window.localStorage.setItem('distanceTracker-returningUser', true);
}