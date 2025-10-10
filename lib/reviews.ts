export interface Review {
  id: string
  productVariationId: string
  productTemplateId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number // 1-5
  title: string
  comment: string
  isVerifiedPurchase: boolean
  status: "pending" | "approved" | "rejected"
  helpfulCount: number
  images: ReviewImage[]
  createdAt: string
  updatedAt: string
}

export interface ReviewImage {
  id: string
  reviewId: string
  imageUrl: string
  altText: string
  sortOrder: number
  createdAt: string
}

export interface ProductRatingSummary {
  productTemplateId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface ReviewFormData {
  productVariationId: string
  productTemplateId: string
  rating: number
  title: string
  comment: string
  images?: File[]
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "1",
    productVariationId: "1",
    productTemplateId: "1",
    userId: "1",
    userName: "María García",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Excelente calidad y comodidad",
    comment:
      "Este sofá superó mis expectativas. La calidad de los materiales es excepcional y es muy cómodo. El color es exactamente como se ve en las fotos. Lo recomiendo totalmente.",
    isVerifiedPurchase: true,
    status: "approved",
    helpfulCount: 12,
    images: [
      {
        id: "1",
        reviewId: "1",
        imageUrl: "/sofa-in-living-room.jpg",
        altText: "Sofá en sala de estar",
        sortOrder: 1,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    productVariationId: "1",
    productTemplateId: "1",
    userId: "2",
    userName: "Carlos Rodríguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Muy bueno, pero el envío tardó",
    comment:
      "El producto es excelente, muy cómodo y bien hecho. Le doy 4 estrellas porque el envío tardó más de lo esperado, pero el sofá en sí es perfecto.",
    isVerifiedPurchase: true,
    status: "approved",
    helpfulCount: 8,
    images: [],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    productVariationId: "1",
    productTemplateId: "1",
    userId: "3",
    userName: "Ana Martínez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Perfecto para mi sala",
    comment:
      "Estoy encantada con esta compra. El sofá es hermoso y muy cómodo. El tamaño es perfecto para mi sala y la calidad es increíble por el precio.",
    isVerifiedPurchase: true,
    status: "approved",
    helpfulCount: 15,
    images: [
      {
        id: "2",
        reviewId: "3",
        imageUrl: "/modern-sofa.png",
        altText: "Sofá moderno",
        sortOrder: 1,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        reviewId: "3",
        imageUrl: "/sofa-detail.jpg",
        altText: "Detalle del sofá",
        sortOrder: 2,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockRatingSummaries: Record<string, ProductRatingSummary> = {
  "1": {
    productTemplateId: "1",
    averageRating: 4.7,
    totalReviews: 3,
    ratingDistribution: {
      5: 2,
      4: 1,
      3: 0,
      2: 0,
      1: 0,
    },
  },
}

// Get reviews for a product
export async function getProductReviews(productId: string): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockReviews.filter((review) => review.productTemplateId === productId && review.status === "approved")
}

// Get rating summary for a product
export async function getProductRatingSummary(productId: string): Promise<ProductRatingSummary | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockRatingSummaries[productId] || null
}

// Submit a new review
export async function submitReview(userId: string, reviewData: ReviewFormData): Promise<Review> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newReview: Review = {
    id: String(mockReviews.length + 1),
    productVariationId: reviewData.productVariationId,
    productTemplateId: reviewData.productTemplateId,
    userId,
    userName: "Current User",
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment,
    isVerifiedPurchase: false,
    status: "pending",
    helpfulCount: 0,
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockReviews.push(newReview)
  return newReview
}

// Mark review as helpful
export async function markReviewHelpful(reviewId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const review = mockReviews.find((r) => r.id === reviewId)
  if (review) {
    review.helpfulCount++
  }
}

// Get all reviews (for admin)
export async function getAllReviews(): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockReviews
}

// Update review status (for admin)
export async function updateReviewStatus(reviewId: string, status: "approved" | "rejected"): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const review = mockReviews.find((r) => r.id === reviewId)
  if (review) {
    review.status = status
  }
}

// Delete review (for admin)
export async function deleteReview(reviewId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const index = mockReviews.findIndex((r) => r.id === reviewId)
  if (index !== -1) {
    mockReviews.splice(index, 1)
  }
}
