// ./src/helpers/helper.js
const moment = require('moment-timezone');
const { env } = require('../configs/envConfig');

// Function to check server timezone
function getServerTimezone() {
    return moment.tz.guess();
}

// Function to convert a date to local timezone
function convertToUserTimezone(date, userTimezone) {
    return moment(date).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss');
}

function getLocalTime() {
    // Get Server Timezone
    const serverTimezone = getServerTimezone();
    // Convert a date to local timezone
    const serverDate = new Date();
    console.log('Server timezone:', serverTimezone,'& Server Date:', serverDate.toISOString());

    // Get Local Timezone
    const userTimezone = env.server.localTimeZone;
    const userLocalDate = convertToUserTimezone(serverDate, userTimezone);

    console.log('Local timezone:', userTimezone,'& Local Date:', new Date(userLocalDate).toISOString());
    return new Date(userLocalDate);

    // Usage example
    // const localTime = getLocalTime();
    // console.log(localTime.toString());
}

function getDateTimeString() {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
  return date.toLocaleString('en-US', options);
}

// Helper function to convert uptime to a human-readable format
function formatUptime(uptimeInSeconds) {
    const seconds = Math.floor(uptimeInSeconds % 60);
    const minutes = Math.floor((uptimeInSeconds / 60) % 60);
    const hours = Math.floor((uptimeInSeconds / (60 * 60)) % 24);
    const days = Math.floor(uptimeInSeconds / (60 * 60 * 24));

    // const uptimeString = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    let uptimeString = '';
    if (days > 0) {
        uptimeString += `${days} day${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0) {
        uptimeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
        uptimeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    uptimeString += `${seconds} second${seconds > 1 ? 's' : ''}`;

    return uptimeString;
}

// Custom sorting function
async function uptimeToMilliseconds(uptime) {
  const regex = /(\d+)\s(day|days|hour|hours|minute|minutes|second|seconds)/g;
  let totalMilliseconds = 0;

  let match;
  while ((match = regex.exec(uptime)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case "days":
      case "day":
        totalMilliseconds += value * 24 * 60 * 60 * 1000;
        break;
      case "hours":
      case "hour":
        totalMilliseconds += value * 60 * 60 * 1000;
        break;
      case "minutes":
      case "minute":
        totalMilliseconds += value * 60 * 1000;
        break;
      case "seconds":
      case "second":
        totalMilliseconds += value * 1000;
        break;
      default:
        break;
    }
  }

  return totalMilliseconds;
}


module.exports = {
    getLocalTime,
    getDateTimeString,
    formatUptime,
    uptimeToMilliseconds,
};