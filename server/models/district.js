const Model = require('./base')

class District extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'districts'
  }

  // Each model must have a column (or a set of columns) that uniquely
  // identifies the rows. The column(s) can be specified using the `idColumn`
  // property. `idColumn` returns `id` by default and doesn't need to be
  // specified unless the model's primary key is something else.
  static get idColumn() {
    return 'id'
  }

  // Methods can be defined for model classes just as you would for
  // any JavaScript class. If you want to include the result of these
  // methods in the output json, see `virtualAttributes`.
  //fullName() {
  //  return this.firstName + ' ' + this.lastName;
  //}

  // Optional JSON schema. This is not the database schema!
  // No tables or columns are generated based on this. This is only
  // used for input validation. Whenever a model instance is created
  // either explicitly or implicitly it is checked against this schema.
  // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  static get virtualAttributes() {
    return ['usdName'];
  }

  usdName() {
    return `${this.usd} - ${this.name}`;
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    const Teacher = require('./teacher')

    return {
      teachers: {
        relation: Model.ManyToManyRelation,
        modelClass: Teacher,
        join: {
          from: 'districts.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'teacher_districts.district_id',
            to: 'teacher_districts.teacher_id',
          },
          to: 'teachers.id',
        },
      },
    }
  }
}

module.exports = District
