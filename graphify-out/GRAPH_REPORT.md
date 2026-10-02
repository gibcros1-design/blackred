# Graph Report - roblox  (2026-10-02)

## Corpus Check
- Corpus is ~34,082 words - fits in a single context window. You may not need a graph.

## Summary
- 308 nodes · 766 edges · 20 communities (12 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Storefront and Settings
- Admin Operations UI
- Application Routes
- Admin Auth and Security
- Database and Tooling
- Customer Checkout UI
- TypeScript Configuration
- Orders and Proof Upload
- Runtime Dependencies
- Security Documentation
- Build Dependencies
- Global Styling and Layout
- Product Requirements
- Homepage Screenshot
- Checkout Design Note
- Verification Workflow Note
- Project README

## God Nodes (most connected - your core abstractions)
1. `cn()` - 23 edges
2. `Button` - 21 edges
3. `lucide-react` - 20 edges
4. `buttonVariants()` - 19 edges
5. `formatRupiah()` - 19 edges
6. `next` - 18 edges
7. `react` - 16 edges
8. `compilerOptions` - 16 edges
9. `Card` - 14 edges
10. `Input` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AdminSettingsPage()` --calls--> `SettingsManager()`  [EXTRACTED]
  src/app/admin/settings/page.tsx → src/components/admin/SettingsManager.tsx
- `Admin Auth Guard Fix` --semantically_similar_to--> `Required JWT Secret Fix`  [INFERRED] [semantically similar]
  docs/fixes/add-admin-auth-guard.md → docs/fixes/require-jwt-secret.md
- `File Upload Hardening Fix` --semantically_similar_to--> `Unauthenticated Server Actions Vulnerability`  [INFERRED] [semantically similar]
  docs/fixes/harden-file-upload.md → docs/vulnerabilities/unauthenticated-server-actions.md
- `OrderDetailActions()` --calls--> `updateOrderStatusAction()`  [EXTRACTED]
  src/components/admin/OrderDetailActions.tsx → src/app/actions/admin-order.ts
- `AdminLoginForm()` --calls--> `loginAdminAction()`  [EXTRACTED]
  src/components/admin/AdminLoginForm.tsx → src/app/actions/auth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Checkout, payment verification, payout, and tracking lifecycle** — docs_superpowers_specs_2026_08_29_robux_topup_design_platform_design, docs_superpowers_specs_2026_08_29_robux_topup_design_manual_admin_verification, docs_superpowers_specs_2026_08_29_robux_topup_design_five_step_checkout, readme_platform [EXTRACTED 1.00]
- **Security findings, fixes, and audit verification** — docs_security_audit_security_audit, docs_vulnerabilities_unauthenticated_server_actions_server_action_auth, docs_fixes_add_admin_auth_guard_admin_auth_guard, docs_vulnerabilities_unrestricted_file_upload_unrestricted_upload, docs_fixes_harden_file_upload_file_upload_hardening, docs_vulnerabilities_jwt_secret_default_jwt_secret_default, docs_fixes_require_jwt_secret_jwt_secret_fix [EXTRACTED 1.00]
- **Storefront homepage visual elements** — _audit_home_v3_homepage_screenshot, readme_platform, docs_superpowers_plans_2026_09_30_robux_topup_implementation_dark_gaming_mobile_first [INFERRED 0.85]

## Communities (20 total, 8 thin omitted)

### Community 0 - "Storefront and Settings"
Cohesion: 0.09
Nodes (35): drizzle-orm, AdminSettingsPage(), dynamic, GET(), hits, rateLimited(), SAFE_FIELDS, BeliPage() (+27 more)

### Community 1 - "Admin Operations UI"
Cohesion: 0.13
Nodes (33): react, sonner, AdminLoginPage(), AdminOrderDetailPage(), AdminLoginForm(), actions, OrderDetailActions(), Props (+25 more)

### Community 2 - "Application Routes"
Cohesion: 0.12
Nodes (27): nextConfig, lucide-react, next, AdminLayout(), dynamic, Props, AdminDashboardPage(), dynamic (+19 more)

### Community 3 - "Admin Auth and Security"
Cohesion: 0.11
Nodes (21): bcryptjs, jose, updateOrderStatusAction(), attempts, loginAdminAction(), logoutAdminAction(), tooManyAttempts(), saveSettingsAction() (+13 more)

### Community 4 - "Database and Tooling"
Cohesion: 0.07
Nodes (26): name, private, scripts, build, db:push, db:seed, dev, start (+18 more)

### Community 5 - "Customer Checkout UI"
Cohesion: 0.15
Nodes (17): dynamic, HomePage(), Props, CheckoutWizardProps, Step1Props, Step3Props, faqs, FaqSection() (+9 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "Orders and Proof Upload"
Cohesion: 0.23
Nodes (11): uuid, createOrderAction(), submitPaymentProofAction(), EXT_BY_TYPE, looksLikeImage(), POST(), generateOrderCode(), generateOrderId() (+3 more)

### Community 8 - "Runtime Dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, better-sqlite3, clsx, dotenv, drizzle-orm, jose, lucide-react (+6 more)

### Community 9 - "Security Documentation"
Cohesion: 0.32
Nodes (13): Security Documentation Index, Admin Auth Guard Fix, Admin Session Guard, File Upload Hardening Fix, File Upload Content Validation, Required JWT Secret Fix, Required JWT Secret Configuration, Security Audit (+5 more)

### Community 10 - "Build Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, drizzle-kit, postcss, tailwindcss, @tailwindcss/postcss, tsx, @types/bcryptjs, @types/better-sqlite3 (+5 more)

### Community 11 - "Global Styling and Layout"
Cohesion: 0.33
Nodes (3): metadata, nunito, rubik

## Knowledge Gaps
- **122 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 134 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Application Routes` to `Storefront and Settings`, `Admin Auth and Security`, `Database and Tooling`, `Orders and Proof Upload`, `Global Styling and Layout`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Database and Tooling`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Application Routes` to `Storefront and Settings`, `Admin Operations UI`, `Database and Tooling`, `Customer Checkout UI`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Storefront and Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.09176470588235294 - nodes in this community are weakly interconnected._
- **Should `Admin Operations UI` be split into smaller, more focused modules?**
  _Cohesion score 0.1303030303030303 - nodes in this community are weakly interconnected._
- **Should `Application Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.11605937921727395 - nodes in this community are weakly interconnected._