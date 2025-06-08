import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage()

/* Store User eID in Async Storage for DB Operations */
async function dbAudit(req, res, next) {
  asyncLocalStorage.run(req.user_eid, () => {
    next()
  })
}

export { dbAudit, asyncLocalStorage }
