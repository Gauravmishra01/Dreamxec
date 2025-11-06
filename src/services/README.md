# Services Directory

This directory contains all the API integration services for connecting the frontend with the backend.

## Files Overview

### 📁 Core Files

#### `api.ts`
- **Purpose**: Core API configuration and request handler
- **Key Functions**:
  - `apiRequest<T>()` - Makes authenticated API calls
  - `getToken()` - Retrieves JWT token from localStorage
  - `setToken()` - Stores JWT token in localStorage
  - `removeToken()` - Clears JWT token from localStorage
- **Features**:
  - Automatic token attachment to requests
  - Error handling
  - TypeScript support with generics

#### `mappers.ts`
- **Purpose**: Convert between backend and frontend data types
- **Key Functions**:
  - `mapBackendRole()` - Converts 'USER'|'DONOR'|'ADMIN' to 'student'|'donor'|'admin'
  - `mapFrontendRole()` - Converts 'student'|'donor'|'admin' to 'USER'|'DONOR'|'ADMIN'
  - `mapBackendStatus()` - Converts status from uppercase to lowercase
  - `mapFrontendStatus()` - Converts status from lowercase to uppercase
  - `mapUserProjectToCampaign()` - Converts backend UserProject to frontend Campaign
  - `mapDonorProjectToProject()` - Converts backend DonorProject to frontend Project
  - `mapCampaignToUserProjectData()` - Converts frontend Campaign to backend format
  - `mapProjectToDonorProjectData()` - Converts frontend Project to backend format

### 📁 Service Files

#### `authService.ts`
Authentication and user management

**Functions:**
- `register(data)` - Register a new user
- `login(data)` - Login with email/password
- `getCurrentUser()` - Get currently logged-in user
- `logout()` - Clear user session
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, password)` - Reset password with token

**Endpoints:**
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

#### `userProjectService.ts`
Student campaigns (called "User Projects" in backend)

**Functions:**
- `getPublicUserProjects()` - Get all public campaigns
- `getUserProject(id)` - Get specific campaign
- `getMyUserProjects()` - Get current user's campaigns
- `createUserProject(data)` - Create new campaign
- `updateUserProject(id, data)` - Update campaign
- `deleteUserProject(id)` - Delete campaign

**Endpoints:**
- `GET /user-projects/public`
- `GET /user-projects/:id`
- `GET /user-projects/my` (Protected)
- `POST /user-projects` (Protected - USER)
- `PUT /user-projects/:id` (Protected - USER)
- `DELETE /user-projects/:id` (Protected - USER)

#### `donorProjectService.ts`
Donor projects and opportunities

**Functions:**
- `getPublicDonorProjects()` - Get all public donor projects
- `getDonorProject(id)` - Get specific donor project
- `getMyDonorProjects()` - Get current donor's projects
- `createDonorProject(data)` - Create new donor project
- `updateDonorProject(id, data)` - Update donor project
- `deleteDonorProject(id)` - Delete donor project

**Endpoints:**
- `GET /donor-projects/public`
- `GET /donor-projects/:id`
- `GET /donor-projects/my` (Protected)
- `POST /donor-projects` (Protected - DONOR)
- `PUT /donor-projects/:id` (Protected - DONOR)
- `DELETE /donor-projects/:id` (Protected - DONOR)

#### `donationService.ts`
Donation management

**Functions:**
- `createDonation(data)` - Make a donation to a campaign
- `getMyDonations()` - Get donor's donation history
- `getProjectDonations(projectId)` - Get all donations for a campaign
- `createPaymentIntent(data)` - Create Stripe payment intent

**Endpoints:**
- `POST /donations` (Protected - DONOR)
- `GET /donations/my` (Protected - DONOR)
- `GET /donations/project/:projectId` (Protected)
- `POST /donations/create-payment-intent` (Protected - DONOR)

#### `adminService.ts`
Admin operations

**Functions:**
- `getAllProjects()` - Get all projects for review
- `verifyUserProject(id, data)` - Approve/reject user campaign
- `verifyDonorProject(id, data)` - Approve/reject donor project
- `getAllUsers()` - Get all users
- `getAllDonors()` - Get all donors

**Endpoints:**
- `GET /admin/projects` (Protected - ADMIN)
- `PATCH /admin/projects/user/:id/verify` (Protected - ADMIN)
- `PATCH /admin/projects/donor/:id/verify` (Protected - ADMIN)
- `GET /admin/users` (Protected - ADMIN)
- `GET /admin/donors` (Protected - ADMIN)

## Usage Examples

### 1. Authentication

```typescript
import { login, register, logout } from './services/authService';
import { mapBackendRole } from './services/mappers';

// Login
const response = await login({ email, password });
if (response.data?.user) {
  const role = mapBackendRole(response.data.user.role);
  console.log('Logged in as:', role); // 'student', 'donor', or 'admin'
}

// Register
await register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'USER' // or 'DONOR' or 'ADMIN'
});

// Logout
logout(); // Clears token
```

### 2. Load Campaigns

```typescript
import { getPublicUserProjects, getMyUserProjects } from './services/userProjectService';
import { mapUserProjectToCampaign } from './services/mappers';

// Get all public campaigns
const response = await getPublicUserProjects();
const campaigns = response.data.userProjects.map(mapUserProjectToCampaign);

// Get my campaigns (requires auth)
const myResponse = await getMyUserProjects();
const myCampaigns = myResponse.data.userProjects.map(mapUserProjectToCampaign);
```

### 3. Create Campaign

```typescript
import { createUserProject } from './services/userProjectService';
import { mapUserProjectToCampaign } from './services/mappers';

const response = await createUserProject({
  title: 'Build a Learning Platform',
  description: 'A comprehensive platform for online learning...',
  companyName: 'EduTech Startup',
  skillsRequired: ['React', 'Node.js'],
  timeline: '4 months',
  goalAmount: 7500,
  imageUrl: 'https://example.com/image.jpg'
});

const newCampaign = mapUserProjectToCampaign(response.data.userProject);
```

### 4. Make Donation

```typescript
import { createDonation } from './services/donationService';

await createDonation({
  amount: 250,
  userProjectId: campaignId,
  message: 'Great project!',
  anonymous: false
});
```

### 5. Admin Approval

```typescript
import { verifyUserProject } from './services/adminService';

// Approve
await verifyUserProject(campaignId, { status: 'APPROVED' });

// Reject with reason
await verifyUserProject(campaignId, { 
  status: 'REJECTED',
  reason: 'Insufficient details provided'
});
```

## Type Conversions

### Roles
- Backend: `'USER'` | `'DONOR'` | `'ADMIN'`
- Frontend: `'student'` | `'donor'` | `'admin'`

### Status
- Backend: `'PENDING'` | `'APPROVED'` | `'REJECTED'`
- Frontend: `'pending'` | `'approved'` | `'rejected'`

### Entities
- Backend `UserProject` → Frontend `Campaign`
- Backend `DonorProject` → Frontend `Project`

## Error Handling

All service functions can throw errors. Always use try-catch:

```typescript
try {
  const response = await someService();
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // Show user-friendly error
  }
}
```

## Authentication Flow

1. User logs in → JWT token stored in localStorage
2. `setToken()` is called automatically
3. Subsequent API calls include `Authorization: Bearer <token>` header
4. Token is validated by backend
5. On logout, `removeToken()` clears the token

## Configuration

Set the API URL in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

## See Also

- [Integration Guide](../../INTEGRATION_GUIDE.md) - Complete integration instructions
- [Auth Example](../examples/AuthIntegrationExample.tsx) - Authentication hook example
- [Campaign Example](../examples/CampaignIntegrationExample.tsx) - Campaign management hook example
