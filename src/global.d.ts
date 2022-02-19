export type OptionsProps = {
  subjectTable?: string;
  objectTable?: string;
  subjectForeignKey?: string;
  objectForeignKey?: string;
  modelPath?: string;
};

type CommonRelationOrTableOrForeignKeyProps = {
  options?: OptionsProps;
};

type RelationTypeProps = {
  modelClass: string;
  from: string;
  to: string;
};
