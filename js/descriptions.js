function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let writtenTweets = [];
	for (i = 0; i < tweet_array.length; i++) {
		const t = tweet_array[i];
    	if (t.written === true) {
      		writtenTweets.push({ tweet: t, index: i });
    	}
	}

	const count = document.getElementById('searchCount').textContent = '0';
  	const text  = document.getElementById('searchText').textContent = '';
  	const table = document.getElementById('tweetTable').innerHTML = '';
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const input   = document.getElementById('textFilter');
  	const count = document.getElementById('searchCount');
  	const text  = document.getElementById('searchText');
  	const table = document.getElementById('tweetTable');

	input.addEventListener('input', function() {
		text.textContent = input.value;
		table.innerHTML = '';

		if (input.value == '') {
			count.textContent = '0';
			return;
		}
		let matching = 0;

		for (i = 0; i < writtenTweets.length; i++) {
			const t = writtenTweets[i].tweet;

			if (t.text == input.value) {
				const row = t.getHTMLTableRow(writtenTweets[i].index + 1);
				matching++;
			}
		}
		count.textContent = matching;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});