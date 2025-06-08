/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
  return knex.schema.table('courses',  function(table){
    table.integer('course_id').notNullable().defaultTo(0)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down (knex) {
    return knex.schema.table('courses', function(table){
        table.dropColumn('course_id')
    })
};
