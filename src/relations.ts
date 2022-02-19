// Dependencies
import { Model } from 'objection';
import {
  RelationTypeProps,
  CommonRelationOrTableOrForeignKeyProps,
} from './global';
import {
  getSubjectTable,
  getSubjectForeignKey,
  getObjectTable,
  getObjectForeignKey,
  getModelClass,
  getViaTable,
} from './helpers';

const {
  HasOneRelation,
  BelongsToOneRelation,
  HasManyRelation,
  ManyToManyRelation,
} = Model;

// Types

type AdvancedRelationTypeProps = RelationTypeProps & {
  through: {
    from: string;
    to: string;
  };
};

/*
    Defines a relationship where a record in one model can belong to a record in
    another model.
*/
export function belongsRelation({ modelClass, from, to }: RelationTypeProps) {
  return {
    relation: BelongsToOneRelation,
    modelClass,
    join: { from, to },
  };
}

/*
	Defines a relationship where a record in one model can own a record in another
	model.
*/
export function hasOneRelation({ modelClass, from, to }: RelationTypeProps) {
  return {
    relation: HasOneRelation,
    modelClass,
    join: { from, to },
  };
}

/*
	Defines a relationship where a record in one model can own many records in
	another model.
*/
export function hasManyRelation({ modelClass, from, to }: RelationTypeProps) {
  return {
    relation: HasManyRelation,
    modelClass,
    join: { from, to },
  };
}

/*
	Defines a relationship where a record in one model can own many records in
	another model, via a join table
*/
export function hasManyThroughRelation({
  modelClass,
  from,
  through,
  to,
}: AdvancedRelationTypeProps) {
  return {
    relation: ManyToManyRelation,
    modelClass,
    join: { from, through, to },
  };
}

type RelationProps = CommonRelationOrTableOrForeignKeyProps & {
  subject: string;
  relType: 'hasOne' | 'hasMany' | 'hasManyThrough' | 'belongsTo';
  object: string;
  via?: string;
};

/*
	Defines a relationship by passing the subject, the predicate, and the object,
	along with an optional via model.
*/
export function relation({
  subject,
  relType,
  object,
  via,
  options,
}: RelationProps) {
  const subjectTable = getSubjectTable({ subject, options });
  const objectTable = getObjectTable({ object, options });
  const subjectForeignKey = getSubjectForeignKey({ subject, options });
  const objectForeignKey = getObjectForeignKey({ object, options });
  const modelClass = getModelClass({ object, options });
  const viaTable = getViaTable(via);
  switch (relType) {
    case 'hasOne':
      return hasOneRelation({
        modelClass,
        from: `${subjectTable}.id`,
        to: `${objectTable}.${subjectForeignKey}`,
      });
    case 'hasMany':
      return hasManyRelation({
        modelClass,
        from: `${subjectTable}.id`,
        to: `${objectTable}.${subjectForeignKey}`,
      });
    case 'hasManyThrough':
      return hasManyThroughRelation({
        modelClass,
        from: `${subjectTable}.id`,
        through: {
          from: `${viaTable}.${subjectForeignKey}`,
          to: `${viaTable}.${objectForeignKey}`,
        },
        to: `${objectTable}.id`,
      });
    case 'belongsTo':
      return belongsRelation({
        modelClass,
        from: `${subjectTable}.${objectForeignKey}`,
        to: `${objectTable}.id`,
      });
    default:
      throw new Error('No valid relationship type specified');
  }
}
