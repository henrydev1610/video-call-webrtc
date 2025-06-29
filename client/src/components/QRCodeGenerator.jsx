import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ roomId, onRoomChange, serverUrl }) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [mobileUrl, setMobileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputRoomId, setInputRoomId] = useState(roomId || '');

  // Gerar ID de sala aleatório
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Buscar QR code do servidor
  const fetchQRCode = async (targetRoomId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${serverUrl}/qr/${targetRoomId}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setQrCodeData(data.qrCode);
      setMobileUrl(data.mobileUrl);
      
      console.log('QR Code gerado para sala:', targetRoomId);
      console.log('URL móvel:', data.mobileUrl);
      
    } catch (error) {
      console.error('Erro ao buscar QR code:', error);
      setError('Erro ao gerar QR code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova sala
  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setInputRoomId(newRoomId);
    onRoomChange(newRoomId);
    fetchQRCode(newRoomId);
  };

  // Entrar em sala existente
  const handleJoinRoom = () => {
    if (inputRoomId.trim()) {
      const cleanRoomId = inputRoomId.trim().toUpperCase();
      setInputRoomId(cleanRoomId);
      onRoomChange(cleanRoomId);
      fetchQRCode(cleanRoomId);
    }
  };

  // Atualizar QR code quando roomId mudar
  useEffect(() => {
    if (roomId) {
      setInputRoomId(roomId);
      fetchQRCode(roomId);
    }
  }, [roomId]);

  return (
    <div className="qr-section">
      <h2>📱 Conectar Dispositivo Móvel</h2>
      
      {/* Input para ID da sala */}
      <div className="room-input">
        <input
          type="text"
          placeholder="ID da Sala (opcional)"
          value={inputRoomId}
          onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
        />
        <button 
          onClick={handleJoinRoom}
          disabled={loading || !inputRoomId.trim()}
        >
          Entrar
        </button>
      </div>

      <button 
        onClick={handleCreateRoom}
        disabled={loading}
        style={{ 
          width: '100%', 
          marginBottom: '20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Gerando...' : 'Criar Nova Sala'}
      </button>

      {error && (
        <div className="status error">
          {error}
        </div>
      )}

      {/* QR Code */}
      {qrCodeData && !loading && (
        <>
          <div className="qr-container">
            <QRCode 
              value={mobileUrl}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
          
          <div className="connection-info">
            <p><strong>Sala:</strong> {roomId}</p>
            <p><strong>URL Móvel:</strong></p>
            <p style={{ 
              wordBreak: 'break-all', 
              fontSize: '0.8rem',
              color: '#ccc',
              marginTop: '5px'
            }}>
              {mobileUrl}
            </p>
          </div>
        </>
      )}

      {/* Instruções */}
      <div className="instructions">
        <h3>📋 Como usar:</h3>
        <ol>
          <li>Crie uma nova sala ou digite o ID de uma sala existente</li>
          <li>Escaneie o QR code com seu dispositivo móvel</li>
          <li>Permita acesso à câmera e microfone no celular</li>
          <li>O vídeo aparecerá automaticamente na tela do desktop</li>
        </ol>
      </div>

      {loading && (
        <div className="status connecting">
          Gerando QR code...
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;