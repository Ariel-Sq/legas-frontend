// Company information and content

export interface CompanyInfo {
  name: string;
  tagline: string;
  foundedYear: number;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  workshopImage: string;
  paragraphs: string[];
  statistics: {
    label: string;
    value: string;
    description: string;
  }[];
}

export interface ContactInfo {
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface FooterLinks {
  label: string;
  href: string;
}

// Simulate async data fetching
const delay = () => new Promise((resolve) => setTimeout(resolve, 100));

export async function getCompanyInfo(): Promise<CompanyInfo> {
  await delay();
  return {
    name: 'Woodland',
    tagline: 'Crafting timeless furniture pieces since 1995',
    foundedYear: 1995,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  await delay();
  return {
    title: 'About Woodland',
    subtitle: 'Crafting timeless furniture pieces since 1995',
    workshopImage:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=600&fit=crop',
    paragraphs: [
      'At Woodland, we believe that furniture is more than just functional pieces. Each item we create tells a story of craftsmanship, dedication, and a deep respect for natural materials.',
      'Our journey began in a small workshop where our founder, inspired by the beauty of natural wood, started creating handcrafted furniture. Today, we continue that tradition, combining time-honored techniques with modern design sensibilities.',
      'Every piece of furniture is carefully crafted by skilled artisans who take pride in their work. We source our wood from sustainable forests and use eco-friendly finishes to ensure that our furniture is not only beautiful but also environmentally responsible.',
    ],
    statistics: [
      {
        label: 'Years of Experience',
        value: '28+',
        description: 'Years of Experience',
      },
      {
        label: 'Happy Customers',
        value: '5000+',
        description: 'Happy Customers',
      },
      {
        label: 'Sustainable Materials',
        value: '100%',
        description: 'Sustainable Materials',
      },
    ],
  };
}

export async function getContactInfo(): Promise<ContactInfo> {
  await delay();
  return {
    address: {
      street: '123 Woodland Avenue',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
    },
    phone: '+1 (555) 123-4567',
    email: 'hello@woodland.com',
    businessHours: {
      weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
      saturday: 'Saturday: 10:00 AM - 4:00 PM',
      sunday: 'Sunday: Closed',
    },
  };
}

export async function getFooterLinks(): Promise<FooterLinks[]> {
  await delay();
  return [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Shipping & Returns', href: '/shipping' },
  ];
}
