/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema.alterTable('teacher_courses', function (table) {
    table.integer('status').unsigned().defaultTo(0)
    table.dropColumn('incomplete')
    table.dropColumn('grade')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
  return knex.schema.alterTable('teacher_courses', function (table) {
    table.dropColumn('status')
    table.boolean('incomplete').defaultTo(false)
    table.string('grade', 2).nullable()
  })
}
