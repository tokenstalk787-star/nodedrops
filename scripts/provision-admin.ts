import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";
import { Role } from "@prisma/client";

async function provisionAdmin() {
  console.log("=== Provisioning Administrator Account ===");
  const email = process.env.ADMIN_INITIAL_EMAIL || "admin@nodedrops.xyz";
  const password = process.env.ADMIN_INITIAL_PASSWORD || "Admin@NodeDrops2026!";

  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
      create: {
        email,
        name: "NodeDrops Infrastructure Administrator",
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    console.log(`✅ Administrator account provisioned successfully!`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Hash: ${user.passwordHash.slice(0, 16)}...`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Failed to provision administrator:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

provisionAdmin();
