const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);

// Configuração do CORS para permitir conexões do cliente
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// Configuração do Socket.io com CORS
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3001;

// Armazenar conexões ativas
const rooms = new Map();

// Endpoint para gerar QR code
app.get('/qr/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const mobileUrl = `${req.protocol}://${req.get('host')}/mobile/${roomId}`;
    
    console.log(`Gerando QR code para sala: ${roomId}`);
    console.log(`URL mobile: ${mobileUrl}`);
    
    const qrCodeDataURL = await QRCode.toDataURL(mobileUrl);
    res.json({ qrCode: qrCodeDataURL, mobileUrl });
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    res.status(500).json({ error: 'Erro ao gerar QR code' });
  }
});

// Página para dispositivo móvel
app.get('/mobile/:roomId', (req, res) => {
  const { roomId } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Câmera Móvel - Sala ${roomId}</title>
        <style>
            body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                background: #1a1a1a;
                color: white;
                text-align: center;
            }
            #localVideo {
                width: 100%;
                max-width: 400px;
                height: auto;
                border-radius: 10px;
                margin: 20px 0;
            }
            .status {
                margin: 10px 0;
                padding: 10px;
                border-radius: 5px;
                background: #333;
            }
            .connected { background: #2d5a2d; }
            .error { background: #5a2d2d; }
            button {
                background: #007bff;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                margin: 10px;
            }
            button:hover { background: #0056b3; }
            button:disabled { background: #666; cursor: not-allowed; }
        </style>
    </head>
    <body>
        <h1>Câmera Móvel</h1>
        <div id="status" class="status">Inicializando...</div>
        <video id="localVideo" autoplay muted playsinline></video>
        <button id="startBtn" onclick="startCamera()">Iniciar Câmera</button>
        <button id="stopBtn" onclick="stopCamera()" disabled>Parar Câmera</button>
        
        <script src="/socket.io/socket.io.js"></script>
        <script>
            const roomId = '${roomId}';
            console.log('Inicializando cliente móvel para sala:', roomId);
            const socket = io({
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: true
            });
            const localVideo = document.getElementById('localVideo');
            const statusDiv = document.getElementById('status');
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            
            let localStream;
            let pc;
            
            // Configuração WebRTC com TURN servers para produção
            const pcConfig = {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                    {
                        urls: 'turn:openrelay.metered.ca:80',
                        username: 'openrelayproject',
                        credential: 'openrelayproject'
                    },
                    {
                        urls: 'turn:openrelay.metered.ca:443',
                        username: 'openrelayproject',
                        credential: 'openrelayproject'
                    }
                ],
                iceCandidatePoolSize: 10
            };
            
            function updateStatus(message, type = '') {
                statusDiv.textContent = message;
                statusDiv.className = 'status ' + type;
                console.log('Status:', message);
            }
            
            async function startCamera() {
                try {
                    updateStatus('Solicitando acesso à câmera...');
                    
                    localStream = await navigator.mediaDevices.getUserMedia({
                        video: { 
                            facingMode: 'environment', // Câmera traseira preferida
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        },
                        audio: true
                    });
                    
                    localVideo.srcObject = localStream;
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                    
                    updateStatus('Câmera ativada. Conectando...', 'connected');
                    
                    // Iniciar conexão WebRTC
                    initWebRTC();
                    
                } catch (error) {
                    console.error('Erro ao acessar câmera:', error);
                    updateStatus('Erro ao acessar câmera: ' + error.message, 'error');
                }
            }
            
            function stopCamera() {
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                    localVideo.srcObject = null;
                }
                if (pc) {
                    pc.close();
                }
                startBtn.disabled = false;
                stopBtn.disabled = true;
                updateStatus('Câmera desconectada');
                socket.disconnect();
            }
            
            function initWebRTC() {
                pc = new RTCPeerConnection(pcConfig);
                
                // Adicionar stream local ao peer connection
                localStream.getTracks().forEach(track => {
                    pc.addTrack(track, localStream);
                });
                
                // Tratar ICE candidates
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('Enviando ICE candidate');
                        socket.emit('ice-candidate', {
                            roomId,
                            candidate: event.candidate,
                            type: 'mobile'
                        });
                    }
                };
                
                pc.oniceconnectionstatechange = () => {
                    console.log('ICE connection state:', pc.iceConnectionState);
                    updateStatus('Estado da conexão: ' + pc.iceConnectionState, 
                        pc.iceConnectionState === 'connected' ? 'connected' : '');
                };
                
                // Entrar na sala
                socket.emit('join-room', { roomId, type: 'mobile' });
            }
            
            // Event listeners do Socket.io
            socket.on('connect', () => {
                console.log('Socket conectado com sucesso');
                updateStatus('Conectado ao servidor...', 'connecting');
            });
            
            socket.on('connect_error', (error) => {
                console.error('Erro de conexão socket:', error);
                updateStatus('Erro de conexão: ' + error.message, 'error');
            });
            
            socket.on('room-joined', () => {
                console.log('Entrou na sala:', roomId);
                updateStatus('Conectado à sala. Aguardando desktop...', 'connected');
            });
            
            socket.on('desktop-joined', async () => {
                console.log('Desktop conectou. Criando oferta...');
                updateStatus('Desktop conectado. Iniciando transmissão...', 'connected');
                
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('offer', { roomId, offer });
                } catch (error) {
                    console.error('Erro ao criar oferta:', error);
                    updateStatus('Erro ao criar oferta: ' + error.message, 'error');
                }
            });
            
            socket.on('answer', async (data) => {
                console.log('Recebida resposta do desktop');
                try {
                    await pc.setRemoteDescription(data.answer);
                    updateStatus('Conexão estabelecida! Transmitindo...', 'connected');
                } catch (error) {
                    console.error('Erro ao processar resposta:', error);
                    updateStatus('Erro na conexão: ' + error.message, 'error');
                }
            });
            
            socket.on('ice-candidate', async (data) => {
                if (data.type === 'desktop') {
                    console.log('Recebido ICE candidate do desktop');
                    try {
                        await pc.addIceCandidate(data.candidate);
                    } catch (error) {
                        console.error('Erro ao adicionar ICE candidate:', error);
                    }
                }
            });
            
            socket.on('desktop-disconnected', () => {
                updateStatus('Desktop desconectado');
            });
            
            // Auto-iniciar em dispositivos móveis
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                updateStatus('Dispositivo móvel detectado. Clique em "Iniciar Câmera"');
            }
        </script>
    </body>
    </html>
  `);
});

// Gerenciamento de conexões WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  // Cliente entra em uma sala
  socket.on('join-room', (data) => {
    const { roomId, type } = data;
    socket.join(roomId);
    socket.roomId = roomId;
    socket.clientType = type;
    
    console.log(`${type} entrou na sala: ${roomId}`);
    
    // Inicializar sala se não existir
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { desktop: null, mobile: null });
    }
    
    const room = rooms.get(roomId);
    room[type] = socket.id;
    
    // Notificar cliente que entrou na sala
    socket.emit('room-joined', { roomId });
    
    // Se ambos estão conectados, notificar
    if (room.desktop && room.mobile) {
      io.to(room.mobile).emit('desktop-joined');
      io.to(room.desktop).emit('mobile-joined');
      console.log(`Sala ${roomId} completa: desktop e mobile conectados`);
    }
  });
  
  // Retransmitir ofertas WebRTC
  socket.on('offer', (data) => {
    console.log(`Retransmitindo oferta para sala: ${data.roomId}`);
    socket.to(data.roomId).emit('offer', data);
  });
  
  // Retransmitir respostas WebRTC
  socket.on('answer', (data) => {
    console.log(`Retransmitindo resposta para sala: ${data.roomId}`);
    socket.to(data.roomId).emit('answer', data);
  });
  
  // Retransmitir ICE candidates
  socket.on('ice-candidate', (data) => {
    console.log(`Retransmitindo ICE candidate para sala: ${data.roomId}`);
    socket.to(data.roomId).emit('ice-candidate', data);
  });
  
  // Cliente desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    if (socket.roomId && socket.clientType) {
      const room = rooms.get(socket.roomId);
      if (room) {
        // Remover cliente da sala
        room[socket.clientType] = null;
        
        // Notificar outro cliente sobre desconexão
        const otherType = socket.clientType === 'desktop' ? 'mobile' : 'desktop';
        if (room[otherType]) {
          io.to(room[otherType]).emit(`${socket.clientType}-disconnected`);
        }
        
        // Remover sala se vazia
        if (!room.desktop && !room.mobile) {
          rooms.delete(socket.roomId);
          console.log(`Sala ${socket.roomId} removida`);
        }
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor rodando em http://172.26.204.230:${PORT}`);
  console.log(`📱 Para gerar QR code: GET /qr/{roomId}`);
  console.log(`🖥️  Para acessar mobile: GET /mobile/{roomId}`);
  console.log(`\n🔧 Salas ativas: ${rooms.size}`);
  console.log(`\n📱 Acesse do seu celular: http://172.26.204.230:${PORT}`);
});