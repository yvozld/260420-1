import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { FrontendPage } from './FrontendPage';
import { Link } from 'react-router-dom';
import { 
  LayoutTemplate, 
  Palette, 
  Type, 
  Save, 
  ArrowLeft, 
  CarTaxiFront, 
  Trash2,
  FileText,
  Plus,
  Shield,
  Eye,
  ImagePlus,
  X,
  CreditCard
} from 'lucide-react';

export const AdminPage = () => {
  const { state, updateSections, updateTheme, updateMenuName, updateTextVisibility, updateContent, updateCar, deleteCar, addPost, updatePost, deletePost, updateAdminPassword, updatePricingItem, addPricingItem, deletePricingItem } = useAppContext();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState('sections');
  
  // Theme Form State
  const [accentColor, setAccentColor] = useState(state.theme.accentColor);
  
  // Content Form State
  // Removed local state for real-time update

  // Security Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');

  const handleGlobalSave = () => {
    try {
      localStorage.setItem('rentCarAppState', JSON.stringify(state));
      alert('현재 설정된 모든 디자인 및 데이터가 성공적으로 메인 화면으로 저장되었습니다!');
    } catch (e) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === state.adminPassword) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSaveTheme = () => {
    updateTheme({ accentColor });
    alert('테마 설정이 저장되었습니다.');
  };

  const handleSavePassword = () => {
    if (newPassword === '') {
      setSecurityMessage('비밀번호를 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    updateAdminPassword(newPassword);
    setSecurityMessage('비밀번호가 성공적으로 변경되었습니다.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecurityMessage(''), 3000);
  };

  const handleImageUpload = (carId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             // WebP or JPG compression is much smaller than png
             const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
             updateCar(carId, { imageUrl: compressedBase64 });
          } else {
             updateCar(carId, { imageUrl: reader.result as string });
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] border border-slate-100 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">관리자 로그인</h2>
          <p className="text-slate-500 text-sm text-center mb-6">관리자 페이지에 접근하려면 비밀번호를 입력하세요.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded text-sm focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
            {loginError && <p className="text-rose-500 text-xs font-medium text-center">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-accent text-white font-bold rounded hover:bg-accent-dark transition-colors">
              입장하기
            </button>
          </form>
          <div className="mt-6 text-center">
             <Link to="/" className="text-slate-400 text-xs hover:text-slate-600 transition-colors">메인 페이지로 돌아가기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex font-sans overflow-hidden">
      
      {/* 1. LEFT NARROW NAV PANEL */}
      <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col flex-shrink-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="font-bold text-lg text-slate-900">Admin Panel</div>
          <Link to="/" className="text-slate-400 hover:text-accent transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <button onClick={() => setActiveTab('sections')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'sections' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutTemplate className="w-5 h-5" /> 섹션 관리
          </button>
          <button onClick={() => setActiveTab('theme')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'theme' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Palette className="w-5 h-5" /> 테마 설정
          </button>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Type className="w-5 h-5" /> 헤더/배너 콘텐츠
          </button>
          <button onClick={() => setActiveTab('cars')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'cars' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}>
            <CarTaxiFront className="w-5 h-5" /> {state.menuNames.cars} 관리
          </button>
          <button onClick={() => setActiveTab('posts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'posts' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}>
            <FileText className="w-5 h-5" /> {state.menuNames.posts} 관리
          </button>
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'pricing' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}>
            <CreditCard className="w-5 h-5" /> {state.menuNames.pricing} 관리
          </button>
          <div className="my-4 border-t border-slate-100"></div>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors mb-4 ${activeTab === 'security' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Shield className="w-5 h-5" /> 계정 및 보안
          </button>
          <button onClick={handleGlobalSave} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-bold rounded shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            <Save className="w-5 h-5" /> 전체 설정 저장
          </button>
        </nav>
      </aside>

      {/* 2. MIDDLE SETTINGS PANEL */}
      <main className="w-[450px] bg-slate-50/50 border-r border-slate-200 h-full overflow-y-auto flex-shrink-0 relative z-10">
        <div className="p-6">
          
          {/* SECIONS TAB */}
          {activeTab === 'sections' && (
            <div className="bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-900">섹션 노출 관리</h2>
                <p className="text-slate-500 mt-1 text-xs">우측 미리보기 화면에서 실시간으로 확인하세요.</p>
              </div>
              <div className="p-5 space-y-3">
                {Object.entries(state.sections).map(([key, value]) => {
                  const sectionNames: Record<string, string> = {
                    header: '헤더 (상단 메뉴바)',
                    banner: '메인 배너',
                    carList: '차량 안내 (차량 목록)',
                    priceComparison: '가격비교 (테이블)',
                    posts: '고객센터 (공지/이벤트)',
                    footer: '푸터 (하단 정보)'
                  };
                  return (
                  <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 rounded border border-slate-100">
                    <div>
                      <div className="font-bold text-sm text-slate-700">{sectionNames[key] || key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={value}
                        onChange={(e) => updateSections({ [key]: e.target.checked })}
                      />
                      {/* Note: bg-slate-200 when inactive, bg-slate-800 when active */}
                      <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800 focus:ring-2 focus:ring-slate-800/50 outline-none shadow-inner"></div>
                    </label>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* THEME TAB */}
          {activeTab === 'theme' && (
             <div className="bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-900">디자인 커스터마이징</h2>
                <p className="text-slate-500 mt-1 text-xs">포인트 색상을 변경하고 저장해보세요.</p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Accent Color</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border border-slate-200"
                    />
                    <input 
                      type="text" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 bg-slate-50 rounded text-sm focus:ring-2 focus:ring-accent outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button onClick={handleSaveTheme} className="w-full flex justify-center items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium rounded hover:bg-slate-800 transition-colors text-sm">
                    <Save className="w-4 h-4" /> 적용하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === 'content' && (
             <div className="bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-900">웹사이트 콘텐츠 화면 관리</h2>
                <p className="text-slate-500 mt-1 text-xs">헤더, 메인배너, 푸터의 텍스트가 실시간으로 반영됩니다.</p>
              </div>
              <div className="p-5 space-y-6">
                {/* HEADER SECTION */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">헤더 설정</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">로고 기본 텍스트</label>
                      <input 
                        type="text" 
                        value={state.content.headerLogoRegular}
                        onChange={(e) => updateContent({ headerLogoRegular: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">로고 포인트 텍스트</label>
                      <input 
                        type="text" 
                        value={state.content.headerLogoHighlight}
                        onChange={(e) => updateContent({ headerLogoHighlight: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">우측 상단 버튼 텍스트</label>
                    <input 
                      type="text" 
                      value={state.content.headerButtonText}
                      onChange={(e) => updateContent({ headerButtonText: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                </div>

                {/* BANNER SECTION */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">메인 배너 설정</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">메인 타이틀</label>
                    <input 
                      type="text" 
                      value={state.content.bannerTitle}
                      onChange={(e) => updateContent({ bannerTitle: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">서브 타이틀</label>
                    <textarea 
                      value={state.content.bannerSubtitle}
                      onChange={(e) => updateContent({ bannerSubtitle: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">배경 이미지 URL</label>
                    <input 
                      type="text" 
                      value={state.content.bannerImage}
                      onChange={(e) => updateContent({ bannerImage: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none mb-2"
                    />
                    {state.content.bannerImage && (
                      <img 
                        src={state.content.bannerImage} 
                        alt="Preview" 
                        className="w-full h-24 object-cover rounded border border-slate-200" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'; }}
                      />
                    )}
                  </div>
                </div>

                {/* FOOTER SECTION */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">푸터(하단) 설정</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">브랜드명</label>
                    <input 
                      type="text" 
                      value={state.content.footerCompanyName}
                      onChange={(e) => updateContent({ footerCompanyName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">회사 운영 정보 (대표자, 번호 등)</label>
                    <input 
                      type="text" 
                      value={state.content.footerCompanyInfo}
                      onChange={(e) => updateContent({ footerCompanyInfo: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">카피라이트 안내</label>
                    <input 
                      type="text" 
                      value={state.content.footerCopyright}
                      onChange={(e) => updateContent({ footerCopyright: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* CARS TAB */}
          {activeTab === 'cars' && (
             <div className="bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={state.menuNames.cars}
                    onChange={(e) => updateMenuName('cars', e.target.value)}
                    className="text-lg font-bold text-slate-900 border-b-2 border-dashed border-slate-300 focus:border-slate-500 outline-none bg-white p-0 hover:border-slate-400 transition-colors w-1/2"
                    title="클릭하여 메뉴 이름을 수정하세요"
                  />
                  <span className="text-[10px] text-white bg-slate-800 px-2 py-0.5 rounded-full whitespace-nowrap">메뉴명 수정</span>
                </div>
                <p className="text-slate-500 text-xs">선택된 차량 목록과 정보를 관리합니다.</p>
              </div>
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-3">화면 출력 텍스트 켜기/끄기 (클릭해서 화면에서 숨기세요)</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => updateTextVisibility({ carSectionTitle: !state.textVisibility.carSectionTitle })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${state.textVisibility.carSectionTitle ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400 line-through'}`}
                  >
                    메인 타이틀 {state.textVisibility.carSectionTitle ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                  <button 
                    onClick={() => updateTextVisibility({ carType: !state.textVisibility.carType })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${state.textVisibility.carType ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400 line-through'}`}
                  >
                    차종 {state.textVisibility.carType ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                  <button 
                    onClick={() => updateTextVisibility({ carName: !state.textVisibility.carName })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${state.textVisibility.carName ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400 line-through'}`}
                  >
                    차량 이름 {state.textVisibility.carName ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                  <button 
                    onClick={() => updateTextVisibility({ carPrice: !state.textVisibility.carPrice })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${state.textVisibility.carPrice ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400 line-through'}`}
                  >
                    가격 {state.textVisibility.carPrice ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                  <button 
                    onClick={() => updateTextVisibility({ carMoreButton: !state.textVisibility.carMoreButton })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${state.textVisibility.carMoreButton ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400 line-through'}`}
                  >
                    더보기 버튼 {state.textVisibility.carMoreButton ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {state.cars.map(car => (
                  <div key={car.id} className="p-3 bg-slate-50 border border-slate-100 rounded flex flex-col gap-3">
                    <img 
                      src={car.imageUrl} 
                      alt={car.name} 
                      className="w-full h-24 object-contain bg-white rounded border border-slate-200" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'; }}
                    />
                    <div className="space-y-2">
                       <input 
                          type="text" 
                          value={car.name}
                          onChange={(e) => updateCar(car.id, { name: e.target.value })}
                          className="font-bold text-sm text-slate-900 w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                        />
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={car.type}
                            onChange={(e) => updateCar(car.id, { type: e.target.value })}
                            className="text-xs text-slate-600 w-1/2 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                          />
                           <input 
                            type="number" 
                            value={car.pricePerDay}
                            onChange={(e) => updateCar(car.id, { pricePerDay: Number(e.target.value) })}
                            className="text-xs text-slate-600 w-1/2 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            value={car.imageUrl}
                            onChange={(e) => updateCar(car.id, { imageUrl: e.target.value })}
                            placeholder="이미지 URL"
                            className="flex-1 text-[10px] text-slate-500 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                          />
                          <label className="cursor-pointer p-1.5 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors flex justify-center items-center" title="직접 이미지 업로드">
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                              onChange={(e) => handleImageUpload(car.id, e)} 
                            />
                            <ImagePlus className="w-3.5 h-3.5 text-slate-600" />
                          </label>
                          <button onClick={() => deleteCar(car.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded border border-rose-100 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-2 items-center bg-white border border-slate-200 rounded px-2 py-1">
                          <input
                            type="text"
                            value={car.linkUrl || ''}
                            onChange={(e) => updateCar(car.id, { linkUrl: e.target.value })}
                            placeholder="클릭 시 이동할 링크 URL (선택사항)"
                            className="flex-1 text-[10px] text-slate-500 outline-none focus:text-slate-900"
                          />
                          <select
                            value={car.linkTarget || '_self'}
                            onChange={(e) => updateCar(car.id, { linkTarget: e.target.value as '_blank' | '_self' })}
                            className="text-[10px] outline-none border-l border-slate-100 pl-2 text-slate-600 focus:text-accent cursor-pointer"
                          >
                            <option value="_self">현재창</option>
                            <option value="_blank">새창</option>
                          </select>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
             <div className="bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <div className="flex flex-col gap-1 w-2/3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={state.menuNames.pricing}
                      onChange={(e) => updateMenuName('pricing', e.target.value)}
                      className="text-lg font-bold text-slate-900 border-b-2 border-dashed border-slate-300 focus:border-slate-500 outline-none bg-white p-0 hover:border-slate-400 transition-colors w-full"
                      title="클릭하여 메뉴 이름을 수정하세요"
                    />
                    <span className="text-[10px] text-white bg-slate-800 px-2 py-0.5 rounded-full whitespace-nowrap">메뉴명 수정</span>
                  </div>
                </div>
                <button 
                  onClick={() => addPricingItem({ id: Date.now().toString(), company: '새로운 업체', carCount: '0대', insurance: '조건 모름', rating: '⭐ 0.0', price: '0원~' })}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-xs font-medium whitespace-nowrap ml-4"
                >
                  새 업체 추가
                </button>
              </div>

              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-sm text-slate-800 mb-3">화면 텍스트 출력 관리</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'pricingSectionTitle', label: '상단 메뉴 제목' },
                    { key: 'pricingCompanyName', label: '업체명 표기' },
                    { key: 'pricingCarCount', label: '보유차량 표기' },
                    { key: 'pricingInsurance', label: '보험조건 표기' },
                    { key: 'pricingRating', label: '평균 평점 표기' },
                    { key: 'pricingPrice', label: '최저가 표기' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm gap-2">
                      <span className="text-[10px] font-bold text-slate-700">{label}</span>
                      <button 
                        onClick={() => updateTextVisibility({ [key as keyof TextVisibilityState]: !state.textVisibility[key as keyof TextVisibilityState] })}
                        className={`w-full py-1.5 flex justify-center items-center rounded transition-colors ${state.textVisibility[key as keyof TextVisibilityState] ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        {state.textVisibility[key as keyof TextVisibilityState] ? <Eye className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {state.pricingItems.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded flex flex-col gap-2 relative">
                     <button onClick={() => deletePricingItem(item.id)} className="absolute top-3 right-3 p-1 text-rose-500 hover:bg-rose-100 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                     </button>
                     <div className="space-y-2 pr-8">
                        <input 
                          type="text" 
                          value={item.company}
                          onChange={(e) => updatePricingItem(item.id, { company: e.target.value })}
                          className="font-bold text-sm text-slate-900 w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                          placeholder="업체명"
                        />
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={item.carCount}
                            onChange={(e) => updatePricingItem(item.id, { carCount: e.target.value })}
                            className="text-xs text-slate-600 w-1/2 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                            placeholder="보유차량"
                          />
                          <input 
                            type="text" 
                            value={item.insurance}
                            onChange={(e) => updatePricingItem(item.id, { insurance: e.target.value })}
                            className="text-xs text-slate-600 w-1/2 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                            placeholder="보험조건"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={item.rating}
                            onChange={(e) => updatePricingItem(item.id, { rating: e.target.value })}
                            className="text-xs text-slate-600 w-1/2 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                            placeholder="평균 평점"
                          />
                          <input 
                            type="text" 
                            value={item.price}
                            onChange={(e) => updatePricingItem(item.id, { price: e.target.value })}
                            className="text-xs text-accent font-bold w-1/2 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent"
                            placeholder="최저가"
                          />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POSTS TAB */}
          {activeTab === 'posts' && (
             <div className="bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <div className="flex flex-col gap-1 w-2/3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={state.menuNames.posts}
                      onChange={(e) => updateMenuName('posts', e.target.value)}
                      className="text-lg font-bold text-slate-900 border-b-2 border-dashed border-slate-300 focus:border-slate-500 outline-none bg-white p-0 hover:border-slate-400 transition-colors w-full"
                      title="클릭하여 메뉴 이름을 수정하세요"
                    />
                    <span className="text-[10px] text-white bg-slate-800 px-2 py-0.5 rounded-full whitespace-nowrap">메뉴명 수정</span>
                  </div>
                </div>
                <button 
                  onClick={() => addPost({ id: Date.now().toString(), title: '새 게시물', content: '내용을 입력하세요.', date: new Date().toISOString().split('T')[0], type: 'notice' })}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-xs font-medium whitespace-nowrap ml-4"
                >
                  새 글 작성
                </button>
              </div>

              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-sm text-slate-800 mb-3">화면 텍스트 출력 관리</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'postSectionTitle', label: '상단 메뉴 제목' },
                    { key: 'postCategoryLabel', label: '공지/이벤트 라벨' },
                    { key: 'postDate', label: '작성일자' },
                    { key: 'postTitle', label: '게시글 제목' },
                    { key: 'postContent', label: '게시글 내용' },
                    { key: 'postMoreButton', label: '더보기 버튼' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm gap-2">
                      <span className="text-[10px] font-bold text-slate-700">{label}</span>
                      <button 
                        onClick={() => updateTextVisibility({ [key as keyof TextVisibilityState]: !state.textVisibility[key as keyof TextVisibilityState] })}
                        className={`w-full py-1.5 flex justify-center items-center rounded transition-colors ${state.textVisibility[key as keyof TextVisibilityState] ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        {state.textVisibility[key as keyof TextVisibilityState] ? <Eye className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {state.posts.map(post => (
                  <div key={post.id} className="p-3 bg-slate-50 border border-slate-100 rounded flex flex-col gap-2 relative">
                     <button onClick={() => deletePost(post.id)} className="absolute top-3 right-3 p-1 text-rose-500 hover:bg-rose-100 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                     </button>
                     <div className="flex items-center gap-2 pr-8">
                       <select 
                        value={post.type} 
                        onChange={(e) => updatePost(post.id, { type: e.target.value as 'notice' | 'event' })}
                        className="px-2 py-0.5 bg-white rounded text-[10px] font-bold text-slate-700 outline-none border border-slate-200 focus:border-accent"
                      >
                        <option value="notice">공지</option>
                        <option value="event">이벤트</option>
                      </select>
                       <input 
                        type="date" 
                        value={post.date}
                        onChange={(e) => updatePost(post.id, { date: e.target.value })}
                        className="px-2 py-0.5 bg-white text-[10px] text-slate-600 outline-none border border-slate-200 focus:border-accent rounded"
                      />
                    </div>
                    <input 
                      type="text" 
                      value={post.title}
                      onChange={(e) => updatePost(post.id, { title: e.target.value })}
                      className="font-bold text-sm text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent w-full"
                    />
                    <textarea 
                      value={post.content}
                      onChange={(e) => updatePost(post.id, { content: e.target.value })}
                      className="text-xs text-slate-600 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-accent w-full resize-y min-h-[60px]"
                      rows={4}
                      placeholder="내용을 입력하세요. (HTML 태그 및 줄바꿈 지원)"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
             <div className="bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-white">
                <h2 className="text-lg font-bold text-slate-900">관리자 계정 관리</h2>
                <p className="text-slate-500 mt-1 text-xs">관리자 모드 접속용 비밀번호를 변경합니다.</p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">새 비밀번호</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded text-sm focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">새 비밀번호 확인</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded text-sm focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                
                {securityMessage && (
                  <div className={`p-3 rounded text-xs font-bold ${securityMessage.includes('성공적으로') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {securityMessage}
                  </div>
                )}
                
                <div className="pt-2 border-t border-slate-100">
                  <button onClick={handleSavePassword} className="w-full flex justify-center items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium rounded hover:bg-slate-800 transition-colors text-sm">
                    <Save className="w-4 h-4" /> 비밀번호 변경하기
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 3. RIGHT PREVIEW PANEL */}
      <div className="flex-1 flex flex-col bg-slate-200 h-full overflow-hidden relative">
        <div className="px-4 py-2 bg-slate-300 flex justify-between items-center z-10 border-b border-slate-400">
          <div className="flex items-center gap-2 text-slate-600">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
          </div>
        </div>
        
        {/* IFRAME-LIKE CONTAINER */}
        <div className="flex-1 overflow-y-auto w-full h-full bg-slate-50 relative pointer-events-none shadow-inner border-t border-white">
          <div className="pointer-events-auto h-full w-full">
            <FrontendPage isPreview={true} />
          </div>
        </div>
      </div>

    </div>
  );
};
