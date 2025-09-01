# Module 7: Static Blog UI Design with TailwindCSS

## 🎨 Overview
This project implements the UI/UX design for a static blog platform, built with Figma and styled using TailwindCSS. It includes:

- 📌 **Wireframes and high-fidelity mockups** created in Figma  
- 🧱 **Static pages**: Homepage (`index.html`), Blog List (`blogs.html`), Single Blog (`singleBlog.html`), Admin Dashboard (`adminDashboard.html`)  
- ⚙️ **Server setup** using Express to serve files from `public/`  
- 🛠️ **Responsive design** for mobile and desktop using TailwindCSS

## 🧭 Design Process
1. **Wireframing** in Figma: outlined layout, navigation, and user flows for key pages.  
2. **High-fidelity mockups**: finalized typography, colors, spacing, hover states.  
3. **Componentization**: created reusable pieces like blog cards and buttons.  
4. **Responsive adjustments**: verified and refined designs across mobile/tablet/desktop.

## 📝 Key Design Decisions
- **Color Palette**: Clean white background with blue accents for primary CTAs and links.  
- **Typography**: Clear, legible hierarchy using bold headings and gray body text.  
- **Hover Effects**: Subtle color transitions on buttons and links for engagement.  
- **Layout**: Card-based blog list for modular presentation and reusability.

## 🚀 Getting Started
To run locally:

```bash
cd module-7/Assignment
npm install
npm run build:css     # Generates style.css from Tailwind input
npm start             # Starts Express server
