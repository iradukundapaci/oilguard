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
- Node.js (v18+)
- Docker
- Docker Compose

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
npm run typeorm:run
npm run start:dev
```

3. Setup Frontend
```bash
cd ../oil-guard-front
npm install
cp .env.local.example .env.local
npm run dev
```

## Docker Deployment

Run the entire system with Docker:
```bash
docker-compose up --build
```

## Environment Configuration

### Backend Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `MQTT_BROKER_URL`: MQTT broker connection
- `SECRET_KEY`: JWT authentication secret

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API endpoint

## Access Points
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## License
[Your License Here]
