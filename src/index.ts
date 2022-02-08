// Dependencies
import { Model } from 'objection';
const {
	HasOneRelation,
	BelongsToOneRelation,
	HasManyRelation,
	ManyToManyRelation,
} = Model;
import snakeCase from 'lodash.snakecase';
import pluralize from 'pluralize';

type CommonRelationOrTableOrForeignKeyProps = {
    options?: {
        subjectTable?: string;
        objectTable?: string;
        subjectForeignKey?: string;
        objectForeignKey?: string;
    }
}

type RelationProps = CommonRelationOrTableOrForeignKeyProps & {
    subject: string;
    relType: 'hasOne' | 'hasMany' | 'hasManyThrough' | 'belongsTo';
    object: string;
    via?: string;
}

type RelationTypeProps = {
    modelClass: string;
    from: string;
    to: string;
};

type AdvancedRelationTypeProps = RelationTypeProps & {
    through: {
        from: string;
        to: string;
    };
}

type SubjectProps = CommonRelationOrTableOrForeignKeyProps & {
    subject: string;
}

type ObjectProps = CommonRelationOrTableOrForeignKeyProps & {
    object: string;
}

/*
    Defines a relationship where a record in one model can belong to a record in
    another model.
*/
export function belongsRelation({ modelClass, from, to }:RelationTypeProps) {
	return {
		relation: BelongsToOneRelation,
		modelClass,
		join: { from, to },
	};
};

/*
	Defines a relationship where a record in one model can own a record in another
	model.
*/
export function hasOneRelation({ modelClass, from, to }:RelationTypeProps) {
	return {
		relation: HasOneRelation,
		modelClass,
		join: { from, to },
	};
};

/*
	Defines a relationship where a record in one model can own many records in
	another model.
*/
export function hasManyRelation({ modelClass, from, to }:RelationTypeProps) {
	return {
		relation: HasManyRelation,
        modelClass,
		join: { from, to },
	};
};

/*
	Defines a relationship where a record in one model can own many records in
	another model, via a join table
*/
export function hasManyThroughRelation({ modelClass, from, through, to }:AdvancedRelationTypeProps) {
	return {
		relation: ManyToManyRelation,
        modelClass,
		join: { from, through, to },
	};
};

/*
    Gets the SQL table for the subject, either from the options object or the
    plural version of the subject model.
*/
export function getSubjectTable({ subject, options }:SubjectProps) {
    return options?.subjectTable || pluralize(snakeCase(subject));
}

/*
    Gets the SQL table for the object, either from the options object or the
    plural version of the object model.
*/
export function getObjectTable({ object, options }:ObjectProps) { 
    return options?.objectTable || pluralize(snakeCase(object));
}

/*
    Gets the SQL foreign key for the subject, either from the options object 
    or the snake case of the subject model.
*/
export function getSubjectForeignKey({ subject, options }:SubjectProps) {
    return options?.subjectForeignKey || snakeCase(subject) + '_id';
}

/*
    Gets the SQL foreign key for the object, either from the options object 
    or the snake case of the object model.
*/
export function getObjectForeignKey({ object, options }:ObjectProps) {
    return options?.objectForeignKey || snakeCase(object) + '_id';
}

/*
	Defines a relationship by passing the subject, the predicate, and the object,
	along with an optional via model.
*/
export function relation({subject, relType, object, via, options}:RelationProps) {
	const subjectTable = getSubjectTable({subject, options});
	const objectTable = getObjectTable({object, options});
	const subjectForeignKey = getSubjectForeignKey({subject, options});
	const objectForeignKey = getObjectForeignKey({object, options});
	let viaTable;
	if (via) viaTable = pluralize(snakeCase(via));
	switch (relType) {
		case 'hasOne':
			return hasOneRelation({
                modelClass: object,
				from: `${subjectTable}.id`,
				to: `${objectTable}.${subjectForeignKey}`
            });
		case 'hasMany':
			return hasManyRelation({
				modelClass: object,
				from: `${subjectTable}.id`,
				to: `${objectTable}.${subjectForeignKey}`
			});
		case 'hasManyThrough':
			return hasManyThroughRelation({
				modelClass: object,
				from: `${subjectTable}.id`,
				through: {
					from: `${viaTable}.${subjectForeignKey}`,
					to: `${viaTable}.${objectForeignKey}`,
				},
				to: `${objectTable}.id`
            });
		case 'belongsTo':
			return belongsRelation({
				modelClass: object,
				from: `${subjectTable}.${objectForeignKey}`,
				to: `${objectTable}.id`
            });
		default:
			throw new Error('No valid relationship type specified');
	}
};