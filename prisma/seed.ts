import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Health',
    slug: 'health',
    description: 'General health information and tips',
    children: [
      { name: 'General Health Tips', slug: 'general-health-tips', description: 'Everyday health tips for a better life' },
      { name: 'Preventive Care', slug: 'preventive-care', description: 'Prevention is better than cure' },
      { name: "Women's Health", slug: 'womens-health', description: "Health topics specific to women" },
      { name: "Men's Health", slug: 'mens-health', description: "Health topics specific to men" },
      { name: 'Child Health', slug: 'child-health', description: 'Health guidance for children' },
    ],
  },
  {
    name: 'Diseases',
    slug: 'diseases',
    description: 'Information about common and rare diseases',
    children: [
      { name: 'Diabetes', slug: 'diabetes', description: 'Understanding and managing diabetes' },
      { name: 'Heart Disease', slug: 'heart-disease', description: 'Heart health and cardiovascular diseases' },
      { name: 'Blood Pressure', slug: 'blood-pressure', description: 'Managing blood pressure levels' },
      { name: 'Thyroid', slug: 'thyroid', description: 'Thyroid disorders and management' },
      { name: 'Skin Diseases', slug: 'skin-diseases', description: 'Common skin conditions and treatments' },
      { name: 'Infectious Diseases', slug: 'infectious-diseases', description: 'Understanding infectious diseases' },
    ],
  },
  {
    name: 'Diet & Nutrition',
    slug: 'diet-nutrition',
    description: 'Healthy eating and nutrition guidance',
    children: [
      { name: 'Weight Loss', slug: 'weight-loss', description: 'Healthy weight loss strategies' },
      { name: 'Weight Gain', slug: 'weight-gain', description: 'Healthy weight gain tips' },
      { name: 'Healthy Recipes', slug: 'healthy-recipes', description: 'Nutritious and delicious recipes' },
      { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', description: 'Guide to vitamins and supplements' },
      { name: 'Meal Plans', slug: 'meal-plans', description: 'Structured meal plans for health' },
    ],
  },
  {
    name: 'Fitness & Exercise',
    slug: 'fitness-exercise',
    description: 'Exercise routines and fitness tips',
    children: [
      { name: 'Home Workouts', slug: 'home-workouts', description: 'Effective workouts you can do at home' },
      { name: 'Gym Training', slug: 'gym-training', description: 'Gym workout guides and tips' },
      { name: 'Yoga', slug: 'yoga', description: 'Yoga practices for mind and body' },
      { name: 'Cardio', slug: 'cardio', description: 'Cardiovascular exercise routines' },
      { name: 'Strength Training', slug: 'strength-training', description: 'Building strength and muscle' },
    ],
  },
  {
    name: 'Mental Health',
    slug: 'mental-health',
    description: 'Mental wellness and psychological health',
    children: [
      { name: 'Stress Management', slug: 'stress-management', description: 'Techniques to manage stress' },
      { name: 'Anxiety', slug: 'anxiety', description: 'Understanding and coping with anxiety' },
      { name: 'Depression', slug: 'depression', description: 'Understanding and managing depression' },
      { name: 'Sleep Health', slug: 'sleep-health', description: 'Improving sleep quality' },
    ],
  },
  {
    name: 'Wellness & Lifestyle',
    slug: 'wellness-lifestyle',
    description: 'Holistic wellness and healthy lifestyle choices',
    children: [
      { name: 'Daily Healthy Habits', slug: 'daily-healthy-habits', description: 'Simple habits for a healthier life' },
      { name: 'Natural Remedies', slug: 'natural-remedies', description: 'Natural and home remedies' },
      { name: 'Beauty & Skin Care', slug: 'beauty-skin-care', description: 'Natural beauty and skin care tips' },
      { name: 'Healthy Living Tips', slug: 'healthy-living-tips', description: 'Tips for an overall healthy lifestyle' },
    ],
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@healthblog.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@healthblog.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create categories and subcategories
  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    console.log(`✅ Category: ${parent.name}`);

    if (cat.children) {
      for (const child of cat.children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: { name: child.name, description: child.description, parentId: parent.id },
          create: {
            name: child.name,
            slug: child.slug,
            description: child.description,
            parentId: parent.id,
          },
        });
        console.log(`  ↳ Subcategory: ${child.name}`);
      }
    }
  }

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'HealthBlog',
      siteDescription: 'Your trusted source for health, wellness, and lifestyle information',
      commentsEnabled: true,
      postsPerPage: 12,
    },
  });
  console.log('✅ Site settings created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
