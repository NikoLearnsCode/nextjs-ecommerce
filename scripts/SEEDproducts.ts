// Seed products

import {db} from '@/drizzle/index';
import {productsTable} from '@/drizzle/db/schema';

const baseProducts = [
  // Men's — pants
  {
    name: 'Classic chinos',
    description:
      'Clean chinos in stretch fabric for all-day comfort. Works for both casual and smarter occasions.',
    price: 899,
    brand: 'Herjano',
    gender: 'men',
    color: 'Black',
    slug: 'classic-chinos',
    category: 'pants',
    specs: [
      'Regular fit',
      'Material: 100% cotton',
      'Machine wash max 30°C',
      'Ironing OK',
    ],
    images: [
      '/images/herr/byxor/byxor-herr1.webp',
      '/images/herr/byxor/byxor-herr2.webp',
      '/images/herr/byxor/byxor-herr3.webp',
      '/images/herr/byxor/byxor-herr1.webp',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    name: 'Elegant overcoat',
    description:
      'Sharp overcoat in a classic cut with a lightly washed look for a vintage feel.',
    price: 2199,
    brand: 'Manjano',
    gender: 'men',
    color: 'Navy',
    slug: 'elegant-overcoat',
    category: 'jackets',
    specs: [
      'Regular fit',
      'Material: 80% cotton, 19% polyester, 1% elastane',
      'Machine wash max 30°C',
      'Do not iron',
    ],
    images: [
      '/images/herr/jackor/jacka-herr1.avif',
      '/images/herr/jackor/jacka-herr2.avif',
      '/images/herr/jackor/jacka-herr3.avif',
      '/images/herr/jackor/jacka-herr1.avif',
    ],
    sizes: ['44', '46', '48', '50', '52'],
  },
  {
    name: 'Linen overshirt',
    description: 'Soft linen shirt in a sturdy weave. Great for warmer days.',
    price: 1799,
    brand: 'Trekano',
    gender: 'men',
    color: 'Brown',
    slug: 'linen-overshirt',
    category: 'overshirts',
    specs: [
      'Regular fit',
      'Material: 100% linen',
      'Machine wash max 30°C',
      'Do not iron',
    ],
    images: [
      '/images/herr/overshirt/overshirt1.jpg',
      '/images/herr/overshirt/overshirt2.avif',
      '/images/herr/overshirt/overshirt3.avif',
      '/images/herr/overshirt/overshirt1.jpg',
    ],
    sizes: ['44', '46', '48', '50', '52', '54'],
  },
  {
    name: 'Essential T-shirt',
    description:
      'Minimal tee in 100% organic cotton. A wardrobe staple that goes with everything.',
    price: 599,
    brand: 'Waikiki',
    gender: 'men',
    color: 'Navy',
    slug: 'essential-tshirt',
    category: 't-shirts',
    specs: [
      'Regular fit',
      'Material: 100% organic cotton',
      'Machine wash max 40°C',
      'Do not bleach',
      'Ironing OK',
      'Dry clean not recommended',
    ],
    images: [
      '/images/herr/tshirt/tshirt-herr3.webp',
      '/images/herr/tshirt/tshirt-herr2.webp',
      '/images/herr/tshirt/tshirt-herr3.webp',
      '/images/herr/tshirt/tshirt-herr2.webp',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  // Women's — pants
  {
    name: 'High waist pants',
    description:
      'High-rise trousers with a flattering fit and stretch for comfort. Works for many body types.',
    price: 1999,
    brand: 'Saiki',
    gender: 'women',
    color: 'Navy',
    slug: 'high-waist-pants',
    category: 'pants',
    specs: [
      'Regular fit',
      'Straight leg',
      'High rise',
      'Material: 64% polyester, 31% viscose, 5% elastane',
      'Machine wash max 30°C',
      'Ironing OK',
    ],
    images: [
      '/images/dam/byxor/byxor-dam1.webp',
      '/images/dam/byxor/byxor-dam3.webp',
      '/images/dam/byxor/byxor-dam2.webp',
      '/images/dam/byxor/byxor-dam1.webp',
    ],
    sizes: ['32', '34', '36', '38', '40', '42', '44'],
  },
  {
    name: 'Oversized coat',
    description:
      'Trendy oversized coat in a classic silhouette. Works for the office or dressier events.',
    price: 2499,
    brand: 'Frano',
    gender: 'women',
    color: 'Navy',
    slug: 'oversized-coat',
    category: 'jackets-coats',
    specs: [
      'Oversized fit',
      'Material: 100% polyester',
      'Do not machine wash',
      'Do not iron',
      'Dry clean recommended',
    ],
    images: [
      '/images/dam/jackor/jacka-dam1.webp',
      '/images/dam/jackor/jacka-dam2.webp',
      '/images/dam/jackor/jacka-dam3.webp',
      '/images/dam/jackor/jacka-dam1.webp',
    ],
    sizes: ['32', '34', '36', '38', '40', '42', '44'],
  },
  {
    name: 'Denim playsuit',
    description:
      'This denim playsuit is an easy, comfortable option for any occasion. Classic collar, short sleeves, and a front zipper.',
    price: 1899,
    brand: 'Hermano',
    gender: 'women',
    color: 'Blue',
    slug: 'denim-playsuit',
    category: 'dresses',
    specs: [
      'Regular fit',
      'Material: 80% BCI cotton, 20% recycled cotton',
      'Machine wash max 40°C',
      'Ironing OK',
    ],
    images: [
      '/images/dam/klänningar/klänning-dam2.webp',
      '/images/dam/klänningar/klänning-dam1.webp',
      '/images/dam/klänningar/klänning-dam2.webp',
      '/images/dam/klänningar/klänning-dam1.webp',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    name: 'Silk blouse',
    description:
      'Luxurious blouse in a silk-like fabric with elegant drape. A timeless piece for any wardrobe.',
    price: 899,
    brand: 'Hermana',
    gender: 'women',
    color: 'Midnight Blue',
    slug: 'silk-blouse',
    category: 'tops',
    specs: [
      'Regular fit',
      'Material: 100% cotton',
      'Machine wash max 30°C',
      'Ironing OK',
    ],
    images: [
      '/images/dam/toppar/topp1.webp',
      '/images/dam/toppar/topp2.webp',
      '/images/dam/toppar/topp1.webp',
      '/images/dam/toppar/topp2.webp',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

async function getExistingProductsInfo() {
  try {
    const data = await db
      .select({
        slug: productsTable.slug,
        name: productsTable.name,
      })
      .from(productsTable)
      .orderBy(productsTable.created_at);

    const slugs = data.map((product) => product.slug);

    let highestIndex = 0;
    slugs.forEach((slug) => {
      const match = slug.match(/-(\d+)$/);
      if (match && match[1]) {
        const index = parseInt(match[1]);
        if (index > highestIndex) {
          highestIndex = index;
        }
      }
    });

    return {slugs, highestIndex};
  } catch (error) {
    console.error('Error fetching existing products:', error);
    return {slugs: [], highestIndex: 0};
  }
}

const createDuplicateWithUniqueIds = (
  product: any,
  index: number,
  existingSlugs: string[],
) => {
  const colorVariants = [
    'Black',
    'White',
    'Navy',
    'Beige',
    'Blue',
    'Green',
    'Red',
    'Gray',
    'Brown',
    'Cream',
  ];

  let color = product.color;
  while (color === product.color) {
    color = colorVariants[Math.floor(Math.random() * colorVariants.length)];
  }

  let newSlug = `${product.slug}-${index}`;
  let suffix = index;

  while (existingSlugs.includes(newSlug)) {
    suffix++;
    newSlug = `${product.slug}-${suffix}`;
  }
  existingSlugs.push(newSlug);

  return {
    ...product,
    name: `${product.name} #${index}`,
    slug: newSlug,
    color: color,
    price: Math.round(product.price * (0.9 + Math.random() * 0.2)),
  };
};

async function seedProducts(count: number = 32) {
  console.log('Starting product seed...');

  const {slugs: existingSlugs, highestIndex} = await getExistingProductsInfo();

  const startIndex = highestIndex + 1;
  console.log(
    `Found ${existingSlugs.length} existing products. Starting from index ${startIndex}`,
  );

  const basesToAdd = baseProducts.filter(
    (baseProduct) => !existingSlugs.includes(baseProduct.slug),
  );

  console.log(
    `${basesToAdd.length} of ${baseProducts.length} base products need to be inserted`,
  );

  const productRows = [];

  if (basesToAdd.length > 0) {
    productRows.push(...basesToAdd);
  }

  const remainingToCreate = count - basesToAdd.length;

  if (remainingToCreate > 0) {
    console.log(`Creating ${remainingToCreate} additional product variants`);
    const updatedSlugs = [...existingSlugs, ...basesToAdd.map((p) => p.slug)];

    for (let i = 0; i < remainingToCreate; i++) {
      const baseProd = baseProducts[i % baseProducts.length];

      const duplicateProduct = createDuplicateWithUniqueIds(
        baseProd,
        startIndex + i,
        updatedSlugs,
      );
      productRows.push(duplicateProduct);
    }
  }

  if (productRows.length === 0) {
    console.log('No new products to add.');
    return;
  }

  try {
    const data = await db.insert(productsTable).values(productRows).returning();
    console.log(`Successfully inserted ${data.length} products!`);
  } catch (error) {
    console.error('Error inserting products:', error);
    return;
  }
}

(async () => {
  try {
    const numberOfProducts = process.argv[2] ? parseInt(process.argv[2]) : 16;
    await seedProducts(numberOfProducts);
    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    process.exit(0);
  }
})();
