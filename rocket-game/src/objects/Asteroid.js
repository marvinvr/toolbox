import * as THREE from 'three';

export class Asteroid {
    constructor(scene, position, size = 1) {
        this.scene = scene;
        this.size = size;
        this.radius = size * (Math.random() * 2 + 1);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        this.rotationSpeed = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        );
        
        this.createMesh(position);
    }

    createMesh(position) {
        const detail = Math.floor(Math.random() * 2) + 1;
        const geometry = new THREE.IcosahedronGeometry(this.radius, detail);
        
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
            vertex.normalize();
            vertex.multiplyScalar(this.radius * (0.8 + Math.random() * 0.4));
            positions[i] = vertex.x;
            positions[i + 1] = vertex.y;
            positions[i + 2] = vertex.z;
        }
        
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.5 + Math.random() * 0.2, 0.5 + Math.random() * 0.2, 0.5 + Math.random() * 0.2),
            metalness: 0.3,
            roughness: 0.8
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        this.mesh.rotation.x += this.rotationSpeed.x * deltaTime;
        this.mesh.rotation.y += this.rotationSpeed.y * deltaTime;
        this.mesh.rotation.z += this.rotationSpeed.z * deltaTime;
    }

    checkCollision(object, objectRadius) {
        const distance = this.mesh.position.distanceTo(object.position);
        return distance < (this.radius + objectRadius);
    }

    destroy() {
        this.scene.remove(this.mesh);
    }

    get position() {
        return this.mesh.position;
    }
}

export class AsteroidField {
    constructor(scene, center, radius, count) {
        this.scene = scene;
        this.center = center;
        this.radius = radius;
        this.asteroids = [];
        
        this.generate(count);
    }

    generate(count) {
        for (let i = 0; i < count; i++) {
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = (Math.random() - 0.5) * Math.PI * 0.3;
            const distance = this.radius * (0.8 + Math.random() * 0.4);
            
            const position = new THREE.Vector3(
                this.center.x + distance * Math.cos(angle1) * Math.cos(angle2),
                this.center.y + distance * Math.sin(angle2),
                this.center.z + distance * Math.sin(angle1) * Math.cos(angle2)
            );
            
            const size = Math.random() * 0.5 + 0.5;
            const asteroid = new Asteroid(this.scene, position, size);
            this.asteroids.push(asteroid);
        }
    }

    update(deltaTime) {
        this.asteroids.forEach(asteroid => {
            asteroid.update(deltaTime);
            
            const distance = asteroid.position.distanceTo(this.center);
            if (distance > this.radius * 2) {
                const direction = asteroid.position.clone().sub(this.center).normalize();
                asteroid.velocity.sub(direction.multiplyScalar(0.5));
            }
        });
    }

    checkCollisions(object, objectRadius) {
        for (let asteroid of this.asteroids) {
            if (asteroid.checkCollision(object, objectRadius)) {
                return asteroid;
            }
        }
        return null;
    }

    removeAsteroid(asteroid) {
        const index = this.asteroids.indexOf(asteroid);
        if (index > -1) {
            asteroid.destroy();
            this.asteroids.splice(index, 1);
        }
    }
}