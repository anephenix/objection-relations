import { join } from "node:path";
import snakeCase from "lodash.snakecase";
import pluralize from "pluralize";
import type {
	CommonRelationOrTableOrForeignKeyProps,
	ModelType,
} from "./global.js";

// Types

type SubjectProps = CommonRelationOrTableOrForeignKeyProps & {
	subject: string;
};

type ObjectProps = CommonRelationOrTableOrForeignKeyProps & {
	object: ModelType;
};

type ViaProps = string | undefined;

/*
	We use this function to detect if the object is 
	an Objection.js model or a string.
*/
export function isModel(object: ModelType): boolean {
	return (
		typeof object === "function" &&
		object?.tableName !== undefined &&
		object?.name !== undefined
	);
}

/*
    Gets the SQL table for the subject, either from the options object or the
    plural version of the subject model.
*/
export function getSubjectTable({ subject, options }: SubjectProps) {
	return options?.subjectTable || pluralize(snakeCase(subject));
}

/*
    Gets the SQL table for the object, either from the options object or the
    plural version of the object model.
*/
export function getObjectTable({ object, options }: ObjectProps) {
	// If the object is already a Model class, return the table name
	if (isModel(object)) return object.tableName;
	return options?.objectTable || pluralize(snakeCase(object as string));
}

/*
    Gets the SQL foreign key for the subject, either from the options object 
    or the snake case of the subject model.
*/
export function getSubjectForeignKey({ subject, options }: SubjectProps) {
	return options?.subjectForeignKey || `${snakeCase(subject)}_id`;
}

/*
    Gets the SQL foreign key for the object, either from the options object 
    or the snake case of the object model.
*/
export function getObjectForeignKey({ object, options }: ObjectProps) {
	if (isModel(object)) {
		const modelName = object.name;
		return options?.objectForeignKey || `${snakeCase(modelName)}_id`;
	}
	return options?.objectForeignKey || `${snakeCase(object as string)}_id`;
}

/*
	Allows you to define the model path for a model
*/
export function getModelClass({ object, options }: ObjectProps) {
	// If the object is already a Model class, return it
	if (isModel(object)) return object;
	return options?.modelPath
		? join(options.modelPath, object as string)
		: object;
}

export function getViaTable(via: ViaProps) {
	return via ? pluralize(snakeCase(via)) : null;
}
