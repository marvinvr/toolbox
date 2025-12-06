### Game Overview
This 3D browser-based rocket exploration game, powered by Three.js, lets players pilot a customizable spacecraft. Launch from Earth's surface, navigate vast space, and attempt precise landings on procedurally generated planets such as Mars or the Moon. Core challenges revolve around physics simulation: fuel management for thrusts and maneuvers, trajectory calculations to evade asteroids, and controlled descents adapting to different gravitational forces.

### Visual Perspectives
- **Launch Phase**: Third-person trailing camera positioned at a 45-degree downward angle, capturing ignited exhaust flames as Earth's curved blue horizon and clouds recede into a darkening, star-filled void.
- **Space Navigation**: 360-degree orbital panning around the spacecraft via mouse control, set against a twinkling starry backdrop with distant glowing planets and navigable gray asteroid clusters to dodge.
- **Landing Phase**: Close third-person overhead view tilted forward at 30 degrees for precision, showing the rocket's shadow enlarging on cratered surfaces, dust particles kicking up, and real-time velocity indicators on the HUD as terrain approaches.
- **Success View**: Wide-angle static shot of the landed rocket in alien landscapes, illuminated by celebratory flares.

### Gameplay Mechanics
- Manage limited fuel resources for all actions: upward boosts during launch, directional adjustments in space, and deceleration for safe landings.
- Avoid obstacles like asteroid fields through calculated paths; collisions or fuel depletion lead to failure states.
- Procedurally generated planets increase difficulty across levels, with varying gravity, distances, and environmental hazards.

### Controls
- W/A/S/D: Directional thrust (forward, left, backward, right).
- Spacebar: Main upward boost for launches and ascents.
- Perspective: 3rd person view of the rocket.
- Shift: Deceleration for controlled descents and landings.

### Scoring and Replayability
- Score tracks the number of planets visited and total fuel consumed in tons.
- Escalating levels unlock new planets and upgrades, promoting multiple playthroughs in a seamless, immersive loop.

### Code Structure
The project is structured as follows:

**Root Level:**
- `index.html` - Main HTML file with canvas, HUD, controls, and CSS styles
- `package.json` - Project configuration using Vite for development and build
- `Dockerfile` - Multi-stage Docker build for production deployment
- `bun.lock` - Bun package manager lockfile

**src/:** Main source code folder
- `main.js` - Entry point that initializes the Game class
- `Game.js` - Main game class handling scene, camera, physics, and game loop
- `objects/` - Game entity classes:
  - `Rocket.js` - Player's rocket with physics, fuel, and visual components
  - `Planet.js` - Planet/moon objects with gravity, landing detection, and visuals
  - `Asteroid.js` - Asteroid field collision objects
- `utils/` - Utility classes:
  - `Physics.js` - Physics calculations (gravity, forces)
  - `InputHandler.js` - Keyboard and mouse input processing
  - `EdgeIndicators.js` - UI indicators for off-screen planets
- `data/` - Game data:
  - `SolarSystem.js` - Complete solar system data with planets, moons, and asteroid belts

**Dependencies:**
- Three.js (^0.169.0) - 3D graphics library
- Vite (^5.4.11) - Build tool and development server

**Key Features Implemented:**
- Dynamic camera system with 2D/3D mode switching based on planetary proximity
- Comprehensive solar system with all planets, major moons, and asteroid belts
- Physics simulation with gravity, fuel consumption, and atmospheric drag
- Mini-map with real-time rocket position and orbital paths
- Landing system with automatic gear deployment and surface orientation
- HUD with fuel, velocity, altitude, and target information
- Edge indicators for off-screen celestial bodies

**Development Environment:**
- Uses Vite for fast development server (`bun run dev`)
- ES6 modules with Three.js imports
- Modern JavaScript with classes and async/await


## Development Practices
- NEVER try to do like bun run dev or whatever to test it. The developer will do that himself and give you feedback.

## Technical Implementation Notes

### Game Architecture
- **Game.js**: Central game controller with scene management, camera controls, and game loop
- **Physics System**: Realistic gravity simulation with multiple gravitational bodies
- **Camera System**: Automatic 2D/3D mode switching based on planetary proximity (threshold: 300 units)
- **Input System**: Handles WASD for directional thrust, Space for main engine, Shift for deceleration

### Key Game States
- `launch` - Player launching from Earth's surface
- `space` - Free flight in space between celestial bodies
- `landing` - Approaching a planet for landing
- `gameOver` - Game ended due to crash or fuel depletion

### Visual Systems
- **Starfield**: 10,000 procedurally placed stars for space backdrop
- **Lighting**: Directional sun light, ambient lighting, and point lights
- **Shadows**: PCF soft shadows enabled for realistic lighting
- **Fog**: Distance fog for atmospheric effect

### Performance Optimizations
- Frame rate capped at 60 FPS
- Delta time clamped to prevent physics instability
- Efficient collision detection for asteroids
- Smooth camera interpolation with configurable lerp speed

### Fuel and Physics
- Fuel consumption varies by thrust type (main engine vs RCS)
- Atmospheric drag applied when near planets (within 300 units)
- Gravity affects rocket from all celestial bodies simultaneously
- Landing detection based on speed and altitude thresholds

### Development Commands
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build

### Docker Deployment
- Multi-stage build using Bun for building and Nginx for serving
- Production-ready container with optimized static file serving