import * as THREE from 'three';
import { Physics } from '../utils/Physics.js';
import { EdgeIndicators } from '../utils/EdgeIndicators.js';
import { Rocket } from '../objects/Rocket.js';
import { Planet } from '../objects/Planet.js';
import { AsteroidField } from '../objects/Asteroid.js';
import { getPlanetByName, SOLAR_SYSTEM } from '../data/SolarSystem.js';

export class SolarSystemScene {
    constructor(inputHandler) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.inputHandler = inputHandler;
        this.physics = new Physics();
        this.edgeIndicators = new EdgeIndicators();
        
        // Game state
        this.score = 0;
        this.planetsVisited = 0;
        this.visitedPlanets = new Set();
        
        // Camera controls for 2D-style view
        this.cameraHeight = 200;
        this.cameraTarget = new THREE.Vector3();
        this.cameraPosition = new THREE.Vector3();
        this.cameraLerpSpeed = 0.05;
        
        // Scene transition parameters
        this.approachThreshold = 120; // Distance to planet to trigger transition
        
        // Game objects
        this.rocket = null;
        this.earth = null;
        this.planets = [];
        this.asteroidFields = [];
        
        // Mini-map
        this.setupMiniMap();
        
        this.init();
    }
    
    init() {
        // Setup lighting for solar system view
        this.setupLighting();
        
        // Create starfield
        this.createStarfield();
        
        // Create game objects
        this.createGameObjects();
        
        // Initialize camera
        this.updateCamera();
    }
    
    setupMiniMap() {
        this.miniMapCanvas = document.getElementById('miniMapCanvas');
        this.miniMapCtx = this.miniMapCanvas.getContext('2d');
        this.miniMapScale = 0.08;
        this.miniMapCenter = { x: 115, y: 95 };
    }
    
    updateMiniMap() {
        const ctx = this.miniMapCtx;
        const canvas = this.miniMapCanvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw Sun at center
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.miniMapCenter.x, this.miniMapCenter.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw orbital paths
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.lineWidth = 1;
        const orbitalRadii = [200, 300, 400, 500, 650, 800, 950, 1100].map(r => r * this.miniMapScale);
        orbitalRadii.forEach(radius => {
            ctx.beginPath();
            ctx.arc(this.miniMapCenter.x, this.miniMapCenter.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
        });
        
        // Draw planets
        this.planets.forEach(planet => {
            const planetPos = planet.mesh.position;
            const planetX = this.miniMapCenter.x + planetPos.x * this.miniMapScale;
            const planetY = this.miniMapCenter.y + planetPos.z * this.miniMapScale;
            
            const colors = {
                'Mercury': '#8C7853',
                'Venus': '#FFC649',
                'Mars': '#cc4433',
                'Jupiter': '#D8CA9D',
                'Saturn': '#FAD5A5',
                'Uranus': '#4FD0E7',
                'Neptune': '#4169E1',
                'Moon': '#aaaaaa'
            };
            
            ctx.fillStyle = colors[planet.name] || '#888888';
            const size = Math.max(2, planet.radius * 0.05);
            ctx.beginPath();
            ctx.arc(planetX, planetY, size, 0, 2 * Math.PI);
            ctx.fill();
            
            // Highlight visited planets
            if (this.visitedPlanets.has(planet.name)) {
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(planetX, planetY, size + 2, 0, 2 * Math.PI);
                ctx.stroke();
            }
            
            // Labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(planet.name, planetX, planetY - size - 2);
        });
        
        // Draw Earth
        const earthPos = this.earth.mesh.position;
        const earthX = this.miniMapCenter.x + earthPos.x * this.miniMapScale;
        const earthY = this.miniMapCenter.y + earthPos.z * this.miniMapScale;
        
        ctx.fillStyle = '#4488ff';
        ctx.beginPath();
        ctx.arc(earthX, earthY, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw rocket
        const rocketPos = this.rocket.mesh.position;
        const rocketX = this.miniMapCenter.x + rocketPos.x * this.miniMapScale;
        const rocketY = this.miniMapCenter.y + rocketPos.z * this.miniMapScale;
        
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(rocketX, rocketY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw velocity vector
        const velocity = this.rocket.velocity;
        if (velocity.length() > 0.1) {
            const velScale = 500;
            const velX = rocketX + velocity.x * velScale;
            const velY = rocketY + velocity.z * velScale;
            
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(rocketX, rocketY);
            ctx.lineTo(velX, velY);
            ctx.stroke();
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Sun light
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(0, 1000, 0);
        this.scene.add(sunLight);
        
        // Point light for general illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(0, 200, 0);
        this.scene.add(pointLight);
    }
    
    createStarfield() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.8,
            transparent: true
        });
        
        const starsVertices = [];
        for (let i = 0; i < 8000; i++) {
            const x = (Math.random() - 0.5) * 8000;
            const y = (Math.random() - 0.5) * 1000;
            const z = (Math.random() - 0.5) * 8000;
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }
    
    createGameObjects() {
        // Create rocket
        this.rocket = new Rocket(this.scene);
        
        // Create Earth at its orbital position
        const earthData = getPlanetByName('Earth');
        const earthAngle = 0; // Starting angle
        const earthDistance = earthData.distanceFromSun;
        this.earth = new Planet(this.scene, {
            ...earthData,
            radius: 100,
            mass: 1000,
            position: new THREE.Vector3(
                Math.cos(earthAngle) * earthDistance,
                0,
                Math.sin(earthAngle) * earthDistance
            )
        });
        
        // Position rocket on Earth initially
        this.positionRocketOnEarth();
        
        // Add Earth to edge indicators
        this.edgeIndicators.addPlanet(this.earth);
        
        // Create all planets
        this.createAllPlanets();
        
        // Create asteroid fields
        this.createAsteroidFields();
    }
    
    positionRocketOnEarth() {
        this.earth.orientRocketOnSurface(this.rocket);
    }
    
    createAllPlanets() {
        // Create planets from solar system data
        SOLAR_SYSTEM.planets.forEach(planetData => {
            if (planetData.name === 'Earth') return;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = planetData.distanceFromSun;
            const position = new THREE.Vector3(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            );
            
            const planet = new Planet(this.scene, {
                ...planetData,
                position: position
            });
            
            this.planets.push(planet);
            this.edgeIndicators.addPlanet(planet);
        });
        
        // Create moons
        SOLAR_SYSTEM.moons.forEach(moonData => {
            const parentPlanet = this.planets.find(p => p.name === moonData.parentPlanet) || 
                                 (moonData.parentPlanet === 'Earth' ? this.earth : null);
            
            if (parentPlanet) {
                const moonAngle = Math.random() * Math.PI * 2;
                const moonDistance = moonData.distanceFromParent;
                const moonPosition = parentPlanet.mesh.position.clone().add(
                    new THREE.Vector3(
                        Math.cos(moonAngle) * moonDistance,
                        0,
                        Math.sin(moonAngle) * moonDistance
                    )
                );
                
                const moon = new Planet(this.scene, {
                    ...moonData,
                    position: moonPosition
                });
                
                this.planets.push(moon);
                this.edgeIndicators.addPlanet(moon);
            }
        });
    }
    
    createAsteroidFields() {
        SOLAR_SYSTEM.asteroidBelts.forEach(beltData => {
            const asteroidField = new AsteroidField(
                this.scene,
                new THREE.Vector3(0, 0, 0),
                beltData.outerRadius - beltData.innerRadius,
                beltData.asteroidCount
            );
            
            asteroidField.asteroids.forEach(asteroid => {
                const angle = Math.random() * Math.PI * 2;
                const distance = beltData.innerRadius + Math.random() * (beltData.outerRadius - beltData.innerRadius);
                asteroid.mesh.position.set(
                    Math.cos(angle) * distance,
                    0,
                    Math.sin(angle) * distance
                );
            });
            
            this.asteroidFields.push(asteroidField);
        });
    }
    
    updateCamera() {
        const rocketPos = this.rocket.mesh.position;
        
        // Simple 2D-style camera positioned above looking down
        const desiredPosition = new THREE.Vector3(
            rocketPos.x,
            rocketPos.y + this.cameraHeight,
            rocketPos.z
        );
        
        const desiredTarget = rocketPos.clone();
        
        // Smooth camera movement
        this.cameraPosition.lerp(desiredPosition, this.cameraLerpSpeed);
        this.cameraTarget.lerp(desiredTarget, this.cameraLerpSpeed);
        
        this.camera.position.copy(this.cameraPosition);
        this.camera.lookAt(this.cameraTarget);
        
        // Ensure camera up vector is consistent
        this.camera.up.set(0, 1, 0);
    }
    
    getApproachingPlanet() {
        // Check if rocket is approaching any planet
        let closestPlanet = null;
        let closestDistance = Infinity;
        
        // Check Earth
        const earthDistance = this.earth.getAltitude(this.rocket.mesh.position);
        if (earthDistance < this.approachThreshold) {
            closestPlanet = this.earth;
            closestDistance = earthDistance;
        }
        
        // Check other planets
        this.planets.forEach(planet => {
            const distance = planet.getAltitude(this.rocket.mesh.position);
            if (distance < this.approachThreshold && distance < closestDistance) {
                closestPlanet = planet;
                closestDistance = distance;
            }
        });
        
        if (closestPlanet) {
            console.log(`Approaching ${closestPlanet.name} at distance ${closestDistance}`);
        }
        
        return closestPlanet;
    }
    
    transferRocketFromPlanet(planetRocket, planet) {
        // Transfer rocket state from planet scene
        this.rocket.fuel = planetRocket.fuel;
        this.rocket.velocity.copy(planetRocket.velocity);
        
        // Position rocket leaving the planet
        const exitDistance = planet.radius + 300;
        const exitAngle = Math.random() * Math.PI * 2;
        
        this.rocket.mesh.position.copy(planet.mesh.position).add(
            new THREE.Vector3(
                Math.cos(exitAngle) * exitDistance,
                50,
                Math.sin(exitAngle) * exitDistance
            )
        );
        
        // Update visited planets
        if (!this.visitedPlanets.has(planet.name)) {
            this.visitedPlanets.add(planet.name);
            this.planetsVisited++;
            this.score += 1000 * planet.difficulty;
        }
    }
    
    updateHUD() {
        // Find closest planet
        let closestPlanet = this.earth;
        let closestDistance = this.earth.getAltitude(this.rocket.mesh.position);
        
        this.planets.forEach(planet => {
            const distance = planet.getAltitude(this.rocket.mesh.position);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPlanet = planet;
            }
        });
        
        document.getElementById('altitude').textContent = Math.floor(Math.max(0, closestDistance));
        
        const targetInfo = document.getElementById('targetInfo');
        if (targetInfo) {
            const approachText = closestDistance < 150 ? '<br><strong>PRESS SPACE TO APPROACH</strong>' : '';
            targetInfo.innerHTML = `
                <strong>Nearest: ${closestPlanet.name}</strong><br>
                ${closestPlanet.description}<br>
                Distance: ${Math.floor(closestDistance)}km${approachText}<br>
                <strong>Navigation Mode</strong>
            `;
        }
    }
    
    update(deltaTime) {
        // Handle input - instant directional movement
        const movement = this.inputHandler.getMovementInput();
        
        const moveSpeed = 80; // Movement speed
        const moveDirection = new THREE.Vector3();
        let isMoving = false;
        
        // Instant rotation and movement based on input
        if (movement.forward) {
            // W: Face up and move up (ship nose points up on screen)
            this.rocket.mesh.rotation.y = -Math.PI / 2;
            moveDirection.z = -1;
            isMoving = true;
        }
        if (movement.backward) {
            // S: Face down and move down (ship nose points down on screen)
            this.rocket.mesh.rotation.y = Math.PI / 2;
            moveDirection.z = 1;
            isMoving = true;
        }
        if (movement.left) {
            // A: Face left and move left (ship nose points left on screen)
            this.rocket.mesh.rotation.y = Math.PI;
            moveDirection.x = -1;
            isMoving = true;
        }
        if (movement.right) {
            // D: Face right and move right (ship nose points right on screen)
            this.rocket.mesh.rotation.y = 0;
            moveDirection.x = 1;
            isMoving = true;
        }
        
        if (movement.boost && isMoving) {
            // Boost gives extra speed
            moveDirection.multiplyScalar(1.5);
        }
        
        // Apply movement directly
        if (isMoving) {
            moveDirection.normalize();
            this.rocket.mesh.position.add(moveDirection.multiplyScalar(moveSpeed * deltaTime));
            
            // Reset velocity to prevent momentum
            this.rocket.velocity.set(0, 0, 0);
            
            // Show exhaust when moving
            this.rocket.isThrusting = true;
            this.rocket.exhaustFlames.forEach(({ flame, glow }) => {
                flame.visible = true;
                glow.visible = true;
            });
        } else {
            // Hide exhaust when not moving
            this.rocket.isThrusting = false;
            this.rocket.exhaustFlames.forEach(({ flame, glow }) => {
                flame.visible = false;
                glow.visible = false;
            });
        }
        
        // No gravity or complex physics in solar system view
        // Just keep rocket at Y=0 for 2D navigation
        this.rocket.mesh.position.y = 0;
        
        // Update celestial bodies
        this.earth.update(deltaTime);
        this.planets.forEach(planet => planet.update(deltaTime));
        
        // Update asteroid fields
        this.asteroidFields.forEach(asteroidField => {
            asteroidField.update(deltaTime);
            const collision = asteroidField.checkCollisions(this.rocket, 5);
            if (collision) {
                this.onGameOver('Collision with asteroid!');
            }
        });
        
        // Update camera
        this.updateCamera();
        
        // Update mini-map
        this.updateMiniMap();
        
        // Update edge indicators
        const allPlanets = [this.earth, ...this.planets];
        this.edgeIndicators.update(this.camera, allPlanets);
        
        // Check for fuel depletion
        if (this.rocket.fuel <= 0 && this.rocket.getSpeed() < 0.1) {
            this.onGameOver('Out of fuel!');
        }
    }
    
    onGameOver(message) {
        console.log('Game Over:', message);
        document.getElementById('gameOverText').textContent = message;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    reinitializeEdgeIndicators() {
        // Re-add all planets to edge indicators after clearing
        this.edgeIndicators.addPlanet(this.earth);
        this.planets.forEach(planet => {
            this.edgeIndicators.addPlanet(planet);
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    
    // Get rocket for external access
    getRocket() {
        return this.rocket;
    }
}