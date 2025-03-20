import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServerSelection } from './ServerSelection';

describe('ServerSelection', () => {
  const mockServers = [
    { id: 1, name: 'Server 1' },
    { id: 2, name: 'Server 2' },
  ];

  it('renders all servers', () => {
    render(
      <ServerSelection
        servers={mockServers}
        selectedServerIds={[]}
        onChange={() => {}}
      />
    );

    mockServers.forEach((server) => {
      const serverElement = screen.getByLabelText(server.name);
      expect(serverElement).toBeInTheDocument();
    });
  });

  it('shows correct initial selection', () => {
    render(
      <ServerSelection
        servers={mockServers}
        selectedServerIds={[1]}
        onChange={() => {}}
      />
    );

    const checkbox1 = screen.getByLabelText('Server 1') as HTMLInputElement;
    const checkbox2 = screen.getByLabelText('Server 2') as HTMLInputElement;
    
    expect(checkbox1).toBeChecked();
    expect(checkbox2).not.toBeChecked();
  });

  it('calls onChange with correct server IDs when selection changes', () => {
    const handleChange = vi.fn();
    render(
      <ServerSelection
        servers={mockServers}
        selectedServerIds={[]}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByLabelText('Server 1');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith([1]);
  });
});
