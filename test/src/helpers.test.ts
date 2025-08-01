import { assert, describe, it } from "vitest";
import {
	getModelClass,
	getObjectForeignKey,
	getObjectTable,
	getSubjectForeignKey,
	getSubjectTable,
	getViaTable,
} from "../../src/helpers";

describe("helpers", () => {
	describe("#getSubjectTable", () => {
		describe("when passed a subjectTable in the options", () => {
			it("should return the subject table", () => {
				const result = getSubjectTable({
					subject: "User",
					options: {
						subjectTable: "admin_users",
					},
				});
				assert.strictEqual(result, "admin_users");
			});
		});

		describe("when not passed a subjectTable in the options", () => {
			it("should return the plural version of the subject model", () => {
				const result = getSubjectTable({
					subject: "User",
				});
				assert.strictEqual(result, "users");
				const anotherResult = getSubjectTable({
					subject: "AdminUser",
				});
				assert.strictEqual(anotherResult, "admin_users");
			});
		});
	});

	describe("#getObjectTable", () => {
		describe("when passed an objectTable in the options", () => {
			it("should return the object table", () => {
				const result = getObjectTable({
					object: "Post",
					options: {
						objectTable: "admin_posts",
					},
				});
				assert.strictEqual(result, "admin_posts");
			});
		});

		describe("when not passed an objectTable in the options", () => {
			it("should return the plural version of the object model", () => {
				const result = getObjectTable({
					object: "Post",
				});
				assert.strictEqual(result, "posts");
				const anotherResult = getObjectTable({
					object: "UserPost",
				});
				assert.strictEqual(anotherResult, "user_posts");
			});
		});
	});

	describe("#getSubjectForeignKey", () => {
		describe("when passed a subjectForeignKey in the options", () => {
			it("should return the subject foreign key", () => {
				const result = getSubjectForeignKey({
					subject: "User",
					options: {
						subjectForeignKey: "admin_user_id",
					},
				});
				assert.strictEqual(result, "admin_user_id");
			});
		});

		describe("when not passed a subjectForeignKey in the options", () => {
			it("should return a generated subjectForeignKey based on the object model", () => {
				const result = getSubjectForeignKey({
					subject: "User",
				});
				assert.strictEqual(result, "user_id");
				const anotherResult = getSubjectForeignKey({
					subject: "AdminUser",
				});
				assert.strictEqual(anotherResult, "admin_user_id");
			});
		});
	});

	describe("#getObjectForeignKey", () => {
		describe("when passed an objectForeignKey in the options", () => {
			it("should return the object foreign key", () => {
				const result = getObjectForeignKey({
					object: "Post",
					options: {
						objectForeignKey: "admin_post_id",
					},
				});
				assert.strictEqual(result, "admin_post_id");
			});
		});

		describe("when not passed an objectForeignKey in the options", () => {
			it("should return a generated objectForeignKey based on the object model", () => {
				const result = getObjectForeignKey({
					object: "Post",
				});
				assert.strictEqual(result, "post_id");
				const anotherResult = getObjectForeignKey({
					object: "UserPost",
				});
				assert.strictEqual(anotherResult, "user_post_id");
			});
		});
	});

	describe("#getModelClass", () => {
		describe("when passed a modelPath in the options", () => {
			it("should return the model path", () => {
				const result = getModelClass({
					object: "Post",
					options: {
						modelPath: "admin/models",
					},
				});
				assert.strictEqual(result, "admin/models/Post");
			});
		});

		describe("when not passed a modelPath in the options", () => {
			it("should return the object model", () => {
				const result = getModelClass({
					object: "Post",
				});
				assert.strictEqual(result, "Post");
			});
		});
	});

	describe("#getViaTable", () => {
		describe("when passed a viaTable in the options", () => {
			it("should return the via table", () => {
				const result = getViaTable("User");
				assert.strictEqual(result, "users");
			});
		});

		describe("when not passed a viaTable in the options", () => {
			it("should return a generated via table based on the subject and object models", () => {
				const result = getViaTable(undefined);
				assert.strictEqual(result, null);
			});
		});
	});
});
