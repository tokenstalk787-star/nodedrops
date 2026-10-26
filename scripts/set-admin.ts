import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";
import { Role } from "@prisma/client";

async function setAdmin() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_INITIAL_EMAIL || "admin@nodedrops.xyz").toLowerCase().trim();
  const password = args[1] || process.env.ADMIN_INITIAL_PASSWORD || "Admin@NodeDrops2026!";

  if (!email || !email.includes("@")) {
    console.error("❌ Valid email lazmi he. Example: pnpm tsx scripts/set-admin.ts admin@nodedrops.xyz MySecurePass123!");
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error("❌ Password kam az kam 8 characters ka hona chahiye.");
    process.exit(1);
  }

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
        name: "NodeDrops Administrator",
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    console.log("==================================================");
    console.log("✅ Admin Account Successfully Set / Updated!");
    console.log("==================================================");
    console.log(`Email:    ${user.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${user.role}`);
    console.log(`Status:   ACTIVE`);
    console.log("==================================================");
    console.log("Ab aap browser me http://localhost:3000/admin/login par login kar saktay hain.");

    await prisma.$disconnect();
  } catch (error) {
    console.error("Admin set karne me error aya:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

setAdmin();
