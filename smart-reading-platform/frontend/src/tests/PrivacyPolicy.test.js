import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacyPolicy from '../components/PrivacyPolicy';

describe('PrivacyPolicy Component', () => {
  test('renders the Privacy Policy title', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/Privacy Policy 🛡️/i)).toBeInTheDocument();
  });

  test('displays last updated date', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/Last Updated: January 6, 2025/i)).toBeInTheDocument();
  });

  test('renders all section titles', () => {
    render(<PrivacyPolicy />);

    const sectionTitles = [
      'Information We Collect 📊',
      'How We Use Your Info 🧠',
      'Sharing Your Info 🔒',
      'Your Privacy Choices ✨',
      'Cookies 🍪',
      'Children’s Privacy 👶',
      'Changes to This Policy 🔄',
    ];

    sectionTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('renders sample text message', () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/This is a sample privacy policy for ShelfMate./i)).toBeInTheDocument();
  });
});