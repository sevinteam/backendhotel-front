import React, { useState, useEffect, useRef } from 'react';
import type { Wishlist, User, Article, Hotel } from '../types';
import { PlusIcon, DotsVerticalIcon, PhotoIcon, DocumentTextIcon, PencilIcon, TrashIcon, StarIcon, HeartIcon, ChevronRightIcon } from './icons';
import AddWishlistModal from './AddWishlistModal';
import ConfirmationModal from './ConfirmationModal';
import Pagination from './Pagination';


// Expanded mock data for articles
const mockArticles: Article[] = Array.from({ length: 12 }, (_, i) => {
    const original = [
        { id: 1, title: 'مختصری درباره‌ی ساشا آذرخش', description: 'ساشا آذرخش متولد 1378 در تهران چشم به جهان گشود. وی در 2 ماهگی قادر به صحبت، کد زدن و غیره ب...', imageUrl: 'https://i.pravatar.cc/400?img=68', source: 'علیرضا آذرخش آلوچه', date: '۱۴۰۴/۰۸/۲۴' },
        { id: 2, title: 'راهنمای سفر به شیراز', description: 'شیراز، شهر شعر و ادب، با باغ‌های دل‌انگیز و مردمی خونگرم, یکی از مقاصد اصلی گردشگری ایران است...', imageUrl: 'https://picsum.photos/id/1015/400/300', source: 'وبسایت زروان', date: '۱۴۰۴/۰۸/۲۰' },
        { id: 3, title: 'جاذبه‌های گردشگری اصفهان', description: 'اصفهان، نصف جهان، با معماری بی‌نظیر و تاریخ غنی خود، هر گردشگری را مجذوب خود می‌کند...', imageUrl: 'https://picsum.photos/id/1016/400/300', source: 'مجله گردشگری', date: '۱۴۰۴/۰۷/۱۵' },
        { id: 4, title: 'کوهنوردی در دماوند', description: 'صعود به قله دماوند، بام ایران، تجربه‌ای است که هر کوهنوردی آرزوی آن را دارد. این مقاله...', imageUrl: 'https://picsum.photos/id/1018/400/300', source: 'باشگاه کوهنوردی', date: '۱۴۰۴/۰۶/۳۰' },
    ][i % 4];
    return { ...original, id: i + 1, title: `${original.title} (${i + 1})` };
});

// Expanded mock data for hotels
const mockHotels: Hotel[] = Array.from({ length: 9 }, (_, i) => {
    const original = [
        { id: 1, name: 'هتل پارسیان آزادی', location: 'استان تهران، تهران', stars: 5, price: '۵,۵۰۰,۰۰۰ تومان', imageUrl: 'https://picsum.photos/id/1040/400/300' },
        { id: 2, name: 'هتل عباسی اصفهان', location: 'استان اصفهان، اصفهان', stars: 5, price: '۴,۸۰۰,۰۰۰ تومان', imageUrl: 'https://picsum.photos/id/1041/400/300' },
        { id: 3, name: 'هتل داریوش کیش', location: 'استان هرمزگان، کیش', stars: 5, price: '۷,۰۰۰,۰۰۰ تومان', imageUrl: 'https://picsum.photos/id/1043/400/300' },
    ][i % 3];
    return { ...original, id: i + 1, name: `${original.name} (${i + 1})` };
});


// Mock data for wishlists, used as a fallback
const initialWishlistsData: Wishlist[] = [
  {
    id: 1,
    title: 'همه علاقه مندی ها',
    images: ['https://picsum.photos/id/10/400/300', 'https://picsum.photos/id/11/400/300', 'https://picsum.photos/id/12/400/300'],
    articles: mockArticles,
    hotels: mockHotels,
  },
  {
    id: 2,
    title: 'سلطان غم آذرخش آلوچه',
    images: ['https://i.pravatar.cc/400?img=68', 'https://picsum.photos/id/1011/400/300', 'https://picsum.photos/id/1012/400/300'],
    articles: mockArticles.slice(4, 8),
    hotels: [],
  },
  {
    id: 3,
    title: 'سفرهای آینده',
    images: [],
    articles: [],
    hotels: [],
  },
  {
    id: 4,
    title: 'هتل های کیش',
    images: ['https://picsum.photos/id/1013/400/300'],
    articles: [],
    hotels: mockHotels.slice(2, 5),
  },
];

interface UserWishlistTabProps {
  user: User;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const WishlistCard: React.FC<{
  list: Wishlist;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ list, onSelect, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm p-4 flex flex-col gap-4 border border-gray-200 dark:border-gray-700 h-full">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">{list.title}</h3>
                <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setMenuOpen(prev => !prev)} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full">
                        <DotsVerticalIcon className="w-5 h-5" />
                    </button>
                    {menuOpen && (
                        <div ref={menuRef} className="absolute left-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                            <button onClick={onEdit} className="w-full text-right flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <PencilIcon className="w-5 h-5" />
                                <span>ویرایش</span>
                            </button>
                            <button onClick={onDelete} className="w-full text-right flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <TrashIcon className="w-5 h-5" />
                                <span>حذف</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={onSelect} className="w-full aspect-square rounded-xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-2">
                 {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {list.images[i] ? (
                            <img src={list.images[i]} alt={`${list.title} image ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                            <PhotoIcon className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                        )}
                    </div>
                ))}
            </button>
        </div>
    );
};


const UserWishlistTab: React.FC<UserWishlistTabProps> = ({ user, onShowToast }) => {
  const [wishlists, setWishlists] = useState<Wishlist[]>(() => {
    try {
      const savedWishlists = localStorage.getItem(`userWishlists_${user.id}`);
      return savedWishlists ? JSON.parse(savedWishlists) : initialWishlistsData;
    } catch (error) {
      console.error("Failed to parse wishlists from localStorage", error);
      return initialWishlistsData;
    }
  });

  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [activeContentTab, setActiveContentTab] = useState<'articles' | 'hotels'>('articles');
  const [articlesPage, setArticlesPage] = useState(1);
  const [hotelsPage, setHotelsPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);
  const [deleteConfirmState, setDeleteConfirmState] = useState<{ isOpen: boolean; list: Wishlist | null }>({ isOpen: false, list: null });
  
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    try {
      localStorage.setItem(`userWishlists_${user.id}`, JSON.stringify(wishlists));
    } catch (error) {
      console.error("Failed to save wishlists to localStorage", error);
    }
  }, [wishlists, user.id]);

  const canAddMore = wishlists.length < 10;

  const handleSaveWishlist = (listName: string) => {
    if (editingWishlist) {
      setWishlists(prev => prev.map(list => list.id === editingWishlist.id ? { ...list, title: listName } : list));
      onShowToast(`نام لیست به "${listName}" با موفقیت ویرایش شد.`, 'success');
    } else {
      if (!canAddMore) return;
      const newWishlist: Wishlist = {
        id: Date.now(),
        title: listName,
        images: [],
        articles: [],
        hotels: []
      };
      setWishlists(prev => [newWishlist, ...prev]);
      onShowToast('لیست با موفقیت اضافه شد.', 'success');
    }
    setIsModalOpen(false);
    setEditingWishlist(null);
  };
  
  const handleOpenAddModal = () => {
      setEditingWishlist(null);
      setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (list: Wishlist) => {
      setEditingWishlist(list);
      setIsModalOpen(true);
  };

  const handleOpenDeleteConfirm = (list: Wishlist) => {
    setDeleteConfirmState({ isOpen: true, list });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmState({ isOpen: false, list: null });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmState.list) {
      setWishlists(prev => prev.filter(list => list.id !== deleteConfirmState.list!.id));
      onShowToast(`لیست "${deleteConfirmState.list.title}" با موفقیت حذف شد.`, 'success');
    }
    handleCloseDeleteConfirm();
  };
  
  const handleSelectWishlist = (list: Wishlist) => {
      setSelectedWishlist(list);
      setArticlesPage(1);
      setHotelsPage(1);
      if ((list.articles?.length || 0) > 0) {
          setActiveContentTab('articles');
      } else {
          setActiveContentTab('hotels');
      }
  };
  
  const handleRemoveArticle = (articleId: number) => {
      if (!selectedWishlist) return;

      const updatedArticles = selectedWishlist.articles?.filter(a => a.id !== articleId);
      const updatedList = { ...selectedWishlist, articles: updatedArticles };
      
      setSelectedWishlist(updatedList);
      setWishlists(prev => prev.map(list => list.id === updatedList.id ? updatedList : list));
      
      const removedArticle = selectedWishlist.articles?.find(a => a.id === articleId);
      if (removedArticle) {
          onShowToast(`مقاله "${removedArticle.title}" از لیست "${selectedWishlist.title}" حذف شد`, 'success');
      }
  };
  
  const handleRemoveHotel = (hotelId: number) => {
      if (!selectedWishlist) return;

      const updatedHotels = selectedWishlist.hotels?.filter(h => h.id !== hotelId);
      const updatedList = { ...selectedWishlist, hotels: updatedHotels };

      setSelectedWishlist(updatedList);
      setWishlists(prev => prev.map(list => list.id === updatedList.id ? updatedList : list));

      const removedHotel = selectedWishlist.hotels?.find(h => h.id === hotelId);
      if (removedHotel) {
          onShowToast(`هتل "${removedHotel.name}" از لیست "${selectedWishlist.title}" حذف شد`, 'success');
      }
  };

  const ArticleCard: React.FC<{ article: Article, onRemove: () => void }> = ({ article, onRemove }) => (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-md flex flex-col overflow-hidden h-full">
          <div className="relative">
              <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
              <button onClick={onRemove} className="absolute top-3 left-3 bg-transparent backdrop-blur-xs backdrop-blur-sm rounded-full p-2 text-red-500 transition-colors">
                  <HeartIcon className="w-5 h-5" />
              </button>
          </div>
          <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-base">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">{article.description}</p>
              <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{article.source}</span>
                  <span>{article.date}</span>
              </div>
               <button className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                  مطالعه مقاله
              </button>
          </div>
      </div>
  );

  const HotelCard: React.FC<{ hotel: Hotel, onRemove: () => void }> = ({ hotel, onRemove }) => (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-md flex flex-col overflow-hidden h-full">
          <div className="relative">
              <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-48 object-cover" />
              <button onClick={onRemove} className="absolute top-3 left-3 bg-transparent backdrop-blur-xs backdrop-blur-sm rounded-full p-2 text-red-500 transition-colors">
                  <HeartIcon className="w-6 h-6" />
              </button>
          </div>
          <div className="p-4 flex flex-col flex-grow space-y-3">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{hotel.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{hotel.location}</p>
              <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">امتیاز هتل:</span>
                  <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{hotel.stars}</span>
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                  </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">شروع قیمت اتاق:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{hotel.price}</span>
              </div>
              <div className="flex-grow"></div>
              <button className="w-full mt-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                  مشاهده هتل
              </button>
          </div>
      </div>
  );

  const EmptyContent: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 py-10">
      <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-bold">موردی برای نمایش وجود ندارد</h3>
    </div>
  );

  if (selectedWishlist) {
    const hasArticles = (selectedWishlist.articles?.length || 0) > 0;
    const hasHotels = (selectedWishlist.hotels?.length || 0) > 0;

    const paginatedArticles = selectedWishlist.articles?.slice((articlesPage - 1) * ITEMS_PER_PAGE, articlesPage * ITEMS_PER_PAGE) || [];
    const totalArticlePages = Math.ceil((selectedWishlist.articles?.length || 0) / ITEMS_PER_PAGE);

    const paginatedHotels = selectedWishlist.hotels?.slice((hotelsPage - 1) * ITEMS_PER_PAGE, hotelsPage * ITEMS_PER_PAGE) || [];
    const totalHotelPages = Math.ceil((selectedWishlist.hotels?.length || 0) / ITEMS_PER_PAGE);
    
    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                    <button onClick={() => setSelectedWishlist(null)} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">{selectedWishlist.title}</h2>
                </div>
                
                <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl p-4">
                    <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-1 mb-6 flex-shrink-0">
                        <button onClick={() => setActiveContentTab('articles')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${activeContentTab === 'articles' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>مقالات</button>
                        <button onClick={() => setActiveContentTab('hotels')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${activeContentTab === 'hotels' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>هتل ها</button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-right flex flex-col">
                        {activeContentTab === 'articles' ? (
                            hasArticles ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {paginatedArticles.map(article => <ArticleCard key={article.id} article={article} onRemove={() => handleRemoveArticle(article.id)} />)}
                                </div>
                            ) : <EmptyContent />
                        ) : (
                            hasHotels ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {paginatedHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} onRemove={() => handleRemoveHotel(hotel.id)} />)}
                                </div>
                            ) : <EmptyContent />
                        )}
                        <div className="mt-auto">
                        {activeContentTab === 'articles' && totalArticlePages > 1 && (
                            <Pagination currentPage={articlesPage} totalPages={totalArticlePages} onPageChange={setArticlesPage} />
                        )}
                        {activeContentTab === 'hotels' && totalHotelPages > 1 && (
                            <Pagination currentPage={hotelsPage} totalPages={totalHotelPages} onPageChange={setHotelsPage} />
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">لیست های علاقه مندی</h2>
          <button
            onClick={handleOpenAddModal}
            disabled={!canAddMore}
            className="flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm whitespace-nowrap hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">افزودن لیست جدید</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {wishlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlists.map((list) => (
                <WishlistCard 
                    key={list.id} 
                    list={list}
                    onSelect={() => handleSelectWishlist(list)}
                    onEdit={() => handleOpenEditModal(list)}
                    onDelete={() => handleOpenDeleteConfirm(list)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold">لیست علاقه‌مندی خالی است</h3>
              <p className="mt-2 text-sm">کاربر هنوز هیچ لیستی ایجاد نکرده است.</p>
            </div>
          )}
        </div>
      </div>
      <AddWishlistModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingWishlist(null); }}
        onConfirm={handleSaveWishlist}
        wishlistToEdit={editingWishlist}
      />
      <ConfirmationModal
        isOpen={deleteConfirmState.isOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="حذف لیست علاقه مندی"
        message={
            <>
            آیا از حذف لیست "<strong className="font-bold text-gray-800 dark:text-gray-200">{deleteConfirmState.list?.title}</strong>" مطمئن هستید؟
            </>
        }
      />
    </>
  );
};

export default UserWishlistTab;