// Set up nav contents and write them to the page
const navDiv = document.getElementById('primary-nav');
let navContents = "";

navContents += '<div class="container-fluid">';
navContents += '<h1><a class="navbar-brand" href="#"><img src="assets/logo/logo-white.svg" alt="" class="logo"/>&nbsp;Distance Goals</a></h1>';
navContents += '<div class="nav-buttons">';
navContents += '<button class="btn btn-sm btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#aboutModal" id="nav-about">About</button>';
navContents += '<button class="btn btn-sm btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#resetModal" id="nav-demo">Demo</button>';
navContents += '</div></div>';

navDiv.innerHTML = navContents;

// Set up footer contents and write them to the page
const footerDiv = document.getElementById('footer');
let footerContents = '<hr class="text-muted mx-4"><div class="container"><p>Designed &amp; built by Stephanie Cervi</p>';
footerContents += '<p>Like my work and want to support me? <a href="https://ko-fi.com/sdcervi" target="_blank">Buy me a coffee</a> or <a href="https://www.etsy.com/listing/1178395889/sport-medal-honeycomb-display-plaque" target="_blank">buy one of my display plaques for your shiny new medals</a>.</p></div>';

footerDiv.innerHTML = footerContents;