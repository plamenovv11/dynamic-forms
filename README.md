# Form Builder (Fullstack)

Minimal fullstack app to design forms, build flows and run conditional rules.

## Prerequisites
- Node.js (16+ recommended)
- npm
- (optional) SQLite client for inspecting DB

## Quick start

1. Install dependencies (root not required; install in each workspace)
   - Backend: open [backend/package.json](backend/package.json) and run:
     ```sh
     cd backend
     npm install
     ```
   - Frontend: open [frontend/package.json](frontend/package.json) and run:
     ```sh
     cd frontend
     npm install
     ```

2. Start backend (development)
   - Uses [backend/src/index.ts](backend/src/index.ts). Run:
     ```sh
     cd backend
     npm run dev
     ```
   - The server listens on PORT from [backend/.env](backend/.env) (default 3000).

3. Start frontend (development)
   - Uses [frontend/src/main.ts](frontend/src/main.ts). Run:
     ```sh
     cd frontend
     npm start
     ```
   - App served by Angular CLI (default http://localhost:4200/).

## Database / Prisma
- Schema: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)
- Migration SQL example: [backend/prisma/migrations/20260425014646_init/migration.sql](backend/prisma/migrations/20260425014646_init/migration.sql)
- Commands available in [backend/package.json](backend/package.json):
  - `npm run db:generate` to generate Prisma client
  - `npm run db:migrate` to run migrations
  - `npm run db:push` to push schema

## API (important routes)
Backend routes live in [backend/src/routes](backend/src/routes). Main endpoints:
- Forms: [backend/src/routes/forms.ts](backend/src/routes/forms.ts)
- Flows: [backend/src/routes/flows.ts](backend/src/routes/flows.ts)
- Rules: [backend/src/routes/rules.ts](backend/src/routes/rules.ts)
- Submissions: [backend/src/routes/submissions.ts](backend/src/routes/submissions.ts)

The running Express app is exported from [`app`](backend/src/index.ts) in [backend/src/index.ts](backend/src/index.ts).

## Useful frontend files
- App routes: [frontend/src/app/app.routes.ts](frontend/src/app/app.routes.ts)
- Main UI shell: [frontend/src/app/app.component.html](frontend/src/app/app.component.html)
- Styles: [frontend/src/styles.scss](frontend/src/styles.scss)
- Services calling the API (examples):
  - [`FlowService`](frontend/src/app/services/flow.service.ts)
  - [`FormService`](frontend/src/app/services/form.service.ts)
  - [`RuleService`](frontend/src/app/services/rule.service.ts)
  - [`SubmissionService`](frontend/src/app/services/submission.service.ts)

(Open the files above to inspect implementations.)

## Testing
- Frontend unit tests: `cd frontend && npm test` (Karma)
- Backend: no tests included by default

## Notes
- Questions use soft-delete (`isActive`) to preserve past submissions.
- Answers and question options are stored as JSON strings in the DB and parsed in repositories (see backend repositories under [backend/src/repositories](backend/src/repositories)).

For more details about the frontend dev workflow, see [frontend/README.md](frontend/README.md).