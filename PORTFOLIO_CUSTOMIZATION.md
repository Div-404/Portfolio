# 🎨 Portfolio Customization Guide

Advanced customization options and code examples to make your portfolio truly unique.

## Table of Contents
1. [Colors & Theme](#colors--theme)
2. [Typography](#typography)
3. [3D Scene Customization](#3d-scene-customization)
4. [Content Modifications](#content-modifications)
5. [Adding New Sections](#adding-new-sections)
6. [Advanced Features](#advanced-features)

---

## Colors & Theme

### Quick Color Scheme Changes

The entire color scheme is controlled by CSS variables. Find and modify these in the `<style>` section:

```css
:root {
    --midnight: #0f1419;           /* Main background */
    --graphite-dark: #1a1f2e;      /* Secondary background */
    --graphite-light: #2d3748;     /* Tertiary background */
    --accent-cyan: #00d4ff;        /* Primary accent (blue) */
    --accent-purple: #a78bfa;      /* Secondary accent (purple) */
    --accent-emerald: #10b981;     /* Tertiary accent (green) */
    --glass-bg: rgba(45, 55, 72, 0.15);
    --glass-border: rgba(255, 255, 255, 0.1);
    --text-primary: #f7fafc;       /* Main text color */
    --text-secondary: #cbd5e1;     /* Secondary text */
    --text-tertiary: #94a3b8;      /* Tertiary text */
}
```

### Preset Color Schemes

#### Dark Blue Theme
```css
:root {
    --midnight: #0a0e27;
    --graphite-dark: #1e1f3f;
    --accent-cyan: #0099ff;
    --accent-purple: #6366f1;
    --accent-emerald: #06b6d4;
}
```

#### Neon Pink Theme
```css
:root {
    --midnight: #0f0f1e;
    --graphite-dark: #1a1a2e;
    --accent-cyan: #ff006e;
    --accent-purple: #8338ec;
    --accent-emerald: #3a86ff;
}
```

#### Warm Orange Theme
```css
:root {
    --midnight: #1a1410;
    --graphite-dark: #2d1f1a;
    --accent-cyan: #ff6b35;
    --accent-purple: #f7931e;
    --accent-emerald: #fcb045;
}
```

#### Forest Green Theme
```css
:root {
    --midnight: #0f1419;
    --graphite-dark: #1a2626;
    --accent-cyan: #10b981;
    --accent-purple: #34d399;
    --accent-emerald: #6ee7b7;
}
```

### Gradient Customization

Change gradient colors throughout:

```css
/* Hero title gradient */
.hero-content h1 {
    background: linear-gradient(135deg, #00d4ff, #a78bfa);
    -webkit-background-clip: text;
}

/* Project card gradient */
.project-card {
    background: linear-gradient(135deg, rgba(45,55,72,0.15), rgba(167,139,250,0.05));
}

/* Button gradient */
.cta-button {
    background: linear-gradient(135deg, #00d4ff, #a78bfa);
}
```

---

## Typography

### Font Changes

Change the font family globally:

```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* For monospace (code sections) */
.architecture-diagram,
.terminal {
    font-family: 'Fira Code', 'Courier New', monospace;
}
```

### Google Fonts Integration

Add custom fonts from Google Fonts:

```html
<!-- Add to <head> section -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body {
    font-family: 'Space Grotesk', sans-serif;
}
</style>
```

### Text Size Adjustments

Modify heading sizes globally:

```css
.section-title {
    font-size: 2.8rem;  /* Change to your preference: 2rem, 3rem, 4rem */
}

.hero-content h1 {
    font-size: 3.8rem;  /* Increase for impact: 4.5rem, 5rem */
}

.exp-card h3 {
    font-size: 1.4rem;  /* Smaller heading: 1.2rem, 1.3rem */
}
```

### Line Height & Spacing

```css
/* Increase readability */
p {
    line-height: 1.8;   /* Default is 1.7, increase for more space */
    letter-spacing: 0.5px;  /* Add subtle letter spacing */
}

/* Title spacing */
.section-title {
    letter-spacing: 2px;  /* More dramatic titles */
    margin-bottom: 4rem;  /* Space after title */
}
```

---

## 3D Scene Customization

### Change Model Colors

Edit the `loadGLBModel()` function:

```javascript
// Body color (main model)
const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d3748,      // Change this hex color
    metalness: 0.6,       // 0 = not shiny, 1 = very shiny
    roughness: 0.4,       // 0 = smooth, 1 = rough
});

// Head color
const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xc9a876,      // Skin tone
    metalness: 0.3,
    roughness: 0.5,
});
```

### Adjust Rotation Speed

```javascript
// Faster rotation
model.rotation.y += 0.008;  // Default is 0.004
model.rotation.x += 0.002;  // Default is 0.001

// Slower rotation
model.rotation.y += 0.002;  // Slower
```

### Floating Animation Intensity

```javascript
// Default floating
model.position.y = Math.sin(Date.now() * 0.0008) * 0.3;

// Stronger float (more movement)
model.position.y = Math.sin(Date.now() * 0.001) * 0.5;

// Subtle float (less movement)
model.position.y = Math.sin(Date.now() * 0.0005) * 0.15;
```

### Particle Customization

```javascript
const particleCount = 20;  // Change particle count (more = more intense)

// Particle color
const pMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00d4ff  // Change color
});

// Particle size
const pGeometry = new THREE.SphereGeometry(0.05, 8, 8);  // 0.05 = size
```

### Ring Customization

```javascript
// Add more rings
for (let i = 0; i < 5; i++) {  // Change 5 for more/fewer rings
    const ringGeometry = new THREE.TorusGeometry(
        1.5 + i * 0.3,  // Radius spacing
        0.04,           // Ring thickness
        16,             // Ring segments
        100
    );
}

// Ring colors
color: new THREE.Color().setHSL(0.55 + i * 0.1, 1, 0.5),
```

### Lighting Adjustments

```javascript
// Ambient light (overall brightness)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // 0.5 = brightness

// Directional light (shadows)
const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1.2);  // 1.2 = intensity

// Point light (accent)
const pointLight = new THREE.PointLight(0xa78bfa, 0.8);  // 0.8 = intensity
```

### Replace with GLB Model

If you have your own 3D model:

```javascript
const loader = new THREE.GLTFLoader();
loader.load('/path/to/your-model.glb', function(gltf) {
    model = gltf.scene;
    scene.add(model);
    model.scale.set(1.5, 1.5, 1.5);  // Scale as needed
});
```

---

## Content Modifications

### Update Personal Info

```html
<!-- Hero section -->
<div class="tagline">Your New Title</div>
<h1>Your Name</h1>
<p>Your description here...</p>

<!-- Contact section -->
<div class="terminal-line">📧 your.email@example.com</div>
<div class="terminal-line">📱 +91 XXXXXXXXXX</div>
<div class="terminal-line">🏙️ Your City, Country</div>
```

### Add New Experience Entry

```html
<div class="exp-card">
    <h3>Company Name</h3>
    <div class="role">Your Title | Start Date - End Date</div>
    <p>
        Accomplished achievement one. Managed responsibility two. 
        Improved metric by X%. Delivered product feature.
    </p>
    <div class="tech-tags">
        <span class="tech-tag">Technology1</span>
        <span class="tech-tag">Technology2</span>
        <span class="tech-tag">Technology3</span>
    </div>
</div>
```

### Add New Project

```html
<div class="project-card">
    <div class="project-icon">🎯</div>  <!-- Choose emoji -->
    <h3>Project Name</h3>
    <p>What the project does. What problems it solves. Key achievements and metrics.</p>
    <div class="project-tech">
        <span class="tech-tag">Tech1</span>
        <span class="tech-tag">Tech2</span>
    </div>
</div>
```

### Add New Timeline Item

```html
<div class="timeline-item">
    <div class="timeline-dot">🏆</div>
    <div class="timeline-content">
        <h3>Achievement Title</h3>
        <p>Description of the achievement, milestone, or learning experience.</p>
    </div>
</div>
```

### Add New Skill Category

```html
<div class="skill-category">
    <h3>Category Name</h3>
    <div class="skill-list">
        <span class="skill-item">Skill 1</span>
        <span class="skill-item">Skill 2</span>
        <span class="skill-item">Skill 3</span>
    </div>
</div>
```

---

## Adding New Sections

### Template for New Section

```html
<!-- Add to navigation -->
<li><a href="#new-section">New Section</a></li>

<!-- Add section -->
<section id="new-section" class="new-section">
    <h2 class="section-title">Section Title</h2>
    
    <!-- Your content here -->
    
</section>

<!-- Add CSS -->
<style>
.new-section {
    padding: 6rem 4rem;
    background: linear-gradient(180deg, var(--graphite-dark) 0%, var(--midnight) 100%);
    position: relative;
}

.new-section-item {
    padding: 2rem;
    border-radius: 1rem;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.new-section-item:hover {
    border-color: var(--accent-cyan);
    transform: translateY(-5px);
}
</style>
```

### Example: Certifications Section

```html
<section id="certifications" class="certifications">
    <h2 class="section-title">Certifications & Achievements</h2>
    <div class="cert-grid">
        <div class="cert-card">
            <h3>AWS Certified Solutions Architect</h3>
            <p class="cert-date">January 2025</p>
            <p>Professional level certification</p>
        </div>
        <div class="cert-card">
            <h3>Google Cloud Professional Data Engineer</h3>
            <p class="cert-date">December 2024</p>
            <p>Big data and machine learning expertise</p>
        </div>
    </div>
</section>
```

### Example: Testimonials Section

```html
<section id="testimonials" class="testimonials">
    <h2 class="section-title">What People Say</h2>
    <div class="testimonial-grid">
        <div class="testimonial-card">
            <p class="quote">"Shivam is an exceptional engineer who delivers high-quality code consistently."</p>
            <p class="author">— John Doe, CTO at Tech Company</p>
        </div>
        <div class="testimonial-card">
            <p class="quote">"Great problem solver and mentor. Highly recommended!"</p>
            <p class="author">— Jane Smith, Team Lead at StartUp</p>
        </div>
    </div>
</section>
```

---

## Advanced Features

### Dark/Light Mode Toggle

Add to navigation:

```html
<button id="theme-toggle" class="theme-toggle">🌙</button>
```

Add JavaScript:

```javascript
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
}
```

Add CSS:

```css
body.light-theme {
    --midnight: #ffffff;
    --text-primary: #0f1419;
    --text-secondary: #3a3a3a;
}
```

### Contact Form (Using Netlify Forms)

```html
<form name="contact" method="POST" netlify>
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <button type="submit">Send Message</button>
</form>
```

### Download CV Button

```html
<button class="cta-button" onclick="downloadCV()">
    Download CV
</button>

<script>
function downloadCV() {
    const link = document.createElement('a');
    link.href = 'path/to/Shivam_Resume.pdf';
    link.download = 'Shivam_Divaker_Resume.pdf';
    link.click();
}
</script>
```

### Smooth Scroll Animations

```javascript
// Add to any section for entry animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.exp-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});
```

### Search Functionality

```html
<div class="search-box">
    <input type="text" id="search" placeholder="Search projects...">
</div>

<script>
document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.project-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });
});
</script>
```

### Parallax Scrolling Effect

```javascript
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero3d = document.querySelector('.hero-3d');
    if (hero3d) {
        hero3d.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
```

---

## Performance Optimization Tips

### Minify CSS (Optional)

Use online tool: https://cssminifier.com
Replace original CSS with minified version.

### Optimize Images

If adding images:
```bash
# Using ImageOptim (Mac) or similar
# Reduces file size by 50-80% without visible quality loss
```

### Lazy Load Images

```html
<img src="image.jpg" loading="lazy" alt="Description">
```

### Preload Critical Resources

```html
<link rel="preload" as="script" href="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js">
```

---

## Testing Customizations

### Browser Testing
1. **Chrome**: Most accurate rendering
2. **Firefox**: Good performance
3. **Safari**: CSS compatibility
4. **Mobile**: Use DevTools responsive mode

### Performance Check
```
F12 → Lighthouse → Analyze
Target: Performance 90+
```

### Cross-Browser Compatibility
Use https://caniuse.com/ to check feature support.

---

## Common Customizations Checklist

- [ ] Update color scheme
- [ ] Change fonts
- [ ] Update personal information
- [ ] Add/remove experience entries
- [ ] Update project list
- [ ] Modify 3D scene
- [ ] Add certifications section
- [ ] Add testimonials
- [ ] Implement contact form
- [ ] Test on mobile devices
- [ ] Verify all links work
- [ ] Check Lighthouse score
- [ ] Test on multiple browsers

---

## Need More Help?

Resources:
- **CSS-Tricks**: https://css-tricks.com/
- **MDN Web Docs**: https://developer.mozilla.org/
- **Three.js Docs**: https://threejs.org/docs/
- **Stack Overflow**: https://stackoverflow.com/

---

**Happy customizing! 🎨**
