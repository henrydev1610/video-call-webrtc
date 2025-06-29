# 🎥 Aplicação de Chamada de Vídeo WebRTC

Uma aplicação completa de chamada de vídeo em tempo real onde usuários podem escanear um QR code com o celular para iniciar a transmissão da câmera do dispositivo móvel. O vídeo é exibido em tempo real em um painel no computador.

## 🚀 Tecnologias Utilizadas

### Front-end
- **React 18** com Vite
- **WebRTC** para transmissão de vídeo/áudio
- **Socket.io-client** para comunicação em tempo real
- **qrcode.react** para geração de QR codes
- Hooks modernos (useEffect, useState, useRef, etc.)

### Back-end
- **Node.js** com Express
- **Socket.io** para servidor de sinalização WebSocket
- **QRCode** para geração de QR codes
- **CORS** para permitir conexões cross-origin

### Protocolos
- **WebRTC** para transmissão peer-to-peer
- **WebSocket** para sinalização
- **STUN** server público (stun.l.google.com:19302)

## 📁 Estrutura do Projeto

```
hutz-project/
├── client/                 # Aplicação React (Desktop)
│   ├── src/
│   │   ├── components/
│   │   │   ├── QRCodeGenerator.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── hooks/
│   │   │   └── useWebRTC.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/                 # Servidor Node.js
│   ├── src/
│   │   └── server.js
│   └── package.json
└── README.md
```

## 🛠️ Instalação e Execução

### 1. Instalar Dependências

```bash
# Instalar dependências do servidor
cd server
npm install

# Instalar dependências do cliente
cd ../client
npm install
```

### 2. Executar a Aplicação

**Terminal 1 - Servidor:**
```bash
cd server
npm start
```
O servidor estará rodando em: `http://localhost:3001`

**Terminal 2 - Cliente:**
```bash
cd client
npm run dev
```
O cliente estará rodando em: `http://localhost:3000`

## 📱 Como Usar

1. **Abra o desktop**: Acesse `http://localhost:3000` no seu computador
2. **Crie uma sala**: Clique em "Criar Nova Sala" ou digite um ID personalizado
3. **Escaneie o QR code**: Use a câmera do seu celular para escanear o código
4. **Permita acesso**: Autorize o uso da câmera e microfone no dispositivo móvel
5. **Transmita**: O vídeo aparecerá automaticamente na tela do desktop

## 🎯 Funcionalidades

### Desktop (React)
- ✅ Geração de QR codes dinâmicos
- ✅ Interface para visualização de vídeo em tempo real
- ✅ Gerenciamento de salas personalizadas
- ✅ Status de conexão em tempo real
- ✅ Tratamento robusto de erros
- ✅ Design responsivo

### Mobile (Interface Web)
- ✅ Captura de vídeo e áudio
- ✅ Transmissão WebRTC otimizada
- ✅ Interface touch-friendly
- ✅ Detecção automática de dispositivo móvel
- ✅ Controles de início/parada da câmera

### Servidor
- ✅ Sinalização WebSocket com Socket.io
- ✅ Gerenciamento de salas dinâmicas
- ✅ Troca de ofertas/respostas WebRTC
- ✅ Relay de ICE candidates
- ✅ Logs detalhados para debug

## 🔧 Configuração Avançada

### Variáveis de Ambiente

**Server:**
```bash
PORT=3001  # Porta do servidor
```

**Client:**
- O Vite usa `http://localhost:3000` por padrão
- Para produção, configure o `serverUrl` no componente App.jsx

### Rede Local/Remota

Para usar em rede local, substitua `localhost` pelo IP da máquina:

```javascript
// client/src/App.jsx
<QRCodeGenerator 
  serverUrl="http://192.168.1.100:3001"  // IP da sua máquina
/>
```

### HTTPS (Produção)

WebRTC requer HTTPS em produção. Configure certificados SSL:

```javascript
// server/src/server.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

const server = https.createServer(options, app);
```

## 🐛 Troubleshooting

### Problemas Comuns

**1. Câmera não funciona no celular:**
- Verifique se o site tem permissão para acessar câmera
- Use HTTPS em produção
- Teste em diferentes browsers (Chrome recomendado)

**2. Conexão WebRTC falha:**
- Verifique firewall/NAT
- Confirme se STUN server está acessível
- Para redes complexas, considere usar TURN server

**3. QR code não carrega:**
- Verifique se o servidor está rodando
- Confirme conectividade de rede
- Veja logs do servidor para erros

### Logs de Debug

O sistema inclui logs detalhados:

- **Servidor**: Console do Node.js
- **Desktop**: DevTools do browser (F12)
- **Mobile**: Console mobile ou debug remoto

## 📦 Dependências

### Client
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "qrcode.react": "^3.1.0",
  "socket.io-client": "^4.7.2"
}
```

### Server
```json
{
  "express": "^4.18.2",
  "socket.io": "^4.7.2",
  "cors": "^2.8.5",
  "qrcode": "^1.5.3"
}
```

## 🎨 Personalização

### Estilos CSS
Edite `client/src/index.css` para customizar:
- Cores e temas
- Layout responsivo
- Animações

### Configurações WebRTC
Modifique `client/src/hooks/useWebRTC.js`:
- Servidores STUN/TURN
- Qualidade de vídeo
- Codecs de áudio/vídeo

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte os logs de debug
- Verifique a documentação do WebRTC

---

**Desenvolvido com ❤️ usando WebRTC e React**