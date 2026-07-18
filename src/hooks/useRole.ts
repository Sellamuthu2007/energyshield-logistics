import { useAuth } from './useAuth';
import type { UserRole } from '@/constants/roles';

export const useRole = () => {
  const { role, profile } = useAuth();

  return {
    role,
    profile,
    isGovernment: role === 'government',
    isProcurement: role === 'procurement',
    isShipping: role === 'shipping',
    isRefinery: role === 'refinery',
    isExecutive: role === 'executive',
    isAdmin: role === 'admin',
    hasAccess: (allowedRoles: UserRole[]) => {
      if (role === 'admin') return true;
      if (!role) return false;
      return allowedRoles.includes(role);
    }
  };
};
export default useRole;
