// Server component — provides generateStaticParams for static export
// The actual UI is in CategoryClient.js (which uses 'use client')
import { MOCK_CATEGORIES } from '@/lib/mockData';
import CategoryClient from './CategoryClient';

// Tell Next.js which slugs to pre-render as static HTML pages
export function generateStaticParams() {
  const slugs = [
    'maotai', 'baijiu-sauce', 'baijiu-strong', 'cognac', 'whisky',
    'red-wine', 'vodka', 'health-wine', 'sake', 'cocktail', 'liqueur',
    'beer-import', 'beer-domestic', 'tea', 'cigar', 'gift', 'food',
    'flower', 'flash-sale', 'new-arrivals', 'all',
  ];
  return slugs.map(slug => ({ slug }));
}

export default function CategoryPage({ params }) {
  return <CategoryClient />;
}
