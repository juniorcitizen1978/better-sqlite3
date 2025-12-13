import betterSqlite3 from 'better-sqlite3'
import * as path from 'node:path'

let connection: betterSqlite3.Database | undefined = undefined

export function connect(filePath?: string): void {
  if (!connection) {
    if (filePath && !path.isAbsolute(filePath)) {
      throw new Error('database file path must be absolute')
    }
    connection = new betterSqlite3(filePath || ':memory:')
    if (filePath) {
      connection.exec('PRAGMA journal_mode = WAL;')
    }
  }
}

export function getConnection(): betterSqlite3.Database | undefined {
  return connection
}

export function disconnect(): void {
  if (connection) {
    connection.close()
    connection = undefined
  }
}
