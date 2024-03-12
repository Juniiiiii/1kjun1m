class Cloud {
    constructor() {
        this.particles = [];
        this.walls = [];

        this.isForcing = false;
        this.alteringForce = false;

        //Assign this
        this.repulsionRange = particleForceRange * containerDiagonal;
        this.repulsionSqrRange = this.repulsionRange * this.repulsionRange;
        this.repulsionForce = particleInitialForce * containerDiagonal;

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

        for (let i = 0; i < particleCount * containerDiagonal; i++) {
            this.pickedColor = randomElement(particleColors);
            options.render.fillStyle = this.pickedColor;
            options.render.strokeStyle = this.pickedColor;
            options.label = "Particle" + i;
            switch(randomInt(1, 4)) {
                case 1:
                    this.particles.push(Bodies.circle(0, 0, particleSize * containerDiagonal, JSON.parse(JSON.stringify(options))));
                    break;
                case 2:
                    this.particles.push(Bodies.polygon(0, 0, 3, particleSize * containerDiagonal * Math.sqrt(3), JSON.parse(JSON.stringify(options))));
                    break;
                case 3:
                    this.particles.push(Bodies.rectangle(0, 0, particleSize * containerDiagonal * Math.SQRT2, particleSize * containerDiagonal * Math.SQRT2, JSON.parse(JSON.stringify(options))));
                    break;
                case 4:
                    this.particles.push(Bodies.polygon(0, 0, 5, particleSize * containerDiagonal * 2 * Math.sin(Math.PI / 5), JSON.parse(JSON.stringify(options))));
                    break;
            }
        }
        Composite.add(engine.world, this.particles);
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

    dance() {
        this.particles.forEach(particle => {
            Body.applyForce(p, p.position, 
                Vector.create(p.mass * getRandom(-danceForce, danceForce), 
                p.mass * getRandom(-danceForce, danceForce)));
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
        this.walls.push(Bodies.rectangle(container.clientWidth/2, -wallThickness/2, wallLength, wallThickness, JSON.parse(JSON.stringify(options))));
        
        options.label = "rightWall";
        this.walls.push(Bodies.rectangle(container.clientWidth + wallThickness/2, container.clientHeight/2, wallThickness, wallLength, JSON.parse(JSON.stringify(options))));

        options.label = "bottomWall";
        this.walls.push(Bodies.rectangle(container.clientWidth/2, container.clientHeight + wallThickness/2, wallLength, wallThickness, JSON.parse(JSON.stringify(options))));

        options.label = "leftWall";
        this.walls.push(Bodies.rectangle(-wallThickness/2, container.clientHeight/2, wallThickness, wallLength, JSON.parse(JSON.stringify(options))));

        Composite.add(engine.world, this.walls);
    }

    repositionWalls() {
        Body.setPosition(this.walls[0], {
            x: container.clientWidth/2, 
            y: -wallThickness/2,
        });
    
        Body.setPosition(this.walls[1], {
            x: container.clientWidth + wallThickness/2,
            y: container.clientHeight/2,
        });
    
        Body.setPosition(this.walls[2], {
            x: container.clientWidth/2,
            y: container.clientHeight + wallThickness/2,
        });
    
        Body.setPosition(this.walls[3], {
            x: -wallThickness/2,
            y: container.clientHeight/2,
        })
    }

    adjustForces() {
        if (this.alteringForce) return;
        this.repulsionRange = particleForceRange * containerDiagonal;
        this.repulsionSqrRange = this.repulsionRange * this.repulsionRange;
    }
}
const cloud = new Cloud();
cloud.spawnWalls();