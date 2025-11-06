import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { prisma } from '../../src/lib/prisma'

import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>(<unknown>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Setup logic before tests run (e.g., migrate database, seed data)
    // Criar o banco de testes
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    console.log('DATABASE_URL:', databaseUrl)

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // Teardown logic after tests complete (e.g., clean up database)
        // Apagar o banco de testes
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
        )

        await prisma.$disconnect()
      },
    }
  },
})
