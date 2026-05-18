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

export async function getCompanyInfo(): Promise<CompanyInfo> {
  return {
    name: 'Woodland',
    tagline: 'Creando muebles atemporales desde 1995',
    foundedYear: 1995,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  return {
    title: 'Sobre Woodland',
    subtitle: 'Creando muebles atemporales desde 1995',
    workshopImage:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=600&fit=crop',
    paragraphs: [
      'En Woodland creemos que un mueble es mucho más que un objeto funcional. Cada pieza que fabricamos cuenta una historia de oficio, dedicación y un profundo respeto por los materiales nobles.',
      'Empezamos en un pequeño taller, inspirados por la belleza de la madera natural y la idea de hacer muebles a mano que duraran generaciones. Hoy seguimos esa tradición, combinando técnicas artesanales con un diseño contemporáneo.',
      'Cada mueble lo arman artesanos con experiencia, que se enorgullecen de su trabajo. Usamos madera de bosques manejados de forma sostenible y terminaciones ecológicas para que cada pieza sea hermosa y, además, responsable con el ambiente.',
    ],
    statistics: [
      {
        label: 'Años de experiencia',
        value: '28+',
        description: 'Años de experiencia',
      },
      {
        label: 'Clientes felices',
        value: '5000+',
        description: 'Clientes felices',
      },
      {
        label: 'Materiales sostenibles',
        value: '100%',
        description: 'Materiales sostenibles',
      },
    ],
  };
}

export async function getContactInfo(): Promise<ContactInfo> {
  return {
    address: {
      street: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      state: 'CABA',
      zip: 'C1043',
    },
    phone: '+54 11 5555-1234',
    email: 'hola@woodland.com',
    businessHours: {
      weekdays: 'Lunes a Viernes: 9:00 a 18:00',
      saturday: 'Sábados: 10:00 a 14:00',
      sunday: 'Domingos: Cerrado',
    },
  };
}

export async function getFooterLinks(): Promise<FooterLinks[]> {
  return [
    { label: 'Política de Privacidad', href: '/privacy' },
    { label: 'Términos del Servicio', href: '/terms' },
    { label: 'Envíos & Devoluciones', href: '/shipping' },
  ];
}
