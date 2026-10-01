import { db } from '@/lib/db';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { TrustStrip } from '@/components/layout/TrustStrip';
import { Footer } from '@/components/layout/Footer';
import { Carousel } from '@/components/ui/Carousel';
import { ProductCard } from '@/components/ui/ProductCard';
import { brandConfig } from '@/config/brand';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      variants: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
    },
    take: 6,
  });

  const bestsellers = await db.product.findMany({
    where: { isPublished: true, isBestseller: true },
    include: {
      variants: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
    },
    take: 6,
  });

  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=80',
      title: 'Akoben Royal Oud',
      subtitle: 'New Royal Gold Collection',
      ctaText: 'Explore Extrait de Parfum',
      ctaLink: '/products/akoben-oud',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=80',
      title: 'Sika Sunset',
      subtitle: 'Ghanaian Orange Blossom & Wild Honey',
      ctaText: 'Shop Iconic Fragrance',
      ctaLink: '/products/sika-sunset',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1600&q=80',
      title: 'Sol de Accra',
      subtitle: 'Coastal Vetiver & Sea Salt',
      ctaText: 'Discover Scent',
      ctaLink: '/products/sol-de-accra',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <UtilityBar />
      <Header />
      <TrustStrip />

      <main className="flex-1">
        {/* Full-Bleed Hero Carousel */}
        <section className="w-full">
          <Carousel slides={heroSlides} />
        </section>

        {/* Short Centered Brand Statement */}
        <section className="py-20 px-6 bg-paper-soft text-center border-b border-gold/15">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold">
              West African High Perfumery
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-ink tracking-tight leading-snug">
              "Crafted in Accra with rare West African botanicals and timeless French technique."
            </h2>
            <p className="text-sm text-charcoal/70 leading-relaxed font-sans max-w-xl mx-auto pt-2">
              Every creation from {brandConfig.name} represents an ode to ancestral heritage, opulent gold tradition, and contemporary luxury.
            </p>
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-gold/20">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">Curated Drop</span>
              <h2 className="text-3xl font-serif text-ink">Featured Fragrances</h2>
            </div>
            <Link
              href="/collections/all"
              className="text-xs font-semibold uppercase tracking-widest text-ink hover:text-gold transition-colors mt-2 md:mt-0"
            >
              View Full Library →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const lowestPrice = product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.price))
                : 0;
              const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  subtitle={product.tagline || undefined}
                  price={lowestPrice}
                  image={product.images[0]?.url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'}
                  category={product.gender}
                  isNew={product.isNew}
                  isBestseller={product.isBestseller}
                  outOfStock={totalStock <= 0}
                />
              );
            })}
          </div>
        </section>

        {/* Bestseller Grid */}
        <section className="py-16 bg-paper-soft border-t border-gold/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-gold/20">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-gold">Most Coveted</span>
                <h2 className="text-3xl font-serif text-ink">Bestsellers</h2>
              </div>
              <Link
                href="/collections/bestsellers"
                className="text-xs font-semibold uppercase tracking-widest text-ink hover:text-gold transition-colors mt-2 md:mt-0"
              >
                Explore Bestsellers →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {bestsellers.map((product) => {
                const lowestPrice = product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => v.price))
                  : 0;
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    subtitle={product.tagline || undefined}
                    price={lowestPrice}
                    image={product.images[0]?.url || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'}
                    category={product.gender}
                    isNew={product.isNew}
                    isBestseller={product.isBestseller}
                    outOfStock={totalStock <= 0}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
