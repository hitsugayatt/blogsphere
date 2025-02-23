import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string;
    JWT_SECRET : string;
  }
}>()

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

app.get('/', (c) =>{
  return c.text('Hello Hono landing!')
})

export default app


// postgresql://neondb_owner:npg_OBSIynNvML16@ep-soft-shadow-a8dsvkqy-pooler.eastus2.azure.neon.tech/neondb?sslmode=require


// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNDBiN2MyZGItM2JhNy00NjYxLTg2MjMtN2UwYzQ4MDZhMzY1IiwidGVuYW50X2lkIjoiYTE0NDFjYWIyZDQyMTViNmY1MGYyYmMyZjMyNDc1ZDc2NTRkMzk0YWRkOGIwMGZmMWQyNDM4OTE0MjE2YmU1MyIsImludGVybmFsX3NlY3JldCI6ImJhMzljZDU1LTE5ZGMtNDlmNy04OTViLWJmODhhYzI4MGYyYiJ9.jEKiQoD_A1Ab_4qydLy5k7dV5bFJ9cbadvWxGNj8Kt8"

// DIRECT_URL="<YOUR_DATABASE_CONNECTION_STRING>"