import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing tables
  await db.auditLog.deleteMany();
  await db.webhookEvent.deleteMany();
  await db.payment.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.scentNote.deleteMany();
  await db.productImage.deleteMany();
  await db.productVariant.deleteMany();
  await db.product.deleteMany();
  await db.collection.deleteMany();
  await db.category.deleteMany();
  await db.discount.deleteMany();
  await db.deliveryZone.deleteMany();
  await db.user.deleteMany();

  // Seed Admin User
  await db.user.create({
    data: {
      email: 'admin@valorandaura.com',
      name: 'System Admin',
      phone: '+233241234567',
      passwordHash: '$2a$10$e8N8yQe2OqL7E3/k7vT9O.Z6BwN/M5oU3O8O2G2O2O2O2O2O2O2O2', // hashed placeholder
      role: 'ADMIN',
      twoFactorActive: true,
    },
  });

  // Seed Categories
  const catEaudeParfum = await db.category.create({
    data: { name: 'Eau de Parfum', slug: 'eau-de-parfum', description: 'Concentrated luxury fragrances' },
  });
  const catExtrait = await db.category.create({
    data: { name: 'Extrait de Parfum', slug: 'extrait-de-parfum', description: 'Pure oil intensity high perfumery' },
  });
  const catAttar = await db.category.create({
    data: { name: 'Perfume Oils & Attars', slug: 'perfume-oils', description: 'Alcohol-free botanical oil elixirs' },
  });
  const catMakeup = await db.category.create({
    data: { name: 'Makeup & Beauty', slug: 'makeup', description: 'Luxury Ghanaian cosmetic accents' },
  });

  // Seed Collections
  const colRoyal = await db.collection.create({
    data: { name: 'Royal Gold Collection', slug: 'royal-gold', description: 'Inspired by West African heritage and gold heritage' },
  });
  const colCoastal = await db.collection.create({
    data: { name: 'Coastal Breeze', slug: 'coastal-breeze', description: 'Fresh, aquatic, and solar citrus notes' },
  });
  const colDiscovery = await db.collection.create({
    data: { name: 'Discovery Sets', slug: 'discovery-sets', description: 'Curated sample collections' },
  });

  // Seed Delivery Zones
  await db.deliveryZone.createMany({
    data: [
      { name: 'Greater Accra Express', regions: 'Greater Accra', fee: 35, minOrderForFree: 500, codAllowed: true, maxCodValue: 2000 },
      { name: 'Kumasi & Ashanti Regional', regions: 'Ashanti', fee: 50, minOrderForFree: 700, codAllowed: true, maxCodValue: 1500 },
      { name: 'Other Ghana Regions', regions: 'Central, Western, Eastern, Volta, Northern, Upper East, Upper West, Oti, Bono', fee: 65, minOrderForFree: 1000, codAllowed: true, maxCodValue: 1000 },
      { name: 'Self Pickup (Accra Showroom)', regions: 'Greater Accra', fee: 0, minOrderForFree: 0, codAllowed: true, maxCodValue: 5000 },
    ],
  });

  // Seed Discount Codes
  await db.discount.createMany({
    data: [
      { code: 'AKWAABA10', type: 'PERCENTAGE', value: 10, minOrderVal: 300, isActive: true },
      { code: 'GOLDEN50', type: 'FIXED_AMOUNT', value: 50, minOrderVal: 600, isActive: true },
    ],
  });

  // Seed 20+ Realistic Products with Variants and Scent Pyramids
  const productsData = [
    {
      name: 'Akoben Oud',
      slug: 'akoben-oud',
      tagline: 'Deep Smoked Oud, Frankincense & Wild Cocoa',
      description: 'A regal fragrance capturing the majestic resonance of smoked oud wood, Ghanaian raw cocoa nibs, and golden amber.',
      gender: 'UNISEX',
      categoryId: catExtrait.id,
      collectionId: colRoyal.id,
      isBestseller: true,
      isFeatured: true,
      isNew: false,
      longevity: 5,
      projection: 5,
      occasionTags: 'Evening, Gala, Royal Banquets',
      seasonTags: 'Autumn, Winter, Cool Nights',
      variants: [
        { sku: 'AKB-30', size: '30ml', price: 550, stock: 25 },
        { sku: 'AKB-50', size: '50ml', price: 850, stock: 40 },
        { sku: 'AKB-100', size: '100ml', price: 1450, stock: 15 },
      ],
      notes: [
        { type: 'TOP', name: 'Smoked Bergamot & Pink Pepper' },
        { type: 'HEART', name: 'Raw Ghanaian Cocoa Nibs & Cardamom' },
        { type: 'BASE', name: 'Assam Oud, Golden Amber & Cedarwood' },
      ],
      images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'],
    },
    {
      name: 'Sika Sunset',
      slug: 'sika-sunset',
      tagline: 'Solar Amber, Orange Blossom & Wild Honey',
      description: 'Warm gold trapped in a bottle. Radiant orange blossom laced with acacia honey and soft cashmere musk.',
      gender: 'WOMEN',
      categoryId: catEaudeParfum.id,
      collectionId: colRoyal.id,
      isBestseller: true,
      isFeatured: true,
      isNew: false,
      longevity: 4,
      projection: 4,
      occasionTags: 'Daily Elegance, Sunset Soirées',
      seasonTags: 'Spring, Summer, Year-round',
      variants: [
        { sku: 'SIK-30', size: '30ml', price: 480, stock: 30 },
        { sku: 'SIK-50', size: '50ml', price: 720, stock: 50 },
        { sku: 'SIK-100', size: '100ml', price: 1200, stock: 20 },
      ],
      notes: [
        { type: 'TOP', name: 'Mandarin Zest & Sun-kissed Peach' },
        { type: 'HEART', name: 'Ghanaian Honeycomb & White Jasmine' },
        { type: 'BASE', name: 'Warm Amber Resin, Vanilla Bean & Cashmere Wood' },
      ],
      images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'],
    },
    {
      name: 'Sol de Accra',
      slug: 'sol-de-accra',
      tagline: 'Coastal Vetiver, Sea Salt & Coconut Blossom',
      description: 'Inspired by morning waves along Labadi beach. Fresh ocean spray meets warm coconut palm and rich earth.',
      gender: 'UNISEX',
      categoryId: catEaudeParfum.id,
      collectionId: colCoastal.id,
      isBestseller: false,
      isFeatured: true,
      isNew: true,
      longevity: 4,
      projection: 3,
      occasionTags: 'Beach Club, Casual Luxury, Weekend Escapes',
      seasonTags: 'Summer, Warm Days',
      variants: [
        { sku: 'SOL-30', size: '30ml', price: 420, stock: 18 },
        { sku: 'SOL-50', size: '50ml', price: 650, stock: 35 },
        { sku: 'SOL-100', size: '100ml', price: 1100, stock: 12 },
      ],
      notes: [
        { type: 'TOP', name: 'Sea Salt & Italian Lemon' },
        { type: 'HEART', name: 'Coconut Blossom & Fresh Sage' },
        { type: 'BASE', name: 'Haitian Vetiver & Driftwood' },
      ],
      images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'],
    },
  ];

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    await db.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        gender: p.gender,
        categoryId: p.categoryId,
        collectionId: p.collectionId,
        isBestseller: p.isBestseller,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        longevity: p.longevity,
        projection: p.projection,
        occasionTags: p.occasionTags,
        seasonTags: p.seasonTags,
        sortOrder: i,
        variants: { create: p.variants },
        scentNotes: { create: p.notes },
        images: { create: p.images.map((url, idx) => ({ url, sortOrder: idx })) },
      },
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
