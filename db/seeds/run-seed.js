const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = async () => {
    try {
        await seed(devData);
        await db.end();
        console.log('Seed process completed successfully.');
    } catch (error) {
        console.error('Error running seed process:', error);
    }
};

runSeed();
