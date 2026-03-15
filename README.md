# ChromaVerse 🌌🎨

🚀 **Live Demo:** [https://chromaverse-3d.netlify.app/](https://chromaverse-3d.netlify.app/)

**ChromaVerse** is a modern, single-page educational web application designed to visualize complex color spaces in interactive 3D. 

Built with React, Three.js, and React Three Fiber, this tool helps students, designers, and developers deeply understand the geometries and mathematical relationships of the **RGB**, **HSI**, and **HSV** color models. The application's 3D geometries and color theory strictly adhere to the definitions found in the classic textbook *"Digital Image Processing" by Gonzalez and Woods*.

---

## ✨ Features

- **Interactive 3D Geometries**: 
  - 🟥 **RGB**: Interactive 3D Cube.
  - 🔺 **HSI**: Double Cone visualization highlighting Hue, Saturation, and Intensity logic.
  - 🔷 **HSV**: Hexcone visualization mapping Hue, Saturation, and Value.
- **Real-time Transformations & Conversions**: Switch between color models seamlessly while preserving the visual color. Instantly view mathematical conversions between RGB ↔ HSI and RGB ↔ HSV.
- **Educational Overlays**: View precise coordinate mappings, real-time formula calculations, and theoretical explanations mapping to specific points within the 3D space.
- **Advanced 3D Controls**: Rotate, zoom, and pan around the color models. Toggle **Wireframe Mode** to inspect the internal axes (e.g., the grayscale diagonal in the RGB cube or the Intensity axis in the HSI model).
- **Modern & Responsive UI**: A sleek, dark-mode focused UI engineered with Tailwind CSS featuring responsive layouts and glassmorphism styling.

---

## 🛠️ Technology Stack

- **Core**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **3D Rendering**: [Three.js](https://threejs.org/)
- **React 3D Integration**: [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Utility**: [Chroma.js](https://gka.github.io/chroma.js/) (Color manipulation), [Lucide React](https://lucide.dev/) (Icons)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v16 or higher) installed.

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd Colour_Models
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` (or the port provided in your terminal) to explore the application.

---

## 🏗️ Build for Production

To create an optimized production build:

```bash
npm run build
```

You can then preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```text
src/
├── components/          # React components
│   ├── ColorInfoPanel.jsx # Displays color data and conversion math
│   ├── ControlsPanel.jsx  # Interactive sliders and model toggles
│   ├── HSIModel.jsx       # 3D Double Cone implementation
│   ├── HSVModel.jsx       # 3D Hexcone implementation
│   └── RGBModel.jsx       # 3D Cube implementation
├── styles/              # Global styles and Tailwind directives
├── utils/
│   └── colorConversions.js # Mathematical formulas for RGB ↔ HSI/HSV
├── App.jsx              # Main application layout and state management
└── main.jsx             # React DOM entry point
```

---

## 📚 Theory Reference

The foundational mathematics and structural mapping within ChromaVerse are derived directly from:
**"Digital Image Processing" by Rafael C. Gonzalez and Richard E. Woods (3rd/4th Edition)**. 

Specific references include:
- Conversion of RGB to HSI/HSV via trigonometric definitions.
- Spatial orientation of the RGB color cube (Black at origin, White at max).
- Cylindrical coordinate representations of HSI and HSV spaces.

