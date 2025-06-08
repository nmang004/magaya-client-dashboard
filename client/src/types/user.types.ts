export interface User {
  id: number;
  email: string;
  companyName: string;
  role: 'client' | 'admin';
  profile: UserProfile;
  permissions: string[];
  lastLogin?: Date;
}

export interface UserProfile {
  contactPerson: string;
  phone: string;
  address: string;
  logo: string;
  timezone: string;
  preferredCurrency: string;
}