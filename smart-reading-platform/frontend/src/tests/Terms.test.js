import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Terms from '../components/Terms';

describe('Terms Component', () => {
  test('renders the Terms of Service title', () => {
    render(<Terms />);
    expect(screen.getByText(/Terms of Service📜/i)).toBeInTheDocument();
  });

  test('displays last updated date', () => {
    render(<Terms />);
    expect(screen.getByText(/Last Updated: January 6, 2025/i)).toBeInTheDocument();
  });

  test('renders all section titles', () => {
    render(<Terms />);

    const sectionTitles = [
      'Welcome to ShelfMate! 🎉',
      'Use of Our Service 🔧',
      'Account Responsibility 🔒',
      'Content You Post ✍️',
      'Intellectual Property 📚',
      'Age Requirement 🧒',
      'Paid Features 💸',
      'Disputes ⚖️',
      'Changes to Terms 🔄',
    ];

    sectionTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('renders sample text message', () => {
    render(<Terms />);
    expect(screen.getByText(/This is a sample terms of use for ShelfMate./i)).toBeInTheDocument();
  });
});