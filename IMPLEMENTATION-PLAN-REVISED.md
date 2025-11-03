# Implementation Plan: UX Improvements (REVISED)
**Project:** Cargo Credible Freight Calculator
**Based on:** UX-AUDIT.md + Freight Calculator Quote.pdf
**Revision Note:** Features like achievements, referrals, and user engagement are CORE per Quote PDF - we build them properly, not remove them
**Format:** GitHub Issues Ready

---

## Key Revision: Build, Don't Remove

Based on the Quote PDF (Month 2.5 features), the following are **required MVP features**:
- ✅ **Referral Rewards System** - "Complete referral tracking system with unique referral codes, reward point calculation, redemption interface, automated reward distribution, and fraud prevention with comprehensive analytics dashboard"
- ✅ **User Dashboard & Analytics** - "Central dashboard displaying recent quotes, saved rates, user statistics, quick access functions, and basic analytics"
- ✅ **User Engagement** - "Active dashboard usage with saved quote functionality and referral system adoption"

**Therefore:** Epic 7 has been revised from "Remove/Fix Broken Features" to **"Implement Engagement Features Properly"**

---

## Project Structure

### Labels to Create in GitHub

**Priority Labels:**
- `priority: critical` - Blocks core functionality, must fix first
- `priority: high` - Major UX improvements
- `priority: medium` - Quality of life improvements
- `priority: low` - Polish and refinement
- `priority: future` - Post-MVP enhancements

**Type Labels:**
- `type: navigation` - Navigation and wayfinding
- `type: content` - Copy, text, terminology
- `type: form` - Form inputs and validation
- `type: visual` - UI polish and feedback
- `type: feature` - New feature implementation
- `type: data-flow` - Data connection between components
- `type: engagement` - User engagement and gamification

**Epic Labels:**
- `epic: navigation-wayfinding`
- `epic: data-connection`
- `epic: content-fixes`
- `epic: form-improvements`
- `epic: visual-feedback`
- `epic: cognitive-load`
- `epic: engagement-features` ← NEW

**Feature Labels:** (for tracking Quote PDF requirements)
- `feature: referral-system`
- `feature: achievements`
- `feature: dashboard`
- `feature: saved-quotes`

---

## Implementation Order (REVISED)

### Phase 1: Foundation (Week 1)
**Goal:** Fix critical UX issues that block usability
- Epic 1: Navigation & Wayfinding (4 tickets)
- Epic 3: Content & Copy Fixes (4 tickets)
- Epic 2: Data Connection (3 tickets) - Show onboarding data is used

### Phase 2: Core Features (Weeks 2-3)
**Goal:** Implement engagement features properly per Quote PDF
- Epic 7: Engagement Features (7 tickets) ← REVISED
- Epic 4: Form Improvements (4 tickets)
- Epic 5: Visual Feedback (4 tickets)

### Phase 3: Polish (Week 4)
**Goal:** Reduce cognitive load and finalize UX
- Epic 6: Cognitive Load (4 tickets)
- Testing & refinement

---

# Epic 1: Navigation & Wayfinding
*(Same as original - no changes needed)*

## Ticket 1.1: Add Step Navigation to Onboarding Wizard
[Content unchanged from original]

## Ticket 1.2: Add Back Navigation to Rate Calculator Stages
[Content unchanged from original]

## Ticket 1.3: Make Rate Calculator Stage Icons Clickable
[Content unchanged from original]

## Ticket 1.4: Add Breadcrumb Navigation
[Content unchanged from original]

---

# Epic 2: Data Connection & Visibility
*(Same as original - no changes needed)*

## Ticket 2.1: Display Vehicle Info in Rate Calculator Header
[Content unchanged from original]

## Ticket 2.2: Show Cost Per Mile in Quote Results
[Content unchanged from original]

## Ticket 2.3: Pre-fill Equipment from Onboarding
[Content unchanged from original]

---

# Epic 3: Content & Copy Fixes
*(Same as original - no changes needed)*

## Ticket 3.1: Fix Duplicate "Fixed Costs" Label
[Content unchanged from original]

## Ticket 3.2: Replace "vehicle.details" Placeholder
[Content unchanged from original]

## Ticket 3.3: Standardize Button Labels
[Content unchanged from original]

## Ticket 3.4: Unify User Type Terminology
[Content unchanged from original]

---

# Epic 4: Form Improvements & Validation
*(Same as original - no changes needed)*

## Ticket 4.1: Add Format Guidance to Location Inputs
[Content unchanged from original]

## Ticket 4.2: Add Tooltips to User Type Selection
[Content unchanged from original]

## Ticket 4.3: Clarify VIN Field Helper Text
[Content unchanged from original]

## Ticket 4.4: Add Cost Impact Labels to Urgency Options
[Content unchanged from original]

---

# Epic 5: Visual Feedback & Polish
*(Same as original - no changes needed)*

## Ticket 5.1: Clarify Step 4 Button Labels
[Content unchanged from original]

## Ticket 5.2: Highlight Current Stage in Rate Calculator
[Content unchanged from original]

## Ticket 5.3: Add Completion Checkmarks to Onboarding Steps
[Content unchanged from original]

## Ticket 5.4: Add Confirmation to Monthly/Annually Toggle
[Content unchanged from original]

---

# Epic 6: Reduce Cognitive Load
*(Same as original - no changes needed)*

## Ticket 6.1: Add Progressive Disclosure to Quote Results
[Content unchanged from original]

## Ticket 6.2: Add "Recommended" Badge to Best Rate Option
[Content unchanged from original]

## Ticket 6.3: Add Review Summary Before Calculate
[Content unchanged from original]

## Ticket 6.4: Move Premium Upsell Below First Calculation
**Labels:** `priority: medium`, `type: engagement`, `epic: cognitive-load`
[Content unchanged from original]

---

# Epic 7: Engagement Features (REVISED - BUILD, NOT REMOVE)

> **Goal:** Implement user engagement features properly per Quote PDF Month 2.5 requirements

## Ticket 7.1: Implement Basic Achievement System

**Title:** `Build functional achievement system for user engagement`

**Labels:** `priority: high`, `type: feature`, `type: engagement`, `epic: engagement-features`, `feature: achievements`

**Description:**
Per Quote PDF Month 2.5, the MVP includes user engagement features. The current achievement system shows 10 placeholder "New Trucker" badges. Implement a basic but functional achievement system that rewards user actions.

**Quote PDF Requirement:**
- "User Engagement: Active dashboard usage with saved quote functionality and referral system adoption"
- "User retention features" as core to MVP

**Current State:**
- 10 identical placeholder badges
- No unlock logic
- Appears broken

**Desired State:**
- 5-10 real achievements based on user actions
- Achievements unlock as users complete milestones
- Visual distinction between locked/unlocked
- Integrates with level progression system

**Acceptance Criteria:**
- [ ] Achievement data structure created (id, title, description, icon, unlockCondition)
- [ ] At least 5 functional achievements implemented:
  - **Profile Created** - Complete Step 2
  - **Vehicle Added** - Complete Step 4
  - **First Quote** - Calculate first rate
  - **Cost Conscious** - Complete cost calculator in Step 3
  - **Power User** - Calculate 5 quotes
  - **Referral Pioneer** - Generate referral link (Ticket 7.2)
- [ ] Locked vs unlocked visual states
- [ ] Achievement unlock notifications (toast/modal)
- [ ] Achievement progress saved to user profile
- [ ] Works with or without authentication (localStorage fallback)

**Files to Change:**
- `components/Step5/Achievements.jsx` (refactor with unlock logic)
- `components/Step5/Step5.jsx` (pass achievement data)
- `context/AppContext.js` (track user actions for unlock triggers)
- `components/ui/AchievementCard.jsx` (NEW - locked/unlocked states)
- `utils/achievements.js` (NEW - achievement definitions and unlock logic)

**Implementation Notes:**
```javascript
// utils/achievements.js
export const ACHIEVEMENTS = [
  {
    id: 'profile_created',
    title: 'Getting Started',
    description: 'Complete your profile setup',
    icon: 'IoPersonOutline',
    unlockCondition: (userData) => userData.profileComplete,
    points: 10
  },
  {
    id: 'first_vehicle',
    title: 'Fleet Builder',
    description: 'Add your first vehicle',
    icon: 'BsTruck',
    unlockCondition: (userData) => userData.vehicles.length > 0,
    points: 15
  },
  {
    id: 'first_quote',
    title: 'Rate Calculator',
    description: 'Calculate your first freight rate',
    icon: 'IoCalculatorOutline',
    unlockCondition: (userData) => userData.quotesCalculated > 0,
    points: 20
  },
  {
    id: 'cost_calculator',
    title: 'Cost Conscious',
    description: 'Set up your cost per mile',
    icon: 'IoCashOutline',
    unlockCondition: (userData) => userData.costPerMileSet,
    points: 15
  },
  {
    id: 'power_user',
    title: 'Power User',
    description: 'Calculate 5 freight rates',
    icon: 'IoRocketOutline',
    unlockCondition: (userData) => userData.quotesCalculated >= 5,
    points: 30
  }
];

// Check and unlock achievements
export function checkAchievements(userData, previousData) {
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach(achievement => {
    const wasUnlocked = previousData.unlockedAchievements?.includes(achievement.id);
    const isNowUnlocked = achievement.unlockCondition(userData);

    if (!wasUnlocked && isNowUnlocked) {
      newlyUnlocked.push(achievement);
    }
  });

  return newlyUnlocked;
}
```

```jsx
// components/ui/AchievementCard.jsx
export default function AchievementCard({ achievement, unlocked }) {
  return (
    <div className={`p-3 rounded-lg border-2 transition-all ${
      unlocked
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
        : 'bg-gray-100 border-gray-300 opacity-60'
    }`}>
      <div className={`text-3xl mb-2 ${unlocked ? 'text-blue-600' : 'text-gray-400'}`}>
        {achievement.icon}
      </div>
      <p className={`text-sm font-semibold ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
        {achievement.title}
      </p>
      {unlocked && (
        <div className="mt-1 flex items-center gap-1">
          <IoCheckmarkCircle className="text-green-500 text-xs" />
          <span className="text-xs text-green-600">+{achievement.points} XP</span>
        </div>
      )}
    </div>
  );
}
```

**Estimated Time:** 4-6 hours

**Dependencies:**
- Context tracking user actions (may need to add tracking)
- Level system (Ticket 7.2)

**Testing Steps:**
1. Start fresh user session
2. Verify all achievements show as locked
3. Complete Step 2 - verify "Getting Started" unlocks
4. Complete Step 4 - verify "Fleet Builder" unlocks
5. Calculate first rate - verify "Rate Calculator" unlocks
6. Verify notification shows when achievement unlocks
7. Refresh page - verify achievements persist

---

## Ticket 7.2: Implement Level Progression System

**Title:** `Build functional level progression tied to user actions`

**Labels:** `priority: high`, `type: feature`, `type: engagement`, `epic: engagement-features`

**Description:**
Per Quote PDF emphasis on "user retention features", implement level progression that increases as users complete actions and earn experience points (XP).

**Current State:**
- Shows "Level 1" with 0% progress
- Never increases
- Feels broken

**Desired State:**
- Level increases based on XP from achievements and actions
- Progress bar shows % to next level
- Each level requires more XP (scaling)
- Visual celebration when leveling up

**Acceptance Criteria:**
- [ ] XP system implemented (achievements + actions grant XP)
- [ ] Level calculation logic: Level 1 (0-100 XP), Level 2 (100-250 XP), Level 3 (250-500 XP), etc.
- [ ] Progress bar shows accurate % to next level
- [ ] Level-up animation/notification
- [ ] Current level and XP displayed
- [ ] XP persists across sessions
- [ ] Works without backend (localStorage for now)

**Files to Change:**
- `components/Step5/Step5.jsx` (show accurate level/progress)
- `utils/levelSystem.js` (NEW - level calculation logic)
- `context/AppContext.js` (track XP and level)
- `components/ui/LevelUpModal.jsx` (NEW - celebration when leveling up)

**Implementation Notes:**
```javascript
// utils/levelSystem.js
export function calculateLevel(totalXP) {
  const levels = [
    { level: 1, minXP: 0, maxXP: 100 },
    { level: 2, minXP: 100, maxXP: 250 },
    { level: 3, minXP: 250, maxXP: 500 },
    { level: 4, minXP: 500, maxXP: 850 },
    { level: 5, minXP: 850, maxXP: 1300 },
    // Formula: next level requires +150 XP more than previous increment
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].minXP) {
      const currentLevel = levels[i];
      const progress = ((totalXP - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100;
      return { level: currentLevel.level, progress: Math.min(progress, 100), totalXP };
    }
  }

  return { level: 1, progress: 0, totalXP: 0 };
}

export function getXPForAction(action) {
  const xpValues = {
    'profile_complete': 10,
    'vehicle_added': 15,
    'quote_calculated': 20,
    'cost_setup': 15,
    'quote_saved': 10,
    'referral_sent': 25,
    'referral_signup': 50
  };
  return xpValues[action] || 0;
}
```

**Estimated Time:** 3-4 hours

**Dependencies:**
- Ticket 7.1 (achievements grant XP)
- Context tracking user actions

**Testing Steps:**
1. Start with 0 XP - verify Level 1, 0% progress
2. Complete profile - gain 10 XP - verify progress bar moves to 10%
3. Add vehicle - gain 15 XP (total 25 XP) - verify 25% progress
4. Calculate quote - gain 20 XP (total 45 XP) - verify 45% progress
5. Complete actions to reach 100 XP - verify level-up notification
6. Verify progress bar resets and shows progress toward Level 3

---

## Ticket 7.3: Implement Referral Rewards System Foundation

**Title:** `Build referral code generation and tracking system`

**Labels:** `priority: high`, `type: feature`, `type: engagement`, `epic: engagement-features`, `feature: referral-system`

**Description:**
Per Quote PDF Month 2.5 HIGH priority: "Referral Rewards System - Complete referral tracking system with unique referral codes, reward point calculation, redemption interface, automated reward distribution, and fraud prevention with comprehensive analytics dashboard."

This ticket implements the **frontend foundation** - referral code generation, sharing UI, and tracking preparation. Backend integration will come later.

**Quote PDF Requirement:**
- Unique referral codes
- Reward point calculation
- Redemption interface
- Fraud prevention
- Analytics dashboard

**Current State:**
- No referral system exists

**Desired State:**
- Each user gets unique referral code
- Share referral link UI
- Track pending referrals (frontend)
- Show referral stats in dashboard
- Reward points accumulate when referrals sign up

**Acceptance Criteria:**
- [ ] Unique referral code generated for each user (format: NAME-XXXX)
- [ ] "Share & Earn" section in Step 5 dashboard
- [ ] Copy-to-clipboard functionality for referral link
- [ ] Social share buttons (Email, Twitter, LinkedIn)
- [ ] Referral stats display: "0 Referrals | 0 Points Earned"
- [ ] "How it works" explanation
- [ ] Placeholder for redemption UI ("Coming soon: Redeem for premium features")
- [ ] LocalStorage tracking (prepare for backend)

**Files to Change:**
- `components/Step5/Step5.jsx` (add referral section)
- `components/Step5/ReferralSection.jsx` (NEW - referral UI)
- `utils/referralSystem.js` (NEW - code generation, validation)
- `context/AppContext.js` (store referral code and stats)

**Implementation Notes:**
```javascript
// utils/referralSystem.js
export function generateReferralCode(userName) {
  // Generate format: FIRSTNAME-XXXX (e.g., JOHN-A7F2)
  const namePart = userName.split(' ')[0].toUpperCase().slice(0, 8);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePart}-${randomPart}`;
}

export function getReferralLink(referralCode) {
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseURL}?ref=${referralCode}`;
}

export function trackReferralSignup(referralCode) {
  // Check localStorage for referred-by code
  // When user signs up, credit the referrer
  // This will be moved to backend later
  const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
  referrals.push({
    code: referralCode,
    date: new Date().toISOString(),
    status: 'pending' // 'pending', 'confirmed', 'rewarded'
  });
  localStorage.setItem('referrals', JSON.stringify(referrals));
}
```

```jsx
// components/Step5/ReferralSection.jsx
export default function ReferralSection({ referralCode, referralStats }) {
  const [copied, setCopied] = useState(false);
  const referralLink = getReferralLink(referralCode);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-4">
      <div className="flex items-center gap-3 mb-4">
        <IoGiftOutline size={24} className="text-purple-600" />
        <h3 className="text-lg font-bold text-neutral-900">Share & Earn Rewards</h3>
      </div>

      <p className="text-sm text-neutral-600 mb-4">
        Invite other truckers to join and earn points toward premium features!
      </p>

      <div className="bg-purple-50 rounded-lg p-4 mb-4">
        <p className="text-xs text-purple-800 font-semibold mb-2">YOUR REFERRAL CODE</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-2 bg-white border border-purple-300 rounded text-sm"
          />
          <Button
            onClick={copyToClipboard}
            variant={copied ? "primary" : "secondary"}
            size="sm"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline" icon={<IoMailOutline />}>
          Email
        </Button>
        <Button size="sm" variant="outline" icon={<IoLogoTwitter />}>
          Twitter
        </Button>
        <Button size="sm" variant="outline" icon={<IoLogoLinkedin />}>
          LinkedIn
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded">
        <div>
          <p className="text-xs text-neutral-600">Referrals</p>
          <p className="text-2xl font-bold text-neutral-900">{referralStats.count}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-600">Points Earned</p>
          <p className="text-2xl font-bold text-purple-600">{referralStats.points}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-neutral-500">
        <p className="font-semibold mb-1">How it works:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Share your referral link with colleagues</li>
          <li>They sign up and calculate their first rate</li>
          <li>You both earn 50 points</li>
          <li>Redeem points for premium features (coming soon!)</li>
        </ul>
      </div>
    </Card>
  );
}
```

**Estimated Time:** 4-5 hours

**Dependencies:**
- User name from Step 2 (profile)
- Context for storing referral data

**Testing Steps:**
1. Complete profile with name "John Smith"
2. Navigate to Step 5
3. Verify referral section appears with code like "JOHN-A7F2"
4. Click "Copy" button - verify link copied to clipboard
5. Verify stats show "0 Referrals | 0 Points Earned"
6. Open new incognito window, visit referral link
7. Verify `?ref=JOHN-A7F2` in URL
8. (Future: Complete signup to test referral tracking)

---

## Ticket 7.4: Implement "Searches Used" Counter

**Title:** `Build functional search usage tracking and limits`

**Labels:** `priority: medium`, `type: feature`, `epic: engagement-features`

**Description:**
"Searches Used: 0/5" counter is displayed but never increments. Implement tracking that counts rate calculations and shows limit warnings.

**Current State:**
- Always shows "0/5"
- No tracking

**Desired State:**
- Increments with each rate calculation
- Shows warning at 4/5: "1 search remaining"
- At 5/5: Prompts for sign-in or upgrade
- Resets daily or with account

**Acceptance Criteria:**
- [ ] Counter increments with each "Calculate Rate" action
- [ ] Persists across page refreshes (localStorage)
- [ ] Warning notification at 4/5 searches
- [ ] At 5/5: Modal with upgrade/sign-in options
- [ ] Admin option to bypass limit (for testing)
- [ ] Resets daily at midnight

**Files to Change:**
- `components/RateCalc/Ratecalc.jsx` (increment counter, check limits)
- `utils/searchLimits.js` (NEW - tracking and reset logic)
- `components/ui/SearchLimitModal.jsx` (NEW - 5/5 modal)

**Implementation Notes:**
```javascript
// utils/searchLimits.js
const DAILY_LIMIT = 5;

export function incrementSearchCount() {
  const data = getSearchData();
  if (data.count >= DAILY_LIMIT) {
    return { allowed: false, count: data.count, limit: DAILY_LIMIT };
  }

  data.count += 1;
  data.lastSearch = new Date().toISOString();
  localStorage.setItem('searchData', JSON.stringify(data));

  return { allowed: true, count: data.count, limit: DAILY_LIMIT };
}

export function getSearchData() {
  const stored = localStorage.getItem('searchData');
  if (!stored) {
    return { count: 0, resetDate: getTodayMidnight() };
  }

  const data = JSON.parse(stored);

  // Reset if past midnight
  if (new Date() > new Date(data.resetDate)) {
    return { count: 0, resetDate: getTodayMidnight() };
  }

  return data;
}

function getTodayMidnight() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}
```

**Estimated Time:** 2-3 hours

**Dependencies:** None

**Testing Steps:**
1. Start fresh session - verify shows "0/5"
2. Calculate rate - verify increments to "1/5"
3. Calculate 3 more rates - verify shows "4/5"
4. Verify warning notification appears
5. Calculate 5th rate - verify shows "5/5"
6. Try to calculate 6th - verify modal blocks action
7. Set system time to tomorrow - verify resets to "0/5"

---

## Ticket 7.5: Build Saved Quotes Dashboard Section

**Title:** `Implement saved quotes history and management`

**Labels:** `priority: high`, `type: feature`, `epic: engagement-features`, `feature: saved-quotes`

**Description:**
Per Quote PDF Month 2.5: "Rate History & Quote Management - Complete saved quotes system with advanced search, filtering, organization capabilities, quote comparison tools, and bulk operations."

Implement basic saved quotes functionality with list view, search, and delete options.

**Quote PDF Requirement:**
- Saved quotes system
- Advanced search and filtering
- Quote comparison tools
- Bulk operations

**Current State:**
- No saved quotes functionality

**Desired State:**
- "My Saved Quotes" section in Step 5 dashboard
- List of previously calculated rates
- Basic search/filter (by origin, destination, date)
- Quick view quote details
- Delete quote option
- "Load" button to recalculate with same inputs

**Acceptance Criteria:**
- [ ] "My Saved Quotes" section in Step 5 dashboard
- [ ] Quotes auto-save to localStorage after calculation
- [ ] List view showing: Date, Route (Origin → Destination), Rate, Quick Actions
- [ ] Search box filters by origin or destination
- [ ] "Load" button pre-fills Rate Calculator with saved data
- [ ] "Delete" button removes saved quote
- [ ] Empty state: "No saved quotes yet. Calculate your first rate!"
- [ ] Shows last 10 quotes (pagination for future)

**Files to Change:**
- `components/Step5/Step5.jsx` (add saved quotes section)
- `components/Step5/SavedQuotesSection.jsx` (NEW - quotes list UI)
- `components/quote/quote.jsx` (auto-save on calculation)
- `utils/quoteStorage.js` (NEW - save/load/delete logic)

**Implementation Notes:**
```javascript
// utils/quoteStorage.js
export function saveQuote(quoteData) {
  const quotes = getSavedQuotes();
  const quote = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    origin: quoteData.origin,
    destination: quoteData.destination,
    rate: quoteData.recommendedRate.total,
    ratePerMile: quoteData.recommendedRate.perMile,
    miles: quoteData.recommendedRate.miles,
    fullData: quoteData // Store complete calculation
  };

  quotes.unshift(quote); // Add to beginning
  localStorage.setItem('savedQuotes', JSON.stringify(quotes.slice(0, 50))); // Keep last 50
  return quote;
}

export function getSavedQuotes() {
  const stored = localStorage.getItem('savedQuotes');
  return stored ? JSON.parse(stored) : [];
}

export function deleteQuote(quoteId) {
  const quotes = getSavedQuotes();
  const filtered = quotes.filter(q => q.id !== quoteId);
  localStorage.setItem('savedQuotes', JSON.stringify(filtered));
}

export function searchQuotes(searchTerm) {
  const quotes = getSavedQuotes();
  return quotes.filter(q =>
    q.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
```

```jsx
// components/Step5/SavedQuotesSection.jsx
export default function SavedQuotesSection() {
  const [quotes, setQuotes] = useState(getSavedQuotes());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotes = searchTerm
    ? searchQuotes(searchTerm)
    : quotes;

  const handleDelete = (quoteId) => {
    deleteQuote(quoteId);
    setQuotes(getSavedQuotes());
  };

  const handleLoad = (quote) => {
    // Navigate to Rate Calculator with pre-filled data
    // Implementation depends on navigation structure
  };

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-neutral-900">My Saved Quotes</h3>
        <span className="text-sm text-neutral-600">{quotes.length} total</span>
      </div>

      {quotes.length > 0 && (
        <Input
          type="text"
          placeholder="Search by origin or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<IoSearchOutline />}
          className="mb-4"
        />
      )}

      {filteredQuotes.length === 0 ? (
        <div className="text-center py-8">
          <IoDocumentTextOutline size={48} className="text-gray-300 mx-auto mb-2" />
          <p className="text-neutral-600">
            {searchTerm ? 'No quotes found' : 'No saved quotes yet'}
          </p>
          <p className="text-sm text-neutral-500">
            Calculate your first rate to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map(quote => (
            <div key={quote.id} className="border rounded-lg p-3 hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <IoLocationOutline className="text-blue-600" />
                    <span className="font-semibold">{quote.origin} → {quote.destination}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span>{quote.miles} miles</span>
                    <span>${quote.ratePerMile}/mile</span>
                    <span className="text-green-600 font-semibold">${quote.rate}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(quote.date).toLocaleDateString()} at {new Date(quote.date).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleLoad(quote)}>
                    Load
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(quote.id)}>
                    <IoTrashOutline />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
```

**Estimated Time:** 4-5 hours

**Dependencies:**
- Quote calculation must be working
- Navigation to pre-fill calculator (Ticket 8.1)

**Testing Steps:**
1. Calculate a rate: Chicago → Denver
2. Navigate to Step 5
3. Verify quote appears in "My Saved Quotes"
4. Calculate another rate: LA → NYC
5. Verify both quotes listed
6. Search for "Chicago" - verify filters correctly
7. Click "Load" - verify navigates to calculator with data
8. Click "Delete" - verify quote removed
9. Refresh page - verify quotes persist

---

## Ticket 7.6: Add User Statistics Dashboard

**Title:** `Build user statistics and analytics display`

**Labels:** `priority: medium`, `type: feature`, `epic: engagement-features`, `feature: dashboard`

**Description:**
Per Quote PDF Month 2.5: "User Dashboard & Analytics Foundation - Central dashboard displaying recent quotes, saved rates, user statistics, quick access functions, and basic analytics with responsive design and data visualization components."

Add statistics section showing user activity metrics.

**Quote PDF Requirement:**
- User statistics
- Basic analytics
- Data visualization

**Current State:**
- No statistics displayed

**Desired State:**
- Stats card showing:
  - Total quotes calculated
  - Total miles quoted
  - Average rate per mile
  - Most common routes
  - Account age / days active
- Visual charts (simple bar/line charts)
- "This Week" vs "All Time" toggle

**Acceptance Criteria:**
- [ ] Statistics card in Step 5 dashboard
- [ ] Shows key metrics: Quotes, Miles, Avg Rate, Top Route
- [ ] Data calculated from saved quotes
- [ ] "This Week" vs "All Time" filter
- [ ] Simple bar chart for quotes over time (last 7 days)
- [ ] Responsive design (stacks on mobile)

**Files to Change:**
- `components/Step5/Step5.jsx` (add stats section)
- `components/Step5/UserStatsSection.jsx` (NEW - stats display)
- `utils/analyticsCalculations.js` (NEW - calculate stats from quotes)
- `components/ui/SimpleChart.jsx` (NEW - basic bar chart component)

**Implementation Notes:**
```javascript
// utils/analyticsCalculations.js
export function calculateUserStats(quotes, timeframe = 'all') {
  const filtered = timeframe === 'week'
    ? quotes.filter(q => isWithinLastWeek(q.date))
    : quotes;

  const totalQuotes = filtered.length;
  const totalMiles = filtered.reduce((sum, q) => sum + q.miles, 0);
  const totalRate = filtered.reduce((sum, q) => sum + q.rate, 0);
  const avgRatePerMile = totalMiles > 0 ? totalRate / totalMiles : 0;

  // Find most common route
  const routes = {};
  filtered.forEach(q => {
    const route = `${q.origin} → ${q.destination}`;
    routes[route] = (routes[route] || 0) + 1;
  });
  const topRoute = Object.entries(routes).sort((a, b) => b[1] - a[1])[0];

  return {
    totalQuotes,
    totalMiles: Math.round(totalMiles),
    avgRatePerMile: avgRatePerMile.toFixed(2),
    topRoute: topRoute ? topRoute[0] : 'N/A',
    topRouteCount: topRoute ? topRoute[1] : 0
  };
}

function isWithinLastWeek(dateString) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return new Date(dateString) > weekAgo;
}

export function getQuotesByDay(quotes, days = 7) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const count = quotes.filter(q => {
      const quoteDate = new Date(q.date).toDateString();
      return quoteDate === date.toDateString();
    }).length;

    data.push({ date: dateStr, count });
  }
  return data;
}
```

**Estimated Time:** 3-4 hours

**Dependencies:**
- Ticket 7.5 (saved quotes)

**Testing Steps:**
1. Calculate 5 quotes over several days
2. Navigate to Step 5
3. Verify stats show:
   - "5 Quotes Calculated"
   - Total miles summed correctly
   - Average rate per mile calculated
   - Most common route identified
4. Toggle "This Week" - verify stats recalculate
5. Verify bar chart shows quotes per day

---

## Ticket 7.7: Make Gamification Optional

**Title:** `Add user preference to show/hide achievements and levels`

**Labels:** `priority: low`, `type: feature`, `epic: engagement-features`

**Description:**
Per UX Audit concern about gamification feeling unprofessional for some users, add preference to hide achievements/levels while keeping them available for users who want engagement features.

**Current State:**
- Achievements and levels always visible
- May feel unprofessional to some users

**Desired State:**
- Settings option: "Show achievement badges and levels"
- Default: ON (show gamification)
- When OFF: Hide achievements and level progression, keep stats
- Preference persists

**Acceptance Criteria:**
- [ ] Settings/preferences section added to Step 5 or navbar
- [ ] Toggle: "Show achievement badges and levels" (default: ON)
- [ ] When OFF: Achievements section hidden, level progress hidden
- [ ] Statistics and saved quotes still visible (not gamification)
- [ ] Preference saved to localStorage
- [ ] User can toggle back ON anytime

**Files to Change:**
- `components/Step5/Step5.jsx` (conditional rendering based on preference)
- `components/Navbar/Navbar.jsx` OR `components/Step5/SettingsSection.jsx` (NEW - preferences)
- `context/AppContext.js` (store user preferences)

**Implementation Notes:**
```jsx
// In Step5.jsx
const { userPreferences } = useAppContext();
const showGamification = userPreferences.showGamification !== false; // default true

{showGamification && (
  <>
    <Card>{/* Level progression */}</Card>
    <Card>{/* Achievements */}</Card>
  </>
)}

// Always show (not gamification):
<UserStatsSection /> {/* Statistics */}
<SavedQuotesSection /> {/* Saved quotes */}
<ReferralSection /> {/* Referrals are functional, not just gamification */}
```

**Estimated Time:** 1-2 hours

**Dependencies:**
- Tickets 7.1, 7.2 (achievements and levels)

**Testing Steps:**
1. Navigate to Step 5
2. Verify achievements and levels visible by default
3. Open settings, toggle "Show achievements" OFF
4. Verify achievements and level sections hidden
5. Verify stats and saved quotes still visible
6. Toggle back ON - verify achievements reappear
7. Refresh page - verify preference persists

---

## Ticket 7.8: Remove Non-Functional "Use Location" Button

**Title:** `Remove broken "Use Location" button from Rate Calculator`

**Labels:** `priority: high`, `type: cleanup`, `epic: engagement-features`

**Description:**
"Use Location" button in Rate Calculator Location stage doesn't work and causes user confusion. Remove until geolocation and distance calculation features are implemented properly (see Ticket 9.3 for future implementation).

**Current Behavior:**
- Button present next to Deadhead Miles input
- Clicking does nothing
- User expects distance calculation
- Creates false expectations

**Desired Behavior:**
Button removed until Google Maps Distance Matrix API is integrated.

**Acceptance Criteria:**
- [ ] "Use Location" button removed from UI
- [ ] Deadhead Miles input remains functional (manual entry)
- [ ] No visual gap where button was
- [ ] Helper text updated to clarify manual entry expected

**Files to Change:**
- `components/RateCalc/Ratecalclocation.jsx` (lines 51-59)

**Implementation Notes:**
```jsx
// REMOVE this section:
<Button
  variant="secondary"
  size="sm"
  icon={<TbLocation size={18} />}
  iconPosition="left"
  className="whitespace-nowrap"
>
  Use Location
</Button>

// KEEP only the input:
<Input
  type="number"
  placeholder="0"
  label="Deadhead Miles To Pickup"
  helperText="Enter miles from your current location to pickup point"
/>
```

**Estimated Time:** 15 minutes

**Dependencies:** None

**Testing Steps:**
1. Navigate to Rate Calculator Location stage
2. Verify "Use Location" button removed
3. Verify Deadhead Miles input still works for manual entry
4. Verify no layout issues or gaps

**Related Tickets:**
- See Ticket 9.3 for future implementation of this feature

---

# Additional Tickets (Quick Wins)

## Ticket 8.1: Add "Edit" Link from Quote to Calculator

**Title:** `Add "Edit Calculation" button to quote results`

**Labels:** `priority: high`, `type: navigation`

**Description:**
User sees quote but realizes they need to change a value. No way to edit without starting over.

**Acceptance Criteria:**
- [ ] "Edit Calculation" button in quote header
- [ ] Returns to Rate Calculator Stage 1 with all fields pre-filled
- [ ] Data preserved when editing
- [ ] Changes reflected in new quote

**Estimated Time:** 2-3 hours

**Dependencies:**
- Rate Calculator must support pre-filling fields

**Files to Change:**
- `components/quote/quote.jsx` (add Edit button)
- `components/RateCalc/Ratecalc.jsx` (accept pre-fill data)
- `components/RateCalc/Ratecalclocation.jsx` (pre-fill fields)
- All stage components (accept initial data)

**Implementation Notes:**
```jsx
// In quote.jsx
<Button
  onClick={() => handleEditCalculation(calculationData)}
  variant="outline"
  icon={<IoPencilOutline />}
>
  Edit Calculation
</Button>

// handleEditCalculation function
const handleEditCalculation = (data) => {
  // Store data in context or pass to calculator
  // Navigate back to calculator
  // Calculator reads prefill data and populates fields
};
```

**Testing Steps:**
1. Calculate rate: Chicago → Denver, 35,000 lbs, Express
2. View quote
3. Click "Edit Calculation"
4. Verify returns to Location stage with Chicago and Denver filled in
5. Navigate through stages - verify all data pre-filled
6. Change Denver to "Los Angeles"
7. Recalculate - verify new quote reflects change

---

## Ticket 8.2: Make "New Calculation" More Prominent

**Title:** `Add second "New Calculation" button at top of quote`

**Labels:** `priority: medium`, `type: visual`

**Description:**
"New Calculation" button only at bottom of long quote page. User may not find it.

**Acceptance Criteria:**
- [ ] Button in quote header (near Share Quote)
- [ ] Consistent styling with bottom button
- [ ] Both buttons work identically
- [ ] Mobile: Top button accessible without scrolling

**Estimated Time:** 30 minutes

**Files to Change:**
- `components/quote/quote.jsx`

**Implementation Notes:**
```jsx
// In quote.jsx header section
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <FaCheckCircle className="text-green-500 text-3xl" />
    <h1 className="text-3xl font-bold">Rate Calculation Complete</h1>
  </div>
  <div className="flex gap-2">
    <Button
      onClick={handleNewCalculation}
      variant="secondary"
      icon={<IoCalculatorOutline />}
    >
      New Calculation
    </Button>
    <Button
      onClick={handleShareQuote}
      variant="outline"
      icon={<FaShareAlt />}
    >
      Share
    </Button>
  </div>
</div>
```

**Testing Steps:**
1. Calculate rate and view quote
2. Verify "New Calculation" button visible at top
3. Click top button - verify returns to fresh calculator
4. Calculate another rate
5. Scroll to bottom - verify bottom button still present
6. Both buttons should have same functionality

---

## Ticket 8.3: Add Hover States to Custom Components

**Title:** `Add hover and focus states to UserButton and Step2button`

**Labels:** `priority: low`, `type: visual`

**Description:**
Custom buttons don't show hover states clearly.

**Acceptance Criteria:**
- [ ] Hover state distinct from normal state
- [ ] Focus state for keyboard navigation
- [ ] Smooth transitions
- [ ] Selected state distinct from hover

**Estimated Time:** 1 hour

**Files to Change:**
- `components/Step1/UserButton.jsx`
- `components/Step2/Step2button.jsx`
- `components/Step4/Step4equipmenttype.jsx`

**Implementation Notes:**
```jsx
// Add to button components
className={`
  transition-all duration-200
  hover:shadow-md hover:scale-[1.02]
  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
`}
```

**Testing Steps:**
1. Navigate to Step 1
2. Hover over user type buttons - verify visual feedback
3. Tab through with keyboard - verify focus ring
4. Click to select - verify selected state distinct
5. Test on Step 2 role buttons
6. Test on Step 4 equipment checkboxes

---

# Epic 9: Future Enhancements (Post-MVP)

> **Goal:** Features to implement after MVP launch to enhance user experience

## Ticket 9.1: Implement API-based Rate Calculations

**Title:** `Replace mock rate calculations with real freight rate API`

**Labels:** `priority: future`, `type: feature`, `epic: future-enhancements`

**Description:**
Current rate calculations use mock/estimated data. Integrate with real freight rate APIs (e.g., DAT, Truckstop.com API) for accurate market-based rates.

**Estimated Time:** 12-16 hours

**Dependencies:**
- API key and contract with freight rate provider
- Backend server to secure API credentials

---

## Ticket 9.2: Implement User Authentication & Backend

**Title:** `Build user authentication and cloud data persistence`

**Labels:** `priority: future`, `type: feature`, `epic: future-enhancements`

**Description:**
Move from localStorage to proper backend with user accounts. Enable cross-device access and data security.

**Features:**
- User registration and login
- JWT-based authentication
- Cloud storage for quotes, vehicles, preferences
- Account management dashboard

**Estimated Time:** 20-30 hours

**Dependencies:**
- Backend infrastructure (Node.js/Express or similar)
- Database (PostgreSQL/MongoDB)
- Hosting/deployment

---

## Ticket 9.3: Implement Auto-Calculate Deadhead Miles

**Title:** `Build geolocation and distance calculation for deadhead miles`

**Labels:** `priority: future`, `type: feature`, `epic: future-enhancements`, `feature: deadhead-auto-calc`

**Description:**
Implement the functionality that was removed in Ticket 7.8. Allow users to automatically calculate deadhead miles from their current location to the pickup point using geolocation and distance APIs.

**Business Value:**
Deadhead miles are a critical cost factor for truckers. Automating this calculation:
- Saves time (no manual estimation)
- Increases accuracy (exact GPS distance)
- Improves quote precision (better profit margins)
- Enhances user experience (one-click convenience)

**Current State:**
- Button removed in Ticket 7.8 due to non-functionality
- Users manually enter deadhead miles estimate

**Desired State:**
- "Use My Location" button functional
- Requests user's geolocation permission
- Calculates driving distance to origin
- Auto-fills Deadhead Miles input
- Shows calculation breakdown: "45.2 miles from your location to Chicago, IL"

**Acceptance Criteria:**
- [ ] Browser Geolocation API integrated
- [ ] Permission request handled gracefully (user can deny)
- [ ] Google Maps Distance Matrix API integrated (or alternative)
- [ ] Calculates driving distance (not straight-line)
- [ ] Auto-fills Deadhead Miles input with result
- [ ] Shows calculation details to user
- [ ] Error handling: location denied, API failure, invalid origin
- [ ] Loading state while calculating
- [ ] Works on mobile devices
- [ ] Fallback to manual entry if geolocation unavailable

**Files to Change:**
- `components/RateCalc/Ratecalclocation.jsx` (re-add button with functionality)
- `utils/geolocation.js` (NEW - geolocation helpers)
- `utils/distanceCalculation.js` (NEW - Google Maps API integration)
- `lib/googleMapsClient.js` (NEW - API client wrapper)
- `.env.local` (add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

**Implementation Notes:**

```javascript
// utils/geolocation.js
export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// utils/distanceCalculation.js
export async function calculateDrivingDistance(origin, destination) {
  // origin: { lat, lng } or "Chicago, IL"
  // destination: "Chicago, IL" (pickup location)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${origin.lat},${origin.lng}&` +
    `destinations=${encodeURIComponent(destination)}&` +
    `units=imperial&` +
    `key=${apiKey}`
  );

  const data = await response.json();

  if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
    const distanceText = data.rows[0].elements[0].distance.text; // "45.2 mi"
    const distanceValue = data.rows[0].elements[0].distance.value; // meters
    const distanceMiles = Math.round(distanceValue * 0.000621371); // convert to miles

    return {
      miles: distanceMiles,
      text: distanceText,
      duration: data.rows[0].elements[0].duration.text
    };
  }

  throw new Error('Unable to calculate distance');
}
```

```jsx
// In Ratecalclocation.jsx
const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

const handleUseLocation = async () => {
  try {
    setIsCalculatingDistance(true);

    // Get user's current location
    const currentLocation = await getCurrentLocation();

    // Calculate distance to origin
    const distance = await calculateDrivingDistance(
      currentLocation,
      formData.origin
    );

    // Update deadhead miles input
    setFormData(prev => ({
      ...prev,
      deadheadMiles: distance.miles
    }));

    // Show success message
    toast.success(
      `${distance.miles} miles from your location to ${formData.origin}`,
      { duration: 5000 }
    );

  } catch (error) {
    if (error.code === 1) {
      // User denied location permission
      toast.error('Location permission denied. Please enter miles manually.');
    } else {
      toast.error('Unable to calculate distance. Please enter manually.');
    }
    console.error('Distance calculation error:', error);
  } finally {
    setIsCalculatingDistance(false);
  }
};

// UI Component
<div className="flex gap-2 items-end">
  <Input
    type="number"
    placeholder="0"
    label="Deadhead Miles To Pickup"
    helperText="Miles from your current location to pickup point"
    value={formData.deadheadMiles}
    onChange={(e) => setFormData(prev => ({
      ...prev,
      deadheadMiles: e.target.value
    }))}
    className="flex-1"
  />
  <Button
    variant="secondary"
    size="md"
    icon={isCalculatingDistance ? <Spinner /> : <TbLocation size={18} />}
    iconPosition="left"
    onClick={handleUseLocation}
    disabled={!formData.origin || isCalculatingDistance}
    className="whitespace-nowrap"
  >
    {isCalculatingDistance ? 'Calculating...' : 'Use Location'}
  </Button>
</div>

{formData.origin && (
  <p className="text-xs text-neutral-500 mt-1">
    Click "Use Location" to auto-calculate distance to {formData.origin}
  </p>
)}
```

**API Requirements:**
- **Google Maps Distance Matrix API**
  - Cost: $5 per 1,000 requests (first $200/month free)
  - Provides driving distance (not straight-line)
  - Includes duration estimates
  - Alternative: Mapbox Distance API, OpenRouteService

**Security Considerations:**
- API key must have domain restrictions (only your domain)
- Consider rate limiting to prevent abuse
- Monitor API usage to control costs
- Implement request caching (same route within 1 hour)

**Error Handling:**
1. **User denies location permission**
   - Show friendly message: "Please enable location or enter miles manually"
   - Input remains editable

2. **Invalid origin address**
   - Show error: "Please enter a valid origin address first"
   - Disable button until valid origin entered

3. **API failure/timeout**
   - Show error: "Distance calculation unavailable. Please enter manually"
   - Log error for debugging

4. **Distance calculation unreasonably long**
   - If >500 miles, show warning: "That's a long deadhead! Double-check your location and origin."

**Mobile Considerations:**
- Mobile devices typically have more accurate GPS
- Request permission on first use, remember preference
- Show loading spinner while getting location (can take 2-5 seconds)
- Test on iOS Safari and Android Chrome

**Cost Estimation:**
- 1,000 users × 10 calculations/month = 10,000 API calls
- Cost: ~$50/month (after free tier)
- Consider caching popular routes to reduce costs

**Estimated Time:** 6-8 hours

**Dependencies:**
- Google Maps API key (or alternative distance API)
- User permission for geolocation
- HTTPS (required for geolocation API)
- Budget for API costs

**Testing Steps:**
1. Navigate to Rate Calculator Location stage
2. Enter Origin: "Chicago, IL"
3. Click "Use Location" button
4. Grant location permission when prompted
5. Verify loading state shows
6. Verify Deadhead Miles auto-fills with calculated distance
7. Verify success message shows: "45 miles from your location to Chicago, IL"
8. Test error cases:
   - Deny location permission → Verify error message
   - No origin entered → Verify button disabled
   - Invalid origin → Verify error handling
9. Test on mobile device
10. Verify manual entry still works if user prefers

**Future Enhancements:**
- Save user's home base location for even faster calculations
- Show map visualization of deadhead route
- Suggest nearby alternative pickups with shorter deadhead
- Track deadhead miles in user statistics

---

## Ticket 9.4: Advanced Quote Comparison Tools

**Title:** `Build side-by-side quote comparison feature`

**Labels:** `priority: future`, `type: feature`, `epic: future-enhancements`

**Description:**
Per Quote PDF requirement: "Quote comparison tools." Allow users to compare multiple saved quotes side-by-side to make better business decisions.

**Estimated Time:** 4-6 hours

**Dependencies:**
- Ticket 7.5 (Saved Quotes)

---

## Ticket 9.5: Bulk Operations for Saved Quotes

**Title:** `Enable bulk actions on saved quotes (delete, export, compare)`

**Labels:** `priority: future`, `type: feature`, `epic: future-enhancements`

**Description:**
Per Quote PDF: "Bulk operations." Allow users to select multiple quotes and perform actions: delete multiple, export to CSV/PDF, compare selected.

**Estimated Time:** 3-4 hours

**Dependencies:**
- Ticket 7.5 (Saved Quotes)

---

## Ticket 9.6: Referral Analytics Dashboard

**Title:** `Build comprehensive referral analytics per Quote PDF`

**Labels:** `priority: future`, `type: feature`, `epic: future-enhancements`

**Description:**
Per Quote PDF: "Comprehensive analytics dashboard" for referrals. Track referral sources, conversion rates, top referrers, earnings over time.

**Estimated Time:** 6-8 hours

**Dependencies:**
- Ticket 7.3 (Referral system)
- Backend with analytics tracking

---

# Summary

## Total Tickets: 40 (REVISED + FUTURE)

### MVP Tickets: 35
- Epics 1-8: 35 tickets for initial launch

### Future Enhancement Tickets: 5
- Epic 9: 5 tickets for post-MVP development

### By Priority (MVP Only):
- **Critical:** 8 tickets (core functionality)
- **High:** 15 tickets (major UX and features) ← +1 for Ticket 7.8
- **Medium:** 9 tickets (quality of life)
- **Low:** 3 tickets (polish)
- **Future:** 5 tickets (post-MVP enhancements)

### By Epic (MVP):
- **Epic 1 (Navigation):** 4 tickets | ~8-10 hours
- **Epic 2 (Data Connection):** 3 tickets | ~5-7 hours
- **Epic 3 (Content Fixes):** 4 tickets | ~2.5 hours
- **Epic 4 (Form Improvements):** 4 tickets | ~3.5 hours
- **Epic 5 (Visual Feedback):** 4 tickets | ~4 hours
- **Epic 6 (Cognitive Load):** 4 tickets | ~7-10 hours
- **Epic 7 (Engagement Features):** 8 tickets | ~22.5-28.5 hours ← +1 cleanup ticket
- **Additional (Quick Wins):** 3 tickets | ~3.5 hours

### By Epic (Future Enhancements):
- **Epic 9 (Future Enhancements):** 5 tickets | ~51-68 hours
  - 9.1: API-based rates (12-16 hrs)
  - 9.2: User auth & backend (20-30 hrs)
  - 9.3: Auto-calculate deadhead (6-8 hrs)
  - 9.4: Quote comparison (4-6 hrs)
  - 9.5: Bulk operations (3-4 hrs)
  - 9.6: Referral analytics (6-8 hrs)

### Total Estimated Time:
- **MVP:** 55.5-68.5 hours (7-9 days)
- **Future Enhancements:** 51-68 hours (6-9 days)
- **Full Project:** 106.5-136.5 hours (13-17 days)

**NOTE:** Epic 7 significantly expanded because we're BUILDING these features properly per Quote PDF requirements, not removing them.

---

## Revised Implementation Sequence

### Week 1: Critical UX Fixes
**Goal:** Fix navigation and data visibility issues
- Epic 1: Navigation (4 tickets)
- Epic 2: Data Connection (3 tickets)
- Epic 3: Content Fixes (4 tickets)
**Total:** ~16-20 hours

### Weeks 2-3: Engagement Features
**Goal:** Implement Quote PDF Month 2.5 requirements
- Ticket 7.1: Achievements (4-6 hours)
- Ticket 7.2: Level system (3-4 hours)
- Ticket 7.3: Referral system foundation (4-5 hours)
- Ticket 7.4: Search counter (2-3 hours)
- Ticket 7.5: Saved quotes (4-5 hours)
- Ticket 7.6: User statistics (3-4 hours)
- Ticket 7.7: Gamification toggle (1-2 hours)
**Total:** ~22-28 hours

### Week 4: Forms & Polish
**Goal:** Improve forms and reduce cognitive load
- Epic 4: Form Improvements (4 tickets)
- Epic 5: Visual Feedback (4 tickets)
- Epic 6: Cognitive Load (4 tickets)
- Additional tickets (3 tickets)
**Total:** ~18-22 hours

---

## Key Changes from Original Plan

### ❌ Removed (from original):
- "Remove achievement system" → Now: **Build achievement system**
- "Remove level progression" → Now: **Build level progression**
- "Remove searches counter" → Now: **Build searches counter**
- "Remove broken features" → Now: **Implement features properly**

### ✅ Added (new tickets):
- Ticket 7.3: Referral system foundation (per Quote PDF)
- Ticket 7.5: Saved quotes dashboard (per Quote PDF)
- Ticket 7.6: User statistics (per Quote PDF)
- Ticket 7.7: Make gamification optional (UX concern addressed)
- Ticket 7.8: Remove "Use Location" button (cleanup, preserved from original)
- Epic 9: Future enhancements (5 tickets for post-MVP development)
  - Ticket 9.3: Proper implementation of auto-calculate deadhead miles

### 📈 Impact:
- **Timeline extended:** 5-6 days → 7-9 days
- **Scope increased:** Features built properly, not removed
- **Aligns with Quote PDF:** Month 2.5 requirements met
- **Better UX:** Features work as intended

---

## Success Metrics (Updated)

### Must Complete Before Launch:
- [ ] All Critical priority tickets (8 tickets)
- [ ] Navigation functional (Epic 1)
- [ ] Data connection visible (Epic 2)
- [ ] Content placeholders fixed (Epic 3)
- [ ] Basic achievement system working (Ticket 7.1)
- [ ] Saved quotes functional (Ticket 7.5)

### Phase 1 MVP Complete:
- [ ] All Critical + High tickets (22 tickets)
- [ ] Achievements and levels functional
- [ ] Referral system foundation
- [ ] Saved quotes with search
- [ ] User statistics dashboard
- [ ] Quote PDF Month 2.5 features implemented

### Full Polish:
- [ ] All 34 tickets complete
- [ ] User testing: 90%+ onboarding completion (per Quote PDF)
- [ ] User testing: Can calculate rate in <5 minutes
- [ ] User testing: Understand achievement system
- [ ] User testing: Successfully share referral link

---

**Next Steps:**
1. Review revised plan - confirm approach
2. Create GitHub labels (added `type: engagement` and `feature: *` labels)
3. Prioritize: Which epic to start first?
4. Migrate tickets to GitHub Issues
5. Begin implementation

The key insight: **Engagement features are core to the MVP per Quote PDF, not optional polish.** We build them right the first time.
