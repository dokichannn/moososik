/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Visual' | 'Texts' | 'Object' | 'Films' | 'Etc';

export interface BaseItem {
  id: string;
  category: Category;
  title: string;
  year: string;
  summary: string;
  createdAt: string;
  type?: string;
}

export type GridSize = 'small' | 'medium' | 'large' | 'tall' | 'wide';

export interface VisualItem extends BaseItem {
  category: 'Visual';
  type: string;
  imageUrl: string;
  artist: string;
  keywords: string[];
  tools: string[];
  images: string[]; // scrollable images in order
  description: string;
}

export interface TextItem extends BaseItem {
  category: 'Texts';
  content: string; // paragraphs separated by double newline
  previewImageUrl?: string;
  author?: string;
}

export interface ObjectItem extends BaseItem {
  category: 'Object';
  brand: string;
  designer: string;
  material: string;
  imageUrl: string;
  memo: string; // Why I archived (1 line, e.g. "타이포 비율이 좋다")
  reasonArchived: string;
  images?: string[]; // optional scrollable extra images in order
}

export interface FilmItem extends BaseItem {
  category: 'Films';
  director: string;
  actor?: string;
  author?: string;
  music?: string;
  imageUrl: string;
  favoriteQuote: string;
  reasonArchived: string;
  relatedIds?: string[]; // IDs of related items (Text, Object, Visual etc)
  youtubeUrl?: string;
}

export interface EtcItem extends BaseItem {
  category: 'Etc';
  subCategory: string; // Exhibition, music, space, website, photography
  imageUrl: string;
  url?: string;
  description: string;
  gridSize: GridSize;
}

export type ArchiveItem =
  | VisualItem
  | TextItem
  | ObjectItem
  | FilmItem
  | EtcItem;

export interface FooterConfig {
  authorName: string;
  email: string;
  instagram: string;
  behance?: string;
  youtube?: string;
}
