const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');

/**
 * Seed the database with sample users and tasks.
 * This script can be run standalone via `npm run seed` or called from server.js.
 */
async function seed() {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB for seeding.');
    }

    // Check if users already exist — skip seeding if they do
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`Database already has ${userCount} user(s). Skipping seed.`);
      return;
    }

    console.log('Seeding database with sample data...');

    // ── Create Users ──────────────────────────────────────────────────
    const alice = await User.create({
      name: 'Alice Johnson',
      email: 'alice@demo.com',
      password: 'Demo@1234',
      role: 'manager'
    });

    const bob = await User.create({
      name: 'Bob Smith',
      email: 'bob@demo.com',
      password: 'Demo@1234',
      role: 'developer'
    });

    console.log('✓ Created users: Alice (manager) and Bob (developer)');

    // ── Create Sample Tasks ───────────────────────────────────────────
    const tasks = await Task.insertMany([
      {
        title: 'Design System Architecture',
        description: 'Create a comprehensive system architecture document covering microservices, databases, and integration points.',
        priority: 'high',
        status: 'completed',
        dueDate: new Date('2026-06-01'),
        createdBy: alice._id
      },
      {
        title: 'Implement Authentication',
        description: 'Build JWT-based authentication with login, registration, and role-based access control.',
        priority: 'urgent',
        status: 'in-progress',
        dueDate: new Date('2026-06-10'),
        createdBy: bob._id
      },
      {
        title: 'Build Dashboard UI',
        description: 'Design and implement the main dashboard with task cards, filters, and statistics widgets.',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date('2026-06-15'),
        createdBy: alice._id
      },
      {
        title: 'API Integration Tests',
        description: 'Write comprehensive integration tests for all REST API endpoints using Jest and Supertest.',
        priority: 'low',
        status: 'todo',
        dueDate: new Date('2026-06-20'),
        createdBy: bob._id
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing, building, and deployment to staging and production.',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date('2026-06-05'),
        createdBy: alice._id
      },
      {
        title: 'Write Documentation',
        description: 'Create API documentation using Swagger/OpenAPI and write user guides for the dashboard.',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date('2026-06-25'),
        createdBy: bob._id
      }
    ]);

    console.log(`✓ Created ${tasks.length} sample tasks`);
    console.log('✓ Database seeding complete!');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

// If run directly (npm run seed), execute and then disconnect
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed script finished.');
      mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed script failed:', err);
      mongoose.disconnect();
      process.exit(1);
    });
}

module.exports = seed;
