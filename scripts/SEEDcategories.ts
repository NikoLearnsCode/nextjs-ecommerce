import {db} from '@/drizzle/index';
import {categories, categoryTypeEnum} from '@/drizzle/db/schema';
import * as dotenv from 'dotenv';
import {InferInsertModel} from 'drizzle-orm';

dotenv.config({path: '.env'});

type CategoryBlueprint = {
  title: string;
  slug: string;
  type: (typeof categoryTypeEnum.enumValues)[number];
  desktopImage?: string;
  mobileImage?: string;
  children?: CategoryBlueprint[];
};

const categoryTreeDefinition: CategoryBlueprint[] = [
  {
    title: 'Men',
    slug: 'men',
    type: 'MAIN-CATEGORY',
    desktopImage: '/images/herr.desktop.jpg',
    mobileImage: '/images/herr.mobile.jpg',
    children: [
      {title: 'New Now', slug: 'new-now', type: 'COLLECTION'},
      {
        title: 'Clothing',
        slug: 'clothing',
        type: 'CONTAINER',
        children: [
          {title: 'Jackets', slug: 'jackets', type: 'SUB-CATEGORY'},
          {title: 'Pants', slug: 'pants', type: 'SUB-CATEGORY'},
          {title: 'Shirts', slug: 'shirts', type: 'SUB-CATEGORY'},
          {title: 'Polo shirts', slug: 'polo-shirts', type: 'SUB-CATEGORY'},
          {title: 'Jeans', slug: 'jeans', type: 'SUB-CATEGORY'},
          {
            title: 'Short-sleeve knit sweater',
            slug: 'short-sleeve-knit-sweater',
            type: 'SUB-CATEGORY',
          },
          {title: 'T-shirts', slug: 't-shirts', type: 'SUB-CATEGORY'},
          {title: 'Tank tops', slug: 'tank-tops', type: 'SUB-CATEGORY'},
          {
            title: 'Cardigans & warm sweaters',
            slug: 'cardigans-warm-sweaters',
            type: 'SUB-CATEGORY',
          },
          {title: 'Blazers', slug: 'blazers', type: 'SUB-CATEGORY'},
          {title: 'Raincoats', slug: 'raincoats', type: 'SUB-CATEGORY'},
          {title: 'Sweatshirts', slug: 'sweatshirts', type: 'SUB-CATEGORY'},
          {title: 'Overshirts', slug: 'overshirts', type: 'SUB-CATEGORY'},
          {title: 'Coats', slug: 'coats', type: 'SUB-CATEGORY'},
          {title: 'Shorts', slug: 'shorts', type: 'SUB-CATEGORY'},
          {title: 'Swimwear', slug: 'swimwear', type: 'SUB-CATEGORY'},
          {title: 'Underwear', slug: 'underwear', type: 'SUB-CATEGORY'},
          {title: 'Pyjamas', slug: 'pyjamas', type: 'SUB-CATEGORY'},
        ],
      },
      {
        title: 'Suits',
        slug: 'suits',
        type: 'CONTAINER',
        children: [
          {title: 'Suit jackets', slug: 'suit-jackets', type: 'SUB-CATEGORY'},
          {title: 'Suit trousers', slug: 'suit-trousers', type: 'SUB-CATEGORY'},
          {title: 'Waistcoats', slug: 'waistcoats', type: 'SUB-CATEGORY'},
        ],
      },
      {
        title: 'Shoes & accessories',
        slug: 'shoes-accessories',
        type: 'CONTAINER',
        children: [
          {title: 'Sneakers', slug: 'sneakers', type: 'SUB-CATEGORY'},
          {title: 'Dress shoes', slug: 'dress-shoes', type: 'SUB-CATEGORY'},
          {title: 'Belts', slug: 'belts', type: 'SUB-CATEGORY'},
          {
            title: 'Ties & bow ties',
            slug: 'ties-bow-ties',
            type: 'SUB-CATEGORY',
          },
        ],
      },
    ],
  },
  {
    title: 'Women',
    slug: 'women',
    type: 'MAIN-CATEGORY',
    desktopImage: '/images/dam.desktop.jpg',
    mobileImage: '/images/dam.mobile.jpg',
    children: [
      {title: 'New Now', slug: 'new-now', type: 'COLLECTION'},
      {
        title: 'Clothing',
        slug: 'clothing',
        type: 'CONTAINER',
        children: [
          {title: 'Dresses', slug: 'dresses', type: 'SUB-CATEGORY'},
          {title: 'Tops', slug: 'tops', type: 'SUB-CATEGORY'},
          {title: 'Jeans', slug: 'jeans', type: 'SUB-CATEGORY'},
          {title: 'Knitwear', slug: 'knitwear', type: 'SUB-CATEGORY'},
          {
            title: 'Jackets & coats',
            slug: 'jackets',
            type: 'SUB-CATEGORY',
          },
          {title: 'Pants', slug: 'pants', type: 'SUB-CATEGORY'},
          {title: 'Shorts', slug: 'shorts', type: 'SUB-CATEGORY'},
          {title: 'Skirts', slug: 'skirts', type: 'SUB-CATEGORY'},
          {title: 'Swimwear', slug: 'swimwear', type: 'SUB-CATEGORY'},
          {title: 'Underwear', slug: 'underwear', type: 'SUB-CATEGORY'},
        ],
      },
      {
        title: 'Shoes & accessories',
        slug: 'shoes-accessories',
        type: 'CONTAINER',
        children: [
          {title: 'Shoes', slug: 'shoes', type: 'SUB-CATEGORY'},
          {title: 'Bags', slug: 'bags', type: 'SUB-CATEGORY'},
          {title: 'Jewelry', slug: 'jewelry', type: 'SUB-CATEGORY'},
          {title: 'Scarves', slug: 'scarves', type: 'SUB-CATEGORY'},
        ],
      },
    ],
  },
  {
    title: 'levels',
    slug: 'levels',
    type: 'MAIN-CATEGORY',
    desktopImage: '/images/hem.desktop.avif',
    mobileImage: '/images/hem.mobile.webp',
    children: [
      {
        title: 'Level-1',
        slug: 'level-1',
        type: 'CONTAINER',
        children: [
          {
            title: 'Level-2',
            slug: 'level-2',
            type: 'CONTAINER',
            children: [
              {
                title: 'Level-3.long1234567890',
                slug: 'level-3',
                type: 'CONTAINER',
                children: [
                  {
                    title: 'Level-4',
                    slug: 'level-4',
                    type: 'CONTAINER',
                    children: [
                      {
                        title: 'Final',
                        slug: 'final',
                        type: 'SUB-CATEGORY',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

type InsertCategory = InferInsertModel<typeof categories>;

const buildCategoryWithChildren = async (
  blueprint: CategoryBlueprint,
  parentId: number | null,
  displayOrder: number,
) => {
  const row: InsertCategory = {
    name: blueprint.title,
    slug: blueprint.slug,
    parentId: parentId,
    displayOrder: displayOrder,
    isActive: true,
    type: blueprint.type,
    desktopImage: blueprint.desktopImage || null,
    mobileImage: blueprint.mobileImage || null,
  };

  console.log(
    `📦 Building: "${row.name}" (type: ${row.type}) with parentId: ${parentId}`,
  );

  const [inserted] = await db
    .insert(categories)
    .values(row)
    .returning({id: categories.id});

  const newId = inserted.id;

  console.log(`✅ Done: "${row.name}", id: ${newId}`);

  const children = blueprint.children;
  if (children && children.length > 0) {
    console.log(
      `  -> ${children.length} child categories for "${row.name}". Building...`,
    );
    for (const [index, child] of children.entries()) {
      await buildCategoryWithChildren(child, newId, index);
    }
  }
};

const seed = async () => {
  console.log('🏁 Starting database seed...');
  try {
    console.log('🗑️ Deleting existing categories...');
    await db.delete(categories);
    console.log('✅ Categories deleted.');

    console.log('🌳 Building category tree...');
    for (const [index, rootBlueprint] of categoryTreeDefinition.entries()) {
      await buildCategoryWithChildren(rootBlueprint, null, index);
    }
    console.log('🚀 Category tree complete!');
  } catch (error) {
    console.error('❌ Error while building categories:', error);
    process.exit(1);
  } finally {
    console.log('✅ Seed finished.');
    process.exit(0);
  }
};

seed();
