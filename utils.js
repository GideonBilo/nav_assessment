// This function takes a date like 15/07/2025 and changes it to 2025-07-15
function formatDate(dateString) {
  const parts = dateString.split('/');
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// I export it so I can use it in server.js and utils.test.js
module.exports = { formatDate };
