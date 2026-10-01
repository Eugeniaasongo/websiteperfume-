import { db } from '@/lib/db';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { TrustStrip } from '@/components/layout/TrustStrip';
import { Footer } from '@/components/layout/Footer';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return {};
  return {
    title: `${product.name} | VALOR & AURA Perfumes`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      variants: { orderBy: { price: 'asc' } },
      images: { orderBy: { sortOrder: 'asc' } },
      scentNotes: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  const rawSimilar = await db.product.findMany({
    where: {
      id: { not: product.id },
      isPublished: true,
      gender: product.gender,
    },
    include: {
      variants: { orderBy: { price: 'asc' }, take: 1 },
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
    },
    take: 4,
  });

  const similarProducts = rawSimilar.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    price: s.variants[0]?.price || 0,
    imageUrl: s.images[0]?.url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    gender: s.gender,
  }));

  const formattedProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    gender: product.gender,
    longevity: product.longevity,
    projection: product.projection,
    occasionTags: product.occasionTags,
    seasonTags: product.seasonTags,
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      stock: v.stock,
    })),
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
    })),
    scentNotes: product.scentNotes.map((n) => ({
      id: n.id,
      type: n.type,
      name: n.name,
    })),
    reviews: product.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      authorName: r.authorName,
      title: r.title,
      comment: r.comment,
      verifiedPurchase: r.verifiedPurchase,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <UtilityBar />
      <Header />
      <TrustStrip />
      <main className="flex-1">
        <ProductDetailClient product={formattedProduct} similarProducts={similarProducts} />
      </main>
      <Footer />
    </div>
  );
}
