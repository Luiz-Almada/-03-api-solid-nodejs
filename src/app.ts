import fastify from 'fastify'
import { appRoutes } from './http/routes'
import z, { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: z.treeifyError(error),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // Registrar o log do erro em alguma ferramenta de monitoramento e observabilidade
    // TODO: Here we should log to an external tool like DataDog, NewRelic, Sentry, etc...
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
