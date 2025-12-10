import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Target, 
  Clock, 
  ChevronRight, 
  Layout, 
  PenTool, 
  TrendingUp,
  FileText,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { SheetViewer } from './components/SheetViewer.tsx';
import { SheetHistoryItem, ViewMode } from './types.ts';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Welcome);
  const [history, setHistory] = useState<SheetHistoryItem[]>([]);
  
  // Input states
  const [inputUrl, setInputUrl] = useState('');
  const [inputName, setInputName] = useState('');

  // Load history from local storage on mount with Date hydration
  useEffect(() => {
    const saved = localStorage.getItem('sheet_history');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Ensure date strings are converted back to Date objects
        const hydratedData: SheetHistoryItem[] = parsedData.map((item: any) => ({
          ...item,
          lastAccessed: new Date(item.lastAccessed)
        }));
        setHistory(hydratedData);
      } catch (e) {
        console.error("Failed to parse history", e);
        localStorage.removeItem('sheet_history');
      }
    }
  }, []);

  const handleLoadSheet = (url: string, name: string) => {
    if (!url) return;
    
    // Basic validation
    if (!url.includes('google.com/spreadsheets')) {
      alert("Vui lòng nhập đúng đường link Google Sheets");
      return;
    }

    const finalName = name.trim() || `Kế hoạch ngày ${new Date().toLocaleDateString('vi-VN')}`;

    setCurrentUrl(url);
    setViewMode(ViewMode.Sheet);
    
    // Add to history
    const newItem: SheetHistoryItem = {
      id: Date.now().toString(),
      url,
      title: finalName, 
      lastAccessed: new Date()
    };
    
    // Update history: remove duplicates of current url, add new to top
    const newHistory = [newItem, ...history.filter(h => h.url !== url)].slice(0, 12);
    setHistory(newHistory);
    localStorage.setItem('sheet_history', JSON.stringify(newHistory));
    
    // Reset inputs
    setInputUrl('');
    setInputName('');
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('sheet_history', JSON.stringify(newHistory));
  };

  const handleReturnHome = () => {
    setViewMode(ViewMode.Welcome);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-brand-900 border-b border-slate-800 flex items-center justify-between px-6 shadow-lg flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReturnHome}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="bg-gradient-to-tr from-brand-gold to-brand-accent p-2 rounded-lg shadow-md group-hover:shadow-brand-accent/20">
              <Briefcase size={22} className="text-white" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-wide text-white block leading-none">
                Branding & Content
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-accent font-medium">Plan Master</span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {viewMode === ViewMode.Welcome ? (
          <div className="flex-1 overflow-y-auto bg-slate-50 relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200 to-transparent pointer-events-none"></div>
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
              
              {/* Hero Section */}
              <div className="text-center space-y-6 mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-widest border border-brand-gold/20 mb-4">
                  <Target size={12} /> Quản trị hiệu suất cao
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-900 leading-tight">
                  Quản lý <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-accent">Thông tin Thương hiệu</span><br/>
                  & Lên kế hoạch Content
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                  Nền tảng tập trung giúp bạn xây dựng chiến lược, theo dõi tiến độ và quản lý file Google Sheets một cách chuyên nghiệp, không xao nhãng.
                </p>
                
                {/* Input Card */}
                <div className="max-w-2xl mx-auto mt-10">
                  <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-2 relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent"></div>
                     
                     {/* Name Input */}
                     <div className="flex-1 min-w-[200px]">
                        <input 
                          type="text" 
                          placeholder="Đặt tên cho kế hoạch (VD: Content T5/2024)..."
                          className="w-full h-full px-4 py-3 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value)}
                        />
                     </div>

                     <div className="w-px bg-slate-100 hidden md:block"></div>

                     {/* URL Input */}
                     <div className="flex-[1.5]">
                        <input 
                          type="text" 
                          placeholder="Dán link Google Sheet vào đây..."
                          className="w-full h-full px-4 py-3 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm"
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLoadSheet(inputUrl, inputName)}
                        />
                     </div>
                     
                     <button 
                       onClick={() => handleLoadSheet(inputUrl, inputName)}
                       className="bg-brand-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-brand-900/20 flex items-center justify-center gap-2 md:w-auto w-full"
                     >
                       Mở Ngay <ArrowRight size={16} />
                     </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 italic">Hỗ trợ mọi đường dẫn Google Sheets được chia sẻ</p>
                </div>
              </div>

              {/* Recent History Section */}
              {history.length > 0 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2 text-brand-900 uppercase text-xs font-bold tracking-widest">
                      <Clock size={14} className="text-brand-gold" />
                      Tài liệu gần đây
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleLoadSheet(item.url, item.title)}
                        className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-gold hover:shadow-xl hover:shadow-brand-gold/5 transition-all cursor-pointer flex flex-col justify-between h-32"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                             <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-gold/10 transition-colors">
                                <FileText size={20} className="text-slate-400 group-hover:text-brand-gold" />
                             </div>
                             <button 
                               onClick={(e) => handleDeleteHistory(e, item.id)}
                               className="text-slate-300 hover:text-red-500 transition-colors p-1"
                               title="Xóa khỏi lịch sử"
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                          <h3 className="font-serif font-bold text-slate-800 truncate pr-4 text-lg">
                            {item.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-end justify-between mt-2">
                          <p className="text-xs text-slate-400 font-medium">
                            {formatDate(item.lastAccessed)}
                          </p>
                          <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-brand-gold">
                             <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 mt-8 border-t border-slate-200">
                <FeatureCard 
                  icon={<Layout className="text-brand-gold" />}
                  title="Không gian Tập trung"
                  desc="Giao diện loại bỏ mọi yếu tố gây nhiễu, giúp bạn tập trung hoàn toàn vào số liệu và kế hoạch."
                />
                <FeatureCard 
                  icon={<PenTool className="text-brand-gold" />}
                  title="Lập Kế Hoạch Content"
                  desc="Tối ưu hóa quy trình sáng tạo nội dung hàng ngày. Chỉnh sửa trực tiếp, lưu trữ tự động."
                />
                <FeatureCard 
                  icon={<TrendingUp className="text-brand-gold" />}
                  title="Quản trị Thương hiệu"
                  desc="Theo dõi các chỉ số sức khỏe thương hiệu và chiến dịch marketing trong một view duy nhất."
                />
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative bg-white">
             {/* Simple Toolbar in Sheet View */}
             <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                   <span className="font-semibold text-brand-900">Đang xem:</span> 
                   <span className="truncate max-w-md">{history.find(h => h.url === currentUrl)?.title || 'Tài liệu'}</span>
                </div>
                <div className="text-xs text-slate-400 italic">
                   Dữ liệu được đồng bộ trực tiếp với Google
                </div>
             </div>
            <SheetViewer url={currentUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-5 bg-slate-50 w-14 h-14 rounded-xl flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <h3 className="font-serif font-bold text-xl text-brand-900 mb-3">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed font-light">{desc}</p>
  </div>
);
