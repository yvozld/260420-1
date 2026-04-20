import React from 'react';
import { useAppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import { Car, ChevronRight, Check, Settings } from 'lucide-react';

export const FrontendPage = ({ isPreview = false }: { isPreview?: boolean }) => {
  const { state } = useAppContext();
  const { sections, content, cars } = state;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER */}
      {sections.header && (
        <header className="bg-white/90 backdrop-blur border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="text-accent w-6 h-6" />
              <span className="text-xl font-bold tracking-tight text-slate-900">{content.headerLogoRegular}<span className="text-slate-800">{content.headerLogoHighlight}</span></span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <a href="#cars" className="hover:text-accent transition-colors">{state.menuNames.cars}</a>
              <a href="#pricing" className="hover:text-accent transition-colors">{state.menuNames.pricing}</a>
              <a href="#news" className="hover:text-accent transition-colors">{state.menuNames.posts}</a>
              <span className="text-accent cursor-pointer">{content.headerButtonText}</span>
            </nav>
            {!isPreview && (
              <Link to="/admin" className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-full hover:bg-slate-200 transition-colors hidden sm:block">
                관리자 모드
              </Link>
            )}
          </div>
        </header>
      )}

      <main className="flex-grow">
        {/* HERO BANNER */}
        {sections.banner && (
          <section className="bg-slate-50 py-20 md:py-32 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                {content.bannerTitle}
              </h1>
              <p className="text-base text-slate-500 mb-8 max-w-2xl font-normal">
                {content.bannerSubtitle}
              </p>
              
              <div className="bg-white p-3 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-wrap md:flex-nowrap gap-4 w-fit px-8 z-10 items-center">
                <div className="text-left py-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-xs font-bold text-slate-900">제주국제공항</p>
                </div>
                <div className="w-[1px] h-8 bg-slate-100 hidden md:block"></div>
                <div className="text-left py-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
                  <p className="text-xs font-bold text-slate-900">24.06.01 - 24.06.03</p>
                </div>
                <a href="#cars" className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-accent-dark transition-colors ml-4 whitespace-nowrap">
                  검색
                </a>
              </div>

              {content.bannerImage && (
                <div className="mt-16 w-full max-w-5xl aspect-[21/9] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 border border-slate-100">
                  <img 
                    src={content.bannerImage} 
                    alt="Hero Banner" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'; }}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* CAR LIST */}
        {sections.carList && (
          <section id="cars" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-8 block md:flex text-center md:text-left">
                {state.textVisibility.carSectionTitle ? (
                  <h4 className="text-xl font-bold text-slate-900">{state.menuNames.cars}</h4> 
                ) : ( <div /> )}
                
                {state.textVisibility.carMoreButton && (
                  <span className="text-xs text-accent font-medium mt-4 md:mt-0 inline-block cursor-pointer">더보기 +</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map((car) => (
                  <div key={car.id} className="group cursor-pointer">
                    {car.linkUrl ? (
                      <a 
                        href={car.linkUrl} 
                        target={car.linkTarget || '_self'} 
                        rel={car.linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
                        className="block aspect-square bg-slate-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden w-[95vw] max-w-none relative left-1/2 -translate-x-1/2 md:w-full md:static md:translate-x-0 p-4 md:p-8"
                      >
                        <img 
                          src={car.imageUrl} 
                          alt={car.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'; }}
                        />
                      </a>
                    ) : (
                      <div className="aspect-square bg-slate-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden w-[95vw] max-w-none relative left-1/2 -translate-x-1/2 md:w-full md:static md:translate-x-0 p-4 md:p-8">
                        <img 
                          src={car.imageUrl} 
                          alt={car.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'; }}
                        />
                      </div>
                    )}
                    <div className="px-4 sm:px-0">
                      {state.textVisibility.carType && (
                        <p className="text-xs text-slate-400 mb-1">{car.type}</p>
                      )}
                      {state.textVisibility.carName && (
                        <p className="font-bold text-sm text-slate-900 mb-1">{car.name}</p>
                      )}
                      {state.textVisibility.carPrice && (
                        <p className="text-accent font-bold text-sm">
                          {car.pricePerDay.toLocaleString()}원 <span className="text-[10px] font-normal text-slate-400">/ 일</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* POSTS (NOTICE / EVENTS) */}
        {state.sections.posts && state.posts.length > 0 && (
          <section id="news" className="py-16 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-8 block md:flex text-center md:text-left">
                {state.textVisibility.postSectionTitle ? (
                  <h4 className="text-xl font-bold text-slate-900">{state.menuNames.posts}</h4>
                ) : ( <div /> )}
                {state.textVisibility.postMoreButton && (
                  <a href="#news" className="text-xs text-accent font-medium mt-4 md:mt-0 inline-block cursor-pointer">더보기 +</a>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
                {state.posts.slice(0, 4).map(post => (
                  <div key={post.id} className="p-6 bg-white rounded-none md:rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.02)] border-b md:border border-slate-100 cursor-pointer flex flex-col justify-between -mx-4 sm:-mx-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:mx-0 md:w-full">
                    <div>
                      <div className="flex gap-2 mb-3">
                        {state.textVisibility.postCategoryLabel && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${post.type === 'event' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-600'}`}>
                            {post.type === 'event' ? '이벤트' : '공지'}
                          </span>
                        )}
                        {state.textVisibility.postDate && (
                          <span className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center">{post.date}</span>
                        )}
                      </div>
                      {state.textVisibility.postTitle && (
                        <p className="font-bold text-sm text-slate-900 mb-1">{post.title}</p>
                      )}
                      {state.textVisibility.postContent && (
                        <div 
                          className="text-xs text-slate-500 whitespace-pre-wrap mt-2" 
                          dangerouslySetInnerHTML={{ __html: post.content }} 
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PRICE COMPARISON */}
        {sections.priceComparison && (
          <section id="pricing" className="py-16 md:py-24 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {state.textVisibility.pricingSectionTitle && (
                <h4 className="text-xl font-bold text-slate-900 mb-8">{state.menuNames.pricing}</h4>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="text-[10px] text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                    <tr>
                      {state.textVisibility.pricingCompanyName && <th className="py-3 font-medium">업체명</th>}
                      {state.textVisibility.pricingCarCount && <th className="py-3 font-medium">보유차량</th>}
                      {state.textVisibility.pricingInsurance && <th className="py-3 font-medium">보험조건</th>}
                      {state.textVisibility.pricingRating && <th className="py-3 font-medium">평균 평점</th>}
                      {state.textVisibility.pricingPrice && <th className="py-3 font-medium text-right">최저가</th>}
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-700">
                    {state.pricingItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">등록된 가격 비교 데이터가 없습니다.</td>
                      </tr>
                    ) : (
                      state.pricingItems.map((item) => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          {state.textVisibility.pricingCompanyName && <td className="py-4 font-bold text-slate-900">{item.company}</td>}
                          {state.textVisibility.pricingCarCount && <td className="py-4 text-slate-600">{item.carCount}</td>}
                          {state.textVisibility.pricingInsurance && <td className="py-4 text-slate-600">{item.insurance}</td>}
                          {state.textVisibility.pricingRating && <td className="py-4">{item.rating}</td>}
                          {state.textVisibility.pricingPrice && <td className="py-4 text-right font-bold text-accent">{item.price}</td>}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      {sections.footer && (
        <footer className="p-8 md:px-12 bg-slate-900 text-slate-500 text-[10px] sm:text-xs">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 border-b border-slate-800 pb-8">
              <div className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Car className="w-4 h-4 text-accent" />
                {content.footerCompanyName}
              </div>
              <div className="flex gap-4">
                <span className="cursor-pointer hover:text-white transition-colors">이용약관</span>
                <span className="cursor-pointer hover:text-white transition-colors">개인정보처리방침</span>
              </div>
            </div>
            
            <p className="mb-2">{content.footerCompanyInfo}</p>
            <p className="mt-2">{content.footerCopyright}</p>
          </div>
        </footer>
      )}

      {/* FLOATING OR BOTTOM ADMIN BUTTON (If Header is hidden) */}
      {!sections.header && !isPreview && (
        <div className="py-6 px-4 bg-slate-50 flex justify-start border-t border-slate-200">
           <Link to="/admin" className="p-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center">
             <Settings className="w-5 h-5" />
           </Link>
        </div>
      )}
    </div>
  );
};
