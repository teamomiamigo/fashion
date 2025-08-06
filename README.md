# Fashion App

A React Native mobile application built with modern technologies and best practices.

## Tech Stack

- **Framework**: React Native + Expo + TypeScript
- **UI Library**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Authentication & Sync**: Supabase
- **Storage**: AsyncStorage + SecureStore
- **Testing**: Jest + React Native Testing Library
- **Build & Deploy**: EAS Build (Expo)
- **CI/CD**: GitHub Actions

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── store/          # Zustand stores
├── services/       # API services (Supabase)
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── hooks/          # Custom React hooks
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fashion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Features

- **Authentication**: Login/logout with Supabase
- **Navigation**: Tab-based navigation with authentication flow
- **State Management**: Persistent state with Zustand
- **Form Validation**: Type-safe forms with React Hook Form + Zod
- **Styling**: Utility-first styling with NativeWind
- **Testing**: Comprehensive test setup with Jest

## Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation in `src/navigation/AppNavigator.tsx`
3. Update the navigation types if needed

### Adding New Components

1. Create reusable components in `src/components/`
2. Use NativeWind classes for styling
3. Add TypeScript interfaces for props

### State Management

- Use Zustand stores in `src/store/`
- Stores are automatically persisted with AsyncStorage
- Follow the pattern established in `useAuthStore.ts`

### Testing

- Write tests in `__tests__` folders
- Use React Native Testing Library
- Mock external dependencies appropriately

## Deployment

### EAS Build Setup

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS:
```bash
eas build:configure
```

4. Build for production:
```bash
eas build --platform all
```

### Environment Variables

Make sure to set up the following environment variables in EAS:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License. 