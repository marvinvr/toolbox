import * as THREE from 'three';
import { InputHandler } from './utils/InputHandler.js';
import { SceneManager } from './utils/SceneManager.js';

export class Game {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('gameCanvas'),
            antialias: true 
        });
        
        this.clock = new THREE.Clock();
        this.inputHandler = new InputHandler();
        this.sceneManager = new SceneManager(this.renderer, this.inputHandler);
        
        this.gameState = 'playing';
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Setup game controls
        this.setupGameControls();
    }
    
    setupGameControls() {
        // Add restart button functionality
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.restart();
            });
        }
        
        // Add any other game-level controls here
    }
    
    restart() {
        // Hide game over screen
        document.getElementById('gameOver').style.display = 'none';
        
        // Reset game state
        this.gameState = 'playing';
        
        // Create new scene manager to reset everything
        this.sceneManager = new SceneManager(this.renderer, this.inputHandler);
        
        console.log('Game restarted');
    }
    
    updateHUD() {
        const currentScene = this.sceneManager.getCurrentScene();
        if (!currentScene) return;
        
        const rocket = this.sceneManager.getRocket();
        if (!rocket) return;
        
        // Update common HUD elements
        document.getElementById('score').textContent = Math.floor(this.sceneManager.getScore());
        document.getElementById('planetsVisited').textContent = this.sceneManager.getPlanetsVisited();
        document.getElementById('fuelText').textContent = Math.floor(rocket.getFuelPercentage()) + '%';
        document.getElementById('fuelBar').style.width = rocket.getFuelPercentage() + '%';
        document.getElementById('velocity').textContent = Math.floor(rocket.getSpeed());
        
        // Let the current scene handle scene-specific HUD updates
        if (currentScene.updateHUD) {
            currentScene.updateHUD();
        }
    }
    
    checkGameOver() {
        const rocket = this.sceneManager.getRocket();
        if (!rocket) return;
        
        const currentScene = this.sceneManager.getCurrentScene();
        if (!currentScene) return;
        
        // Check common game over conditions
        if (rocket.fuel <= 0 && rocket.getSpeed() < 0.1) {
            // Check if rocket is not on a planet surface
            let onSurface = false;
            
            if (this.sceneManager.getCurrentSceneType() === 'planet') {
                const planet = currentScene.getPlanet();
                if (planet) {
                    const altitude = planet.getAltitude(rocket.mesh.position);
                    onSurface = altitude < 10;
                }
            }
            
            if (!onSurface) {
                this.onGameOver('Out of fuel!');
            }
        }
    }
    
    onGameOver(message) {
        this.gameState = 'gameOver';
        document.getElementById('gameOverText').textContent = message;
        document.getElementById('gameOver').style.display = 'block';
        
        console.log('Game Over:', message);
    }

    update() {
        if (this.gameState === 'gameOver') return;
        
        const deltaTime = Math.min(this.clock.getDelta(), 0.016); // Cap at 60fps
        
        // Update scene manager
        this.sceneManager.update(deltaTime);
        
        // Update HUD
        this.updateHUD();
        
        // Check for game over conditions
        this.checkGameOver();
        
        // Render current scene
        this.sceneManager.render();
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.sceneManager.onWindowResize();
    }

    start() {
        this.lastTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.animate();
    }

    animate(currentTime = 0) {
        requestAnimationFrame((time) => this.animate(time));
        
        // Cap to 60 FPS
        if (currentTime - this.lastTime >= this.frameInterval) {
            this.update();
            this.lastTime = currentTime;
        }
    }
}