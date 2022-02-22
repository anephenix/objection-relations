# objection-relations

[![Node.js CI](https://github.com/anephenix/objection-relations/actions/workflows/node.js.yml/badge.svg)](https://github.com/anephenix/objection-relations/actions/workflows/node.js.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/33642d97558a57dc7c1d/maintainability)](https://codeclimate.com/github/anephenix/objection-relations/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/33642d97558a57dc7c1d/test_coverage)](https://codeclimate.com/github/anephenix/objection-relations/test_coverage)

A relations helper for Objection.js. This provides a convenient way to define
relations in the `relationMappings` function on an Objection.js model.

For example, say you have a table called "Users" with this relation mapping:

```javascript
class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    return {
      addresses: {
        relation: Model.HasManyRelation,
        modelClass: Address,
        join: {
          from: 'users.id',
          to: 'addresses.user_id',
        },
      },
    };
  }
}
```

You can use the objection-relations helper module to write the instead:

```javascript
import { ObjectionRelation } from '@anephenix/objection-relations';

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const or = new ObjectionRelation({
      subject: this.name,
      modelPath: __dirname,
    });
    return {
      addresses: or.hasMany('Address'),
    };
  }
}
```

The helper function will do the following:

- Setup the relation type from Objection.js (hasOne, hasMany, hasMnayThrough, belongsTo)
- Define the join table based on the properties of the subject and object
  models, if they follow a particular pattern (tables for models are named in
  plural format, and foreign keys use a singular format). e.g.

| Model | table name | foreign key |
| ----- | ---------- | ----------- |
| User  | users      | user_id     |

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
or.belongsTo('Role');
```

Is equivalent to writing:

```javascript
{
    relation: Model.BelongsToOneRelation,
    modelClass: 'Role',
    join: {
        from: 'users.role_id',
        to: 'roles.id'
    }
}
```

### Has one

```javascript
or.hasOne('Setting');
```

Is equivalent to writing:

```javascript
{
    relation: Model.HasOneRelation,
    modelClass: 'Setting',
    join: {
        from: 'users.id',
        to: 'settings.user_id'
    }
}
```

### Has many

```javascript
or.hasMany('Address');
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
or.hasManyThrough('Company', 'Employment');
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
or.hasMany('Address', { subjectTable: 'account_users' });
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
or.hasMany('Address', { objectTable: 'shipping_addresses' });
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
or.hasMany('Address', { subjectForeignKey: 'account_user_id' });
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

You can pass a custom foreign key for the object (Like a Post model) like this:

```javascript
or.belongsTo('User', { objectForeignKey: 'author_id' });
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
