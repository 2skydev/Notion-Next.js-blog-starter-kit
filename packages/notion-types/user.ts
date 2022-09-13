import { ID } from './core';

export interface User {
  id: ID;
  version: number;
  email: string;

  // CUSTOM: name 속성 추가
  name?: string;

  given_name: string;
  family_name: string;
  profile_photo: string;
  onboarding_completed: boolean;
  mobile_onboarding_completed: boolean;
}
