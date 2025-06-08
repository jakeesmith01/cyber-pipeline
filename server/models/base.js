import db from '../configs/db.js'
import { Model } from 'objection'
import { AjvValidator } from 'objection'
import addFormats from 'ajv-formats'
import { asyncLocalStorage } from '../middlewares/db-audit.js'

Model.knex(db)

class BaseModel extends Model {
  $beforeInsert() {
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const eid = asyncLocalStorage.getStore()
    this.created_by = eid !== undefined ? eid : 'system'
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const eid = asyncLocalStorage.getStore()
    this.updated_by = eid !== undefined ? eid : 'system'
  }

  static get useLimitInFirst() {
    return true
  }

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv)
      },
      options: {
        coerceTypes: true,
      },
      /* options: {
				allErrors: true,
				validateSchema: false,
				ownProperties: true,
				v5: true,
			}, */
    })
  }
}

export default BaseModel