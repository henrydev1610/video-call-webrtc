# Dockerfile para aplicação de vídeo WebRTC
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json do servidor
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Instalar dependências
RUN cd server && npm ci --only=production
RUN cd client && npm ci

# Copiar código fonte
COPY server/ ./server/
COPY client/ ./client/

# Build do cliente React
RUN cd client && npm run build

# Criar pasta public no servidor e copiar build
RUN mkdir -p server/public
RUN cp -r client/dist/* server/public/

# Definir diretório de trabalho para o servidor
WORKDIR /app/server

# Expor porta
EXPOSE 3001

# Comando para iniciar aplicação
CMD ["npm", "start"]