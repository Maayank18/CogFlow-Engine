# CogFlow API Specification (v1)

All endpoints conform to standard JSON response envelopes under `/api/v1`.

```json
{
  "success": true,
  "data": { ... },
  "error": { "code": "...", "message": "...", "details": [...] }
}
```

---

## 1. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Creates a new learner account with Argon2/Bcrypt password hashing and sets an HttpOnly cookie while returning a Bearer JWT.
- **Request Body**:
  ```json
  {
    "name": "Grace Hopper",
    "email": "grace@comp.navy.mil",
    "password": "Password123!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "...", "email": "...", "name": "...", "role": "learner" },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/v1/auth/login`
Authenticates with email and password.

### `POST /api/v1/auth/logout`
Clears the `cogflow_token` authentication cookie.

### `GET /api/v1/auth/me`
Returns the authenticated learner's profile and active preferences.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Subjects & Topics (`/api/v1/subjects`)

### `GET /api/v1/subjects`
Lists available curriculum disciplines.
- **Query Parameters**:
  - `category`: Filter by category (e.g., `Computer Science`, `Mathematics`, `Physics`)
  - `search`: Case-insensitive text search.

### `GET /api/v1/subjects/:subjectId/topics`
Lists all topics belonging to the specified subject with estimated minutes and baseline difficulties.

### `GET /api/v1/subjects/topics/:topicId`
Returns detailed metadata for an individual topic.

---

## 3. Learning Sessions & Multi-Tier Lessons (`/api/v1/learning`)

### `POST /api/v1/learning/sessions`
Starts a new learning session or resumes the active session for a topic.
- **Request Body**:
  ```json
  {
    "topicId": "distributed-consensus-raft",
    "initialTier": "A",
    "initialMode": "learn"
  }
  ```

### `GET /api/v1/learning/topics/:topicId/lesson`
Retrieves or dynamically generates lesson content for the topic calibrated to the specified pedagogical tier.
- **Query Parameters**:
  - `tier`: `'B' | 'A' | 'S'` (Default: `'A'`)
  - `forceRefresh`: `boolean` (Default: `false`)

### `POST /api/v1/learning/topics/:topicId/adapt`
Switches pedagogical tier while preserving existing session identity and learner progress.
- **Request Body**:
  ```json
  {
    "targetTier": "B"
  }
  ```

---

## 4. Assessments & Semantic Grading (`/api/v1/assessments`)

### `GET /api/v1/assessments/topics/:topicId`
Returns multiple-choice and conceptual challenges for the topic calibrated to the specified tier.

### `POST /api/v1/assessments/topics/:topicId/submit`
Submits an assessment attempt for semantic rubric grading.
- **Request Body**:
  ```json
  {
    "tier": "A",
    "answers": [
      {
        "questionId": "q-1",
        "type": "mcq",
        "selectedOptionIndex": 1
      },
      {
        "questionId": "q-2",
        "type": "concept",
        "conceptualAnswerText": "Randomized timeouts break symmetry during concurrent split votes..."
      }
    ]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "score": 28,
      "maximumScore": 30,
      "percentage": 93,
      "passed": true,
      "strengths": ["Clear explanation of symmetry breaking in split-votes"],
      "missingConcepts": [],
      "misconceptions": [],
      "overallFeedback": "Congratulations! You demonstrated strong mastery at Tier A (93%)."
    }
  }
  ```

---

## 5. Cognitive Ingestion (`/api/v1/cognitive`)

### `POST /api/v1/cognitive/events`
Logs a normalized telemetry event for the active session.
- **Request Body**:
  ```json
  {
    "sessionId": "...",
    "state": "FLOW",
    "confidence": 0.92,
    "probabilities": { "flow": 0.92, "overload": 0.05, "boredom": 0.03 },
    "observedAt": "2026-11-03T01:30:00.000Z",
    "source": "mock"
  }
  ```

### `POST /api/v1/cognitive/adaptations`
Logs an accepted or dismissed tier adaptation event triggered by the 30-second invariant.

---

## 6. Document & Syllabus Ingestion (`/api/v1/documents`)

### `POST /api/v1/documents/upload`
Uploads a syllabus (PDF, TXT, or MD up to 25MB). Extracts candidate learning modules and maps them to source pages.
- **Content-Type**: `multipart/form-data`
- **Field**: `file`

---

## 7. Learning Analytics (`/api/v1/analytics`)

### `GET /api/v1/analytics/overview`
Returns time studied, sessions completed, topics mastered, average assessment score, cognitive distribution (seconds in Flow, Overload, Boredom), and recent adaptation events.
