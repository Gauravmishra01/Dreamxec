const slugify = require("slugify");
const prisma = require("../config/prisma");

async function generateUniqueSlug(title, tx) {
    const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await tx.userProject.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}


module.exports = generateUniqueSlug;
