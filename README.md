# Waypoint: a web-based distance goal tracker
Web application created with JavaScript and Firebase

## Table of Contents
- [Summary](#summary)
- [Technologies](#technologies)
- [Features](#features)
- [Currently in development](#currently-in-development)
- [Use cases](#use-cases)
- [Project status](#project-status)

### Summary
Waypoint is designed to help you track progress toward goals for virtual or real-world distance challenges. Some challenge hosts have no way to sync with fitness tracking apps, or their own usable tracking system.

Don’t waste time fiddling with spreadsheets or doing math by hand in a notebook; Waypoint does it all for you.

Try it out today at [Waypoint](https://waypointapp.net).

#### Development
Waypoint was initially developed as a practice project to improve my JavaScript skills, learn `localStorage` data interaction, and mostly just to see if I could build a single-page application without having to take any formal classes.  I decided to migrate the data storage system to Firebase to allow users to see their data on multiple devices, and not have as much risk of data loss.

### Technologies
Waypoint was built using the Bootstrap 5.1 framework, Firebase, HTML, CSS, and JavaScript.  There's a little bit of jQuery but most of it is vanilla ES6 JavaScript.

I designed it to be used primarily on mobile devices, for a 375px-wide viewport and larger.  Everything was then scaled up and rearranged for larger screens as needed.

### Features
- Add new challenges
- Edit existing challenge details
- Add progress to a single challenge incrementally, or some/all active challenges incrementally
- Delete existing challenges

### Currently in development
- Add to Homescreen pop-up capability
- Reduce vulnerability to XSS attacks

### Use cases
While popular distance challenge hosts such as The Conqueror Challenge or Pacer have their own apps that synchronize with fitness tracking systems (Apple, Garmin, Fitbit, etc), not all of them do.  Some challenge hosts ask you to submit proof of your distance and time for each challenge via their website, which can be cumbersome and tedious.  Some simply ship your medals after registration, and use the honor system.  Waypoint uses the honor system too, but in a way that puts ownership back in the user's hands.

Waypoint is intended to simplify this process by giving users a clean, intuitive, simple interface with which to track all of their active challenges.  It doesn't require any personal data such as a screenshot or GPS coordinates, but most challenge hosts should accept a screenshot of Waypoint as proof a challenge is complete, if needed.

### Project status
Waypoint is being actively maintained.  Bugs are logged and fixed as discovered.
