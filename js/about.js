function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	const sortedTweets = tweet_array.sort((a,b) => a.time - b.time);
	const earliestTweet = sortedTweets[0].time;
	const latestTweet = sortedTweets[sortedTweets.length - 1].time;
	const options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
	const earliestDate = earliestTweet.toLocaleDateString(undefined, options);
	const latestDate = latestTweet.toLocaleDateString(undefined, options);
	document.getElementById('firstDate').textContent = earliestDate;
	document.getElementById('lastDate').textContent = latestDate;

	const counter = {
		completed_event: 0,
		live_event: 0,
		achievement: 0,
		miscellaneous: 0,
		written: 0
	};

	for (const i of tweet_array) {
		const categories = i.source;
		if (i.written) {
			counter.written++;
		}

		counter[categories]++;
	}

	const total = tweet_array.length;

	const list = document.querySelectorAll('.completedEvents');
	for (const i of list) {
		i.textContent = counter.completed_event;
	}
	document.querySelector('.liveEvents').textContent = counter.live_event;
	document.querySelector('.achievements').textContent = counter.achievement;
	document.querySelector('.miscellaneous').textContent = counter.miscellaneous;
	document.querySelector('.written').textContent = counter.written;

	const completedPct = (counter.completed_event / total) * 100;
	const livePct = (counter.live_event / total) * 100;
	const achievementPct = (counter.achievement / total) * 100;
	const miscPct = (counter.miscellaneous / total) * 100;
	const writtenPct = (counter.written / total) * 100;

	const completedPctStr = math.format(completedPct, {notation: 'fixed', precision: 2}) + "%";
	const livePctStr = math.format(livePct, {notation: 'fixed', precision: 2}) + "%";
	const achievementPctStr = math.format(achievementPct, {notation: 'fixed', precision: 2}) + "%";
	const miscPctStr = math.format(miscPct, {notation: 'fixed', precision: 2}) + "%";
	const writtenPctStr = math.format(writtenPct, {notation: 'fixed', precision: 4}) + "%";

	document.querySelector('.completedEventsPct').textContent = completedPctStr;
	document.querySelector('.liveEventsPct').textContent = livePctStr;
	document.querySelector('.achievementsPct').textContent = achievementPctStr;
	document.querySelector('.miscellaneousPct').textContent = miscPctStr;
	document.querySelector('.writtenPct').textContent = writtenPctStr;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});