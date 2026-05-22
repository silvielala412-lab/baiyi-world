// Server component — provides generateStaticParams for static export
// The actual UI is in ProductClient.js (which uses 'use client')
import { MOCK_PRODUCTS } from '@/lib/mockData';
import ProductClient from './ProductClient';

// Tell Next.js which product IDs to pre-render as static HTML pages
export function generateStaticParams() {
  return MOCK_PRODUCTS.map(p => ({ id: p.id }));
}

export default function ProductPage({ params }) {
  return <ProductClient />;
}
