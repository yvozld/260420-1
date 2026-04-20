import React, { createContext, useContext, useState, ReactNode } from 'react';

// Data shapes
export interface Car {
  id: string;
  name: string;
  type: string;
  pricePerDay: number;
  imageUrl: string;
  features: string[];
  linkUrl?: string;
  linkTarget?: '_blank' | '_self';
}

export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'notice' | 'event';
}

export interface MenuNamesState {
  cars: string;
  pricing: string;
  posts: string;
}

export interface TextVisibilityState {
  carSectionTitle: boolean;
  carType: boolean;
  carName: boolean;
  carPrice: boolean;
  carMoreButton: boolean;
  postSectionTitle: boolean;
  postCategoryLabel: boolean;
  postTitle: boolean;
  postContent: boolean;
  postDate: boolean;
  postMoreButton: boolean;
  pricingSectionTitle: boolean;
  pricingCompanyName: boolean;
  pricingCarCount: boolean;
  pricingInsurance: boolean;
  pricingRating: boolean;
  pricingPrice: boolean;
}

export interface SectionsState {
  header: boolean;
  banner: boolean;
  carList: boolean;
  priceComparison: boolean;
  posts: boolean;
  footer: boolean;
}

export interface ThemeState {
  accentColor: string;
  fontFamily: string;
}

export interface ContentState {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  aboutText: string;
  headerLogoRegular: string;
  headerLogoHighlight: string;
  headerButtonText: string;
  footerCompanyName: string;
  footerCompanyInfo: string;
  footerCopyright: string;
}

export interface PricingItem {
  id: string;
  company: string;
  carCount: string;
  insurance: string;
  rating: string;
  price: string;
}

export interface AppState {
  adminPassword?: string;
  theme: ThemeState;
  menuNames: MenuNamesState;
  textVisibility: TextVisibilityState;
  sections: SectionsState;
  content: ContentState;
  cars: Car[];
  posts: Post[];
  pricingItems: PricingItem[];
}

interface AppContextType {
  state: AppState;
  updateAdminPassword: (password: string) => void;
  updateTheme: (theme: Partial<ThemeState>) => void;
  updateMenuName: (key: keyof MenuNamesState, name: string) => void;
  updateTextVisibility: (visibility: Partial<TextVisibilityState>) => void;
  updateSections: (sections: Partial<SectionsState>) => void;
  updateContent: (content: Partial<ContentState>) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  addCar: (car: Car) => void;
  deleteCar: (id: string) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  updatePricingItem: (id: string, item: Partial<PricingItem>) => void;
  addPricingItem: (item: PricingItem) => void;
  deletePricingItem: (id: string) => void;
}

const mockCars: Car[] = [
  {
    id: '1',
    name: '제네시스 G80',
    type: '대형 세단',
    pricePerDay: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1616422285623-14bf73df2ec7?auto=format&fit=crop&q=80&w=800',
    features: ['오토매틱', '5인승', '가솔린', '프리미엄 사운드'],
  },
  {
    id: '2',
    name: '포르쉐 타이칸',
    type: '스포츠 전기차',
    pricePerDay: 350000,
    imageUrl: 'https://images.unsplash.com/photo-1503376760367-1583d73b0270?auto=format&fit=crop&q=80&w=800',
    features: ['오토매틱', '4인승', '전기', '제로백 2.8초'],
  },
  {
    id: '3',
    name: '메르세데스-벤츠 S-Class',
    type: '프리미엄 세단',
    pricePerDay: 400000,
    imageUrl: 'https://images.unsplash.com/photo-1622200294736-2287a9d020d2?auto=format&fit=crop&q=80&w=800',
    features: ['오토매틱', '5인승', '가솔린', 'VIP 시트'],
  },
  {
    id: '4',
    name: '테슬라 모델 Y',
    type: '중형 SUV',
    pricePerDay: 130000,
    imageUrl: 'https://images.unsplash.com/photo-1617711466035-7cda2cd6461a?auto=format&fit=crop&q=80&w=800',
    features: ['오토매틱', '5인승', '전기', '오토파일럿'],
  }
];

const mockPosts: Post[] = [
  { id: '1', title: '봄맞이 전 차종 10% 할인이벤트', content: '봄을 맞이하여...', date: '2026-03-01', type: 'event' },
  { id: '2', title: '신규 프리미엄 차량 입고 안내', content: '포르쉐, 벤츠 신형 모델 입고...', date: '2026-04-15', type: 'notice' },
];

const initialState: AppState = {
  adminPassword: '0852',
  theme: {
    accentColor: '#6B21A8',
    fontFamily: 'Pretendard Variable',
  },
  menuNames: {
    cars: '차량 안내',
    pricing: '가격비교',
    posts: '고객센터'
  },
  textVisibility: {
    carSectionTitle: true,
    carType: true,
    carName: true,
    carPrice: true,
    carMoreButton: true,
    postSectionTitle: true,
    postCategoryLabel: true,
    postTitle: true,
    postContent: true,
    postDate: true,
    postMoreButton: true,
    pricingSectionTitle: true,
    pricingCompanyName: true,
    pricingCarCount: true,
    pricingInsurance: true,
    pricingRating: true,
    pricingPrice: true,
  },
  sections: {
    header: true,
    banner: true,
    carList: true,
    priceComparison: true,
    posts: true,
    footer: true,
  },
  content: {
    bannerTitle: '프리미엄 렌트카의 새로운 기준',
    bannerSubtitle: 'RentCarAI에서 최상의 차량과 최적의 가격을 경험하세요.',
    bannerImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1600',
    aboutText: 'RentCarAI는 고객님의 특별한 여정을 위해 최고급 차량만을 엄선하여 제공합니다.',
    headerLogoRegular: 'RentCar',
    headerLogoHighlight: 'AI',
    headerButtonText: '예약확인',
    footerCompanyName: 'RentCarAI',
    footerCompanyInfo: '(주) 렌트카에이아이 | 대표: 홍길동 | 사업자등록번호: 123-45-67890',
    footerCopyright: 'Copyright © 2026 RentCarAI Inc. All rights reserved.',
  },
  cars: mockCars,
  posts: mockPosts,
  pricingItems: [
    { id: '1', company: 'RentCarAI 직영', carCount: '포르쉐 등 45대', insurance: '완전면책 포함', rating: '⭐ 4.9', price: '85,200원~' },
    { id: '2', company: '퍼플 모빌리티', carCount: 'SUV 등 30대', insurance: '일반면책', rating: '⭐ 4.7', price: '79,000원~' },
  ]
};

const LOCAL_STORAGE_KEY = 'rentCarAppState';

const getInitialState = (): AppState => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load state from local storage", e);
  }
  return initialState;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(getInitialState);

  const updateAdminPassword = (password: string) => setState(prev => ({ ...prev, adminPassword: password }));
  const updateTheme = (theme: Partial<ThemeState>) => setState(prev => ({ ...prev, theme: { ...prev.theme, ...theme } }));
  const updateMenuName = (key: keyof MenuNamesState, name: string) => setState(prev => ({ ...prev, menuNames: { ...prev.menuNames, [key]: name } }));
  const updateTextVisibility = (visibility: Partial<TextVisibilityState>) => setState(prev => ({ ...prev, textVisibility: { ...prev.textVisibility, ...visibility } }));
  const updateSections = (sections: Partial<SectionsState>) => setState(prev => ({ ...prev, sections: { ...prev.sections, ...sections } }));
  const updateContent = (content: Partial<ContentState>) => setState(prev => ({ ...prev, content: { ...prev.content, ...content } }));
  
  const updateCar = (id: string, car: Partial<Car>) => setState(prev => ({
    ...prev, cars: prev.cars.map(c => c.id === id ? { ...c, ...car } : c)
  }));
  const addCar = (car: Car) => setState(prev => ({ ...prev, cars: [...prev.cars, car] }));
  const deleteCar = (id: string) => setState(prev => ({ ...prev, cars: prev.cars.filter(c => c.id !== id) }));
  
  const addPost = (post: Post) => setState(prev => ({ ...prev, posts: [...prev.posts, post] }));
  const updatePost = (id: string, post: Partial<Post>) => setState(prev => ({
    ...prev, posts: prev.posts.map(p => p.id === id ? { ...p, ...post } : p)
  }));
  const deletePost = (id: string) => setState(prev => ({ ...prev, posts: prev.posts.filter(p => p.id !== id) }));

  const addPricingItem = (item: PricingItem) => setState(prev => ({ ...prev, pricingItems: [...prev.pricingItems, item] }));
  const updatePricingItem = (id: string, item: Partial<PricingItem>) => setState(prev => ({
    ...prev, pricingItems: prev.pricingItems.map(p => p.id === id ? { ...p, ...item } : p)
  }));
  const deletePricingItem = (id: string) => setState(prev => ({ ...prev, pricingItems: prev.pricingItems.filter(p => p.id !== id) }));

  return (
    <AppContext.Provider value={{ state, updateAdminPassword, updateTheme, updateMenuName, updateTextVisibility, updateSections, updateContent, updateCar, addCar, deleteCar, addPost, updatePost, deletePost, addPricingItem, updatePricingItem, deletePricingItem }}>
      {/* Dynamic theme style injection */}
      <style>{`:root { --theme-accent: ${state.theme.accentColor}; --font-sans: "${state.theme.fontFamily.replace(/"/g, '')}", Pretendard, sans-serif; }`}</style>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
