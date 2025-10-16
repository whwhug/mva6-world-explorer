# Project Setup Guide - Complete Recreation Instructions

This document contains everything needed to recreate this Lovable project identically.

---

## 📋 Project Overview

Interactive 3D globe application built with React, TypeScript, Vite, and Mapbox GL JS. Features student and university location visualization with guided tour functionality.

---

## 🔧 Environment Variables & API Keys

### Mapbox API Token (Required)
- **Variable Name**: Hardcoded in `src/components/Globe.tsx`
- **Location**: Line ~369: `mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';`
- **How to Get**: 
  1. Create account at https://mapbox.com/
  2. Navigate to Tokens section in dashboard
  3. Copy your public token
  4. Replace `'YOUR_MAPBOX_TOKEN_HERE'` with your actual token
- **Type**: Public token (safe for frontend)

**No other environment variables or API keys required.**

---

## 📦 Dependencies (package.json)

### Core Framework
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "vite": "latest",
  "@vitejs/plugin-react-swc": "latest"
}
```

### UI & Styling
```json
{
  "tailwindcss": "latest",
  "tailwindcss-animate": "^1.0.7",
  "tailwind-merge": "^2.6.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.462.0"
}
```

### Radix UI Components (shadcn/ui)
```json
{
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-aspect-ratio": "^1.1.7",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-collapsible": "^1.1.11",
  "@radix-ui/react-context-menu": "^2.2.15",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-hover-card": "^1.1.14",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-menubar": "^1.1.15",
  "@radix-ui/react-navigation-menu": "^1.2.13",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-radio-group": "^1.3.7",
  "@radix-ui/react-scroll-area": "^1.2.9",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.5",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-toggle": "^1.1.9",
  "@radix-ui/react-toggle-group": "^1.1.10",
  "@radix-ui/react-tooltip": "^1.2.7"
}
```

### Additional Libraries
```json
{
  "mapbox-gl": "^3.15.0",
  "@tanstack/react-query": "^5.83.0",
  "@hookform/resolvers": "^3.10.0",
  "react-hook-form": "^7.61.1",
  "zod": "^3.25.76",
  "sonner": "^1.7.4",
  "cmdk": "^1.1.1",
  "date-fns": "^3.6.0",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "next-themes": "^0.3.0",
  "react-day-picker": "^8.10.1",
  "react-resizable-panels": "^2.1.9",
  "recharts": "^2.15.4",
  "vaul": "^0.9.9"
}
```

---

## 📁 Critical Files & Assets

### Assets to Include (src/assets/)
1. **flipped-learning.mp4** - Video file for tour content
2. **mva-logo.png** - Logo image
3. **rebecca-timetable.avif** - Timetable image for tour

### Data Files (src/data/)
1. **students.csv** - Student location data with columns:
   - Name
   - Latitude
   - Longitude
   - Additional fields as per your data structure

2. **universities.csv** - University data with columns:
   - Name
   - Latitude
   - Longitude
   - Additional fields as per your data structure

### Public Files
- **robots.txt** - SEO configuration

---

## 🎨 Design System Configuration

### Key Files That Define Visual Identity

#### 1. src/index.css
- Contains CSS custom properties for colors (HSL format)
- Defines light/dark mode variables
- Includes gradients, shadows, and animations
- **Critical**: All colors use semantic tokens (--primary, --secondary, etc.)
- Mapbox control styling

#### 2. tailwind.config.ts
- Extends Tailwind with custom colors mapped to CSS variables
- Defines container settings
- Custom animations (accordion, fade-in, scale-in, pulse-glow)
- Border radius tokens
- **Important**: Uses `hsl(var(--variable-name))` format for colors

**⚠️ Design System Rule**: Never use direct colors like `text-white`, `bg-black`. Always use semantic tokens from the design system.

---

## 🗂️ Project Structure

```
project-root/
├── src/
│   ├── assets/
│   │   ├── flipped-learning.mp4
│   │   ├── mva-logo.png
│   │   └── rebecca-timetable.avif
│   ├── components/
│   │   ├── ui/              # shadcn components (40+ files)
│   │   ├── Globe.tsx        # Main 3D globe component
│   │   ├── Header.tsx       # Top navigation
│   │   └── MarkerPopup.tsx  # Location detail popup
│   ├── data/
│   │   ├── students.csv
│   │   └── universities.csv
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   └── utils.ts         # cn() helper function
│   ├── pages/
│   │   ├── Index.tsx        # Main page with Globe
│   │   └── NotFound.tsx     # 404 page
│   ├── utils/
│   │   ├── studentData.ts   # CSV parser for students
│   │   └── universityData.ts # CSV parser for universities
│   ├── App.tsx              # Router setup
│   ├── index.css            # Global styles + design system
│   └── main.tsx             # App entry point
├── public/
│   └── robots.txt
├── index.html
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🔄 Component Architecture

### Globe.tsx - Main Component
**Responsibilities:**
- Initializes Mapbox GL map with globe projection
- Loads student and university data from CSV files
- Creates custom HTML markers for locations
- Manages tour navigation through locations
- Handles map interactions (rotation, zoom)
- Toggle visibility of student/university markers

**Key Features:**
- Auto-rotating globe (240 seconds per revolution)
- Atmosphere and fog effects
- Custom marker tooltips
- Tour system with previous/next navigation
- Layer toggles for students and universities

**State Management:**
- Map instance ref
- Selected location for popup
- Loading states
- Student/university data arrays
- Marker visibility toggles
- Tour navigation state

### MarkerPopup.tsx
Displays detailed information about selected location with media support (images/videos).

### Header.tsx
Top navigation bar component.

---

## 📊 Data Structure

### Student CSV Format
Parsed by `src/utils/studentData.ts`
- Must include: Name, Latitude, Longitude
- Additional fields supported

### University CSV Format
Parsed by `src/utils/universityData.ts`
- Must include: Name, Latitude, Longitude
- Additional fields supported

### Tour Content Structure (in Globe.tsx)
```typescript
const TOUR_CONTENT: Record<string, { description: string; media?: string }> = {
  "Location Name": {
    description: "Description text",
    media: "/path/to/media.mp4"
  }
}
```

---

## 🚀 Setup Instructions

### Step 1: Create New Lovable Project
1. Start fresh Lovable project
2. Enable TypeScript and React

### Step 2: Install Dependencies
Copy all dependencies from the Dependencies section above. In Lovable, use the chat to install packages:
```
"Install these packages: mapbox-gl @tanstack/react-query [etc...]"
```

### Step 3: Configure Design System
1. Replace `src/index.css` with the version from this project
2. Replace `tailwind.config.ts` with the version from this project

### Step 4: Copy All Source Files
Copy files in this order:
1. `src/lib/utils.ts`
2. All files in `src/components/ui/` (40+ shadcn components)
3. `src/utils/studentData.ts` and `universityData.ts`
4. `src/data/students.csv` and `universities.csv`
5. `src/components/Header.tsx`, `MarkerPopup.tsx`, `Globe.tsx`
6. `src/pages/Index.tsx` and `NotFound.tsx`
7. `src/App.tsx`
8. `src/main.tsx`

### Step 5: Add Assets
Upload all files from `src/assets/` and `public/` to the new project.

### Step 6: Add Mapbox Token
1. Get token from https://mapbox.com/
2. Open `src/components/Globe.tsx`
3. Find line: `mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';`
4. Replace with your actual token

### Step 7: Configure Vite
Ensure `vite.config.ts` matches the configuration from this project (path aliases, port, etc.)

### Step 8: Test
1. Preview the application
2. Verify globe loads and rotates
3. Test student/university markers
4. Verify tour navigation works
5. Check all media assets load correctly

---

## 🎯 Critical Configuration Details

### Path Aliases
```typescript
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

### Mapbox GL CSS Import
Ensure in `src/components/Globe.tsx`:
```typescript
import 'mapbox-gl/dist/mapbox-gl.css';
```

### Router Configuration
- Base route: `/` → Index page with Globe
- Catch-all: `*` → NotFound page

---

## 🐛 Common Issues & Solutions

### Issue: Globe Not Rendering
- **Solution**: Verify Mapbox token is valid and added correctly
- Check browser console for Mapbox errors

### Issue: Markers Not Showing
- **Solution**: Verify CSV files are in correct location (`src/data/`)
- Check CSV parsing in browser console

### Issue: Styles Not Matching
- **Solution**: Ensure `index.css` and `tailwind.config.ts` match exactly
- Verify all CSS variables are defined in both light/dark modes

### Issue: Tour Not Working
- **Solution**: Verify `TOUR_CONTENT` object includes all tour locations
- Check that `tourOrder` array references valid location names

### Issue: Assets Not Loading
- **Solution**: Verify all files in `src/assets/` are uploaded
- Check import paths in components

---

## 📝 Additional Notes

### No Backend Required
This is a frontend-only application. No database, authentication, or backend services needed.

### CSV Data Customization
To modify locations:
1. Edit CSV files in `src/data/`
2. Update `TOUR_CONTENT` in `Globe.tsx` for new tour stops
3. Update `tourOrder` array for tour sequence

### Mapbox Styling
Globe uses `mapbox://styles/mapbox/light-v11` style. Can be changed in Globe.tsx initialization.

### Performance Considerations
- Globe rotation uses requestAnimationFrame
- Markers use HTML elements (consider WebGL for 1000+ markers)
- CSV parsing is async to avoid blocking

---

## ✅ Verification Checklist

- [ ] All dependencies installed
- [ ] Design system files (index.css, tailwind.config.ts) copied
- [ ] All source files copied maintaining directory structure
- [ ] CSV data files in correct location
- [ ] Assets uploaded (images, videos)
- [ ] Mapbox token added
- [ ] Application builds without errors
- [ ] Globe renders and rotates
- [ ] Markers visible and interactive
- [ ] Tour navigation works
- [ ] Popup shows correct information
- [ ] Light/dark mode works
- [ ] Responsive design functions correctly

---

## 🎓 Design System Best Practices

When making future changes:
1. **Never use direct colors** - Always use semantic tokens
2. **Define variants in components** - Don't override with className
3. **Extend design system** - Add new tokens to index.css
4. **Maintain HSL format** - All colors in HSL for consistency
5. **Use CVA for variants** - Leverage class-variance-authority

---

**Last Updated**: 2025-10-16
**Project Type**: Frontend React Application
**Framework**: Vite + React + TypeScript
**Deployment**: Can be deployed to any static hosting (Lovable, Vercel, Netlify, etc.)
