# Order Dashboard

Order Dashboard is a modern web application for managing and tracking orders, built with React, TypeScript, and Vite. It features a modular architecture based on Feature-Sliced Design (FSD) for scalability and maintainability.

## 🚀 Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🏗️ Architectural Decisions

- **Feature-Sliced Design (FSD):**
  - The codebase is organized by domain features (entities, features, widgets, pages, shared) to improve modularity, scalability, and team collaboration.
  - Each feature encapsulates its own logic, UI, and state management.

- **State Management:**
  - Uses Redux Toolkit for global state and React Hook Form for form state.
  - Zod is used for schema validation.

- **Styling:**
  - Tailwind CSS for utility-first styling.
  - shadcn/ui and Lucide for UI components and icons.

- **Routing:**
  - React Router DOM for client-side routing.

- **Other Libraries:**
  - clsx and class-variance-authority for conditional class management.
  - sonner for notifications.
  - uuid for unique IDs.

## 🤔 Reasoning Behind Decisions

- **FSD** was chosen to keep the codebase maintainable as it grows, making it easier to onboard new developers and isolate changes.
- **Redux Toolkit** simplifies state logic and reduces boilerplate. Worked with it before.

## 🛠️ Improvements for the Future

1. **Revalidation on stop address fields:**
   - Currently, there is no revalidation when editing stop address fields, which can disappoint users. Adding real-time validation would improve UX.
2. **Clean up component code:**
   - Some components could be refactored for better readability and maintainability.
3. **Test every flow:**
   - Increase test coverage and ensure all user flows are robustly tested.

---

Feel free to contribute or suggest further improvements!
