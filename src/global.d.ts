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

export type RelationTypeProps = {
	modelClass: string;
	from: string;
	to: string;
};
