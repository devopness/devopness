import { render, screen } from '@testing-library/react';

import { Input } from './Input';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('without autoFocusOnError should not focus when error prop changes', () => {
    const { rerender } = render(<Input type="text" data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).not.toHaveFocus();

    rerender(<Input type="text" error={{ message: 'New error' }} data-testid="test-input" />);
    expect(input).not.toHaveFocus();
  });

  it('with autoFocusOnError should focus when error prop changes', () => {
    const { rerender } = render(<Input type="text" autoFocusOnError data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).not.toHaveFocus();

    rerender(<Input type="text" autoFocusOnError error={{ message: 'New error' }} data-testid="test-input" />);
    expect(input).toHaveFocus();
  });
});