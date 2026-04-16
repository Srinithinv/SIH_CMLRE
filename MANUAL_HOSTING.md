# 🚀 Manual Hosting Guide: step-by-step

இந்த பிளாட்பார்மை நீங்கள் மேனுவலாக ஹோஸ்ட் செய்ய கீழே உள்ள வழிமுறைகளை அப்படியே பின்பற்றுங்கள். இது மிகவும் எளிதானது.

---

## 🏗️ 1. Backend Hosting (Render.com)

1.  **Render Dashboard**-ற்கு செல்லுங்கள்: [dashboard.render.com](https://dashboard.render.com)
2.  **+ New** பட்டனை அழுத்தி **Web Service** என்பதைத் தேர்ந்தெடுக்கவும்.
3.  உங்களின் GitHub ரெப்போவை (**SIH_CMLRE**) கனெக்ட் செய்யுங்கள்.
4.  கீழே உள்ள செட்டிங்ஸ்களை கொடுங்கள்:
    - **Name**: `sih-cmlre-backend`
    - **Root Directory**: `backend`
    - **Runtime**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt` (இது தானாகவே இருக்கும்)
    - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5.  **Free Instance** டைப்பைத் தேர்ந்தெடுத்து **Create Web Service** கொடுங்கள்.
6.  **முக்கியம்**: ஹோஸ்ட் ஆனதும் ஒரு URL கிடைக்கும் (eg: `https://sih-cmlre-backend.onrender.com`). இதை காப்பி செய்து வைத்துக்கொள்ளுங்கள்.

---

## 🎨 2. Frontend Hosting (Vercel.com)

1.  **Vercel Dashboard**-ற்கு செல்லுங்கள்: [vercel.com](https://vercel.com)
2.  **Add New...** -> **Project** கொடுங்கள்.
3.  உங்களின் GitHub ரெப்போவை (**SIH_CMLRE**) இம்போர்ட் செய்யுங்கள்.
4.  **Configure Project** பக்கத்தில்:
    - **Root Directory**: `frontend` (Edit கொடுத்து இந்த ஃபோல்டரைத் தேர்ந்தெடுக்கவும்).
    - **Environment Variables**: "NEXT_PUBLIC_API_URL" என்று கொடுத்து, அதன் வேல்யூவாக நீங்கள் Render-ல் காப்பி செய்த URL-ஐப் போடவும்.
5.  **Deploy** பட்டனை அழுத்தவும்.

---

## 🔗 3. Connectivity Check (அனைத்தும் வேலை செய்கிறதா?)

- Vercel-ல் புராஜெக்ட் லைவ் ஆனவுடன், அந்த லிங்க்-கிளை கிளிக் செய்து லாகின் செய்து பாருங்கள்.
- லாகின் ஆகவில்லை என்றால், Render-ல் உள்ள URL சரியாக Vercel செட்டிங்ஸில் உள்ளதா என்று ஒருமுறை செக் செய்யவும்.

இந்த முறையைப் பின்பற்றினால் ஒரு சில நிமிடங்களில் உங்கள் பிளாட்பார்ம் உலகில் உள்ள அனைவரும் பார்க்கும் வகையில் லைவ்-விற்கு வந்துவிடும்! 🌊🐠🐬🎉✨🌊🚀💙🐬🏁🏆💯
