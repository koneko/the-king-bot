// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const fs = require("fs");
const puppeteer = require("puppeteer");
// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

async function init() {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	console.log("pup started");
	return page;
}

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Ready!");
});
//listen for messages
client.on("message", async (message) => {
	//if the message is from a bot, ignore it
	if (message.author.bot) return;
	//if the message is not from a guild, ignore it
	if (!message.guild) return;
	//if the message does not start with the prefix, ignore it
	if (!message.content.startsWith(prefix)) return;
	//parse the message
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	//if the command is setup, run the setup function
	if (command === "setup") {
		if (message.author.id != "263247134147608578") return;
		let channel = message.channelId;
		let time = new Date();
		time.setHours("6");
		let obj = {
			last: time,
			channel: channel,
		};
		fs.writeFileSync("pup.json", JSON.stringify(obj));
		//send embed
		message.channel.send(
			`Setup time as \`${time}\` and channel as \`${channel}\``
		);
	}
	if (command === "send") {
		let page = await init();
		await page.goto(
			"https://docs.google.com/document/d/e/2PACX-1vSy4jAOFM_AjuE8BAryWhcEc48Jqriq0yt4k342BV5SvQbyEO67GpMvfOQglVPkkrUxRJxmeNvwXpOH/pub",
			{
				waitUntil: "networkidle2",
			}
		);
		await page.setViewport({
			width: 1200,
			height: 800,
		});
		await page.screenshot({ path: "screen.png" });
		// let image = await fs.readFileSync("screen.png");

		let rawcfg = fs.readFileSync("pup.json");
		let cfg = JSON.parse(rawcfg);
		//get channel by id
		// let channel = client.channels.cache.get(cfg.channel);
		message.reply({ files: ["screen.png"] });
	}
});
setInterval(async () => {
	// return;
	let date = new Date();
	let rawcfg = fs.readFileSync("pup.json");
	let cfg = JSON.parse(rawcfg);
	let old = new Date(cfg.last);
	//check if 1 day has passed between 2 dates
	console.log(getNumberOfDays(old, date));
	if (getNumberOfDays(old, date) != 0) {
		let newtime = new Date();
		newtime.setHours("6");
		let obj = {
			last: newtime,
			channel: cfg.channel,
		};
		await fs.writeFileSync("pup.json", JSON.stringify(obj));
		let page = await init();
		await page.goto(
			"https://docs.google.com/document/d/e/2PACX-1vSy4jAOFM_AjuE8BAryWhcEc48Jqriq0yt4k342BV5SvQbyEO67GpMvfOQglVPkkrUxRJxmeNvwXpOH/pub",
			{
				waitUntil: "networkidle2",
			}
		);
		await page.setViewport({
			width: 1200,
			height: 800,
		});
		await page.screenshot({ path: "screen.png" });
		// await page.evaluate(() => {
		// 	scrollBy(200);
		// });
		let channel = client.channels.cache.get(cfg.channel);
		channel.send("@everyone");
		channel.send({ files: ["screen.png"] });
	}
	//
}, 600000);

function getNumberOfDays(start, end) {
	const date1 = new Date(start);
	const date2 = new Date(end);

	// One day in milliseconds
	const oneDay = 1000 * 60 * 60 * 24;

	// Calculating the time difference between two dates
	const diffInTime = date2.getTime() - date1.getTime();

	// Calculating the no. of days between two dates
	const diffInDays = Math.round(diffInTime / oneDay);

	return diffInDays;
}
// init();
// Login to Discord with your client's token
client.login(token);
