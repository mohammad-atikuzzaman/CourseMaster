# CourseMaster Frontend

**Overview**
- Next.js App Router UI for courses, learning, assignments, dashboard.
- Global Redux Toolkit state for auth, courses, enrollments, assignments.
- Axios client with JWT interceptor and API base `http://localhost:8080/api`.

**Tech Stack**
- Next.js 16, React 19
- Redux Toolkit, React Redux
- Tailwind CSS
- Lucide icons, react-hot-toast

**Setup**
- Requirements: Node 18+
- Install: `npm install`
- Development: `npm run dev` (http://localhost:3000)
- Lint: `npm run lint`
- Build: `npm run build` → `npm start`

**Configuration**
- API base in `lib/api.ts`:
  - `baseURL: 'http://localhost:8080/api'`
  - JWT added from `localStorage` into `Authorization` header automatically.

**Key Paths**
- `app/layout.tsx` – global layout, ReduxProvider, Navbar, Footer
- `app/page.tsx` – home, featured courses
- `app/courses` – listing and course detail pages
- `app/dashboard` – student and admin/instructor dashboards
- `app/learn/[courseId]` – course player, modules, assignments entry
- `app/learn/[courseId]/assignments` – submissions review and grading (admin/instructor)
- `(auth)/login`, `(auth)/register` – authentication

**State Slices**
- `redux/features/auth/authSlice.ts` – login/register/logout, stores user/token
- `redux/features/courses/courseSlice.ts` – courses list/detail
- `redux/features/enrollments/enrollmentSlice.ts` – my enrollments, progress
- `redux/features/assignments/assignmentSlice.ts` – assignments, submissions, grading

**Navigation**
- Navbar with links: Home, Courses, My Courses, Dashboard (for admin/instructor); mobile menu included.
- Active route highlighting and responsive behavior.

**Learning & Assignments**
- Course player shows modules and progress; students submit `repoUrl`/`deploymentUrl`.
- Review page lets admin/instructor load submissions and set scores.

**Usage Flow**
- Register or login
- Browse courses and enroll
- Learn modules, mark complete → progress updates
- Submit assignment from player
- Instructors/Admins review submissions and grade

**Accessibility & UX**
- Mobile menus and module lists for small screens
- Deterministic date rendering to avoid hydration mismatch
- Toasts enabled

**Notes**
- Ensure backend runs at `http://localhost:8080` or update `lib/api.ts`.
- JWT token is stored in `localStorage` on login and used for API requests.
- For admin, instructor, student access this email should be (admin@example.com , jane@example.com, and john@example.com)
- The password is (123456)
- Or You can check the seeder.js file at backend for get admin, instructor and student credentials..
