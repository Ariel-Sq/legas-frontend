export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  material?: string;
  color?: string;
  images?: string[];
  fullDescription?: string;
  specifications?: { label: string; value: string }[];
  stock?: number;
  rating?: number;
  reviews?: number;
}

export async function getServerData() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    message: 'Hola, desde el servidor',
    timestamp: new Date().toISOString(),
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '1',
      name: 'Artisan Dining Table',
      description: 'Handcrafted dining table for family gatherings.',
      price: 1250,
      image:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop',
      category: 'featured',
    },
    {
      id: '2',
      name: 'Rustic Bed Frame',
      description:
        "Comfortable and stylish bed frame for a good night's sleep.",
      price: 980,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
      category: 'featured',
    },
    {
      id: '3',
      name: 'Modern Bookshelf',
      description: 'Elegant bookshelf to organize your collection.',
      price: 650,
      image:
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop',
      category: 'featured',
    },
  ];
}

export async function getNewArrivals(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '4',
      name: 'Minimalist Coffee Table',
      description: 'Sleek coffee table for modern living rooms.',
      price: 490,
      image:
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
    {
      id: '5',
      name: 'Scandinavian Chair',
      description: 'Comfortable chair with a Scandinavian design.',
      price: 320,
      image:
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
    {
      id: '6',
      name: 'Contemporary Desk',
      description: 'Functional desk for home offices.',
      price: 850,
      image:
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
    {
      id: '7',
      name: 'Oakwood Sideboard',
      description: 'Spacious and stylish storage solution.',
      price: 1100,
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
      category: 'new-arrival',
    },
  ];
}

export async function getShopProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '1',
      name: 'The Willow Sofa',
      description: 'Comfortable three-seater sofa with premium upholstery',
      price: 799,
      image:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      category: 'Sofas',
      material: 'Oak',
      color: 'Brown',
    },
    {
      id: '2',
      name: 'The Birch Armchair',
      description: 'Elegant armchair perfect for reading corners',
      price: 349,
      image:
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop',
      category: 'Chairs',
      material: 'Maple',
      color: 'White',
    },
    {
      id: '3',
      name: 'The Cedar Coffee Table',
      description: 'Modern coffee table with storage space',
      price: 299,
      image:
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=800&fit=crop',
      category: 'Tables',
      material: 'Walnut',
      color: 'Brown',
    },
    {
      id: '4',
      name: 'The Aspen Side Table',
      description: 'Compact side table for any room',
      price: 149,
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
      category: 'Tables',
      material: 'Oak',
      color: 'Black',
    },
    {
      id: '5',
      name: 'The Redwood Dining Table',
      description: 'Spacious dining table for family gatherings',
      price: 599,
      image:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop',
      category: 'Tables',
      material: 'Walnut',
      color: 'Brown',
    },
    {
      id: '6',
      name: 'The Pine Bookshelf',
      description: 'Tall bookshelf with adjustable shelves',
      price: 449,
      image:
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop',
      category: 'Storage',
      material: 'Oak',
      color: 'White',
    },
    {
      id: '7',
      name: 'The Maple Lounge Chair',
      description: 'Comfortable lounge chair with ottoman',
      price: 529,
      image:
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
      category: 'Chairs',
      material: 'Maple',
      color: 'Brown',
    },
    {
      id: '8',
      name: 'The Oak Sectional',
      description: 'Large sectional sofa for spacious living rooms',
      price: 1299,
      image:
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
      category: 'Sofas',
      material: 'Oak',
      color: 'Black',
    },
  ];
}

export async function getFilterOptions() {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    categories: ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage'],
    materials: ['Oak', 'Maple', 'Walnut', 'Pine'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#8b4513' },
      { name: 'Natural', hex: '#a0522d' },
    ],
    priceRange: { min: 0, max: 2000 },
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const allProducts = await getAllProducts();
  return allProducts.find((p) => p.id === id) || null;
}

export async function getAllProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '1',
      name: 'The Willow Sofa',
      description: 'Comfortable three-seater sofa with premium upholstery',
      fullDescription:
        'The Willow Sofa combines timeless design with modern comfort. Handcrafted from premium oak wood and upholstered in high-quality fabric, this three-seater sofa is perfect for any living room. The sturdy frame ensures durability while the plush cushions provide exceptional comfort for relaxation.',
      price: 799,
      image:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
      ],
      category: 'Sofas',
      material: 'Oak',
      color: 'Brown',
      specifications: [
        { label: 'Dimensions', value: '85" W x 36" D x 32" H' },
        { label: 'Material', value: 'Oak wood frame with fabric upholstery' },
        { label: 'Weight', value: '120 lbs' },
        { label: 'Seating Capacity', value: '3 people' },
        { label: 'Assembly', value: 'Minimal assembly required' },
      ],
      stock: 12,
      rating: 4.5,
      reviews: 28,
    },
    {
      id: '2',
      name: 'The Birch Armchair',
      description: 'Elegant armchair perfect for reading corners',
      fullDescription:
        'The Birch Armchair is a statement piece that combines elegance with functionality. Crafted from solid maple wood with a smooth white finish, this armchair features ergonomic design for maximum comfort during long reading sessions. The curved backrest and padded seat make it an ideal addition to any reading nook or living space.',
      price: 349,
      image:
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=800&fit=crop',
      ],
      category: 'Chairs',
      material: 'Maple',
      color: 'White',
      specifications: [
        { label: 'Dimensions', value: '28" W x 32" D x 35" H' },
        { label: 'Material', value: 'Solid maple wood' },
        { label: 'Weight', value: '35 lbs' },
        { label: 'Finish', value: 'White lacquer' },
        { label: 'Assembly', value: 'No assembly required' },
      ],
      stock: 8,
      rating: 4.8,
      reviews: 15,
    },
    {
      id: '3',
      name: 'The Cedar Coffee Table',
      description: 'Modern coffee table with storage space',
      fullDescription:
        'The Cedar Coffee Table is a perfect blend of style and functionality. Made from rich walnut wood, this modern coffee table features a spacious tabletop and hidden storage compartment underneath. The clean lines and warm brown finish make it a versatile piece that complements any living room decor.',
      price: 299,
      image:
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800&h=800&fit=crop',
      ],
      category: 'Tables',
      material: 'Walnut',
      color: 'Brown',
      specifications: [
        { label: 'Dimensions', value: '48" W x 24" D x 18" H' },
        { label: 'Material', value: 'Solid walnut wood' },
        { label: 'Weight', value: '55 lbs' },
        { label: 'Storage', value: 'Hidden compartment' },
        { label: 'Assembly', value: 'Minimal assembly required' },
      ],
      stock: 15,
      rating: 4.6,
      reviews: 22,
    },
    {
      id: '4',
      name: 'The Aspen Side Table',
      description: 'Compact side table for any room',
      fullDescription:
        'The Aspen Side Table is a compact and versatile piece perfect for any room in your home. Crafted from solid oak with a sleek black finish, this side table features a round tabletop and a lower shelf for additional storage. Its minimalist design makes it easy to integrate into various interior styles.',
      price: 149,
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=800&fit=crop',
      ],
      category: 'Tables',
      material: 'Oak',
      color: 'Black',
      specifications: [
        { label: 'Dimensions', value: '20" W x 20" D x 24" H' },
        { label: 'Material', value: 'Solid oak wood' },
        { label: 'Weight', value: '25 lbs' },
        { label: 'Finish', value: 'Black stain' },
        { label: 'Assembly', value: 'Easy assembly' },
      ],
      stock: 20,
      rating: 4.4,
      reviews: 18,
    },
    {
      id: '5',
      name: 'The Redwood Dining Table',
      description: 'Spacious dining table for family gatherings',
      fullDescription:
        'The Redwood Dining Table is designed for memorable family gatherings. This spacious table is crafted from premium walnut wood with a rich brown finish. The solid construction ensures stability and durability, while the elegant design adds sophistication to your dining room. Seats up to 8 people comfortably.',
      price: 599,
      image:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&h=800&fit=crop',
      ],
      category: 'Tables',
      material: 'Walnut',
      color: 'Brown',
      specifications: [
        { label: 'Dimensions', value: '72" W x 36" D x 30" H' },
        { label: 'Material', value: 'Solid walnut wood' },
        { label: 'Weight', value: '95 lbs' },
        { label: 'Seating Capacity', value: '6-8 people' },
        { label: 'Assembly', value: 'Assembly required' },
      ],
      stock: 6,
      rating: 4.9,
      reviews: 35,
    },
    {
      id: '6',
      name: 'The Pine Bookshelf',
      description: 'Tall bookshelf with adjustable shelves',
      fullDescription:
        'The Pine Bookshelf offers ample storage space for your book collection and decorative items. Made from solid oak with a clean white finish, this tall bookshelf features five adjustable shelves that can be customized to fit items of various sizes. The sturdy construction ensures it can hold heavy books with ease.',
      price: 449,
      image:
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop',
      ],
      category: 'Storage',
      material: 'Oak',
      color: 'White',
      specifications: [
        { label: 'Dimensions', value: '36" W x 14" D x 72" H' },
        { label: 'Material', value: 'Solid oak wood' },
        { label: 'Weight', value: '75 lbs' },
        { label: 'Shelves', value: '5 adjustable shelves' },
        { label: 'Assembly', value: 'Assembly required' },
      ],
      stock: 10,
      rating: 4.7,
      reviews: 19,
    },
    {
      id: '7',
      name: 'The Maple Lounge Chair',
      description: 'Comfortable lounge chair with ottoman',
      fullDescription:
        'The Maple Lounge Chair is the ultimate relaxation piece. This comfortable lounge chair comes with a matching ottoman, both crafted from solid maple wood with a warm brown finish. The ergonomic design and plush cushioning provide exceptional comfort, making it perfect for reading, watching TV, or simply unwinding after a long day.',
      price: 529,
      image:
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=800&fit=crop',
      ],
      category: 'Chairs',
      material: 'Maple',
      color: 'Brown',
      specifications: [
        { label: 'Dimensions', value: '32" W x 35" D x 40" H' },
        { label: 'Material', value: 'Solid maple wood with cushions' },
        { label: 'Weight', value: '65 lbs' },
        { label: 'Includes', value: 'Matching ottoman' },
        { label: 'Assembly', value: 'Minimal assembly required' },
      ],
      stock: 7,
      rating: 4.8,
      reviews: 24,
    },
    {
      id: '8',
      name: 'The Oak Sectional',
      description: 'Large sectional sofa for spacious living rooms',
      fullDescription:
        'The Oak Sectional is designed for those who love to entertain. This large sectional sofa features a modular design that can be configured to fit your space perfectly. Crafted from solid oak with a sophisticated black finish, it offers ample seating for family and guests. The deep cushions and sturdy frame ensure both comfort and durability.',
      price: 1299,
      image:
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop',
      ],
      category: 'Sofas',
      material: 'Oak',
      color: 'Black',
      specifications: [
        { label: 'Dimensions', value: '120" W x 85" D x 32" H' },
        { label: 'Material', value: 'Solid oak frame with fabric upholstery' },
        { label: 'Weight', value: '185 lbs' },
        { label: 'Seating Capacity', value: '5-6 people' },
        { label: 'Assembly', value: 'Professional assembly recommended' },
      ],
      stock: 4,
      rating: 4.9,
      reviews: 42,
    },
  ];
}

export async function getRelatedProducts(
  productId: string,
  category: string
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const allProducts = await getAllProducts();
  return allProducts
    .filter((p) => p.id !== productId && p.category === category)
    .slice(0, 4);
}
