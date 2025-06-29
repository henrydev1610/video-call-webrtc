# 📱 Configuração para Acesso pelo Celular

## ✅ Configurações Aplicadas:

### 🔧 Servidor (Node.js)
- **IP configurado**: `172.26.204.230`
- **Porta**: `3001`
- **Binding**: `0.0.0.0` (aceita conexões de qualquer IP)

### 🌐 Cliente (React)
- **IP configurado**: `172.26.204.230`
- **Porta**: `3000`
- **Host**: `0.0.0.0` (aceita conexões de qualquer IP)

## 🚀 Como Executar:

### 1. Instalar Dependências (se ainda não instalou):
```bash
# Servidor
cd server
npm install

# Cliente
cd ../client
npm install
```

### 2. Executar o Servidor:
```bash
cd server
npm start
```
**Resultado esperado:**
```
🚀 Servidor rodando em http://172.26.204.230:3001
📱 Para gerar QR code: GET /qr/{roomId}
🖥️  Para acessar mobile: GET /mobile/{roomId}
🔧 Salas ativas: 0
📱 Acesse do seu celular: http://172.26.204.230:3001
```

### 3. Executar o Cliente:
```bash
cd client
npm run dev
```
**Resultado esperado:**
```
Local:   http://localhost:3000/
Network: http://172.26.204.230:3000/
```

## 📱 Testando no Celular:

### Opção 1: Usar o QR Code (Recomendado)
1. Abra **http://172.26.204.230:3000** no seu desktop
2. Clique em "Criar Nova Sala"
3. Escaneie o QR Code com seu celular
4. Autorize câmera e microfone
5. Clique em "Iniciar Câmera"

### Opção 2: Acesso Direto pelo Celular
1. Abra **http://172.26.204.230:3001/mobile/TESTE** no browser do celular
2. Substitua "TESTE" por qualquer ID de sala
3. Autorize câmera e microfone
4. Clique em "Iniciar Câmera"

## 🔍 Verificação de Conectividade:

### Teste 1: Ping da Rede
```bash
# No computador, verifique se o celular consegue pingar
ping 172.26.204.230
```

### Teste 2: Acesso HTTP Básico
- No celular, acesse **http://172.26.204.230:3001**
- Deve mostrar uma página de erro 404 (normal, significa que o servidor está rodando)

### Teste 3: Verificar Porta
```bash
# No computador, verifique se as portas estão abertas
netstat -an | grep 3001
netstat -an | grep 3000
```

## 🛠️ Troubleshooting:

### Problema: "Não consigo acessar pelo celular"
**Soluções:**
1. Verifique se ambos dispositivos estão na **mesma rede WiFi**
2. Desative firewall temporariamente
3. Reinicie o servidor e cliente
4. Verifique se o IP ainda é `172.26.204.230`:
   ```bash
   hostname -I | awk '{print $1}'
   ```

### Problema: "QR Code não funciona"
**Soluções:**
1. Certifique-se que o servidor está rodando primeiro
2. Aguarde alguns segundos após iniciar o servidor
3. Recarregue a página do desktop
4. Use um leitor de QR Code diferente

### Problema: "Câmera não funciona no celular"
**Soluções:**
1. Use **Chrome** ou **Safari** no celular
2. Permita acesso à câmera e microfone
3. Verifique se o site não está bloqueado
4. Teste em modo anônimo/privado

### Problema: "Conexão WebRTC falha"
**Soluções:**
1. Verifique os logs do servidor
2. Abra DevTools no celular (Chrome: chrome://inspect)
3. Verifique se o STUN server está acessível
4. Teste com diferentes navegadores

## 🔐 Segurança:

⚠️ **Importante**: Este setup é para rede local. Para uso em produção:
1. Use HTTPS (WebRTC exige em produção)
2. Configure firewall adequadamente
3. Use autenticação de salas
4. Considere usar TURN server para NAT traversal

## 📊 Monitoramento:

### Logs do Servidor:
- Conexões de clientes
- Criação/destruição de salas
- Troca de mensagens WebRTC

### Logs do Cliente:
- Abra DevTools (F12) no desktop
- Abra DevTools no celular para debug móvel

### Status da Conexão:
- **Aguardando**: Sala criada, esperando celular
- **Conectando**: Celular conectou, estabelecendo WebRTC
- **Conectado**: Vídeo transmitindo com sucesso
- **Erro**: Algo deu errado, verifique logs

---

**✅ Tudo configurado! Agora seu celular pode se conectar usando o IP 172.26.204.230**