import { db } from '@/lib/db';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { TrustStrip } from '@/components/layout/TrustStrip';
import { Footer } from '@/components/layout/Footer';
import { CollectionClientView } from '@/components/catalog/CollectionClientView';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = params;

  let title = 'Our Fragrance Library';
  let description = 'Explore our full haute perfumery portfolio crafted with rare West African botanicals and French technique.';

  let genderFilter: string | undefined;
  let bestsellerOnly = false;
  let newOnly = false;

  if (slug === 'women') {
    title = 'Women’s Fragrances';
    description = 'Radiant solar florals, sensual honeyed ambers, and opulent gourmands.';
    genderFilter = 'WOMEN';
  } else if (slug === 'men') {
    title = 'Men’s Fragrances';
    description = 'Authoritative smoked ouds, imperial leathers, and deep spicy woods.';
    genderFilter = 'MEN';
  } else if (slug === 'unisex') {
    title = 'Unisex & Attars';
    description = 'Universal high perfumery elixirs and alcohol-free botanical oil extraits.';
    genderFilter = 'UNISEX';
  } else if (slug === 'makeup') {
    title = 'Makeup & Beauty Accents';
    description = 'Shea-infused lip colors and gold dust highlighter balms.';
    genderFilter = 'MAKEUP';
  } else if (slug === 'bestsellers') {
    title = 'Bestseller Icons';
    description = 'The most coveted and requested scents across Accra and West Africa.';
    bestsellerOnly = true;
  } else if (slug === 'new') {
    title = 'New Releases';
    description = 'Recent olfactory drops from our Accra perfumery lab.';
    newOnly = true;
  } else if (slug !== 'all') {
    const dbCol = await db.collection.findUnique({ where: { slug } });
    if (!dbCol) {
      notFound();
    }
    title = dbCol.name;
    description = dbCol.description || description;
  }

  const whereClause: any = { isPublished: true };
  if (genderFilter) whereClause.gender = genderFilter;
  if (bestsellerOnly) whereClause.isBestseller = true;
  if (newOnly) whereClause.isNew = true;

  const rawProducts = await db.product.findMany({
    where: whereClause,
    include: {
      variants: true,
      category: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const formattedProducts = rawProducts.map((p) => {
    const lowestPrice = p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : 0;
    const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
    const sizeVariants = p.variants.map((v) => v.size);

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      gender: p.gender,
      categoryName: p.category?.name || null,
      lowestPrice,
      totalStock,
      isNew: p.isNew,
      isBestseller: p.isBestseller,
      imageUrl: p.images[0]?.url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      sizeVariants,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <UtilityBar />
      <Header />
      <TrustStrip />
      <main className="flex-1">
        <CollectionClientView
          title={title}
          description={description}
          initialProducts={formattedProducts}
        />
      </main>
      <Footer />
    </div>
  );
}
