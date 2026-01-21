# Nikolas Thiessen's Design System & Development Guide

**Version:** 1.0  
**Last Updated:** January 2025  
**Purpose:** A comprehensive design system and development guide to maintain consistency across all web projects.

---

## ðŸŽ¨ Design Philosophy

### Core Principle: "Radical Minimalism"
Inspired by Apple, Linear, and Swiss design principles. Focus on:
- **Typography over decoration** - Let content breathe
- **Whitespace as a design element** - Not empty space
- **Subtle micro-interactions** - Enhance, don't distract
- **Premium feel through restraint** - Less is more

### Design Values
1. **Quiet Luxury** - Sophisticated without being flashy
2. **Attention to Detail** - Every pixel matters
3. **Performance First** - Beautiful AND fast
4. **Accessible by Default** - Design for everyone

---

## ðŸŽ¨ Color System

### Light Mode (Primary)
```css
/* Base Colors */
--background: #f5f5f7;        /* Apple's soft light gray */
--surface: rgba(255, 255, 255, 0.7);  /* Frosted glass cards */

/* Text Hierarchy */
--text-primary: #1d1d1f;      /* Headlines, important text */
--text-secondary: #6e6e73;    /* Body text, descriptions */
--text-tertiary: #86868b;     /* Meta info, footnotes */

/* Accent Gradients (Soft Pastels) */
--accent-blue: #93c5fd;       /* blue-300 */
--accent-purple: #c4b5fd;     /* purple-300 */
--accent-pink: #fbcfe8;       /* pink-200 */

/* Gradient Combinations */
--gradient-primary: linear-gradient(135deg, #93c5fd 0%, #c4b5fd 50%, #fbcfe8 100%);
--gradient-subtle: radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.08) 0%, transparent 50%);
```

### Dark Mode (Optional)
```css
--background-dark: #000000;
--surface-dark: rgba(255, 255, 255, 0.05);
--text-primary-dark: #f5f5f7;
--text-secondary-dark: #86868b;
```

### Usage Rules
- **Never use pure black (#000)** in light mode - use #1d1d1f
- **Shadow opacity max: 0.08** in light mode - soft, not harsh
- **Gradient opacity: 6-12%** for ambient backgrounds
- **Glassmorphism: 70% opacity** with blur + saturation boost

---

## ðŸ“ Typography System

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Inter', sans-serif;
```

### Type Scale
```css
/* Headlines */
--font-size-hero: 80px;        /* Hero section */
--font-size-h1: 48px;          /* Page titles */
--font-size-h2: 32px;          /* Section headers */
--font-size-h3: 24px;          /* Card titles */

/* Body Text */
--font-size-body-lg: 22px;     /* Hero descriptions */
--font-size-body: 16px;        /* Regular text */
--font-size-body-sm: 14px;     /* Meta text */
--font-size-body-xs: 12px;     /* Labels, badges */

/* Letter Spacing */
--tracking-tight: -0.03em;     /* Headlines */
--tracking-normal: 0;          /* Body text */
--tracking-wide: 0.05em;       /* Labels, caps */
```

### Weight System
```css
--font-weight-regular: 400;    /* Body text */
--font-weight-medium: 500;     /* Emphasis */
--font-weight-semibold: 600;   /* Subheadings */
--font-weight-bold: 700;       /* Headlines */
```

### Typography Rules
1. **Headlines:** Bold (700), tight letter-spacing (-0.03em)
2. **Body:** Regular (400), secondary color (#6e6e73)
3. **Labels:** Semibold (600), uppercase, wide tracking (0.05em)
4. **Line Height:** 1.1 for headlines, 1.6 for body text

---

## ðŸ§Š Glassmorphism & Effects

### Glassmorphism Recipe
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 20px 40px rgba(0, 0, 0, 0.03);
}
```

### Gradient Border (Hover Effect)
```css
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, 
    rgba(147, 197, 253, 0.3), 
    rgba(196, 181, 253, 0.2),
    rgba(251, 207, 232, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.glass-card:hover::before {
  opacity: 1;
}
```

### Spotlight Effect (Hover)
```css
.glass-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.glass-card:hover::after {
  opacity: 1;
}
```

### Ambient Background Gradient
```css
.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(251, 207, 232, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(196, 181, 253, 0.06) 0%, transparent 50%);
  animation: gradient-shift 20s ease infinite;
  z-index: 0;
}

@keyframes gradient-shift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## âœ¨ Animation System

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);  /* Material Design */
--ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1);  /* Apple style */
```

### Core Animations

#### 1. Float Animation (Profile Photo)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.02); }
}

.floating-element {
  animation: float 6s ease-in-out infinite;
}
```

#### 2. Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

.glow-effect {
  animation: pulse-glow 4s ease-in-out infinite;
}
```

#### 3. Card Hover (Standard)
```css
.card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(147, 197, 253, 0.12);
}
```

#### 4. Shimmer Effect (Loading States)
```css
@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.shimmer::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 3s infinite;
}
```

#### 5. Fade In (Page Load)
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}
```

### Animation Rules
1. **Duration:** 0.3s for interactions, 0.6s for entrances, 3-6s for ambient
2. **Delay:** Stagger by 0.1s for sequential animations
3. **Never animate layout** - Use transform/opacity only
4. **Respect prefers-reduced-motion**

---

## ðŸ—ï¸ Component Patterns

### Bento Grid Layout
```jsx
// Responsive grid that breaks gracefully
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  <Card className="col-span-2">Featured Content</Card>
  <Card>Regular Content</Card>
  <Card>Regular Content</Card>
  <Card className="col-span-2">Wide Content</Card>
</div>
```

### Glass Card Component
```jsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: CardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl p-10",
      "bg-white/70 backdrop-blur-xl backdrop-saturate-[180%]",
      "shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.03)]",
      "border border-black/[0.08]",
      hover && "transition-all duration-400 cursor-pointer",
      hover && "hover:bg-white/85 hover:-translate-y-2 hover:scale-[1.02]",
      hover && "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(147,197,253,0.12)]",
      className
    )}>
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-blue-300/30 via-purple-300/20 to-pink-200/30" 
             style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor' }} />
      </div>
      
      {/* Spotlight effect */}
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)' }} />
      
      {children}
    </div>
  );
}
```

### Button System
```jsx
// Primary Button
<button className="
  px-6 py-3 rounded-xl
  bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200
  text-white font-semibold text-sm tracking-wide
  shadow-lg shadow-blue-300/25
  hover:scale-105 hover:shadow-xl hover:shadow-purple-300/30
  transition-all duration-300
">
  Call to Action
</button>

// Secondary Button (Ghost)
<button className="
  px-6 py-3 rounded-xl
  bg-white/50 backdrop-blur-md
  border border-black/10
  text-gray-900 font-medium text-sm
  hover:bg-white/80 hover:border-blue-300/30
  transition-all duration-300
">
  Secondary Action
</button>

// Icon Button
<button className="
  w-11 h-11 rounded-xl
  bg-white/70 backdrop-blur-md
  border border-black/8
  flex items-center justify-center
  hover:bg-white/95 hover:border-blue-300/30 hover:-translate-y-1
  shadow-sm hover:shadow-md
  transition-all duration-300
">
  <Icon className="w-5 h-5 text-gray-700" />
</button>
```

---

## ðŸ“± Responsive Design

### Breakpoints
```css
/* Tailwind defaults */
sm: 640px   /* Mobile landscape, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach
```jsx
// Always start with mobile, layer up
<div className="
  text-2xl           // Mobile
  md:text-4xl        // Tablet
  lg:text-6xl        // Desktop
">
```

### Grid Patterns
```jsx
// 1 column mobile â†’ 2 tablet â†’ 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" />

// Full width mobile â†’ 2 columns desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-5" />

// Auto-fit for dynamic content
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5" />
```

### Image Sizing Rules
```jsx
// Fixed dimensions to prevent stretching at zoom
<Image 
  src="/image.png"
  width={180}
  height={180}
  className="w-[180px] h-[180px] object-cover rounded-2xl"
  alt="Description"
/>
```

---

## ðŸ› ï¸ Tech Stack Preferences

### Mandatory Stack
```json
{
  "framework": "Next.js 14 (App Router)",
  "styling": "Tailwind CSS v3",
  "animation": "Framer Motion",
  "icons": "Lucide React",
  "fonts": "System fonts (SF Pro Display fallback)",
  "hosting": "Vercel",
  "package-manager": "npm"
}
```

### Package.json Template
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### Why Tailwind v3 (Not v4)
- v4 uses a new config system that can cause issues
- v3 is production-stable with better Cursor/AI compatibility
- Easier to debug and more predictable

---

## ðŸ“‹ Project Structure Template

```
project-name/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ globals.css          # Global styles, animations, custom utilities
â”‚   â”œâ”€â”€ layout.tsx           # Root layout (background gradient, fonts)
â”‚   â””â”€â”€ page.tsx             # Main page
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ui/                  # Reusable UI components
â”‚   â”‚   â”œâ”€â”€ card.tsx
â”‚   â”‚   â”œâ”€â”€ button.tsx
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”œâ”€â”€ sections/            # Page sections
â”‚   â”‚   â”œâ”€â”€ hero.tsx
â”‚   â”‚   â”œâ”€â”€ bento-grid.tsx
â”‚   â”‚   â””â”€â”€ footer.tsx
â”‚   â””â”€â”€ ...                  # Feature-specific components
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ utils.ts             # cn() helper, utilities
â”‚   â””â”€â”€ constants.ts         # Colors, URLs, config
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ images/              # All images
â”‚   â””â”€â”€ ...
â”œâ”€â”€ tailwind.config.ts       # Tailwind configuration
â”œâ”€â”€ next.config.ts           # Next.js config
â””â”€â”€ package.json
```

---

## ðŸŽ¯ Development Workflow

### 1. Initial Setup
```bash
# Create Next.js project
npx create-next-app@latest project-name --typescript --tailwind --app

# Install dependencies
cd project-name
npm install framer-motion lucide-react clsx tailwind-merge class-variance-authority

# Start dev server
npm run dev
```

### 2. Tailwind Config Setup
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f5f5f7",
        primary: "#1d1d1f",
        secondary: "#6e6e73",
        tertiary: "#86868b",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

### 3. Utils Helper (cn function)
```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4. Global Styles Template
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-[#f5f5f7] text-[#1d1d1f] antialiased;
  }
}

@layer utilities {
  .glass-card {
    @apply bg-white/70 backdrop-blur-xl backdrop-saturate-[180%] rounded-3xl;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 40px rgba(0, 0, 0, 0.03);
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-[#1d1d1f] to-[#6e6e73] bg-clip-text text-transparent;
  }
}
```

---

## ðŸ¤– AI Development with Cursor

### Best Practices for Prompts

#### âœ… Good Prompts
```
"Create a glass morphism card component with hover effects matching my design system. 
Use the gradient colors (#93c5fd, #c4b5fd, #fbcfe8) and implement the -translate-y-2 
scale-[1.02] hover animation."

"Add a hero section following the Apple minimalist style. Large bold headline with 
-0.03em letter spacing, secondary color (#6e6e73) description, and floating profile 
photo with the gradient glow effect."

"Build a bento grid layout that's 1 column on mobile, 2 on tablet, 3 on desktop. 
Cards should have glassmorphism effect and gradient border reveal on hover."
```

#### âŒ Avoid Vague Prompts
```
"Make it look nice"
"Add some animations"
"Style this better"
```

### Cursor Composer Commands

#### Replace Entire File
```
Replace the ENTIRE contents of components/hero.tsx with exactly this code. 
Do not modify or improve anything:

[paste code here]
```

#### Component Generation
```
Create a new file at components/ui/button.tsx with a Button component that:
- Has 3 variants: primary, secondary, ghost
- Uses my gradient colors for primary variant
- Implements the hover scale effect
- Accepts className prop for customization
- Uses the cn() utility for class merging
```

#### Style Debugging
```
The cards aren't showing the glassmorphism effect. Check:
1. Is backdrop-blur-xl applied correctly?
2. Is bg-white/70 using the right opacity?
3. Are the shadows following the design system?
Debug and fix while maintaining all other styles.
```

---

## ðŸ“ Design Patterns & Conventions

### Naming Conventions
```typescript
// Components: PascalCase
GlassCard.tsx
HeroSection.tsx

// Files: kebab-case
bento-grid.tsx
social-links.tsx

// CSS Classes: Tailwind utility classes
className="bg-white/70 backdrop-blur-xl"

// Constants: SCREAMING_SNAKE_CASE
const GRADIENT_COLORS = {
  BLUE: '#93c5fd',
  PURPLE: '#c4b5fd',
  PINK: '#fbcfe8',
};
```

### Component Structure
```typescript
// 1. Imports (grouped)
import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  description?: string;
  className?: string;
}

// 3. Component
export function Component({ title, description, className }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = React.useState(false);
  
  // 5. Handlers
  const handleClick = () => {
    setState(!state);
  };
  
  // 6. Render
  return (
    <div className={cn("base-classes", className)}>
      {/* Component content */}
    </div>
  );
}
```

### File Organization Rules
1. **One component per file** (unless tightly coupled)
2. **Co-locate related files** (component + styles + tests)
3. **Index files for clean imports**
4. **Separate business logic from UI**

---

## âœ… Quality Checklist

### Before Committing
- [ ] All images have alt text
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Hover states work correctly
- [ ] Loading states implemented
- [ ] Animations respect prefers-reduced-motion
- [ ] Console has no errors
- [ ] Lighthouse score >90

### Performance
- [ ] Images optimized (WebP format)
- [ ] Lazy loading for below-fold content
- [ ] No layout shift (CLS < 0.1)
- [ ] Interactive in < 3 seconds

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader friendly

---

## ðŸš€ Deployment Checklist

### Vercel Setup
1. **Connect GitHub repo**
2. **Set Framework:** Next.js (auto-detected)
3. **Root Directory:** `.` (if files at root)
4. **Environment Variables:** Add if needed
5. **Domain:** Configure DNS (A record + CNAME)

### DNS Configuration (Example: Porkbun)
```
Type: A
Host: @ (blank)
Value: 76.76.21.21

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

### Post-Deploy
- [ ] Test production URL
- [ ] Verify SSL certificate
- [ ] Check all links work
- [ ] Test on mobile device
- [ ] Add to portfolio

---

## ðŸ”§ Troubleshooting

### Styles Not Updating
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Vercel Build Failing
1. Check `next.config.ts` is correct
2. Verify all imports are correct
3. Check environment variables
4. Look at build logs for errors

### Images Not Showing
```typescript
// âŒ Wrong
<img src="images/photo.jpg" />

// âœ… Correct (from public folder)
<Image src="/images/photo.jpg" width={180} height={180} alt="Description" />
```

### Glassmorphism Not Working
```css
/* Make sure parent has background */
body { background: #f5f5f7; }

/* Card needs all three properties */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
```

---

## ðŸ“š Reference Links

- **Design Inspiration:** 
  - [apple.com](https://apple.com)
  - [linear.app](https://linear.app)
  - [rauno.me](https://rauno.me)
  
- **Documentation:**
  - [Next.js Docs](https://nextjs.org/docs)
  - [Tailwind CSS](https://tailwindcss.com/docs)
  - [Framer Motion](https://www.framer.com/motion/)

- **Tools:**
  - [Coolors](https://coolors.co) - Color palettes
  - [Realtime Colors](https://realtimecolors.com) - Color testing
  - [Lucide Icons](https://lucide.dev) - Icon library

---

## ðŸ’¡ Pro Tips

1. **Start with wireframes** - Design in HTML first, style second
2. **Mobile-first always** - Desktop is easier to scale up than mobile down
3. **Use fixed image dimensions** - Prevents stretching at different zoom levels
4. **Test at 67%, 80%, 100%, 125%, 150% zoom** - Real users zoom
5. **One gradient per view** - Too many becomes chaotic
6. **White space is not wasted space** - It's part of the design
7. **Hover states matter** - They provide feedback and delight
8. **Consistency > Creativity** - Follow your system
9. **Commit often** - Small commits are easier to debug
10. **Document decisions** - Future you will thank present you

---

## ðŸ“ Instructions for Claude/AI Assistants

When working with this design system:

1. **Always reference this document first** before making design decisions
2. **Use the exact color values** specified (don't approximate)
3. **Follow the component patterns** - don't reinvent
4. **Implement all three effects** for glass cards:
   - Background with blur
   - Gradient border on hover
   - Spotlight effect on hover
5. **Responsive by default** - Mobile-first approach
6. **Test at multiple breakpoints** - Don't assume it works
7. **Maintain consistency** - Use existing patterns
8. **Ask for clarification** if something conflicts with the system
9. **Suggest improvements** if you see opportunities
10. **Document new patterns** when extending the system

### Example AI Prompt for New Projects
```
I'm starting a new [project type] and want to use my design system.
Please reference my DESIGN_SYSTEM.md file and create:
1. Initial project structure
2. Tailwind config with my colors
3. A hero section following my style
4. A bento grid with glass cards
5. Responsive footer

Use the exact colors, animations, and component patterns from my design system.
```

---

**Remember:** This is a living document. Update it as you refine your design language and discover new patterns.

**Version History:**
- v1.0 (Jan 2025) - Initial design system based on niko-thiessen.com
