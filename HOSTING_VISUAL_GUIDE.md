# 🎥 Visual Hosting Walkthrough

நீங்கள் கேட்டபடியே, பிளாட்பார்மை எப்படி லைவ் ஆக்குவது என்பதற்கான வீடியோ விளக்கங்கள் (Recordings) கீழே உள்ளன.

## 1. Vercel-ல் Frontend-ஐ ஹோஸ்ட் செய்வது எப்படி?
இந்த வீடியோவில் GitHub ரெப்போவை எப்படி இம்போர்ட் செய்வது மற்றும் `Root Directory`-ஐ `frontend` என்று மாற்றுவது எப்படி என்று பார்க்கலாம்.

![Vercel Deployment](file:///C:/Users/DELL/.gemini/antigravity/brain/9bb90767-cd8f-4d64-8e80-ebe07f5c49a6/vercel_import_repo_1776178688968.webp)

---

## 2. Render-ல் Backend-ஐ ஹோஸ்ட் செய்வது எப்படி?
இந்த வீடியோவில் FastAPI சர்வரை எப்படி ரன் செய்வது மற்றும் `requirements.txt` மூலம் பேக்கேஜ் இன்ஸ்டால் செய்வது எப்படி என்று பார்க்கலாம்.

![Render Deployment](file:///C:/Users/DELL/.gemini/antigravity/brain/9bb90767-cd8f-4d64-8e80-ebe07f5c49a6/render_backend_deploy_1776178862153.webp)

---

## 3. முக்கியமான ஸ்டெப்ஸ் (Summary):
1.  **Vercel-ல்**: `Root Directory` -> `frontend` என்று கொடுங்கள்.
2.  **Render-ல்**: `Root Directory` -> `backend` மற்றும் Start Command-ல் `uvicorn app.main:app --host 0.0.0.0 --port $PORT` கொடுங்கள்.
3.  **Connectivity**: Render-ல் கிடைக்கும் URL-ஐ Vercel-ன் Environment Variable (`NEXT_PUBLIC_API_URL`) லொகேஷனில் சேமிக்க வேண்டும்.

இப்போது உங்கள் பிளாட்பார்ம் **Live** ஆகிவிடும்! 🌊🐠🐬🎉
