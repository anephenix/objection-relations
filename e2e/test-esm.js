/*
    We use this as a check to ensure that the ESM build loads correctly.
*/

// Dependencies
import assert from 'node:assert';
import { ObjectionRelation } from '../dist/index.js';

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
    console.log('ESM test passed successfully!');
    process.exit(0);
} catch (error) {
	console.error('Error during ESM build check:', error);
	process.exit(1);
}
