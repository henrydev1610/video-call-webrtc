// Configuração de ambiente
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// URLs do servidor baseadas no ambiente
export const SERVER_URL = isDevelopment 
  ? 'http://172.26.204.230:3001' 
  : window.location.origin;

export const WS_URL = SERVER_URL;

console.log('Ambiente:', isDevelopment ? 'Desenvolvimento' : 'Produção');
console.log('Server URL:', SERVER_URL);
console.log('WebSocket URL:', WS_URL);