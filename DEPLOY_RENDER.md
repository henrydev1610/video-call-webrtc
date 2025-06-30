# Deploy no Render - Instruções Completas

## 🚀 Alterações Implementadas

### ✅ Preparação para Deploy Concluída

O projeto foi completamente preparado para deploy no Render com as seguintes correções:

1. **URLs Dinâmicas**: Configuração automática para desenvolvimento/produção
2. **Socket.io Otimizado**: Transporte WebSocket priorizado
3. **Logs de Debug**: Sistema completo de monitoramento
4. **Configuração de Produção**: Variáveis de ambiente configuradas
5. **Build Automatizado**: Script de build no `render.yaml`

### 📁 Arquivos Modificados

- `client/src/config/environment.js` - URLs dinâmicas
- `client/src/hooks/useWebRTC.js` - Socket.io otimizado 
- `server/src/server.js` - Configuração de produção
- `render.yaml` - Configuração de deploy
- `TESTE.md` - Documentação de teste
- `start-dev.sh` - Script de desenvolvimento

## 🔧 Como Fazer o Deploy no Render

### 1. Acesse o Render Dashboard
- Vá para [render.com](https://render.com)
- Faça login na sua conta

### 2. Conecte o Repositório
- Clique em "New +" > "Web Service"
- Conecte seu repositório GitHub: `henrydev1610/video-call-webrtc`
- Selecione a branch `main`

### 3. Configure o Serviço
```
Name: video-call-webrtc
Environment: Node
Branch: main
Build Command: (deixe vazio - usar render.yaml)
Start Command: (deixe vazio - usar render.yaml)
```

### 4. Variáveis de Ambiente
```
NODE_ENV=production
```

### 5. Deploy Automático
- O Render detectará o arquivo `render.yaml`
- O build será executado automaticamente:
  1. Install client dependencies
  2. Build client (React/Vite)
  3. Install server dependencies  
  4. Copy client build to server/public
  5. Start server

## 🌐 URLs Após Deploy

- **Aplicação Principal**: `https://[seu-app-name].onrender.com`
- **QR Code**: `https://[seu-app-name].onrender.com/qr/[roomId]`
- **Mobile**: `https://[seu-app-name].onrender.com/mobile/[roomId]`

## 📱 Como Testar a Aplicação

### 1. Acesse a URL do Render
- Abra a URL fornecida pelo Render
- Insira um ID de sala (ex: "sala123")
- Clique em "Gerar QR Code"

### 2. Conecte o Celular
- Escaneie o QR Code com o celular
- Toque em "Iniciar Câmera"
- Permita acesso à câmera e microfone

### 3. Verifique a Conexão
- O vídeo deve aparecer no desktop
- Status deve mostrar "Conectado"
- Logs detalhados no console

## 🐛 Troubleshooting

### Se o deploy falhar:
1. Verifique os logs do Render
2. Confirme que o `render.yaml` está correto
3. Verifique se todas as dependências estão no `package.json`

### Se a conexão falhar:
1. Verifique console do navegador (F12)
2. Confirme que HTTPS está funcionando
3. Teste com diferentes navegadores/dispositivos

## 📊 Monitoramento

### Logs Disponíveis:
- **Build Logs**: Durante o deploy
- **Application Logs**: Durante execução
- **Browser Console**: Debug detalhado

### Indicadores de Sucesso:
```
✅ Cliente conectado: [socket-id] Transport: websocket
✅ Sala [roomId] completa: desktop e mobile conectados
✅ WebRTC conexão estabelecida com sucesso!
```

## 🔄 Atualizações Futuras

Para atualizar a aplicação:
1. Faça alterações no código
2. Commit e push para o repositório
3. O Render fará redeploy automático

## 📝 Commit Realizado

```
Fix WebRTC connection issues and prepare for Render deployment

- Update environment config to use dynamic URLs for production
- Optimize Socket.io transport order (WebSocket first) 
- Add comprehensive debug logging for connection troubleshooting
- Implement production-ready server configuration
- Add development testing scripts and documentation
- Fix mobile client Socket.io configuration
- Enhance connection state monitoring and error handling
```

**Status**: ✅ Pronto para deploy no Render
**Repositório**: https://github.com/henrydev1610/video-call-webrtc.git
**Branch**: main (atualizada)