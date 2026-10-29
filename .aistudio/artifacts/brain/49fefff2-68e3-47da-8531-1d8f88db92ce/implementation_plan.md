# Unified AppLayout & Performance Navigation System

A responsive, RTL-native enterprise layout architecture for the AFMIS Daily Operations and Performance Management System, uniting sidebar navigation, top header with user profile controls, and operational performance metrics.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed through Phase 1 clarification:
> - **Layout Strategy**: Unified enterprise layout wrapping all AFMIS authenticated routes (`/dashboard`, `/admin`, `/admin/criteria`) to provide persistent navigation across the system.
> - **Metrics Focus**: Domain-aligned AFMIS operational KPIs (daily reports completed, system operational uptime, KPI achievement index, and pending requests) replacing generic mock data.
> - **Sidebar Behavior**: Fluid responsive collapsible sidebar with an off-canvas mobile drawer and desktop collapse toggle.

- **Confirmed Decision 1**: Wrap all authenticated views (`UserDashboard`, `AdminDashboard`, `CriteriaSettings`) within `AppLayout` via React Router's `<Outlet />` pattern or shared layout container.
- **Confirmed Decision 2**: Provide persistent top header showing user profile identity (name, email, role badge), global search trigger, notification center, and quick logout modal.
- **Confirmed Decision 3**: Display top-level operational KPI summary cards in the dashboard overview area with tabular figures and clear status indicators.

---

### 1. Overview & Core Concept

- **What It Does**: Introduces `AppLayout.jsx` as the master frame for the AFMIS application. It features an RTL-native sidebar with intuitive icon-labeled links for all operational domains (لوحة التحكم, التقارير اليومية, العمليات التشغيلية, إدارة المشرفين, معايير التقييم), a sleek header with user profile context and quick-action tools, and a centralized performance summary strip.
- **Target Audience / Persona**: Ministry of Finance operations teams, system administrators, and KPI evaluators managing daily financial system logs and compliance indicators.
- **Key Value**: Replaces isolated, disparate page headers with a cohesive enterprise SaaS shell, reducing navigation friction between report writing, analytics, and administrative management.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Desktop Navigation**: Users navigate effortlessly between Daily Reports, Performance Analytics, and Admin Settings via the persistent RTL sidebar, which can be collapsed into an icon-rail to expand content workspace.
2. **Mobile Interaction**: On viewports under 1024px, a hamburger trigger smoothly slides out an accessible navigation drawer with backdrop blur, closing automatically upon route selection.
3. **User Profile & Status**: The top header prominently features the user's Ministry of Finance credentials (`mamonpfmp@gmail.com`, `مشرف النظام المالي (AFMIS)`), quick-access role indicators, and direct logout actions.
4. **Performance Metric Scannability**: High-density operational KPI summary cards appear on the dashboard overview, displaying report completion ratios, system availability (e.g. 99.8%), active operations, and evaluated members.

#### Visual Identity & Theme
- **Aesthetic Direction**: Dignified, modern governmental financial enterprise aesthetic. High contrast, clean hairline boundaries (`border-slate-200 dark:border-slate-800`), and zero-pill discipline for metadata.
- **Color Palette & Mood**:
  - Dominant Neutral (60%): Slate-50 background (`#F8FAFC`) with crisp pure white card surfaces (`#FFFFFF`).
  - Structural Borders & Text (30%): Deep slate typography (`#0F172A`), cool slate-600 subtext, and hairline borders (`border-slate-200/80`).
  - Accent Allocation (10%): Royal Emerald (`#059669` / `#10B981`) for AFMIS operational excellence, refined Indigo (`#4F46E5`) for system analytics, and Amber (`#D97706`) for pending reports.
- **Typography & Tabular Numerals**: Strict RTL typography using Arabic system sans with monospace tabular figures (`font-mono tabular-nums`) for all KPI metrics, percentages, and timestamps.
- **Micro-Interactions**: Smooth 150ms transitions for sidebar collapse, hover elevation on navigation items, and contextual breadcrumbs that update based on current route.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: React Router Nested Layout (`<Outlet />`) vs. Wrapper Component**:
  - *Chosen Approach*: Implement `AppLayout` as a router layout route that wraps child views through `<Outlet />` while allowing views to optionally supply header actions or custom titles.
  - *Why*: Eliminates code duplication across `UserDashboard`, `AdminDashboard`, and `CriteriaSettings`, while ensuring header state and sidebar collapse state persist across page transitions.
  - *Alternatives Considered*: Duplicating layout wrapper code inside every page component was rejected due to inconsistent state and unnecessary re-renders.

- **Decision 2: Domain-Grounded Metrics Integration**:
  - *Chosen Approach*: Connect layout KPI overview cards directly to active report statistics (total daily reports, average KPI score, pending actions, system stability) calculated from stored reports.
  - *Why*: Delivers immediate operational value rather than decorative, ungrounded placeholder numbers.
  - *Alternatives Considered*: Pure static dummy data was rejected in favor of live summary metrics derived from the AFMIS report store.

---

### 4. Technical Architecture & Data Strategy

#### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    AuthProvider                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                   AppLayout                     │  │  │
│  │  │  ┌──────────────┬────────────────────────────┐  │  │  │
│  │  │  │              │        Top Header          │  │  │  │
│  │  │  │              │ (Breadcrumbs, Search,      │  │  │  │
│  │  │  │              │  User Profile, Logout)     │  │  │  │
│  │  │  │   Sidebar    ├────────────────────────────┤  │  │  │
│  │  │  │  Navigation  │     Main Content Area      │  │  │  │
│  │  │  │  (Desktop +  │                            │  │  │  │
│  │  │  │   Mobile     │  ┌──────────────────────┐  │  │  │  │
│  │  │  │   Drawer)    │  │  <Outlet />          │  │  │  │  │
│  │  │  │              │  │  - UserDashboard     │  │  │  │  │
│  │  │  │              │  │  - AdminDashboard    │  │  │  │  │
│  │  │  │              │  │  - CriteriaSettings  │  │  │  │  │
│  │  │  │              │  └──────────────────────┘  │  │  │  │
│  │  │  └──────────────┴────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Component & Navigation State Mapping
1. **Sidebar Navigation**:
   - `sidebarOpen` (mobile drawer toggle) and `isCollapsed` (desktop mini-rail toggle).
   - Navigation links with active route detection (`useLocation`):
     - لوحة التحكم والمؤشرات (`/dashboard`)
     - التقارير اليومية (`/dashboard?tab=reports`)
     - مؤشرات الأداء والتقييم (`/dashboard?tab=analytics`)
     - سجل المعايير والأوزان (`/admin/criteria` - role guarded)
     - إدارة المستخدمين والمشرفين (`/admin` - role guarded)
2. **Top Header**:
   - Search bar with instant filter capability.
   - User profile dropdown with user name, email, AFMIS role badge, and session logout trigger.
   - Notification trigger for pending report approvals.
3. **Performance Metrics Strip**:
   - Operational cards displaying Total Reports, Average Performance Index, Evaluated Personnel, and System Reliability.
