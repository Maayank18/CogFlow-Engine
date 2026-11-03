# CogFlow Security Architecture & Privacy Boundaries

Security in CogFlow is engineered directly into every tier of the application rather than appended as an afterthought.

---

## 1. Authentication & Session Security
- **Password Hashing**: Passwords are cryptographically salted and hashed using Bcrypt with 12 salt rounds before database persistence. Raw passwords are never logged, cached, or transmitted across internal layers.
- **Session Tokens**: Authenticated sessions issue signed JSON Web Tokens (JWT) with strict expiration (`JWT_EXPIRES_IN=7d`).
- **Cookie Security**: Auth cookies use `HttpOnly`, `SameSite=Lax`, and `Secure` (in production), preventing client-side script inspection (XSS theft).
- **Protection Against Account Enumeration**: Authentication failure messages return generic messages (`"Invalid email or password"`) to prevent email enumeration.

---

## 2. API Hardening & Rate Limiting
- **Helmet Headers**: Configured to set critical HTTP security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and Cross-Origin Resource Policies.
- **CORS Allowlist**: Strictly binds origin to `CLIENT_ORIGIN` (default: `http://localhost:5173`).
- **Granular Rate Limiting**:
  - `authRateLimiter`: Limits authentication attempts to 30 requests per 15-minute window per IP to eliminate brute-force password cracking.
  - `apiRateLimiter`: Limits general API requests to 600 requests per 15-minute window.
- **Schema Validation (Zod)**: All incoming payloads are strictly validated before hitting route handlers. Invalid payloads are rejected with HTTP 400 and structured validation errors.

---

## 3. AI Orchestration & Prompt Injection Defenses
- **Zero API Key Leakage**: Cloud LLM API credentials (`GROQ_API_KEY`, `OPENROUTER_API_KEY`) reside exclusively in backend environment variables. The client application never accesses or receives these credentials.
- **Untrusted Document Context Sanitization**: When uploaded syllabus text is fed to LLM prompts, it is treated strictly as untrusted user data enclosed in delimiter quotes (`"""`). System policies prohibit document contents from overriding core pedagogical rules.
- **No Direct Server Code Execution**: Generated code snippets in Code Studio are presented for syntax walkthrough and review. CogFlow **never executes untrusted AI-generated code directly inside the application server**.

---

## 4. File Upload & Document Security
- **Strict File Type Filtering**: Only `.pdf`, `.txt`, and `.md` files with valid MIME types are accepted.
- **File Size Enforcements**: Uploads are capped at 25MB (`MAX_UPLOAD_SIZE_MB`).
- **Path Traversal Protection**: Uploaded files receive sanitized random server-side filenames (`${Date.now()}-${random}-${sanitizedName}`).
- **Isolated Storage**: Uploads reside in a dedicated directory outside public static web roots.

---

## 5. Biometric Privacy & Telemetry Guardrails
- **Zero Video Frame Uploads**: HTML5 webcam video frames exist only in local browser memory. No webcam frame, image buffer, or facial landmark coordinate is ever sent over the wire.
- **Explicit Consent**: Monitoring is completely optional. Camera permissions are never requested upon initial sign-up, and users can use CogFlow with the camera disabled.
- **Data Retention & TTL**: Normalized cognitive event logs automatically expire from MongoDB after 30 days via a TTL index.
