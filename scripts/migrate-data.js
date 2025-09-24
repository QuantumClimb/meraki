import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('Starting data migration...');

    // Read the existing products.json file
    const productsPath = path.join(__dirname, '../src/data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    // Create categories first
    const categories = [
      { name: 'Leather Goods', description: 'Handcrafted leather accessories and bags' },
      { name: 'Electronics', description: 'Cutting-edge technology and gadgets' },
      { name: 'Fragrances', description: 'Curated scents for men, women, and unisex' },
      { name: 'Used/Refurbished', description: 'Quality restored items at exceptional value' }
    ];

    console.log('Creating categories...');
    const createdCategories = {};
    for (const category of categories) {
      const created = await prisma.category.upsert({
        where: { name: category.name },
        update: category,
        create: category
      });
      createdCategories[category.name] = created.id;
      console.log(`Created/Updated category: ${category.name}`);
    }

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.admin.upsert({
      where: { email: 'admin@meraki.com' },
      update: {},
      create: {
        email: 'admin@meraki.com',
        password: hashedPassword,
        name: 'Admin User'
      }
    });
    console.log('Admin user created/updated');

    // Migrate products
    console.log('Migrating products...');
    for (const product of productsData) {
      const categoryId = createdCategories[product.category];
      if (!categoryId) {
        console.warn(`Category not found for product: ${product.title}`);
        continue;
      }

      await prisma.product.upsert({
        where: { handle: product.handle },
        update: {
          title: product.title,
          description: product.description,
          image: product.image,
          price: product.price,
          categoryId: categoryId,
          subcategory: product.subcategory,
          highlights: JSON.stringify(product.highlights || []),
          tags: JSON.stringify(product.tags || []),
          brand: product.brand,
          condition: product.condition,
          inventory: product.inventory,
          seoTitle: product.seo_title,
          seoDescription: product.seo_description
        },
        create: {
          handle: product.handle,
          title: product.title,
          description: product.description,
          image: product.image,
          price: product.price,
          categoryId: categoryId,
          subcategory: product.subcategory,
          highlights: JSON.stringify(product.highlights || []),
          tags: JSON.stringify(product.tags || []),
          brand: product.brand,
          condition: product.condition,
          inventory: product.inventory,
          seoTitle: product.seo_title,
          seoDescription: product.seo_description
        }
      });
      console.log(`Migrated product: ${product.title}`);
    }

    console.log('Data migration completed successfully!');
    console.log(`Migrated ${productsData.length} products`);
    console.log(`Created ${categories.length} categories`);
    console.log('Admin credentials: admin@meraki.com / admin123');

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
