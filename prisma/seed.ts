import {
  PrismaClient,
  CollectionCategory,
  Rarity,
  ReactionType,
} from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USERS = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "arjun@flexyou.demo",
    username: "arjunflex",
    displayName: "Arjun Mehta",
    bio: "Watch collector & EDC enthusiast from Mumbai",
    location: "Mumbai, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "priya@flexyou.demo",
    username: "priyaflex",
    displayName: "Priya Sharma",
    bio: "Sneakerhead. Tech reviewer. Flex daily.",
    location: "Bangalore, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "rahul@flexyou.demo",
    username: "rahulwatches",
    displayName: "Rahul Kapoor",
    bio: "Horology obsessed. Grail hunter.",
    location: "Delhi, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "sneha@flexyou.demo",
    username: "snehaedc",
    displayName: "Sneha Reddy",
    bio: "Minimal EDC. Quality over quantity.",
    location: "Hyderabad, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    email: "vikram@flexyou.demo",
    username: "vikramtech",
    displayName: "Vikram Singh",
    bio: "Tech flex. Gadgets & gear.",
    location: "Pune, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
  },
];

const ITEMS = [
  { name: "Submariner Date", brand: "Rolex", model: "126610LN", value: 1250000, rarity: "GRAIL" as Rarity, category: "WATCHES" as CollectionCategory, year: 2023 },
  { name: "Speedmaster Moonwatch", brand: "Omega", model: "310.30.42.50.01.001", value: 650000, rarity: "ULTRA_RARE" as Rarity, category: "WATCHES" as CollectionCategory, year: 2022 },
  { name: "Air Jordan 1 Retro", brand: "Nike", model: "555088-134", value: 18500, rarity: "RARE" as Rarity, category: "SNEAKERS" as CollectionCategory, year: 2024 },
  { name: "MacBook Pro 16", brand: "Apple", model: "M3 Max", value: 349900, rarity: "UNCOMMON" as Rarity, category: "TECH" as CollectionCategory, year: 2024 },
  { name: "Bellroy Slim Sleeve", brand: "Bellroy", model: "Slim Sleeve", value: 6500, rarity: "COMMON" as Rarity, category: "WALLETS" as CollectionCategory, year: 2023 },
  { name: "Leatherman Wave+", brand: "Leatherman", model: "Wave+", value: 12000, rarity: "UNCOMMON" as Rarity, category: "EDC" as CollectionCategory, year: 2023 },
  { name: "Porsche 911 Carrera", brand: "Porsche", model: "992", value: 18500000, rarity: "GRAIL" as Rarity, category: "CARS" as CollectionCategory, year: 2022 },
  { name: "Sony WH-1000XM5", brand: "Sony", model: "WH-1000XM5", value: 29990, rarity: "COMMON" as Rarity, category: "TECH" as CollectionCategory, year: 2024 },
  { name: "Gold Cuban Chain", brand: "Tanishq", model: "22K Cuban", value: 450000, rarity: "RARE" as Rarity, category: "JEWELRY" as CollectionCategory, year: 2023 },
  { name: "Uniqlo U Tee", brand: "Uniqlo", model: "Crew Neck", value: 1490, rarity: "COMMON" as Rarity, category: "DAILYWEAR" as CollectionCategory, year: 2024 },
  { name: "Seiko Presage", brand: "Seiko", model: "SRPD37", value: 42000, rarity: "UNCOMMON" as Rarity, category: "WATCHES" as CollectionCategory, year: 2023 },
  { name: "Yeezy Boost 350", brand: "Adidas", model: "V2 Zebra", value: 22000, rarity: "RARE" as Rarity, category: "SNEAKERS" as CollectionCategory, year: 2023 },
  { name: "Victorinox Huntsman", brand: "Victorinox", model: "Huntsman", value: 4500, rarity: "COMMON" as Rarity, category: "EDC" as CollectionCategory, year: 2022 },
  { name: "iPhone 15 Pro", brand: "Apple", model: "256GB Titanium", value: 144900, rarity: "UNCOMMON" as Rarity, category: "TECH" as CollectionCategory, year: 2024 },
  { name: "Montblanc Meisterstück", brand: "Montblanc", model: "149", value: 85000, rarity: "ULTRA_RARE" as Rarity, category: "EDC" as CollectionCategory, year: 2021 },
];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  "https://images.unsplash.com/photo-1572635196233-8f0f41b43500?w=800&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
];

/** Flat-lay style image for multi-product tagging demos */
const EDC_FLATLAY =
  "https://images.unsplash.com/photo-1612815154858-93aa5113704f?w=800&q=80";

const MULTI_TAG_PRODUCTS = [
  { name: "Submariner Date", brand: "Rolex", value: 1250000, x: 28, y: 38 },
  { name: "Bellroy Slim Sleeve", brand: "Bellroy", value: 6500, x: 62, y: 55 },
  { name: "Leatherman Wave+", brand: "Leatherman", value: 12000, x: 45, y: 72 },
];

async function main() {
  console.log("Seeding FlexYou database...");

  await prisma.affiliateClick.deleteMany();
  await prisma.savedItem.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.imageProductTag.deleteMany();
  await prisma.flexItem.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  for (const u of DEMO_USERS) {
    await prisma.user.create({
      data: {
        ...u,
        interests: [CollectionCategory.WATCHES, CollectionCategory.EDC, CollectionCategory.TECH],
      },
    });
  }

  // Create follows
  await prisma.follow.createMany({
    data: [
      { followerId: DEMO_USERS[0].id, followingId: DEMO_USERS[1].id },
      { followerId: DEMO_USERS[0].id, followingId: DEMO_USERS[2].id },
      { followerId: DEMO_USERS[1].id, followingId: DEMO_USERS[0].id },
      { followerId: DEMO_USERS[2].id, followingId: DEMO_USERS[0].id },
      { followerId: DEMO_USERS[3].id, followingId: DEMO_USERS[4].id },
      { followerId: DEMO_USERS[4].id, followingId: DEMO_USERS[3].id },
    ],
  });

  let itemIndex = 0;
  for (let ui = 0; ui < DEMO_USERS.length; ui++) {
    const user = DEMO_USERS[ui];
    const categories = [
      CollectionCategory.WATCHES,
      CollectionCategory.EDC,
      CollectionCategory.TECH,
    ] as CollectionCategory[];

    for (let ci = 0; ci < 3; ci++) {
      const category = categories[ci];
      const slug = `${category.toLowerCase()}-collection`;
      const collection = await prisma.collection.create({
        data: {
          userId: user.id,
          name: `${category.charAt(0) + category.slice(1).toLowerCase()} Flex`,
          slug,
          description: `My ${category.toLowerCase()} collection`,
          category,
          coverImage: PLACEHOLDER_IMAGES[ci % PLACEHOLDER_IMAGES.length],
          isPublic: true,
        },
      });

      for (let ii = 0; ii < 1; ii++) {
        const itemData = ITEMS[itemIndex % ITEMS.length];
        itemIndex++;

        const useFlatlay = ui === 0 && ci === 1 && ii === 0;
        const item = await prisma.flexItem.create({
          data: {
            collectionId: collection.id,
            userId: user.id,
            name: useFlatlay ? "Daily EDC Flat Lay" : itemData.name,
            brand: useFlatlay ? "Mixed" : itemData.brand,
            model: itemData.model,
            description: useFlatlay
              ? "Everything I carry today — tap each tag on the photo."
              : `Flexing my ${itemData.name}. Pure quality.`,
            images: [useFlatlay ? EDC_FLATLAY : PLACEHOLDER_IMAGES[itemIndex % PLACEHOLDER_IMAGES.length]],
            estimatedValue: useFlatlay
              ? MULTI_TAG_PRODUCTS.reduce((s, p) => s + p.value, 0)
              : itemData.value,
            purchaseYear: itemData.year,
            affiliateLink: `https://amazon.in/dp/B0${itemIndex}00000`,
            tags: [itemData.brand.toLowerCase(), category.toLowerCase()],
            rarity: itemData.rarity,
          },
        });

        if (useFlatlay) {
          await prisma.imageProductTag.createMany({
            data: MULTI_TAG_PRODUCTS.map((p) => ({
              flexItemId: item.id,
              imageIndex: 0,
              x: p.x,
              y: p.y,
              name: p.name,
              brand: p.brand,
              estimatedValue: p.value,
            })),
          });
        } else if (itemIndex % 4 === 0) {
          await prisma.imageProductTag.create({
            data: {
              flexItemId: item.id,
              imageIndex: 0,
              x: 50,
              y: 45,
              name: itemData.name,
              brand: itemData.brand,
              estimatedValue: itemData.value,
            },
          });
        }

        // Add reactions from other users
        const reactors = DEMO_USERS.filter((u) => u.id !== user.id).slice(0, 3);
        const reactionTypes: ReactionType[] = ["FIRE", "WANT", "RESPECT", "RARE"];
        for (let ri = 0; ri < reactors.length; ri++) {
          await prisma.reaction.create({
            data: {
              userId: reactors[ri].id,
              flexItemId: item.id,
              type: reactionTypes[ri % reactionTypes.length],
            },
          });
        }
      }
    }
  }

  // Recalculate flex scores
  for (const u of DEMO_USERS) {
    const items = await prisma.flexItem.findMany({
      where: { userId: u.id },
      select: { estimatedValue: true, rarity: true, _count: { select: { reactions: true } } },
    });
    const followersCount = await prisma.follow.count({ where: { followingId: u.id } });
    const RARITY_WEIGHTS = { COMMON: 1, UNCOMMON: 5, RARE: 20, ULTRA_RARE: 50, GRAIL: 100 };
    const score = Math.min(
      10000,
      items.length * 10 +
        Math.floor(items.reduce((s, i) => s + i.estimatedValue, 0) / 1000) +
        items.reduce((s, i) => s + i._count.reactions, 0) * 5 +
        followersCount * 8 +
        items.reduce((s, i) => s + RARITY_WEIGHTS[i.rarity], 0)
    );
    await prisma.user.update({ where: { id: u.id }, data: { flexScore: score } });
  }

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
