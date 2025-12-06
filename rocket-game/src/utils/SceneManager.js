import * as THREE from 'three';
import { PlanetScene } from '../scenes/PlanetScene.js';
import { SolarSystemScene } from '../scenes/SolarSystemScene.js';

export class SceneManager {
    constructor(renderer, inputHandler) {
        this.renderer = renderer;
        this.inputHandler = inputHandler;
        
        this.currentScene = null;
        this.currentSceneType = null;
        this.transitioning = false;
        
        // Scene instances
        this.planetScene = null;
        this.solarSystemScene = null;
        
        // Current planet context (for planet scene)
        this.currentPlanet = null;
        
        // Initialize with solar system scene
        this.switchToSolarSystem();
    }
    
    switchToSolarSystem() {
        if (this.currentSceneType === 'solar-system' && !this.transitioning) {
            return;
        }
        
        console.log('Switching to Solar System scene');
        this.transitioning = true;
        
        // Create or reuse solar system scene
        if (!this.solarSystemScene) {
            this.solarSystemScene = new SolarSystemScene(this.inputHandler);
        }
        
        // Transfer rocket state from planet scene if transitioning
        if (this.planetScene && this.currentScene) {
            this.solarSystemScene.transferRocketFromPlanet(
                this.planetScene.rocket,
                this.currentPlanet
            );
        }
        
        this.currentScene = this.solarSystemScene;
        this.currentSceneType = 'solar-system';
        this.currentPlanet = null;
        
        // Clear and recreate edge indicators for solar system scene
        this.clearEdgeIndicators();
        this.showEdgeIndicators();
        
        // Show mini-map for solar system scene
        this.showMiniMap();
        
        // Reinitialize edge indicators for solar system
        if (this.solarSystemScene) {
            this.solarSystemScene.reinitializeEdgeIndicators();
        }
        
        this.transitioning = false;
    }
    
    hideEdgeIndicators() {
        // Hide all edge indicators
        const indicatorsContainer = document.getElementById('edgeIndicators');
        if (indicatorsContainer) {
            indicatorsContainer.style.display = 'none';
        }
    }
    
    showEdgeIndicators() {
        // Show edge indicators
        const indicatorsContainer = document.getElementById('edgeIndicators');
        if (indicatorsContainer) {
            indicatorsContainer.style.display = 'block';
        }
    }
    
    hideMiniMap() {
        // Hide mini-map
        const miniMap = document.getElementById('miniMap');
        if (miniMap) {
            miniMap.style.display = 'none';
        }
    }
    
    showMiniMap() {
        // Show mini-map
        const miniMap = document.getElementById('miniMap');
        if (miniMap) {
            miniMap.style.display = 'block';
        }
    }
    
    clearEdgeIndicators() {
        // Clear all edge indicators from the container
        const indicatorsContainer = document.getElementById('edgeIndicators');
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
        }
    }
    
    switchToPlanet(planet) {
        if (this.currentSceneType === 'planet' && this.currentPlanet === planet && !this.transitioning) {
            return;
        }
        
        console.log(`Switching to Planet scene: ${planet.name}`);
        this.transitioning = true;
        
        // Clear existing edge indicators and keep them visible for planet scene
        this.clearEdgeIndicators();
        this.showEdgeIndicators();
        
        // Hide mini-map for planet scene
        this.hideMiniMap();
        
        // Create new planet scene with planet data
        const planetData = {
            name: planet.name,
            radius: planet.radius,
            mass: planet.mass,
            gravity: planet.gravity,
            difficulty: planet.difficulty,
            description: planet.description,
            color: planet.color
        };
        
        this.planetScene = new PlanetScene(planetData, this.inputHandler);
        
        // Transfer rocket state from solar system scene
        if (this.solarSystemScene && this.currentScene) {
            this.planetScene.transferRocketFromSolarSystem(
                this.solarSystemScene.rocket
            );
        }
        
        this.currentScene = this.planetScene;
        this.currentSceneType = 'planet';
        this.currentPlanet = planet;
        this.transitioning = false;
    }
    
    checkSceneTransition() {
        if (this.transitioning) return;
        
        if (this.currentSceneType === 'solar-system') {
            // Check if rocket is approaching any planet
            const approachingPlanet = this.solarSystemScene.getApproachingPlanet();
            if (approachingPlanet) {
                this.switchToPlanet(approachingPlanet);
            }
        } else if (this.currentSceneType === 'planet') {
            // Check if rocket is leaving planet's influence
            if (this.planetScene.isRocketLeavingPlanet()) {
                this.switchToSolarSystem();
            }
        }
    }
    
    update(deltaTime) {
        if (!this.currentScene || this.transitioning) return;
        
        this.checkSceneTransition();
        this.currentScene.update(deltaTime);
    }
    
    render() {
        if (!this.currentScene || this.transitioning) return;
        
        this.renderer.render(this.currentScene.scene, this.currentScene.camera);
    }
    
    onWindowResize() {
        if (this.currentScene) {
            this.currentScene.onWindowResize();
        }
    }
    
    getCurrentScene() {
        return this.currentScene;
    }
    
    getCurrentSceneType() {
        return this.currentSceneType;
    }
    
    getRocket() {
        return this.currentScene ? this.currentScene.rocket : null;
    }
    
    getScore() {
        return this.solarSystemScene ? this.solarSystemScene.score : 0;
    }
    
    getPlanetsVisited() {
        return this.solarSystemScene ? this.solarSystemScene.planetsVisited : 0;
    }
    
    onGameOver(message) {
        if (this.currentScene) {
            this.currentScene.onGameOver(message);
        }
    }
}