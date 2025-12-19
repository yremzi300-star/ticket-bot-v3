const fs = require('fs');
const path = './data/stats.json';

module.exports = {
  add(userId) {
    const data = JSON.parse(fs.readFileSync(path));
    data[userId] = (data[userId] || 0) + 1;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  },

  get() {
    return JSON.parse(fs.readFileSync(path));
  },

  reset() {
    fs.writeFileSync(path, '{}');
  }
};
