import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import property4 from '@/assets/property-4.jpg';

export interface Property {
  id: string;
  image: string;
  title: string;
  titleBn: string;
  location: string;
  locationBn: string;
  price: string;
  priceBn: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  type: 'sale' | 'rent' | 'project';
  status?: 'ready' | 'under-construction' | 'upcoming';
  featured?: boolean;
  description?: string;
  descriptionBn?: string;
  amenities?: string[];
  isOurProject?: boolean;
}

export const properties: Property[] = [
  {
    id: '1',
    image: property1,
    title: 'Luxury Villa with Pool',
    titleBn: 'সুইমিং পুল সহ বিলাসবহুল ভিলা',
    location: 'Gulshan, Dhaka',
    locationBn: 'গুলশান, ঢাকা',
    price: '৳ 15 Crore',
    priceBn: '৳ ১৫ কোটি',
    bedrooms: 5,
    bathrooms: 6,
    area: '8,500 sqft',
    type: 'sale',
    status: 'ready',
    featured: true,
    isOurProject: true,
    amenities: ['Swimming Pool', 'Garden', 'Gym', 'Parking', 'Security'],
  },
  {
    id: '2',
    image: property2,
    title: 'Modern Penthouse with City View',
    titleBn: 'সিটি ভিউ সহ আধুনিক পেন্টহাউস',
    location: 'Banani, Dhaka',
    locationBn: 'বনানী, ঢাকা',
    price: '৳ 8.5 Crore',
    priceBn: '৳ ৮.৫ কোটি',
    bedrooms: 4,
    bathrooms: 4,
    area: '4,200 sqft',
    type: 'sale',
    status: 'ready',
    featured: true,
    isOurProject: true,
    amenities: ['Rooftop Access', 'Smart Home', 'Parking', 'Gym'],
  },
  {
    id: '3',
    image: property3,
    title: 'Contemporary Townhouse',
    titleBn: 'সমসাময়িক টাউনহাউস',
    location: 'Uttara, Dhaka',
    locationBn: 'উত্তরা, ঢাকা',
    price: '৳ 3.2 Crore',
    priceBn: '৳ ৩.২ কোটি',
    bedrooms: 4,
    bathrooms: 3,
    area: '2,800 sqft',
    type: 'sale',
    status: 'under-construction',
    featured: false,
    isOurProject: false,
    amenities: ['Garden', 'Parking', 'Security'],
  },
  {
    id: '4',
    image: property4,
    title: 'Commercial Office Space',
    titleBn: 'কমার্শিয়াল অফিস স্পেস',
    location: 'Motijheel, Dhaka',
    locationBn: 'মতিঝিল, ঢাকা',
    price: '৳ 1.5 Lakh/month',
    priceBn: '৳ ১.৫ লাখ/মাস',
    area: '3,500 sqft',
    type: 'rent',
    status: 'ready',
    featured: true,
    isOurProject: false,
    amenities: ['Elevator', 'Parking', '24/7 Security', 'Generator'],
  },
  {
    id: '5',
    image: property1,
    title: 'Green Valley Apartments',
    titleBn: 'গ্রিন ভ্যালি অ্যাপার্টমেন্ট',
    location: 'Bashundhara, Dhaka',
    locationBn: 'বসুন্ধরা, ঢাকা',
    price: '৳ 1.8 Crore',
    priceBn: '৳ ১.৮ কোটি',
    bedrooms: 3,
    bathrooms: 3,
    area: '1,650 sqft',
    type: 'project',
    status: 'under-construction',
    featured: true,
    isOurProject: true,
    amenities: ['Community Hall', 'Playground', 'Gym', 'Parking'],
  },
  {
    id: '6',
    image: property2,
    title: 'Executive Apartment for Rent',
    titleBn: 'ভাড়ার জন্য এক্সিকিউটিভ অ্যাপার্টমেন্ট',
    location: 'Dhanmondi, Dhaka',
    locationBn: 'ধানমন্ডি, ঢাকা',
    price: '৳ 75,000/month',
    priceBn: '৳ ৭৫,০০০/মাস',
    bedrooms: 3,
    bathrooms: 2,
    area: '1,800 sqft',
    type: 'rent',
    status: 'ready',
    featured: false,
    isOurProject: false,
    amenities: ['Furnished', 'Parking', 'Security', 'Generator'],
  },
];

export const developmentProjects = [
  {
    id: 'dev-1',
    name: 'Skyline Towers',
    nameBn: 'স্কাইলাইন টাওয়ার্স',
    location: 'Gulshan, Dhaka',
    locationBn: 'গুলশান, ঢাকা',
    status: 'ongoing',
    progress: 65,
    units: 120,
    completionDate: '2025',
    image: property4,
  },
  {
    id: 'dev-2',
    name: 'Green Heights',
    nameBn: 'গ্রিন হাইটস',
    location: 'Bashundhara, Dhaka',
    locationBn: 'বসুন্ধরা, ঢাকা',
    status: 'upcoming',
    progress: 0,
    units: 80,
    completionDate: '2026',
    image: property1,
  },
  {
    id: 'dev-3',
    name: 'Pearl Residences',
    nameBn: 'পার্ল রেসিডেন্সেস',
    location: 'Banani, Dhaka',
    locationBn: 'বনানী, ঢাকা',
    status: 'completed',
    progress: 100,
    units: 45,
    completionDate: '2023',
    image: property2,
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Rafiqul Islam',
    nameBn: 'রফিকুল ইসলাম',
    role: 'Business Owner',
    roleBn: 'ব্যবসায়ী',
    content: 'BanglaProperty helped me find my dream home in Gulshan. Their professional service and attention to detail made the entire process smooth and hassle-free.',
    contentBn: 'বাংলাপ্রপার্টি আমাকে গুলশানে আমার স্বপ্নের বাড়ি খুঁজে পেতে সাহায্য করেছে। তাদের পেশাদার সেবা এবং বিস্তারিত মনোযোগ পুরো প্রক্রিয়াটি মসৃণ এবং ঝামেলামুক্ত করেছে।',
    rating: 5,
  },
  {
    id: '2',
    name: 'Fatima Rahman',
    nameBn: 'ফাতিমা রহমান',
    role: 'Doctor',
    roleBn: 'চিকিৎসক',
    content: 'I sold my property through BanglaProperty and was amazed by their market knowledge and negotiation skills. Got a great price for my apartment!',
    contentBn: 'আমি বাংলাপ্রপার্টির মাধ্যমে আমার সম্পত্তি বিক্রি করেছি এবং তাদের বাজার জ্ঞান এবং আলোচনার দক্ষতায় অবাক হয়েছি। আমার অ্যাপার্টমেন্টের জন্য দুর্দান্ত দাম পেয়েছি!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Karim Ahmed',
    nameBn: 'করিম আহমেদ',
    role: 'IT Professional',
    roleBn: 'আইটি পেশাদার',
    content: 'The best real estate platform in Bangladesh. Easy to use, transparent pricing, and excellent customer support. Highly recommended!',
    contentBn: 'বাংলাদেশের সেরা রিয়েল এস্টেট প্ল্যাটফর্ম। ব্যবহার করা সহজ, স্বচ্ছ মূল্য এবং চমৎকার গ্রাহক সহায়তা। অত্যন্ত সুপারিশ করা হয়!',
    rating: 5,
  },
];
