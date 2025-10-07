import { join } from "node:path";
import snakeCase from "lodash.snakecase";
import pluralize from "pluralize";
import type { CommonRelationOrTableOrForeignKeyProps } from "./global.js";

// Types

type SubjectProps = CommonRelationOrTableOrForeignKeyProps & {
	subject: string;
};

type ObjectProps = CommonRelationOrTableOrForeignKeyProps & {
	object: string;
};

type ViaProps = string | undefined;

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
	return options?.objectTable || pluralize(snakeCase(object));
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
	return options?.objectForeignKey || `${snakeCase(object)}_id`;
}

/*
	Allows you to define the model path for a model
*/
export function getModelClass({ object, options }: ObjectProps) {
	return options?.modelPath ? join(options.modelPath, object) : object;
}

export function getViaTable(via: ViaProps) {
	return via ? pluralize(snakeCase(via)) : null;
}
