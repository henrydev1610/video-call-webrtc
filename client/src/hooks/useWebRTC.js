import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { WS_URL } from '../config/environment';

const useWebRTC = (serverUrl = WS_URL) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Configuração WebRTC com TURN servers para produção
  const pcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      // TURN servers gratuitos para NAT traversal
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
  
  // Inicializar conexão WebRTC
  const initWebRTC = () => {
    try {
      pcRef.current = new RTCPeerConnection(pcConfig);
      
      // Tratar stream remoto
      pcRef.current.ontrack = (event) => {
        console.log('Stream remoto recebido:', event.streams[0]);
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Tratar ICE candidates
      pcRef.current.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          console.log('Enviando ICE candidate');
          socketRef.current.emit('ice-candidate', {
            roomId,
            candidate: event.candidate,
            type: 'desktop'
          });
        }
      };
      
      // Monitorar estado da conexão ICE
      pcRef.current.oniceconnectionstatechange = () => {
        const state = pcRef.current.iceConnectionState;
        console.log('ICE connection state:', state);
        
        switch (state) {
          case 'connected':
          case 'completed':
            setConnectionStatus('connected');
            setError(null);
            break;
          case 'disconnected':
            setConnectionStatus('disconnected');
            break;
          case 'failed':
            setConnectionStatus('error');
            setError('Falha na conexão WebRTC');
            break;
          case 'connecting':
            setConnectionStatus('connecting');
            break;
          default:
            break;
        }
      };
      
      // Monitorar estado da conexão
      pcRef.current.onconnectionstatechange = () => {
        console.log('Connection state:', pcRef.current.connectionState);
      };
      
    } catch (error) {
      console.error('Erro ao inicializar WebRTC:', error);
      setError('Erro ao inicializar WebRTC: ' + error.message);
      setConnectionStatus('error');
    }
  };
  
  // Conectar ao servidor de sinalização
  const connectToSignalingServer = (newRoomId) => {
    try {
      setError(null);
      setConnectionStatus('connecting');
      setRoomId(newRoomId);
      
      // Conectar ao servidor Socket.io com configuração para produção
      console.log('Conectando ao servidor:', serverUrl);
      socketRef.current = io(serverUrl, {
        transports: ['polling', 'websocket'],
        timeout: 20000,
        forceNew: true,
        upgrade: true
      });
      
      socketRef.current.on('connect', () => {
        console.log('Conectado ao servidor de sinalização');
        // Entrar na sala como desktop
        socketRef.current.emit('join-room', { roomId: newRoomId, type: 'desktop' });
      });
      
      socketRef.current.on('room-joined', () => {
        console.log('Entrou na sala:', newRoomId);
        setConnectionStatus('waiting');
      });
      
      socketRef.current.on('mobile-joined', () => {
        console.log('Dispositivo móvel conectou');
        setConnectionStatus('connecting');
      });
      
      // Receber oferta do dispositivo móvel
      socketRef.current.on('offer', async (data) => {
        console.log('Oferta recebida do dispositivo móvel');
        try {
          if (!pcRef.current) {
            initWebRTC();
          }
          
          await pcRef.current.setRemoteDescription(data.offer);
          
          // Criar resposta
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          
          // Enviar resposta
          socketRef.current.emit('answer', { roomId: newRoomId, answer });
          
          console.log('Resposta enviada para dispositivo móvel');
        } catch (error) {
          console.error('Erro ao processar oferta:', error);
          setError('Erro ao processar oferta: ' + error.message);
          setConnectionStatus('error');
        }
      });
      
      // Receber ICE candidates
      socketRef.current.on('ice-candidate', async (data) => {
        if (data.type === 'mobile' && pcRef.current) {
          console.log('ICE candidate recebido do dispositivo móvel');
          try {
            await pcRef.current.addIceCandidate(data.candidate);
          } catch (error) {
            console.error('Erro ao adicionar ICE candidate:', error);
          }
        }
      });
      
      // Dispositivo móvel desconectou
      socketRef.current.on('mobile-disconnected', () => {
        console.log('Dispositivo móvel desconectou');
        setConnectionStatus('disconnected');
        setRemoteStream(null);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });
      
      socketRef.current.on('disconnect', () => {
        console.log('Desconectado do servidor');
        setConnectionStatus('disconnected');
      });
      
      socketRef.current.on('connect_error', (error) => {
        console.error('Erro de conexão:', error);
        setError('Erro de conexão com servidor: ' + error.message);
        setConnectionStatus('error');
      });
      
      // Inicializar WebRTC
      initWebRTC();
      
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setError('Erro ao conectar: ' + error.message);
      setConnectionStatus('error');
    }
  };
  
  // Desconectar
  const disconnect = () => {
    console.log('Desconectando...');
    
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    setRemoteStream(null);
    setError(null);
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };
  
  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);
  
  return {
    connectionStatus,
    roomId,
    error,
    remoteStream,
    remoteVideoRef,
    connectToSignalingServer,
    disconnect
  };
};

export default useWebRTC;