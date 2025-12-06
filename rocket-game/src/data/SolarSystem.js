export const SOLAR_SYSTEM = {
    planets: [
        {
            name: 'Mercury',
            radius: 20,
            mass: 50,
            distanceFromSun: 200,
            color: 0x8C7853,
            hasAtmosphere: false,
            rotationSpeed: 0.01,
            orbitalSpeed: 0.004,
            gravity: 0.38,
            description: 'The smallest and closest planet to the Sun',
            difficulty: 3,
            features: ['extreme_temperatures', 'no_atmosphere', 'cratered_surface']
        },
        {
            name: 'Venus',
            radius: 45,
            mass: 800,
            distanceFromSun: 300,
            color: 0xFFC649,
            hasAtmosphere: true,
            atmosphereColor: 0xFFB347,
            rotationSpeed: -0.002,
            orbitalSpeed: 0.003,
            gravity: 0.91,
            description: 'The hottest planet with a thick toxic atmosphere',
            difficulty: 4,
            features: ['thick_atmosphere', 'volcanic_activity', 'retrograde_rotation']
        },
        {
            name: 'Earth',
            radius: 50,
            mass: 1000,
            distanceFromSun: 400,
            color: 0x2233ff,
            hasAtmosphere: true,
            atmosphereColor: 0x88ccff,
            rotationSpeed: 0.001,
            orbitalSpeed: 0.002,
            gravity: 1.0,
            description: 'Our home planet with water and life',
            difficulty: 1,
            features: ['water', 'clouds', 'life', 'magnetic_field']
        },
        {
            name: 'Mars',
            radius: 35,
            mass: 200,
            distanceFromSun: 500,
            color: 0xcc4433,
            hasAtmosphere: true,
            atmosphereColor: 0xcc6633,
            rotationSpeed: 0.0008,
            orbitalSpeed: 0.0015,
            gravity: 0.38,
            description: 'The red planet with polar ice caps',
            difficulty: 2,
            features: ['dust_storms', 'polar_ice_caps', 'canyons', 'volcanoes']
        },
        {
            name: 'Jupiter',
            radius: 120,
            mass: 5000,
            distanceFromSun: 650,
            color: 0xD8CA9D,
            hasAtmosphere: true,
            atmosphereColor: 0xE6D7B0,
            rotationSpeed: 0.002,
            orbitalSpeed: 0.001,
            gravity: 2.36,
            description: 'The largest planet with a Great Red Spot',
            difficulty: 6,
            features: ['great_red_spot', 'gas_giant', 'strong_radiation', 'many_moons']
        },
        {
            name: 'Saturn',
            radius: 100,
            mass: 4000,
            distanceFromSun: 800,
            color: 0xFAD5A5,
            hasAtmosphere: true,
            atmosphereColor: 0xFFE4B5,
            rotationSpeed: 0.0018,
            orbitalSpeed: 0.0008,
            gravity: 0.92,
            description: 'The ringed planet with spectacular rings',
            difficulty: 5,
            features: ['rings', 'gas_giant', 'low_density', 'hexagonal_storm']
        },
        {
            name: 'Uranus',
            radius: 70,
            mass: 1500,
            distanceFromSun: 950,
            color: 0x4FD0E7,
            hasAtmosphere: true,
            atmosphereColor: 0x87CEEB,
            rotationSpeed: -0.0012,
            orbitalSpeed: 0.0005,
            gravity: 0.89,
            description: 'The tilted ice giant with methane clouds',
            difficulty: 7,
            features: ['tilted_axis', 'ice_giant', 'methane_atmosphere', 'faint_rings']
        },
        {
            name: 'Neptune',
            radius: 65,
            mass: 1400,
            distanceFromSun: 1100,
            color: 0x4169E1,
            hasAtmosphere: true,
            atmosphereColor: 0x6495ED,
            rotationSpeed: 0.0015,
            orbitalSpeed: 0.0003,
            gravity: 1.13,
            description: 'The windiest planet with supersonic storms',
            difficulty: 8,
            features: ['supersonic_winds', 'ice_giant', 'great_dark_spot', 'extreme_cold']
        }
    ],
    
    moons: [
        {
            name: 'Moon',
            parentPlanet: 'Earth',
            radius: 25,
            mass: 100,
            distanceFromParent: 200,
            color: 0xaaaaaa,
            hasAtmosphere: false,
            rotationSpeed: 0.0005,
            orbitalSpeed: 0.01,
            gravity: 0.166,
            description: 'Earth\'s only natural satellite',
            difficulty: 1,
            features: ['craters', 'maria', 'no_atmosphere', 'tidal_locked']
        },
        {
            name: 'Phobos',
            parentPlanet: 'Mars',
            radius: 8,
            mass: 10,
            distanceFromParent: 80,
            color: 0x8B4513,
            hasAtmosphere: false,
            rotationSpeed: 0.02,
            orbitalSpeed: 0.05,
            gravity: 0.0057,
            description: 'Mars\' largest moon, irregular shaped',
            difficulty: 9,
            features: ['irregular_shape', 'very_low_gravity', 'fast_orbit']
        },
        {
            name: 'Deimos',
            parentPlanet: 'Mars',
            radius: 5,
            mass: 5,
            distanceFromParent: 150,
            color: 0x696969,
            hasAtmosphere: false,
            rotationSpeed: 0.01,
            orbitalSpeed: 0.02,
            gravity: 0.003,
            description: 'Mars\' smaller, outer moon',
            difficulty: 10,
            features: ['very_small', 'extremely_low_gravity', 'distant_orbit']
        },
        {
            name: 'Europa',
            parentPlanet: 'Jupiter',
            radius: 22,
            mass: 80,
            distanceFromParent: 300,
            color: 0xE6F3FF,
            hasAtmosphere: false,
            rotationSpeed: 0.003,
            orbitalSpeed: 0.008,
            gravity: 0.134,
            description: 'Jupiter\'s ice-covered moon with subsurface ocean',
            difficulty: 7,
            features: ['ice_surface', 'subsurface_ocean', 'smooth_terrain']
        },
        {
            name: 'Io',
            parentPlanet: 'Jupiter',
            radius: 26,
            mass: 120,
            distanceFromParent: 250,
            color: 0xFFFF80,
            hasAtmosphere: false,
            rotationSpeed: 0.004,
            orbitalSpeed: 0.012,
            gravity: 0.183,
            description: 'Jupiter\'s volcanic moon with sulfur geysers',
            difficulty: 8,
            features: ['active_volcanoes', 'sulfur_surface', 'radiation']
        },
        {
            name: 'Titan',
            parentPlanet: 'Saturn',
            radius: 35,
            mass: 200,
            distanceFromParent: 400,
            color: 0xFFA500,
            hasAtmosphere: true,
            atmosphereColor: 0xFFB347,
            rotationSpeed: 0.0008,
            orbitalSpeed: 0.005,
            gravity: 0.14,
            description: 'Saturn\'s largest moon with thick atmosphere',
            difficulty: 6,
            features: ['thick_atmosphere', 'methane_lakes', 'organic_compounds']
        }
    ],
    
    asteroidBelts: [
        {
            name: 'Main Asteroid Belt',
            innerRadius: 2500,
            outerRadius: 3000,
            asteroidCount: 50,
            description: 'The main asteroid belt between Mars and Jupiter'
        },
        {
            name: 'Kuiper Belt',
            innerRadius: 8000,
            outerRadius: 10000,
            asteroidCount: 30,
            description: 'Icy bodies beyond Neptune'
        }
    ]
};

export function getPlanetByName(name) {
    return SOLAR_SYSTEM.planets.find(planet => planet.name === name);
}

export function getMoonByName(name) {
    return SOLAR_SYSTEM.moons.find(moon => moon.name === name);
}

export function getPlanetsByDifficulty(difficulty) {
    return SOLAR_SYSTEM.planets.filter(planet => planet.difficulty === difficulty);
}

export function getAllCelestialBodies() {
    return [...SOLAR_SYSTEM.planets, ...SOLAR_SYSTEM.moons];
}

