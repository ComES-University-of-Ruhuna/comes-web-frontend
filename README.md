# ComES Website - Computer Engineering Society

<div align="center">
  <img src="public/logo.png" alt="ComES Logo" width="120" />
  
  **Official Website of the Computer Engineering Society**  
  *Department of Electrical and Information Engineering, University of Ruhuna*
  
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 About

The ComES Website serves as the digital platform for the Computer Engineering Society at the University of Ruhuna. It provides information about events, projects, team members, and resources for computer engineering students.

### Purpose
- Disseminate knowledge of computer engineering theory and practice
- Promote professional development of students
- Enhance social interaction among ComES members
- Showcase student projects and achievements

---

## ✨ Features

### Public Features
- 🏠 **Home Page** - Hero section, about preview, upcoming events, testimonials
- 📖 **About Page** - Society history, mission, vision, and achievements
- 📅 **Events Page** - Browse and filter upcoming and past events
- 👥 **Team Page** - Executive board and subgroup members
- 🚀 **Projects Page** - Student project showcase with filtering
- 🖼️ **Gallery Page** - Photo gallery with lightbox viewer
- 📝 **Blog Page** - Articles and news from the society
- 📞 **Contact Page** - Contact form and society information
- ❓ **FAQ Page** - Frequently asked questions

### Student Portal
- 🔐 **Authentication** - Student registration and login (EG/20XX/XXXX format)
- 📊 **Dashboard** - Personalized student dashboard
- 👤 **Profile Management** - Edit profile information and change password
- 🎫 **Event Registration** - Register for events and track registrations
- ⚙️ **Settings** - Notification preferences and theme settings
- 🔔 **Notifications** - Real-time notification system

### Admin Panel
- 📈 **Dashboard** - Analytics and overview statistics
- 📝 **Blog Management** - Create, edit, and publish blog posts
- 📅 **Events Management** - Manage events and registrations
- 🚀 **Projects Management** - Manage student projects
- 👥 **Team Management** - Manage executive board members
- 📬 **Contacts** - View and respond to contact submissions
- 📧 **Newsletter** - Manage newsletter subscribers
- ⚙️ **Settings** - Site configuration

### UI/UX Features
- 🌓 **Dark/Light Theme** - System-aware theme with manual toggle
- 🖱️ **Custom Cursor** - Modern animated cursor with hover effects
- ✨ **Animations** - Smooth page transitions and micro-interactions
- 📱 **Responsive Design** - Mobile-first responsive layout
- ⚡ **Fast Loading** - Optimized performance with code splitting

---

## 🛠️ Tech Stack

### Core
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0 | UI Library |
| TypeScript | 5.6 | Type Safety |
| Vite | 6.0 | Build Tool |
| React Router | 7.4 | Routing |

### Styling
| Technology | Purpose |
|------------|---------|
| Tailwind CSS 4.1 | Utility-first CSS |
| Framer Motion | Animations |
| Lucide React | Icons |

### State Management
| Technology | Purpose |
|------------|---------|
| Zustand | Global state management |
| Axios | HTTP client |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| Commitlint | Commit message linting |

---

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/
│   ├── layout/          # Layout components (Navbar, Footer, Layout)
│   ├── ui/              # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── NotificationsDropdown.tsx
│   │   ├── PageTransition.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── UserProfileDropdown.tsx
│   │   └── ...
│   ├── ProtectedRoute.tsx
│   └── index.ts
├── constants/           # App constants and configuration
├── data/                # Static data (mock data for development)
│   ├── blog.ts
│   ├── events.ts
│   ├── gallery.ts
│   ├── projects.ts
│   ├── team.ts
│   └── testimonials.ts
├── hooks/               # Custom React hooks
│   ├── useApi.ts
│   └── index.ts
├── pages/
│   ├── admin/           # Admin panel pages
│   │   ├── AdminLayout.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── BlogManagementPage.tsx
│   │   └── ...
│   ├── student/         # Student portal pages
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── EventsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── EventsPage.tsx
│   └── ...
├── services/            # API service layer
│   ├── api.ts           # Axios instance
│   ├── auth.service.ts
│   ├── blog.service.ts
│   ├── events.service.ts
│   ├── student.service.ts
│   └── ...
├── store/               # Zustand stores
│   ├── authStore.ts     # Admin authentication
│   ├── studentStore.ts  # Student authentication
│   ├── themeStore.ts    # Theme management
│   ├── notificationStore.ts
│   └── index.ts
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/comes-website.git
   cd comes-website/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format:check` | Check code formatting |
| `npm run format:write` | Format code with Prettier |
| `npm run validate` | Format, lint, and build (CI pipeline) |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api/v1

# Optional: Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Optional: Feature Flags
VITE_ENABLE_STUDENT_PORTAL=true
VITE_ENABLE_ADMIN_PANEL=true
```

---

## 🌐 Deployment

### Vercel (Recommended)

The project includes a `vercel.json` configuration for seamless deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
# Build for production
npm run build

# Output is in dist/ directory
# Serve with any static file server
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🤝 Contributing

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
```bash
git commit -m "feat(events): add event registration feature"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs: update README with deployment instructions"
```

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run validate` to ensure code quality
4. Submit a pull request

### Code Style

- Follow the existing code patterns
- Use TypeScript strictly (no `any` types)
- Write meaningful component and variable names
- Add comments for complex logic

---

## 📄 License

This project is proprietary software of the Computer Engineering Society, University of Ruhuna.

---

## 📞 Contact

**Computer Engineering Society (ComES)**  
Department of Electrical and Information Engineering  
Faculty of Engineering  
University of Ruhuna, Sri Lanka

- 🌐 Website: [comesuor.lk](https://comesuor.lk)
- 📧 Email: contact@comesuor.lk
- 📍 Location: Faculty of Engineering, University of Ruhuna, Hapugala, Galle

---

<div align="center">
  <sub>Built with ❤️ by ComES Web Team</sub>
</div>
