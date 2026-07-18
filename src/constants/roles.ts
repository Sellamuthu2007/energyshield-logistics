export type UserRole = 'government' | 'procurement' | 'shipping' | 'refinery' | 'executive' | 'admin';

export const ROLES: Record<string, UserRole> = {
  GOVERNMENT: 'government',
  PROCUREMENT: 'procurement',
  SHIPPING: 'shipping',
  REFINERY: 'refinery',
  EXECUTIVE: 'executive',
  ADMIN: 'admin',
};
