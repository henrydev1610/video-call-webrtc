import React, { useEffect } from 'react';

const VideoPlayer = ({ 
  remoteStream, 
  connectionStatus, 
  error, 
  roomId,
  remoteVideoRef 
}) => {
  
  // Atualizar src do vídeo quando stream mudar
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log('Stream de vídeo conectado ao elemento video');
    }
  }, [remoteStream, remoteVideoRef]);

  // Renderizar status da conexão
  const renderStatus = () => {
    const statusMessages = {
      disconnected: 'Aguardando conexão...',
      connecting: 'Conectando ao dispositivo móvel...',
      waiting: 'Aguardando dispositivo móvel escanear QR code...',
      connected: '✅ Conectado! Recebendo vídeo ao vivo',
      error: `❌ Erro: ${error || 'Erro desconhecido'}`
    };

    const statusClass = connectionStatus === 'waiting' ? 'connecting' : connectionStatus;

    return (
      <div className={`status ${statusClass}`}>
        {statusMessages[connectionStatus] || 'Status desconhecido'}
        {roomId && connectionStatus !== 'disconnected' && (
          <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>
            Sala: <strong>{roomId}</strong>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="video-section">
      <h2>🎥 Vídeo ao Vivo</h2>
      
      <div className="video-container">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            controls={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div className="video-placeholder">
            {connectionStatus === 'connected' ? (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📱</div>
                <div>Iniciando transmissão...</div>
              </div>
            ) : connectionStatus === 'connecting' || connectionStatus === 'waiting' ? (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                <div>Aguardando dispositivo móvel...</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📺</div>
                <div>Nenhum vídeo conectado</div>
                <div style={{ fontSize: '0.9rem', marginTop: '10px', color: '#666' }}>
                  Escaneie o QR code com seu celular para iniciar
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {renderStatus()}

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: '5px',
          fontSize: '0.8rem'
        }}>
          <strong>Debug Info:</strong><br/>
          Status: {connectionStatus}<br/>
          Stream: {remoteStream ? 'Ativo' : 'Inativo'}<br/>
          Sala: {roomId || 'Nenhuma'}<br/>
          {error && `Erro: ${error}`}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;