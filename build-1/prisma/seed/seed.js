"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const data = require("./seed.json");
const prisma = new client_1.PrismaClient();
async function main() {
    let newCategory = 0;
    for (const item of data) {
        try {
            await prisma.category.create({
                data: item,
            });
            newCategory++;
        }
        catch (error) { }
    }
    console.log({ newCategory });
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
//# sourceMappingURL=seed.js.map