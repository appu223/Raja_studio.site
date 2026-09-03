# Raja Studio Management

Raja Studio Management is a full-stack photo studio operations platform. It brings studio administration, bookings, shoots, editing, galleries, finance, inventory, staff workspaces, and customer portal access into one application.

## Features

- Admin dashboard for studio operations and administration
- Booking, enquiry, customer, service, shoot, editing, gallery, finance, inventory, and report management
- Photographer and editor workspaces
- Customer portal for bookings, invoices, galleries, and new booking requests
- Public landing page and gallery sharing links
- Customer self-registration with a linked portal account
- JWT authentication with role-based route protection
- MySQL or MariaDB persistence

## Technology

- Frontend: React 19, React Router, Bootstrap, Bootstrap Icons, Vite
- Backend: Node.js, Express, MySQL2, JWT, bcryptjs
- Database: MySQL or MariaDB

## Project Structure

```text
client/   React and Vite frontend
server/   Express REST API
db/       Database schema and sample data
```

## Requirements

- Node.js 18 or newer
- npm
- MySQL or MariaDB
- XAMPP is suitable for local Windows development

## Database Setup

1. Start MySQL or MariaDB.
2. Create a database named `raja_studio`.
3. Import [`db/raja_studio.sql`](db/raja_studio.sql) using phpMyAdmin or the MySQL client.

The SQL dump contains the tables, roles, and sample application data used by the local demo.

## Server Setup

From the `server` directory:

```powershell
npm install
Copy-Item .env.example .env
npm start
```

The repository currently keeps local secrets out of Git. If `.env.example` is not present, create `server/.env` with values like these:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=raja_studio
DB_USER=root
DB_PASSWORD=
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

The API runs at `http://localhost:5000` and its health endpoint is `http://localhost:5000/api/health`.

## Client Setup

From the `client` directory, in a second terminal:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. The login page is available at `http://localhost:5173/login`.

If port 5173 is already in use, stop the older Vite process before starting another one, or use the alternate port printed by Vite.

## Login and Registration

The login panel supports Admin, Camera, Editor, and Client personas. The sample database includes active demo accounts using the password `password123`:

| Persona | Email |
| --- | --- |
| Admin | `admin@rajastudio.com` |
| Photographer | `photo@rajastudio.com` |
| Editor | `editor@rajastudio.com` |
| Customer | `darvin@gmail.com` |

Customers can select **New client? Create an account** on the login page. Registration creates both the authentication user and the linked customer profile in one transaction.

## Useful Commands

```powershell
# Client production build
cd client
npm run build

# Client linting
npm run lint

# Server development mode
cd server
npm run dev
```

## Main API Areas

All API routes are mounted under `/api`:

- `/auth` - login, customer registration, and current-user profile
- `/admin` - users, roles, calendar, and audit logs
- `/customers` - customer administration
- `/bookings` - booking management
- `/enquiries` - enquiry management
- `/services` - studio services
- `/shoots` - shoot scheduling and staff assignment
- `/editing` - editing queue
- `/galleries` - gallery management and uploads
- `/finance` - payments and expenses
- `/inventory` - equipment management
- `/reports` - reports and notifications
- `/customer-portal` - customer-facing data
- `/staff-portal` - photographer and editor data

## Security Notes

- Never commit `server/.env` or production credentials.
- Replace the local JWT secret before deployment.
- Use HTTPS and restrictive CORS settings in production.
- Change all sample passwords before sharing a deployed instance.