export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface CartInfo {
  itemCount: number;
  total: number;
}
