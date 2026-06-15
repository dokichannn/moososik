/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ArchiveItem, Category, GridSize, VisualItem, TextItem, ObjectItem, FilmItem, EtcItem, FooterConfig } from '../types';
import { X, Plus, Edit3, Trash2, Shield, Settings, Save, Upload, Image as ImageIcon, Link2, Grid } from 'lucide-react';

const compressImage = (base64Str: string, maxWidth = 1000, maxHeight = 1000): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "https://images.unsplash.com/..."
}) => {
  const [showUrlField, setShowUrlField] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          const compressed = await compressImage(reader.result);
          onChange(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          const compressed = await compressImage(reader.result);
          onChange(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500">
        {label}
      </label>

      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className="group relative border border-dashed border-neutral-300 hover:border-black transition-all bg-[#ffffff] p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px]"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {value ? (
          <div className="relative w-full h-32 flex items-center justify-center overflow-hidden bg-neutral-50">
            <img 
              src={value} 
              alt="Selected Preview" 
              className="max-h-full max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-white bg-black px-2 py-1 select-none">
                Change File (파일 바꾸기)
              </span>
              <button 
                type="button" 
                onClick={clearImage}
                className="text-[10px] uppercase font-mono tracking-widest text-[#ff4444] bg-white px-2 py-1 hover:bg-[#ff4444] hover:text-white transition-colors"
                id="clear-img-btn"
              >
                Remove (삭제)
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2 select-none">
            <div className="p-2.5 bg-neutral-100 rounded-full text-neutral-600 group-hover:bg-neutral-200 transition-colors">
              <Upload size={16} />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-sans font-medium text-neutral-800">
                컴퓨터 파일 선택 또는 이미지를 끌어다 놓기
              </p>
              <p className="text-[9px] font-mono text-neutral-400">
                JPG, PNG, WEBP, GIF
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="text-[9px] font-mono uppercase text-neutral-500 hover:text-black self-end flex items-center gap-1 transition-colors py-1"
        >
          <Link2 size={10} />
          <span>{showUrlField ? "Hide Direct URL mode" : "또는 웹 이미지 주소 입력하기 (URL)"}</span>
        </button>

        {showUrlField && (
          <input
            type="url"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-sans mt-1 transition-all"
          />
        )}
      </div>
    </div>
  );
};

interface AdminPanelProps {
  items: ArchiveItem[];
  onUpdateItems: (newItems: ArchiveItem[]) => void;
  footerConfig: FooterConfig;
  onUpdateFooter: (config: FooterConfig) => void;
  visualCategories: string[];
  onUpdateVisualCategories: (categories: string[]) => void;
  textsCategories: string[];
  onUpdateTextsCategories: (categories: string[]) => void;
  objectCategories: string[];
  onUpdateObjectCategories: (categories: string[]) => void;
  filmsCategories: string[];
  onUpdateFilmsCategories: (categories: string[]) => void;
  etcCategories: string[];
  onUpdateEtcCategories: (categories: string[]) => void;
  onClose: () => void;
}

export default function AdminPanel({
  items,
  onUpdateItems,
  footerConfig,
  onUpdateFooter,
  visualCategories = [],
  onUpdateVisualCategories,
  textsCategories = [],
  onUpdateTextsCategories,
  objectCategories = [],
  onUpdateObjectCategories,
  filmsCategories = [],
  onUpdateFilmsCategories,
  etcCategories = [],
  onUpdateEtcCategories,
  onClose
}: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Visual');

  // Form states
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formSummary, setFormSummary] = useState('');

  // Category-specific states
  // Visual
  const [visualType, setVisualType] = useState<string>('Poster');
  const [visualImageUrl, setVisualImageUrl] = useState('');
  const [visualArtist, setVisualArtist] = useState('');
  const [visualKeywords, setVisualKeywords] = useState('');
  const [visualTools, setVisualTools] = useState('');
  const [visualSubImages, setVisualSubImages] = useState<string[]>([]);
  const [visualDescription, setVisualDescription] = useState('');

  // Texts
  const [textType, setTextType] = useState<string>('Thought');
  const [textContent, setTextContent] = useState('');
  const [textPreviewImageUrl, setTextPreviewImageUrl] = useState('');
  const [textAuthor, setTextAuthor] = useState('MOOSOSIK');

  // Object
  const [objectType, setObjectType] = useState<string>('Furniture');
  const [objectBrand, setObjectBrand] = useState('');
  const [objectDesigner, setObjectDesigner] = useState('');
  const [objectMaterial, setObjectMaterial] = useState('');
  const [objectImageUrl, setObjectImageUrl] = useState('');
  const [objectMemo, setObjectMemo] = useState('');
  const [objectReasonArchived, setObjectReasonArchived] = useState('');

  // Films
  const [filmType, setFilmType] = useState<string>('Movie');
  const [filmDirector, setFilmDirector] = useState('');
  const [filmActor, setFilmActor] = useState('');
  const [filmImageUrl, setFilmImageUrl] = useState('');
  const [filmFavoriteQuote, setFilmFavoriteQuote] = useState('');
  const [filmMusic, setFilmMusic] = useState('');
  const [filmYoutubeUrl, setFilmYoutubeUrl] = useState('');

  // Etc
  const [etcSubCategory, setEtcSubCategory] = useState('');
  const [etcImageUrl, setEtcImageUrl] = useState('');
  const [etcUrl, setEtcUrl] = useState('');
  const [etcDescription, setEtcDescription] = useState('');
  const [etcGridSize, setEtcGridSize] = useState<GridSize>('medium');

  // Footer Config state
  const [footAuthor, setFootAuthor] = useState(footerConfig.authorName);
  const [footEmail, setFootEmail] = useState(footerConfig.email);
  const [footInsta, setFootInsta] = useState(footerConfig.instagram);
  const [footYoutube, setFootYoutube] = useState(footerConfig.youtube || '');

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1103') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('비밀번호가 올바르지 않습니다.');
    }
  };

  // Switch form to Add Mode
  const handleInitAdd = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    // Reset basic fields
    setFormId(`item_${Date.now()}`);
    setFormTitle('');
    setFormYear(new Date().getFullYear().toString());
    setFormSummary('');

    // Reset details
    setVisualType(visualCategories[0] || 'Branding');
    setVisualImageUrl('');
    setVisualArtist('');
    setVisualKeywords('');
    setVisualTools('');
    setVisualSubImages([]);
    setVisualDescription('');

    setTextType(textsCategories[0] || 'Thought');
    setTextContent('');
    setTextPreviewImageUrl('');

    setObjectType(objectCategories[0] || 'Furniture');
    setObjectBrand('');
    setObjectDesigner('');
    setObjectMaterial('');
    setObjectImageUrl('');
    setObjectMemo('');
    setObjectReasonArchived('');

    setFilmType(filmsCategories[0] || 'Movie');
    setFilmDirector('');
    setFilmActor('');
    setFilmImageUrl('');
    setFilmFavoriteQuote('');
    setFilmMusic('');
    setFilmYoutubeUrl('');

    setEtcSubCategory(etcCategories[0] || 'Exhibition');
    setEtcImageUrl('');
    setEtcUrl('');
    setEtcDescription('');
    setEtcGridSize('medium');
  };

  // Switch form to Edit Mode
  const handleInitEdit = (item: ArchiveItem) => {
    setIsAddingNew(false);
    setEditingItem(item);
    setSelectedCategory(item.category);

    setFormId(item.id);
    setFormTitle(item.title);
    setFormYear(item.year);
    setFormSummary(item.summary);

    if (item.category === 'Visual') {
      setVisualType(item.type);
      setVisualImageUrl(item.imageUrl || '');
      setVisualArtist(item.artist || '');
      setVisualKeywords(item.keywords ? item.keywords.join(', ') : '');
      setVisualTools(item.tools ? item.tools.join(', ') : '');
      setVisualSubImages(item.images ? item.images : []);
      setVisualDescription(item.description || '');
    } else if (item.category === 'Texts') {
      setTextType(item.type || textsCategories[0] || 'Thought');
      setTextContent(item.content || '');
      setTextPreviewImageUrl(item.previewImageUrl || '');
      setTextAuthor(item.author || 'MOOSOSIK');
    } else if (item.category === 'Object') {
      setObjectType(item.type || objectCategories[0] || 'Furniture');
      setObjectBrand(item.brand || '');
      setObjectDesigner(item.designer || '');
      setObjectMaterial(item.material || '');
      setObjectImageUrl(item.imageUrl || '');
      setObjectMemo(item.memo || '');
      setObjectReasonArchived(item.reasonArchived || '');
    } else if (item.category === 'Films') {
      const film = item as FilmItem;
      setFilmType(film.type || filmsCategories[0] || 'Movie');
      setFilmDirector(film.director || '');
      setFilmActor(film.actor || '');
      setFilmImageUrl(film.imageUrl || '');
      setFilmFavoriteQuote(film.favoriteQuote || '');
      setFilmMusic(film.music || '');
      setFilmYoutubeUrl(film.youtubeUrl || '');
    } else if (item.category === 'Etc') {
      setEtcSubCategory(item.subCategory || '');
      setEtcImageUrl(item.imageUrl || '');
      setEtcUrl(item.url || '');
      setEtcDescription(item.description || '');
      setEtcGridSize(item.gridSize || 'medium');
    }
  };

  // Save changes (Create or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    let newItem: ArchiveItem;

    const baseData = {
      id: formId,
      category: selectedCategory,
      title: formTitle,
      year: formYear,
      summary: formSummary,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString()
    };

    if (selectedCategory === 'Visual') {
      newItem = {
        ...baseData,
        category: 'Visual',
        type: visualType,
        imageUrl: visualImageUrl || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
        artist: visualArtist,
        keywords: visualKeywords ? visualKeywords.split(',').map(s => s.trim()).filter(Boolean) : [],
        tools: visualTools ? visualTools.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: visualSubImages.filter(Boolean).length > 0 ? visualSubImages.filter(Boolean) : [visualImageUrl || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab'],
        description: visualDescription
      } as ArchiveItem;
    } else if (selectedCategory === 'Texts') {
      newItem = {
        ...baseData,
        category: 'Texts',
        type: textType,
        content: textContent,
        previewImageUrl: textPreviewImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
        author: textAuthor
      } as ArchiveItem;
    } else if (selectedCategory === 'Object') {
      newItem = {
        ...baseData,
        category: 'Object',
        type: objectType,
        brand: objectBrand,
        designer: objectDesigner,
        material: objectMaterial,
        imageUrl: objectImageUrl || 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
        memo: objectMemo,
        reasonArchived: objectReasonArchived
      } as ArchiveItem;
    } else if (selectedCategory === 'Films') {
      newItem = {
        ...baseData,
        category: 'Films',
        type: filmType,
        director: filmDirector,
        actor: filmActor,
        imageUrl: filmImageUrl || 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0',
        favoriteQuote: filmFavoriteQuote,
        music: filmMusic,
        reasonArchived: '', // no longer used but keep for interface safety if needed
        youtubeUrl: filmYoutubeUrl
      } as ArchiveItem;
    } else {
      newItem = {
        ...baseData,
        category: 'Etc',
        subCategory: etcSubCategory,
        type: etcSubCategory,
        imageUrl: etcImageUrl || 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3',
        url: etcUrl,
        description: etcDescription,
        gridSize: etcGridSize
      } as ArchiveItem;
    }

    let updatedList: ArchiveItem[];
    if (isAddingNew) {
      updatedList = [newItem, ...items];
    } else {
      updatedList = items.map(item => item.id === newItem.id ? newItem : item);
    }

    onUpdateItems(updatedList);
    setIsAddingNew(false);
    setEditingItem(null);
    alert('아카이브가 안전하게 저장되었습니다.');
  };

  // Delete Action
  const handleDeleteItem = (id: string, title: string) => {
    const updatedList = items.filter(item => item.id !== id);
    onUpdateItems(updatedList);
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  // Save Footer System
  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFooter({
      authorName: footAuthor,
      email: footEmail,
      instagram: footInsta,
      youtube: footYoutube
    });
    alert('푸터 프로필 정보가 업데이트되었습니다.');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#fafafa]/98 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-none border border-[#0d0d0d]/10 bg-[#fafafa] p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-22 h-22 mb-4 text-[#0d0d0d] flex items-center justify-center">
              <svg viewBox="0 0 1000 1000" className="w-22 h-22" fill="currentColor">
                {/* Chimney */}
                <rect x="650" y="220" width="115" height="150" />
                {/* House silhouette */}
                <polygon points="500,148 64,498 180,498 180,905 820,905 820,498 936,498" />
                <text
                  x="500"
                  y="702"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                  fontWeight="900"
                  fontSize="210"
                  fill="white"
                  stroke="white"
                  strokeWidth="12"
                  paintOrder="stroke fill"
                  letterSpacing="-6"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  MOO
                </text>
              </svg>
            </div>
            <h2 className="font-mono text-sm tracking-widest text-[#0d0d0d] font-bold uppercase">HEESOSIK</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-widest mb-1.5 text-neutral-500 text-center">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#fafafa] border border-neutral-300 px-3 py-2 text-center text-sm tracking-widest focus:outline-none focus:border-black font-mono"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-sans text-center">{errorMsg}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 border border-neutral-300 hover:border-black text-xs py-2 uppercase font-mono transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-black hover:bg-neutral-800 text-white text-xs py-2 uppercase font-mono transition-colors"
              >
                Access
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#fafafa] z-50 flex overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-[#0d0d0d]/10 flex flex-col h-full bg-neutral-50">
        <div className="p-4 border-b border-[#0d0d0d]/10 flex justify-between items-center bg-[#fafafa]">
          <div>
            <h1 className="font-display font-semibold text-sm tracking-wider uppercase">moososik.</h1>
            <p className="text-[10px] font-mono text-neutral-400">Archive Controller</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            title="Exit Admin Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Button */}
        <div className="p-3 bg-neutral-50 border-b border-[#0d0d0d]/10">
          <button
            onClick={handleInitAdd}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white py-2 px-4 text-xs font-mono uppercase tracking-widest transition-colors"
          >
            <Plus className="w-3 h-3" /> New Archive Item
          </button>
        </div>

        {/* Scrollable Container for both Items and Settings */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          {/* Existing Items Loop */}
          <div className="p-2 space-y-1">
            <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 px-2 py-1 sticky top-0 bg-neutral-50 opacity-90">
            Current Archive ({items.length})
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInitEdit(item)}
              className={`group flex items-center justify-between p-2.5 transition-all text-left ${
                (editingItem?.id === item.id && !isAddingNew)
                  ? 'bg-white border-l-2 border-black font-medium'
                  : 'hover:bg-white bg-neutral-50/50'
              }`}
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest bg-neutral-200 text-neutral-700 px-1 py-0.2 rounded-sm">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400">{item.year}</span>
                </div>
                <h4 className="text-xs truncate font-sans text-neutral-900 leading-tight">
                  {item.title}
                </h4>
              </div>

              <div className="flex gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInitEdit(item);
                  }}
                  className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors rounded-sm"
                  title="Edit Item"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id, item.title);
                  }}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-sm"
                  title="Delete Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Categories Settings */}
        <div className="p-4 border-t border-[#0d0d0d]/10 bg-[#fafafa] space-y-3">
          <h4 className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#0d0d0d]">
            <Grid className="w-3.5 h-3.5" /> Visual Categories (비주얼 카테고리 관리)
          </h4>
          
          <div className="flex flex-wrap gap-1 bg-white border border-neutral-200 p-2 max-h-[140px] overflow-y-auto no-scrollbar">
            {visualCategories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-neutral-100 text-[#0d0d0d] px-2 py-1 text-[10px] font-mono border border-neutral-200/50"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (visualCategories.length <= 1) {
                      return;
                    }
                    onUpdateVisualCategories(visualCategories.filter((c) => c !== cat));
                  }}
                  className="text-neutral-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="text"
              id="new-cat-input-field"
              placeholder="Add dynamic category (e.g. Identity)"
              className="flex-1 bg-white border border-neutral-300 px-2 py-1.5 text-[11px] focus:outline-none focus:border-black font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (!val) return;
                  if (visualCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                    alert('이미 존재하는 카테고리 명칭입니다.');
                    return;
                  }
                  onUpdateVisualCategories([...visualCategories, val]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('new-cat-input-field') as HTMLInputElement;
                const val = input?.value?.trim();
                if (!val) return;
                if (visualCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                  alert('이미 존재하는 카테고리 명칭입니다.');
                  return;
                }
                onUpdateVisualCategories([...visualCategories, val]);
                if (input) input.value = '';
              }}
              className="bg-black hover:bg-neutral-800 text-white px-2.5 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>

        {/* Texts Categories Settings */}
        <div className="p-4 border-t border-[#0d0d0d]/10 bg-[#fafafa] space-y-3">
          <h4 className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#0d0d0d]">
            <Grid className="w-3.5 h-3.5" /> Texts Categories (텍스트 카테고리 관리)
          </h4>
          
          <div className="flex flex-wrap gap-1 bg-white border border-neutral-200 p-2 max-h-[140px] overflow-y-auto no-scrollbar">
            {textsCategories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-neutral-100 text-[#0d0d0d] px-2 py-1 text-[10px] font-mono border border-neutral-200/50"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (textsCategories.length <= 1) {
                      return;
                    }
                    onUpdateTextsCategories(textsCategories.filter((c) => c !== cat));
                  }}
                  className="text-neutral-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="text"
              id="new-texts-cat-input"
              placeholder="Add dynamic category (e.g. Essay)"
              className="flex-1 bg-white border border-neutral-300 px-2 py-1.5 text-[11px] focus:outline-none focus:border-black font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (!val) return;
                  if (textsCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                    alert('이미 존재하는 카테고리 명칭입니다.');
                    return;
                  }
                  onUpdateTextsCategories([...textsCategories, val]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('new-texts-cat-input') as HTMLInputElement;
                const val = input?.value?.trim();
                if (!val) return;
                if (textsCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                  alert('이미 존재하는 카테고리 명칭입니다.');
                  return;
                }
                onUpdateTextsCategories([...textsCategories, val]);
                if (input) input.value = '';
              }}
              className="bg-black hover:bg-neutral-800 text-white px-2.5 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>

        {/* Object Categories Settings */}
        <div className="p-4 border-t border-[#0d0d0d]/10 bg-[#fafafa] space-y-3">
          <h4 className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#0d0d0d]">
            <Grid className="w-3.5 h-3.5" /> Object Categories (오브젝트 카테고리 관리)
          </h4>
          
          <div className="flex flex-wrap gap-1 bg-white border border-neutral-200 p-2 max-h-[140px] overflow-y-auto no-scrollbar">
            {objectCategories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-neutral-100 text-[#0d0d0d] px-2 py-1 text-[10px] font-mono border border-neutral-200/50"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (objectCategories.length <= 1) {
                      return;
                    }
                    onUpdateObjectCategories(objectCategories.filter((c) => c !== cat));
                  }}
                  className="text-neutral-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="text"
              id="new-object-cat-input"
              placeholder="Add dynamic category (e.g. Tech)"
              className="flex-1 bg-white border border-neutral-300 px-2 py-1.5 text-[11px] focus:outline-none focus:border-black font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (!val) return;
                  if (objectCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                    alert('이미 존재하는 카테고리 명칭입니다.');
                    return;
                  }
                  onUpdateObjectCategories([...objectCategories, val]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('new-object-cat-input') as HTMLInputElement;
                const val = input?.value?.trim();
                if (!val) return;
                if (objectCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                  alert('이미 존재하는 카테고리 명칭입니다.');
                  return;
                }
                onUpdateObjectCategories([...objectCategories, val]);
                if (input) input.value = '';
              }}
              className="bg-black hover:bg-neutral-800 text-white px-2.5 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>

        {/* Films Categories Settings */}
        <div className="p-4 border-t border-[#0d0d0d]/10 bg-[#fafafa] space-y-3">
          <h4 className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#0d0d0d]">
            <Grid className="w-3.5 h-3.5" /> Films Categories (필름 카테고리 관리)
          </h4>
          
          <div className="flex flex-wrap gap-1 bg-white border border-neutral-200 p-2 max-h-[140px] overflow-y-auto no-scrollbar">
            {filmsCategories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-neutral-100 text-[#0d0d0d] px-2 py-1 text-[10px] font-mono border border-neutral-200/50"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (filmsCategories.length <= 1) {
                      return;
                    }
                    onUpdateFilmsCategories(filmsCategories.filter((c) => c !== cat));
                  }}
                  className="text-neutral-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="text"
              id="new-films-cat-input"
              placeholder="Add dynamic category (e.g. Sci-Fi)"
              className="flex-1 bg-white border border-neutral-300 px-2 py-1.5 text-[11px] focus:outline-none focus:border-black font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (!val) return;
                  if (filmsCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                    alert('이미 존재하는 카테고리 명칭입니다.');
                    return;
                  }
                  onUpdateFilmsCategories([...filmsCategories, val]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('new-films-cat-input') as HTMLInputElement;
                const val = input?.value?.trim();
                if (!val) return;
                if (filmsCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                  alert('이미 존재하는 카테고리 명칭입니다.');
                  return;
                }
                onUpdateFilmsCategories([...filmsCategories, val]);
                if (input) input.value = '';
              }}
              className="bg-black hover:bg-neutral-800 text-white px-2.5 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>

        {/* Etc Categories Settings */}
        <div className="p-4 border-t border-[#0d0d0d]/10 bg-[#fafafa] space-y-3">
          <h4 className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#0d0d0d]">
            <Grid className="w-3.5 h-3.5" /> Etc Categories (기타 카테고리 관리)
          </h4>
          
          <div className="flex flex-wrap gap-1 bg-white border border-neutral-200 p-2 max-h-[140px] overflow-y-auto no-scrollbar">
            {etcCategories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-neutral-100 text-[#0d0d0d] px-2 py-1 text-[10px] font-mono border border-neutral-200/50"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (etcCategories.length <= 1) {
                      return;
                    }
                    onUpdateEtcCategories(etcCategories.filter((c) => c !== cat));
                  }}
                  className="text-neutral-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="text"
              id="new-etc-cat-input"
              placeholder="Add dynamic category (e.g. Place)"
              className="flex-1 bg-white border border-neutral-300 px-2 py-1.5 text-[11px] focus:outline-none focus:border-black font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (!val) return;
                  if (etcCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                    alert('이미 존재하는 카테고리 명칭입니다.');
                    return;
                  }
                  onUpdateEtcCategories([...etcCategories, val]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('new-etc-cat-input') as HTMLInputElement;
                const val = input?.value?.trim();
                if (!val) return;
                if (etcCategories.some(c => c.toLowerCase() === val.toLowerCase())) {
                  alert('이미 존재하는 카테고리 명칭입니다.');
                  return;
                }
                onUpdateEtcCategories([...etcCategories, val]);
                if (input) input.value = '';
              }}
              className="bg-black hover:bg-neutral-800 text-white px-2.5 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>

        {/* Quick Footer Settings */}
        <div className="p-4 border-t border-[#0d0d0d]/10 bg-[#fafafa]">
          <h4 className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-3">
            <Settings className="w-3.5 h-3.5" /> Profile Settings
          </h4>
          <form onSubmit={handleSaveFooter} className="space-y-2 text-xs">
            <div>
              <label className="block text-[8px] font-mono text-neutral-400 uppercase">Author Name</label>
              <input
                type="text"
                value={footAuthor}
                onChange={(e) => setFootAuthor(e.target.value)}
                className="w-full bg-[#fafafa] border border-neutral-300 px-1.5 py-1 text-[11px] focus:outline-none focus:border-black font-sans"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono text-neutral-400 uppercase">Email</label>
              <input
                type="text"
                value={footEmail}
                onChange={(e) => setFootEmail(e.target.value)}
                className="w-full bg-[#fafafa] border border-neutral-300 px-1.5 py-1 text-[11px] focus:outline-none focus:border-black font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-[8px] font-mono text-neutral-400 uppercase">Instagram</label>
                <input
                  type="text"
                  value={footInsta}
                  onChange={(e) => setFootInsta(e.target.value)}
                  className="w-full bg-[#fafafa] border border-neutral-300 px-1.5 py-1 text-[11px] focus:outline-none focus:border-black font-sans"
                />
              </div>
              <div>
                <label className="block text-[8px] font-mono text-neutral-400 uppercase">Youtube</label>
                <input
                  type="text"
                  value={footYoutube}
                  onChange={(e) => setFootYoutube(e.target.value)}
                  className="w-full bg-[#fafafa] border border-neutral-300 px-1.5 py-1 text-[11px] focus:outline-none focus:border-black font-sans"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-black text-[#fafafa] text-[9px] py-1.5 transition-colors uppercase font-mono tracking-widest flex items-center justify-center gap-1 mt-1"
            >
              <Save className="w-3 h-3" /> Save Profile Info
            </button>
          </form>
        </div>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 overflow-y-auto bg-white p-8 md:p-12">
        {(isAddingNew || editingItem) ? (
          <div className="max-w-2xl mx-auto">
            <div className="border-b border-[#0d0d0d]/10 pb-4 mb-6">
              <h2 className="font-display text-xl font-medium tracking-tight">
                {isAddingNew ? 'Create New Archive' : `Edit: ${editingItem?.title}`}
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                {isAddingNew ? '새로운 기억과 사유의 조각을 기록합니다.' : `ID: ${editingItem?.id}`}
              </p>
            </div>

            <form 
              onSubmit={handleSaveItem} 
              onKeyDown={(e) => {
                const target = e.target as HTMLElement;
                if (e.key === 'Enter' && target.tagName === 'INPUT') {
                  e.preventDefault();
                }
              }}
              className="space-y-6"
            >
              {/* Category selector */}
              <div className="grid grid-cols-5 gap-1 bg-neutral-100 p-1 border border-[#0d0d0d]/5">
                {(['Visual', 'Texts', 'Object', 'Films', 'Etc'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      if (!editingItem) {
                        setSelectedCategory(cat);
                      } else {
                        alert('이미 등록된 항목의 카테고리는 가공할 수 없습니다.');
                      }
                    }}
                    className={`py-1.5 text-[11px] font-mono uppercase tracking-widest text-center transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Shared Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                    Title * (제목)
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter visual or object name..."
                    className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                    Year (연도)
                  </label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                    required
                  />
                </div>
              </div>

              {selectedCategory !== 'Films' && (
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                    Summary (짧은 요약 한 줄)
                  </label>
                  <input
                    type="text"
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Design thought, main mood or high-level outline..."
                    maxLength={150}
                    className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                  />
                </div>
              )}

              {/* Category-Specific Form Sections */}
              {selectedCategory === 'Visual' && (
                <div className="space-y-4 border-t border-neutral-100 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Subcategory (컨셉 유형)
                      </label>
                      <select
                        value={visualType}
                        onChange={(e) => setVisualType(e.target.value)}
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      >
                        {visualCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Artist (아티스트)
                      </label>
                      <input
                        type="text"
                        value={visualArtist}
                        onChange={(e) => setVisualArtist(e.target.value)}
                        placeholder="e.g. Fritz Hansen / In-house / Personal"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploadField
                      label="Main Image (메인 이미지)"
                      value={visualImageUrl}
                      onChange={setVisualImageUrl}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1 flex justify-between items-center">
                      <span>Scrolling Image Gallery (추가 스크롤링 이미지)</span>
                      <button
                        type="button"
                        onClick={() => setVisualSubImages([...visualSubImages, ''])}
                        className="text-[9px] font-mono text-[#0d0d0d] hover:underline uppercase flex items-center gap-1"
                      >
                        <Plus size={10} /> Add Image (사진 추가)
                      </button>
                    </label>

                    {visualSubImages.length === 0 ? (
                      <div className="text-[11px] text-neutral-400 font-sans border border-dashed border-neutral-200 p-4 text-center select-none bg-white">
                        등록된 추가 스크롤링 이미지가 없습니다. 우측 상단의 '사진 추가' 버튼을 눌러 추가해주세요.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto p-1 border border-neutral-100 bg-neutral-50/50">
                        {visualSubImages.map((imgUrl, index) => (
                          <div key={index} className="relative border border-neutral-200 bg-white p-2.5 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono text-neutral-500 font-bold">IMAGE #{index + 1}</span>
                              <button
                                type="button"
                                onClick={() => setVisualSubImages(visualSubImages.filter((_, idx) => idx !== index))}
                                className="text-red-500 hover:text-red-700 text-[9px] font-mono uppercase"
                              >
                                Delete (삭제)
                              </button>
                            </div>
                            <ImageUploadField
                              label=""
                              value={imgUrl || ''}
                              onChange={(newUrl) => {
                                const list = [...visualSubImages];
                                list[index] = newUrl;
                                setVisualSubImages(list);
                              }}
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={visualKeywords}
                        onChange={(e) => setVisualKeywords(e.target.value)}
                        placeholder="Swiss Grid, Minimalism, Typography (콤마 구분)"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Tools Used
                      </label>
                      <input
                        type="text"
                        value={visualTools}
                        onChange={(e) => setVisualTools(e.target.value)}
                        placeholder="Photoshop, InDesign, Glyphs (콤마 구분)"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                      In-depth Description (상세 설명)
                    </label>
                    <textarea
                      value={visualDescription}
                      onChange={(e) => setVisualDescription(e.target.value)}
                      placeholder="이 디자인 시각물에서 취해낸 아카이브적 핵심 사유와 영감을 적어주세요."
                      rows={4}
                      className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans placeholder-neutral-400"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'Texts' && (
                <div className="space-y-4 border-t border-neutral-100 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Subcategory (텍스트 유형)
                      </label>
                      <select
                        value={textType}
                        onChange={(e) => setTextType(e.target.value)}
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      >
                        {textsCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Author (기록한 필자)
                      </label>
                      <input
                        type="text"
                        value={textAuthor}
                        onChange={(e) => setTextAuthor(e.target.value)}
                        placeholder="MOOSOSIK"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <ImageUploadField
                        label="Preview Image"
                        value={textPreviewImageUrl}
                        onChange={setTextPreviewImageUrl}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                      Body Content (본문 에세이 / 메모)
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="디자인에 대한 영감 가득한 문학적 본문을 입력하세요... 공백 두 번으로 단락 나눔."
                      rows={12}
                      className="w-full bg-[#fafafa] border border-neutral-300 p-3 text-sm focus:outline-none focus:border-black font-sans leading-relaxed placeholder-neutral-400"
                      required
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'Object' && (
                <div className="space-y-4 border-t border-neutral-100 pt-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Subcategory (오브젝트 유형)
                      </label>
                      <select
                        value={objectType}
                        onChange={(e) => setObjectType(e.target.value)}
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      >
                        {objectCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Brand (브랜드)
                      </label>
                      <input
                        type="text"
                        value={objectBrand}
                        onChange={(e) => setObjectBrand(e.target.value)}
                        placeholder="Fritz Hansen"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Designer (디자이너)
                      </label>
                      <input
                        type="text"
                        value={objectDesigner}
                        onChange={(e) => setObjectDesigner(e.target.value)}
                        placeholder="Arne Jacobsen"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#0d0d0d]">
                        Material (소재)
                      </label>
                      <input
                        type="text"
                        value={objectMaterial}
                        onChange={(e) => setObjectMaterial(e.target.value)}
                        placeholder="Veneer, Chrome-plated"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <ImageUploadField
                        label="Object Image (제품 이미지)"
                        value={objectImageUrl}
                        onChange={setObjectImageUrl}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                      Favourite Point (한 줄 메모 / 명쾌한 취향)
                    </label>
                    <input
                      type="text"
                      value={objectMemo}
                      onChange={(e) => setObjectMemo(e.target.value)}
                      placeholder="e.g. '비율과 조형미가 공간을 조율한다.'"
                      className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                      Why I Archived (수집 기록한 깊은 디자이너 시선)
                    </label>
                    <textarea
                      value={objectReasonArchived}
                      onChange={(e) => setObjectReasonArchived(e.target.value)}
                      placeholder="왜 이 물건을 기억하고 기록하는지 설명해주세요."
                      rows={4}
                      className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans placeholder-neutral-400"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'Films' && (
                <div className="space-y-4 border-t border-neutral-100 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Subcategory (필름 유형)
                      </label>
                      <select
                        value={filmType}
                        onChange={(e) => setFilmType(e.target.value)}
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      >
                        {filmsCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Director (감독)
                      </label>
                      <input
                        type="text"
                        value={filmDirector}
                        onChange={(e) => setFilmDirector(e.target.value)}
                        placeholder="Shunji Iwai"
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Actor (출연자)
                      </label>
                      <input
                        type="text"
                        value={filmActor}
                        onChange={(e) => setFilmActor(e.target.value)}
                        placeholder="Hayato Ichihara, Shugo Oshinari..."
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <ImageUploadField
                        label="Cover Image (썸네일 이미지)"
                        value={filmImageUrl}
                        onChange={setFilmImageUrl}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                      One-line Work Description / Quote (작업물 한 줄 소개 및 명대사)
                    </label>
                    <textarea
                      value={filmFavoriteQuote}
                      onChange={(e) => setFilmFavoriteQuote(e.target.value)}
                      placeholder="예시:
그 속에 에테르가 있어요.
고독하지만, 영원히 잊을 수 없이 포근하고 푸르스름한 빛."
                      rows={3}
                      className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                      Music Description (음악 및 사운드 구성 설명 - 대사보다 큰 위계로 배치됨)
                    </label>
                    <textarea
                      value={filmMusic}
                      onChange={(e) => setFilmMusic(e.target.value)}
                      placeholder="영상에 어우러지는 배경 음악 기획, 사운드 질감, 연출 기법 등 음악에 대한 설명을 상세하게 입력해 주세요..."
                      rows={4}
                      className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans placeholder-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1 flex justify-between">
                      <span>YouTube Video URL (유튜브 비디오 링크 - 홈페이지 다이렉트 재생 지원)</span>
                      <span className="text-[9px] text-[#0d0d0d]/40 font-mono lowercase">예: https://www.youtube.com/watch?v=VIDEO_ID 또는 https://youtu.be/VIDEO_ID</span>
                    </label>
                    <input
                      type="url"
                      value={filmYoutubeUrl}
                      onChange={(e) => setFilmYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'Etc' && (
                <div className="space-y-4 border-t border-neutral-100 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Category Type (기타 유형)
                      </label>
                      <select
                        value={etcSubCategory}
                        onChange={(e) => setEtcSubCategory(e.target.value)}
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      >
                        {etcCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Aesthetic Link (관련 링크 URL - 선택사항)
                      </label>
                      <input
                        type="url"
                        value={etcUrl}
                        onChange={(e) => setEtcUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                        Swiss Grid Size (크기 어긋남 리듬감)
                      </label>
                      <select
                        value={etcGridSize}
                        onChange={(e) => setEtcGridSize(e.target.value as GridSize)}
                        className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans"
                      >
                        <option value="small">Small (정사각 작게)</option>
                        <option value="medium">Medium (기본)</option>
                        <option value="large">Large (크게 가득)</option>
                        <option value="tall">Tall (스위스 그리드 세로 긴축)</option>
                        <option value="wide">Wide (스위스 그리드 가로 와이드)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <ImageUploadField
                      label="Item Photo Image (이미지)"
                      value={etcImageUrl}
                      onChange={setEtcImageUrl}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">
                      Narrative / Notes
                    </label>
                    <textarea
                      value={etcDescription}
                      onChange={(e) => setEtcDescription(e.target.value)}
                      placeholder="전시, 감각적 사유, 무작위 수집물에서 추출한 미적 메모를 기록하세요."
                      rows={4}
                      className="w-full bg-[#fafafa] border border-neutral-300 p-2 text-sm focus:outline-none focus:border-black font-sans placeholder-neutral-400"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingItem(null);
                  }}
                  className="px-6 py-2 border border-neutral-300 text-xs font-mono uppercase hover:border-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-md mx-auto">
            <Settings className="w-10 h-10 text-neutral-300 mb-4 animate-spin-slow" />
            <h3 className="font-display font-medium text-lg mb-2">MOOSOSIK Control Matrix</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              좌측 목록에서 가공, 보정할 아카이브 아이템을 선택하거나 <strong className="text-black">New Archive Item</strong> 버튼을 통해 새로운 미학적 파편을 등록하십시오. 항목은 즉시 반영되고 저장됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
