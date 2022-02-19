import { ObjectionRelation } from '../../src/index';

describe('objection-relations', () => {
  describe('ObjectionRelation class', () => {
    describe('instantiation', () => {
      test('should return an instance', () => {
        const instance = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        expect(instance).toBeInstanceOf(ObjectionRelation);
        expect(instance.subject).toBe('User');
        expect(instance.modelPath).toBe('src/models');
      });
    });

    describe('#belongsTo', () => {
      test('should define a relationship where a record in one model can belong to a record in another model', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const belongsTo = or.belongsTo('Category');
        expect(belongsTo.modelClass).toEqual('src/models/Category');
        expect(belongsTo.join).toEqual({
          from: 'users.category_id',
          to: 'categories.id',
        });
        expect(belongsTo.relation.name).toBe('BelongsToOneRelation');
      });
    });

    describe('#hasOne', () => {
      test('should define a relationship where a record in one model can own a record in another model', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const hasOne = or.hasOne('Setting');
        expect(hasOne.modelClass).toEqual('src/models/Setting');
        expect(hasOne.join).toEqual({
          from: 'users.id',
          to: 'settings.user_id',
        });
        expect(hasOne.relation.name).toBe('HasOneRelation');
      });
    });

    describe('#hasMany', () => {
      test('should define a relationship where a record in one model can own many records in another model', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const hasMany = or.hasMany('Post');
        expect(hasMany.modelClass).toEqual('src/models/Post');
        expect(hasMany.join).toEqual({ from: 'users.id', to: 'posts.user_id' });
        expect(hasMany.relation.name).toBe('HasManyRelation');
      });
    });

    describe('#hasManyThrough', () => {
      test('should define a relationship where a record in one model can own many records in another model, via a join table', () => {
        const or = new ObjectionRelation({
          subject: 'User',
          modelPath: 'src/models',
        });
        const hasManyThrough = or.hasManyThrough('Group', 'UserGroupJoin');
        expect(hasManyThrough.modelClass).toEqual('src/models/Group');
        expect(hasManyThrough.join).toEqual({
          from: 'users.id',
          to: 'groups.id',
          through: {
            from: 'user_group_joins.user_id',
            to: 'user_group_joins.group_id',
          },
        });
        expect(hasManyThrough.relation.name).toBe('ManyToManyRelation');
      });
    });
  });
});
