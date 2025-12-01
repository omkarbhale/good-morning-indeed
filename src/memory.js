const Message = require("./Message");

// Get today's data
async function getTodaysData() {
	const now = new Date();
	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	).getTime();

	return await Message.find({ timestamp: { $gte: startOfToday } }).lean();
}

// Save a new message entry
async function saveData(entry) {
	await Message.create(entry);
}

module.exports = {
	getTodaysData,
	saveData,
};
