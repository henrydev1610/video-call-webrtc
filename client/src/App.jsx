import React, { useState, useEffect } from 'react';
import QRCodeGenerator from './components/QRCodeGenerator';
import VideoPlayer from './components/VideoPlayer';
import useWebRTC from './hooks/useWebRTC';
import { SERVER_URL } from './config/environment';

console.log('📱 App.jsx carregado');
console.log('🔗 SERVER_URL:', SERVER_URL);

function App() {
  const [currentRoomId, setCurrentRoomId] = useState('');
  
  // Hook personalizado para gerenciar WebRTC
  const {
    connectionStatus,
    roomId,
    error,
    remoteStream,
    remoteVideoRef,
    connectToSignalingServer,
    disconnect
  } = useWebRTC();

  // Tratar mudança de sala
  const handleRoomChange = (newRoomId) => {
    console.log('Mudando para sala:', newRoomId);
    
    // Desconectar sala atual se houver
    if (roomId) {
      disconnect();
    }
    
    setCurrentRoomId(newRoomId);
    
    // Conectar à nova sala
    if (newRoomId) {
      connectToSignalingServer(newRoomId);
    }
  };

  // Desconectar ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      disconnect();
    };
  }, [disconnect]);

  return (
    <div className="container">
      <header className="header">
        <h1>🎥 Chamada de Vídeo WebRTC</h1>
        <p>Conecte seu dispositivo móvel para transmitir vídeo em tempo real</p>
      </header>

      <main className="main-content">
        <QRCodeGenerator 
          roomId={currentRoomId}
          onRoomChange={handleRoomChange}
          serverUrl={SERVER_URL}
        />
        
        <VideoPlayer 
          remoteStream={remoteStream}
          connectionStatus={connectionStatus}
          error={error}
          roomId={roomId || currentRoomId}
          remoteVideoRef={remoteVideoRef}
        />
      </main>

      {/* Rodapé com informações adicionais */}
      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: '#ccc',
        fontSize: '0.9rem'
      }}>
        <p>
          💡 <strong>Dica:</strong> Certifique-se de que ambos os dispositivos estão na mesma rede 
          ou configure o servidor com um IP público para uso remoto.
        </p>
        <p style={{ marginTop: '10px' }}>
          🔧 Servidor: <code>{SERVER_URL}</code> | 
          🌐 WebRTC funcionando via QR Code
        </p>
      </footer>
    </div>
  );
}

export default App;