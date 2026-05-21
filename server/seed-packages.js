const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./models/Package');

const packages = [
  {
    name: 'Yoga Basic - 30 Days',
    description: 'Perfect for beginners. Get started with daily yoga sessions, breathing exercises, and meditation basics.',
    duration: 30,
    durationUnit: 'days',
    price: 49.99,
    discount: 10,
    features: [
      'Daily yoga video sessions',
      'Breathing exercises',
      'Meditation guides',
      'Progress tracking',
      'Community access'
    ],
    category: 'yoga',
    level: 'beginner',
    isActive: true,
    createdBy: null
  },
  {
    name: 'Yoga Intermediate - 60 Days',
    description: 'Take your practice to the next level with advanced poses, strength training, and flexibility routines.',
    duration: 60,
    durationUnit: 'days',
    price: 89.99,
    discount: 15,
    features: [
      'Advanced yoga sessions',
      'Strength training yoga',
      'Flexibility routines',
      'Personal guidance',
      'Weekly live classes',
      'Nutrition tips'
    ],
    category: 'yoga',
    level: 'intermediate',
    isActive: true,
    createdBy: null
  },
  {
    name: 'Yoga Advanced - 90 Days',
    description: 'Master advanced yoga techniques with personalized coaching and comprehensive wellness program.',
    duration: 90,
    durationUnit: 'days',
    price: 129.99,
    discount: 20,
    features: [
      'All advanced sessions',
      'Personal yoga coach',
      'Customized practice plan',
      'Unlimited live classes',
      'Meditation mastery',
      'Nutrition consulting',
      'Wellness assessments'
    ],
    category: 'yoga',
    level: 'advanced',
    isActive: true,
    createdBy: null
  },
  {
    name: 'Meditation Starter - 30 Days',
    description: 'Begin your meditation journey with guided sessions, mindfulness training, and stress relief techniques.',
    duration: 30,
    durationUnit: 'days',
    price: 29.99,
    discount: 0,
    features: [
      'Guided meditation sessions',
      'Breathing techniques',
      'Stress relief exercises',
      'Sleep improvement guide',
      'Mindfulness basics'
    ],
    category: 'meditation',
    level: 'beginner',
    isActive: true,
    createdBy: null
  },
  {
    name: 'Deep Meditation - 60 Days',
    description: 'Advanced meditation program for those ready to explore deeper consciousness and inner peace.',
    duration: 60,
    durationUnit: 'days',
    price: 59.99,
    discount: 10,
    features: [
      'Advanced guided meditations',
      'Chakra balancing',
      'Sound healing sessions',
      'Energy work basics',
      'Deep relaxation techniques',
      'Monthly assessment'
    ],
    category: 'meditation',
    level: 'intermediate',
    isActive: true,
    createdBy: null
  },
  {
    name: 'Complete Wellness - 3 Months',
    description: 'Comprehensive yoga and meditation program combining the best of both practices for total wellness.',
    duration: 3,
    durationUnit: 'months',
    price: 199.99,
    discount: 25,
    features: [
      'Unlimited yoga sessions',
      'Unlimited meditation sessions',
      'Personal wellness coach',
      'Custom meal plans',
      'Weekly check-ins',
      'Access to all workshops',
      'Priority support'
    ],
    category: 'mixed',
    level: 'all',
    isActive: true,
    createdBy: null
  },
  {
    name: 'Power Yoga - 45 Days',
    description: 'High-intensity yoga for fitness enthusiasts looking to build strength and stamina.',
    duration: 45,
    durationUnit: 'days',
    price: 79.99,
    discount: 10,
    features: [
      'Power yoga sessions',
      'Core strengthening',
      'Cardio yoga',
      'Sweat-inducing workouts',
      'Fitness tracking',
      'Diet recommendations'
    ],
    category: 'fitness',
    level: 'intermediate',
    isActive: true,
    createdBy: null
  },
  {
    name: 'Morning Yoga - 30 Days',
    description: 'Start your mornings right with energizing yoga routines designed to boost energy and positivity.',
    duration: 30,
    durationUnit: 'days',
    price: 39.99,
    discount: 5,
    features: [
      'Morning yoga routines',
      'Sunrise meditation',
      'Energy boosting exercises',
      'Positive mindset sessions',
      '20-minute quick workouts'
    ],
    category: 'yoga',
    level: 'beginner',
    isActive: true,
    createdBy: null
  }
];

async function seedPackages() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yogastic';

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    await Package.deleteMany({});
    console.log('Cleared existing packages');

    const insertedPackages = await Package.insertMany(packages);
    console.log(`Inserted ${insertedPackages.length} packages`);

    insertedPackages.forEach(pkg => {
      console.log(`  - ${pkg.name} (${pkg.duration} ${pkg.durationUnit}): $${pkg.price}`);
    });

    await mongoose.connection.close();
    console.log('\nDone! Database seeded successfully.');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedPackages();