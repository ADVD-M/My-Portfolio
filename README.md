<div align="center">
  <h1>Advait Mehendale | Portfolio</h1>
  <p><strong>HTML5 · CSS3 · JavaScript · Bootstrap 5</strong></p>
  <p>
    <a href="https://github.com/ADVD-M/My-Portfolio"><strong>View Repository »</strong></a>
  </p>
</div>

<hr />

A fully static personal portfolio website — no backend, no build tools, no dependencies. Opens directly in a browser or deploys to any static host.

---

### Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3, Bootstrap 5.3 |
| Animations | particles.js |
| Icons | Font Awesome 6 |
| Content | `data.js` (plain JavaScript object) |

---

### Project Structure

```
Portfolio_CMS/
├── index.html          # Home + Projects
├── experience.html     # Work experience
├── publications.html   # Research publications
├── contact.html        # Contact details
├── data.js             # ← Edit this to update all content
├── css/
│   └── style.css
├── js/
│   └── particles-config.js
└── img/
    └── pfp.jpeg
```

---

### Adding Content

All content is managed from a single file: **`data.js`**

**Add a project** — append to the `projects` array:
```js
{
  "title": "Project Name",
  "tech": "Python, FastAPI",
  "desc": "What it does.",
  "link": "https://github.com/ADVD-M/repo"
}
```

**Add experience** — append to the `experience` array:
```js
{
  "name": "Company Name",
  "role": "Your Role",
  "duration": "Jan 2025 – Mar 2025",
  "description": "What you did here."
}
```

**Add a publication** — append to the `publications` array:
```js
{
  "title": "Paper Title",
  "authors": "Name One, Name Two",
  "year": "2026",
  "venue": "Conference Name",
  "type": "Conference Paper",
  "abstract": "Abstract text.",
  "link": "https://doi.org/..."
}
```

---

### Running Locally

Open `index.html` directly in any browser — no server required.
