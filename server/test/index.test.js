import request from 'supertest';
import app from '../app.js';
import { describe, it, beforeAll, expect } from 'vitest';
import 'dotenv/config';
import db from '../configs/db.js';

let agent
const login = async (adminUser) => {
  agent = request.agent(app)
  await agent
    .get(`/auth/login?eid=${encodeURIComponent(adminUser.eid)}`)
    .redirects(1)
    .expect(200)

  const res = await agent.get('/auth/token').expect(200)
  console.log("🔍 Retrieved Token:", res.body.token)

  adminUser.token = res.body.token
  return agent
};

let AdminUser = {
  id: 2,
  eid: 'russfeld',
  name: 'Russel Feldhausen',
  is_admin: true,
  token: null,
}

beforeAll(async () => {
  await db.migrate.latest()
  await db.seed.run()
})


it('should return empty data for an unauthenticated user', async () => {
  const res = await request(app).get('/').expect(200);
  
  expect(res.text).toContain("{}"); 
})

describe('GET /', () => {
  it('should return the correct user data in the rendered HTML', async () => {
    agent = await login(AdminUser)
    const res = await agent
      .get('/')
      .expect(200)
      expect(res.text).toContain('&quot;id&quot;: 2')
      expect(res.text).toContain('&quot;eid&quot;: &quot;russfeld&quot;')
      expect(res.text).toContain('&quot;name&quot;: &quot;Russell Feldhausen&quot;')  
      expect(res.text).toContain('&quot;admin&quot;: true') 
  })
})  
