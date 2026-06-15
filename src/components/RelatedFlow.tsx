/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArchiveItem } from '../types';

interface RelatedFlowProps {
  relatedIds?: string[];
  allItems: ArchiveItem[];
  onSelectRelated: (item: ArchiveItem) => void;
}

export default function RelatedFlow({
  relatedIds,
  allItems,
  onSelectRelated
}: RelatedFlowProps) {
  if (!relatedIds || relatedIds.length === 0) return null;

  const validItems = allItems.filter((item) => relatedIds.includes(item.id));

  if (validItems.length === 0) return null;

  return (
    <div className="mt-20 pt-10 border-t border-black/10">
      <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-6">
        Related Sensations & Archives
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validItems.map((item) => {
          let imageUrl = '';
          if (item.category === 'Visual' || item.category === 'Object' || item.category === 'Films' || item.category === 'Etc') {
            imageUrl = item.imageUrl;
          } else if (item.category === 'Texts') {
            imageUrl = item.previewImageUrl || '';
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelectRelated(item)}
              data-cursor="OPEN"
              className="group cursor-pointer border border-[#0d0d0d]/5 bg-neutral-50/50 p-4 transition-all hover:bg-white hover:shadow-sm"
            >
              {imageUrl && (
                <div className="aspect-video w-full overflow-hidden mb-3 bg-neutral-100">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-neutral-400">
                <span className="uppercase">{item.category}</span>
                <span>{item.year}</span>
              </div>
              <h5 className="font-sans text-xs font-medium text-neutral-800 line-clamp-1 group-hover:text-black">
                {item.title}
              </h5>
              <p className="text-[10px] text-neutral-400 line-clamp-2 mt-1 leading-normal font-sans">
                {item.summary}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
