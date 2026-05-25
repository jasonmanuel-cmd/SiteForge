/**
 * Database Setup Script
 * Run this to initialize your database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Construction SaaS Database...\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env file not found!');
  console.log('Please copy .env.example to .env and configure it.');
  process.exit(1);
}

try {
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('\n📊 Running database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('\n✅ Database setup complete!');
  console.log('\n🎉 You can now run: npm run dev');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n💡 Tip: Make sure you have npx prisma dev running in another terminal');
  process.exit(1);
}
