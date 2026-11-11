/**
 * Averiq Institute Management System
 * Unified Multi-Tenant Cloud Architecture
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IMSProvider, useIMS } from './context/IMSContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { TuitionProApp } from './components/tuitionpro/TuitionProApp';
import { RoleSelectionScreen } from './components/auth/RoleSelectionScreen';
import { AveriqLogo } from './components/averiq/AveriqLogo';
import { Role } from './types/ims';

function AppContent() {
  const { setRole } = useIMS();
  const { session, profile, isPlatformAdmin, isLoading, signOut, getAppRoleForProfile } = useAuth();
  const [hasSelectedRole, setHasSelectedRole] = useState(false);

  // Automatically restore session role on page reload
  useEffect(() => {
    if (session && profile) {
      const authorized = getAppRoleForProfile(isPlatformAdmin ? 'SUPER_ADMIN' : 'ADMIN');
      setRole(authorized.role);
      setHasSelectedRole(true);
    }
  }, [session, profile, isPlatformAdmin, setRole, getAppRoleForProfile]);

  const handleRoleSelect = (role: Role) => {
    setRole(role);
    setHasSelectedRole(true);
  };

  const handleSwitchRole = async () => {
    await signOut();
    setHasSelectedRole(false);
  };

  const handleSkipToDashboard = () => {
    setRole('ADMIN');
    setHasSelectedRole(true);
  };

  // Loading state while restoring Supabase auth session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FBFF] flex flex-col items-center justify-center p-6 text-[#122D4A] font-sans">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#3979C5] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(57,121,197,0.3)] animate-pulse">
            <AveriqLogo className="w-8 h-8 text-white" showText={false} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#122D4A]">Averiq IMS</h3>
            <p className="text-xs text-[#5A7184]">Verifying secure multi-tenant authentication session...</p>
          </div>
          <div className="w-32 h-1 bg-[#E2EDF8] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[#3979C5] rounded-full animate-indeterminate" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated or role selection state
  if (!session && !hasSelectedRole) {
    return (
      <RoleSelectionScreen
        onSelectRole={handleRoleSelect}
        onSkipToDashboard={handleSkipToDashboard}
      />
    );
  }

  // Authenticated application view
  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1329] text-[#0F172A] dark:text-[#E2E8F0] flex flex-col font-sans transition-colors duration-200">
      <TuitionProApp onSwitchRole={handleSwitchRole} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <IMSProvider>
            <AppContent />
          </IMSProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
