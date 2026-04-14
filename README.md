# CMLRE Unified Marine Data Intelligence Platform 🌊🧬📊

A production-ready, AI-driven SaaS platform designed for the **Centre for Marine Living Resources & Ecology (CMLRE)**. This platform integrates heterogeneous marine datasets, including taxonomic registries, oceanographic parameters, and molecular biology (eDNA), into a unified intelligence system.

---

## 🌟 Key Features

### 1. **Biometric-Grade Security (MFA)**
- **Two-Factor Authentication**: Secure login flow using institutional email and 6-digit OTP verification.
- **Session Management**: Persistent session tracking using secure HTTP-only cookies and Next.js middleware.
- **Scientist Access Control**: Role-based architecture ensuring data integrity for sensitive marine records.

### 2. **Artificial Intelligence & Machine Learning**
- **Anomaly Detection**: Scikit-learn powered Random Forest models to detect spikes in oceanographic parameters.
- **Abundance Forecasting**: Predictive modeling of species distribution based on real-time environmental data.
- **eDNA Sequence Alignment**: Live alignment and matching of molecular sequences with archival datasets.

### 3. **Taxonomic & Morphology Registry**
- **Persistent Storage**: Full CRUD operations for marine species with SQLAlchemy ORM and persistent database backends.
- **Otolith Morphology**: AI-assisted morphological analysis of fish otolith scans for species identification.

### 4. **Heterogeneous Data Ingestion**
- **Bulk Upload**: Seamless ingestion of CSV, Excel, and JSON datasets.
- **Verification Workflow**: A scientific audit trail where every record must be verified by a lead researcher before entering the core database.

### 5. **Immersive Deep-Sea UI**
- **State-of-the-art Design**: Responsive, dark-themed interface with smooth Framer Motion aquatic animations.
- **Interactive Visualizations**: Real-time trend analytics and health monitoring for marine ecosystems.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Framer Motion |
| **Backend** | FastAPI (Python), uvicorn |
| **Database** | SQLAlchemy ORM, SQLite (Production-Ready Persistence) |
| **AI/ML** | Scikit-Learn, Pandas, NumPy |
| **Auth** | Secure Session Cookies, OTP Logic |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The platform will be available at `http://localhost:3000`.

---

## 🧪 Testing the Platform
1. **Login**: Use the "Launch Demo Instance" on the login page.
2. **OTP**: Check the **Backend Terminal** logs for the 6-digit code.
3. **Data**: Add a species in the Taxonomy tab and refresh to verify persistence.

---

## 👨‍🔬 Developed for SIH 2024
This project addresses **Problem Statement 25041**: *AI-Driven Unified Metadata & Correlation Platform for CMLRE.*

*Built with passion for the Marine Sciences.* 🌊🐟🏁
