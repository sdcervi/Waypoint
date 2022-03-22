const sampleData = {
	zodiac_challenge: {
		name:			"Zodiac Challenge",
		company:		"Medal Chasers",
		distance:		600,
		unit:			"miles",
		period:			365,
		start:			"2022-02-28T00:00:00",
		progress:		384.39,
		complete:		false,	
		milestones:	[
			{	name:	"Capricorn",	distance:	50		},
			{	name:	"Aquarius",		distance:	100		},
			{	name:	"Pisces",		distance:	150		},
			{	name:	"Aries",		distance:	200		},
			{	name:	"Taurus",		distance:	250		},
			{	name:	"Gemini",		distance:	300		},
			{	name:	"Cancer",		distance:	350		},
			{	name:	"Leo",			distance:	400		},
			{	name:	"Virgo",		distance:	450		},
			{	name:	"Libra",		distance:	500		},
			{	name:	"Scorpio",		distance:	550		},
			{	name:	"Saggitarius",	distance:	600		}]
	},
	rise_and_run: {
		name:			"Rise &amp; Run",
		company:		"Medal Chasers",
		distance:		5,
		unit:			"kilometers",
		period:			false,
		start:			"2022-03-01T00:00:00",
		progress:		2.53,
		complete:		false,
		milestones:		[]
	},
	unleash_the_dragon_within: {
		name:			"Unleash the Dragon Within",
		company:		"Medal Chasers",
		distance:		5,
		unit:			"kilometers",
		period:			false,
		start:			"2022-03-01T00:00:00",
		progress:		3.46,
		complete:		false,
		milestones:		[]
	},
	one_run_to_rule_them_all: {
		name:			"One Run to Rule Them All",
		company:		"Medal Chasers",
		distance:		5,
		unit:			"kilometers",
		period:			false,
		start:			"2022-03-01T00:00:00",
		progress:		4.70,
		complete:		false,
		milestones:		[]
	},
	space_race: {
		name:			"Space Race",
		company:		"Virtual Running Club",
		distance:		400,
		unit:			"miles",
		period:			false,
		start:			"2022-02-03T00:00:00",
		progress:		101.81,
		complete:		false,	
		milestones:	[
			{	name:	"Mercury",	distance:	25		},
			{	name:	"Venus",	distance:	70		},
			{	name:	"Earth",	distance:	120		},
			{	name:	"Mars",		distance:	170		},
			{	name:	"Jupiter",	distance:	225		},
			{	name:	"Saturn",	distance:	280		},
			{	name:	"Uranus",	distance:	340		},
			{	name:	"Neptune",	distance:	400		}]
	},
	dino_might_challenge: {
		name:			"Dino-Might Challenge",
		company:		"Virtual Running Club",
		distance:		100,
		unit:			"miles",
		period:			false,
		start:			"02/03/2022",
		progress:		100,
		complete:		"02/28/2022",
		milestones:	[
			{	name:	"Parasaurolophus",			distance:	10		},
			{	name:	"Triceratops",				distance:	20		},
			{	name:	"Brachiosaurus",			distance:	40		},
			{	name:	"Stegosaurus",				distance:	60		},
			{	name:	"Velociraptor",				distance:	80		},
			{	name:	"Tyrannosaurus&nbsp;Rex",	distance:	99.9	}]
	}
};

// Resets all data to the sample data object defined above, regenerates page content, and saves sample data into localStorage
function resetData () {
	challenges = sampleData;
	resetPage();
	window.location.href = './index.html';
}