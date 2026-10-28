import React from 'react';
import { Role } from '../../types/ims';
import { AveriqLoginLandingPage } from './AveriqLoginLandingPage';

interface RoleSelectionScreenProps {
  onSelectRole: (role: Role) => void;
  onSkipToDashboard?: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  onSkipToDashboard
}) => {
  return (
    <AveriqLoginLandingPage
      onSelectRole={onSelectRole}
      onSkipToDashboard={onSkipToDashboard}
    />
  );
};
