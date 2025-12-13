import betterSqlite3 from 'better-sqlite3'
import * as path from 'node:path'

const connections = new Map<string, betterSqlite3.Database>()

export function connect(connectionName: string, filePath?: string): void {
  if (!connections.has(connectionName)) {
    if (filePath && !path.isAbsolute(filePath)) {
      throw new Error('database file path must be absolute')
    }
    const connection = new betterSqlite3(filePath || ':memory:')
    if (filePath) {
      connection.exec('PRAGMA journal_mode = WAL;')
    }
    connections.set(connectionName, connection)
  }
}

export function getConnection(
  connectionName: string
): betterSqlite3.Database | undefined {
  return connections.get(connectionName)
}

export function disconnect(connectionName: string): void {
  const connection = connections.get(connectionName)
  if (connection) {
    connection.close()
    connections.delete(connectionName)
  }
}

export function disconnectAll(): void {
  for (const connection of connections.values()) {
    connection.close()
  }
  connections.clear()
}
