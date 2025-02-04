import assert from 'assert';

import {
  belongsRelation,
  hasOneRelation,
  hasManyRelation,
  hasManyThroughRelation,
  relation,
} from '../../src/relations';

describe('relations', () => {
  describe('#belongsRelation', () => {
    it('should define a relationship where a record in one model can belong to a record in another model', () => {
      const subjectTable = 'posts';
      const objectTable = 'users';
      const object = 'User';
      const objectForeignKey = 'user_id';
      const result = belongsRelation({
        modelClass: object,
        from: `${subjectTable}.${objectForeignKey}`,
        to: `${objectTable}.id`,
      });
      assert.strictEqual(result.modelClass, 'User');
      assert.deepStrictEqual(result.join, { from: 'posts.user_id', to: 'users.id' });
      assert.strictEqual(result.relation.name, 'BelongsToOneRelation');
    });
  });

  describe('#hasOneRelation', () => {
    it('should define a relationship where a record in one model can own a record in another model', () => {
      const subjectTable = 'users';
      const objectTable = 'settings';
      const object = 'Setting';
      const subjectForeignKey = 'user_id';
      const result = hasOneRelation({
        modelClass: object,
        from: `${subjectTable}.id`,
        to: `${objectTable}.${subjectForeignKey}`,
      });
      assert.strictEqual(result.modelClass, 'Setting');
      assert.deepStrictEqual(result.join, { from: 'users.id', to: 'settings.user_id' });
      assert.strictEqual(result.relation.name, 'HasOneRelation');
    });
  });

  describe('#hasManyRelation', () => {
    it('should define a relationship where a record in one model can own many records in another model', () => {
      const subjectTable = 'users';
      const objectTable = 'addresses';
      const object = 'Address';
      const subjectForeignKey = 'user_id';
      const result = hasManyRelation({
        modelClass: object,
        from: `${subjectTable}.id`,
        to: `${objectTable}.${subjectForeignKey}`,
      });
      assert.strictEqual(result.modelClass, 'Address');
      assert.deepStrictEqual(result.join, {
        from: 'users.id',
        to: 'addresses.user_id',
      });
      assert.strictEqual(result.relation.name, 'HasManyRelation');
    });
  });

  describe('#hasManyThroughRelation', () => {
    it('should define a relationship where a record in one model can own many records in another model, via a join table', () => {
      const object = 'Company';
      const subjectTable = 'users';
      const objectTable = 'companies';
      const subjectForeignKey = 'user_id';
      const objectForeignKey = 'company_id';
      const viaTable = 'employments';
      const result = hasManyThroughRelation({
        modelClass: object,
        from: `${subjectTable}.id`,
        through: {
          from: `${viaTable}.${subjectForeignKey}`,
          to: `${viaTable}.${objectForeignKey}`,
        },
        to: `${objectTable}.id`,
      });
      assert.strictEqual(result.modelClass, 'Company');
      assert.deepStrictEqual(result.join, {
        from: 'users.id',
        through: {
          from: 'employments.user_id',
          to: 'employments.company_id',
        },
        to: 'companies.id',
      });
      assert.strictEqual(result.relation.name, 'ManyToManyRelation');
    });
  });

  describe('#relation', () => {
    describe('when passed a relType of hasOne', () => {
      it('should return a relationship where a record in one model can own a record in another model', () => {
        const subject = 'User';
        const relType = 'hasOne';
        const object = 'Setting';
        const result = relation({ subject, relType, object });
        assert.strictEqual(result.modelClass, 'Setting');
        assert.deepStrictEqual(result.join, {
          from: 'users.id',
          to: 'settings.user_id',
        });
        assert.strictEqual(result.relation.name, 'HasOneRelation');
      });
    });

    describe('when passed a relType of hasMany', () => {
      it('should return a relationship where a record in one model can own many records in another model', () => {
        const subject = 'User';
        const relType = 'hasMany';
        const object = 'Address';
        const result = relation({ subject, relType, object });
        assert.strictEqual(result.modelClass, 'Address');
        assert.deepStrictEqual(result.join, {
          from: 'users.id',
          to: 'addresses.user_id',
        });
        assert.strictEqual(result.relation.name, 'HasManyRelation');
      });
    });

    describe('when passed a relType of hasManyThrough', () => {
      it('should return a relationship where a record in one model can own many records in another model, via a join table', () => {
        const subject = 'User';
        const relType = 'hasManyThrough';
        const object = 'Company';
        const via = 'Employment';
        const result = relation({ subject, relType, object, via });
        assert.strictEqual(result.modelClass, 'Company');
        assert.deepStrictEqual(result.join, {
          from: 'users.id',
          through: {
            from: 'employments.user_id',
            to: 'employments.company_id',
          },
          to: 'companies.id',
        });
        assert.strictEqual(result.relation.name, 'ManyToManyRelation');
      });
    });

    describe('when passed a relType of belongsTo', () => {
      it('should return a relationship where a record in one model can belong to a record in another model', () => {
        const subject = 'Post';
        const relType = 'belongsTo';
        const object = 'User';
        const result = relation({ subject, relType, object });
        assert.strictEqual(result.modelClass, 'User');
        assert.deepStrictEqual(result.join, { from: 'posts.user_id', to: 'users.id' });
        assert.strictEqual(result.relation.name, 'BelongsToOneRelation');
      });
    });

    describe('when passed options', () => {
      describe('when passed a subjectTable', () => {
        it('should use that subjectTable in the join', () => {
          const subject = 'User';
          const relType = 'hasMany';
          const object = 'Address';
          const subjectTable = 'account_users';
          const result = relation({
            subject,
            relType,
            object,
            options: { subjectTable },
          });
          assert.strictEqual(result.modelClass, 'Address');
          assert.deepStrictEqual(result.join, {
            from: 'account_users.id',
            to: 'addresses.user_id',
          });
          assert.strictEqual(result.relation.name, 'HasManyRelation');
        });
      });

      describe('when passed a objectTable', () => {
        it('should use that objectTable in the join', () => {
          const subject = 'User';
          const relType = 'hasMany';
          const object = 'Address';
          const objectTable = 'shipping_addresses';
          const result = relation({
            subject,
            relType,
            object,
            options: { objectTable },
          });
          assert.strictEqual(result.modelClass, 'Address');
          assert.deepStrictEqual(result.join, {
            from: 'users.id',
            to: 'shipping_addresses.user_id',
          });
          assert.strictEqual(result.relation.name, 'HasManyRelation');
        });
      });
    });
  });
});
