# Evaaz school registration

The registration form has four required fields in Arabic and English:

| Arabic | English | API field |
| --- | --- | --- |
| اسم المدرسة أو الفرع | School or branch name | `schoolName` |
| اسم المشرف | Supervisor name | `contractManagerName` |
| رقم الجوال | Mobile number | `phoneNumber` |
| الإيميل | Email | `email` |

The language switch translates navigation, validation, status messages, login, and dashboard, with RTL for Arabic and LTR for English.

Start the API in the sibling `evaazPoll` directory, then run `npm run dev` here.

- Form: http://localhost:5173/form
- Admin login: http://localhost:5173/login
- Dashboard: http://localhost:5173/dashboard

The public navigation contains Home and Registration only. Open `/dashboard` directly for administration; it redirects to login when the admin session is missing or expired.

The dashboard supports total/today/month/matching statistics, search across all four fields, school and inclusive date filters, sorting and pagination. Add, view, edit and delete registrations from the dashboard; deletion requires confirmation. Excel export downloads a real `.xlsx` containing all matching results across every page, preserving Arabic text and mobile-number leading zeroes.

Use `admin` in the email or username field. Its password is configured in the backend's ignored `.env` file; the frontend contains no admin password.

The frontend uses `/api` on the same website in development and production. Vite proxies development requests to `http://127.0.0.1:8000`. An optional `VITE_API_BASE_URL` overrides this, but no override is needed for local or VPS deployment.

`npm run build` creates `dist/`, which the backend serves automatically. See [VPS Docker deployment instructions](https://github.com/yousefsalah14/evaazPoll/blob/main/DEPLOYMENT.md) for cloning both repositories side by side and running the frontend, backend and persistent local MongoDB together. Docker/Compose files live in the backend repository.

Run `npm test` for search, date filtering, sorting and Excel export checks, and `npm run lint` for source checks.
