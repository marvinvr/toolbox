import * as THREE from 'three';

export class Rocket {
    constructor(scene) {
        this.scene = scene;
        this.maxFuel = 1000;
        this.fuel = this.maxFuel;
        this.mass = 1;
        this.mainThrustPower = 30;
        this.rcsThrustPower = 3;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.isThrusting = false;
        this.angularVelocity = new THREE.Vector3(0, 0, 0);
        this.stabilization = true;
        
        // Initialize rocket at a safe position
        this.mesh = null;
        
        this.createMesh();
        this.createExhaust();
        this.createLandingGear();
    }

    createMesh() {
        const group = new THREE.Group();
        
        // Starship stainless steel material
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xc0c0c0,
            metalness: 0.8,
            roughness: 0.2
        });
        
        // Main cylindrical body (like Starship)
        const bodyGeometry = new THREE.CylinderGeometry(2, 2, 12, 16);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 6;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        // Nose cone (pointed tip)
        const noseGeometry = new THREE.ConeGeometry(2, 4, 16);
        const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
        nose.position.y = 14;
        nose.castShadow = true;
        nose.receiveShadow = true;
        group.add(nose);
        
        // Starship-style fins (triangular, more realistic)
        const finMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xa0a0a0,
            metalness: 0.7,
            roughness: 0.3
        });
        
        // Create triangular fins
        for (let i = 0; i < 3; i++) {
            const finShape = new THREE.Shape();
            finShape.moveTo(0, 0);
            finShape.lineTo(3, 0);
            finShape.lineTo(1.5, 4);
            finShape.lineTo(0, 0);
            
            const finGeometry = new THREE.ExtrudeGeometry(finShape, {
                depth: 0.15,
                bevelEnabled: false
            });
            
            const fin = new THREE.Mesh(finGeometry, finMaterial);
            const angle = (i / 3) * Math.PI * 2;
            fin.position.x = Math.sin(angle) * 2.2;
            fin.position.z = Math.cos(angle) * 2.2;
            fin.position.y = 1;
            fin.rotation.y = angle + Math.PI / 2;
            fin.castShadow = true;
            group.add(fin);
        }
        
        // Engine section (wider at bottom like Starship)
        const engineGeometry = new THREE.CylinderGeometry(2.2, 2.2, 1.5, 16);
        const engineMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x404040,
            metalness: 0.9,
            roughness: 0.1
        });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.y = -0.75;
        engine.castShadow = true;
        group.add(engine);
        
        // Raptor-style engine nozzles
        const nozzleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x202020,
            metalness: 0.8,
            roughness: 0.2
        });
        
        // Center engine
        const centerNozzleGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1, 12);
        const centerNozzle = new THREE.Mesh(centerNozzleGeometry, nozzleMaterial);
        centerNozzle.position.y = -2;
        centerNozzle.castShadow = true;
        group.add(centerNozzle);
        
        // Outer ring of engines
        for (let i = 0; i < 6; i++) {
            const nozzleGeometry = new THREE.CylinderGeometry(0.4, 0.6, 0.8, 12);
            const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
            const angle = (i / 6) * Math.PI * 2;
            nozzle.position.x = Math.sin(angle) * 1.2;
            nozzle.position.z = Math.cos(angle) * 1.2;
            nozzle.position.y = -1.9;
            nozzle.castShadow = true;
            group.add(nozzle);
        }
        
        this.mesh = group;
        // Initialize rocket at a safe position (0, 105, 0) - on Earth's surface
        this.mesh.position.set(0, 105, 0);
        this.scene.add(this.mesh);
    }

    createExhaust() {
        this.exhaustFlames = [];
        
        // Create exhaust flames for each engine
        const exhaustMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.8
        });
        
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.4
        });
        
        // Center engine exhaust
        const centerExhaustGeometry = new THREE.ConeGeometry(0.6, 3, 8);
        const centerExhaust = new THREE.Mesh(centerExhaustGeometry, exhaustMaterial);
        centerExhaust.position.y = -4;
        centerExhaust.visible = false;
        this.mesh.add(centerExhaust);
        
        const centerGlowGeometry = new THREE.ConeGeometry(0.8, 4, 8);
        const centerGlow = new THREE.Mesh(centerGlowGeometry, glowMaterial);
        centerGlow.position.y = -4.5;
        centerGlow.visible = false;
        this.mesh.add(centerGlow);
        
        this.exhaustFlames.push({ flame: centerExhaust, glow: centerGlow });
        
        // Outer ring engine exhausts
        for (let i = 0; i < 6; i++) {
            const exhaustGeometry = new THREE.ConeGeometry(0.4, 2.5, 8);
            const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
            const angle = (i / 6) * Math.PI * 2;
            exhaust.position.x = Math.sin(angle) * 1.2;
            exhaust.position.z = Math.cos(angle) * 1.2;
            exhaust.position.y = -3.8;
            exhaust.visible = false;
            this.mesh.add(exhaust);
            
            const glowGeometry = new THREE.ConeGeometry(0.6, 3.5, 8);
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.x = Math.sin(angle) * 1.2;
            glow.position.z = Math.cos(angle) * 1.2;
            glow.position.y = -4.2;
            glow.visible = false;
            this.mesh.add(glow);
            
            this.exhaustFlames.push({ flame: exhaust, glow: glow });
        }
        
        // Keep backward compatibility
        this.exhaust = this.exhaustFlames[0].flame;
        this.exhaustGlow = this.exhaustFlames[0].glow;
    }

    createLandingGear() {
        this.landingGear = [];
        this.landingGearDeployed = false;
        this.landingGearTransition = 0; // 0 = retracted, 1 = deployed
        
        const legMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x505050,
            metalness: 0.6,
            roughness: 0.4
        });
        
        // Create 3 landing legs (like Starship)
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            
            // Main leg strut
            const legGeometry = new THREE.CylinderGeometry(0.08, 0.12, 4);
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.x = Math.sin(angle) * 2.5;
            leg.position.z = Math.cos(angle) * 2.5;
            leg.position.y = -2;
            leg.rotation.z = Math.sin(angle) * 0.3;
            leg.rotation.x = Math.cos(angle) * 0.3;
            leg.castShadow = true;
            this.mesh.add(leg);
            
            // Foot pad
            const footGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2);
            const foot = new THREE.Mesh(footGeometry, legMaterial);
            foot.position.x = Math.sin(angle) * 3.2;
            foot.position.z = Math.cos(angle) * 3.2;
            foot.position.y = -4.1;
            foot.castShadow = true;
            this.mesh.add(foot);
            
            this.landingGear.push({ leg, foot, angle });
        }
        
        // Start with gear retracted
        this.retractLandingGear();
    }

    deployLandingGear() {
        this.landingGearDeployed = true;
    }

    retractLandingGear() {
        this.landingGearDeployed = false;
    }

    updateLandingGear(deltaTime) {
        const transitionSpeed = 3; // Speed of gear deployment/retraction
        
        if (this.landingGearDeployed && this.landingGearTransition < 1) {
            this.landingGearTransition = Math.min(1, this.landingGearTransition + transitionSpeed * deltaTime);
        } else if (!this.landingGearDeployed && this.landingGearTransition > 0) {
            this.landingGearTransition = Math.max(0, this.landingGearTransition - transitionSpeed * deltaTime);
        }
        
        // Animate landing gear position based on transition
        this.landingGear.forEach(({ leg, foot, angle }) => {
            // Retracted position (legs fold up into body)
            const retractedLegY = 0.5;
            const retractedFootY = -0.3;
            const retractedRadius = 1.8;
            
            // Deployed position (legs extend outward)
            const deployedLegY = -2;
            const deployedFootY = -4.1;
            const deployedRadius = 2.5;
            const deployedFootRadius = 3.2;
            
            // Interpolate positions
            const legY = retractedLegY + (deployedLegY - retractedLegY) * this.landingGearTransition;
            const footY = retractedFootY + (deployedFootY - retractedFootY) * this.landingGearTransition;
            const legRadius = retractedRadius + (deployedRadius - retractedRadius) * this.landingGearTransition;
            const footRadius = retractedRadius + (deployedFootRadius - retractedRadius) * this.landingGearTransition;
            
            // Update leg position
            leg.position.x = Math.sin(angle) * legRadius;
            leg.position.z = Math.cos(angle) * legRadius;
            leg.position.y = legY;
            
            // Update foot position
            foot.position.x = Math.sin(angle) * footRadius;
            foot.position.z = Math.cos(angle) * footRadius;
            foot.position.y = footY;
            
            // Rotate legs for folding effect
            const rotationAmount = (1 - this.landingGearTransition) * 0.8;
            leg.rotation.z = Math.sin(angle) * (0.3 + rotationAmount);
            leg.rotation.x = Math.cos(angle) * (0.3 + rotationAmount);
        });
    }

    applyMainThrust(deltaTime, viewMode = '3d') {
        if (this.fuel <= 0) return;
        
        const fuelConsumption = 20 * deltaTime;
        this.fuel = Math.max(0, this.fuel - fuelConsumption);
        
        const thrustDirection = new THREE.Vector3(0, 1, 0);
        thrustDirection.applyQuaternion(this.mesh.quaternion);
        
        // In 2D mode, lock Y-axis thrust when in space
        if (viewMode === '2d') {
            thrustDirection.y = 0;
            // Only normalize if we have a non-zero vector
            if (thrustDirection.length() > 0) {
                thrustDirection.normalize();
            } else {
                // If thrust direction becomes zero, use forward direction
                thrustDirection.set(0, 0, -1);
            }
        }
        
        const thrust = thrustDirection.multiplyScalar(this.mainThrustPower);
        this.acceleration.add(thrust);
        
        this.isThrusting = true;
        
        // Show exhaust flames for all engines
        this.exhaustFlames.forEach(({ flame, glow }) => {
            flame.visible = true;
            glow.visible = true;
            flame.scale.y = 1 + Math.random() * 0.3;
            glow.scale.y = 1 + Math.random() * 0.3;
        });
        
        // Keep backward compatibility
        this.exhaust.visible = true;
        this.exhaustGlow.visible = true;
        this.exhaust.scale.y = 1 + Math.random() * 0.3;
        this.exhaustGlow.scale.y = 1 + Math.random() * 0.3;
    }

    applyRCSThrust(direction, deltaTime, viewMode = '3d') {
        if (this.fuel <= 0) return;
        
        const fuelConsumption = 1 * deltaTime;
        this.fuel = Math.max(0, this.fuel - fuelConsumption);
        
        const rotationForce = 0.5;
        this.angularVelocity.x += direction.z * rotationForce * deltaTime;
        this.angularVelocity.z += -direction.x * rotationForce * deltaTime;
        
        const worldDirection = direction.clone().applyQuaternion(this.mesh.quaternion);
        
        // In 2D mode, lock Y-axis thrust when in space
        if (viewMode === '2d') {
            worldDirection.y = 0;
        }
        
        const thrust = worldDirection.multiplyScalar(this.rcsThrustPower * 0.3);
        this.acceleration.add(thrust);
    }

    update(deltaTime, gravity, nearPlanet = false, viewMode = '3d') {
        this.acceleration.add(gravity);
        
        this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        // In 2D mode, lock Y position when in space (not near planet)
        if (viewMode === '2d' && !nearPlanet) {
            this.mesh.position.y = 0;
            this.velocity.y = 0;
        }
        
        // Apply atmospheric drag only when near a planet
        if (nearPlanet) {
            // Light atmospheric drag when near planets
            this.velocity.multiplyScalar(0.998);
        }
        
        // Apply manual rotation from RCS
        const rotationDamping = 0.95;
        this.angularVelocity.multiplyScalar(rotationDamping);
        
        this.mesh.rotateX(this.angularVelocity.x * deltaTime);
        this.mesh.rotateZ(this.angularVelocity.z * deltaTime);
        
        this.acceleration.set(0, 0, 0);
        
        if (!this.isThrusting) {
            // Hide all exhaust flames
            this.exhaustFlames.forEach(({ flame, glow }) => {
                flame.visible = false;
                glow.visible = false;
            });
            
            // Keep backward compatibility
            this.exhaust.visible = false;
            this.exhaustGlow.visible = false;
        }
        
        this.isThrusting = false;
        
        // Update landing gear animation
        this.updateLandingGear(deltaTime);
    }

    get position() {
        return this.mesh.position;
    }

    get rotation() {
        return this.mesh.rotation;
    }

    getFuelPercentage() {
        return (this.fuel / this.maxFuel) * 100;
    }

    getSpeed() {
        return this.velocity.length();
    }

    reset() {
        this.fuel = this.maxFuel;
        this.velocity.set(0, 0, 0);
        this.acceleration.set(0, 0, 0);
        this.angularVelocity.set(0, 0, 0);
        
        // Position will be set by Game.positionRocketOnEurope()
        // Don't reset position here to maintain Europe starting location
    }
}