import { ConnectionPool, config } from 'mssql';

const sqlConfig: config = {
  user: 'it3681-03-admin',
  password: 'P@ssw0rd123',
  database: 'it3681database03',
  server: 'it3681sqlserver03.database.windows.net',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

let pool: ConnectionPool | null = null;

export const getConnectionPool = async (): Promise<ConnectionPool> => {
  if (!pool) {
    pool = await new ConnectionPool(sqlConfig).connect().catch((err: any) => {
      console.error('Database connection failed', err);
      pool = null;
      throw err;
    });
  }
  return pool;
};
