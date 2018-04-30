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
			url: '/allTweets',
			contentType: 'application/json',
			success: function(response) {
				$('#all-tweets-table').attr('border', 1);
				var theadEl = $('#all-tweets-head');
				theadEl.html('');
				theadEl.append('<tr>\
						<th>CREATED_AT</th>\
						<th>TWEET\'S ID</th>\
						<th>TWEET\'S TEXT</th>\
					</tr>');
				var tbodyEl = $('#all-tweets-body')
				tbodyEl.html('');

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
			url: '/allUsers',
			contentType: 'application/json',
			success: function(response) {
				$('#known-users-table').attr('border', 1);
				var theadEl = $('#known-users-head');
				theadEl.html('');
				theadEl.append('<tr>\
						<th>USER\'S ID</th>\
						<th>FULL NAME</th>\
						<th>SCREEN NAME</th>\
						<th>LOCATION</th>\
						<th>DESCRIPTION</th>\
					</tr>');
				var tbodyEl = $('#known-users-body');
				tbodyEl.html('');
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
			url: '/allLinks',
			contentType: 'application/json',
			success: function(response) {
				var linksObj = response.links;
				$('#links-table').attr('border', 1);
				var tHeadEl = $('#links-head');
				var tbodyEl = $('#links-body');

				tHeadEl.html('');
				tHeadEl.append('<tr>\
						<th>TWEET ID</th>\
						<th>NAME OF THE LINK</th>\
						<th>LINK</th>\
					</tr>');

				tbodyEl.html('');		
				for (var item in linksObj) {
					console.log(item);
					console.log(linksObj[item]);
					var arr = linksObj[item];
			
					for (i = 0 ; i < arr.length ; i++) {
						tbodyEl.append('<tr>');
						for (var key in arr[i]) {
							tbodyEl.append('\
								<td>' + item +'</td>\
								<td>' + key + '</td>\
								<td>' + arr[i][key] + '</td>\
								');
							console.log('key ' + key);
							console.log('Value ' + arr[i][key]);
						}
						
					}
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
		// Connect to the API and refresh portion of the page via AJAX
		$.ajax({
			url: '/allDetails/' + tweetID,
			contentType: 'application/json',
			success: function(response) {
				var table = $('#detail-table');
				var theadEl = $('#detail-head');
				var tbodyEl = $('#detail-body');
				var text = $('#failedText1');
				var counter = 0;

				for (var item in response.tweet) {
					counter++
				}

				if (counter === 0) {
					text.html('The tweet ID <b>(' + tweetID + ')</b> that you are requesting does not exist');	
					theadEl.html('')
					tbodyEl.html('')
				} else {
					var obj = response.tweet[0][tweetID];
					text.html('');
					table.attr('border', 1);
					theadEl.html('')
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
		// Connect to the API and refresh portion of the page via AJAX
		$.ajax({
			url: '/profileInformation/' + screenNameParam,
			contentType: 'application/json',
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

				if (counter === 0) {
					text.html('The screen name <b>(' + screenNameParam + ')</b> that you are requesting does not exist');	
					theadEl.html('')
					tbodyEl.html('')
				} else {
					table.attr('border', 1);
					theadEl.html('')
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
					tbodyEl.append('<tr>')
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
	});

	$('#clear-profile-btn').click(function () { 
		$('#profile-head').html('');
		$('#profile-body').html('');
	});
});
