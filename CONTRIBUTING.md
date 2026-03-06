# Contributing to Navet

Thank you for your interest in contributing to Navet! This document provides guidelines for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/home-assistant-dashboard.git
   cd home-assistant-dashboard
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/awesomestvi/home-assistant-dashboard.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 💻 Development Process

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow existing patterns and conventions
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

4. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Link any related issues

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Follow the component structure:
  ```tsx
  // 1. Imports
  import { useState } from 'react';
  
  // 2. Types/Interfaces
  interface ComponentProps {
    prop: string;
  }
  
  // 3. Component
  export function Component({ prop }: ComponentProps) {
    // 4. Hooks
    const [state, setState] = useState();
    
    // 5. Handlers
    const handleClick = () => {};
    
    // 6. Render
    return <div />;
  }
  ```

### Styling

- Use Tailwind CSS utility classes
- Follow the iOS-inspired design aesthetic
- Maintain consistency with existing components
- Use theme tokens from `/src/styles/theme.css`
- Respect the spacing system (xs=4px, sm=8px, md=12px, lg=16px, xl=24px, xxl=32px)

### File Organization

```
/src/app
  ├── components/       # Reusable UI components
  ├── features/        # Feature-specific components
  ├── contexts/        # React contexts
  ├── hooks/           # Custom hooks
  ├── utils/           # Utility functions
  ├── types/           # TypeScript types
  └── data/            # Mock data
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.ts`)
- **Utilities**: camelCase (`myUtil.ts`)
- **Types**: PascalCase (`MyType.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`MY_CONSTANT`)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add calendar widget support
fix: correct theme toggle behavior
docs: update installation instructions
style: format code with prettier
refactor: simplify card rendering logic
```

## 📤 Submitting Changes

### Pull Request Guidelines

1. **Ensure your PR:**
   - Has a clear, descriptive title
   - References any related issues
   - Includes a detailed description of changes
   - Contains tests for new features (when applicable)
   - Updates documentation as needed
   - Follows the coding standards
   - Has been tested on multiple screen sizes

2. **PR Checklist:**
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings or errors
   - [ ] Tested on mobile, tablet, and desktop
   - [ ] Tested in light and dark themes
   - [ ] All automated checks pass

3. **Review Process:**
   - Maintainers will review your PR
   - Address any feedback promptly
   - Make requested changes in new commits
   - Once approved, your PR will be merged

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues to avoid duplicates
2. Ensure you're using the latest version
3. Test with different browsers if applicable

### Bug Report Template

```markdown
**Description**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Search existing feature requests
3. Provide a clear use case
4. Explain why this feature would be useful
5. Consider if it fits the project's goals

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Explain the problem this feature would solve.

**Proposed Solution**
How you envision this feature working.

**Alternatives Considered**
Other solutions you've thought about.

**Additional Context**
Mockups, examples, or references.
```

## 🎨 Design Guidelines

### iOS-Inspired Aesthetic

- Frosted glass effects with backdrop blur
- Rounded corners (12px, 16px, 24px)
- Smooth animations and transitions
- San Francisco-inspired typography
- Subtle shadows and depth

### Accessibility

- Ensure proper color contrast
- Add ARIA labels where needed
- Support keyboard navigation
- Test with screen readers
- Provide alternative text for images

### Responsiveness

- Mobile-first approach
- Test on multiple screen sizes
- Use responsive breakpoints
- Ensure touch targets are large enough

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 🙏 Thank You!

Your contributions make this project better! Whether it's code, documentation, bug reports, or feature ideas, every contribution is valued and appreciated.

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (CC BY-NC 4.0).

---

**Questions?** Feel free to open an issue or discussion on GitHub!
