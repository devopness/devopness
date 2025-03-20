import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

interface Server {
  id: number;
  name: string;
}

interface ServerSelectionProps {
  servers: Server[];
  selectedServerIds: number[];
  onChange: (selectedIds: number[]) => void;
}

export const ServerSelection: React.FC<ServerSelectionProps> = ({
  servers,
  selectedServerIds,
  onChange,
}) => {
  const handleServerToggle = (serverId: number) => {
    const newSelectedIds = selectedServerIds.includes(serverId)
      ? selectedServerIds.filter((id) => id !== serverId)
      : [...selectedServerIds, serverId];
    onChange(newSelectedIds);
  };

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        Select servers to execute action on:
      </Typography>
      <FormGroup>
        {servers.map((server) => (
          <FormControlLabel
            key={server.id}
            control={
              <Checkbox
                checked={selectedServerIds.includes(server.id)}
                onChange={() => handleServerToggle(server.id)}
              />
            }
            label={server.name}
          />
        ))}
      </FormGroup>
    </div>
  );
};
