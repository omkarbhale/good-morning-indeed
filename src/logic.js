const fs = require("fs").promises;
const path = require("path");
const { getTodaysData, saveData } = require("./memory");

// Helper function to determine the greeting based on current time
function getGreeting(date) {
	const hour = date.getHours();
	// Define your time chunks:
	// Morning: 5am - 12pm, Afternoon: 12pm - 5pm, Evening: 5pm - 9pm, Night: 9pm - 5am
	if (hour >= 5 && hour < 12) return "Good morning";
	else if (hour >= 12 && hour < 17) return "Good afternoon";
	else if (hour >= 17 && hour < 21) return "Good evening";
	else return "Good night";
}

async function sendGreetings(waclient) {
	// Step 1: Read the user list from a file (each line is a user)
	const filePath = path.join(__dirname, "../.userlist.txt");
	const fileContent = await fs.readFile(filePath, "utf8");
	const users = fileContent
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.filter(user => !user.startsWith("--"));

	// Step 2: Fetch today's data (array of { timestamp, user, message_sent })
	const todaysData = await getTodaysData();

	// Step 3: Determine the current greeting based on the time of day
	const now = new Date();
	const greeting = getGreeting(now);

	// Step 4: For each user, check if they've already received this greeting today
	const sendPromises = users.map(async (user) => {
		const alreadyGreeted = todaysData.some(
			(entry) => entry.user === user && entry.message_sent === greeting
		);
		if (!alreadyGreeted) {
			// Send the greeting via the WhatsApp client
			await waclient.sendMessage(user, greeting);
			// Record the sent message
			const data = { timestamp: now.getTime(), user, message_sent: greeting };
			await saveData(data);
		}
	});

	await Promise.all(sendPromises);
}

module.exports = { sendGreetings };
