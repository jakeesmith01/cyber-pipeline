/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
  return knex.schema.table('courses', function(table) {
    table.string('academic_year').notNullable().defaultTo('NOT DEFINED')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down (knex) {
  return knex.schema.table('courses', function(table){
    table.dropColumn('academic_year')
  })
};
