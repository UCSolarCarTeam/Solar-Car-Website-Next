import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const LOCAL_DATABASE_URL =
  "postgresql://postgres:password@localhost:5432/solar-car-website-next";

async function main() {
  console.log("Starting seed...");

  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl !== LOCAL_DATABASE_URL) {
    console.error(
      "FATAL: Refusing to seed because DATABASE_URL is not the expected local database URL.",
    );
    console.error(`Expected DATABASE_URL=${LOCAL_DATABASE_URL}`);
    console.error(`Current DATABASE_URL=${databaseUrl ?? "<unset>"}`);
    process.exit(1);
  }

  // Clear existing rows (safe for local development)
  await prisma.timeline.deleteMany();
  await prisma.recruitment.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.user.deleteMany();

  // Users
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    await prisma.user.create({
      data: {
        clerkUserId: faker.string.uuid(),
        description: faker.lorem.sentence(),
        firstName,
        lastName,
        linkedIn: `https://www.linkedin.com/in/${faker.internet.userName()}`,
        phoneNumber: faker.phone.number(),
        profilePictureUrl: `https://picsum.photos/seed/${faker.string.uuid()}/200/200`,
        schoolEmail: email,
      },
    });
  }

  // Timeline - last 6 months
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    await prisma.timeline.create({
      data: {
        description: faker.lorem.sentences(2),
        imageUrl: null,
        monthName: d.toLocaleString("default", { month: "long" }),
        monthNum: d.getMonth() + 1,
        year: d.getFullYear(),
      },
    });
  }

  // Sponsors
  const sponsorLevels = ["Gold", "Silver", "Bronze", "Friends"];
  for (const level of sponsorLevels) {
    await prisma.sponsor.create({
      data: {
        description: faker.lorem.sentence(),
        logoUrl: `https://picsum.photos/seed/${faker.string.uuid()}/300/100`,
        name: faker.company.name(),
        sponsorLevel: level,
        websiteUrl: faker.internet.url(),
      },
    });
  }

  // Recruitment
  for (let i = 0; i < 3; i++) {
    await prisma.recruitment.create({
      data: {
        description: faker.lorem.paragraph(),
        expiresAt: faker.date.future({ years: 1 }),
        header: faker.lorem.sentence(),
        link: faker.internet.url(),
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
