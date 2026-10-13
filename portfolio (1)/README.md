# Personal Portfolio Website (Windows guide)

A fast, responsive, accessible portfolio built with plain HTML, CSS and JavaScript. No backend, no build step, no paid services. It runs locally on Windows and deploys free to **GitHub Pages**.

```
portfolio/
├── index.html              Main page: all content lives here
├── 404.html                Custom "page not found" page
├── README.md               This guide
├── .nojekyll               Tells GitHub Pages to serve the files as-is
└── assets/
    ├── css/style.css       Design (colors and fonts are variables at the top)
    ├── js/script.js        Menu, active links, resume setting, contact form
    ├── images/README.md    Where images go, sizes and tips
    └── documents/README.md Where your resume PDF goes
```

The name, title and initials are already filled in. You still need to replace your email, GitHub username and location (section 2).

---

## 1. Edit and preview on Windows

1. Right-click the ZIP, choose **Extract All...**, then **Extract**. Never edit files while they are still inside the ZIP, because changes will not be saved.
2. Move the extracted folder to your Desktop or Documents.
3. Open **Visual Studio Code**, choose **File > Open Folder...** and select the folder.
4. Install the **Live Server** extension (Extensions icon, search "Live Server" by Ritwick Dey, **Install**).
5. Right-click `index.html` and choose **Open with Live Server**. The browser opens at `http://127.0.0.1:5500` and refreshes by itself every time you save.
6. Turn on **File > Auto Save** so you do not need to press `Ctrl + S`.

Without Live Server you can double-click `index.html`, but you must refresh with `Ctrl + Shift + R` after each save.

---

## 2. Details to replace

In VS Code press `Ctrl + H` (Find and Replace), type what to find and what to replace it with, then click **Replace All**.

| Replace this | With |
|--------------|------|
| `your.email@example.com` | Your email address (appears 5 times) |
| `YOUR-USERNAME` | Your GitHub username (links, canonical URL, `og:url`) |
| `[YOUR CITY, COUNTRY]` | Your location, or delete those two lines |
| Intro paragraph in the hero | Edit freely |
| About, Skills, Projects, Experience | Replace every `[placeholder]` with real information |
| Photo | Save as `assets/images/profile.jpg` and follow the comment in the hero section |
| Resume | Save as `assets/documents/resume.pdf`, then set `hasResume: true` in `assets/js/script.js` |

Links that still contain `#` or `YOUR-USERNAME` show a short "placeholder link" notice when clicked. They work normally once you put in a real address. Only add claims you can support: the template contains no invented degrees, jobs, awards or testimonials.

**Colors and fonts:** edit the variables at the top of `assets/css/style.css`.

**Contact form:** it opens the visitor's email app with the message filled in. It cannot send mail by itself. To receive messages directly, create a free form on a service such as Formspree or Web3Forms, add its endpoint as the form's `action` with `method="POST"`, and remove the submit handler in the "Contact form" block of `assets/js/script.js`. Check the service's current free limits first.

---

## 3. Publish free with GitHub Pages

### Step 1: GitHub account
1. Go to <https://github.com/signup> and create an account.
2. Your username becomes your web address (`username.github.io`), so choose a professional one.
3. Verify your email. Turn on two-factor authentication in **Settings > Password and authentication**.

### Step 2: Create the repository
1. Click **+** (top right), then **New repository**.
2. **Repository name:** `YOUR-USERNAME.github.io` (your real username, exactly).
3. Choose **Public**. Leave "Add a README" unchecked.
4. Click **Create repository**.

### Step 3: Upload the files
**Option A: in the browser (easiest)**
1. On the empty repository page, click **uploading an existing file**.
2. Open your project folder in File Explorer, press `Ctrl + A` to select everything **inside** it (`index.html`, `404.html`, `README.md`, `assets`), and drag it into the browser. Do not drag the outer folder itself.
3. Click **Commit changes**.

**Option B: GitHub Desktop (best for later updates)**
1. Install <https://desktop.github.com> and sign in.
2. **File > Add local repository...**, choose your project folder. If asked, click "create a repository", then **Publish repository** and set the name to `YOUR-USERNAME.github.io` (keep it public).
3. For later changes: write a short summary, click **Commit to main**, then **Push origin**.

**Option C: Git in the terminal**
1. Install Git for Windows from <https://git-scm.com/download/win>.
2. In your project folder, right-click and choose **Open in Terminal**, then run:
   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```
3. Sign in when the browser window asks.

### Step 4: Turn on GitHub Pages
1. In the repository open **Settings > Pages**.
2. **Source:** Deploy from a branch. **Branch:** `main` and `/ (root)`. Click **Save**.

### Step 5: Find your live address
Wait one to three minutes and refresh **Settings > Pages**. The banner "Your site is live at ..." shows your URL, `https://YOUR-USERNAME.github.io/`. You can watch progress in the **Actions** tab.

### Step 6: Update the site later
- **Browser:** open the file in the repository, click the pencil icon, edit, and **Commit changes**. For new files use **Add file > Upload files**.
- **GitHub Desktop or Git:** commit and push as above.
- Changes appear after one to three minutes. Refresh with `Ctrl + Shift + R`.

If the repository has a different name than `YOUR-USERNAME.github.io`, the site address becomes `https://YOUR-USERNAME.github.io/repo-name/`, and you must set `SITE_BASE = "/repo-name/"` in `404.html`.

---

## 4. Custom .com domain (optional, later)

GitHub Pages hosting is free. A custom domain is **not**: you pay a registrar a yearly fee and renew it every year. Prices vary, and introductory prices often rise at renewal, so check the renewal price before you buy. The site keeps working at its `github.io` address regardless.

1. **Buy the domain** from a reputable registrar. Turn on auto-renew and WHOIS privacy if offered.
2. **Add DNS records** in the registrar's DNS settings (remove default parking records for the same names first):

   | Type | Host | Value |
   |------|------|-------|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `YOUR-USERNAME.github.io` |

   Optional IPv6 `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

   Safety: use only your username in the CNAME (no `https://`), never use wildcard `*` records, and **confirm these IP addresses in GitHub's current documentation** ("Managing a custom domain for your GitHub Pages site") before saving. DNS can take up to 24 to 48 hours.
3. **Tell GitHub:** **Settings > Pages > Custom domain**, enter your domain, **Save**. GitHub adds a `CNAME` file; leave it. Verifying the domain in your account's Pages settings is recommended.
4. **Enable HTTPS:** when the DNS check passes, tick **Enforce HTTPS**. If it is greyed out, wait up to a day or re-save the domain.
5. **Update** `canonical` and `og:url` in `index.html` to your new domain.

---

## 5. Troubleshooting

| Problem | What to try |
|---------|-------------|
| Edits do not save | You are editing inside the ZIP. Extract it first (section 1). |
| Edits saved but page looks the same | Use Live Server, or refresh with `Ctrl + Shift + R`. Check you opened the same folder you edited. |
| Live site shows 404 | `index.html` must be at the top level of the repository, and **Settings > Pages** must use `main` and `/ (root)`. |
| Live site has no styling | The `assets` folder was not uploaded, or file names changed case (names are case-sensitive online). |
| Changes not live yet | Wait a few minutes, check the **Actions** tab for a green tick, then `Ctrl + Shift + R`. |
| Resume button says "not added yet" | Add `assets/documents/resume.pdf` and set `hasResume: true`. |
| "Placeholder link" notice | That link still contains `#` or `YOUR-USERNAME`. Replace it. |
| Custom domain not working | Recheck the four A records and the `www` CNAME, wait for DNS, remove parking records, check **Settings > Pages** for errors. |
| `git push` asks for a password | Sign in through the browser prompt, or use GitHub Desktop. |

## Accessibility, SEO and performance

Semantic landmarks, a skip link, a single `h1`, visible focus outlines, a keyboard-operable menu (Escape closes it), reduced-motion support, page title, meta description, Open Graph tags, canonical URL, theme color and favicon. No frameworks, tracking or paid APIs. The only external requests are Google Fonts, with system-font fallbacks. No secret keys or credentials are included; never commit passwords or API keys to a public repository.

Icons are from [Lucide](https://lucide.dev) (ISC licence). Fonts (Bricolage Grotesque, Instrument Sans) are open-licensed through Google Fonts.
