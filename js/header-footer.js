// Set up primary nav contents and write them to the page
const primaryNav = document.getElementById('primary-nav');
let primaryNavContents = "";

primaryNavContents += '<div class="container-fluid">';
primaryNavContents += '<a class="navbar-brand me-lg-4" href="#"><img src="assets/logo/logo-white.svg" alt="Waypoint" class="logo"/></a>';
primaryNavContents += '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><i class="bi bi-list"></i></button>';
primaryNavContents += '<div class="collapse navbar-collapse" id="navbarCollapse">';
primaryNavContents += '<ul class="navbar-nav me-auto mt-2 mt-lg-0 mb-lg-0">';
primaryNavContents += '<li class="nav-item me-lg-2"><a class="nav-link" id="nav-index" href="./index.html">Home</a></li>';
primaryNavContents += '<li class="nav-item me-lg-2"><a class="nav-link" id="nav-about" href="./about.html">About</a></li>';
primaryNavContents += '<li class="nav-item me-lg-2"><a class="nav-link" id="nav-faq" href="./faq.html">FAQ</a></li>';
primaryNavContents += '</ul></div>';
primaryNavContents += '<div class="dropdown" id="profileDropdown"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="bi bi-person-circle"></i><span id="profileUserNavbar"></span></button>';
primaryNavContents += '<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">';
primaryNavContents += '<li><a class="dropdown-item" href="./dashboard.html">Dashboard</a></li>';
primaryNavContents += '<li><a class="dropdown-item" href="./profile.html">Profile</a></li>';
primaryNavContents += '<li><hr class="dropdown-divider"></li>';
primaryNavContents += '<li><a class="dropdown-item onclick="logout()" href="#">Sign out</a></li>';
primaryNavContents += '</ul></div>';
primaryNavContents += '<a href="./signin.html" id="signin-button"><button class="btn btn-sm signin" type="button">Sign in</button></a>';
primaryNavContents += '</div>';

primaryNav.innerHTML = primaryNavContents;

// Set up footer contents and write them to the page
const footerDiv = document.getElementById('footer');
let footerContents = '<hr class="text-muted mx-4"><div class="container"><p>Designed &amp; built by <a href="https://stephaniecervi.net">Stephanie Cervi</a></p>';
footerContents += '<p><a href="./about.html#contact">Contact Us</a> <i class="bi bi-dot"></i> <a href="./privacy-policy.html">Privacy Policy</a> <i class="bi bi-dot"></i> <a href="./terms-of-service.html">Terms of Service</a></p></div>';
footerContents += '<div id="cookie-banner" class="alert alert-dark text-center mb-0 row" role="alert"><div class="col-12 col-sm-10 col-lg-11 mb-2 mb-sm-0">This website uses only essential cookies for managing user authentication. No other data is collected or shared with third parties.</div><div class="col-12 col-sm-2 col-lg-1"><button type="button" class="btn btn-primary btn-sm" onclick="hideCookieBanner()">Accept</button></div></div>';

footerDiv.innerHTML = footerContents;

// Get the active page and set CSS class
const currentPage = document.location.pathname;

let filename = currentPage.substring(currentPage.lastIndexOf('/')+1);
filename = filename.substring(0, filename.length - 5);
if (!filename) {
	filename = 'index';
}
let navID = "nav-" + filename;

const navElement = document.getElementById(navID);
if (navElement) {
	navElement.classList.add('active');
}

/* Javascript to show and hide cookie banner using localstorage */
/* Shows the Cookie banner */
function showCookieBanner () {
	let cookieBanner = document.getElementById('cookie-banner');
	cookieBanner.style.display = 'flex';
}

/* Hides the Cookie banner and saves the value to localstorage */
function hideCookieBanner () {
	localStorage.setItem('waypoint_isCookieAccepted', 'yes');
	let cookieBanner = document.getElementById('cookie-banner');
	cookieBanner.style.display = 'none';
}

/* Checks the localstorage and shows Cookie banner based on it. */
function initializeCookieBanner () {
	let isCookieAccepted = localStorage.getItem('waypoint_isCookieAccepted');
	if(isCookieAccepted === null) {
		localStorage.setItem("waypoint_isCookieAccepted", "no");
		showCookieBanner();
	}
	if(isCookieAccepted === "no") {
		showCookieBanner();
	}
}
	
window.onload = initializeCookieBanner();

// Check that service workers are supported
if ('serviceWorker' in navigator) {
	// Use the window load event to keep the page load performant
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js');
	});
}