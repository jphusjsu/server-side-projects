/*
*	Author: Jie Peng Hu
*	Description:
*	This is the controller for the web application. This file consist of a series 
*	of JQuery calls and utilizes AJAX to connect to the endpoints and the client,
*	which ultimately will be called inside the index.html file.
*/

$(function() {
	// First RESTful API: Get all tweets
	$('#all-tweets-btn').on('click', function() {
		// Connect to the API and refresh portion of the page via AJAX
		$.ajax({
			// Define the endpoint to refresh the page from
			url: '/allTweets',
			// Define the JSON file 
			contentType: 'application/json',
			// Display results on a successful call 
			success: function(response) {
				// Set attributes for the table
				$('#all-tweets-table').attr('border', 1);
				// Define variables that calls the head and body of the table
				var theadEl = $('#all-tweets-head');
				var tbodyEl = $('#all-tweets-body')
				// Empty any existing content 
				theadEl.html('');
				tbodyEl.html('');
				// Specified the header data for the first row
				theadEl.append('<tr>\
						<th>CREATED_AT</th>\
						<th>TWEET\'S ID</th>\
						<th>TWEET\'S TEXT</th>\
					</tr>');
				// Display each of the results from the RESTful call 
				response.tweets.forEach(function(tweet) {
					tbodyEl.append('\
						<tr>\
							<td>' + tweet.created_at + '</td>\
							<td>' + tweet.id + '</td>\
							<td>' + tweet.text + '</td>\
						</tr>\
					');
				});
			}
		});
		// Provide link to the endpoint and see the source
		$('#APIsource1').html('RESTful API Source: <a href="http://ec2-18-217-167-43.us-east-2.compute.amazonaws.com:3000/allTweets">click here</a>');
	});

	// Second RESTful API: Get all known users
	$('#known-users-btn').on('click', function() {
		// Connect to the API and refresh portion of the page via AJAX
		$.ajax({
			// Define the endpoint to refresh the page from
			url: '/allUsers',
			// Define the JSON file 
			contentType: 'application/json',
			// Display results on a successful call 
			success: function(response) {
				// Set attributes for the table
				$('#known-users-table').attr('border', 1);
				// Define variables that calls the head and body of the table
				var theadEl = $('#known-users-head');
				var tbodyEl = $('#known-users-body');
				// Empty any existing content 
				theadEl.html('');
				tbodyEl.html('');
				// Specified the header data for the first row
				theadEl.append('<tr>\
						<th>USER\'S ID</th>\
						<th>FULL NAME</th>\
						<th>SCREEN NAME</th>\
						<th>LOCATION</th>\
						<th>DESCRIPTION</th>\
					</tr>');
				// Display each of the results from the RESTful call 
				response.users.forEach(function(user) {
					tbodyEl.append('\
						<tr>\
							<td>' + user.user_id + '</td>\
							<td>' + user.fullname + '</td>\
							<td>' + user.screen_name + '</td>\
							<td>' + user.location + '</td>\
							<td>' + user.description + '</td>\
						</tr>\
					');
				});
			}
		});
		// Provide link to the endpoint and see the source
		$('#APIsource2').html('RESTful API Source: <a href="http://ec2-18-217-167-43.us-east-2.compute.amazonaws.com:3000/allUsers">click here</a>');
	});

	// Third RESTful API: Get all links
	$('#links-btn').click(function () {
		// Connect to the API and refresh portion of the page via AJAX
		$.ajax({
			// Define the endpoint to refresh the page from
			url: '/allLinks',
			// Define the JSON file 
			contentType: 'application/json',
			// Display results on a successful call 
			success: function(response) {
				// Store the response object 
				var linksObj = response.links;
				// Define variables that calls the head and body of the table
				var tHeadEl = $('#links-head');
				var tbodyEl = $('#links-body');
				// Set attributes for the table
				$('#links-table').attr('border', 1);
				// Empty any existing content 
				tHeadEl.html('');
				tbodyEl.html('');
				// Specified the header data for the first row
				tHeadEl.append('<tr>\
						<th>TWEET ID</th>\
						<th>NAME OF THE LINK</th>\
						<th>LINK</th>\
					</tr>');
				/* Display each of the results from the RESTful call by iterating
				on the objects of links */
				for (var item in linksObj) {
					// console.log(item);
					// console.log(linksObj[item]);
					/* Since the results is an array of object, retrieve the objects
					within that array and iterate through each index */
					var arr = linksObj[item];
					// Populate data based of the content within each index
					for (i = 0 ; i < arr.length ; i++) {
						// Open the row 
						tbodyEl.append('<tr>');
						for (var key in arr[i]) {
							// Populate results on its corresponding column
							tbodyEl.append('\
								<td>' + item +'</td>\
								<td>' + key + '</td>\
								<td>' + arr[i][key] + '</td>\
								');
							// console.log('key ' + key);
							// console.log('Value ' + arr[i][key]);
						}
						
					}
					// Close the row 
					tbodyEl.append('</tr>');
				}
			}
		});
		// Provide link to the endpoint and see the source
		$('#APIsource3').html('RESTful API Source: <a href="http://ec2-18-217-167-43.us-east-2.compute.amazonaws.com:3000/allLinks">click here</a>');
	});
	// Fourth RESTful API: Get details of a given tweet
	$('#detail-btn').click(function() {
		// Retrieve the value from the input field for the tweet's ID number
		var tweetID = $('#detail-input').val();
		// Display an alert for empty input 
		if (tweetID === "") {
			alert("Please enter a tweet ID");
		}
		// Connect to the API and refresh portion of the page via AJAX
		$.ajax({
			// Define the endpoint to refresh the page from
			url: '/allDetails/' + tweetID,
			// Define the JSON file 
			contentType: 'application/json',
			// Display results on a successful call 
			success: function(response) {
				// Define variables that calls from the table
				var table = $('#detail-table');
				var theadEl = $('#detail-head');
				var tbodyEl = $('#detail-body');
				var text = $('#failedText1');
				var counter = 0;

				for (var item in response.tweet) {
					counter++
				}

				if (tweetID === "") {
					theadEl.html('')
					tbodyEl.html('')
				} else if (counter === 0) {
					// Display a display when the input is not a valid tweet ID
					text.html('The tweet ID <b>(' + tweetID + ')</b> that you are requesting does not exist');	
					theadEl.html('')
					tbodyEl.html('')
				} else {
					var obj = response.tweet[0][tweetID];
					text.html('');
					// Set attributes for the table
					table.attr('border', 1);
					theadEl.html('')
					// Specified the header data for the first row
					theadEl.append('<tr>\
							<th>CREATED_AT</th>\
							<th>SOURCE</th>\
							<th>RETWEET COUNT</th>\
							<th>LANGUAGE</th>\
						</tr>');
					tbodyEl.html('')
					tbodyEl.append('<tr>')
					for (var item in obj) {
						tbodyEl.append('<td>' + obj[item] + '</td>');
					}
					tbodyEl.append('</tr>');
				}
			}
		});
		// Provide link to the endpoint and see the source
		$('#APIsource4').html('RESTful API Source: <a href="http://ec2-18-217-167-43.us-east-2.compute.amazonaws.com:3000/allDetails/'+ tweetID + '">click here</a>');
	});

	// Fifth RESTful API: Get details profile information about a given user
	$('#profile-btn').click(function() { 
		// Retrieve the value from the input field for the screen name
		var screenNameParam = $('#profile-input').val();
		// Display an alert for empty input 
		if (screenNameParam === "") {
			alert('Please enter a screen name');
		}
		// Connect to the API and refresh portion of the page via AJAX
		$.ajax({
			// Define the endpoint to refresh the page from
			url: '/profileInformation/' + screenNameParam,
			// Define the JSON file 
			contentType: 'application/json',
			// Display results on a successful call 
			success: function(response) {
				// console.log(response);
				let obj = response.info[0];
				var table = $('#profile-table');
				var theadEl = $('#profile-head');
				var tbodyEl = $('#profile-body');
				var text = $('#failedText2');
				text.html('')
				
				var counter = 0;
				for (var element in response.info[0]) {
					counter++;
				}

				if (screenNameParam === "") {
					theadEl.html('')
					tbodyEl.html('')
				} else if (counter === 0) {
					// Display a display when the input is not a valid screen name
					text.html('The screen name <b>(' + screenNameParam + ')</b> that you are requesting does not exist');	
					theadEl.html('')
					tbodyEl.html('')
				} else {
					// Set attributes for the table
					table.attr('border', 1);
					theadEl.html('')
					// Specified the header data for the first row
					theadEl.append('<tr>\
							<th>SCREEN NAME</th>\
							<th>BACKGROUND COLOR</th>\
							<th>BACKGROUND IMAGE</th>\
							<th>PROFILE IMAGE</th>\
							<th>PROFILE COLOR</th>\
							<th>SIDEBAR BORDER COLOR</th>\
							<th>SIDEBAR FILL COLOR</th>\
							<th>TEXT COLOR</th>\
						</tr>');
					tbodyEl.html('')
					// Open the row
					tbodyEl.append('<tr>')
					/* This loop allows to gather information on each of the item, since the results
					is given back as a Hex code for a particular color, I chose to display the actual 
					color instead of the the code itself. Note that #000000 is white, so the output will
					appear to be 'empty' */
					for (var item in obj) {
						if (item === "profile_background_color") {
							tbodyEl.append('<td bgcolor="#' + obj[item] + '"></td>');
						} else if (item === "profile_link_color") {
							tbodyEl.append('<td bgcolor="#' + obj[item] + '"></td>');
						} else if (item === "profile_sidebar_border_color") {
							tbodyEl.append('<td bgcolor="#' + obj[item] + '"></td>');
						} else if (item === "profile_sidebar_fill_color") {
							tbodyEl.append('<td bgcolor="#' + obj[item] + '"></td>');
						} else if (item === "profile_text_color") {
							tbodyEl.append('<td bgcolor="#' + obj[item] + '"></td>');
						} else if (item === "profile_background_image_url_https" || item === "profile_image_url") {
							tbodyEl.append('<td><a href="' + obj[item] + '">Link here</a></td>');
						} else {
							tbodyEl.append('<td>' + obj[item] + '</td>');
						}
					}
					// close the row
					tbodyEl.append('/<tr>');
				}
			}
		});
		// Provide link to the endpoint and see the source
		$('#APIsource5').html('RESTful API Source: <a href="http://ec2-18-217-167-43.us-east-2.compute.amazonaws.com:3000/profileInformation/'+ screenNameParam + '">click here</a>');
	});

	// JQuery calls to put functionality on the clear button
	$('#clear-tweets-btn').click(function () { 
		$('#all-tweets-head').html('');
		$('#all-tweets-body').html('');
	});
	$('#clear-users-btn').click(function () { 
		$('#known-users-head').html('');
		$('#known-users-body').html('');
	});
	$('#clear-links-btn').click(function () { 
		$('#links-head').html('');
		$('#links-body').html('');
	});
	$('#clear-detail-btn').click(function () { 
		$('#detail-head').html('');
		$('#detail-body').html('');
		$('#detail-input').val('');
		$('#failedText1').html('');
	});
	$('#clear-profile-btn').click(function () { 
		$('#profile-head').html('');
		$('#profile-body').html('');
		$('#profile-input').val('');
		$('#failedText2').html('');
	});
});