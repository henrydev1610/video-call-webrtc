# 🚀 Deploy Simples - 3 Opções Fáceis

## ❌ Problema no Railway
O Railway está com conflito de serviços. Vamos usar uma alternativa mais simples.

## 🎨 Opção 1: Render (Mais Fácil)

### Passos:
1. **Acesse:** [render.com](https://render.com)
2. **Crie conta gratuita**
3. **Clique em "New +" → "Web Service"**
4. **Conecte este repositório GitHub** (faça upload primeiro)
5. **Configurações:**
   - **Name:** `video-call-webrtc`
   - **Runtime:** `Node.js`
   - **Build Command:** 
     ```
     cd client && npm install && npm run build && cd ../server && npm install && mkdir -p public && cp -r ../client/dist/* public/
     ```
   - **Start Command:** `cd server && npm start`
   - **Instance Type:** `Free`

### ✅ Resultado:
URL como: `https://video-call-webrtc.onrender.com`

---

## 📦 Opção 2: GitHub + Vercel

### Passos:
1. **Upload para GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_USER/video-call-webrtc.git
   git push -u origin main
   ```

2. **Deploy no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Import from GitHub
   - Deploy automático

---

## 🐳 Opção 3: Docker + Railway (Manual)

Vamos simplificar o Railway:

```bash
# 1. Limpar configuração
rm -f railway.json render.yaml vercel.json

# 2. Deploy direto
railway up --service main
```

---

## 🔧 Solução Mais Rápida: Render

**Por que Render é melhor aqui:**
- ✅ Sem conflitos de configuração
- ✅ Build automático funciona bem
- ✅ WebSocket suportado no plano free
- ✅ SSL automático
- ✅ Deploy em 5 minutos

### Instruções Diretas:
1. Vá em render.com
2. Conecte GitHub
3. Use as configurações acima
4. Deploy automático

**Quer que eu te ajude a fazer upload para GitHub primeiro?**