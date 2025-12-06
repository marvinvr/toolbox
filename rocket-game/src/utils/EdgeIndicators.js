import * as THREE from 'three';

export class EdgeIndicators {
    constructor() {
        this.indicators = new Map();
        this.container = document.getElementById('edgeIndicators');
        this.edgeMargin = 50; // Distance from screen edge
    }

    addPlanet(planet) {
        const indicator = this.createIndicator(planet);
        this.indicators.set(planet.name, indicator);
        this.container.appendChild(indicator.element);
    }

    createIndicator(planet) {
        const element = document.createElement('div');
        element.className = 'edge-indicator hidden';
        
        const arrow = document.createElement('div');
        arrow.className = 'edge-arrow';
        const color = `#${planet.color.toString(16).padStart(6, '0')}`;
        arrow.style.borderColor = color;
        arrow.style.setProperty('--arrow-color', color);
        
        const label = document.createElement('div');
        label.className = 'edge-label';
        label.textContent = planet.name;
        label.style.color = color;
        
        element.appendChild(arrow);
        element.appendChild(label);
        
        return {
            element,
            arrow,
            label,
            planet
        };
    }

    update(camera, planets) {
        // Get camera's projection matrix and viewport
        const frustum = new THREE.Frustum();
        const matrix = new THREE.Matrix4().multiplyMatrices(
            camera.projectionMatrix, 
            camera.matrixWorldInverse
        );
        frustum.setFromProjectionMatrix(matrix);
        
        planets.forEach(planet => {
            const indicator = this.indicators.get(planet.name);
            if (!indicator) return;
            
            // Check if planet is visible in the camera frustum
            const planetSphere = new THREE.Sphere(planet.mesh.position, planet.radius);
            const isVisible = frustum.intersectsSphere(planetSphere);
            
            if (isVisible) {
                // Planet is visible, hide indicator
                indicator.element.classList.add('hidden');
            } else {
                // Planet is not visible, show edge indicator
                indicator.element.classList.remove('hidden');
                this.updateIndicatorPosition(indicator, camera, planet);
            }
        });
    }

    updateIndicatorPosition(indicator, camera, planet) {
        // Project planet position to screen coordinates
        const planetPosition = planet.mesh.position.clone();
        const screenPosition = this.worldToScreen(planetPosition, camera);
        
        // Calculate direction from center of screen to planet
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const dirX = screenPosition.x - centerX;
        const dirY = screenPosition.y - centerY;
        
        // Normalize direction
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        const normalizedX = dirX / length;
        const normalizedY = dirY / length;
        
        // Calculate edge position
        const edgeX = this.clampToScreenEdge(screenPosition.x, normalizedX, true);
        const edgeY = this.clampToScreenEdge(screenPosition.y, normalizedY, false);
        
        // Position indicator at edge
        indicator.element.style.left = `${edgeX - 20}px`; // 20 = half width
        indicator.element.style.top = `${edgeY - 20}px`;  // 20 = half height
        
        // Rotate arrow to point towards planet
        const angle = Math.atan2(dirY, dirX);
        indicator.arrow.style.transform = `rotate(${angle}rad)`;
        
        // Update arrow color dynamically
        const color = `#${planet.color.toString(16).padStart(6, '0')}`;
        indicator.arrow.style.setProperty('--arrow-color', color);
    }

    worldToScreen(worldPosition, camera) {
        const vector = worldPosition.clone();
        vector.project(camera);
        
        // Convert normalized device coordinates to screen coordinates
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
        
        return { x, y };
    }

    clampToScreenEdge(coordinate, direction, isX) {
        const screenSize = isX ? window.innerWidth : window.innerHeight;
        const margin = this.edgeMargin;
        
        // If direction is towards edge, clamp to edge
        if (direction > 0) {
            return Math.min(coordinate, screenSize - margin);
        } else {
            return Math.max(coordinate, margin);
        }
    }

    removePlanet(planetName) {
        const indicator = this.indicators.get(planetName);
        if (indicator) {
            this.container.removeChild(indicator.element);
            this.indicators.delete(planetName);
        }
    }

    clear() {
        this.indicators.forEach(indicator => {
            this.container.removeChild(indicator.element);
        });
        this.indicators.clear();
    }
}