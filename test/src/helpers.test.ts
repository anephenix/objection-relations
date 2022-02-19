import {
  getSubjectTable,
  getObjectTable,
  getSubjectForeignKey,
  getObjectForeignKey,
  getModelClass,
  getViaTable,
} from '../../src/helpers';

describe('helpers', () => {
  describe('#getSubjectTable', () => {
    describe('when passed a subjectTable in the options', () => {
      test('should return the subject table', () => {
        const result = getSubjectTable({
          subject: 'User',
          options: {
            subjectTable: 'admin_users',
          },
        });
        expect(result).toBe('admin_users');
      });
    });

    describe('when not passed a subjectTable in the options', () => {
      test('should return the plural version of the subject model', () => {
        const result = getSubjectTable({
          subject: 'User',
        });
        expect(result).toBe('users');
        const anotherResult = getSubjectTable({
          subject: 'AdminUser',
        });
        expect(anotherResult).toBe('admin_users');
      });
    });
  });

  describe('#getObjectTable', () => {
    describe('when passed an objectTable in the options', () => {
      test('should return the object table', () => {
        const result = getObjectTable({
          object: 'Post',
          options: {
            objectTable: 'admin_posts',
          },
        });
        expect(result).toBe('admin_posts');
      });
    });

    describe('when not passed an objectTable in the options', () => {
      test('should return the plural version of the object model', () => {
        const result = getObjectTable({
          object: 'Post',
        });
        expect(result).toBe('posts');
        const anotherResult = getObjectTable({
          object: 'UserPost',
        });
        expect(anotherResult).toBe('user_posts');
      });
    });
  });

  describe('#getSubjectForeignKey', () => {
    describe('when passed a subjectForeignKey in the options', () => {
      test('should return the subject foreign key', () => {
        const result = getSubjectForeignKey({
          subject: 'User',
          options: {
            subjectForeignKey: 'admin_user_id',
          },
        });
        expect(result).toBe('admin_user_id');
      });
    });

    describe('when not passed a subjectForeignKey in the options', () => {
      test('should return a generated subjectForeignKey based on the object model', () => {
        const result = getSubjectForeignKey({
          subject: 'User',
        });
        expect(result).toBe('user_id');
        const anotherResult = getSubjectForeignKey({
          subject: 'AdminUser',
        });
        expect(anotherResult).toBe('admin_user_id');
      });
    });
  });

  describe('#getObjectForeignKey', () => {
    describe('when passed an objectForeignKey in the options', () => {
      test('should return the object foreign key', () => {
        const result = getObjectForeignKey({
          object: 'Post',
          options: {
            objectForeignKey: 'admin_post_id',
          },
        });
        expect(result).toBe('admin_post_id');
      });
    });

    describe('when not passed an objectForeignKey in the options', () => {
      test('should return a generated objectForeignKey based on the object model', () => {
        const result = getObjectForeignKey({
          object: 'Post',
        });
        expect(result).toBe('post_id');
        const anotherResult = getObjectForeignKey({
          object: 'UserPost',
        });
        expect(anotherResult).toBe('user_post_id');
      });
    });
  });

  describe('#getModelClass', () => {
    describe('when passed a modelPath in the options', () => {
      test('should return the model path', () => {
        const result = getModelClass({
          object: 'Post',
          options: {
            modelPath: 'admin/models',
          },
        });
        expect(result).toBe('admin/models/Post');
      });
    });

    describe('when not passed a modelPath in the options', () => {
      test('should return the object model', () => {
        const result = getModelClass({
          object: 'Post',
        });
        expect(result).toBe('Post');
      });
    });
  });

  describe('#getViaTable', () => {
    describe('when passed a viaTable in the options', () => {
      test('should return the via table', () => {
        const result = getViaTable('User');
        expect(result).toBe('users');
      });
    });

    describe('when not passed a viaTable in the options', () => {
      test('should return a generated via table based on the subject and object models', () => {
        const result = getViaTable(undefined);
        expect(result).toBe(null);
      });
    });
  });
});
