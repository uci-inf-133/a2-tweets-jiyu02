class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const cur_text = this.text;

        if (cur_text.startsWith("Just completed") || cur_text.startsWith("Just posted")) {
            return "completed_event";
        }
        if (cur_text.startsWith("Watch my")) {
            return "live_event"
        }
        if (cur_text.startsWith("Achieved a") || cur_text.includes("set a")) {
            return "achievement"
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const cur_text = this.text;

        if (cur_text.includes(" - ")) {
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        const cur_text = this.text;

        if (cur_text.includes(" - ")) {
            const index1 = cur_text.indexOf(" - ") + 3;
            const index2 = cur_text.indexOf("http") - 1;
            if (index2 > index1) {
                return cur_text.substring(index1, index2);
            }
        }
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const cur_text = this.text;

        const activities = ["ski", "run", "walk", "bike", "yoga", "workout", "swim", "hike"];
        for (const i of activities) {
            if (cur_text.includes(i)) {
                return i;
            }
        }
        return "others";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const cur_text = this.text;

        const miIndex = cur_text.indexOf(" mi");
        const kmIndex = cur_text.indexOf(" km");
        const aIndex = cur_text.indexOf(" a ") + 3;

        const miDistStr = cur_text.substring(aIndex, miIndex);
        const kmDistStr = cur_text.substring(aIndex, kmIndex);

        const miDist = parseFloat(miDistStr);
        const kmDist = parseFloat(kmDistStr);

        if (cur_text.includes(" mi")) {
            return miDist;
        }
        if (cur_text.includes(" km")) {
            return kmDist / 1.609;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let text = this.text;
        let link = "";

        const start = text.indexOf("https");
        const end = text.indexOf(" #Runkeeper");
        link = text.substring(start, end);

        if (link !== "") {
            const linkHTML = `<a href="${link}">${link}</a>`;
            text = text.replace(link, linkHTML);
        }

        const activity = this.activityType;
        
        return `<tr><td>${rowNumber}</td><td>${activity}</td><td>${text}</td></tr>`;
    }
}