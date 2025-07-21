# Link Saver + Auto-Summary

A full-stack Next.js application to save, auto-summarize, and manage your favorite links. Features user authentication, MongoDB storage, auto-fetching of title, favicon, and summary (via Jina AI), tag filtering, dark mode, drag-and-drop reordering, and a clean, responsive UI.

# Live Demo

You can view the hosted project here: [https://link-saver-project-84l4.vercel.app](https://link-saver-project-84l4.vercel.app)

---

## 🚀 Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs
- **HTTP:** axios
- **Summary:** Jina AI open endpoint
- **Drag-and-drop:** @hello-pangea/dnd

---

## 🛠️ Setup Instructions
1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd link-saver-project
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   - Create a `.env.local` file in the root:
     ```env
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```
   - Use your MongoDB Atlas URI or local MongoDB instance.
4. **Run the app:**
   ```sh
   npm run dev
   ```
5. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## ✨ Features
- Sign up & login (JWT-based, with validation and error handling)
- Save bookmarks (auto-fetch title, favicon, summary)
- List, filter (by tag), and delete bookmarks
- Drag-and-drop reordering of bookmarks
- Responsive grid/list UI
- Dark mode support
- Logout from home or bookmarks page
- Clean, reusable, and well-commented code
- **No top navbar:** Navigation is contextual and minimal

---

## 🔒 Authentication Flow
- **Signup/Login:**
  - Validates email format and password (min 6 chars) on both frontend and backend
  - Shows clear error messages and loading indicators
  - Redirects logged-in users away from login/signup
- **JWT:**
  - Token is stored in localStorage
  - All bookmark API requests require a valid JWT
- **Logout:**
  - Available on home and bookmarks page
  - Clears token and redirects to login

---

## 🧪 Testing
- Unit/component tests are in the `__tests__` folder (see below for running instructions)
- To run tests:
  ```sh
  npm run test
  ```

---

## 📸 Screenshots / Demo

Sample screenshots from the app (see `public/screenshots/`):

| Screenshot 1 | Screenshot 2 | Screenshot 3 | Screenshot 4 |
|--------------|--------------|--------------|--------------|
| ![Screenshot 1](public/screenshots/Screenshot%202025-07-21%20at%209.50.42%E2%80%AFPM.png) | ![Screenshot 2](public/screenshots/Screenshot%202025-07-21%20at%209.50.49%E2%80%AFPM.png) | ![Screenshot 3](public/screenshots/Screenshot%202025-07-21%20at%209.52.50%E2%80%AFPM.png) | ![Screenshot 4](public/screenshots/Screenshot%202025-07-21%20at%209.53.07%E2%80%AFPM.png) |

> You can add more screenshots or a GIF demo to the `public/screenshots/` folder and reference them here.

---

## ⏳ Time Spent
- **Total:** 2 days
- Includes setup, coding, testing, and documentation

---

## 💡 What I'd Do Next
- Add social login (Google, GitHub)
- Add bookmark editing and tag management UI
- Add pagination and search
- Improve error handling and user feedback
- Add e2e tests (Cypress/Playwright)
- **Browser extension for 1-click saving:** Build a Chrome/Firefox extension to save links directly from the browser toolbar into the app with one click.

---

## Author
- **Ayush Negi**
- Email: [ayushnegi369@gmail.com](mailto:ayushnegi369@gmail.com)
- Portfolio: [ayushnegi22.vercel.app](https://ayushnegi22.vercel.app)
- Contact: +918368465119

