function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const top3Activities = ["run", "walk", "bike"];
	const activityCount = [];

	
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const counter = {
		ski: 0,
		run: 0,
		walk: 0,
		bike: 0,
		workout: 0,
		yoga: 0,
		swim: 0,
		hike: 0
	};

	for (const i of tweet_array) {
		const activities = i.activityType;
		counter[activities]++;
	}

	const actArray = [];
	for (const act in counter) {
		actArray.push([act, counter[act]]);
	}
	actArray.sort((a, b) => b[1] - a[1]);

	const top1 = actArray[0][0];
	const top2 = actArray[1][0];
	const top3 = actArray[2][0];

	document.getElementById('numberActivities').textContent = actArray.length;
	document.getElementById('firstMost').textContent = top1;
	document.getElementById('secondMost').textContent = top2;
	document.getElementById('thirdMost').textContent = top3;

	var top1Dist = 0, top1Count = 0, top2Dist = 0, top2Count = 0, top3Dist = 0, top3Count = 0;
	for (const j of tweet_array) {
		if (j.activityType == top1) {
			top1Dist += j.distance;
			top1Count++;
		}
		if (j.activityType == top2) {
			top2Dist += j.distance;
			top2Count++;
		}
		if (j.activityType == top3) {
			top3Dist += j.distance;
			top3Count++;
		}
	}
	const top1Avg = top1Dist/top1Count;
	const top2Avg = top2Dist/top2Count;
	const top3Avg = top3Dist/top3Count;

	var longest = top1;
	var longestAvg = top1Avg;

	if (top2Avg > longestAvg) {
		longest = top2;
		longestAvg = top2Avg;
	}
	if (top3Avg > longestAvg) {
		longest = top3;
		longestAvg = top3Avg;
	}

	var shortest = top1;
	var shortestAvg = top1Avg;

	if (top2Avg < shortestAvg) {
		shortest = top2;
		shortestAvg = top2Avg;
	}
	if (top3Avg < shortestAvg) {
		shortest = top3;
		shortestAvg = top3Avg;
	}

	var weekdayDist = 0, weekdayCount = 0, weekendDist = 0, weekendCount = 0;

	for (const k of tweet_array) {
		const day = k.time.toLocaleDateString(undefined, {weekday: "long"});
		if (day == "Saturday" || day == "Sunday") {
			weekendDist += k.distance;
			weekendCount++;
		}
		else {
			weekdayDist += k.distance;
			weekdayCount++;
		}
	}

	const weekdayAvg = weekdayDist/weekdayCount;
	const weekendAvg = weekendDist/weekendCount;
	var longer = "";

	if (weekdayAvg > weekendAvg) {
		longer = "weekdays";
	}
	else {
		longer = "weekends";
	}
	
	document.getElementById('longestActivityType').textContent = longest;
	document.getElementById('shortestActivityType').textContent = shortest;
	document.getElementById('weekdayOrWeekendLonger').textContent = longer;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});