// Set up primary nav contents and write them to the page
const primaryNav = document.getElementById('primary-nav');
let primaryNavContents = "";

primaryNavContents += '<div class="container-fluid">';
primaryNavContents += '<a class="navbar-brand me-lg-4" href="#"><img src="assets/logo/logo-white.svg" alt="Waypoint" class="logo"/></a>';
primaryNavContents += '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><i class="bi bi-list"></i></button>';
primaryNavContents += '<div class="collapse navbar-collapse" id="navbarSupportedContent">';
primaryNavContents += '<ul class="navbar-nav me-auto mt-2 mt-lg-0 mb-lg-0">';
primaryNavContents += '<li class="nav-item me-lg-2"><a class="nav-link" id="nav-index" href="./index.html">Home</a></li>';
primaryNavContents += '<li class="nav-item me-lg-2"><a class="nav-link" id="nav-dashboard" href="./dashboard.html">Dashboard</a></li>';
primaryNavContents += '<li class="nav-item me-lg-2"><a class="nav-link" id="nav-profile" href="./profile.html">Profile</a></li>';
primaryNavContents += '<li class="nav-item me-lg-2"><a class="nav-link" id="nav-about" href="./about.html">About</a></li>';
primaryNavContents += '</ul></div>';
primaryNavContents += '<a href="./signin.html"><button class="btn btn-sm signin" id="signin-button" type="button">Sign in</button></a>';
primaryNavContents += '</div>';

primaryNav.innerHTML = primaryNavContents;

// Set up footer contents and write them to the page
const footerDiv = document.getElementById('footer');
let footerContents = '<hr class="text-muted mx-4"><div class="container"><p>Designed &amp; built by <a href="https://stephaniecervi.net">Stephanie Cervi</a></p>';
footerContents += '<p>Like my work and want to support me? <a href="https://ko-fi.com/sdcervi" target="_blank">Buy me a coffee</a> or <a href="https://www.etsy.com/listing/1178395889/sport-medal-honeycomb-display-plaque" target="_blank">buy one of my display plaques for your shiny new medals</a>.</p></div>';

footerDiv.innerHTML = footerContents;

// Get the active page and set CSS class
const currentPage = document.location.pathname;

let filename = currentPage.substring(currentPage.lastIndexOf('/')+1);
filename = filename.substring(0, filename.length - 5);
let navID = "nav-" + filename;

const navElement = document.getElementById(navID);
navElement.classList.add('active');