import express, {Express, Request, Response} from "express"
import cors from "cors"
import {HTTP_CODES, SETTINGS} from "./settings"
import {postsRouter} from "./features/posts"
import {blogsRouter} from "./features/blogs"
import {usersRouter} from "./features/users"
import {testingRouter} from "./features/testing"
import {authRouter} from "./features/auth"

const app: Express = express()

app.use(express.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_CODES.OK).send({version: '1.0'})
})

app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)


export default app