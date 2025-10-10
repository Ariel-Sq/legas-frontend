# Ecommerce Frontend

A modern, responsive ecommerce frontend built with Next.js for furniture and home decor products. Features a complete shopping experience with product catalog, shopping cart, user authentication, admin panel, and multi-language support.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

- **Product Catalog**: Browse furniture and home decor products with detailed information
- **Shopping Cart**: Add, remove, and manage cart items with persistent storage
- **User Authentication**: Sign up, login, and manage user profiles
- **Checkout Process**: Complete order flow with order confirmation
- **Admin Panel**: Manage products, categories, and orders
- **Wishlist**: Save favorite products for later
- **Multi-language Support**: English and Spanish translations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**

   \`\`\`bash
   git clone https://github.com/your-username/ecommerce-frontend.git
   cd ecommerce-frontend
   \`\`\`

2. **Install dependencies**

   \`\`\`bash
   pnpm install
   \`\`\`

3. **Run the development server**

   \`\`\`bash
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin panel pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order history
│   ├── product/           # Product detail pages
│   ├── profile/           # User profile
│   ├── shop/              # Product catalog
│   └── wishlist/          # Wishlist page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix UI)
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and data
│   ├── translations/     # Multi-language support
│   └── ...               # API functions, types, etc.
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## 📱 Pages

- **Home** (`/`): Hero section, featured products, new arrivals
- **Shop** (`/shop`): Product catalog with filters and search
- **Product Details** (`/product/[id]`): Detailed product view with gallery
- **Cart** (`/cart`): Shopping cart management
- **Checkout** (`/checkout`): Order checkout process
- **Profile** (`/profile`): User account management
- **Orders** (`/orders`): Order history and tracking
- **Wishlist** (`/wishlist`): Saved products
- **Admin** (`/admin`): Product and category management

## 🎨 Components

The application uses a component-based architecture with reusable UI components:

- **Header/Navigation**: Site navigation with cart and user menu
- **Product Cards**: Display products in grid/list layouts
- **Filters**: Category, price, and material filters
- **Forms**: Login, registration, and checkout forms
- **Modals/Dialogs**: Product quick view, cart confirmation
- **Admin Tables**: Data tables for managing products and orders

## 🌐 Multi-language Support

The application supports English and Spanish with translation files in `lib/translations/`. Language switching is available in the header.

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🚀 Deployment

The application is configured for deployment on Vercel with automatic deployments from the main branch.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js and modern web technologies.
