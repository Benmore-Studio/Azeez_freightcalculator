# Active Tickets - Azeez Freight Calculator

**Project:** Benmore-Studio/Azeez_freightcalculator
**GitHub Project:** Freight Calculator (#21)
**Last Updated:** 2025-01-12

---

## 📋 Overview

This document tracks **active tickets only**. For comprehensive project scope and backend specifications, see:
- **MVP-DEFINITION.md** - Full contract scope, backend architecture, API specifications
- **FRONTEND-TASKS.md** - Complete frontend task breakdown (8 MVP + 22 nice-to-have)
- **PROJECT-STATUS.md** - Current project status and progress

---

## 🎯 Current Sprint: Frontend MVP Polish

**Status:** 8 tasks remaining before backend development
**Estimated Time:** 15 hours (2 days)
**All tasks synced to GitHub Issues #36-#43**

---

## 🔴 MVP Critical Frontend Tasks

### Issue #36: F1 - Redesign Onboarding Flow
**Priority:** 🔴 MVP Critical
**Component:** Onboarding
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/36

**Description:**
Apply professional design standards to all onboarding components to match quality of auth pages and calculator.

**Issues to Fix:**
- Gradient header in `OnboardingModal.jsx` → solid white with blue accents
- Emojis in `Step1UserType.jsx` (🚛 🚐 📦 🚙) → Replace with Lucide icons
- Emojis in `Step4VehicleInfo.jsx` → Replace with Lucide icons
- Green success card in `Step3CostCalc.jsx` → Change to blue-600
- `alert()` calls → Replace with toast notifications
- Inconsistent spacing → Use 4px scale

**Files to Change:**
- `components/Onboarding/OnboardingModal.jsx`
- `components/Onboarding/Step1UserType.jsx`
- `components/Onboarding/Step2BasicInfo.jsx`
- `components/Onboarding/Step3CostCalc.jsx`
- `components/Onboarding/Step4VehicleInfo.jsx`
- `components/Onboarding/Step5Review.jsx`

**Acceptance Criteria:**
- [ ] No gradients except small badges (if needed)
- [ ] All emojis replaced with Lucide React icons
- [ ] All `alert()` replaced with toast notifications
- [ ] All success indicators use blue-600, not green
- [ ] Consistent padding/spacing (4px scale)
- [ ] Matches professional aesthetic of auth pages

---

### Issue #37: F2 - Standardize Quote Component Colors
**Priority:** 🔴 MVP Critical
**Component:** Quote
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/37

**Description:**
Remove purple/teal colors from quote components and standardize to blue-600 primary color scheme per design system.

**Issues to Fix:**
- `RouteAnalysis.jsx` uses purple-50, purple-600, purple-700
- `RateBreakdown.jsx` has rainbow buttons: green-600, purple-600, gray-600, teal-600
- `BookingModal.jsx` uses green-500 for completed steps

**Files to Change:**
- `components/quote/RouteAnalysis.jsx`
- `components/quote/RateBreakdown.jsx`
- `components/quote/BookingModal.jsx`

**Acceptance Criteria:**
- [ ] All purple colors changed to blue-600 variants
- [ ] All teal colors changed to blue-600 variants
- [ ] Button colors standardized (primary: blue-600, secondary: gray-600)
- [ ] Completed states use blue-600 instead of green-500
- [ ] Visual consistency across all quote components

---

### Issue #38: F4 - Add Back Navigation to Calculator Stages
**Priority:** 🔴 MVP Critical
**Component:** Calculator
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/38

**Description:**
Add "Back" button to all calculator stages to allow users to return to previous stage with data preserved.

**Files to Change:**
- `components/Calculator/RatecalclocationEnhanced.jsx`
- `components/RateCalc/Ratecalcloaddetails.jsx`
- `components/RateCalc/Ratecalcservice.jsx`
- `components/RateCalc/RateCalcConditions.jsx`

**Acceptance Criteria:**
- [ ] "Back" button visible on stages 2-4
- [ ] Clicking back returns to previous stage
- [ ] All form data preserved when navigating back
- [ ] Button styling consistent with "Next" button (secondary variant)
- [ ] Button positioned on left side, "Next" on right

---

### Issue #39: F7 - Display Vehicle Info in Calculator Header
**Priority:** 🔴 MVP Critical
**Component:** Calculator
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/39
**Depends on:** Backend B1.4 (Vehicle API) - Can implement with mock data first

**Description:**
Show selected vehicle information in calculator header to provide context about cost calculations.

**Example Display:**
"Using your Semi Truck (14.5 MPG) | Cost/Mile: $1.75"

**Files to Change:**
- `components/Calculator/FullCalculator.jsx` (add header section)
- `components/Calculator/VehicleDisplay.jsx` (NEW - create component)

**Acceptance Criteria:**
- [ ] Vehicle info displays at top of calculator
- [ ] Shows: Vehicle type, MPG, cost per mile
- [ ] Uses mock data if backend not available
- [ ] Responsive design (stacks on mobile)
- [ ] Consistent with design standards (blue-600 accents)

---

### Issue #40: F8 - Show Cost Per Mile in Quote Results
**Priority:** 🔴 MVP Critical
**Component:** Quote
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/40
**Depends on:** Backend B2.3 (Operating Costs API) - Can implement with mock data first

**Description:**
Display user's operating costs prominently in quote breakdown to show profit margin clearly.

**Example Display:**
"Your cost: $1.75/mi | Recommended rate: $2.45/mi = $0.70/mi profit"

**Files to Change:**
- `components/quote/quote.jsx` (integrate profit breakdown)
- `components/quote/ProfitBreakdown.jsx` (NEW - create component)

**Acceptance Criteria:**
- [ ] Cost per mile displayed prominently
- [ ] Profit per mile calculated and shown
- [ ] Profit margin percentage shown
- [ ] Color-coded (red <10%, yellow 10-20%, green >20%)
- [ ] Uses mock data if backend not available

---

### Issue #41: F35 - Add Hover States to Custom Components
**Priority:** 🔴 MVP Critical
**Component:** Onboarding
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/41

**Description:**
Add professional hover and focus states to all custom interactive components for better user feedback.

**Files to Change:**
- `components/Onboarding/UserButton.jsx`
- `components/Onboarding/Step2button.jsx`
- `components/Onboarding/Step4equipmenttype.jsx`

**Acceptance Criteria:**
- [ ] Hover state changes background color slightly
- [ ] Focus state shows blue-600 outline
- [ ] Transitions are smooth (200ms duration)
- [ ] Touch targets are 44×44px minimum
- [ ] Consistent with Button component hover behavior

---

### Issue #42: F36 - Mobile Optimization and Testing
**Priority:** 🔴 MVP Critical
**Component:** All
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/42

**Description:**
Comprehensive mobile testing and optimization across all pages to ensure professional mobile experience.

**Testing Devices:**
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)

**Areas to Test:**
- Landing page
- Auth pages (Sign In / Sign Up)
- Onboarding modal flow
- Dashboard with sidebar (should become drawer)
- Calculator (all 4 stages)
- Quote results display
- All forms and inputs

**Acceptance Criteria:**
- [ ] All pages tested on iPhone, Android, iPad
- [ ] Touch targets minimum 44×44px
- [ ] Sidebar becomes drawer overlay on mobile
- [ ] Forms easy to fill on mobile devices
- [ ] Calculator stages work smoothly on mobile
- [ ] No horizontal scrolling
- [ ] Text readable without zooming
- [ ] Buttons accessible with thumb reach

---

### Issue #43: F41 - Remove Non-Functional Use Location Button
**Priority:** 🔴 MVP Critical
**Component:** Calculator
**GitHub:** https://github.com/Benmore-Studio/Azeez_freightcalculator/issues/43

**Description:**
Remove "Use Location" button from deadhead miles input until geolocation functionality is implemented.

**Files to Change:**
- `components/Calculator/RatecalclocationEnhanced.jsx` (lines 171-179)

**Acceptance Criteria:**
- [ ] Button removed from UI
- [ ] Input field still functional
- [ ] No console errors
- [ ] Layout adjusts properly without button

**Change Required:**
```jsx
// Remove the button wrapper div and just keep the Input
<Input
  type="number"
  placeholder="0"
  value={formData.deadheadMiles}
  onChange={(e) => handleInputChange("deadheadMiles", e.target.value)}
/>
```

---

## 📊 Summary

**Total Active Tasks:** 8
**All GitHub Issues:** #36, #37, #38, #39, #40, #41, #42, #43
**Estimated Time:** 15 hours (2 days)
**Priority:** All 🔴 MVP Critical

**After Completion:**
- All frontend will be professional and consistent
- Ready to begin backend Month 1 development
- Mobile-optimized and fully responsive

---

## 🚀 Next Phase: Backend Development

Once these 8 frontend tasks are complete, development will shift to backend implementation:

**Month 1 (48 hours):**
- PostgreSQL database setup
- JWT authentication system
- Vehicle management API
- VIN decode integration
- Onboarding backend

**See MVP-DEFINITION.md for complete backend specifications.**

---

## 📝 Deferred Tasks

**22 nice-to-have frontend tasks** documented in FRONTEND-TASKS.md:
- Step navigation improvements
- Tooltips and helper text
- Copy improvements
- Progressive disclosure
- Additional polish

These can be implemented later without blocking backend development.

---

**Last Updated:** 2025-01-12
**Next Update:** After completing 8 MVP tasks or starting backend work
