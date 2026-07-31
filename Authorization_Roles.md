# Authorization & Roles: CommuniAble AI

## 1. Role-Based Access Control (RBAC) Matrix

CommuniAble AI utilizes four primary roles: `learner`, `trainer`, `institution`, and `admin`.

| Feature / Endpoint | Learner | Trainer | Institution | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **`GET /profile`** | Own | Own | Own | All |
| **`PATCH /profile`** | Own | Own | Own | All |
| **`POST /assessment/*`** | Yes | No | No | No |
| **`GET /assessment/history`**| Own | Assigned Learners | Organization | All |
| **`GET /progress`** | Own | Assigned Learners | Aggregated | All |
| **`GET /trainer/*`** | No | Yes | No | Yes |
| **`GET /institution/*`** | No | No | Yes | Yes |

## 2. Database Row Level Security (RLS)
Supabase RLS is the core enforcement mechanism.
- **Learner Policy**: `auth.uid() = user_id` ensures learners only see their own assessments and reports.
- **Trainer Policy**: Trainers have a junction mapping to learners. Policy allows `SELECT` on `speech_assessments` where the `profile_id` is linked to the trainer's ID.
- **Institution Policy**: Organization-level access filtering based on `organization_id` matching the institution admin's `organization_id`.

## 3. API Route Protection (FastAPI)
Routes are protected using a custom dependency inject:
```python
@router.get("/trainer/students")
async def get_students(current_user: User = Depends(require_role(["trainer", "admin"]))):
    # Logic here
```
This ensures early rejection (403 Forbidden) before database interaction.
