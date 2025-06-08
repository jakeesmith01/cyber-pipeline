/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
  return knex.schema.table('teachers', function(table) {
    table.boolean('email_opt_out').defaultTo(false)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down (knex) {
  return knex.schema.table('teachers', function(table){
    table.dropColumn('email_opt_out')
  })
};
