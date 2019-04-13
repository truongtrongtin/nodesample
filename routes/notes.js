const Router = require('koa-router')
const jwt = require('../middleware/jwt')
const logger = require('../config/log')

const NoteController = require('../controllers/NoteController')

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const noteController = new NoteController()

router.get('/api/v1/notes', jwtMiddleware, async (ctx, next) => {
  await noteController.index(ctx)
})

router.post('/api/v1/notes', jwtMiddleware, async (ctx, next) => {
  await noteController.create(ctx)
})

router.get('/api/v1/notes/:id', jwtMiddleware, async (ctx, next) => {
  await noteController.show(ctx)
})

router.put('/api/v1/notes/:id', jwtMiddleware, async (ctx, next) => {
  await noteController.update(ctx)
})

router.delete('/api/v1/notes/:id', jwtMiddleware, async (ctx, next) => {
  await noteController.delete(ctx)
})

module.exports = router
