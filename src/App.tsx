/**
 * IMS by ZENTRYX – Institution Management System Demo
 */
import React, { useState } from 'react';
import { IMSProvider, useIMS } from './context/IMSContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { TuitionProApp } from './components/tuitionpro/TuitionProApp';
import { RoleSelectionScreen } from './components/auth/RoleSelectionScreen';
import { Role } from './types/ims';

function AppContent() {
  const { setRole } = useIMS();
  const [hasSelectedRole, setHasSelectedRole] = useState(true);

  const handleRoleSelect = (role: Role) => {
    setRole(role);
    setHasSelectedRole(true);
  };

  const handleSwitchRole = () => {
    setHasSelectedRole(false);
  };

  if (!hasSelectedRole) {
    return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1329] text-[#0F172A] dark:text-[#E2E8F0] flex flex-col font-sans transition-colors duration-200">
      <TuitionProApp onSwitchRole={handleSwitchRole} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <IMSProvider>
        <AppContent />
      </IMSProvider>
    </LanguageProvider>
  );
}
