# 🚀 Guia de Deploy - Aplicação WebRTC

## 📋 Opções de Deploy Gratuito

### 1. 🚄 Railway (Recomendado)

**Vantagens:**
- ✅ Suporte nativo a WebSocket
- ✅ Deploy automático via Git
- ✅ SSL/HTTPS automático
- ✅ 500 horas gratuitas/mês

**Passos:**

1. **Criar conta:** [railway.app](https://railway.app)

2. **Instalar CLI:**
```bash
npm install -g @railway/cli
railway login
```

3. **Deploy:**
```bash
cd /mnt/c/Users/conta/Documents/hutz-project
railway up
```

4. **Configurar domínio:**
- Acesse o dashboard do Railway
- Vá em Settings → Domain
- Anote a URL gerada (ex: `https://seu-app.railway.app`)

---

### 2. 🎨 Render

**Vantagens:**
- ✅ Plano gratuito generoso
- ✅ Build automático
- ✅ SSL incluído

**Passos:**

1. **Criar conta:** [render.com](https://render.com)

2. **Conectar repositório GitHub:**
   - Faça upload do projeto para GitHub
   - Conecte no Render

3. **Configurar Web Service:**
   - Build Command: `cd client && npm install && npm run build && cd ../server && npm install && mkdir -p public && cp -r ../client/dist/* public/`
   - Start Command: `cd server && npm start`
   - Environment: `Node.js`

---

### 3. ▲ Vercel (Para WebApps)

**Limitações:** WebSocket pode ter problemas no plano gratuito

**Passos:**

1. **Instalar CLI:**
```bash
npm install -g vercel
vercel login
```

2. **Deploy:**
```bash
cd /mnt/c/Users/conta/Documents/hutz-project
vercel --prod
```

---

## 🛠️ Deploy Manual (Docker)

Se você tem um servidor VPS:

```bash
# Build da imagem
docker build -t video-call-webrtc .

# Executar container
docker run -p 3001:3001 -e NODE_ENV=production video-call-webrtc
```

---

## 🔧 Configuração Pós-Deploy

### 1. Testar a Aplicação

Após o deploy, você receberá uma URL como:
- `https://video-call-webrtc-xxx.railway.app`
- `https://video-call-webrtc.onrender.com`

### 2. Verificar Funcionalidades

1. **Abra a URL no desktop**
2. **Clique em "Criar Nova Sala"**
3. **Escaneie o QR code com o celular**
4. **Teste a transmissão de vídeo**

### 3. Debug em Produção

**Logs do Servidor:**
- Railway: `railway logs`
- Render: Ver no dashboard
- Vercel: `vercel logs`

**Verificar HTTPS:**
- WebRTC requer HTTPS em produção
- Todas as plataformas fornecem SSL automático

---

## 📱 URLs de Teste

Após deploy, suas URLs serão:

- **Desktop:** `https://sua-url.railway.app`
- **Mobile:** `https://sua-url.railway.app/mobile/TESTE`
- **QR Code:** Gerado automaticamente pelo app

---

## 🐛 Troubleshooting

### Problema: WebSocket não conecta
**Solução:** Verificar se a plataforma suporta WebSocket (Railway ✅, Render ✅, Vercel ⚠️)

### Problema: Câmera não funciona
**Solução:** 
- Verificar se está usando HTTPS
- Testar em diferentes browsers
- Verificar permissões de mídia

### Problema: Build falha
**Solução:**
- Verificar logs de build
- Garantir que todas as dependências estão no package.json
- Verificar versão do Node.js (>=16)

---

## 💡 Dicas de Produção

1. **Performance:**
   - Use CDN para assets estáticos
   - Configure compressão gzip
   - Otimize qualidade de vídeo

2. **Segurança:**
   - Implemente autenticação de salas
   - Rate limiting para criação de salas
   - Validação de entrada

3. **Escalabilidade:**
   - Use Redis para gerenciar salas (múltiplas instâncias)
   - Configure load balancer sticky sessions
   - Monitore uso de recursos

---

## 🎯 Deploy Rápido (Railway)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Navegar para o projeto
cd /mnt/c/Users/conta/Documents/hutz-project

# 4. Deploy
railway up

# 5. Abrir no browser
railway open
```

**Pronto!** Sua aplicação estará rodando em uma URL pública que você pode acessar de qualquer dispositivo! 🎉

---

**📞 Após o deploy, compartilhe a URL para testar de qualquer lugar do mundo!**