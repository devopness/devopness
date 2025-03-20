import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ServerSelection } from './ServerSelection';

const meta = {
  title: 'Components/ServerSelection',
  component: ServerSelection,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ServerSelection>;

export default meta;

// Wrapper component to handle state
const ServerSelectionWrapper = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  return (
    <ServerSelection
      servers={[
        { id: 1, name: 'Production Server 1' },
        { id: 2, name: 'Production Server 2' },
        { id: 3, name: 'Staging Server' },
      ]}
      selectedServerIds={selectedIds}
      onChange={(newIds) => {
        setSelectedIds(newIds);
        console.log('Selected server IDs:', newIds);
      }}
    />
  );
};

export const Default = {
  render: () => <ServerSelectionWrapper />
};

// Wrapper component with preselected servers
const PreselectedServerSelectionWrapper = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 3]);
  
  return (
    <ServerSelection
      servers={[
        { id: 1, name: 'Production Server 1' },
        { id: 2, name: 'Production Server 2' },
        { id: 3, name: 'Staging Server' },
      ]}
      selectedServerIds={selectedIds}
      onChange={(newIds) => {
        setSelectedIds(newIds);
        console.log('Selected server IDs:', newIds);
      }}
    />
  );
};

export const WithPreselectedServers = {
  render: () => <PreselectedServerSelectionWrapper />
};
