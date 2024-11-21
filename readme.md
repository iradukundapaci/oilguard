# OilGuard

OilGuard is an advanced pipeline monitoring and management system designed to detect and prevent oil spills, theft, and operational irregularities.

## Key Features

- Real-time pipeline parameter tracking
- Advanced leak and theft detection
- Comprehensive data visualization
- Robust user management system

## Technology Stack

### Backend

- NestJS
- PostgreSQL
- MQTT Protocol

### Frontend

- Next.js
- Material-UI
- Axios

## Quick Start

### Prerequisites

- Node.js (v22+)
- Docker
- Docker Compose

## Docker Deployment

Run the dependency system with Docker:

```bash
docker-compose up --build
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-repo/oilguard.git
cd oilguard
```

2. Setup Backend

```bash
cd oil-guard
npm install
cp .env.example .env
npm run start:dev
```

3. Setup Frontend

```bash
cd ../oil-guard-front
npm install
npm run dev
```

## Access Points

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
