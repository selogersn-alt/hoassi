const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  try {
    const project = await prisma.project.create({
      data: {
        title: "Test Project",
        category: "Santé",
        goal: 10000,
        description: "Test description",
        fullname: "John Doe",
        phone: "12345678",
        cni: "12345",
      }
    });
    console.log("Success:", project);
    const projects = await prisma.project.findMany();
    console.log("Total projects:", projects.length);
  } catch (e) {
    fs.writeFileSync('err-node.txt', e.stack || e.message || String(e), 'utf8');
  } finally {
    await prisma.$disconnect();
  }
}

main();
