const particleRestitution = 0.8;
const particleCount = 50;
const particleSize = 0.003;

const wallThickness = 300;
const wallLength = 10000;

const particleForceRange = 0.06;
const particleInitialForce = 0.000005;
const particleConsistentForce = 0.002;

class Cloud {
    constructor(matterInstance) {
        this.engine = matterInstance.engine;
        this.container = matterInstance.container;
        this.diagonal = Math.sqrt(this.container.clientWidth * this.container.clientWidth + 
                                this.container.clientHeight * this.container.clientHeight);

        this.particles = [];
        this.walls = [];

        this.isForcing = false;
        this.alteringForce = false;

        //Assign this
        this.repulsionRange = particleForceRange * this.diagonal;
        this.repulsionSqrRange = this.repulsionRange * this.repulsionRange;
        this.repulsionForce = particleInitialForce * this.diagonal;

        this.netForce = Vector.create(0, 0);
    }

    spawnParticles() {
        var options = {
            collisionFilter: {
                category: particleCategory,
            },
            render: {
                visible: true,
                lineWidth: 1,
            },
            restitution: particleRestitution,
        };

        for (let i = 0; i < particleCount; i++) {
            this.pickedColor = randomElement(particleColors);
            options.render.fillStyle = this.pickedColor;
            options.render.strokeStyle = this.pickedColor;
            options.label = "Particle" + i;
            switch(Math.floor(Math.random() * 4 + 1)) {
                case 1:
                    this.particles.push(Bodies.circle(0, 0, particleSize * this.diagonal, JSON.parse(JSON.stringify(options))));
                    break;
                case 2:
                    this.particles.push(Bodies.polygon(0, 0, 3, particleSize * this.diagonal * Math.sqrt(3), JSON.parse(JSON.stringify(options))));
                    break;
                case 3:
                    this.particles.push(Bodies.rectangle(0, 0, particleSize * this.diagonal * Math.SQRT2, particleSize * this.diagonal * Math.SQRT2, JSON.parse(JSON.stringify(options))));
                    break;
                case 4, 5:
                    this.particles.push(Bodies.polygon(0, 0, 5, particleSize * this.diagonal * 2 * Math.sin(Math.PI / 5), JSON.parse(JSON.stringify(options))));
                    break;
            }
        }
        Composite.add(this.engine.world, this.particles);
    }

    removeParticlesOutside() {
        this.particles.forEach(particle => {
            if (particle.position.x < 0 || particle.position.x > this.container.clientWidth || 
                particle.position.y < 0 || particle.position.y > this.container.clientHeight) {
                Composite.remove(this.engine.world, particle);
            }
        });
    }

    setPositionOffset(x, y) {
        this.particles.forEach(particle => {
            Body.setPosition(particle, Vector.create(x + randomFloat(-1, 1), y + randomFloat(-1, 1)));
        });
    }

    applyForce(position) {
        this.particles.forEach(p1 => {
            this.particles.forEach(p2 => {
                if (p1 == p2) return;

                this.diff = Vector.sub(p1.position, p2.position);
                this.sqrMag = Vector.magnitudeSquared(this.diff);
                if (this.sqrMag < this.repulsionSqrRange) {
                    this.netForce = Vector.add(this.netForce, Vector.mult(Vector.normalise(this.diff),
                    p1.mass * p2.mass * this.repulsionForce/this.sqrMag));
                }
            });

            if (position) {
                this.diff = Vector.sub(p1.position, position);
                this.sqrMag = Vector.magnitudeSquared(this.diff);
                if (this.sqrMag < this.repulsionSqrRange) {
                    this.netForce = Vector.add(this.netForce, Vector.mult(Vector.normalise(this.diff),
                    p1.mass * this.repulsionForce/this.sqrMag));
                }
            }

            Body.applyForce(p1, p1.position, this.netForce);
            this.netForce = Vector.create(0, 0);
        });
    }

    spawnWalls() {
        var options = {
            isStatic: true,
            render: {
                visible: false,
            },
            collisionFilter: {
                category: particleCategory,
                mask: particleCategory,
            },
        };

        options.label = "topWall";
        this.walls.push(Bodies.rectangle(this.container.clientWidth/2, -wallThickness/2, wallLength, wallThickness, JSON.parse(JSON.stringify(options))));
        
        options.label = "rightWall";
        this.walls.push(Bodies.rectangle(this.container.clientWidth + wallThickness/2, this.container.clientHeight/2, wallThickness, wallLength, JSON.parse(JSON.stringify(options))));

        options.label = "bottomWall";
        this.walls.push(Bodies.rectangle(this.container.clientWidth/2, this.container.clientHeight + wallThickness/2, wallLength, wallThickness, JSON.parse(JSON.stringify(options))));

        options.label = "leftWall";
        this.walls.push(Bodies.rectangle(-wallThickness/2, this.container.clientHeight/2, wallThickness, wallLength, JSON.parse(JSON.stringify(options))));

        Composite.add(this.engine.world, this.walls);
    }

    repositionWalls() {
        Body.setPosition(this.walls[0], {
            x: this.container.clientWidth/2, 
            y: -wallThickness/2,
        });
    
        Body.setPosition(this.walls[1], {
            x: this.container.clientWidth + wallThickness/2,
            y: this.container.clientHeight/2,
        });
    
        Body.setPosition(this.walls[2], {
            x: this.container.clientWidth/2,
            y: this.container.clientHeight + wallThickness/2,
        });
    
        Body.setPosition(this.walls[3], {
            x: -wallThickness/2,
            y: this.container.clientHeight/2,
        })
    }

    adjustForces() {
        this.diagonal = Math.sqrt(this.container.clientWidth * this.container.clientWidth + this.container.clientHeight * this.container.clientHeight);
        if (this.alteringForce) return;
        this.repulsionRange = particleForceRange * this.diagonal;
        this.repulsionSqrRange = this.repulsionRange * this.repulsionRange;
    }
}
const cloud = new Cloud(matterInstance);
cloud.spawnWalls();