import Groq from 'groq-sdk';

let groqInstance: Groq | null = null;

export function getGroq() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set');
  }
  
  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  
  return groqInstance;
}

// For backward compatibility
export const groq = new Proxy({} as Groq, {
  get(_target, prop) {
    const instance = getGroq();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

