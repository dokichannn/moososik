/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initialArchiveItems, initialFooterConfig } from './data/initialData';
import { ArchiveItem, Category, FooterConfig, VisualItem, TextItem, ObjectItem, FilmItem, EtcItem } from './types';
import Cursor from './components/Cursor';
import AdminPanel from './components/AdminPanel';
import RelatedFlow from './components/RelatedFlow';
import { Eye, ArrowUpRight, ArrowRight, ChevronLeft, Lock, FileText, Compass, Tv, Package, Grid, Check, Mail, Instagram, Youtube } from 'lucide-react';

function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function App() {
  // Primary state
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(initialFooterConfig);
  const [activeTab, setActiveTab] = useState<Category | 'Home'>('Home');
  
  // Detail page selection
  const [selectedDetailItem, setSelectedDetailItem] = useState<ArchiveItem | null>(null);
  const [activeDetailImageUrl, setActiveDetailImageUrl] = useState<string | null>(null);

  // Sync the active display image when details item changes
  useEffect(() => {
    if (selectedDetailItem) {
      if (selectedDetailItem.category === 'Visual') {
        setActiveDetailImageUrl(selectedDetailItem.imageUrl || '');
      } else {
        setActiveDetailImageUrl(null);
      }
    } else {
      setActiveDetailImageUrl(null);
    }
  }, [selectedDetailItem]);

  // Filters for Visual
  const [visualFilter, setVisualFilter] = useState<string>('All');
  const [visualCategories, setVisualCategories] = useState<string[]>([]);

  // Filters for Text
  const [textsFilter, setTextsFilter] = useState<string>('All');
  const [textsCategories, setTextsCategories] = useState<string[]>([]);

  // Filters for Object
  const [objectFilter, setObjectFilter] = useState<string>('All');
  const [objectCategories, setObjectCategories] = useState<string[]>([]);

  // Filters for Film
  const [filmsFilter, setFilmsFilter] = useState<string>('All');
  const [filmsCategories, setFilmsCategories] = useState<string[]>([]);

  // Filters for Etc
  const [etcFilter, setEtcFilter] = useState<string>('All');
  const [etcCategories, setEtcCategories] = useState<string[]>([]);

  // Hover states for Texts page layout
  const [textHoveredIndex, setTextHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Floating memory interaction for Home Page (opacity 10%)
  const [homeMousePos, setHomeMousePos] = useState({ x: 0, y: 0 });
  
  // Admin trigger state
  const [showAdmin, setShowAdmin] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const cachedItems = localStorage.getItem('moososik_archive_items');
    const cachedFooter = localStorage.getItem('moososik_footer_config');
    const cachedCategories = localStorage.getItem('moososik_visual_categories');
    const cachedTextsCategories = localStorage.getItem('moososik_texts_categories');
    const cachedObjectCategories = localStorage.getItem('moososik_object_categories');
    const cachedFilmsCategories = localStorage.getItem('moososik_films_categories');
    const cachedEtcCategories = localStorage.getItem('moososik_etc_categories');

    if (cachedItems) {
      setItems(JSON.parse(cachedItems));
    } else {
      setItems(initialArchiveItems);
      localStorage.setItem('moososik_archive_items', JSON.stringify(initialArchiveItems));
    }

    if (cachedFooter) {
      const parsed = JSON.parse(cachedFooter);
      if (parsed.authorName === 'woodohee' || !parsed.email || parsed.email.includes('woodohee') || parsed.email !== 'moososikkk@gmail.com' || parsed.instagram !== 'moososik.mag') {
        setFooterConfig(initialFooterConfig);
        localStorage.setItem('moososik_footer_config', JSON.stringify(initialFooterConfig));
      } else {
        setFooterConfig(parsed);
      }
    } else {
      setFooterConfig(initialFooterConfig);
      localStorage.setItem('moososik_footer_config', JSON.stringify(initialFooterConfig));
    }

    if (cachedCategories) {
      setVisualCategories(JSON.parse(cachedCategories));
    } else {
      const initialCats = ['Branding', 'Poster', 'Editorial', 'Typography', 'Web', 'Package', 'Etc'];
      setVisualCategories(initialCats);
      localStorage.setItem('moososik_visual_categories', JSON.stringify(initialCats));
    }

    if (cachedTextsCategories) {
      setTextsCategories(JSON.parse(cachedTextsCategories));
    } else {
      const initialCats = ['Thought', 'Essay', 'Interview', 'Review', 'Etc'];
      setTextsCategories(initialCats);
      localStorage.setItem('moososik_texts_categories', JSON.stringify(initialCats));
    }

    if (cachedObjectCategories) {
      setObjectCategories(JSON.parse(cachedObjectCategories));
    } else {
      const initialCats = ['Furniture', 'Lighting', 'Product', 'Graphic', 'Fashion', 'Etc'];
      setObjectCategories(initialCats);
      localStorage.setItem('moososik_object_categories', JSON.stringify(initialCats));
    }

    if (cachedFilmsCategories) {
      setFilmsCategories(JSON.parse(cachedFilmsCategories));
    } else {
      const initialCats = ['Movie', 'Documentary', 'Animation', 'Music Video', 'Etc'];
      setFilmsCategories(initialCats);
      localStorage.setItem('moososik_films_categories', JSON.stringify(initialCats));
    }

    if (cachedEtcCategories) {
      setEtcCategories(JSON.parse(cachedEtcCategories));
    } else {
      const initialCats = ['Exhibition', 'Music', 'Space', 'Website', 'Photography', 'Etc'];
      setEtcCategories(initialCats);
      localStorage.setItem('moososik_etc_categories', JSON.stringify(initialCats));
    }
  }, []);

  // Sync index body class and native mouse cursor when admin mode is accessed
  useEffect(() => {
    if (showAdmin) {
      document.body.classList.add('admin-open');
    } else {
      document.body.classList.remove('admin-open');
    }
    return () => {
      document.body.classList.remove('admin-open');
    };
  }, [showAdmin]);

  // Update lists and save
  const handleUpdateItems = (newItems: ArchiveItem[]) => {
    setItems(newItems);
    localStorage.setItem('moososik_archive_items', JSON.stringify(newItems));
  };

  const handleUpdateFooter = (config: FooterConfig) => {
    setFooterConfig(config);
    localStorage.setItem('moososik_footer_config', JSON.stringify(config));
  };

  const handleUpdateVisualCategories = (categories: string[]) => {
    setVisualCategories(categories);
    localStorage.setItem('moososik_visual_categories', JSON.stringify(categories));
    // If current filter is no longer available in the categories, reset to 'All'
    if (visualFilter !== 'All' && !categories.includes(visualFilter)) {
      setVisualFilter('All');
    }
  };

  const handleUpdateTextsCategories = (categories: string[]) => {
    setTextsCategories(categories);
    localStorage.setItem('moososik_texts_categories', JSON.stringify(categories));
    if (textsFilter !== 'All' && !categories.includes(textsFilter)) {
      setTextsFilter('All');
    }
  };

  const handleUpdateObjectCategories = (categories: string[]) => {
    setObjectCategories(categories);
    localStorage.setItem('moososik_object_categories', JSON.stringify(categories));
    if (objectFilter !== 'All' && !categories.includes(objectFilter)) {
      setObjectFilter('All');
    }
  };

  const handleUpdateFilmsCategories = (categories: string[]) => {
    setFilmsCategories(categories);
    localStorage.setItem('moososik_films_categories', JSON.stringify(categories));
    if (filmsFilter !== 'All' && !categories.includes(filmsFilter)) {
      setFilmsFilter('All');
    }
  };

  const handleUpdateEtcCategories = (categories: string[]) => {
    setEtcCategories(categories);
    localStorage.setItem('moososik_etc_categories', JSON.stringify(categories));
    if (etcFilter !== 'All' && !categories.includes(etcFilter)) {
      setEtcFilter('All');
    }
  };

  // Track mouse coordinates for text preview image floating or home background floating
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Mouse move on home for floating memories (moves items smoothly)
  const handleHomeMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHomeMousePos({ x, y });
  };

  // Filter items in categories
  const visualItems = items.filter(i => i.category === 'Visual') as VisualItem[];
  const textItems = items.filter(i => i.category === 'Texts') as TextItem[];
  const objectItems = items.filter(i => i.category === 'Object') as ObjectItem[];
  const filmItems = items.filter(i => i.category === 'Films') as FilmItem[];
  const etcItems = items.filter(i => i.category === 'Etc') as EtcItem[];

  // Filtered visual items
  const filteredVisuals = visualFilter === 'All'
    ? visualItems
    : visualItems.filter(v => v.type === visualFilter);

  // Filtered texts items
  const filteredTexts = textsFilter === 'All'
    ? textItems
    : textItems.filter(t => t.type === textsFilter);

  // Filtered object items
  const filteredObjects = objectFilter === 'All'
    ? objectItems
    : objectItems.filter(o => o.type === objectFilter);

  // Filtered film items
  const filteredFilms = filmsFilter === 'All'
    ? filmItems
    : filmItems.filter(f => f.type === filmsFilter);

  // Filtered etc items
  const filteredEtcs = etcFilter === 'All'
    ? etcItems
    : etcItems.filter(e => (e.type || e.subCategory) === etcFilter);

  // Extract custom featured highlight items for homepage visual billboard (Get the two latest added items across all archives)
  const sortedItemsForFeatured = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const featuredItemLeft = sortedItemsForFeatured[0] || initialArchiveItems[0];
  const featuredItemRight = sortedItemsForFeatured[1] || initialArchiveItems[1] || featuredItemLeft;
  const featuredItem = featuredItemLeft; // Keep for compatibility constraints

  let featuredImgLeft = '';
  let featuredImgRight = '';

  if (featuredItemLeft) {
    if (featuredItemLeft.category === 'Texts') {
      featuredImgLeft = (featuredItemLeft as any).previewImageUrl || '';
    } else {
      featuredImgLeft = featuredItemLeft.imageUrl || '';
    }
  }

  if (featuredItemRight) {
    if (featuredItemRight.category === 'Texts') {
      featuredImgRight = (featuredItemRight as any).previewImageUrl || '';
    } else {
      featuredImgRight = featuredItemRight.imageUrl || '';
    }
  }

  // Back button or jumping between items
  const handleSelectItem = (item: ArchiveItem) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedDetailItem(item);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#fafafa] text-[#0d0d0d] selection:bg-black selection:text-[#fafafa] flex flex-col font-sans transition-colors duration-300"
    >
      {/* Paper style background texture overlay */}
      <div className="paper-grain absolute inset-0 z-40 pointer-events-none" />

      {/* Elegant Custom Cursor with labels */}
      {!showAdmin && <Cursor />}

      {/* ADMIN PANEL DRAWER */}
      {showAdmin && (
        <AdminPanel
          items={items}
          onUpdateItems={handleUpdateItems}
          footerConfig={footerConfig}
          onUpdateFooter={handleUpdateFooter}
          visualCategories={visualCategories}
          onUpdateVisualCategories={handleUpdateVisualCategories}
          textsCategories={textsCategories}
          onUpdateTextsCategories={handleUpdateTextsCategories}
          objectCategories={objectCategories}
          onUpdateObjectCategories={handleUpdateObjectCategories}
          filmsCategories={filmsCategories}
          onUpdateFilmsCategories={handleUpdateFilmsCategories}
          etcCategories={etcCategories}
          onUpdateEtcCategories={handleUpdateEtcCategories}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* HEADER SYSTEM */}
      {!(activeTab === 'Home' && !selectedDetailItem) && (
        <header className="sticky top-0 z-30 bg-[#fafafa]/80 backdrop-blur-md border-b border-[#0d0d0d]/5 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-12 sm:gap-16">
            <div
              onClick={() => {
                setActiveTab('Home');
                setSelectedDetailItem(null);
              }}
              className="group flex flex-col cursor-pointer select-none"
            >
              <span className="font-sans font-bold text-base md:text-lg tracking-tight text-[#0d0d0d]">
                moososik.
              </span>
            </div>
          </div>

          {/* Centralised Minimal Menu links (moved to the right side) */}
          <nav className="flex items-center gap-6 md:gap-8">
            {(['Visual', 'Texts', 'Object', 'Films', 'Etc'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTab(cat);
                  setSelectedDetailItem(null);
                }}
                className={`text-[11px] font-sans transition-all py-1 relative ${
                  activeTab === cat && !selectedDetailItem
                    ? 'text-[#0d0d0d] font-bold border-b-2 border-black'
                    : 'text-neutral-400 hover:text-black font-medium'
                }`}
              >
                {cat === 'Etc' ? 'Ect.' : cat}
              </button>
            ))}
          </nav>
        </header>
      )}

      {/* MAIN SCREEN WRAPPER */}
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {selectedDetailItem ? (
            /* DETAIL DISPLAY WRAPPER WITH PARALLAX & RICH EDITORIAL COMPOSITION */
            <motion.div
              key={`detail-${selectedDetailItem.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-none px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 flex-1 flex flex-col justify-between"
            >
              {/* Back breadcrumbs */}
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-black/10">
                <button
                  onClick={() => setSelectedDetailItem(null)}
                  data-cursor="CLOSE"
                  className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
                >
                  <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Back to {selectedDetailItem.category} Index
                </button>
                <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-2">
                  <span>{selectedDetailItem.category}</span>
                  <span>/</span>
                  <span className="text-[#0d0d0d]">{selectedDetailItem.year}</span>
                </div>
              </div>

              {/* RENDER CATEGORY SPECIFIC LAYOUTS */}
              {selectedDetailItem.category === 'Visual' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  {/* Left Column: Big Display Image (Active Thumbnail or Main Image) */}
                  <div className="lg:col-span-7">
                    <div className="w-full flex items-center justify-center bg-white relative group border border-neutral-200 p-2 md:p-4 min-h-[300px] md:min-h-[500px]">
                      <img
                        src={activeDetailImageUrl || selectedDetailItem.imageUrl}
                        alt={selectedDetailItem.title}
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-[75vh] h-auto object-contain transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Right Column: Sticky Project Metadata */}
                  <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 pl-0 lg:pl-10">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                        {(selectedDetailItem as VisualItem).type} Visual
                      </span>
                      <h1 className="font-display font-medium text-3xl md:text-4xl tracking-tight text-[#0d0d0d] mt-2 mb-4 leading-tight">
                        {selectedDetailItem.title}
                      </h1>
                      <p className="font-mono text-xs text-neutral-400 tracking-wide uppercase">
                        {selectedDetailItem.summary}
                      </p>
                    </div>

                    <div className="border-t border-b border-black/15 py-6 my-6 space-y-4">
                      <div className="grid grid-cols-3 text-xs">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Artist</span>
                        <span className="col-span-2 font-sans text-neutral-800">{(selectedDetailItem as VisualItem).artist || 'Personal Project'}</span>
                      </div>
                      <div className="grid grid-cols-3 text-xs">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Year</span>
                        <span className="col-span-2 font-sans text-neutral-800">{selectedDetailItem.year}</span>
                      </div>
                      <div className="grid grid-cols-3 text-xs">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Keywords</span>
                        <span className="col-span-2 font-sans text-neutral-800 flex flex-wrap gap-1.5">
                          {(selectedDetailItem as VisualItem).keywords?.map((kw, i) => (
                            <span key={i} className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 text-[10px] uppercase font-mono">
                              {kw}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 text-xs">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Tools</span>
                        <span className="col-span-2 font-sans text-neutral-600 font-mono text-[10px] tracking-wide">
                          {(selectedDetailItem as VisualItem).tools?.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 text-neutral-700 text-sm leading-relaxed font-sans">
                      <p className="whitespace-pre-line">
                        {(selectedDetailItem as VisualItem).description}
                      </p>
                    </div>

                    {/* Interactive Thumbnail Selector for scrolling images at the bottom of description */}
                    {(((selectedDetailItem as VisualItem).images && (selectedDetailItem as VisualItem).images.length > 0) || selectedDetailItem.imageUrl) && (
                      <div className="pt-8 border-t border-black/10 mt-8 space-y-3">
                        <span className="font-mono text-lg font-black tracking-[0.4em] text-[#0d0d0d]/80 block select-none leading-none">
                          ...
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {/* Always include the main image as option 1 */}
                          {selectedDetailItem.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setActiveDetailImageUrl(selectedDetailItem.imageUrl)}
                              className={`aspect-square overflow-hidden bg-neutral-100 border transition-all ${
                                activeDetailImageUrl === selectedDetailItem.imageUrl
                                  ? 'border-black ring-1 ring-black scale-95'
                                  : 'border-[#0d0d0d]/10 hover:border-black/50 hover:scale-[1.02]'
                              }`}
                            >
                              <img
                                src={selectedDetailItem.imageUrl}
                                alt="Main Thumb"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          )}

                          {/* Render other sub images only if they are not identical to main image */}
                          {(selectedDetailItem as VisualItem).images?.filter(imgUrl => imgUrl !== selectedDetailItem.imageUrl).map((imgUrl, i) => {
                            const isSelected = activeDetailImageUrl === imgUrl;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setActiveDetailImageUrl(imgUrl)}
                                className={`aspect-square overflow-hidden bg-neutral-100 border transition-all ${
                                  isSelected
                                    ? 'border-black ring-1 ring-black scale-95'
                                    : 'border-[#0d0d0d]/10 hover:border-black/50 hover:scale-[1.02]'
                                }`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Sub Thumb ${i + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedDetailItem.category === 'Texts' && (
                <div className="max-w-3xl mx-auto py-6 space-y-8">
                  {/* Top beautiful editorial banner/thumbnail */}
                  {((selectedDetailItem as TextItem).previewImageUrl || selectedDetailItem.imageUrl) && (
                    <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden bg-[#fafafa] border border-neutral-300">
                      <img
                        src={(selectedDetailItem as TextItem).previewImageUrl || selectedDetailItem.imageUrl}
                        alt="Editorial thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center space-y-4 pt-2 pb-6 border-b border-black/5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                        EDITORIAL THOUGHTS
                      </span>
                      <h1 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight text-[#0d0d0d] leading-tight">
                        {selectedDetailItem.title}
                      </h1>
                      <div className="flex items-center justify-center gap-2 font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                        <span>By {(selectedDetailItem as TextItem).author || 'MOOSOSIK'}</span>
                        <span>•</span>
                        <span>{selectedDetailItem.year}</span>
                      </div>
                    </div>

                    <div className="space-y-6 text-neutral-800 text-sm sm:text-base leading-[1.8] font-sans antialiased">
                      {(selectedDetailItem as TextItem).content?.split('\n\n').map((paragraph, i) => (
                        <p
                          key={i}
                          className="transition-all duration-300 hover:text-black py-2 hover:pl-4 pl-0 border-l border-transparent hover:border-black/20"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedDetailItem.category === 'Object' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto py-10 px-4 md:px-0">
                  {/* Left Column: Big Display Image (Active Thumbnail or Main Image) */}
                  <div className="lg:col-span-7">
                    <div className="w-full flex items-center justify-center bg-white relative group border border-neutral-200 p-2 md:p-4 min-h-[300px] md:min-h-[500px]">
                      <img
                        src={activeDetailImageUrl || selectedDetailItem.imageUrl}
                        alt={selectedDetailItem.title}
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-[75vh] h-auto object-contain transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Right Column: Sticky Project Metadata */}
                  <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 pl-0 lg:pl-10">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                        {selectedDetailItem.type || 'FURNITURE'} Object
                      </span>
                      <h1 className="font-display font-medium text-3xl md:text-4xl tracking-tight text-[#0d0d0d] mt-2 mb-4 leading-tight">
                        {selectedDetailItem.title}
                      </h1>
                      <div className="font-serif italic text-xs text-neutral-400 mt-2">
                        "{(selectedDetailItem as ObjectItem).memo}"
                      </div>
                    </div>

                    <div className="divide-y divide-black/10 border-t border-b border-black/10 py-4 my-2 text-xs font-sans">
                      <div className="py-2.5 grid grid-cols-3">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Brand</span>
                        <span className="col-span-2 text-neutral-800">{(selectedDetailItem as ObjectItem).brand}</span>
                      </div>
                      <div className="py-2.5 grid grid-cols-3">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Designer</span>
                        <span className="col-span-2 text-neutral-800">{(selectedDetailItem as ObjectItem).designer}</span>
                      </div>
                      <div className="py-2.5 grid grid-cols-3">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Material</span>
                        <span className="col-span-2 text-neutral-800">{(selectedDetailItem as ObjectItem).material}</span>
                      </div>
                      <div className="py-2.5 grid grid-cols-3">
                        <span className="font-mono text-neutral-400 uppercase text-[9px] tracking-wider">Year Initiated</span>
                        <span className="col-span-2 text-neutral-800">{selectedDetailItem.year}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">Reason I Archived:</h4>
                      <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line font-sans">
                        {(selectedDetailItem as ObjectItem).reasonArchived}
                      </p>
                    </div>

                    {/* Interactive Thumbnail Selector for scrolling images at the bottom of description */}
                    {((((selectedDetailItem as ObjectItem).images && ((selectedDetailItem as ObjectItem).images || []).length > 0) || selectedDetailItem.imageUrl)) && (
                      <div className="pt-8 border-t border-black/10 mt-8 space-y-3">
                        <span className="font-mono text-lg font-black tracking-[0.4em] text-[#0d0d0d]/80 block select-none leading-none">
                          ...
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {/* Always include the main image as option 1 */}
                          {selectedDetailItem.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setActiveDetailImageUrl(selectedDetailItem.imageUrl)}
                              className={`aspect-square overflow-hidden bg-neutral-100 border transition-all ${
                                activeDetailImageUrl === selectedDetailItem.imageUrl
                                  ? 'border-black ring-1 ring-black scale-95'
                                  : 'border-[#0d0d0d]/10 hover:border-black/50 hover:scale-[1.02]'
                              }`}
                            >
                              <img
                                src={selectedDetailItem.imageUrl}
                                alt="Main Thumb"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          )}

                          {/* Render other sub images only if they are not identical to main image */}
                          {(selectedDetailItem as ObjectItem).images?.filter(imgUrl => imgUrl !== selectedDetailItem.imageUrl).map((imgUrl, i) => {
                            const isSelected = activeDetailImageUrl === imgUrl;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setActiveDetailImageUrl(imgUrl)}
                                className={`aspect-square overflow-hidden bg-neutral-100 border transition-all ${
                                  isSelected
                                    ? 'border-black ring-1 ring-black scale-95'
                                    : 'border-[#0d0d0d]/10 hover:border-black/50 hover:scale-[1.02]'
                                }`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Sub Thumb ${i + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}              {selectedDetailItem.category === 'Films' && (() => {
                const film = selectedDetailItem as FilmItem;
                const youtubeId = getYouTubeId(film.youtubeUrl);
                return (
                  <div className="max-w-7xl mx-auto py-8 px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                      {/* Left Column: Big Player or Cover Image (takes 7/12 cols) */}
                      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                        {youtubeId ? (
                          <div className="relative aspect-video w-full overflow-hidden bg-black border border-neutral-200 shadow-sm">
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                              title={selectedDetailItem.title}
                              className="w-full h-full border-0 absolute inset-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 group border border-neutral-200">
                            <img
                              src={selectedDetailItem.imageUrl}
                              alt={selectedDetailItem.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.02]"
                            />
                          </div>
                        )}
                      </div>

                      {/* Right Column: Metadata and Explanations (takes 5/12 cols) */}
                      <div className="lg:col-span-5 xl:col-span-4 space-y-6 md:space-y-8">
                        <div>
                          <span className="font-mono text-[#0d0d0d]/40 text-[9px] uppercase tracking-widest block mb-1">
                            {film.type || 'Film'}
                          </span>
                          <h2 className="font-display font-medium text-xl sm:text-2xl lg:text-3xl tracking-tight text-[#0d0d0d] leading-tight">
                            {film.title}
                          </h2>
                        </div>

                        {/* Famous Quote (명대사는 제목 없이 적은 내용만 구현) */}
                        {film.favoriteQuote && (
                          <div className="py-1">
                            <p className="font-serif italic text-neutral-700 text-sm sm:text-base leading-relaxed bg-[#fafafa] p-4 border-l border-neutral-300 whitespace-pre-wrap">
                              "{film.favoriteQuote}"
                            </p>
                          </div>
                        )}

                          {/* Unified Metadata Table */}
                          <div className="pt-4 border-t border-black/5 space-y-3 font-sans text-xs">
                            <div className="grid grid-cols-3 py-1 border-b border-black/[0.03]">
                              <span className="font-mono text-neutral-400 text-[9px] uppercase tracking-wider block">Title</span>
                              <span className="col-span-2 text-neutral-900 font-medium">{film.title}</span>
                            </div>
                            <div className="grid grid-cols-3 py-1 border-b border-black/[0.03]">
                              <span className="font-mono text-neutral-400 text-[9px] uppercase tracking-wider block">Director</span>
                              <span className="col-span-2 text-neutral-800 font-sans">{film.director || '-'}</span>
                            </div>
                            {(film.actor || film.author) && (
                              <div className="grid grid-cols-3 py-1 border-b border-black/[0.03]">
                                <span className="font-mono text-neutral-400 text-[9px] uppercase tracking-wider block">Actor</span>
                                <span className="col-span-2 text-neutral-800 font-sans">{film.actor || film.author}</span>
                              </div>
                            )}
                            {film.music && (
                              <div className="grid grid-cols-3 py-1 border-b border-black/[0.03]">
                                <span className="font-mono text-neutral-400 text-[9px] uppercase tracking-wider block">Music</span>
                                <span className="col-span-2 text-neutral-700 font-sans whitespace-pre-wrap">{film.music}</span>
                              </div>
                            )}
                            <div className="grid grid-cols-3 py-1 border-b border-black/[0.03]">
                              <span className="font-mono text-neutral-400 text-[9px] uppercase tracking-wider block">Year</span>
                              <span className="col-span-2 text-neutral-800 font-mono">{film.year}</span>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {selectedDetailItem.category === 'Etc' && (
                <div className="max-w-3xl mx-auto py-10 space-y-8">
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                    <img
                      src={selectedDetailItem.imageUrl}
                      alt={selectedDetailItem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest bg-neutral-100 px-2 py-0.5 text-neutral-600 rounded">
                          {(selectedDetailItem as EtcItem).subCategory}
                        </span>
                        <h1 className="font-display font-medium text-2xl tracking-tight text-[#0d0d0d] mt-2">
                          {selectedDetailItem.title}
                        </h1>
                      </div>
                      <span className="font-mono text-sm text-neutral-400">{selectedDetailItem.year}</span>
                    </div>

                    <p className="text-neutral-700 text-sm leading-relaxed font-sans prose max-w-none">
                      {(selectedDetailItem as EtcItem).description}
                    </p>

                    {(selectedDetailItem as EtcItem).url && (
                      <div className="pt-4">
                        <a
                          href={(selectedDetailItem as EtcItem).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-black hover:underline"
                        >
                          Visit Aesthetic Space Reference <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related taste exploration system */}
              <RelatedFlow
                relatedIds={(selectedDetailItem as any).relatedIds}
                allItems={items}
                onSelectRelated={handleSelectItem}
              />
            </motion.div>
          ) : (
            /* RENDERS INDEX SCREENS OR HOME MASTER SCREEN */
            <motion.div
              key={`tab-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* HOME SCREEN VIEW */}
              {activeTab === 'Home' && (
                <div className="flex-1 flex flex-col justify-between relative bg-[#fafafa]">
                    {/* Editorial magazine hero section */}
                    <div className="w-full max-w-none px-4 sm:px-8 md:px-12 lg:px-16 pt-8 sm:pt-12 md:pt-16 z-10 space-y-12">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0d0d0d]/10 pb-8 gap-8">
                        <div className="relative inline-flex items-start select-none">
                          <h1 className="font-sans font-bold text-6xl md:text-[5.5rem] tracking-tighter text-[#0d0d0d] leading-none">
                            moososik.
                          </h1>
                        </div>

                        {/* Categories Menu on the right */}
                        <div className="flex items-center gap-4 sm:gap-6 text-[13px] font-sans text-neutral-500 font-medium md:pt-8 flex-wrap">
                          {(['Visual', 'Texts', 'Object', 'Films', 'Etc'] as Category[]).map((cat, idx) => (
                            <React.Fragment key={cat}>
                              {idx > 0 && <span className="text-neutral-300">/</span>}
                              <button
                                onClick={() => {
                                  setActiveTab(cat);
                                  setSelectedDetailItem(null);
                                }}
                                className="hover:text-black hover:underline transition-colors font-semibold"
                              >
                                {cat === 'Etc' ? 'Etc.' : cat}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>                      {/* Featured Item Layout (matching the artwork layout style with giant architectural brackets) */}
                      <div className="pt-2 pb-24 md:pb-36 lg:pb-44 relative overflow-visible select-none">
                        {/* Bracket and Content Wrapper */}
                        <div className="relative overflow-visible flex items-center justify-center min-h-[300px] md:min-h-[420px] lg:min-h-[500px]">
                          {/* Left Giant Bracket */}
                          <div className="absolute left-0 sm:left-2 md:-left-4 lg:-left-6 xl:-left-8 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                            <span className="text-[180px] sm:text-[250px] md:text-[380px] lg:text-[480px] xl:text-[560px] font-extralight text-black font-sans tracking-tighter block select-none leading-none">
                              (
                            </span>
                          </div>
                          
                          {/* Right Giant Bracket */}
                          <div className="absolute right-0 sm:right-2 md:-right-4 lg:-right-8 xl:-right-12 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                            <span className="text-[180px] sm:text-[250px] md:text-[380px] lg:text-[480px] xl:text-[560px] font-extralight text-black font-sans tracking-tighter block select-none leading-none">
                              )
                            </span>
                          </div>

                          {/* Content Container padded to float inside the brackets (Very generous margins for a classy, trendy look) */}
                          {/* Placed slightly lower (mt-8 sm:mt-12 md:mt-16 lg:mt-24) to keep it inside the bracket loops and visually lowered */}
                          <div className="w-full px-6 sm:px-28 md:px-44 lg:px-56 xl:px-72 z-10 mt-8 sm:mt-12 md:mt-16 lg:mt-24">
                            {/* Two Columns featuring distinct items with hover text overlays */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 pt-2">
                              {/* Column 1 - Left Item */}
                              <div
                                onClick={() => handleSelectItem(featuredItemLeft)}
                                className="flex flex-col gap-4 group cursor-pointer"
                              >
                                <div
                                  className="relative overflow-hidden border border-neutral-200 aspect-[4/3] md:aspect-[16/10] bg-neutral-100"
                                >
                                  <img
                                    src={featuredImgLeft}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover brightness-95 opacity-90 group-hover:opacity-100 group-hover:scale-[1.015] transition-all duration-700"
                                  />
                                  {/* black overlay displaying title and description/summary on hover */}
                                  <div className="absolute inset-0 bg-[#0d0d0d]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 text-white">
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">[ {featuredItemLeft.category} ]</span>
                                    <h2 className="font-sans font-medium text-base sm:text-lg md:text-xl text-white tracking-tight leading-snug">
                                      {featuredItemLeft.title}
                                    </h2>
                                    <p className="mt-2 text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                                      {featuredItemLeft.summary}
                                    </p>
                                    <div className="mt-4 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                                      <span>view more</span>
                                      <span className="text-neutral-600">/</span>
                                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Column 2 - Right Item */}
                              <div
                                onClick={() => handleSelectItem(featuredItemRight)}
                                className="flex flex-col gap-4 group cursor-pointer"
                              >
                                <div
                                  className="relative overflow-hidden border border-neutral-200 aspect-[4/3] md:aspect-[16/10] bg-neutral-100"
                                >
                                  <img
                                    src={featuredImgRight}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover brightness-95 opacity-90 group-hover:opacity-100 group-hover:scale-[1.015] transition-all duration-700"
                                  />
                                  {/* black overlay displaying title and description/summary on hover */}
                                  <div className="absolute inset-0 bg-[#0d0d0d]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 text-white">
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">[ {featuredItemRight.category} ]</span>
                                    <h2 className="font-sans font-medium text-base sm:text-lg md:text-xl text-white tracking-tight leading-snug">
                                      {featuredItemRight.title}
                                    </h2>
                                    <p className="mt-2 text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                                      {featuredItemRight.summary}
                                    </p>
                                    <div className="mt-4 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                                      <span>view more</span>
                                      <span className="text-neutral-600">/</span>
                                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Scrollable Bottom Section: Recently archives */}
                    <div id="recent-archive-section" className="w-full bg-[#fafafa] pb-16 pt-4 px-4 sm:px-8 md:px-12 lg:px-16 z-10 relative">
                      {/* Divider matching outer container's width exactly */}
                      <div className="border-t border-[#0d0d0d]/10 mb-16" />
                      <div className="w-full max-w-none space-y-8">
                       <div className="flex justify-between items-baseline mb-6 pb-2">
                          <h3 className="font-sans text-lg font-semibold tracking-tight text-[#0d0d0d]">+ the more</h3>
                       </div>
 
                       {/* Curated smaller thumbnail list with a constrained width and opacity hierarchy */}
                       <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3 sm:gap-4 md:gap-5">
                         {[...items]
                           .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                           .slice(0, 12)
                           .map((item, index) => {
                             let cardImage = '';
                             if (item.category === 'Texts') {
                               cardImage = (item as any).previewImageUrl || '';
                             } else {
                               cardImage = item.imageUrl;
                             }
                             if (!cardImage) return null;
 
                             return (
                               <div
                                 key={item.id}
                                 onClick={() => handleSelectItem(item)}
                                 className={`group cursor-pointer aspect-[3/4] overflow-hidden border border-neutral-200/60 bg-neutral-100 relative transition-all duration-300 hover:border-black/30 opacity-75 hover:opacity-100 ${
                                   index >= 8 ? 'hidden xl:block' : index >= 6 ? 'hidden lg:block' : index >= 4 ? 'hidden md:block' : index >= 3 ? 'hidden sm:block' : ''
                                 }`}
                                 title={`${item.title} [${item.category}]`}
                               >
                                 <img
                                   src={cardImage}
                                   alt={item.title}
                                   referrerPolicy="no-referrer"
                                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-750" />
                                   <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                     <span className="bg-[#0d0d0d] text-white text-[8px] uppercase font-mono tracking-widest px-2 py-1 flex items-center gap-1 shadow-lg select-none">
                                       view
                                       <ArrowRight className="w-2.5 h-2.5 text-neutral-300" strokeWidth={1.8} />
                                     </span>
                                   </div>
                               </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VISUAL INDEX TAB */}
              {activeTab === 'Visual' && (
                <div className="w-full max-w-none px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 space-y-10 flex-1">
                  <div className="space-y-4 border-b border-black/10 pb-6">
                    <h1 className="font-display font-medium text-4xl tracking-tight text-[#0d0d0d]">Visual</h1>
                    
                    {/* Nested filter list */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      {['All', ...visualCategories].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setVisualFilter(filter)}
                          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                            visualFilter === filter
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredVisuals.length === 0 ? (
                    <div className="py-20 text-center text-xs text-neutral-400 font-mono">
                      등록된 시각 자료가 존재하지 않습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-neutral-300">
                      {filteredVisuals.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className="group bg-white border-r border-b border-neutral-300 p-6 flex flex-col justify-between min-h-[480px] cursor-pointer transition-all duration-300 hover:bg-[#fafafa] relative overflow-hidden"
                        >
                          {/* Hover Memoir Overlay */}
                          <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-black/95 via-black/40 to-black/70 p-5 opacity-0 group-hover:opacity-100 transition-all duration-350 text-white z-10 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-300 block border-b border-white/20 pb-1">
                                Archived Visual
                              </span>
                              <h4 className="font-sans font-medium text-xs text-white leading-tight mt-2 uppercase">
                                {item.title}
                              </h4>
                            </div>

                            <div className="grow flex items-center py-4">
                              <p className="font-sans text-neutral-200 text-xs sm:text-sm leading-relaxed line-clamp-6">
                                {item.description}
                              </p>
                            </div>

                            <div className="font-mono text-[9px] text-neutral-400 flex justify-between items-center border-t border-white/10 pt-2">
                              <span>{item.artist || 'Personal'}</span>
                              <span>{item.year}</span>
                            </div>
                          </div>

                          {/* Top Row Labels */}
                          <div className="flex justify-between items-start text-[9.5px] font-mono uppercase tracking-wider text-neutral-450">
                            <span className="truncate max-w-[140px] text-neutral-400 font-medium">{item.artist || 'Personal'}</span>
                            {item.type && (
                              <span className="bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded text-[8px] tracking-wider uppercase font-semibold">
                                {item.type}
                              </span>
                            )}
                          </div>

                          {/* Center Floating Image - beautiful white backdrop with safe padding */}
                          <div className="w-full h-[280px] flex items-center justify-center p-1 bg-[#fafafa]/50 border border-neutral-100 my-4 overflow-hidden relative">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full object-contain transition-all duration-750 ease-in-out group-hover:scale-105"
                            />
                          </div>

                          {/* Bottom Row */}
                          <div className="flex justify-between items-baseline pt-1">
                            <h4 className="font-sans font-medium text-xs sm:text-[13px] text-neutral-900 leading-snug group-hover:text-black line-clamp-1 pr-2">
                              {item.title}
                            </h4>
                            <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400 flex-shrink-0">{item.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TEXTS INDEX TAB */}
              {activeTab === 'Texts' && (
                <div className="w-full max-w-none px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 flex-1 flex flex-col relative">
                  <div className="space-y-4 border-b border-black/10 pb-6 mb-10">
                    <h1 className="font-display font-medium text-4xl tracking-tight text-[#0d0d0d]">
                      Texts
                    </h1>
                    
                    {/* Nested filter list */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      {['All', ...textsCategories].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setTextsFilter(filter)}
                          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                            textsFilter === filter
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredTexts.length === 0 ? (
                    <div className="py-20 text-center text-xs text-neutral-400 font-mono">
                      등록된 아카이브가 없습니다.
                    </div>
                  ) : (
                    <div className="divide-y divide-black/10 flex-grow">
                      {filteredTexts.map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          data-cursor="READ"
                          className="group py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors hover:bg-neutral-50"
                        >
                          <div className="flex-1 pr-6 space-y-2">
                            <p className="font-mono text-[10px] text-neutral-400">
                              <span>{item.year}</span>
                              {item.type && (
                                <span className="ml-2 bg-neutral-100 text-neutral-500 px-1 py-0.5 rounded text-[9px] uppercase tracking-wider">
                                  {item.type}
                                </span>
                              )}
                            </p>
                            <h3 className="font-sans text-lg font-medium text-neutral-900 group-hover:text-black leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-xs text-neutral-400 leading-normal line-clamp-1 pr-2">
                              {item.summary}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-neutral-400 group-hover:text-black transition-colors self-end sm:self-auto">
                            <span>Read Article</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* OBJECT INDEX TAB */}
              {activeTab === 'Object' && (
                <div className="w-full max-w-none px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 space-y-10 flex-1">
                  <div className="space-y-4 border-b border-black/10 pb-6">
                    <h1 className="font-display font-medium text-4xl tracking-tight text-[#0d0d0d]">Object</h1>
                    
                    {/* Nested filter list */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      {['All', ...objectCategories].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setObjectFilter(filter)}
                          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                            objectFilter === filter
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredObjects.length === 0 ? (
                    <div className="py-20 text-center text-xs text-neutral-400 font-mono">
                      등록된 오브젝트 아이템 아카이브가 없습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-neutral-300">
                      {filteredObjects.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className="group bg-white border-r border-b border-neutral-300 p-6 flex flex-col justify-between min-h-[480px] cursor-pointer transition-all duration-300 hover:bg-[#fafafa] relative overflow-hidden"
                        >
                          {/* Hover Memoir Overlay - Matches the elegance of Films */}
                          <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-black/95 via-black/40 to-black/70 p-5 opacity-0 group-hover:opacity-100 transition-all duration-350 text-white z-10 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-300 block border-b border-white/20 pb-1">
                                Archived Memoir
                              </span>
                              <h4 className="font-sans font-medium text-xs text-white leading-tight mt-2 uppercase">
                                {item.title}
                              </h4>
                            </div>

                            <div className="grow flex items-center py-4">
                              <p className="font-serif italic text-neutral-200 text-xs sm:text-sm leading-relaxed line-clamp-6">
                                "{item.memo}"
                              </p>
                            </div>

                            <div className="font-mono text-[9px] text-neutral-400 flex justify-between items-center border-t border-white/10 pt-2">
                              <span>{item.brand}</span>
                              <span>{item.year}</span>
                            </div>
                          </div>

                          {/* Top Row Labels */}
                          <div className="flex justify-between items-start text-[9.5px] font-mono uppercase tracking-wider text-neutral-450">
                            <span className="truncate max-w-[140px] text-neutral-400 font-medium">{item.brand}</span>
                            {item.type && (
                              <span className="bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded text-[8px] tracking-wider uppercase font-semibold">
                                {item.type}
                              </span>
                            )}
                          </div>

                          {/* Center Floating Image - beautiful white backdrop with safe padding to center any aspect ratio shape perfectly */}
                          <div className="w-full h-[280px] flex items-center justify-center p-1 bg-[#fafafa]/50 border border-neutral-100 my-4 overflow-hidden relative">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full object-contain transition-all duration-750 ease-in-out group-hover:scale-105"
                            />
                          </div>

                          {/* Bottom Row */}
                          <div className="flex justify-between items-baseline pt-1">
                            <h4 className="font-sans font-medium text-xs sm:text-[13px] text-neutral-900 leading-snug group-hover:text-black line-clamp-1 pr-2">
                              {item.title}
                            </h4>
                            <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400 flex-shrink-0">{item.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FILMS INDEX TAB */}
              {activeTab === 'Films' && (
                <div className="w-full max-w-none px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 space-y-10 flex-1">
                  <div className="space-y-4 border-b border-black/10 pb-6">
                    <h1 className="font-display font-medium text-4xl tracking-tight text-[#0d0d0d]">
                      Films
                    </h1>
                    
                    {/* Nested filter list */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      {['All', ...filmsCategories].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setFilmsFilter(filter)}
                          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                            filmsFilter === filter
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredFilms.length === 0 ? (
                    <div className="py-20 text-center text-xs text-neutral-400 font-mono">
                      등록된 영화 속 한 장면이 없습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredFilms.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className="group cursor-pointer space-y-2 text-left"
                        >
                          {/* Card Thumbnail Area */}
                          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 border border-neutral-200">
                            {/* Grayscale on hover */}
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale" 
                            />
                            
                            {/* Elegant Cinematic Hover Info Overlay (Grayscale background layered with metadata text) */}
                            {(() => {
                              const filmItem = item as FilmItem;
                              return (
                                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/85 via-transparent to-black/50 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white z-10 flex flex-col justify-between">
                                  {/* Top Row: Year */}
                                  <div className="flex justify-end font-mono text-[9px] uppercase tracking-wider text-neutral-200">
                                    <span>{filmItem.year}</span>
                                  </div>

                                  {/* Info Area */}
                                  <div className="space-y-1.5">
                                    <h3 className="font-sans font-semibold text-xs sm:text-sm tracking-tight text-white uppercase line-clamp-2 leading-tight">
                                      {filmItem.title}
                                    </h3>
                                    <div className="font-mono text-[8px] sm:text-[9px] text-neutral-300 space-y-0.5 pt-1 border-t border-white/10">
                                      <div className="flex justify-between gap-2">
                                        <span className="text-neutral-400 uppercase text-[8px] tracking-wider">Director</span>
                                        <span className="text-white font-sans truncate text-[9px] sm:text-[10px]">{filmItem.director}</span>
                                      </div>
                                      {(filmItem.actor || filmItem.author) && (
                                        <div className="flex justify-between gap-2">
                                          <span className="text-neutral-400 uppercase text-[8px] tracking-wider">Actor</span>
                                          <span className="text-white font-sans truncate text-[9px] sm:text-[10px]">{filmItem.actor || filmItem.author}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Base Text Info (Visible when NOT hovered - sized larger) */}
                          <div className="flex justify-between items-baseline pt-1.5">
                            <div className="min-w-0 pr-2 space-y-0.5">
                              {/* Title with Category Badge in Front */}
                              <h4 className="font-sans font-medium text-xs sm:text-[13px] text-neutral-900 group-hover:text-black leading-snug flex flex-wrap items-center gap-1.5">
                                {item.type && (
                                  <span className="bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded text-[8px] sm:text-[9px] font-mono uppercase font-semibold tracking-wider">
                                    {item.type}
                                  </span>
                                )}
                                <span className="truncate">{item.title}</span>
                              </h4>
                              {/* Subtitle / Director */}
                              <p className="text-[10px] sm:text-[11px] font-sans text-neutral-400">
                                <span>{item.director}</span>
                              </p>
                            </div>
                            <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400 flex-shrink-0">{item.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ETC ASYMMETRIC GRID TAB */}
              {activeTab === 'Etc' && (
                <div className="w-full max-w-none px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 space-y-10 flex-1">
                  <div className="space-y-4 border-b border-black/10 pb-6">
                    <h1 className="font-display font-medium text-4xl tracking-tight text-[#0d0d0d]">Etc</h1>
                    
                    {/* Nested filter list */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      {['All', ...etcCategories].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setEtcFilter(filter)}
                          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                            etcFilter === filter
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredEtcs.length === 0 ? (
                    <div className="py-20 text-center text-xs text-neutral-400 font-mono">
                      등록된 수집 아카이브가 없습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-neutral-300">
                      {filteredEtcs.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className="group bg-white border-r border-b border-neutral-300 p-6 flex flex-col justify-between min-h-[420px] cursor-pointer transition-all duration-300 hover:bg-[#fafafa] relative overflow-hidden"
                        >
                          {/* Hover Memoir Overlay */}
                          <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-black/95 via-black/40 to-black/70 p-5 opacity-0 group-hover:opacity-100 transition-all duration-350 text-white z-10 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-300 block border-b border-white/20 pb-1">
                                Archived Memoir
                              </span>
                              <h4 className="font-sans font-medium text-xs text-white leading-tight mt-2 uppercase">
                                {item.title}
                              </h4>
                            </div>

                            <div className="grow flex items-center py-4">
                              <p className="font-sans text-neutral-200 text-xs sm:text-sm leading-relaxed line-clamp-6">
                                "{item.description}"
                              </p>
                            </div>

                            <div className="font-mono text-[9px] text-neutral-400 flex justify-between items-center border-t border-white/10 pt-2">
                              <span>{item.subCategory || item.type || 'ETC'}</span>
                              <span>{item.year}</span>
                            </div>
                          </div>

                          {/* Top Row Labels */}
                          <div className="flex justify-between items-start text-[9.5px] font-mono uppercase tracking-wider text-neutral-450">
                            <span className="truncate max-w-[140px] text-neutral-400 font-medium">{item.subCategory || item.type || '-'}</span>
                            {item.type && (
                              <span className="bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded text-[8px] tracking-wider uppercase font-semibold">
                                {item.type}
                              </span>
                            )}
                          </div>

                          {/* Center Floating Image - beautiful white backdrop with safe padding */}
                          <div className="w-full h-[220px] flex items-center justify-center p-4 bg-[#fafafa]/50 border border-neutral-100 my-4 overflow-hidden relative">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full object-contain transition-all duration-750 ease-in-out group-hover:scale-105"
                            />
                          </div>

                          {/* Bottom Row */}
                          <div className="flex justify-between items-baseline pt-1">
                            <h4 className="font-sans font-medium text-xs sm:text-[13px] text-neutral-900 leading-snug group-hover:text-black line-clamp-1 pr-2">
                              {item.title}
                            </h4>
                            <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400 flex-shrink-0">{item.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER SYSTEM */}
      <footer className="bg-[#fcfcfc] px-4 sm:px-8 md:px-12 lg:px-16 pb-12 md:pb-16 pt-4 text-xs text-neutral-500 font-mono">
        {/* Full-width Divider */}
        <div className="border-t border-[#0d0d0d]/10 mb-12" />
        <div className="w-full max-w-none flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Logo & Author */}
          <div className="flex items-start gap-4">
            {/* Minimal Brand Profile Emblem */}
            <div 
              onClick={() => setShowAdmin(true)}
              className="w-14 h-14 md:w-16 md:h-16 text-black flex-shrink-0 flex items-center justify-center bg-[#eaeaea] p-0.5 rounded-none border border-black/5 cursor-pointer"
            >
              <svg viewBox="0 0 1000 1000" className="w-full h-full fill-black" fill="currentColor">
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
            <div className="space-y-1.5 pt-0.5">
              <div className="flex flex-col">
                <span className="font-display font-semibold text-base tracking-wider text-[#0d0d0d]">
                  moososik.
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-widest text-neutral-400">
                  Music / Movie / Life design archive
                </span>
              </div>
              <p className="max-w-none text-xs sm:text-[13px] leading-relaxed text-neutral-600">
                무소식이 희소식
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-500">Contact</span>
            <div className="flex flex-col gap-2 font-mono text-xs sm:text-[12.5px]">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-neutral-400" strokeWidth={1.5} />
                <span className="text-neutral-400">mail :</span>
                <a
                  href={`mailto:${footerConfig.email}`}
                  className="hover:text-black text-neutral-600 transition-colors"
                >
                  {footerConfig.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram size={13} className="text-neutral-400" strokeWidth={1.5} />
                <span className="text-neutral-400">instagram :</span>
                <a
                  href={`https://instagram.com/${footerConfig.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black text-neutral-600 transition-colors"
                >
                  @{footerConfig.instagram}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Youtube size={13} className="text-neutral-400" strokeWidth={1.5} />
                <span className="text-neutral-400">youtube :</span>
                {!footerConfig.youtube || footerConfig.youtube === 'soon' ? (
                  <span className="text-neutral-600">soon</span>
                ) : (
                  <a
                    href={
                      footerConfig.youtube.startsWith('http')
                        ? footerConfig.youtube
                        : footerConfig.youtube.startsWith('@')
                        ? `https://youtube.com/${footerConfig.youtube}`
                        : `https://youtube.com/@${footerConfig.youtube}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black text-neutral-600 transition-colors"
                  >
                    {footerConfig.youtube.startsWith('http')
                      ? footerConfig.youtube.includes('@')
                        ? `@${footerConfig.youtube.split('@').pop()}`
                        : 'link'
                      : footerConfig.youtube.startsWith('@')
                      ? footerConfig.youtube
                      : `@${footerConfig.youtube}`}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* copyright */}
        <div className="w-full max-w-none mt-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#0d0d0d]/40 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <span>©2026 {footerConfig.authorName || 'moososik.'} All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
