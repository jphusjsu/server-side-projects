// const http = require('http');
// const jsonObj = require('./favs.json');
// const fs = require('fs');
// const dt = require('./twitterAPI');

// http.createServer(function (req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/html'});
// 	var readStream = fs.createReadStream('./index.html', 'utf8');
// 	readStream.pipe(res);
// }).listen(3000);

// console.log('Listening on http:localhost:3000');

// function readFile(res) {
// 	fs.readFile('favs.json', 'utf8', function(err, data) {
// 		// if (err) {
// 		// 	res.writeHead(404);
// 		// 	res.write('404 - File Not Found');
// 		// 	throw err;
// 		// }
// 		return data;
// 	});
// }

/*
*	Author: Jie Peng Hu
*	Description:
*	This file hosts the server for the NodeJS application. The server is set to
*	listen on port 3000. It utilizes express for simplifity at the time of the
*	creation of the endpoints for the RESTful API.
*/

var express = require('express');
var app = express();
const twitterJSONObj = require('./favs.json');

app.use(express.static(__dirname));

// First endpoint for the API
app.get('/allTweets', function(req, res) {
	var resultingTweets = [];
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
	var resultingUsers = [];
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
	var resultingLinks = [];
	var groupedResults = {};
	var regExp = /https?:\/\/[a-zA-Z0-9].[^\s]{2,}/;
	
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
	var resultingTweetsDetails = [];
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
	let output = JSON.stringify(resultingTweetsDetails[0], null, 2);
	console.log(output);
	res.send({ tweets: resultingTweetsDetails });
});

// Fourth endpoint for the API (Upon request)
app.get('/allDetails/:tweetID', function(req, res) { 
	var tweetID = req.params.tweetID;
	var resultingTweetsDetails = [];
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
	var screenNameParam = req.params.screenName;
	var profileInfo = [];
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

app.listen(3000, function() {
	console.log('Server listening on PORT: 3000')
});