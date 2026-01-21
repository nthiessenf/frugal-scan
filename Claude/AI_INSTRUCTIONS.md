# AI Assistant Instructions - Nikolas's Design System

**Purpose:** This file tells AI assistants (Claude, ChatGPT, Cursor, etc.) how to work with Nikolas's design system.

---

## ðŸ¤– How to Use This System

When Nikolas uploads these files to a new project, you (the AI assistant) should:

1. **Read `DESIGN_SYSTEM.md` first** - This is the source of truth
2. **Reference `QUICK_REFERENCE.md`** for rapid code snippets
3. **Follow these instructions** for context and best practices

---

## ðŸŽ¯ Core Principles You Must Follow

### 1. Design Consistency is Sacred
- **ALWAYS use the exact colors** specified in DESIGN_SYSTEM.md
  - Don't approximate: Use `#1d1d1f` not `#1d1d1e` or `black`
  - Don't suggest alternatives without asking first
- **ALWAYS implement the complete effect stack**
  - Glass cards need: background blur + gradient border + spotlight
  - Don't skip effects to "simplify" - they're intentional
- **ALWAYS maintain the animation timing**
  - 0.4s for interactions, 6s for ambient animations
  - Use specified easing functions

### 2. Apple-Style Minimalism
- **Less is more** - Don't add decorative elements
- **Whitespace is intentional** - Don't try to "fill" empty space
- **Subtle over flashy** - Effects should enhance, not distract

### 3. Technical Standards
- **Next.js 14 App Router** - Not Pages Router
- **Tailwind CSS v3** - Not v4 (compatibility reasons)
- **TypeScript** - Always type components
- **Mobile-first** - Start with mobile, scale up

---

## ðŸ“‹ Your Development Checklist

Before suggesting any code, verify:

- [ ] Are you using the correct color values from the design system?
- [ ] Does the glass card have all three effects (blur, border, spotlight)?
- [ ] Is the component responsive (mobile â†’ tablet â†’ desktop)?
- [ ] Are hover states implemented correctly (-translate-y-2 scale-[1.02])?
- [ ] Are animations using the right duration and easing?
- [ ] Are images using fixed dimensions (prevents zoom issues)?
- [ ] Is TypeScript properly typed?

---

## ðŸ’¬ How to Interpret Nikolas's Requests

### Request Types & Responses

#### "Make it look like my design system"
```
Response: Implement with:
- Glassmorphism cards (bg-white/70 backdrop-blur-xl)
- Soft pastel gradients (#93c5fd, #c4b5fd, #fbcfe8)
- Hover effects (-translate-y-2 scale-[1.02])
- Apple-style typography (bold headlines, -0.03em tracking)
```

#### "Add a card component"
```
Response: Create glass card with:
1. Base glassmorphism styles
2. Gradient border reveal on hover
3. Spotlight effect on hover
4. Proper responsive padding
5. TypeScript interface for props
```

#### "This doesn't look right"
```
Response: Debug checklist:
1. Check if colors match exactly
2. Verify all three glass effects present
3. Test hover states
4. Check at multiple zoom levels (67%, 100%, 150%)
5. Validate responsive breakpoints
```

#### "Make it pop more"
```
Response: Nikolas prefers subtle elegance over "pop"
Suggest:
- Slightly stronger gradient on hover
- Add subtle pulse animation
- Increase shadow opacity slightly (still max 0.12)
BUT ask first: "Would you like to enhance the hover effect while maintaining the minimalist aesthetic?"
```

---

## ðŸš¨ Common Mistakes to Avoid

### âŒ Don't Do This:
1. **Approximating colors** - "I'll use a similar gray" â†’ NO, use exact hex
2. **Simplifying effects** - "Let's skip the spotlight" â†’ NO, full effect stack
3. **Using pure black** - `color: black` â†’ NO, use `#1d1d1f`
4. **Suggesting Tailwind v4** â†’ NO, v3 only
5. **Adding decorative elements** - borders, icons, etc. â†’ Ask first
6. **Using vh/vw units** - Can cause mobile issues â†’ Use fixed or %
7. **Animating width/height** - Performance issues â†’ transform/opacity only
8. **Forgetting mobile-first** - Desktop styles first â†’ NO, mobile first

### âœ… Do This Instead:
1. Copy exact color values from DESIGN_SYSTEM.md
2. Implement complete effect stack
3. Use specified color variables
4. Stick to Tailwind v3
5. Embrace whitespace and simplicity
6. Use px or rem units
7. Animate with transform/opacity
8. Style mobile first, layer up

---

## ðŸŽ¨ Color Reference (Memorize These)

```css
/* These are sacred - never approximate */
Background: #f5f5f7    (not #f5f5f5 or #fafafa)
Primary:    #1d1d1f    (not #000000 or #1a1a1a)
Secondary:  #6e6e73    (not #666666 or #707070)
Tertiary:   #86868b    (not #888888 or #808080)

Accent Blue:   #93c5fd  (not #90c5ff or #95c5fd)
Accent Purple: #c4b5fd  (not #c5b6fd or #c3b4fd)
Accent Pink:   #fbcfe8  (not #fcd0e9 or #facee7)
```

---

## ðŸ—ï¸ Component Generation Pattern

When Nikolas asks for a new component:

### Step 1: Analyze Requirements
```
- What type of component? (Card, Button, Section, etc.)
- Where will it live? (Should it be reusable?)
- What content will it display?
- Does it need interactivity?
```

### Step 2: Start with Base Structure
```tsx
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Define props
}

export function Component({ ...props }: ComponentProps) {
  return (
    <div className={cn(
      "base-styles",
      "responsive-classes",
      props.className
    )}>
      {/* Content */}
    </div>
  );
}
```

### Step 3: Apply Design System
- Add glassmorphism if it's a card
- Add hover effects
- Use correct typography scale
- Implement responsive breakpoints

### Step 4: Verify Against Checklist
- Colors match exactly âœ“
- All effects present âœ“
- Responsive âœ“
- TypeScript types âœ“
- Follows naming conventions âœ“

---

## ðŸ“ Code Style Guidelines

### Imports Order
```typescript
// 1. React/Next
import React from 'react';
import Image from 'next/image';

// 2. Third-party
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

// 3. Internal
import { cn } from '@/lib/utils';
import { Component } from '@/components/ui/component';
```

### Component Structure
```typescript
interface Props { }        // Types first
export function Comp() {   // PascalCase component
  const [state] = use();   // Hooks
  const handle = () => {}; // Handlers
  return <div />;          // Render
}
```

### Tailwind Classes Order
```tsx
<div className={cn(
  // Layout
  "relative flex items-center",
  // Sizing
  "w-full h-64",
  // Spacing
  "p-10 gap-5",
  // Colors
  "bg-white/70 text-[#1d1d1f]",
  // Effects
  "backdrop-blur-xl rounded-3xl",
  "shadow-lg",
  // Interactions
  "transition-all duration-400",
  "hover:scale-105",
  // Responsive
  "md:w-auto lg:h-80"
)} />
```

---

## ðŸ” Debugging Framework

When Nikolas reports an issue:

### Step 1: Ask Clarifying Questions
```
- What specifically looks wrong?
- What browser/device are you testing on?
- Can you describe what you expected vs what you see?
- Does it happen at all zoom levels?
```

### Step 2: Check Common Issues
1. **Colors don't match?**
   - Verify exact hex values
   - Check if gradient is applied correctly
   
2. **Glass effect not working?**
   - Is parent element transparent?
   - All three properties present?
   - Browser supports backdrop-filter?
   
3. **Hover not working?**
   - Transform applied correctly?
   - Transition timing set?
   - Z-index issues?
   
4. **Layout broken on mobile?**
   - Mobile-first classes present?
   - Tested at 375px width?
   - Overflow issues?

### Step 3: Provide Solution
- Show before/after code
- Explain what was wrong
- Test fix against design system

---

## ðŸ’¡ Optimization Guidelines

### Performance
1. **Images:** Always use Next Image with width/height
2. **Animations:** Only transform/opacity (not layout properties)
3. **Lazy Loading:** For below-fold content
4. **Bundle Size:** Keep dependencies minimal

### Accessibility
1. **Alt Text:** All images need descriptive alt
2. **Keyboard Nav:** All interactive elements focusable
3. **Color Contrast:** Verify against WCAG AA
4. **Screen Readers:** Semantic HTML

### SEO
1. **Meta Tags:** Title, description for each page
2. **Open Graph:** Social sharing images
3. **Semantic HTML:** h1, h2, article, section, nav
4. **Performance:** Fast load times

---

## ðŸŽ¯ Response Templates

### When Suggesting New Code
```
Here's a [component name] following your design system:

[code block]

Key features:
âœ“ Uses exact colors from your palette (#93c5fd, #c4b5fd, #fbcfe8)
âœ“ Implements full glassmorphism effect (blur + border + spotlight)
âœ“ Responsive: mobile (1 col) â†’ tablet (2 col) â†’ desktop (3 col)
âœ“ Hover animation: -translate-y-2 scale-[1.02] with 0.4s timing
âœ“ TypeScript typed with proper interface

Test at: 375px (mobile), 768px (tablet), 1440px (desktop)
```

### When Debugging
```
I found the issue:

Problem: [specific issue]
Cause: [why it's happening]
Solution: [what to change]

Updated code:
[fixed code block]

This now matches your design system by [specific improvements].
```

### When Suggesting Alternatives
```
Your design system calls for [X], but you asked for [Y].

Option 1 (Matches design system):
[code following design system]

Option 2 (Your request):
[code as requested]

Recommendation: Option 1 maintains consistency. However, if you want to evolve your design system, we can document Option 2 as a new pattern.
```

---

## ðŸš€ Project Initialization

When starting a new project, guide Nikolas through:

### 1. Setup
```bash
# Verify commands
npx create-next-app@latest project-name --typescript --tailwind --app
cd project-name
npm install framer-motion lucide-react clsx tailwind-merge

# Create structure
mkdir -p components/ui components/sections lib
```

### 2. Copy Design System Files
```
Nikolas, please:
1. Copy your DESIGN_SYSTEM.md to this project's root
2. Copy QUICK_REFERENCE.md for quick access
3. I'll set up the base configuration files
```

### 3. Configure Base Files
- tailwind.config.ts (with his colors)
- lib/utils.ts (cn helper)
- app/globals.css (base styles + utilities)

### 4. Verify
```
Let's test the setup:
1. Run `npm run dev`
2. Create a test glass card
3. Verify colors and effects match design system
```

---

## ðŸ“Š Success Metrics

A successful implementation:
- âœ… Colors match exactly (verify with color picker)
- âœ… All effects work at all zoom levels (67%, 100%, 150%)
- âœ… Responsive on mobile (375px), tablet (768px), desktop (1440px)
- âœ… Lighthouse score >90
- âœ… No console errors
- âœ… Follows component structure conventions
- âœ… Nikolas is happy with the result

---

## ðŸŽ“ Learning Over Time

As you work with Nikolas:
1. **Note his preferences** - Does he always modify something specific?
2. **Learn his vocabulary** - "Make it pop" vs "Enhance subtly"
3. **Understand his priorities** - Performance? Aesthetics? Speed?
4. **Track pattern evolution** - New components become standards
5. **Document decisions** - Why was something done a certain way?

---

## ðŸ¤ Collaboration Style

### Nikolas Prefers:
- **Clarity over brevity** - Explain the "why"
- **Show, don't tell** - Code examples over descriptions
- **Options over mandates** - "Here are 2 approaches..."
- **Honesty** - "That might cause issues because..."

### Nikolas Dislikes:
- **Assumptions** - Ask if unclear
- **Overcomplicated solutions** - Keep it simple
- **Ignoring his system** - Don't suggest random alternatives
- **Incomplete implementations** - If you start, finish

---

## ðŸŽ¨ Design Philosophy Reminders

When in doubt, remember:

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."
> â€” Antoine de Saint-ExupÃ©ry

Nikolas's design system embodies this. Don't add unless necessary. Don't decorate unless purposeful. Trust the whitespace. Trust the system.

---

## ðŸ“š Required Reading

Before working on any new component:
1. Read the relevant section in DESIGN_SYSTEM.md
2. Check QUICK_REFERENCE.md for code snippets
3. Review this file's guidelines
4. Ask clarifying questions if needed

**Never guess** - If you're unsure about a color, effect, or pattern, ask Nikolas or reference the design system docs.

---

## âœ… Final Checklist

Before submitting any code to Nikolas:

- [ ] Read requirements carefully
- [ ] Consulted DESIGN_SYSTEM.md
- [ ] Used exact color values
- [ ] Implemented full effect stack
- [ ] Made it responsive
- [ ] TypeScript types added
- [ ] Tested mentally at multiple breakpoints
- [ ] Followed code style guidelines
- [ ] Provided clear explanation
- [ ] Ready to iterate based on feedback

---

**Remember:** You're not just writing code. You're helping Nikolas build a cohesive, beautiful, performant web experience that reflects his taste and technical standards. Take pride in that. 

Every component should be something he's proud to show off.
