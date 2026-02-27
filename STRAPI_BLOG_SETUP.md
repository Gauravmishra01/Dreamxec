# Strapi CMS — Blog Integration Setup Guide

This guide walks you through configuring your existing Strapi instance so it
serves blog posts to the DreamXec frontend.

---

## 1. Configure environment variables

Copy `.env.example` to `.env.local` in the `client/` folder and fill in your
Strapi URL (and optional API token):

```
# client/.env.local
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=          # leave empty if the collection is public
```

**Never commit `.env.local` to version control.**

---

## 2. Create the "Blog Post" content type in Strapi

1. Open your Strapi admin panel → **Content-Type Builder** → **Create new
   Collection Type**.
2. Set the **Display Name** to `Blog Post` (API ID will auto-fill as
   `blog-post`; the REST endpoint will be `/api/blog-posts`).
3. Add the following fields:

| Field name       | Strapi field type            | Notes                                           |
| ---------------- | ---------------------------- | ----------------------------------------------- |
| `title`          | Short text · Required        |                                                 |
| `slug`           | UID · Required               | Attached to `title`; used in page URLs          |
| `excerpt`        | Long text · Required         | Short summary shown on listing / SEO            |
| `featuredImage`  | Media (single image)         | Used in hero and cards                          |
| `author`         | Short text · Required        |                                                 |
| `authorRole`     | Short text                   | e.g. "Co-Founder, DreamXec"                     |
| `authorAvatar`   | Media (single image)         | Or Short text if you store an external URL      |
| `date`           | Date                         | Publication date                                |
| `readTime`       | Short text                   | e.g. "7 min read"                               |
| `category`       | Short text · Required        | Must match one of the values in `categoryColors`|
| `tags`           | JSON                         | Array of strings: `["Tag1","Tag2"]`             |
| `content`        | JSON                         | Array of `BlogSection` objects (see §3 below)   |

4. Click **Save** and restart Strapi when prompted.

---

## 3. `content` field format

The `content` JSON field must be an array of `BlogSection` objects. Each entry
has a `type` and either `text` or `items`:

```json
[
  { "type": "heading",    "text": "Section Title" },
  { "type": "subheading", "text": "Sub-section Title" },
  { "type": "paragraph",  "text": "Body paragraph text." },
  { "type": "quote",      "text": "A blockquote." },
  { "type": "callout",    "text": "Highlighted tip box text." },
  { "type": "bullet-list","items": ["Point one", "Point two"] }
]
```

Valid `type` values: `heading` · `subheading` · `paragraph` · `quote` ·
`bullet-list` · `callout`

---

## 4. Set API permissions

By default Strapi blocks all unauthenticated requests.

### Option A — Public access (simplest)

1. Strapi admin → **Settings → Roles → Public**.
2. Find **Blog-post** under **Permissions**.
3. Enable the `find` and `findOne` actions.
4. Click **Save**.

Leave `VITE_STRAPI_TOKEN` empty in `.env.local`.

### Option B — API Token (more secure)

1. Strapi admin → **Settings → API Tokens → Add new token**.
2. Name it (e.g. "DreamXec Frontend"), set type to **Read-only**, and set
   **Token duration** to "Unlimited".
3. Click **Save** and copy the token.
4. Paste it into `VITE_STRAPI_TOKEN` in `client/.env.local`.

You can keep the Public role locked when using a token.

---

## 5. Supported `category` values

The frontend maps categories to badge colours using this list. Use these exact
strings in the `category` field:

| Category value   | Badge colour        |
| ---------------- | ------------------- |
| `Innovation`     | Orange              |
| `Guides`         | Green               |
| `Mentorship`     | Sky blue            |
| `Insights`       | Resolution blue     |
| `Our Story`      | Saffron             |
| `Impact`         | Dark green          |

Any other string will fall back to a navy badge.

---

## 6. Verify the integration

With Strapi running and `.env.local` set, start the frontend:

```bash
cd client
npm run dev
```

Navigate to `/blog`. Posts should load from Strapi.  
If `VITE_STRAPI_URL` is unset or the fetch fails, the app automatically falls
back to the static content in `src/data/blogData.ts` — the site always has
content to show.

---

## 7. Image hosting

- **Local Strapi (development)** — images are served from Strapi's `/uploads/`
  folder. The service layer automatically prepends `VITE_STRAPI_URL` to
  relative paths.
- **Production** — configure Strapi to upload to Cloudinary, AWS S3, or any
  provider. Strapi will return absolute URLs, which the service layer detects
  and uses as-is.

---

## 8. Architecture overview

```
client/src/
├── services/
│   └── strapiService.ts      ← Axios calls to Strapi, response mapping
├── hooks/
│   ├── useBlogPosts.ts       ← All posts (used by BlogListing)
│   └── useBlogPost.ts        ← Single post by slug (used by BlogPost)
├── data/
│   └── blogData.ts           ← Static fallback data (unchanged)
└── sections/Pages/blog/
    ├── BlogListing.tsx        ← Updated: uses useBlogPosts hook
    └── BlogPost.tsx           ← Updated: uses useBlogPost + useBlogPosts hooks
```

Both hooks transparently fall back to `blogData.ts` when Strapi is unreachable,
so the site always works.
