import * as THREE from 'three';

export class Planet {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.name = options.name || 'Planet';
        this.radius = options.radius || 50;
        this.mass = options.mass || 1000;
        this.position = options.position || new THREE.Vector3(0, 0, 0);
        this.rotationSpeed = options.rotationSpeed || 0.001;
        this.textureUrl = options.textureUrl || null;
        this.color = options.color || 0x4444ff;
        this.hasAtmosphere = options.hasAtmosphere || false;
        this.atmosphereColor = options.atmosphereColor || 0x88ccff;
        this.gravity = options.gravity || 1.0;
        this.features = options.features || [];
        this.description = options.description || '';
        this.difficulty = options.difficulty || 1;
        
        this.createMesh();
        if (this.hasAtmosphere) {
            this.createAtmosphere();
        }
        this.createSurface();
        this.createSpecialFeatures();
    }

    createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
        let material;
        
        if (this.textureUrl) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(this.textureUrl);
            material = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            material = new THREE.MeshStandardMaterial({ 
                color: this.color,
                metalness: 0.1,
                roughness: 0.8
            });
        }
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);
    }

    createAtmosphere() {
        const atmosphereGeometry = new THREE.SphereGeometry(this.radius * 1.1, 32, 32);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: this.atmosphereColor,
            transparent: true,
            opacity: this.features.includes('thick_atmosphere') ? 0.4 : 0.2,
            side: THREE.BackSide
        });
        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.atmosphere.position.copy(this.position);
        this.scene.add(this.atmosphere);
    }

    createSurface() {
        if (this.name === 'Earth') {
            this.addEarthFeatures();
        } else if (this.name === 'Moon') {
            this.addMoonFeatures();
        } else if (this.name === 'Mars') {
            this.addMarsFeatures();
        }
    }

    createSpecialFeatures() {
        if (this.features.includes('rings')) {
            this.addRings();
        }
        if (this.features.includes('great_red_spot')) {
            this.addGreatRedSpot();
        }
        if (this.features.includes('craters')) {
            this.addCraters();
        }
        if (this.features.includes('ice_surface')) {
            this.addIceSurface();
        }
        if (this.features.includes('active_volcanoes')) {
            this.addVolcanoes();
        }
    }

    addEarthFeatures() {
        this.addContinents();
        this.addClouds();
    }

    addContinents() {
        const continentConfigs = [
            // North America
            { lat: 45, lon: -100, size: 0.3, shape: 'irregular' },
            // South America
            { lat: -15, lon: -60, size: 0.25, shape: 'elongated' },
            // Africa
            { lat: 0, lon: 20, size: 0.28, shape: 'elongated' },
            // Europe
            { lat: 55, lon: 10, size: 0.15, shape: 'compact' },
            // Asia
            { lat: 35, lon: 100, size: 0.35, shape: 'massive' },
            // Australia
            { lat: -25, lon: 135, size: 0.12, shape: 'compact' },
            // Antarctica
            { lat: -80, lon: 0, size: 0.2, shape: 'circular' }
        ];

        continentConfigs.forEach(config => {
            this.createContinent(config);
        });
    }

    createContinent(config) {
        const { lat, lon, size, shape } = config;
        
        // Convert lat/lon to 3D position on sphere
        const phi = (90 - lat) * Math.PI / 180;
        const theta = lon * Math.PI / 180;
        
        const x = this.radius * Math.sin(phi) * Math.cos(theta);
        const y = this.radius * Math.cos(phi);
        const z = this.radius * Math.sin(phi) * Math.sin(theta);
        
        // Create continent shape based on type
        let geometry;
        const baseSize = this.radius * size;
        
        switch (shape) {
            case 'irregular':
                geometry = this.createIrregularShape(baseSize);
                break;
            case 'elongated':
                geometry = this.createElongatedShape(baseSize);
                break;
            case 'massive':
                geometry = this.createMassiveShape(baseSize);
                break;
            case 'circular':
                geometry = new THREE.CircleGeometry(baseSize, 16);
                break;
            default:
                geometry = new THREE.CircleGeometry(baseSize * 0.8, 12);
        }
        
        const continentMaterial = new THREE.MeshBasicMaterial({
            color: 0x228B22,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const continent = new THREE.Mesh(geometry, continentMaterial);
        
        // Position slightly above the planet surface to avoid z-fighting
        const surfaceNormal = new THREE.Vector3(x, y, z).normalize();
        const continentPos = surfaceNormal.multiplyScalar(this.radius + 0.5);
        continent.position.copy(continentPos);
        
        // Orient the continent to face outward from the sphere
        continent.lookAt(new THREE.Vector3(0, 0, 0));
        continent.rotateY(Math.PI);
        
        this.mesh.add(continent);
        
        // Add some smaller islands around major continents
        if (size > 0.2) {
            this.addIslands(x, y, z, baseSize * 0.3);
        }
    }

    createIrregularShape(size) {
        const shape = new THREE.Shape();
        const points = 8;
        const angleStep = (Math.PI * 2) / points;
        
        for (let i = 0; i <= points; i++) {
            const angle = i * angleStep;
            const radius = size * (0.6 + Math.random() * 0.4);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }
        
        return new THREE.ShapeGeometry(shape);
    }

    createElongatedShape(size) {
        const shape = new THREE.Shape();
        const width = size * 0.6;
        const height = size * 1.4;
        
        // Create an elongated oval-like shape
        shape.moveTo(0, height);
        shape.quadraticCurveTo(width, height * 0.7, width * 0.8, height * 0.2);
        shape.quadraticCurveTo(width * 0.6, -height * 0.3, width * 0.3, -height * 0.8);
        shape.quadraticCurveTo(0, -height, -width * 0.3, -height * 0.8);
        shape.quadraticCurveTo(-width * 0.6, -height * 0.3, -width * 0.8, height * 0.2);
        shape.quadraticCurveTo(-width, height * 0.7, 0, height);
        
        return new THREE.ShapeGeometry(shape);
    }

    createMassiveShape(size) {
        const shape = new THREE.Shape();
        const points = 12;
        const angleStep = (Math.PI * 2) / points;
        
        for (let i = 0; i <= points; i++) {
            const angle = i * angleStep;
            const radius = size * (0.7 + Math.random() * 0.3);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }
        
        return new THREE.ShapeGeometry(shape);
    }

    addIslands(centerX, centerY, centerZ, maxDistance) {
        const islandCount = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < islandCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = maxDistance * (0.5 + Math.random() * 0.5);
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + (Math.random() - 0.5) * distance * 0.5;
            const z = centerZ + Math.sin(angle) * distance;
            
            // Normalize to sphere surface
            const length = Math.sqrt(x * x + y * y + z * z);
            const normalizedX = (x / length) * this.radius;
            const normalizedY = (y / length) * this.radius;
            const normalizedZ = (z / length) * this.radius;
            
            const islandSize = maxDistance * 0.3 * (0.3 + Math.random() * 0.4);
            const islandGeometry = new THREE.CircleGeometry(islandSize, 8);
            const islandMaterial = new THREE.MeshBasicMaterial({
                color: 0x32CD32,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const island = new THREE.Mesh(islandGeometry, islandMaterial);
            island.position.set(normalizedX, normalizedY, normalizedZ);
            island.lookAt(new THREE.Vector3(0, 0, 0));
            island.rotateY(Math.PI);
            
            this.mesh.add(island);
        }
    }

    addClouds() {
        const cloudGeometry = new THREE.SphereGeometry(this.radius * 1.02, 32, 32);
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.clouds.position.copy(this.position);
        this.scene.add(this.clouds);
    }

    addMoonFeatures() {
        const craterCount = 20;
        for (let i = 0; i < craterCount; i++) {
            const craterRadius = Math.random() * 2 + 0.5;
            const craterGeometry = new THREE.RingGeometry(craterRadius * 0.7, craterRadius, 16);
            const craterMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x666666,
                side: THREE.DoubleSide
            });
            const crater = new THREE.Mesh(craterGeometry, craterMaterial);
            
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            crater.position.x = this.radius * Math.sin(theta) * Math.cos(phi);
            crater.position.y = this.radius * Math.sin(theta) * Math.sin(phi);
            crater.position.z = this.radius * Math.cos(theta);
            
            crater.lookAt(new THREE.Vector3(0, 0, 0));
            this.mesh.add(crater);
        }
    }

    addMarsFeatures() {
        const dustGeometry = new THREE.SphereGeometry(this.radius * 1.01, 32, 32);
        const dustMaterial = new THREE.MeshBasicMaterial({
            color: 0xcc6633,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        this.dust = new THREE.Mesh(dustGeometry, dustMaterial);
        this.dust.position.copy(this.position);
        this.scene.add(this.dust);
    }

    addRings() {
        const ringGeometry = new THREE.RingGeometry(this.radius * 1.5, this.radius * 2.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        this.rings = new THREE.Mesh(ringGeometry, ringMaterial);
        this.rings.position.copy(this.position);
        this.rings.rotation.x = Math.PI / 2;
        this.scene.add(this.rings);
    }

    addGreatRedSpot() {
        const spotGeometry = new THREE.SphereGeometry(this.radius * 0.2, 16, 16);
        const spotMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            transparent: true,
            opacity: 0.8
        });
        this.greatRedSpot = new THREE.Mesh(spotGeometry, spotMaterial);
        this.greatRedSpot.position.copy(this.position);
        this.greatRedSpot.position.x += this.radius * 0.8;
        this.scene.add(this.greatRedSpot);
    }

    addCraters() {
        const craterCount = this.radius < 30 ? 10 : 20;
        for (let i = 0; i < craterCount; i++) {
            const craterRadius = Math.random() * (this.radius * 0.1) + this.radius * 0.02;
            const craterGeometry = new THREE.RingGeometry(craterRadius * 0.7, craterRadius, 16);
            const craterMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x333333,
                side: THREE.DoubleSide
            });
            const crater = new THREE.Mesh(craterGeometry, craterMaterial);
            
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            crater.position.x = this.radius * Math.sin(theta) * Math.cos(phi);
            crater.position.y = this.radius * Math.sin(theta) * Math.sin(phi);
            crater.position.z = this.radius * Math.cos(theta);
            
            crater.lookAt(new THREE.Vector3(0, 0, 0));
            this.mesh.add(crater);
        }
    }

    addIceSurface() {
        const iceGeometry = new THREE.SphereGeometry(this.radius * 1.001, 32, 32);
        const iceMaterial = new THREE.MeshPhongMaterial({
            color: 0xE6F3FF,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        this.iceSurface = new THREE.Mesh(iceGeometry, iceMaterial);
        this.iceSurface.position.copy(this.position);
        this.scene.add(this.iceSurface);
    }

    addVolcanoes() {
        const volcanoCount = 5;
        for (let i = 0; i < volcanoCount; i++) {
            const volcanoGeometry = new THREE.ConeGeometry(this.radius * 0.05, this.radius * 0.1, 8);
            const volcanoMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
            const volcano = new THREE.Mesh(volcanoGeometry, volcanoMaterial);
            
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            
            volcano.position.x = this.radius * Math.sin(theta) * Math.cos(phi);
            volcano.position.y = this.radius * Math.sin(theta) * Math.sin(phi);
            volcano.position.z = this.radius * Math.cos(theta);
            
            volcano.lookAt(new THREE.Vector3(0, 0, 0));
            this.mesh.add(volcano);
        }
    }

    update(deltaTime) {
        this.mesh.rotation.y += this.rotationSpeed * deltaTime;
        
        if (this.atmosphere) {
            this.atmosphere.rotation.y += this.rotationSpeed * 0.5 * deltaTime;
        }
        
        if (this.clouds) {
            this.clouds.rotation.y += this.rotationSpeed * 1.5 * deltaTime;
        }
        
        if (this.dust) {
            this.dust.rotation.y += this.rotationSpeed * 0.8 * deltaTime;
        }
        
        if (this.rings) {
            this.rings.rotation.z += this.rotationSpeed * 0.3 * deltaTime;
        }
        
        if (this.greatRedSpot) {
            this.greatRedSpot.rotation.y += this.rotationSpeed * 2 * deltaTime;
        }
        
        if (this.iceSurface) {
            this.iceSurface.rotation.y += this.rotationSpeed * 0.9 * deltaTime;
        }
    }

    getAltitude(objectPosition) {
        const distance = objectPosition.distanceTo(this.mesh.position);
        return distance - this.radius;
    }

    checkLanding(rocket, threshold = 5) {
        const altitude = this.getAltitude(rocket.position);
        const speed = rocket.getSpeed();
        
        if (altitude <= 0) {
            // Check if rocket is moving towards or away from the planet
            const planetCenter = this.mesh.position;
            const rocketPosition = rocket.position;
            const rocketVelocity = rocket.velocity;
            
            // Calculate direction from planet center to rocket position
            const planetToRocket = rocketPosition.clone().sub(planetCenter).normalize();
            
            // Calculate the radial velocity (positive = moving away, negative = moving towards)
            const radialVelocity = rocketVelocity.dot(planetToRocket);
            
            // Only check for landing/crash if rocket is moving towards the planet or moving very slowly
            if (radialVelocity <= 1) { // 1 m/s threshold for "moving away"
                if (speed < threshold) {
                    this.orientRocketOnSurface(rocket);
                    return 'success';
                } else {
                    return 'crash';
                }
            }
        }
        
        return null;
    }

    orientRocketOnSurface(rocket) {
        const planetCenter = this.mesh.position;
        const rocketPosition = rocket.position;
        
        // Calculate the up direction from planet center to rocket position
        let upDirection = rocketPosition.clone().sub(planetCenter);
        
        // If rocket is at the same position as planet center, use a default up direction
        if (upDirection.length() === 0) {
            upDirection = new THREE.Vector3(0, 1, 0);
        } else {
            upDirection.normalize();
        }
        
        // Position rocket exactly on the surface
        const surfacePosition = planetCenter.clone().add(upDirection.multiplyScalar(this.radius + 5));
        rocket.mesh.position.copy(surfacePosition);
        
        // Orient rocket to point away from planet center (standing upright)
        const targetPosition = surfacePosition.clone().add(upDirection.multiplyScalar(10));
        rocket.mesh.lookAt(targetPosition);
        
        // Reset rocket velocity when landing
        rocket.velocity.set(0, 0, 0);
        rocket.angularVelocity.set(0, 0, 0);
    }

    generateLandingZone() {
        const zoneGeometry = new THREE.RingGeometry(5, 10, 32);
        const zoneMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const zone = new THREE.Mesh(zoneGeometry, zoneMaterial);
        
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.PI * 0.4 + Math.random() * Math.PI * 0.2;
        
        zone.position.x = this.radius * Math.sin(theta) * Math.cos(phi);
        zone.position.y = this.radius * Math.sin(theta) * Math.sin(phi);
        zone.position.z = this.radius * Math.cos(theta);
        
        zone.lookAt(new THREE.Vector3(0, 0, 0));
        this.mesh.add(zone);
        
        return zone.position.clone().add(this.mesh.position);
    }
}