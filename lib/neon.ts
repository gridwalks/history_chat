import { neon } from '@neondatabase/serverless';

let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set');
  }
  
  if (!sqlInstance) {
    sqlInstance = neon(process.env.NEON_DATABASE_URL);
  }
  
  return sqlInstance;
}

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const instance = getSql();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

