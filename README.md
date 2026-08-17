# My STEM Lab — mystemlab.co.uk

The website for My STEM Lab, built with [Jekyll](https://jekyllrb.com/) and hosted free on
GitHub Pages at **https://mystemlab.co.uk**.

You do **not** need to install anything to update this site. Edit a file in GitHub Desktop,
commit, push — GitHub rebuilds the site and it's live in about a minute.

---

## The five things you'll actually do

### 1. Write a blog post

Create a new file in `_posts/` named `YYYY-MM-DD-some-title.md`. The date in the filename
is the publish date and it matters — Jekyll won't publish a post dated in the future.

```markdown
---
title: "How to revise for a mechanics paper"
subtitle: "One sentence shown on the blog index and under the title."
date: 2026-09-14
tags: [mechanics, A-Level]
mathjax: true        # only needed if the post contains equations
---

Write in Markdown. **Bold**, *italic*, [links](https://example.com), and:

## Headings like this

- bullet points
- more bullet points

For maths, `mathjax: true` in the front matter above, then $x^2 + 1$ for inline
and $$\int_0^1 x^2 \, dx = \tfrac{1}{3}$$ for a displayed equation.
```

To pull out a highlighted box, use:

```html
<div class="callout" markdown="1">
**Note:** this appears in a teal-edged box.
</div>
```

That's it. The post appears on `/blog/` automatically, newest first.

### 2. Add a free resource

Open `_data/resources.yml`, find the subject, add a block:

```yaml
a-level-maths:
  - title: "Integration by parts worksheet"
    type: "Worksheet"
    description: "Twenty questions building from routine to hard, with full solutions."
    url: "/assets/resources/integration-by-parts.pdf"
    featured: true      # optional — pins it to the top with a "Start here" tag
```

If it's your own PDF, put the file in `assets/resources/` and use the path shown above.
If it's someone else's site, use the full URL and add `external: true`.

It appears on both the subject page and `/resources/` with no other changes.

### 3. Change prices, email address or the form link

All in `_config.yml`, near the top. Change once, updates everywhere on the site.
(Config changes need a commit like anything else — GitHub rebuilds on push.)

### 4. Edit a subject page

Each subject is one file in `_subjects/`. The block at the top between `---` lines controls
the title, level, price and the short blurb shown on cards. Everything below it is normal Markdown.

To add a new subject, copy an existing file, change `slug` and `order`, and add a matching
`slug:` entry in `_data/resources.yml`. It'll appear in the nav, the footer and the resources
page by itself.

### 5. Update the poster

Edit `poster/poster.html` — it's plain HTML and CSS, and the text is easy to find.
Then re-render the PNG:

```bash
npm install playwright      # one-off, first time only
node poster/render.js       # writes MyStemLab_Poster.png
```

The poster is used as the link-preview image when you share the site on WhatsApp, so it's
worth re-rendering after any change.

---

## Local preview (optional)

Only needed if you want to see changes before pushing.

```bash
bundle install              # one-off
bundle exec jekyll serve    # then open http://localhost:4000
```

On a Mac you'll need Ruby first: `brew install ruby`.

---

## How the site is put together

```
_config.yml            Site-wide settings: prices, email, form link
_data/
  navigation.yml       The top menu
  resources.yml        All free resources, grouped by subject
  achievements.yml     The results shown on the home and about pages
_subjects/             One file per subject — becomes /subjects/<slug>/
_posts/                Blog posts
_layouts/              Page templates
_includes/             Reused fragments (header, footer, CTA band, resource cards)
assets/
  css/style.css        All styling
  js/main.js           Mobile menu and the resources search box
  img/                 Photo, QR code, favicon
  resources/           Put your own PDFs and worksheets here
poster/                Poster source + render script (not published to the site)
index.html             Home page
subjects.html          Subject overview
resources.html         Free resources hub
about.html             About page
contact.html           Registration form + contact details
blog.html              Blog index
members.html           Member area (placeholder)
CNAME                  The custom domain — do not delete
```

---

## Important: everything in this repo is public

This repo is public, and **everything GitHub Pages serves is public too**. That includes any
PDF you upload, whether or not there's a link to it. There is no way to make a file on GitHub
Pages private, and a login form written in JavaScript does not change that — anyone can read
the page source.

So:

- **Free resources** — fine to put in `assets/resources/`.
- **Paid or member-only material** — do **not** put it in this repo.

The `/members/` page is a placeholder for exactly this reason: the layout is ready, but there's
no sign-in behind it yet, because doing it properly needs something GitHub Pages can't provide.

When you're ready to sell resources, the realistic options are:

| Option | What it does | Effort |
|---|---|---|
| **Gumroad / Payhip** | Upload a PDF, set a price, link to it from this site. They handle payment and delivery. | Lowest — an afternoon |
| **Substack / Patreon** | Paid membership; you post material behind it and link from here. | Low |
| **Netlify + Netlify Identity** | Move hosting off GitHub Pages; real password-protected pages. | Medium |
| **Cloudflare Pages + Workers** | Same idea, more control, free tier is generous. | Medium |
| **Teachable / Thinkific** | Full course platform if this grows beyond worksheets. | Higher, costs money |

For a tutoring business at this stage, Gumroad linked from the site is almost certainly the
right answer. You keep this site simple and free, and nothing sensitive ever touches the repo.

---

## Deployment

Pushing to `main` publishes the site. Check
**Settings → Pages** on GitHub is set to deploy from the `main` branch, root folder.

If a build fails, GitHub emails you and the site keeps serving the last good version.
