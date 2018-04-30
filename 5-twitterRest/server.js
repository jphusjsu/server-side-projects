/*
*	Author: Jie Peng Hu
*	Description:
*	This file hosts the server for the NodeJS application. The server is set to
*	listen on port 3000. It utilizes express for simplifity at the time of the
*	creation of the endpoints for the RESTful API.
*/

// Initiatialize the ExpressJS object to be used in the server
var express = require('express');
var app = express();
const twitterJSONObj = require('./favs.json');

app.use(express.static(__dirname));

// First endpoint for the API
app.get('/allTweets', function(req, res) {
	// Array to hold the results
	var resultingTweets = [];
	// Gather information from the given JSON file and add the objects to the array
	for (i = 0 ; i < twitterJSONObj.length ; i++) {
		resultingTweets.push({
			created_at: twitterJSONObj[i].created_at, 
			id: twitterJSONObj[i].id_str,
			text: twitterJSONObj[i].text
		});
	}
	res.send({ tweets: resultingTweets });
});

// Second endpoint for the API
app.get('/allUsers', function(req, res) {
	// Array to hold the results
	var resultingUsers = [];
	// Gather information from the given JSON file and add the objects to the array
	for (i = 0 ; i < twitterJSONObj.length ; i++) {
		var userObj = twitterJSONObj[i].user
		resultingUsers.push({
			user_id: userObj["id"],
			fullname: userObj["name"],
			screen_name: userObj["screen_name"],
			location: userObj["location"],
			description: userObj["description"]
		});
	}
	res.send({ users: resultingUsers });
});

// Third endpoint for the API: List all external links
app.get('/allLinks', function(req, res) {
	// Array to hold the results
	var resultingLinks = [];
	var groupedResults = {};
	/* Define the regular expression to search for the pattern of a typical URL. 
	This is capable of finding instances that starts from http or https and 
	ends on .co, .io. or .com */
	var regExp = /https?:\/\/[a-zA-Z0-9].[^\s]{2,}/;
	// Gather information from the given JSON file and add the objects to the array
	for (i = 0 ; i < twitterJSONObj.length ; i++) {
		var id = twitterJSONObj[i].id_str;
		var rootObject = twitterJSONObj[i]
		var userObject = twitterJSONObj[i].user
		var entitiesObject = twitterJSONObj[i].entities

		// Extract links on the root of the archive 
		for (var item in rootObject) {
			var expression = regExp.exec(rootObject[item]);
			if (expression != null) {
				var regArray = expression;
				// console.log(regArray[0]);
				// console.log('\n');
				resultingLinks.push({
					[item]: regArray[0]
				});
			}
		}

		// Extract links inside the User object
		for (var item in userObject) {
			var expression = regExp.exec(userObject[item]);
			if (expression != null) {
				var regArray = expression;
				// console.log(regArray[0]);
				// console.log('\n');
				resultingLinks.push({
					['user_'+item]: regArray[0]
				});
			}
		}

		// Extract links inside the Entities/URLS object
		var entityURL = entitiesObject["urls"];
		entObj = entityURL[0];
		for (var item in entObj) {
			var expression = regExp.exec(entObj[item]);
			if (expression != null) {
				var regArray = expression;
				// console.log(regArray[0]);
				// console.log('\n');
				resultingLinks.push({
					["entities_urls_"+item]: regArray[0]
				});
			}
		}
		// Create a grouped object based on the tweet's ID 
		groupedResults[id] = resultingLinks;
		// Reset the content within the resultingLinks array
		resultingLinks = [];
	}
	// console.log(JSON.stringify(groupedResults, null, 2));
	res.send({ links: groupedResults });
});

// Fourth endpoint for the API (ALL tweets ID available)
app.get('/allDetails', function(req, res) { 
	// Array to hold the results
	var resultingTweetsDetails = [];
	// Gather information from the given JSON file and add the objects to the array
	for (i = 0 ; i < twitterJSONObj.length ; i++) {
		var id = twitterJSONObj[i].id_str;
		resultingTweetsDetails.push({ [id]: {
				created_at: twitterJSONObj[i].created_at,
				source: twitterJSONObj[i].source,
				retweet_count: twitterJSONObj[i].retweet_count,
				language: twitterJSONObj[i].lang
			}
		});
	}
	// let output = JSON.stringify(resultingTweetsDetails[0], null, 2);
	// console.log(output);
	res.send({ tweets: resultingTweetsDetails });
});

// Fourth endpoint for the API (Upon request)
app.get('/allDetails/:tweetID', function(req, res) { 
	// Retrieve the parameter from the user
	var tweetID = req.params.tweetID;
	// Array to hold the results
	var resultingTweetsDetails = [];
	// Gather information from the given JSON file and add the objects to the array
	for (i = 0 ; i < twitterJSONObj.length ; i++) {
		var id = twitterJSONObj[i].id_str;
		// console.log(id);
		// console.log('ID from params: ' + tweetID);
		if (id == tweetID) {
			resultingTweetsDetails.push({ [id]: {
					created_at: twitterJSONObj[i].created_at,
					source: twitterJSONObj[i].source,
					retweet_count: twitterJSONObj[i].retweet_count,
					language: twitterJSONObj[i].lang
				}
			});				
		}
	}
	// console.log('Results' + JSON.stringify(resultingTweetsDetails, null, 2));
	res.send({ tweet: resultingTweetsDetails });
});

// Fifth endpoint for the API
app.get('/profileInformation/:screenName', function(req, res) {
	// Retrieve the parameter from the user
	var screenNameParam = req.params.screenName;
	// Array to hold the results
	var profileInfo = [];
	// Gather information from the given JSON file and add the objects to the array
	for (i = 0 ; i < twitterJSONObj.length ; i++) {
		var userObj = twitterJSONObj[i].user
		var screenName = userObj["screen_name"];
		if (screenNameParam === screenName) {
			profileInfo.push({
				screen_name: userObj["screen_name"],
				profile_background_color: userObj["profile_background_color"],
				profile_background_image_url_https: userObj["profile_background_image_url_https"],
				profile_image_url: userObj["profile_image_url"],
				profile_link_color: userObj["profile_link_color"],
				profile_sidebar_border_color: userObj["profile_sidebar_border_color"],
				profile_sidebar_fill_color: userObj["profile_sidebar_fill_color"],
				profile_text_color: userObj["profile_text_color"]				
			})
		}
	}
	// console.log('Results' + JSON.stringify(profileInfo, null, 2));
	res.send({ info: profileInfo });
});

// Define the port number for the server
let PORT = 3000;
app.listen(PORT, function() {
	console.log('Server listening on PORT: ' + PORT);
});