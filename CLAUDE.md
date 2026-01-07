# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 freight rate calculator application that helps trucking industry professionals (owners, fleet managers, dispatchers) calculate freight rates and operating costs. The app features a multi-step onboarding wizard and an advanced rate calculator.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Application Structure

The application uses **Next.js 15 App Router** with client-side rendering for interactive components.

**Route Structure:**
- **Landing page** (`/`) - Marketing site with Navbar (anonymous users only)
- **Auth routes** (`/auth/signin`, `/auth/signup`) - Authentication pages with Navbar
- **Dashboard routes** (`(dashboard)` group) - All logged-in app routes with sidebar navigation:
  - `/dashboard` - Overview with stats, recent quotes, quick actions
  - `/calculator` - Full rate calculator
  - `/quotes` - Quote management with search & filters
  - `/vehicles` - Vehicle fleet management
  - `/rewards` - Full rewards, achievements, referrals
  - `/profile` - Settings, profile, operating costs

### Navigation Pattern

**Sidebar Navigation (Logged-in Users):**
- Fixed left sidebar (256px width) on desktop
- Collapsible drawer overlay on mobile
- Always visible navigation to all app sections
- Active state highlighting (blue background + border)
- Bottom section for Profile and Sign Out

**Navbar (Anonymous Users):**
- Shows only on landing page and auth pages
- Removed from logged-in routes (replaced by sidebar)

**Layout Hierarchy:**
- `app/layout.js` - Root layout (fonts, global styles, AppProvider)
- `app/(dashboard)/layout.js` - Dashboard layout (includes Sidebar)
- Individual pages render within dashboard layout

### State Management Pattern

**No global state management library is used.** State is managed entirely through React's `useState` at the page level and passed down as props through the component tree. The main page (`app/page.js`) controls:
- `step`: Current wizard step (1-5)
- `barvalue`: Progress bar percentage
- Props are passed down to Step components: `{barvalue, setBarvalue, step, setStep}`

### Multi-Step Wizard Flow

The application has two main user flows:

1. **Initial Setup Wizard (Steps 1-5)**:
   - Step 1: User type selection (Owner/Fleet/Dispatcher)
   - Step 2: Profile creation (name, email, phone, company)
   - Step 3: Cost per mile calculator (vehicle type, fixed/variable costs)
   - Step 4: Vehicle information
   - Step 5: Completion/achievements

2. **Advanced Rate Calculator** (`components/RateCalc/Ratecalc.jsx`):
   - Independent multi-stage form (Location → Load Details → Service → Conditions)
   - Uses its own `stage` state, separate from the main wizard steps
   - Progress indicator shows completion through 4 stages

### Component Organization

Components are organized by feature in the `components/` directory:
- `Step1/`, `Step2/`, `Step3/`, `Step4/`, `Step5/`: Wizard step components
- `RateCalc/`: Advanced rate calculator and its sub-components
- `Navbar/`: Global navigation components

### Path Aliases

The project uses `@/*` path alias (configured in `jsconfig.json`) for imports:
```javascript
import Component from "@/components/Step1/Step1";
```

### Styling

- **Tailwind CSS v4** with PostCSS for styling
- Custom CSS variables defined in `app/globals.css` for theming
- Geist Sans and Geist Mono fonts loaded via `next/font/google`
- Heavy use of Tailwind's arbitrary values and custom classes for progress bars
- Dynamic classes based on state (e.g., conditional styling for selected buttons)

## Design & UI Principles

**CRITICAL: This application follows professional SaaS design patterns (Stripe, Linear, Vercel style).**

### Visual Tone & Style

This is a **professional B2B tool** for trucking industry professionals. The UI should feel:
- **Trustworthy**: Clean, consistent, no gimmicks
- **Efficient**: Information-dense but well-organized
- **Professional**: Serious business tool, not playful consumer app
- **Modern**: Contemporary SaaS aesthetics with eye-catching accents
- **Bold**: Orange accents that catch attention while remaining professional

### Color Palette (Strictly Follow)

**Primary Action Color (Orange):**
- `orange-500` - Primary buttons, CTAs, brand accent, logo background
- `orange-600` - Hover state for primary buttons
- `orange-100` - Subtle backgrounds, badges, icon containers
- `orange-700` - Text on orange-100 backgrounds

**Secondary/Neutral (Slate):**
- `slate-900` - Headings, primary text, dark sections
- `slate-800` - Secondary dark backgrounds
- `slate-700` - Strong body text
- `slate-600` - Body text, descriptions
- `slate-500` - Muted text
- `slate-400` - Placeholder text, subtle elements
- `slate-300` - Borders for inputs/buttons
- `slate-200` - Card borders, dividers
- `slate-100` - Subtle backgrounds, icon containers
- `slate-50` - Section backgrounds, page backgrounds

**Success/Profit (Emerald):**
- `emerald-500` - Profit indicators, success states, positive metrics
- `emerald-600` - Profit text, success emphasis
- `emerald-400` - Success text on dark backgrounds
- `emerald-100` - Success icon containers, subtle success backgrounds

**Danger/Error:**
- `red-500` - Error states, delete buttons
- `red-600` - Danger button hover
- `red-100` - Error backgrounds

**Base:**
- `white` - Card backgrounds, containers, page base

**DO NOT USE:**
- ❌ Blue as primary (legacy - being phased out)
- ❌ Purple, pink, or bright/neon colors
- ❌ Rainbow color schemes
- ❌ Emojis anywhere in the UI

### Component Styling Standards

**Cards:**
- Use `Card` component with white background
- Border: `border-2 border-slate-200` for standard cards
- Hover: `hover:border-orange-200 hover:shadow-xl` for interactive cards
- Rounded corners: `rounded-2xl` for modern feel, `rounded-xl` for smaller cards
- Padding: `p-8` for feature cards, `p-6` for standard, `p-4` for compact

**Buttons:**
- Primary: `bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/25`
- Secondary: `border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 rounded-xl`
- Outline: `border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl`
- Danger: `bg-red-500 hover:bg-red-600 text-white rounded-xl`
- Ghost: `text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg`

**Progress Bars:**
- Background: `bg-slate-200`
- Fill: `bg-orange-500` (solid, no gradients)
- Height: `h-3` for standard, `h-2` for compact
- Corners: `rounded-full`

**Icons:**
- Use **Lucide React** (`lucide-react`) or **React Icons** (`react-icons`) ONLY
- Never use emojis
- Standard sizes: `size={16}` (sm), `size={20}` (md), `size={24}` (lg), `size={28}` (xl)
- Icon containers by color:
  - Orange: `bg-orange-100 p-3 rounded-xl` with `text-orange-500` icon
  - Slate: `bg-slate-100 p-3 rounded-xl` with `text-slate-600` icon
  - Emerald: `bg-emerald-100 p-3 rounded-xl` with `text-emerald-500` icon

**Typography:**
- H1 (Page titles): `text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight`
- H2 (Section titles): `text-2xl sm:text-3xl font-bold text-slate-900`
- H3 (Card titles): `text-xl font-bold text-slate-900`
- H4 (Subsections): `text-lg font-semibold text-slate-900`
- Body: `text-base text-slate-600 leading-relaxed`
- Small: `text-sm text-slate-600`
- Muted: `text-xs text-slate-500`
- Accent text: `text-orange-500` for emphasis

**Badges/Pills:**
- Standard: `px-4 py-2 rounded-full text-sm font-medium`
- Orange badge: `bg-orange-100 text-orange-700`
- Slate badge: `bg-slate-200 text-slate-700`
- Emerald badge: `bg-emerald-100 text-emerald-700`

**Form Inputs:**
- Border: `border-2 border-slate-200 focus:border-orange-500`
- Rounded: `rounded-xl`
- Focus ring: `focus:ring-2 focus:ring-orange-500/20`

### Special UI Patterns

**Hero Sections:**
- Subtle gradient background: `bg-gradient-to-br from-slate-50 via-white to-orange-50/30`
- Decorative blurred shapes for depth (use sparingly)
- Split layouts with content left, visual right

**Stats/Metrics Display:**
- Dark background for emphasis: `bg-slate-900 rounded-2xl p-8`
- White text for numbers: `text-white font-bold`
- Orange accent for key metrics: `text-orange-400`
- Emerald for profit/success: `text-emerald-400`

**Floating Accents:**
- Small floating badges: `absolute bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg`
- Use for highlighting key info (e.g., "+28% Profit")

### User Feedback Patterns

**DO:**
- ✅ Toast notifications for actions
- ✅ Inline validation messages
- ✅ Loading states with spinners
- ✅ Empty states with helpful instructions
- ✅ Success states with emerald indicators

**DO NOT:**
- ❌ `alert()` calls (unprofessional)
- ❌ `confirm()` for destructive actions (use proper modals)
- ❌ `prompt()` for user input (use forms)

### Animation & Interaction Standards

**Hover States:**
- Subtle transitions: `transition-all duration-200` or `duration-300`
- Border color changes: `hover:border-orange-200`
- Background lightening: `hover:bg-slate-50`
- Shadow elevation: `hover:shadow-xl`
- Button arrow animation: `group-hover:translate-x-1 transition-transform`

**DO NOT:**
- ❌ Dramatic animations or bouncing
- ❌ Auto-playing animations
- ❌ Excessive transforms
- ❌ Distracting motion

### Layout Patterns

**Dashboard Layout:**
- Max width container: `max-w-7xl mx-auto`
- Padding: `px-4 sm:px-6 lg:px-8 py-8`
- Section spacing: `space-y-8` or `mb-8`
- Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`

**Landing Page Layout:**
- Full-width sections with contained content
- Section padding: `py-20 sm:py-28`
- Alternating backgrounds: white → slate-50 → white

**Responsive Breakpoints:**
- Mobile first: Base styles for mobile
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)
- Large desktop: `xl:` prefix (1280px+)

### Examples of Good vs Bad

**✅ GOOD - Modern Professional:**
```jsx
<div className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:shadow-xl transition-all">
  <div className="bg-orange-100 p-4 rounded-xl inline-block mb-6">
    <Truck className="text-orange-500" size={28} />
  </div>
  <h3 className="text-xl font-bold text-slate-900 mb-3">Fleet Management</h3>
  <p className="text-slate-600 leading-relaxed">
    Save multiple vehicles with different specs.
  </p>
</div>
```

**✅ GOOD - CTA Button:**
```jsx
<button className="group bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-orange-500/25 inline-flex items-center gap-2">
  Start Free Trial
  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
</button>
```

**❌ BAD - Old Blue Style (phase out):**
```jsx
<Card className="p-6 bg-white border-2 border-gray-200">
  <div className="bg-blue-100 p-3 rounded-lg">
    <Truck className="text-blue-600" size={24} />
  </div>
</Card>
```

**❌ BAD - Unprofessional:**
```jsx
<Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
  <span className="text-3xl">🚛</span>
  <h3 className="text-xl font-semibold">Your Vehicles 🎉</h3>
</Card>
```

### When Creating New Components

1. **Use orange-500 for primary actions** - CTAs, active states, brand elements
2. **Use slate for neutrals** - Replace gray with slate throughout
3. **Use emerald for success/profit** - Money indicators, positive metrics
4. **Prefer white cards with slate borders** - Clean, professional look
5. **Use rounded-xl or rounded-2xl** - Modern, friendly corners
6. **Add subtle shadows to buttons** - `shadow-lg shadow-orange-500/25`
7. **Use professional icons** - Lucide or React Icons, never emojis
8. **Follow typography scale** - Use predefined heading and text sizes
9. **Keep animations subtle** - Simple transitions, arrow movements on hover
7. **Maintain consistency** - Match existing component styling

### References

- **Landing page components** (Hero, Features, HowItWorks) - Gold standard for tone
- **Dashboard components** - Professional SaaS patterns
- **UI components** (Button, Card, Input) - Reusable building blocks

### Design Inspiration (External)

These represent the target aesthetic (not to be copied, but to understand the tone):
- Stripe Dashboard - Clean, minimal, trustworthy
- Linear - Professional, consistent, efficient
- Vercel Dashboard - Modern, simple, elegant
- GitHub - Clear hierarchy, professional
- Notion - Organized, clean, functional

### Key Patterns

**Client Components**: Most components use `"use client"` directive since the app relies on interactivity and useState hooks.

**Navigation**: Step navigation is handled through:
- Forward navigation: Button clicks that increment step and update progress bar
- Backward navigation: "Back to previous Step" buttons that decrement step

**Form Handling**: Forms currently don't have submission logic - buttons use `onClick` handlers to navigate between steps rather than form `onSubmit`.

**Icon Library**: React Icons (`react-icons`) is used extensively throughout the app for UI icons.

## Important Notes

- The application appears to be on the `RateCalc` branch based on git status
- No backend/API integration is currently implemented
- No form validation is present
- Step 4 and Step 5 content is not fully visible in the reviewed files
- The Rate Calculator tracks "Searches Used: 0/5" but this limit isn't enforced in code yet

## File Naming Conventions

- Main step components: `Step[N].jsx` (e.g., `Step1.jsx`, `Step2.jsx`)
- Sub-components: Feature-prefixed (e.g., `Step2formcomponent.jsx`, `Ratecalclocation.jsx`)
- Use PascalCase for component files

---

## Feature Audit & Missing Components

**Last Updated:** 2025-11-04

This section documents the current state of features, what's built, what needs redesign, and what's missing entirely.

### ✅ Components That Exist & Are Built

#### 1. **Onboarding System** (`components/Onboarding/`)
- **Status:** Built but needs professional redesign
- **Files:**
  - `OnboardingModal.jsx` - Main modal wrapper with 5-step flow
  - `Step1UserType.jsx` - User type selection (Owner/Fleet/Dispatcher)
  - `Step2BasicInfo.jsx` - Name, email, phone, company
  - `Step3CostCalc.jsx` - Cost per mile calculator
  - `Step4VehicleInfo.jsx` - Vehicle information entry
  - `Step5Review.jsx` - Review and confirmation
- **Design Issues:**
  - ❌ Gradient header `from-blue-600 to-blue-500` (line 69)
  - ❌ Emojis in Step1 (🚛 🚐 📦 🚙) and checkmark ✓
  - ❌ Emoji in Step4 vehicle types
  - ❌ Green success card in Step3 `bg-green-50 border-green-200` (should be blue)
  - ❌ Uses `alert()` in Step1 and OnboardingModal
- **Integration:** Referenced in `components/Auth/SignUpForm.jsx`

#### 2. **Full Rate Calculator** (`components/Calculator/`)
- **Status:** ✅ Recently redesigned (2025-11-04) - Follows professional standards
- **Files:**
  - `FullCalculator.jsx` - Main 4-stage calculator wrapper
  - `RatecalclocationEnhanced.jsx` - Location, vehicles, trips (Stage 1)
  - `Ratecalcloaddetails.jsx` - Load details (Stage 2)
  - `Ratecalcservice.jsx` - Service requirements (Stage 3)
  - `RateCalcConditions.jsx` - Conditions & weather (Stage 4)
- **Design Status:** Professional, follows all CLAUDE.md standards
- **Notes:** Has basic weather conditions dropdown but NO detailed weather analysis component

#### 3. **Quote System** (`components/quote/`)
- **Status:** Built but needs color standardization
- **Files:**
  - `quote.jsx` - Main quote display wrapper
  - `RateCards.jsx` - Displays recommended/spot/contract rates
  - `BreakdownSection.jsx` - Cost breakdown display
  - `RouteAnalysis.jsx` - Pickup/delivery region analysis
  - `MarketAnalysis.jsx` - Load board stats & next money lanes
  - `BrokerVerification.jsx` - Broker verification section
  - `BookingSection.jsx` - Book this load CTA
  - `BookingModal.jsx` - 3-step booking flow (Schedule → Payment → Review)
  - `RateBreakdown.jsx` - Detailed rate breakdown with action buttons
- **Design Issues:**
  - ❌ RouteAnalysis uses purple colors (purple-50, purple-600, purple-700) - should be blue
  - ❌ RateBreakdown has rainbow buttons: green-600, purple-600, gray-600, teal-600 - should standardize
  - ❌ BookingModal uses green-500 for completed steps - should be blue

#### 4. **Cost Per Mile Calculator** (Two Versions)
- **Old Version:** `components/Step3/` - More detailed with fixed/variable costs breakdown
  - `Step3.jsx` - Main component
  - `Step3fixedcosts.jsx` - Fixed costs entry
  - `Step3variablecosts.jsx` - Variable costs entry
  - Has industry averages vs custom data toggle
- **New Version:** `components/Onboarding/Step3CostCalc.jsx` - Simplified
  - Needs redesign (see Onboarding issues above)

### ❌ Missing Components (Not Built Yet)

#### 1. **Weather Analysis Component**
- **Description:** Detailed weather forecast analysis for route
- **Expected Location:** Should integrate into FullCalculator Stage 1 (Location) or display in Quote
- **Features Needed:**
  - Current weather conditions at pickup/delivery
  - Forecast for travel dates
  - Weather impact on rate (delays, hazards)
  - Visual weather icons/maps
- **Current State:** Only basic dropdown in RateCalcConditions.jsx (Normal, Rain, Snow, etc.)
- **Priority:** HIGH - Critical for accurate rate calculation

#### 2. **Schedule Feasibility Analyzer**
- **Description:** Calculates if pickup/delivery schedule is feasible based on hours
- **Expected Display:**
  ```
  Schedule is feasible
  This schedule is feasible with 35 hours of buffer time.

  Required Hours: 45 hrs
  Available Time: 80 hrs
  Buffer: 35 hrs
  ```
- **Expected Location:** Should appear in BookingModal or Quote display after schedule selection
- **Features Needed:**
  - Calculate driving time based on distance
  - Factor in HOS (Hours of Service) regulations
  - Include loading/unloading time
  - Show buffer/cushion time
  - Warning if schedule is tight or infeasible
- **Current State:** NOT BUILT
- **Priority:** MEDIUM - Important for operational planning

#### 3. **VIN Auto-Decode**
- **Description:** Automatically decode vehicle details from VIN
- **Expected Location:** `Step4VehicleInfo.jsx` and vehicle management pages
- **Features Needed:**
  - VIN input field with real-time validation
  - API integration to decode VIN
  - Auto-populate: Year, Make, Model, Vehicle Type
  - Visual feedback (loading, success, error)
- **Current State:** Just a plain text input labeled "VIN (Optional)" in Step4VehicleInfo.jsx:157
- **Priority:** MEDIUM - Nice to have, improves UX

#### 4. **Market Analysis Integration in Calculator**
- **Description:** Show market conditions DURING rate calculation, not just in quote
- **Expected Location:** Should appear in FullCalculator after entering location (Stage 1)
- **Features Needed:**
  - Real-time market data based on origin/destination
  - Truck-to-load ratios for route
  - Market temperature (hot/warm/cold)
  - Rate recommendations based on market
- **Current State:** Market analysis exists in quote.jsx but NOT integrated into calculator flow
- **Priority:** HIGH - Users should see market conditions before finalizing inputs

#### 5. **Detailed Fixed & Variable Costs in Onboarding**
- **Description:** Full breakdown of operating costs during onboarding
- **Expected Location:** `Onboarding/Step3CostCalc.jsx` should match old `Step3/` detail level
- **Features Needed:**
  - Fixed costs: Insurance, truck payments, permits, etc.
  - Variable costs: Fuel, maintenance, tires, etc.
  - Per-mile calculations
  - Visual breakdown charts
- **Current State:** New onboarding has simplified version, old Step3 has full breakdown
- **Priority:** MEDIUM - Can be simplified for onboarding, detailed version in profile settings

### 🔧 Components Needing Redesign

#### 1. **Entire Onboarding Flow** - HIGH PRIORITY
Apply same professional treatment as FullCalculator:
- Remove all gradients → solid white with blue accents
- Replace all emojis → Lucide React icons
- Replace alert() → console.log
- Standardize colors → blue-600 only (no green success cards)
- Consistent spacing (4px scale)

#### 2. **Quote System Components** - MEDIUM PRIORITY
- RouteAnalysis.jsx: Change purple to blue throughout
- RateBreakdown.jsx: Standardize button colors (primary blue, secondary gray)
- BookingModal.jsx: Change green completed state to blue

#### 3. **Old Step Components** - LOW PRIORITY (if still in use)
- The old `components/Step1/` through `Step5/` may still be in use for non-authenticated flow
- Should be deprecated in favor of new Onboarding components
- If kept, needs same redesign treatment

### 📋 Architecture Decisions Needed

#### 1. **Where Should Weather Analysis Display?**
- **Option A:** Integrate into FullCalculator Stage 1 (after entering origin/destination)
  - Pros: See weather before proceeding, can adjust route
  - Cons: Adds complexity to calculator flow
- **Option B:** Display in Quote results alongside Market Analysis
  - Pros: Cleaner calculator flow, comprehensive quote view
  - Cons: Too late to adjust if weather is bad
- **Recommended:** Option A with summary, full details in quote

#### 2. **Where Should Schedule Feasibility Calculate?**
- **Option A:** In BookingModal when user selects pickup/delivery times
  - Pros: Immediate feedback on schedule viability
  - Cons: Requires distance calculation before booking
- **Option B:** In Quote display after rate calculation
  - Pros: Has all data available, can show recommended schedule
  - Cons: Not interactive with booking flow
- **Recommended:** Option A (in BookingModal after dates selected)

#### 3. **Should VIN Decode Be Required or Optional?**
- **Current:** Optional in Step4VehicleInfo
- **Consideration:** Makes onboarding faster if optional, but reduces data quality
- **Recommended:** Keep optional but incentivize (e.g., "Auto-fill vehicle details")

### 🎯 Implementation Priority Ranking

**🔴 Critical (Do Next):**
1. Redesign Onboarding components (matches FullCalculator standards)
2. Add Weather Analysis component to calculator
3. Integrate Market Analysis into calculator flow

**🟡 Important (After Critical):**
4. Standardize Quote component colors (purple/green → blue)
5. Build Schedule Feasibility Analyzer for BookingModal
6. Add VIN Auto-Decode API integration

**🟢 Nice to Have (Future):**
7. Enhanced cost calculator in profile settings
8. Real-time market data API integration
9. Weather forecast maps/visualizations

### 📝 Notes on Existing Infrastructure

- **Mock Data:** All components currently use hardcoded mock data
- **No API Integration:** Weather, market data, VIN decode all need backend APIs
- **State Management:** Still using local useState - consider context for shared data
- **Form Validation:** Minimal validation currently, needs comprehensive validation layer

---

## Summary of Current State

**What Works Well:**
- ✅ FullCalculator design is professional and complete
- ✅ Quote system has all major components built
- ✅ Onboarding structure is solid (just needs redesign)
- ✅ Booking flow is comprehensive (3-step modal)

**What Needs Immediate Attention:**
- ❌ Onboarding design violations (gradients, emojis, alerts)
- ❌ Quote component color inconsistencies (purple/green)
- ❌ Missing weather analysis feature
- ❌ Missing schedule feasibility calculator

**What's Blocked by Backend:**
- Weather API integration
- Market data API integration
- VIN decode API integration
- Real-time rate calculations
