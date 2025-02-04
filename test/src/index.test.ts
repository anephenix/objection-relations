import assert from 'assert';
import { ObjectionRelation } from '../../src/index';

describe('objection-relations', () => {
  describe('ObjectionRelation class', () => {
    describe('instantiation', () => {
      it('should return an instance', () => {
        const instance = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        assert(instance instanceof ObjectionRelation);
        assert.strictEqual(instance.subject, 'User');
        assert.strictEqual(instance.modelPath, 'src/models');
      });
    });

    describe('#belongsTo', () => {
      it('should define a relationship where a record in one model can belong to a record in another model', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const belongsTo = or.belongsTo('Category');
        assert.strictEqual(belongsTo.modelClass, 'src/models/Category');
        assert.deepStrictEqual(belongsTo.join, {
          from: 'users.category_id',
          to: 'categories.id',
        });
        assert.strictEqual(belongsTo.relation.name, 'BelongsToOneRelation');
      });
    });

    describe('#hasOne', () => {
      it('should define a relationship where a record in one model can own a record in another model', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const hasOne = or.hasOne('Setting');
        assert.strictEqual(hasOne.modelClass, 'src/models/Setting');
        assert.deepStrictEqual(hasOne.join, {
          from: 'users.id',
          to: 'settings.user_id',
        });
        assert.strictEqual(hasOne.relation.name, 'HasOneRelation');
      });
    });

    describe('#hasMany', () => {
      it('should define a relationship where a record in one model can own many records in another model', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const hasMany = or.hasMany('Post');
        assert.strictEqual(hasMany.modelClass, 'src/models/Post');
        assert.deepStrictEqual(hasMany.join, { from: 'users.id', to: 'posts.user_id' });
        assert.strictEqual(hasMany.relation.name, 'HasManyRelation');
      });
    });

    describe('#hasManyThrough', () => {
      it('should define a relationship where a record in one model can own many records in another model, via a join table', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const hasManyThrough = or.hasManyThrough('Group', 'UserGroupJoin');
        assert.strictEqual(hasManyThrough.modelClass, 'src/models/Group');
        assert.deepStrictEqual(hasManyThrough.join, {
          from: 'users.id',
          to: 'groups.id',
          through: {
            from: 'user_group_joins.user_id',
            to: 'user_group_joins.group_id',
          },
        });
        assert.strictEqual(hasManyThrough.relation.name, 'ManyToManyRelation');
      });
    });
  });
});
