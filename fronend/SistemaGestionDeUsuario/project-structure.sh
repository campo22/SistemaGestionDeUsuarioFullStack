#!/bin/bash

# Create src directory if it doesn't exist
mkdir -p src

# Create the base directories inside src
mkdir -p src/core/domain/models
mkdir -p src/core/store
mkdir -p src/features/auth/components
mkdir -p src/features/auth/pages
mkdir -p src/features/auth/services
mkdir -p src/features/auth/slices
mkdir -p src/features/auth/hooks
mkdir -p src/features/user/components
mkdir -p src/features/user/pages
mkdir -p src/features/user/services
mkdir -p src/features/user/slices
mkdir -p src/features/admin/components
mkdir -p src/features/admin/pages
mkdir -p src/features/admin/services
mkdir -p src/features/admin/slices
mkdir -p src/shared/components
mkdir -p src/shared/hooks
mkdir -p src/shared/services
mkdir -p src/shared/utils
mkdir -p src/shared/constants
mkdir -p src/shared/theme
mkdir -p src/routes
mkdir -p src/assets

# Create core files
touch src/core/domain/models/user.ts
touch src/core/domain/models/auth.ts
touch src/core/domain/models/common.ts
touch src/core/store/store.ts
touch src/core/store/rootReducer.ts
touch src/core/store/hooks.ts

# Create auth feature files
touch src/features/auth/components/LoginForm.tsx
touch src/features/auth/components/RegisterForm.tsx
touch src/features/auth/pages/LoginPage.tsx
touch src/features/auth/pages/RegisterPage.tsx
touch src/features/auth/services/authService.ts
touch src/features/auth/slices/authSlice.ts
touch src/features/auth/hooks/useAuth.ts

# Create user feature files
touch src/features/user/components/UserProfileCard.tsx
touch src/features/user/pages/ProfilePage.tsx
touch src/features/user/services/userService.ts
touch src/features/user/slices/userSlice.ts

# Create admin feature files
touch src/features/admin/components/UserTable.tsx
touch src/features/admin/components/UserEditModal.tsx
touch src/features/admin/pages/AdminDashboardPage.tsx
touch src/features/admin/services/adminService.ts
touch src/features/admin/slices/adminSlice.ts

# Create shared files
touch src/shared/components/Layout.tsx
touch src/shared/components/ProtectedRoute.tsx
touch src/shared/components/AdminProtectedRoute.tsx
touch src/shared/services/axiosInstance.ts

# Create routes file
touch src/routes/AppRoutes.tsx

echo "Folder structure created successfully inside src directory!"
