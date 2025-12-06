export class InputHandler {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }

    getMovementInput() {
        return {
            forward: this.isKeyPressed('KeyW'),
            backward: this.isKeyPressed('KeyS'),
            left: this.isKeyPressed('KeyA'),
            right: this.isKeyPressed('KeyD'),
            boost: this.isKeyPressed('Space'),
            decelerate: this.isKeyPressed('ShiftLeft') || this.isKeyPressed('ShiftRight')
        };
    }
}