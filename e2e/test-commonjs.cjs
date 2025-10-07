/*
    We use this as a check to ensure that the CommonJS build loads correctly.
*/

// Dependencies
const assert = require('node:assert');
const { ObjectionRelation } = require('../dist/index.js');

try {
    const or = new ObjectionRelation({
        subject: "User",
        modelPath: "src/models",
    });
    const belongsTo = or.belongsTo("Category");
    assert.strictEqual(belongsTo.modelClass, "src/models/Category");
    assert.deepStrictEqual(belongsTo.join, {
        from: "users.category_id",
        to: "categories.id",
    });
    console.log('CommonJS test passed successfully!');
    process.exit(0);
} catch (error) {
	console.error('Error during CommonJS build check:', error);
	process.exit(1);
}
