import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import {createBlogInput, updateBlogInput} from '@hitsugaya/blogsite-common'
export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string;
      JWT_SECRET : string;
    },
    Variables: {
        userId : string;
    }
}>()

blogRouter.use('/*', async (c, next)=>{
    const authHeader = c.req.header('authorization') || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if(user) {
        c.set("userId", String(user.id));
        // console.log('hi there im middleware');
        await next();
    } else {
        c.status(403);
        return c.json({
            message : "You are not logged in"
        })
    }
    
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get('userId')
    const {success} = createBlogInput.safeParse(body);
      if(!success) {
        c.status(411);
        return c.json({
          message: "Inputs are not correct"
        })
      }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    await prisma.blog.create({
        data : {
            title : body.title,
            content : body.content,
            authorId : authorId
        }
    })
    return c.text('blog created');
})
  
blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
      if(!success) {
        c.status(411);
        return c.json({
          message: "Inputs are not correct"
        })
      }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data : {
            title : body.title,
            content : body.content
        }
    })
    return c.json({
        id: blog.id
    })
})

// Todo : Add pagination

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany({
        select : {
            content : true,
            title : true,
            id : true,
            author : {
                select : {
                    name : true, 
                }
            }
        }
    });
    return c.json({
        blogs
    })
})
  
blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const blog = await prisma.blog.findFirst({
            where: {
                id: id
            },
            select : {
                id : true,
                title : true,
                content : true,
                author : {
                    select : {
                        name : true,
                    }
                }
            }
        });
        return c.json({
            blog
        })
    } catch (e) {
        c.status(411);
        return c.json({
            message : "Error while fetching blog post"
        })
    }
})