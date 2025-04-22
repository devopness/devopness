# Devopness UI - React ><>

The official Devopness UI components for React

## Usage

### Install/Upgrade

Use your favourite package manager to install Devopness UI as a dependency of your project:

```bash
# Using npm
npm install @devopness/ui-react

# Using yarn
yarn add @devopness/ui-react
```

## ✍️ <a id="contributing"></a>Contributing

Improvements and contributions are highly encouraged! 🙏👊

See the [contributing guide](../../../CONTRIBUTING.md) for details on how to participate.

All communication and contributions to Devopness projects are subject to the [Devopness Code of Conduct](../../../CODE_OF_CONDUCT.md).

Not yet ready to contribute but do like the project? Support Devopness with a ⭐!

## Dependencies

This component library uses:

- ⚛️ [React](https://react.dev/) — JavaScript library for user interfaces
- 📖 [Storybook](https://storybook.js.org/) — Frontend workshop for UI development
- 💅 [Styled Components](https://styled-components.com/) - CSS-in-JS library for styling components
- ⚡ [Vite](https://vite.dev/) — The build tool for the web
- 📦 [SWC (Speedy Web Compiler)](https://swc.rs/) — Rust based compiler used to speed up Vite dev server
- 🧪 [Vitest](https://vitest.dev/) — Vite-native testing framework
- 🐙 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - A light-weight solution for testing React components

As well as a few others tools configured:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Development & Testing

Installing on `Linux` or `macOS` systems.

#### 1. Navigate to the project directory

```shell
cd packages/ui/react/
```

#### 2. Install missing dependencies

This command will install all modules listed as dependencies in [package.json](package.json).

```
npm install
```

#### 3. Build UI package

```
npm run build
```

#### 4. Run tests

```
npm run test
```

#### 5. Run storybook

```
npm run storybook
```
