#!/bin/bash

echo "🚀 Iniciando servidor de desenvolvimento..."

# Iniciar servidor em background
cd server
node src/server.js &
SERVER_PID=$!

# Aguardar um pouco para o servidor iniciar
sleep 3

# Iniciar cliente em background
cd ../client
npm run dev &
CLIENT_PID=$!

echo "✅ Servidor iniciado com PID: $SERVER_PID"
echo "✅ Cliente iniciado com PID: $CLIENT_PID"
echo ""
echo "🌐 Acesse: http://172.26.204.230:3000"
echo "🖥️  Servidor: http://172.26.204.230:3001"
echo ""
echo "Para parar os serviços: kill $SERVER_PID $CLIENT_PID"

# Aguardar por entrada do usuário para parar
echo "Pressione qualquer tecla para parar os serviços..."
read -n 1 -s

echo "🛑 Parando serviços..."
kill $SERVER_PID $CLIENT_PID 2>/dev/null || true
echo "✅ Serviços parados"