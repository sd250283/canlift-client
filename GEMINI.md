# Can'Lift Project - AI Coding Instructions

## Project Overview
Can'Lift is a Vue 3 elevator simulation and event management application built with TypeScript, Vuex, and Tailwind CSS. The application manages elevator operations, user authentication, and administrative functions through a modern web interface.

## Technology Stack
- **Frontend**: Vue 3 (Composition API), TypeScript
- **State Management**: Vuex 4
- **Styling**: Tailwind CSS (utility-first approach)
- **UI Components**: Custom component library with shadcn/ui-inspired design
- **Backend API**: Symfony 6.3 with API Platform
- **Icons**: FontAwesome
- **Build Tool**: Vue CLI with Webpack

## Coding Standards & Best Practices

### Vue 3 Development
- **Always use Composition API** with `<script setup>` or `setup()` function
- **Prefer `computed` over `watch`** for reactive data transformations
- **Use `defineComponent`** for explicit TypeScript component definitions
- **Follow single responsibility principle** - one concern per component
- **Use TypeScript interfaces** for all data structures and API responses

### Tailwind CSS Guidelines
- **NEVER write custom CSS** - use Tailwind utility classes exclusively
- **Follow mobile-first responsive design** using `sm:`, `md:`, `lg:`, `xl:` prefixes
- **Use semantic color classes**: `bg-gray-900`, `text-white`, `border-gray-200`
- **Prefer component variants** over inline styles
- **Use Tailwind spacing scale**: `p-4`, `m-6`, `space-x-2`, `gap-4`
- **Implement hover/focus states** with `hover:` and `focus:` prefixes
- **Use transition classes** for smooth animations: `transition-colors duration-200`

### Component Architecture
- **Create reusable UI components** in `src/components/ui/`
- **ALWAYS prioritize UI components over native HTML elements** - use components from `src/components/ui/` directory when available (e.g., use `<Button>` instead of `<button>`, `<Checkbox>` instead of `<input type="checkbox">`, `<Input>` instead of `<input>`)
- **Check UI component availability first** - before using native HTML elements, verify if a corresponding UI component exists in the `ui/` directory
- **Use props interfaces** for type-safe component communication
- **Implement proper event emission** with typed emits
- **Follow Vue 3 naming conventions**: PascalCase for components, camelCase for props
- **Separate business logic** from presentation components

### State Management (Vuex)
- **Use typed Vuex modules** with proper action/mutation types
- **Implement proper error handling** in actions
- **Use getters for computed state** instead of direct state access
- **Follow action-mutation pattern** strictly
- **Use `extractApiPlatformData` utility** for API Platform response handling

### API Integration
- **Use the centralized `api.service.ts`** for all HTTP requests
- **Handle API Platform response format** with `extractApiPlatformData`
- **Implement proper error handling** and user feedback
- **Use TypeScript interfaces** for API request/response types
- **Follow RESTful conventions** for endpoint naming

### File Organization
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   └── *.vue            # Feature-specific components
├── views/               # Page-level components
├── store/               # Vuex store modules
│   └── modules/         # Feature-specific store modules
├── models/              # TypeScript interfaces and types
├── common/              # Shared utilities and services
└── router/              # Vue Router configuration
```

### Responsive Design Rules
- **Design mobile-first**: Base styles for mobile, then add breakpoint-specific styles
- **Use Tailwind breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Test all breakpoints**: Ensure UI works across all device sizes
- **Use flexbox/grid utilities**: `flex`, `grid`, `items-center`, `justify-between`
- **Hide/show content responsively**: `hidden md:block`, `block md:hidden`

### Performance Considerations
- **Use `v-show` for frequent toggles**, `v-if` for conditional rendering
- **Implement lazy loading** for heavy components
- **Optimize bundle size** by importing only needed libraries
- **Use `shallowRef` and `markRaw`** for large non-reactive objects
- **Avoid unnecessary watchers** - prefer computed properties

### Error Handling
- **Always handle API errors gracefully**
- **Provide user-friendly error messages**
- **Use try-catch blocks** in async operations
- **Implement loading states** for better UX
- **Log errors appropriately** for debugging

### Code Quality
- **Write self-documenting code** with clear variable/function names
- **Add JSDoc comments** for complex functions
- **Use TypeScript strict mode** - no `any` types allowed
- **Follow ESLint and Prettier rules**
- **Write unit tests** for critical business logic

### Git Workflow
- **Use conventional commits**: `feat:`, `fix:`, `refactor:`, `style:`
- **Create feature branches** from `develop`
- **Write descriptive commit messages**
- **Keep commits atomic** - one logical change per commit

## Command Reference
```bash
# Development
yarn serve                # Start development server
yarn build               # Build for production
yarn lint                # Run ESLint
yarn lint --fix          # Fix linting issues

# Testing
yarn test:unit           # Run unit tests
yarn test:e2e            # Run end-to-end tests
```

## Important Notes for AI Agents
- **NEVER edit UI component files** - do not modify or change the structure of files in `src/components/ui/` directory except for Tailwind CSS classes in `cn('')` props or when explicitly instructed
- **NEVER write custom CSS** - everything should be Tailwind CSS utility classes
- **Always test responsive behavior** across different screen sizes
- **Implement proper TypeScript typing** throughout the application

## Examples of Good Practices

### ✅ Good: Using UI Components Instead of Native HTML
```vue
<template>
  <div class="space-y-4">
    <!-- Use UI components instead of native HTML -->
    <Button variant="primary" @click="handleSubmit">Submit</Button>
    <Checkbox v-model="isChecked" />
    <Input v-model="username" placeholder="Enter username" />
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
</script>
```

### ❌ Bad: Using Native HTML Instead of UI Components
```vue
<template>
  <div class="space-y-4">
    <!-- Avoid native HTML when UI components exist -->
    <button class="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
    <input type="checkbox" v-model="isChecked" />
    <input type="text" v-model="username" placeholder="Enter username" />
  </div>
</template>
```

### ✅ Good: Tailwind CSS Component
```vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ title }}</h2>
    <p class="text-gray-600 leading-relaxed">{{ content }}</p>
  </div>
</template>
```

### ❌ Bad: Custom CSS
```vue
<template>
  <div class="card">
    <h2 class="card-title">{{ title }}</h2>
    <p class="card-content">{{ content }}</p>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
}
</style>
```[byterover-mcp]

# important 
always use byterover-retrive-knowledge tool to get the related context before any tasks 
always use byterover-store-knowledge to store all the critical informations after sucessful tasks