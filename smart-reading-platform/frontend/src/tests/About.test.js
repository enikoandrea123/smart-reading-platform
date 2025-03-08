import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import About from '../components/About';

describe('About Component', () => {
  test('renders About ShelfMate title', () => {
    render(<About />);
    const titleElement = screen.getByText(/📚 About ShelfMate/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders About ShelfMate description', () => {
    render(<About />);
    const descriptionElement = document.querySelector('.about-description');
    expect(descriptionElement).toHaveTextContent('ShelfMate is an AI-powered platform designed to revolutionize');
  });

  test('renders list of reasons to choose ShelfMate', () => {
    render(<About />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  test('renders founder message', () => {
    render(<About />);
    const founderMessage = screen.getByText(/"ShelfMate started as my final thesis project/i);
    expect(founderMessage).toBeInTheDocument();
  });

  test('renders Join the ShelfMate Experience section', () => {
    render(<About />);
    const joinSection = screen.getByText(/🚀 Join the ShelfMate Experience/i);
    expect(joinSection).toBeInTheDocument();
  });

  test('renders sample text about ShelfMate', () => {
    render(<About />);
    const sampleText = screen.getByText((content, element) =>
      element.className === 'sample-text' && content.includes('ShelfMate is an AI-powered platform built as a thesis project')
    );
    expect(sampleText).toBeInTheDocument();
  });
});