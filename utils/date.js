// Get the current date
var today = new Date();
const time = () => today.getHours() + ":" + today.getMinutes()

module.exports = time;