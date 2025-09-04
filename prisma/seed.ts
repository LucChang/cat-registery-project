const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 創建測試用戶
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: '測試用戶',
      password: await hash('password123', 10),
    },
  });

  console.log({ testUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });