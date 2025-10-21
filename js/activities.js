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
	const activityCounter = {};
	for (const a of tweet_array) {
		if (a.source === "completed_event") {
			const b = a.activityType;
			if (!activityCounter[b]) {
				activityCounter[b] = 0;
			}
			activityCounter[b]++;
		}
	}

	const activityCount = [];
	for (const t in activityCounter) {
		activityCount.push({ activity: t, count: activityCounter[t] });
	}
	
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCount
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": { "field": "activity", "type": "nominal" },
		"y": { "field": "count", "type": "quantitative" }
	  }
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

	document.getElementById('numberActivities').textContent = activityCount.length;
	document.getElementById('firstMost').textContent = top1;
	document.getElementById('secondMost').textContent = top2;
	document.getElementById('thirdMost').textContent = top3;

	let top1Dist = 0, top1Count = 0, top2Dist = 0, top2Count = 0, top3Dist = 0, top3Count = 0;
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

	let longest = top1;
	let longestAvg = top1Avg;

	if (top2Avg > longestAvg) {
		longest = top2;
		longestAvg = top2Avg;
	}
	if (top3Avg > longestAvg) {
		longest = top3;
		longestAvg = top3Avg;
	}

	let shortest = top1;
	let shortestAvg = top1Avg;

	if (top2Avg < shortestAvg) {
		shortest = top2;
		shortestAvg = top2Avg;
	}
	if (top3Avg < shortestAvg) {
		shortest = top3;
		shortestAvg = top3Avg;
	}

	let weekdayDist = 0, weekdayCount = 0, weekendDist = 0, weekendCount = 0;

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
	let longer = "";

	if (weekdayAvg > weekendAvg) {
		longer = "weekdays";
	}
	else {
		longer = "weekends";
	}
	
	document.getElementById('longestActivityType').textContent = longest;
	document.getElementById('shortestActivityType').textContent = shortest;
	document.getElementById('weekdayOrWeekendLonger').textContent = longer;

	const distDay = [];
	for (const t of tweet_array) {
		if (t.source === "completed_event") {
			if (t.activityType === top1 || t.activityType === top2 || t.activityType === top3) {
				const dayName = t.time.toLocaleDateString(undefined, { weekday: "long" });
				distDay.push({activity: t.activityType, day: dayName, distance: t.distance});
			}
		}
	}
	const weekOrder = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distance done per activity each day.",
	  "data": {
	    "values": distDay
	  },
	  "mark": "point",
	  "encoding": {
		"x": { "field": "day", "type": "ordinal", "sort": weekOrder},
		"y": { "field": "distance", "type": "quantitative" },
		"color": { "field": "activity", "type": "nominal"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_agg_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the mean distance done per activity each day.",
	  "data": {
	    "values": distDay
	  },
	  "mark": "point",
	  "encoding": {
		"x": { "field": "day", "type": "ordinal", "sort": weekOrder},
		"y": { "field": "distance", "type": "quantitative", "aggregate": "mean"},
		"color": { "field": "activity", "type": "nominal"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, {actions:false});

	const button = document.getElementById("aggregate");
	const distanceChart = document.getElementById("distanceVis");
	const meanChart = document.getElementById("distanceVisAggregated");

	meanChart.style.display = "none";
 	button.textContent = "Show means";
	let showingMean = false;

	button.addEventListener("click", function() {
    if (showingMean) {
      meanChart.style.display = "none";
      distanceChart.style.display = "block";
      button.textContent = "Show means";
      showingMean = false;
    } else {
      distanceChart.style.display = "none";
      meanChart.style.display = "block";
      button.textContent = "Show all activities";
      showingMean = true;
    }
  });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});