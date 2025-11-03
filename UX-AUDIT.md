# Frontend UX Audit: Freight Rate Calculator
**Project:** Cargo Credible [azeezali]
**Date:** October 27, 2025
**Focus:** User journey, flow, and frontend experience

---

## Executive Summary

This audit evaluates how users move through the freight rate calculator application, focusing purely on the frontend user experience. The application has **two distinct user journeys**: a 5-step onboarding wizard and an advanced 4-stage rate calculator. While the visual design is clean and componentization is solid, there are significant **flow interruptions, unclear expectations, and missing navigational elements** that create friction in the user journey.

**Key Finding:** The application feels like **two separate products** (onboarding wizard + rate calculator) that have been placed side-by-side rather than integrated into a cohesive experience.

---

## The Complete User Journey

### Journey Map Overview

```
ENTRY → Step 1: User Type → Step 2: Profile → Step 3: Cost Calculator →
Step 4: Vehicle Info → Step 5: Achievements/Dashboard →
Rate Calculator (4 stages) → Quote Results → [END or New Calculation]
```

**Total User Investment:**
- 5 onboarding steps (estimated 8-12 minutes)
- 4 rate calculation stages (estimated 3-5 minutes per quote)
- **Total first-time experience: 11-17 minutes**

---

## Part 1: Onboarding Wizard (Steps 1-5)

### Step 1: User Type Selection ✅ Best Experience

**What the user sees:**
- Clear welcome message: "Welcome to the Freight Rate Calculator"
- Three user type options: Owner, Fleet, Dispatcher
- Progress indicator showing 20%
- Disabled "Continue" button until selection is made

**User Journey Strengths:**
- ✅ Single clear decision point
- ✅ Visual feedback on selection (button state changes)
- ✅ Can't proceed without making a choice
- ✅ Progress bar sets expectations (5 steps total)

**User Journey Issues:**

#### 🔴 Missing: Why does this matter?
- **What user experiences:** Sees three options but no explanation of what changes based on selection
- **User question:** "Will this affect my rate calculations? Can I change this later?"
- **Impact:** User may hesitate or choose incorrectly
- **Fix:** Add tooltip or subtitle explaining: "We'll customize calculations and terminology for your role"

#### 🟡 Missing: Ability to explore without committing
- **What user experiences:** Must choose a type to see anything else
- **User question:** "Can I just see what this tool does first?"
- **Impact:** May cause drop-off from curious users
- **Fix:** Add "Skip for now" option that defaults to Owner

---

### Step 2: Profile Creation ⚠️ First Friction Point

**What the user sees:**
- Form with Name, Email, Phone, Company fields
- Three role buttons: Driver, Dispatcher, Carrier
- Progress at 40%
- Back button appears for first time

**User Journey Strengths:**
- ✅ Back button allows correction of Step 1 choice
- ✅ Company field labeled as optional
- ✅ Two-column layout for email/phone is efficient

**User Journey Issues:**

#### 🔴 Terminology Confusion
- **What user experiences:** Selected "Owner" in Step 1, now sees "Driver/Dispatcher/Carrier" in Step 2
- **User question:** "Wait, are these the same thing? Do I pick Dispatcher again?"
- **Impact:** Confusion about whether selections match
- **Location:** Step1.jsx shows "Owner/Fleet/Dispatcher", Step2.jsx shows "Driver/Dispatcher/Carrier"
- **Fix:** Unify terminology OR explain: "Now, tell us specifically what you do day-to-day"

#### 🔴 No validation feedback until too late
- **What user experiences:** Can type anything in any field, click Continue immediately
- **User question:** "Did I type my email correctly? Is this phone format okay?"
- **Impact:** May enter incorrect data unknowingly
- **Fix:** Real-time validation indicators (green checkmark when valid)

#### 🟡 Purpose of data collection unclear
- **What user experiences:** Asked for personal info but doesn't know why
- **User question:** "Why do you need my phone number? Will you call me?"
- **Impact:** Privacy concerns may cause abandonment
- **Fix:** Add context: "We'll use this to save your profile and calculations"

#### 🟡 Button says "Continue to cost calculator"
- **What user experiences:** Expects to see calculator next, but gets another setup step
- **User question:** "Wait, I thought we were going to the calculator?"
- **Impact:** Expectation mismatch
- **Location:** Step2.jsx:127
- **Fix:** Change to "Continue" (matches other steps) or "Continue Setup"

---

### Step 3: Cost Per Mile Calculator ⚠️ Most Complex Step

**What the user sees:**
- Radio choice: "Use Industry Averages" vs "Enter My Own Data"
- Vehicle type dropdown
- Maximum payload input (disabled if using averages)
- Monthly/Annually toggle for miles driven
- Two-column layout: Fixed Costs vs Variable Costs (in separate components)
- Cost per mile summary at bottom
- Progress at 70%

**User Journey Strengths:**
- ✅ Clear visual hierarchy with blue background sections
- ✅ Back button allows returning to Step 2
- ✅ Radio buttons make mutually exclusive choices clear
- ✅ Two-column layout is visually balanced

**User Journey Issues:**

#### 🔴 User can't see what "Industry Averages" means until selecting
- **What user experiences:** Radio buttons appear before any cost information is visible
- **User question:** "What costs are we talking about? Insurance? Fuel?"
- **Impact:** Must guess which option to choose without context
- **Fix:** Show preview of both options OR place radio buttons AFTER showing cost categories

#### 🔴 Monthly/Annually toggle is risky
- **What user experiences:** Enters "10,000" in miles, clicks "Annually" toggle
- **User sees:** Value jumps to "120,000" automatically
- **User reaction:** "Wait, did I break something? Did I lose my number?"
- **Impact:** Fear of data loss, confusion about what happened
- **Location:** Step3.jsx:126-181 (complex conversion logic on click)
- **Fix:** Add confirmation: "Switch to Annually? This will convert your entered 10,000 to 120,000 miles"

#### 🔴 Fixed/Variable costs in separate components
- **What user experiences:** Scrolls through form, sees two columns but no running totals
- **User question:** "How much did I enter so far? Are these numbers reasonable?"
- **Impact:** Can't validate inputs until final summary
- **Location:** Step3.jsx:112-116 (Step3fixedcosts, Step3variablecosts)
- **Fix:** Add subtotal at bottom of each column

#### 🟠 Disabled payload field with no explanation
- **What user experiences:** Clicks on Maximum Payload field, nothing happens
- **User thought:** "Is this broken? Why can't I type here?"
- **Impact:** Appears to be a bug
- **Location:** Step3.jsx:104 (disabled={costdata.radio === "default"})
- **Fix:** Add tooltip on hover: "Payload is set automatically for industry averages. Select 'Enter My Own Data' to customize."

#### 🟡 Cost summary shows hardcoded values
- **What user experiences:** Enters various costs, sees "Your Cost Per Mile: $1.75/mile"
- **User question:** "Is this calculating from my numbers or just a placeholder?"
- **Impact:** Uncertainty about whether calculator is working
- **Location:** Step3.jsx:202 (hardcoded value)
- **User expectation:** Number should visibly change as they enter costs

#### 🟡 Two cost breakdowns both say "Fixed Costs"
- **What user experiences:** Sees "Fixed Costs: $0.33/mile" twice
- **User thought:** "That's definitely a typo"
- **Impact:** Looks unfinished
- **Location:** Step3.jsx:206-214
- **Fix:** Second should say "Variable Costs"

---

### Step 4: Vehicle Information ⚠️ Longest Form

**What the user sees:**
- Four vehicle type options (Semi Truck, Sprinter Van, Box Truck, Cargo Van)
- VIN input (labeled optional)
- Vehicle specifications: Year, Make, Model, Fuel Type, MPG
- Equipment type checkboxes (8 options)
- Endorsements checkboxes (5 options)
- "Other Qualifications" text area
- Two buttons: "Add This Vehicle" and "Add & Continue"
- Progress at 90%

**User Journey Strengths:**
- ✅ Back button present
- ✅ Clear visual sections separate different types of information
- ✅ Good responsive grid for equipment types
- ✅ VIN labeled as optional (clear expectations)

**User Journey Issues:**

#### 🔴 VIN field promises functionality that doesn't exist
- **What user experiences:** Reads helper text "Enter VIN to auto-fill vehicle specifications"
- **User action:** Types VIN, waits for auto-fill
- **What happens:** Nothing
- **User thought:** "Did I type it wrong? Is this working?"
- **Impact:** Disappointment, feels like broken promise
- **Location:** Step4.jsx:177-182
- **Fix:** Either remove promise OR change to: "VIN for your records (optional)"

#### 🔴 Two buttons with unclear difference
- **What user experiences:** Finishes filling out form, sees two green/blue buttons
- **User question:** "What's the difference between 'Add This Vehicle' and 'Add & Continue'?"
- **User uncertainty:** "If I click 'Add & Continue', does it save this vehicle?"
- **Impact:** Decision paralysis, may click wrong button
- **Location:** Step4.jsx:279-302
- **Fix:** Clarify labels:
  - "Save & Add Another Vehicle" (loops back to empty form)
  - "Save & Go to Dashboard" (proceeds to Step 5)

#### 🟠 Placeholder text "vehicle.details" still visible
- **What user experiences:** Sees "vehicle.details" as a heading
- **User thought:** "That looks like a placeholder that wasn't replaced"
- **Impact:** Appears unfinished
- **Location:** Step4.jsx:173
- **Fix:** Replace with "Vehicle Specifications"

#### 🟡 No indication of how many vehicles to add
- **What user experiences:** Completes one vehicle form
- **User question:** "Should I add all my vehicles now? Or just one?"
- **Impact:** Unclear expectations
- **Fix:** Add guidance: "Add your first vehicle (you can add more later from your dashboard)"

#### 🟡 Equipment options same for all vehicle types
- **What user experiences:** Selects "Cargo Van", still sees "Lowboy" as an option
- **User thought:** "A cargo van can't pull a lowboy trailer... these options don't make sense"
- **Impact:** Confusion, appears generic rather than tailored
- **Location:** Step4.jsx:242-251
- **Fix:** Filter equipment by vehicle type

---

### Step 5: Dashboard & Achievements ⚠️ Jarring Transition

**What the user sees:**
- Green success banner: "Setup Complete!"
- Gamification section: Level 1 progress, achievement badges
- Achievement grid showing 10 "New Trucker" badges (all identical)
- "Unlock more achievements" prompt
- "Premium achievements" upsell with "Upgrade" button
- "Truck Stop Preferences" collapsed section
- Advanced Rate Calculator appears below
- Progress at 100%

**User Journey Strengths:**
- ✅ Clear indication that setup is complete
- ✅ Positive reinforcement with checkmark icon
- ✅ Rate Calculator is immediately accessible
- ✅ No more forced onboarding steps

**User Journey Issues:**

#### 🔴 All achievements show "New Trucker" placeholder
- **What user experiences:** Sees 10 identical gray badges, all saying "New Trucker"
- **User thought:** "This looks like placeholder content they forgot to finish"
- **Impact:** Damages credibility of the entire application
- **Location:** Step5.jsx:69-80
- **Fix:** Either implement actual achievements OR remove this section entirely until ready

#### 🔴 Level progress bar stuck at 0%
- **What user experiences:** Sees "Progress to Level 2: 0%"
- **User thought:** "I just finished 5 setup steps and I'm still at 0%?"
- **Impact:** Feels unrewarding, gamification falls flat
- **Location:** Step5.jsx:48-56
- **Fix:** Either implement progression OR remove leveling system

#### 🟠 Gamification feels mismatched for professional tool
- **What user experiences:** Came to calculate freight rates (professional task), sees achievement badges and levels (game-like)
- **User question:** "Is this a serious business tool or a game?"
- **Impact:** May reduce trust in accuracy of calculations
- **User research:** Trucking industry professionals prioritize utility over engagement tricks
- **Fix:** Consider making gamification opt-in OR remove for professional users

#### 🟠 Premium upsell too early
- **What user experiences:** Just finished setup (hasn't even used calculator yet), sees "Unlock Premium achievements - Subscribe to earn exclusive badges"
- **User thought:** "I haven't even tried the free version yet and you're asking me to pay?"
- **Impact:** Feels like "bait and switch", reduces trust
- **Location:** Step5.jsx:99-117
- **Fix:** Show premium upsell AFTER user has successfully calculated their first rate

#### 🟡 "Truck Stop Preferences" appears non-functional
- **What user experiences:** Sees up arrow icon next to "Truck Stop Preferences"
- **User action:** Clicks on it expecting it to expand
- **What happens:** Nothing
- **Impact:** Feels broken
- **Location:** Step5.jsx:122-130
- **Fix:** Either implement accordion OR remove this preview element

#### 🟡 Unclear transition to Rate Calculator
- **What user experiences:** Scrolls down from achievements section, suddenly sees "Advanced Rate Calculator"
- **User question:** "Wait, is this part of Step 5 or something new?"
- **Impact:** Doesn't feel like a clear next step
- **Fix:** Add transition element: "Now you're ready to calculate your first rate" with CTA button

---

## Part 2: Advanced Rate Calculator (4 Stages)

### Overall Rate Calculator Flow

**Journey Structure:**
```
Location → Load Details → Service → Conditions → Quote Results
```

**What the user sees:**
- Blue gradient header with "Advanced Rate Calculator"
- "Searches Used: 0/5" counter
- Horizontal progress bar (25% → 50% → 75% → 100%)
- Stage icons showing: Location, Load Details, Service, Conditions
- Current stage content in white card below

**User Journey Strengths:**
- ✅ Clear 4-stage progression
- ✅ Visual progress indicator is prominent
- ✅ Stage icons provide context of what's coming
- ✅ Clean, professional presentation
- ✅ Each stage has "Previous" button (good!)

**User Journey Issues:**

#### 🔴 No indication of current stage besides progress bar
- **What user experiences:** Looking at stage icons, all look the same
- **User question:** "Which stage am I on right now?"
- **Impact:** Must deduce from content or remember
- **Fix:** Highlight current stage icon (already implemented in Ratestepicon, verify it's working)

#### 🔴 Can't jump between stages
- **What user experiences:** Completes Location stage, now on Load Details, realizes forgot to enter deadhead miles
- **User action:** Clicks "Location" icon expecting to go back
- **What happens:** Nothing (icons aren't clickable)
- **Impact:** Must click "Previous" multiple times to go back
- **Fix:** Make completed stage icons clickable to allow jumping back

#### 🟠 "Searches Used: 0/5" never increments
- **What user experiences:** Completes multiple rate calculations, counter stays at 0/5
- **User question:** "Is this tracking anything? When will I hit the limit?"
- **Impact:** Unclear if feature is working or just decorative
- **Location:** Ratecalc.jsx:69-70
- **Fix:** Either implement counter OR remove it (better to not show limits than show fake ones)

#### 🟡 No way to save partial progress
- **What user experiences:** Fills out Location and Load Details, needs to leave computer
- **User action:** Closes browser
- **What happens:** All data lost
- **User thought:** "I have to start over from the beginning?"
- **Impact:** Frustration if interrupted mid-calculation
- **Fix:** Auto-save to localStorage, show "Your progress has been saved" message

---

### Stage 1: Location Details ✅ Well-Structured

**What the user sees:**
- Origin and Destination inputs (side by side on desktop)
- Three checkboxes: Airport Pickup, Airport Delivery, TSA Clearance
- "Deadhead Miles To Pickup" input with "Use Location" button
- Load Type toggle: "Full Load" vs "LTL Partial" (visual cards)
- Conditional: If LTL selected, shows checkbox for "Dedicated truck required"
- Equipment selector dropdown (green background)
- "Next: Load Details" button (right-aligned)

**User Journey Strengths:**
- ✅ Logical top-to-bottom flow
- ✅ Related fields grouped together
- ✅ Conditional display (LTL checkbox) provides contextual options
- ✅ Visual card selection for Load Type is intuitive
- ✅ Clear "Next" button with stage name

**User Journey Issues:**

#### 🔴 Origin/Destination have no validation
- **What user experiences:** Types "abc" in Origin field
- **What happens:** Accepted without question
- **User thought:** "Should I be typing in a specific format?"
- **Impact:** May enter invalid data that causes issues later
- **Fix:** Add format guidance: "Enter City, State or ZIP code" + show example

#### 🟠 "Use Location" button appears functional but isn't
- **What user experiences:** Sees "Use Location" button next to deadhead miles
- **User action:** Clicks button expecting it to calculate distance
- **What happens:** Nothing
- **Impact:** Broken promise, feels incomplete
- **Location:** Ratecalclocation.jsx:51-59
- **Fix:** Either implement functionality OR remove button until ready

#### 🟡 Equipment selector duplicates Step 4 choice
- **What user experiences:** Selected equipment in Step 4 (Onboarding), now asked again
- **User question:** "Didn't I already tell you what equipment I have?"
- **Impact:** Feels repetitive
- **Fix:** Pre-populate with Step 4 selection + change label to "Confirm equipment for this load"

#### 🟡 Load Type cards don't explain cost impact
- **What user experiences:** Sees "Full Load" and "LTL Partial" options
- **User question:** "Which one gives me a better rate?"
- **Impact:** Must guess or know industry terminology
- **Fix:** Add subtitle: "Full Load: Dedicated truck, typically lower per-pound rate" / "LTL: Shared truck, typically higher per-pound rate"

---

### Stage 2: Load Details ✅ Clean Form

**What the user sees:**
- Weight input and Freight Type dropdown (side by side)
- Conditional: If "Refrigerated" selected, shows temperature inputs
- Commodity input
- Conditional: If "Oversized" selected, shows dimensions input
- Three checkboxes: Requires endorsement, Military/Restricted, Distribution Center
- Large checkbox: "Requires printed paperwork ($15 fee)"
- "Previous" button (left) and "Next: Service Details" button (right)

**User Journey Strengths:**
- ✅ Conditional fields appear contextually (refrigerated temps, oversized dimensions)
- ✅ Clear indication of additional fees ($15 for paperwork)
- ✅ Back and forward buttons clearly labeled
- ✅ Logical grouping of related information

**User Journey Issues:**

#### 🟡 Freight Type dropdown duplicates equipment selector from Stage 1
- **What user experiences:** Selected "Dry Van" in Stage 1, now sees "Freight Type" dropdown with same options
- **User question:** "Is Freight Type different from Equipment Type? Should these match?"
- **Impact:** Confusion about relationship between stages
- **Fix:** Either pre-fill from Stage 1 OR rename to clarify difference ("Load Type" vs "Equipment Type")

#### 🟡 No guidance on weight limits
- **What user experiences:** Types "100000" in Weight field
- **What happens:** Accepted without warning
- **User question:** "Is this within my vehicle's capacity?"
- **Impact:** May enter unrealistic weight
- **Fix:** Show vehicle's max payload below input: "Your vehicle: Max 45,000 lbs" with warning if exceeded

#### 🟡 Commodity field is vague
- **What user experiences:** Sees placeholder "e.g Electronics, Food, Products, etc."
- **User question:** "How specific should I be? Does 'Electronics' vs 'Computers' matter?"
- **Impact:** Unclear what level of detail is needed
- **Fix:** Add helper text: "General category for rate calculation (e.g., Electronics, Produce, Building Materials)"

---

### Stage 3: Service Requirements ✅ Most Polished Stage

**What the user sees:**
- Delivery Date (date picker) and Delivery Time (dropdown) side by side
- Delivery Urgency and Driver Type dropdowns
- Service Level and Tracking Requirements dropdowns
- "Special Equipment Needed" section with 8 checkboxes in grid
- "Previous" and "Next: Conditions" buttons

**User Journey Strengths:**
- ✅ Excellent visual organization with section headers
- ✅ Icons next to section titles add visual interest
- ✅ Grouped related fields logically
- ✅ Helper text on date input clarifies purpose
- ✅ Checkbox grid for equipment is scannable

**User Journey Issues:**

#### 🟡 Delivery date doesn't default to any value
- **What user experiences:** Arrives at stage, sees empty date picker
- **User question:** "Should I pick today? Tomorrow? When is typical?"
- **Impact:** Requires mental work to decide
- **Fix:** Default to "Tomorrow" or show current date as placeholder with helper text: "Leave blank for flexible scheduling"

#### 🟡 Urgency options don't show cost impact
- **What user experiences:** Sees "Standard / Express / Rush / Same Day" options
- **User question:** "How much extra does Express cost? Is Rush worth it?"
- **Impact:** Can't make informed cost-benefit decision
- **Fix:** Add cost modifiers in labels: "Express (+15%)" / "Rush (+30%)" / "Same Day (+50%)"

#### 🟡 Service level terminology may be unfamiliar
- **What user experiences:** Sees "White Glove / Driver Assist / Inside Delivery / Curbside"
- **User question:** "What does 'White Glove' mean? I just want them to unload it."
- **Impact:** May select wrong option
- **Fix:** Add descriptions in dropdown or tooltip: "White Glove: Full unpack and setup service"

---

### Stage 4: Conditions ✅ Final Data Collection

**What the user sees:**
- Four fields in 2x2 grid:
  - Weather Conditions dropdown
  - Season dropdown
  - Fuel Price input ($/gallon)
  - Destination Market dropdown
- Helper text under Fuel Price: "Auto-calculated based on current route prices"
- Helper text under Destination Market: "Market rating is auto-detected based on destination"
- "Previous" button and "Calculate Rate" button with search icon

**User Journey Strengths:**
- ✅ Clean, simple layout (shortest stage)
- ✅ "Calculate Rate" button signals end of data collection
- ✅ Icon on button adds emphasis (this is the big action)
- ✅ Helper text explains auto-calculated fields

**User Journey Issues:**

#### 🟡 Auto-calculated fields are editable
- **What user experiences:** Reads "Auto-calculated based on current route prices" but field is editable
- **User question:** "Should I change this? Or leave it as-is? Is the auto-calculation happening?"
- **Impact:** Unclear whether to trust auto-fill or manually adjust
- **Fix:** Either make field read-only with "Override" button OR remove "auto-calculated" text if user must enter manually

#### 🟡 Weather/Season feel redundant
- **What user experiences:** Sees separate dropdowns for Weather and Season
- **User question:** "Isn't weather related to season? Why do I need both?"
- **Impact:** Feels like unnecessary work
- **Fix:** Consider combining: "Expected Conditions" with options like "Normal Summer" / "Winter Storm" / "Heavy Rain (any season)"

#### 🟡 No summary before calculating
- **What user experiences:** Clicks "Calculate Rate" immediately after filling form
- **User thought:** "Wait, did I enter everything correctly?"
- **Impact:** May have typos or errors that aren't caught
- **Fix:** Add optional "Review All Details" expandable section above Calculate button

---

## Part 3: Quote Results

### Quote Display Experience

**What the user sees:**
- Large heading: "Rate Calculation Complete" with green checkmark
- Three rate cards: Recommended Rate, Spot Market Rate, Contract Rate
- Detailed breakdown sections with expandable cards
- Route analysis showing pickup/delivery markets
- Market analysis with "Next Money Lanes"
- Broker verification section
- "Book This Load" section with form
- Detailed rate breakdown table
- Action buttons: Share Quote, Save Quote, Compare Rates, etc.
- "New Calculation" button at bottom

**User Journey Strengths:**
- ✅ Comprehensive information provided
- ✅ Multiple rate options let user compare
- ✅ Professional presentation with good use of space
- ✅ Clear visual hierarchy (most important info first)
- ✅ Responsive design works on mobile

**User Journey Issues:**

#### 🔴 Overwhelming amount of information
- **What user experiences:** After clicking Calculate, sees MASSIVE page of data
- **User reaction:** "Whoa, this is a lot to process. Where do I look first?"
- **Impact:** Cognitive overload, may miss important details
- **Fix:** Implement progressive disclosure:
  1. Show rates first (what user wants most)
  2. Add "Show Detailed Breakdown" button to reveal rest
  3. OR: Split into tabs: "Rates | Route Analysis | Market Data | Book Load"

#### 🟠 Three different rates with no clear "pick this one" guidance
- **What user experiences:** Sees $3,450 (Recommended), $3,285 (Spot Market), $3,615 (Contract)
- **User question:** "Which one should I actually quote to my customer? What's the difference?"
- **Impact:** User must research or guess
- **Fix:** Add "Best for:" labels:
  - "Recommended: Best balance of profit and competitiveness"
  - "Spot Market: Current market rate (may fluctuate)"
  - "Contract: Stable rate for recurring shipments"

#### 🟠 "Book This Load" section appears functional but isn't
- **What user experiences:** Sees "Book This Load" with form fields
- **User action:** Fills out form, clicks button
- **What happens:** (Unknown - likely nothing or placeholder)
- **Impact:** Sets expectation that load booking is available
- **Fix:** Either implement functionality OR remove section until ready (show "Export Quote" instead)

#### 🟡 Market analysis data looks fake
- **What user experiences:** Sees very specific numbers: "507 loads available", "Truck-to-load ratio: 1.22:1"
- **User question:** "Is this real data or just an example?"
- **Impact:** If fake, damages trust in all other calculations
- **Fix:** Add data source citation: "Data from DAT Load Board (Updated: Oct 27, 2025)" OR label clearly as "Sample Data"

#### 🟡 No way to edit and recalculate
- **What user experiences:** Sees quote, realizes forgot to add liftgate requirement
- **User thought:** "Now I have to start completely over?"
- **Impact:** Frustration, wasted time
- **Fix:** Add "Edit Calculation" button that returns to Stage 1 with all fields pre-filled

#### 🟡 "New Calculation" button is small and far away
- **What user experiences:** Scrolls through entire long quote page, reaches bottom, sees small gray button
- **User thought:** "Where's the button to calculate another rate?"
- **Impact:** May miss it and be unsure how to proceed
- **Location:** Ratecalc.jsx:39-47
- **Fix:** Add second "New Calculation" button at TOP of quote (sticky header?) for easy access

---

## Part 4: Cross-Cutting User Experience Issues

### Navigation & Wayfinding

#### 🔴 Cannot return to onboarding steps from Rate Calculator
- **User Journey:**
  1. Completes all 5 onboarding steps
  2. Calculates a rate
  3. Realizes vehicle MPG was wrong in Step 4
  4. Looks for way to edit vehicle info
  5. Finds no navigation back to Step 4
- **Impact:** Must refresh page and start over (loses all progress)
- **Fix:** Add persistent navigation: "Profile | Vehicles | Settings" accessible from anywhere

#### 🟠 No breadcrumb or "You are here" indicator
- **What user experiences:** Using application, loses track of where they are
- **User question:** "Am I still in onboarding? Or am I in the calculator now?"
- **Impact:** Disorientation
- **Fix:** Add breadcrumb: "Dashboard > Rate Calculator > Location" or "Setup > Step 3 of 5"

#### 🟡 Back button behavior inconsistent
- **Observation:**
  - Steps 1-5: Back button goes to previous step
  - Rate Calculator: Back button goes to previous stage
  - Quote: Back button doesn't exist (only "New Calculation")
- **Impact:** User must learn different navigation patterns
- **Fix:** Standardize: Always show "Back" button with consistent behavior

### Information Architecture

#### 🟠 Onboarding and Rate Calculator feel disconnected
- **What user experiences:**
  1. Spends 10 minutes entering vehicle info and costs in Steps 3-4
  2. Proceeds to Rate Calculator
  3. Must enter equipment type AGAIN
  4. Cost per mile from Step 3 doesn't appear anywhere in calculator
- **User question:** "Why did I enter all that information if you're not using it?"
- **Impact:** Feels like wasted effort, reduces trust
- **Fix:** Show visual connection:
  - "Using your Semi Truck (14.5 MPG) | Cost/Mile: $1.75" in calculator header
  - Pre-fill equipment from Step 4

#### 🟡 Two separate progress systems
- **Observation:**
  - Onboarding: 20% → 40% → 70% → 90% → 100%
  - Rate Calculator: 25% → 50% → 75% → 100%
- **User experience:** Progress bar resets when reaching Rate Calculator
- **Impact:** Feels like starting over
- **Fix:** Overall progress: "Setup Complete ✓ | Rate Calculation: Stage 2 of 4"

### Visual Hierarchy & Clarity

#### 🟡 Helper text inconsistency
- **Observation:**
  - Some fields have helper text, some don't
  - Some helper text is informative ("Enter city name or ZIP code")
  - Some helper text promises features that don't exist ("Auto-calculated based on current route prices")
- **Impact:** Unclear which text to trust
- **Fix:** Audit all helper text:
  - Instructional: How to fill this field
  - Informational: Why we need this data
  - Remove all references to non-existent features

#### 🟡 Button label inconsistency
- **Observation:**
  - Step 2: "Continue to cost calculator"
  - Step 3: "Continue to Vehicle Information"
  - Step 4: "Add & Continue"
  - Rate Calc Stage 1: "Next: Load Details"
  - Rate Calc Stage 4: "Calculate Rate"
- **Impact:** Slightly jarring, feels less polished
- **Fix:** Standardize primary action button:
  - Onboarding: "Continue" (all steps)
  - Rate Calculator: "Next: [Stage Name]" (stages 1-3), "Calculate Rate" (stage 4)

### Mobile Experience

#### 🟡 Form fields stack on mobile (expected) but affect flow
- **What user experiences on mobile:**
  - Two-column layouts become single column
  - Much more scrolling required
  - "Previous" and "Next" buttons stack vertically
- **Impact:** Takes longer to complete on mobile
- **Fix (low priority):** Consider mobile-specific optimizations:
  - Larger touch targets for dropdowns
  - "Continue" button could be sticky at bottom on mobile
  - Add "Jump to top" button for long forms

#### 🟡 Quote results especially long on mobile
- **What user experiences:** Scrolls through 3-4 full screens of quote data on phone
- **Impact:** Hard to reference specific rates while scrolling through analysis
- **Fix:** Make rate cards sticky at top on mobile OR add "Back to Rates" floating button

### Expectations vs. Reality

#### 🔴 Setup implies data will be used, but isn't visibly connected
- **User Journey:**
  1. Enters detailed cost data in Step 3
  2. Enters vehicle specifications in Step 4
  3. Proceeds to Rate Calculator
  4. Rate Calculator doesn't reference any of this data
  5. Cost per mile doesn't appear in quote
  6. Vehicle specs don't affect calculation (visibly)
- **User thought:** "Did the app even use what I entered?"
- **Impact:** Major trust issue—why complete 5-step setup if it's not used?
- **Fix:** Make connections visible:
  - Show vehicle in calculator: "Calculating for: 2020 Freightliner (Semi Truck)"
  - Show cost basis in quote: "Your cost: $1.75/mi | Recommended rate: $2.45/mi = $0.70/mi profit"

#### 🟠 Professional tool vs. Gamification mismatch
- **Target User:** Owner-operators, fleet managers, dispatchers (per Quote PDF)
- **User Need:** Accurate rate calculations to make money
- **What app shows:** Achievement badges, experience levels, "New Trucker" titles
- **Impact:** Creates tonal dissonance—feels less serious
- **Fix:** Make gamification optional:
  - Add preference: "Show achievements" (default: OFF for professional users)
  - OR: Remove entirely until core calculations are proven accurate

---

## Summary of User Journey Pain Points

### Top 5 Flow-Breaking Issues

1. **Onboarding data appears unused** → Entering costs & vehicle specs feels pointless when not visibly connected to rate calculation

2. **No way to edit previous information** → Must start over if realize mistake was made 3 steps ago

3. **Too many questions before seeing value** → 5-step onboarding (8-12 minutes) before user can calculate first rate

4. **Terminology confusion** → Owner vs Driver, Equipment vs Freight Type, multiple similar questions

5. **Overwhelming quote results** → Massive page of data with no clear "here's your rate, here's what to do" guidance

### The Ideal Flow (User Perspective)

**What users expect:**
1. Land on homepage
2. Quick 2-3 fields: From, To, Weight
3. Click "Calculate"
4. See rate immediately
5. THEN: "Get more accurate rates by adding details" → leads to setup

**What users currently get:**
1. Land on homepage
2. Choose user type
3. Enter profile info
4. Enter detailed costs
5. Enter vehicle specs
6. See achievement gamification
7. THEN start rate calculator (4 more stages)
8. Finally see quote

**The disconnect:** Application optimizes for "complete profile first" when users want "calculate rate first, refine later"

---

## Recommendations by Priority

### CRITICAL: Fix These to Make Flow Usable

1. **Add visible connection between setup and calculator**
   - Show vehicle info in calculator header
   - Display cost per mile in quote results
   - Pre-fill equipment from onboarding

2. **Add navigation between all steps**
   - Make completed steps/stages clickable
   - Add "Edit Vehicle" / "Edit Profile" buttons
   - Allow jumping back without losing progress

3. **Clarify button purposes**
   - Fix "Add This Vehicle" vs "Add & Continue" confusion
   - Standardize all button labels
   - Make primary action always obvious

4. **Remove or fix placeholder content**
   - Achievement badges showing "New Trucker" x10
   - Level progress stuck at 0%
   - "vehicle.details" text
   - Non-functional "Use Location" button

### HIGH: Improve These for Better UX

1. **Reduce information overload in quote**
   - Use progressive disclosure
   - Show rates first, details behind "Show More"
   - Add clear recommendation: "We recommend quoting $X"

2. **Add wayfinding elements**
   - Breadcrumb navigation
   - "You are here" indicators
   - Overall progress: "2 of 9 steps complete"

3. **Explain relationships between fields**
   - Why asking for user type twice (Step 1 and Step 2)
   - Why asking for equipment twice (Step 4 and Rate Calc Stage 1)
   - How onboarding data affects calculations

4. **Add input validation and guidance**
   - Format hints for locations: "City, State or ZIP"
   - Weight limit warnings based on vehicle capacity
   - Cost impact of urgency selections: "Rush (+30%)"

### MEDIUM: Polish These for Professional Feel

1. **Unify terminology throughout**
   - Owner/Driver/Operator consistency
   - Equipment Type vs Freight Type clarity
   - Load Type vs Service Level distinction

2. **Add contextual help**
   - Tooltips on unfamiliar terms (White Glove, LTL)
   - "Why do you need this?" explanations
   - Examples of correct input format

3. **Improve mobile experience**
   - Sticky buttons on long forms
   - Larger touch targets
   - "Back to top" shortcuts

4. **Make auto-save visible**
   - "Your progress is saved" notifications
   - "Resume where you left off" on return
   - "Unsaved changes" warnings

### LOW: Consider for Future Versions

1. **Alternative onboarding flow**
   - "Quick quote" path: 3 fields → rate → optional detailed setup
   - "Full setup" path: Current 5-step flow

2. **Quote customization**
   - Let users hide sections they don't need
   - Save preferred quote format
   - One-click PDF export with branding

3. **Conditional onboarding**
   - If Owner-Operator: Ask about one vehicle
   - If Fleet Manager: Ask about multiple vehicles
   - If Dispatcher: Skip vehicle ownership questions

---

## Conclusion

**The Good News:**
The application has a solid visual foundation, clean component architecture, and comprehensive feature set. The UI is modern and responsive, and the information collected is appropriate for accurate rate calculations.

**The Challenge:**
The user journey feels like two separate applications (onboarding + calculator) rather than one integrated experience. Users invest 10+ minutes in setup but don't see clear benefit from that investment. Navigation is one-way (can't go back), and the relationship between entered data and calculation results is invisible.

**The Path Forward:**
Focus on **connecting the dots** for users:
1. Make onboarding data visibly affect calculations
2. Allow easy editing of all entered information
3. Add navigation between all parts of the app
4. Reduce information overload with progressive disclosure
5. Clarify the purpose and benefit of each step

**Estimated Impact of Fixes:**
- Critical fixes: Transforms from "confusing" to "usable" (2-3 days work)
- High fixes: Transforms from "usable" to "pleasant" (3-4 days work)
- Medium + Low fixes: Transforms from "pleasant" to "professional" (5-6 days work)

**Total timeline to polished UX: 10-13 days of focused frontend work**

The foundation is strong—these are refinement issues, not fundamental problems. With the recommended navigation, wayfinding, and connection improvements, this can become an excellent user experience for freight rate calculation.
