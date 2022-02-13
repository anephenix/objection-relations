const { getSubjectTable, getObjectTable, getSubjectForeignKey, getObjectForeignKey, belongsRelation, hasOneRelation, hasManyRelation, hasManyThroughRelation, relation } = require('../../src/index.ts');

describe('objection-relations', () => {

    describe('#belongsRelation', () => {
        test('should define a relationship where a record in one model can belong to a record in another model', () => {
            const subjectTable = 'posts';
            const objectTable = 'users';
            const object = 'User';
            const objectForeignKey = 'user_id';
            const result = belongsRelation({
                modelClass: object,
				from: `${subjectTable}.${objectForeignKey}`,
				to: `${objectTable}.id`
            });
            expect(result.modelClass).toEqual('User');
            expect(result.join).toEqual({ from: 'posts.user_id', to: 'users.id'});
            expect(result.relation.name).toBe('BelongsToOneRelation');
        });
    });

    describe('#hasOneRelation', () => {
        test('should define a relationship where a record in one model can own a record in another model', () => {
            const subjectTable = 'users';
            const objectTable = 'settings';
            const object = 'Setting';
            const subjectForeignKey = 'user_id';
            const result = hasOneRelation({
                modelClass: object,
				from: `${subjectTable}.id`,
				to: `${objectTable}.${subjectForeignKey}`
            });
            expect(result.modelClass).toEqual('Setting');
            expect(result.join).toEqual({ from: 'users.id', to: 'settings.user_id'});
            expect(result.relation.name).toBe('HasOneRelation');
        });
    });

    describe('#hasManyRelation', () => {
        test('should define a relationship where a record in one model can own many records in another model', () => {
            const subjectTable = 'users';
            const objectTable = 'addresses';
            const object = 'Address';
            const subjectForeignKey = 'user_id';
            const result = hasManyRelation({
                modelClass: object,
				from: `${subjectTable}.id`,
				to: `${objectTable}.${subjectForeignKey}`
            });
            expect(result.modelClass).toEqual('Address');
            expect(result.join).toEqual({ from: 'users.id', to: 'addresses.user_id'});
            expect(result.relation.name).toBe('HasManyRelation');
        });
    });

    describe('#hasManyThroughRelation', () => {
        test('should define a relationship where a record in one model can own many records in another model, via a join table', () => {
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
				to: `${objectTable}.id`
            });
            expect(result.modelClass).toEqual('Company');
            expect(result.join).toEqual({
                from: 'users.id',
                through: {
                    from: 'employments.user_id',
                    to: 'employments.company_id',
                },
                to: 'companies.id'
            });
            expect(result.relation.name).toBe('ManyToManyRelation');
        });
    });

    describe('#relation', () => {

        describe('when passed a relType of hasOne', () => {
            test('should return a relationship where a record in one model can own a record in another model', () => {
                const subject = 'User';
                const relType = 'hasOne';
                const object = 'Setting';
                const result = relation({subject, relType, object});
                expect(result.modelClass).toEqual('Setting');
                expect(result.join).toEqual({ from: 'users.id', to: 'settings.user_id'});
                expect(result.relation.name).toBe('HasOneRelation');
            });
        });

        describe('when passed a relType of hasMany', () => {
            test('should return a relationship where a record in one model can own many records in another model', () => {
                const subject = 'User';
                const relType = 'hasMany';
                const object = 'Address';
                const result = relation({subject, relType, object});
                expect(result.modelClass).toEqual('Address');
                expect(result.join).toEqual({ from: 'users.id', to: 'addresses.user_id'});
                expect(result.relation.name).toBe('HasManyRelation');                
            });
        });

        describe('when passed a relType of hasManyThrough', () => {
            test('should return a relationship where a record in one model can own many records in another model, via a join table', () => {
                const subject = 'User';
                const relType = 'hasManyThrough';
                const object = 'Company';
                const via = 'Employment';
                const result = relation({subject, relType, object, via});
                expect(result.modelClass).toEqual('Company');
                expect(result.join).toEqual({
                    from: 'users.id',
                    through: {
                        from: 'employments.user_id',
                        to: 'employments.company_id',
                    },
                    to: 'companies.id'
                });
                expect(result.relation.name).toBe('ManyToManyRelation');                
            });
        });

        describe('when passed a relType of belongsTo', () => {
            test('should return a relationship where a record in one model can belong to a record in another model', () => {
                const subject = 'Post';
                const relType = 'belongsTo';
                const object = 'User';
                const result = relation({subject, relType, object});
                expect(result.modelClass).toEqual('User');
                expect(result.join).toEqual({ from: 'posts.user_id', to: 'users.id'});
                expect(result.relation.name).toBe('BelongsToOneRelation');
            });
        });

        describe('when passed options', () => {

            describe('when passed a subjectTable', () => {
                test('should use that subjectTable in the join', () => {
                    const subject = 'User';
                    const relType = 'hasMany';
                    const object = 'Address';
                    const subjectTable = 'account_users';
                    const result = relation({subject, relType, object, options: { subjectTable }});
                    expect(result.modelClass).toEqual('Address');
                    expect(result.join).toEqual({ from: 'account_users.id', to: 'addresses.user_id'});
                    expect(result.relation.name).toBe('HasManyRelation');                    
                })
            });

            describe('when passed a objectTable', () => {
                test('should use that objectTable in the join', () => {
                    const subject = 'User';
                    const relType = 'hasMany';
                    const object = 'Address';
                    const objectTable = 'shipping_addresses';
                    const result = relation({subject, relType, object, options: { objectTable }});
                    expect(result.modelClass).toEqual('Address');
                    expect(result.join).toEqual({ from: 'users.id', to: 'shipping_addresses.user_id'});
                    expect(result.relation.name).toBe('HasManyRelation');                                        
                })
            });

        });

    });

    describe('#getSubjectTable', () => {

        describe('when passed a subjectTable in the options', () => {
            test('should return the subject table', () => {
                const result = getSubjectTable({
                    subject: 'User',
                    options: {
                        subjectTable: 'admin_users',
                    }
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
                    }
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
                    }
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
                    }
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

});