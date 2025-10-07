import type { ModelClass } from "objection";

export type OptionsProps = {
	subjectTable?: string;
	objectTable?: string;
	subjectForeignKey?: string;
	objectForeignKey?: string;
	modelPath?: string;
};

export type CommonRelationOrTableOrForeignKeyProps = {
	options?: OptionsProps;
};

export type ModelType = string | ModelClass;

export type RelationTypeProps = {
	modelClass: ModelType;
	from: string;
	to: string;
};
