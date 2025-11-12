# Frontend Tasks - Master List

**Project:** Freight Calculator (Cargo Credible)
**Phase:** Frontend MVP Polish
**Last Updated:** 2025-01-11

This document contains all remaining frontend tasks. **Only the 8 MVP Critical tasks are required** for production launch. The rest are nice-to-have polish that can be done during backend development or post-launch.

---

## 📊 Quick Summary

**Total Tasks:** 30
**MVP Critical:** 8 (✅ Synced to GitHub Issues #36-#43)
**Nice-to-Have:** 22 (Can be deferred)

**Timeline Estimate:**
- MVP Critical Only: ~15 hours (2 days)
- Full Polish: ~50 hours (1.5-2 weeks)

**Decision:** Focus on 8 MVP critical tasks, then move to backend.

---

## 🎯 MVP Critical Tasks (GitHub Issues #36-#43)

These 8 tasks are **essential** for a professional, functional MVP. Users will notice if these are missing.

---

## 🔴 MVP Critical - Must Complete Before Backend

### F1: Redesign Onboarding Flow
**GitHub Issue:** #36
**Priority:** 🔴 MVP Critical
**Component:** Onboarding

**Description:**
Apply professional design standards to all onboarding components. Remove gradients, emojis, and alert() calls to match the quality of FullCalculator and auth pages.

**Issues to Fix:**
- Gradient header in `OnboardingModal.jsx`
- Emojis in `Step1UserType.jsx` (🚛 🚐 📦 🚙)
- Emojis in `Step4VehicleInfo.jsx`
- Green success card in `Step3CostCalc.jsx` (should be blue-600)
- alert() calls in multiple step components
- Inconsistent spacing

**Files to Change:**
- `components/Onboarding/OnboardingModal.jsx`
- `components/Onboarding/Step1UserType.jsx`
- `components/Onboarding/Step2BasicInfo.jsx`
- `components/Onboarding/Step3CostCalc.jsx`
- `components/Onboarding/Step4VehicleInfo.jsx`
- `components/Onboarding/Step5Review.jsx`

**Acceptance Criteria:**
- [ ] No gradients except on small badges (if needed)
- [ ] All emojis replaced with Lucide React icons
- [ ] All alert() replaced with toast notifications
- [ ] All success indicators use blue-600, not green
- [ ] Consistent padding/spacing (4px scale)
- [ ] Matches professional aesthetic of auth pages and calculator

**Dependencies:** None

---

### F2: Standardize Quote Component Colors
**GitHub Issue:** #37
**Priority:** 🔴 MVP Critical
**Component:** Quote Results

**Description:**
Remove purple/teal colors from quote components and standardize to blue-600 primary color scheme.

**Issues to Fix:**
- `RouteAnalysis.jsx` uses purple-50, purple-600, purple-700 backgrounds and text
- `RateBreakdown.jsx` has rainbow action buttons: green-600, purple-600, gray-600, teal-600
- `BookingModal.jsx` uses green-500 for completed steps

**Files to Change:**
- `components/quote/RouteAnalysis.jsx`
- `components/quote/RateBreakdown.jsx`
- `components/quote/BookingModal.jsx`

**Acceptance Criteria:**
- [ ] All purple colors changed to blue-600
- [ ] All teal colors changed to blue-600 or gray
- [ ] Action buttons standardized: Primary (blue-600), Secondary (gray-100)
- [ ] Completed steps use blue-600 instead of green-500
- [ ] No rainbow color schemes

**Dependencies:** None

---

### F4: Add Back Navigation to Calculator Stages
**GitHub Issue:** #38
**Priority:** 🔴 MVP Critical
**Component:** Rate Calculator

**Description:**
Add clickable step indicators at top of onboarding modal so users can navigate back to previous steps.

**Files to Change:**
- `components/Onboarding/OnboardingModal.jsx`
- Create `components/Onboarding/StepNavigator.jsx` (NEW)

**Acceptance Criteria:**
- [ ] Visual step indicator showing all 5 steps
- [ ] Completed steps are clickable
- [ ] Current step highlighted
- [ ] Future steps grayed out
- [ ] Responsive on mobile

**Dependencies:** None

---

### F4: Add Back Navigation to Calculator Stages
**Priority:** 🔴 High
**Component:** Rate Calculator
**Labels:** `ux`, `navigation`, `enhancement`

**Description:**
Add "Back" buttons to stages 2, 3, and 4 so users can go back without losing data.

**Files to Change:**
- `components/Calculator/FullCalculator.jsx`
- `components/RateCalc/Ratecalcloaddetails.jsx`
- `components/RateCalc/Ratecalcservice.jsx`
- `components/RateCalc/RateCalcConditions.jsx`

**Acceptance Criteria:**
- [ ] Back button on stages 2, 3, 4
- [ ] Preserves entered form data
- [ ] Secondary style (not primary blue)
- [ ] Positioned bottom-left consistently

**Dependencies:** None

---

### F5: Make Rate Calculator Stage Icons Clickable
**Priority:** 🔴 High
**Component:** Rate Calculator
**Labels:** `ux`, `navigation`, `enhancement`

**Description:**
Allow users to click stage icons to jump to completed stages.

**Files to Change:**
- `components/RateCalc/Ratestepicon.jsx`
- `components/Calculator/FullCalculator.jsx`

**Acceptance Criteria:**
- [ ] Completed stages clickable
- [ ] Hover state with pointer cursor
- [ ] Form data persists

**Dependencies:** F4

---

### F7: Display Vehicle Info in Calculator Header
**Priority:** 🔴 High
**Component:** Rate Calculator
**Labels:** `ux`, `enhancement`, `vehicles`

**Description:**
Show selected vehicle information in calculator so users know which vehicle they're calculating for.

**Files to Change:**
- `components/Calculator/RatecalclocationEnhanced.jsx`

**Acceptance Criteria:**
- [ ] Shows vehicle name, make/model, year
- [ ] Shows MPG and equipment type
- [ ] Updates when selection changes

**Dependencies:** None

---

### F8: Show Cost Per Mile in Quote Results
**Priority:** 🔴 High
**Component:** Quote Results
**Labels:** `ux`, `data-display`

**Description:**
Display calculated cost per mile in quote results.

**Files to Change:**
- `components/quote/quote.jsx`
- `components/quote/ProfitCalculator.jsx`

**Acceptance Criteria:**
- [ ] Cost per mile displayed
- [ ] Format: "$X.XX per mile"
- [ ] Calculation: Total Costs / Total Miles

**Dependencies:** None

---

### F19: Highlight Current Stage in Rate Calculator
**Priority:** 🔴 High
**Component:** Rate Calculator
**Labels:** `ui`, `ux`, `visual-feedback`

**Description:**
Make current stage more visually prominent.

**Files to Change:**
- `components/RateCalc/Ratestepicon.jsx`

**Acceptance Criteria:**
- [ ] Current stage distinct visual treatment
- [ ] Completed stages show checkmark
- [ ] Future stages grayed out

**Dependencies:** None

---

### F20: Add Completion Checkmarks to Onboarding Steps
**Priority:** 🔴 High
**Component:** Onboarding
**Labels:** `ui`, `ux`, `visual-feedback`

**Description:**
Show checkmarks on completed onboarding steps.

**Files to Change:**
- `components/Onboarding/OnboardingModal.jsx`
- Create `components/Onboarding/StepIndicator.jsx` (NEW)

**Acceptance Criteria:**
- [ ] Completed steps show checkmark
- [ ] Current step highlighted
- [ ] Future steps grayed

**Dependencies:** F3

---

### F23: Add "Recommended" Badge to Best Rate Option
**Priority:** 🔴 High
**Component:** Quote Results
**Labels:** `ui`, `ux`, `guidance`

**Description:**
Add badge to best rate option to guide users.

**Files to Change:**
- `components/quote/RateCards.jsx`

**Acceptance Criteria:**
- [ ] "Recommended" badge on best card
- [ ] Blue-600 with white text
- [ ] Top-right position

**Dependencies:** None

---

### F33: Add Edit Link from Quote to Calculator
**Priority:** 🔴 High
**Component:** Quote Results
**Labels:** `ux`, `navigation`

**Description:**
Add link to edit/recalculate from quote results.

**Files to Change:**
- `components/quote/quote.jsx`
- `components/Calculator/FullCalculator.jsx`

**Acceptance Criteria:**
- [ ] "Edit Calculation" button in header
- [ ] Returns to calculator with data pre-filled

**Dependencies:** None

---

### F34: Make "New Calculation" More Prominent
**Priority:** 🔴 High
**Component:** Quote Results
**Labels:** `ui`, `ux`, `cta`

**Description:**
Make new calculation button more prominent.

**Files to Change:**
- `components/quote/quote.jsx`

**Acceptance Criteria:**
- [ ] Primary blue button (not secondary)
- [ ] Prominently positioned
- [ ] Clear label

**Dependencies:** None

---

### F35: Add Hover States to Custom Components
**Priority:** 🔴 High
**Component:** Global
**Labels:** `ui`, `ux`, `interactions`

**Description:**
Ensure all interactive elements have hover states.

**Acceptance Criteria:**
- [ ] All cards have hover effect
- [ ] All buttons have hover state
- [ ] Smooth transitions (200ms)
- [ ] Pointer cursor on interactive elements

**Dependencies:** None

---

### F41: Remove Non-Functional "Use Location" Button
**Priority:** 🔴 High
**Component:** Rate Calculator
**Labels:** `cleanup`, `ux`

**Description:**
Remove "Use My Location" button until geolocation implemented.

**Files to Change:**
- `components/Calculator/RatecalclocationEnhanced.jsx`

**Acceptance Criteria:**
- [ ] Button removed
- [ ] No broken placeholders

**Dependencies:** None

---

## 🟡 Medium Priority - Polish & Features

### Build AddVehicleModal Component
**Priority:** 🟡 Medium
**Component:** Vehicles
**Labels:** `feature`, `modal`

**Description:**
Modal for adding new vehicles.

**Files to Create:**
- `components/Vehicles/AddVehicleModal.jsx` (NEW)

**Acceptance Criteria:**
- [ ] Form with all vehicle fields
- [ ] Validation
- [ ] Toast on success
- [ ] Responsive

**Dependencies:** None

---

### Build EditVehicleModal Component
**Priority:** 🟡 Medium
**Component:** Vehicles
**Labels:** `feature`, `modal`

**Description:**
Modal for editing vehicles.

**Files to Create:**
- `components/Vehicles/EditVehicleModal.jsx` (NEW)

**Acceptance Criteria:**
- [ ] Pre-filled form
- [ ] Save updates
- [ ] Toast on success

**Dependencies:** AddVehicleModal

---

### Build ChangePasswordModal Component
**Priority:** 🟡 Medium
**Component:** Profile
**Labels:** `feature`, `modal`, `auth`

**Description:**
Modal for changing password.

**Files to Create:**
- `components/Profile/ChangePasswordModal.jsx` (NEW)

**Acceptance Criteria:**
- [ ] 3 fields: current, new, confirm
- [ ] Password validation
- [ ] Show/hide toggle

**Dependencies:** None

---

### Build Construction Zone Alerts Component
**Priority:** 🟡 Medium
**Component:** Quote Results
**Labels:** `feature`, `route-analysis`

**Description:**
Display construction zones along route.

**Files to Create:**
- `lib/mockData/construction.js` (NEW)
- `components/quote/ConstructionAlerts.jsx` (NEW)

**Acceptance Criteria:**
- [ ] Lists zones with delays
- [ ] Color-coded severity
- [ ] Total delay estimate

**Dependencies:** None

---

### Build Fuel Optimizer Component
**Priority:** 🟡 Medium
**Component:** Quote Results
**Labels:** `feature`, `optimization`

**Description:**
Show recommended fuel stops.

**Files to Create:**
- `lib/mockData/fuelStops.js` (NEW)
- `components/quote/FuelOptimizer.jsx` (NEW)

**Acceptance Criteria:**
- [ ] 2-3 recommended stops
- [ ] Shows prices and savings
- [ ] Lists amenities

**Dependencies:** None

---

### Build Return Load Suggestions Component
**Priority:** 🟡 Medium
**Component:** Quote Results
**Labels:** `feature`, `optimization`

**Description:**
Show return load opportunities.

**Files to Create:**
- `components/quote/ReturnLoadSuggestions.jsx` (NEW)

**Acceptance Criteria:**
- [ ] 3-5 suggested loads
- [ ] Shows rates and distances
- [ ] Profit estimates

**Dependencies:** None

---

### F9: Pre-fill Equipment from Onboarding
**Priority:** 🟡 Medium
**Component:** Calculator
**Labels:** `ux`, `data-flow`

**Description:**
Pre-fill equipment from onboarding vehicle.

**Files to Change:**
- `components/Onboarding/Step4VehicleInfo.jsx`
- `components/Calculator/RatecalclocationEnhanced.jsx`

**Acceptance Criteria:**
- [ ] Equipment saves to profile
- [ ] Calculator reads and pre-selects

**Dependencies:** User context

---

### Fix Rewards Page Colors
**Priority:** 🟡 Medium
**Component:** Rewards
**Labels:** `ui`, `design-system`

**Description:**
Check and fix gradient usage in rewards badges.

**Files to Change:**
- `app/(dashboard)/rewards/page.js`

**Acceptance Criteria:**
- [ ] Gradients reviewed
- [ ] Standardize if needed

**Dependencies:** None

---

### Review and Enhance Empty States
**Priority:** 🟡 Medium
**Component:** Global
**Labels:** `ux`, `polish`

**Description:**
Ensure all lists have proper empty states.

**Files to Change:**
- `components/Dashboard/RecentQuotes.jsx`
- `components/Calculator/RatecalclocationEnhanced.jsx`

**Acceptance Criteria:**
- [ ] All collections have empty states
- [ ] Helpful CTAs included

**Dependencies:** None

---

### Add Quote Export Button
**Priority:** 🟡 Medium
**Component:** Quote Results
**Labels:** `feature`, `export`

**Description:**
Add export button with "coming soon" message.

**Files to Change:**
- `components/quote/quote.jsx`

**Acceptance Criteria:**
- [ ] "Export PDF" button in header
- [ ] Shows toast: "Coming soon"

**Dependencies:** None

---

### Minor UX Fixes Bundle
**Priority:** 🟡 Medium
**Component:** Various
**Labels:** `ux`, `polish`, `cleanup`

**Description:**
Collection of small UX improvements.

**Includes:** F10-F18, F21-F22, F24 (tooltips, labels, confirmations, etc.)

**Acceptance Criteria:**
- [ ] Placeholders removed/replaced
- [ ] Button labels consistent
- [ ] Terminology unified
- [ ] Helper text added

**Dependencies:** None

---

## 🟢 Testing & QA

### F36: Mobile Optimization and Testing
**Priority:** 🟢 Testing
**Component:** Global
**Labels:** `mobile`, `responsive`, `testing`

**Description:**
Test and fix responsive issues.

**Acceptance Criteria:**
- [ ] Tested on iPhone
- [ ] Tested on Android
- [ ] All touch targets 44×44px
- [ ] No horizontal scroll

**Dependencies:** None

---

### Full User Journey Testing
**Priority:** 🟢 Testing
**Component:** Global
**Labels:** `testing`, `qa`, `e2e`

**Description:**
Test complete flows end-to-end.

**Acceptance Criteria:**
- [ ] New user onboarding flow
- [ ] Calculate rate flow
- [ ] Vehicle management flow
- [ ] Quote management flow
- [ ] No console errors

**Dependencies:** All features

---

### Cross-Browser Testing
**Priority:** 🟢 Testing
**Component:** Global
**Labels:** `testing`, `compatibility`

**Description:**
Test across browsers.

**Acceptance Criteria:**
- [ ] Chrome works
- [ ] Safari works
- [ ] Firefox works
- [ ] Edge works
- [ ] Mobile browsers work

**Dependencies:** All features

---

### Accessibility Audit
**Priority:** 🟢 Testing
**Component:** Global
**Labels:** `a11y`, `accessibility`

**Description:**
Ensure WCAG 2.1 Level AA compliance.

**Acceptance Criteria:**
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Screen reader friendly
- [ ] Lighthouse score >90

**Dependencies:** All features

---

### Performance Optimization
**Priority:** 🟢 Testing
**Component:** Global
**Labels:** `performance`, `optimization`

**Description:**
Optimize for fast load times.

**Acceptance Criteria:**
- [ ] Lighthouse score >85
- [ ] Page load <3s
- [ ] Smooth scrolling

**Dependencies:** All features

---

## 📊 Progress Tracking

**Total Tasks:** 30
**Completed:** 0
**In Progress:** 0
**Pending:** 30

**High Priority:** 16 tasks
**Medium Priority:** 9 tasks
**Testing/QA:** 5 tasks
