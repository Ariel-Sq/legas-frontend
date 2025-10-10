export interface User {
  id: string
  name: string
  email: string
  avatar: string
  isAdmin: boolean
  phone?: string
  address?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
}

export interface CartInfo {
  itemCount: number
  total: number
}

// Mock user data - simulating a logged-in user
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/user-profile-photo.png",
  isAdmin: true,
  phone: "+1 (555) 123-4567",
  address: {
    street: "123 Oak Street",
    city: "San Francisco",
    postalCode: "94102",
    country: "United States",
  },
}

// Mock cart data
const mockCart: CartInfo = {
  itemCount: 3,
  total: 1247.97,
}

// Simulate async data fetching
export async function getCurrentUser(): Promise<User> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockUser
}

export async function getUser(): Promise<User> {
  return getCurrentUser()
}

export async function getCartInfo(): Promise<CartInfo> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockCart
}
