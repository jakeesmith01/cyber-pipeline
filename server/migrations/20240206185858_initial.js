/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .hasTable('users')
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('users', function (table) {
          table.increments('id')
          table.string('eid', 20).unique().notNullable()
          table.string('name', 255).notNullable()
          table.string('refresh_token', 255)
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('roles'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('roles', function (table) {
          table.increments('id')
          table.string('name', 255).unique().notNullable()
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('user_roles'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('user_roles', function (table) {
          table
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
          table
            .integer('role_id')
            .unsigned()
            .references('id')
            .inTable('roles')
            .onDelete('CASCADE')
          table.primary(['user_id', 'role_id'])
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('districts'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('districts', function (table) {
          table.increments('id')
          table.string('name', 255).unique().notNullable()
          table.integer('usd').unsigned().nullable()
          table.string('url', 255)
          table.boolean('rural').defaultTo(false)
          table.boolean('urban').defaultTo(false)
          table.boolean('suburban').defaultTo(false)
          table.boolean('town').defaultTo(false)
          table.text('notes').nullable()
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('teachers'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('teachers', function (table) {
          table.increments('id')
          table.string('name', 255).notNullable()
          table.string('email', 255).notNullable()
          table.string('eid', 20)
          table.string('wid', 9)
          table.integer('status').defaultTo(0)
          table.integer('pd_status').defaultTo(0)
          table.integer('cert_status').defaultTo(0)
          table.integer('ms_status').defaultTo(0)
          table.string('grade_level', 255)
          table.integer('num_students').defaultTo(0)
          table.text('notes').nullable()
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('teacher_districts'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('teacher_districts', function (table) {
          table
            .integer('teacher_id')
            .unsigned()
            .references('id')
            .inTable('teachers')
            .onDelete('CASCADE')
          table
            .integer('district_id')
            .unsigned()
            .references('id')
            .inTable('districts')
            .onDelete('CASCADE')
          table.primary(['teacher_id', 'district_id'])
          table.text('notes').nullable()
          table.boolean('primary').defaultTo(false)
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('cohorts'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('cohorts', function (table) {
          table.increments('id')
          table.string('name', 255).notNullable()
          table.text('notes').nullable()
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('courses'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('courses', function (table) {
          table.increments('id')
          table.string('name', 255).notNullable()
          table.text('notes').nullable()
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('teacher_cohorts'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('teacher_cohorts', function (table) {
          table
            .integer('teacher_id')
            .unsigned()
            .references('id')
            .inTable('teachers')
            .onDelete('CASCADE')
          table
            .integer('cohort_id')
            .unsigned()
            .references('id')
            .inTable('cohorts')
            .onDelete('CASCADE')
          table.primary(['teacher_id', 'cohort_id'])
          table.text('notes').nullable()
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    .then(() => knex.schema.hasTable('teacher_courses'))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('teacher_courses', function (table) {
          table
            .integer('teacher_id')
            .unsigned()
            .references('id')
            .inTable('teachers')
            .onDelete('CASCADE')
          table
            .integer('course_id')
            .unsigned()
            .references('id')
            .inTable('courses')
            .onDelete('CASCADE')
          table.primary(['teacher_id', 'course_id'])
          table.boolean('incomplete').defaultTo(false)
          table.string('grade', 2).nullable()
          table.text('notes').nullable()
          table.timestamps()
          table.string('created_by', 20)
          table.string('updated_by', 20)
        });
      }
    })
    //.then(() => knex.schema.hasTable('emails'))
    //.then(exists => {
    //  if (!exists) {
    //   return knex.schema.createTable('emails', function (table) {
    //      table.increments('id')
    //      table.string('subject', 255).notNullable()
    //      table.text('email_body').notNullable()
    //      table.string('recipients').notNullable()
    //      table.int('status').defaultTo(0) // 0 for pending, 1 for sent, 2 for failed
    //      table.string('created_by', 20)
    //      table.timestamps()
    //    })
    //  }
    //})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists('teacher_courses')
    .dropTableIfExists('teacher_cohorts')
    .dropTableIfExists('courses')
    .dropTableIfExists('cohorts')
    .dropTableIfExists('teacher_districts')
    .dropTableIfExists('teachers')
    .dropTableIfExists('districts')
    .dropTableIfExists('user_roles')
    .dropTableIfExists('roles')
    .dropTableIfExists('users')
    //.dropTableIfExists('emails')
}