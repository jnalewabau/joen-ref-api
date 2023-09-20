export type PartnerRole = 'fully-trusted-partner' | 'read-only-partner' | 'create-partner';

export interface PartnerKeyAndRole {
  apiKey: string;
  role: PartnerRole;
  disabled: boolean;
}

export interface PartnerInfo {
  partnerId: string;
  name: string;
  apiAccess: PartnerKeyAndRole[];
}
