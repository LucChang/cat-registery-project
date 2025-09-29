const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Check if DATABASE_URL is set
  console.log('1. Checking environment variables:');
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL environment variable is not set!');
    console.log('💡 Please create a .env file in your project root with:');
    console.log('   DATABASE_URL="mysql://username:password@localhost:3306/database_name"');
    return;
  }
  
  console.log('✅ DATABASE_URL is set');
  // Hide sensitive parts of the URL for security
  const maskedUrl = databaseUrl.replace(/:\/\/[^@]+@/, '://***:***@');
  console.log(`   URL: ${maskedUrl}\n`);
  
  // Test Prisma connection
  console.log('2. Testing Prisma client connection:');
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database');
    
    // Test a simple query
    console.log('\n3. Testing database query:');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);
    
    // Check if tables exist
    console.log('\n4. Checking database schema:');
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table exists (${userCount} records)`);
      
      const catCount = await prisma.cat.count();
      console.log(`✅ Cat table exists (${catCount} records)`);
      
      console.log('\n🎉 Database connection test completed successfully!');
      console.log('Your database is properly configured and accessible.');
      
    } catch (schemaError) {
      console.log('⚠️  Database connected but schema might not be migrated:');
      console.log('   Error:', schemaError.message);
      console.log('💡 Try running: npx prisma migrate dev');
    }
    
  } catch (connectionError) {
    console.log('❌ Failed to connect to database:');
    console.log('   Error:', connectionError.message);
    console.log('\n💡 Common solutions:');
    console.log('   1. Check if your database server is running');
    console.log('   2. Verify your DATABASE_URL credentials');
    console.log('   3. Ensure the database exists');
    console.log('   4. Check firewall/network settings');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection().catch(console.error);