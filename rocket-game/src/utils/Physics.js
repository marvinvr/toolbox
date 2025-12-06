import * as THREE from 'three';

export class Physics {
    constructor() {
        // Scaled gravitational constant for gameplay balance
        // Lower value = weaker gravity, higher value = stronger gravity
        this.G = 0.8;
        
        // Minimum influence distance to prevent extreme forces when very close
        this.minInfluenceDistance = 15;
        
        // Maximum gravity strength to prevent unrealistic acceleration
        this.maxGravityForce = 25;
        
        // Gravity influence range - beyond this, gravity becomes negligible
        this.gravityInfluenceRange = 800;
    }

    calculateGravityForce(mass1, mass2, distance) {
        if (distance === 0) return 0;
        
        // Apply minimum distance to prevent extreme forces when very close
        const effectiveDistance = Math.max(distance, this.minInfluenceDistance);
        
        // Calculate base gravitational force using Newton's law
        const force = (this.G * mass1 * mass2) / (effectiveDistance * effectiveDistance);
        
        // Apply distance-based falloff for gameplay balance
        const falloffFactor = this.calculateFalloffFactor(distance);
        
        // Cap the maximum force to prevent extreme acceleration
        return Math.min(force * falloffFactor, this.maxGravityForce);
    }

    calculateFalloffFactor(distance) {
        // Gravity becomes negligible at long distances
        if (distance > this.gravityInfluenceRange) {
            return 0;
        }
        
        // Start falloff at 40% of max range for stronger close-range gravity
        const falloffStart = this.gravityInfluenceRange * 0.4;
        
        if (distance < falloffStart) {
            return 1.0; // Full strength
        }
        
        // Smooth falloff from falloffStart to gravityInfluenceRange
        const falloffRange = this.gravityInfluenceRange - falloffStart;
        const falloffProgress = (distance - falloffStart) / falloffRange;
        
        // Smoother exponential falloff that feels more natural
        return Math.pow(1 - falloffProgress, 1.5);
    }

    applyGravity(object, planet) {
        const planetPos = planet.mesh ? planet.mesh.position : planet.position;
        const objectPos = object.mesh ? object.mesh.position : object.position;
        
        // Calculate direction from object to planet center
        const direction = new THREE.Vector3()
            .subVectors(planetPos, objectPos)
            .normalize();
        
        const distance = objectPos.distanceTo(planetPos);
        
        // Skip gravity calculation if object is too far away
        if (distance > this.gravityInfluenceRange) {
            return new THREE.Vector3(0, 0, 0);
        }
        
        // Calculate gravitational force
        const force = this.calculateGravityForce(object.mass, planet.mass, distance);
        
        // Convert force to acceleration (F = ma, so a = F/m)
        const acceleration = force / object.mass;
        
        // Apply direction to get acceleration vector
        return direction.multiplyScalar(acceleration);
    }

    checkCollision(object1, object2, radius1, radius2) {
        const distance = object1.position.distanceTo(object2.position);
        return distance < (radius1 + radius2);
    }

    updateVelocity(object, acceleration, deltaTime) {
        object.velocity.x += acceleration.x * deltaTime;
        object.velocity.y += acceleration.y * deltaTime;
        object.velocity.z += acceleration.z * deltaTime;
    }

    updatePosition(object, deltaTime) {
        object.position.x += object.velocity.x * deltaTime;
        object.position.y += object.velocity.y * deltaTime;
        object.position.z += object.velocity.z * deltaTime;
    }

    calculateOrbitalVelocity(centralMass, radius) {
        return Math.sqrt((this.G * centralMass) / radius);
    }

    calculateEscapeVelocity(mass, radius) {
        return Math.sqrt((2 * this.G * mass) / radius);
    }
}