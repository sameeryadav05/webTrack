# WebTrack

**A self-hosted website analytics platform with a lightweight tracking script, an event-driven backend, and a real-time visitor layer.**

WebTrack lets a site owner register a website, install a small JavaScript snippet, collect pageview and page-exit events, and inspect analytics from a dashboard.

<p align="center">
  <a href="https://webtrack.imsameer.me/"><strong>Live Dashboard</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/sameeryadav05/webTrack"><strong>Source Code</strong></a>
</p>

---

## Project at a glance

| Area | Implementation |
|---|---|
| Dashboard | React 19, Vite, React Router |
| API | Node.js, Express 5 |
| Authentication | JWT, bcrypt |
| Event transport | RabbitMQ, AMQP |
| Event processing | Node.js consumer in the API process |
| Persistent storage | MongoDB Atlas, Mongoose |
| Realtime/ephemeral state | Redis |
| Browser and device parsing | ua-parser-js |
| IP geolocation | geoip-lite |
| Deployment | Vercel, Render, AWS EC2, Upstash, MongoDB Atlas |

## Live links

- **WebTrack dashboard:** https://webtrack.imsameer.me/
- **Tracking script:** https://webtrack-ox8a.onrender.com/tracker.js
- **GitHub repository:** https://github.com/sameeryadav05/webTrack

The dashboard and API are deployed separately. The API health endpoint returns a basic process health response; it should not be treated as a full dependency/readiness check.

## What WebTrack does

1. A user creates an account and signs in.
2. The user registers a website in the dashboard.
3. WebTrack creates a unique site ID and site API key and returns an installation snippet.
4. The site owner adds the snippet to the website.
5. The browser tracking script sends pageview and page-exit events to the tracking API.
6. The API validates the registered site and publishes the event to RabbitMQ.
7. The RabbitMQ consumer parses user-agent and IP-location information, updates Redis active-visitor state, and stores the event in MongoDB.
8. The dashboard calls protected analytics endpoints to read aggregated data.

## Architecture

### High-level system diagram

```mermaid
flowchart TB
    Visitor[Website Visitor]
    Script[WebTrack JavaScript Tracker]
    API[Express API on Render]
    Auth[JWT Authentication]
    SiteValidation[Site ID + API Key + Origin Validation]
    Broker[(RabbitMQ tracking_events)]
    Consumer[Tracking Consumer]
    UA[User-Agent Parser]
    Geo[IP Geolocation]
    Redis[(Redis / Upstash)]
    Mongo[(MongoDB Atlas)]
    Dashboard[React Dashboard on Vercel]

    Visitor --> Script
    Script -->|pageview / page_exit| API
    Dashboard -->|login, site setup, analytics| API
    API --> Auth
    API --> SiteValidation
    SiteValidation -->|valid tracking event| Broker
    Broker --> Consumer
    Consumer --> UA
    Consumer --> Geo
    Consumer -->|active visitor set| Redis
    Consumer -->|tracking history| Mongo
    API -->|analytics queries| Mongo
    API -->|active visitor count| Redis
    API --> Dashboard
```

### Event-processing sequence

```mermaid
sequenceDiagram
    participant B as Visitor Browser
    participant T as tracker.js
    participant A as Express Tracking API
    participant R as RabbitMQ
    participant W as Tracking Consumer
    participant C as Redis
    participant M as MongoDB

    B->>T: Load website with site ID and API key
    T->>A: POST /track (pageview)
    A->>A: Validate site credentials and request origin
    A->>R: Publish tracking event
    A-->>T: 202 Accepted
    R->>W: Deliver queued event
    W->>W: Parse browser, OS, device and IP location
    W->>C: Update active visitor set
    W->>M: Persist tracking event
    W->>R: ACK after successful processing
```

### Backend request boundaries

| Component | Responsibility |
|---|---|
| Tracking API | Accepts incoming browser events and publishes them to RabbitMQ |
| Site validation middleware | Checks site ID, API key, and request Origin against the registered site |
| RabbitMQ | Decouples event ingestion from event processing |
| Tracking consumer | Enriches events, updates active visitor state, and writes tracking records |
| MongoDB | Stores users, registered sites, and tracking events |
| Redis | Maintains the active-visitor set queried by the dashboard |
| Analytics controllers | Calculate overview metrics, browser/country breakdowns, and top pages |

> **Current implementation note:** The API and RabbitMQ consumer are started by the same `server.js` process. They are logically separate components, but they are not currently deployed as independent worker services. On a sleeping/free web instance, consumption pauses while that process is stopped.

## Features

### Implemented in the current codebase

- User registration and login
- Password hashing with bcrypt
- JWT-protected dashboard APIs
- Website registration with unique site ID and API key
- Generated JavaScript installation snippet
- Tracking endpoint for pageview and page-exit events
- Site credential and Origin validation for tracking requests
- RabbitMQ-based asynchronous event processing
- Browser, operating-system, and device parsing
- IP-based country and city lookup using the local geoip-lite database
- MongoDB persistence for tracking events
- Redis-backed active visitor set
- Analytics endpoints for:
  - Total pageviews
  - Unique visitors
  - Average recorded page duration
  - Active visitors
  - Browser breakdown
  - Country breakdown
  - Top pages

### Current scope and limitations

WebTrack is an actively developed project. The current tracker sends a pageview on script initialization and a page-exit event on `visibilitychange`. It does not yet provide a complete SPA route-change/heartbeat implementation. Active visitor counts therefore depend on the exit event being delivered and should be treated as approximate.

The current event consumer uses manual acknowledgements and requeues processing failures. A configured retry policy/dead-letter queue, durable delivery guarantees, and publisher confirms are not yet documented as implemented features.

The analytics endpoints currently return lifetime aggregates; date-range filtering is not part of the current API implementation.

## Technology stack

### Frontend

- **React 19** — component-based dashboard
- **Vite** — development server and production bundler
- **React Router DOM** — client-side navigation
- **Tailwind CSS** — styling
- **Zustand** — client-side state management
- **Axios** — API communication
- **Recharts** — analytics visualizations
- **Framer Motion** — interface animations
- **Lucide React / React Icons** — icons

### Backend

- **Node.js (ES Modules)** — JavaScript runtime
- **Express 5** — REST API
- **Mongoose** — MongoDB object modeling
- **JWT + bcryptjs** — authentication
- **amqplib** — RabbitMQ integration
- **node-redis** — Redis client
- **ua-parser-js** — user-agent parsing
- **geoip-lite** — IP geolocation lookup
- **Morgan** — HTTP request logging
- **CORS** — cross-origin request handling

### Infrastructure

- **Vercel** — frontend hosting
- **Render** — backend API hosting
- **AWS EC2** — RabbitMQ host
- **Upstash Redis** — managed Redis
- **MongoDB Atlas** — managed database

## Repository structure

```text
webTrack/
├── Client/                         # React + Vite dashboard
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── Dockerfile
│
├── analytics-tracker/              # Node.js backend
│   ├── public/
│   │   └── tracker.js              # Browser tracking snippet
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   ├── rabbitmq.js          # RabbitMQ connection/channel
│   │   │   └── redis.js             # Redis connection/client
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── siteAccess.middleware.js
│   │   │   └── validateSite.middleware.js
│   │   ├── modules/
│   │   │   ├── Analytics/
│   │   │   ├── Auth/
│   │   │   ├── Sites/
│   │   │   └── Tracking/
│   │   ├── utils/
│   │   │   ├── clientIp.js
│   │   │   ├── geoLocation.js
│   │   │   └── parseUserAgent.js
│   │   ├── worker/
│   │   │   └── Tracking.worker.js   # RabbitMQ event consumer
│   │   ├── server.js                # Express API + consumer startup
│   │   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Getting started locally

### Prerequisites

Install:

- Node.js (a current LTS release)
- npm
- Docker Desktop / Docker Engine (for local RabbitMQ and Redis)
- A MongoDB instance (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/sameeryadav05/webTrack.git
cd webTrack
```

### 2. Start local infrastructure

The root Compose file defines RabbitMQ and Redis along with the backend and frontend containers. Review its environment values and service dependencies before using it. To run only the infrastructure services:

```bash
docker compose up -d webtrack_rabbitmq webtrack_redis
```

RabbitMQ management UI (when the local port is published):

- http://localhost:15672

RabbitMQ AMQP:

- `amqp://localhost:5672`

Redis:

- `redis://localhost:6379`

### 3. Configure the backend

Create `analytics-tracker/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017
RABBITMQ_URL=amqp://user:CHANGE_ME@localhost:5672
REDIS_URL=redis://:CHANGE_ME@localhost:6379
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Use credentials that match your local RabbitMQ and Redis configuration. If using MongoDB Atlas, supply its connection URI instead of the local URI. The application selects the `webTrack` database name in its Mongoose connection.

Install dependencies and start the API (which also starts the tracking consumer):

```bash
cd analytics-tracker
npm install
npm start
```

The API listens on `PORT` (default `5000`) and exposes the basic health route at:

- http://localhost:5000/check

The tracking script is served from:

- http://localhost:5000/tracker.js

### 4. Configure and start the frontend

In a new terminal:

```bash
cd Client
npm install
npm run dev
```

Vite typically serves the dashboard at http://localhost:5173.

Configure the frontend API base URL using the environment variable/key expected by the frontend API client in your local setup. Do not place MongoDB, RabbitMQ, Redis, or JWT secrets in frontend variables.

### 5. Build the frontend

```bash
cd Client
npm run build
```

## Install WebTrack on a website

1. Sign in to the [WebTrack dashboard](https://webtrack.imsameer.me/).
2. Open **My Sites** and create a site.
3. Enter a site name and the website's origin/domain.
4. Copy the generated installation snippet.
5. Add the snippet to the website's HTML, ideally before the closing `</head>` tag (or in the framework's root document/layout).
6. Deploy the website.
7. Visit the website and check the dashboard for incoming events.

Example installation snippet (use the values generated for your own site):

```html
<script
  src="https://webtrack-ox8a.onrender.com/tracker.js"
  data-site-id="YOUR_SITE_ID"
  data-api-key="YOUR_SITE_API_KEY"
></script>
```

**For React / Next.js applications:** install the script once in the root HTML document or application layout. For Next.js App Router, use `next/script` in the root layout. The current tracker is not yet a full SPA navigation tracker, so client-side route transitions may not each create a new pageview.

## API overview

The current Express server mounts these route groups:

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/register` | Register an account | Public |
| POST | `/auth/login` | Authenticate and receive a JWT | Public |
| POST | `/site` | Register a website | JWT |
| GET | `/site/my-sites` | List the signed-in user's sites | JWT |
| POST | `/track` | Submit a tracking event | Site ID + API key + Origin validation |
| GET | `/analytics/overview/:siteId` | Overview metrics | JWT + site ownership |
| GET | `/analytics/active-visitors/:siteId` | Active visitor count | JWT + site ownership |
| GET | `/analytics/browsers/:siteId` | Browser aggregation | JWT + site ownership |
| GET | `/analytics/countries/:siteId` | Country aggregation | JWT + site ownership |
| GET | `/analytics/pages/:siteId` | Top pages | JWT + site ownership |
| GET | `/check` | Basic API health response | Public |

Authenticated endpoints expect:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Tracking events are submitted as JSON. The tracking script includes the site's generated `siteId` and `apiKey`.

## Deployment overview

The current live setup is:

| Service | Hosting | Address |
|---|---|---|
| Dashboard | Vercel | https://webtrack.imsameer.me/ |
| API + tracking consumer | Render Web Service | https://webtrack-ox8a.onrender.com |
| RabbitMQ | AWS EC2 | Self-managed AMQP endpoint |
| Redis | Upstash | Managed Redis endpoint |
| MongoDB | MongoDB Atlas | Managed database |

The Render API and consumer run in the same Node.js process in the current repository. A free Render Web Service may spin down after inactivity; while it is stopped, the consumer is not processing messages. RabbitMQ queue durability and message persistence must be configured consistently if events need to wait for the service to wake up.

## Environment variables and security

Never commit real credentials. Keep `.env` files out of Git and configure production secrets in the hosting provider's environment settings.

| Variable | Used by | Description |
|---|---|---|
| `PORT` | Backend | HTTP listening port (provided by Render in production) |
| `MONGODB_URI` | Backend | MongoDB connection URI |
| `RABBITMQ_URL` | Backend | AMQP connection URI |
| `REDIS_URL` | Backend | Redis connection URI; use `rediss://` when TLS is required |
| `JWT_SECRET` | Backend | Secret used to sign and verify JWTs |
| `CLIENT_URL` | Backend configuration | Frontend origin setting |

The site's API key is included in the browser installation snippet by design, so it is an identifier/ingestion credential rather than a secret suitable for privileged operations. Do not expose infrastructure credentials or JWT signing secrets in the tracking script.

## Development notes

- The backend is an ES module project (`"type": "module"`).
- The frontend and backend have separate `package.json` files.
- The backend starts the Express API and RabbitMQ consumer from `analytics-tracker/server.js`.
- The RabbitMQ queue name used by the application is `tracking_events`.
- For production hardening, prioritize publisher confirms, consistent durable queue/message configuration, bounded retry/dead-letter handling, dependency-aware health checks, rate limiting, input validation, and SPA route/heartbeat tracking.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes and test them locally.
4. Open a pull request with a clear description of the change.

Please do not include credentials, database dumps, or real visitor data in commits or issues.

## License

No license file is currently included in this repository. Until a license is added, standard copyright applies and reuse should not be assumed to be permitted.

---

<p align="center">
  Built to explore practical web analytics, event-driven processing, and backend system design.
</p>
