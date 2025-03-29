import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('does not focus when error prop changes without autoFocusOnError', () => {
    const { rerender } = render(<Input type="text" />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveFocus();

    rerender(<Input type="text" error={{ message: 'Error' }} />);
    expect(input).not.toHaveFocus();
  });

  it('focuses when error prop changes with autoFocusOnError', () => {
    const { rerender } = render(<Input type="text" autoFocusOnError />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveFocus();

    rerender(<Input type="text" autoFocusOnError error={{ message: 'Error' }} />);
    expect(input).toHaveFocus();
  });
});