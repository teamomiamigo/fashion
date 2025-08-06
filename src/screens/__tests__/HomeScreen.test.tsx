import { render, screen } from '@testing-library/react-native';
import React from 'react';
import HomeScreen from '../HomeScreen';

// Mock the store
jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: { id: '1', email: 'test@example.com', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

describe('HomeScreen', () => {
  it('renders welcome message', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('Welcome to Fashion App')).toBeTruthy();
    expect(screen.getByText('Hello, Test User!')).toBeTruthy();
  });
}); 