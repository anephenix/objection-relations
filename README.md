# objection-relations

A relations helper for Objection.js. This provides a convenient way to define
relations in the `relationMappings` function on an Objection.js model.

For example, say you have a table called "Persons" with this relation mapping:

```javascript
class Person extends Model {
  static get tableName() {
    return 'persons';
  }

  static get relationMappings() {
    return {
      addresses: {
        relation: Model.HasManyRelation,
        modelClass: Address,
        join: {
          from: 'persons.id',
          to: 'addresses.person_id',
        },
      },
    };
  }
}
```

You can use the objection-relations helper module to write the instead:

```javascript
import { relation } from '@anephenix/objection-relations';

class Person extends Model {
  static get tableName() {
    return 'persons';
  }

  static get relationMappings() {
    return {
      addresses: relation({
        subject: 'Person',
        relType: 'hasMany',
        object: 'Address',
      }),
    };
  }
}
```

The helper function will do the following:

- Setup the relation type from Objection.js (hasOne, hasMany, hasMnayThrough, belongsTo)
- Define the join table based on the properties of the subject and object
  models, if they follow a particular pattern (tables for models are named in
  plural format, and foreign keys use a singular format).

## Dependencies

- Node.js

## Install

```shell
npm i @anephenix/objection-relations
```

## Usage

You can setup different kinds of database table relationships like this:

### Belongs to

```javascript
relation({ subject: 'Post', relType: 'belongsTo', object: 'User' });
```

Is equivalent to writing:

```javascript
{
    relation: Model.BelongsToOneRelation,
    modelClass: User,
    join: {
        from: 'posts.user_id',
        to: 'users.id'
    }
}
```

### Has one

```javascript
relation({ subject: 'User', relType: 'hasOne', object: 'Setting' });
```

Is equivalent to writing:

```javascript
{
    relation: Model.HasOneRelation,
    modelClass: Setting,
    join: {
        from: 'users.id',
        to: 'settings.user_id'
    }
}
```

### Has many

```javascript
relation({ subject: 'User', relType: 'hasMany', object: 'Address' });
```

Is equivalent to writing:

```javascript
{
    relation: Model.HasManyRelation,
    modelClass: Address,
    join: {
        from: 'users.id',
        to: 'addresses.user_id'
    }
}
```

### Has many through

For relationships defined through a join table, you can write this:

```javascript
relation({
  subject: 'User',
  relType: 'hasManyThrough',
  object: 'Company',
  via: 'Employment',
});
```

This is equivalent to:

```javascript
{
    relation: Model.ManyToManyRelation,
    modelClass: Company,
    join: {
        from: 'users.id',
        through: {
            from: 'employments.user_id',
            to: 'employments.company_id'
        },
        to: 'companies.id'
    }
}
```

## Advanced usage

There might be cases where the name of the database tables and foreign keys are
following a different pattern from plural database tables and singular foreign
keys. In such cases you can define them in the options, like this:

### SubjectTable

Say a `User` model has many addresses, but the database table is called
'account_users', you can write this code:

```javascript
relation({
  subject: 'User',
  relType: 'hasMany',
  object: 'Address',
  options: { subjectTable: 'account_users' },
});
```

Which is equivalent to writing:

```javascript
{
    relation: Model.HasManyRelation,
    modelClass: Address,
    join: {
        from: 'account_users.id',
        to: 'addresses.user_id'
    }
}
```

### ObjectTable

The same applies for the object table. Say for example the `Address` model has
the database table 'shipping_addresses', you could write this:

```javascript
relation({
  subject: 'User',
  relType: 'hasMany',
  object: 'Address',
  options: { objectTable: 'shipping_addresses' },
});
```

Which is equivalent to writing:

```javascript
{
    relation: Model.HasManyRelation,
    modelClass: Address,
    join: {
        from: 'users.id',
        to: 'shipping_addresses.user_id'
    }
}
```

### SubjectForeignKey

If you find that the foreign key is not a singular form of the related model,
then you can pass a foreign key for the subject like this:

```javascript
relation({
  subject: 'User',
  relType: 'hasMany',
  object: 'Address',
  options: { subjectForeignKey: 'account_user_id' },
});
```

Which is equivalent to writing:

```javascript
{
    relation: Model.HasManyRelation,
    modelClass: Address,
    join: {
        from: 'users.id',
        to: 'addresses.account_user_id'
    }
}
```

### ObjectForeignKey

You can pass a custom foreign key for the object like this:

```javascript
relation({
  subject: 'Post',
  relType: 'belongsTo',
  object: 'User',
  options: { objectForeignKey: 'author_id' },
});
```

Is equivalent to writing:

```javascript
{
    relation: Model.BelongsToOneRelation,
    modelClass: User,
    join: {
        from: 'posts.author_id',
        to: 'users.id'
    }
}
```

## Tests

```shell
npm t
```

## Licence and credits

&copy;2022 Anephenix OÜ. Objection-relations is licenced under the MIT Licence.
