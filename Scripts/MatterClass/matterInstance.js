class MatterInstance {
    constructor(element) {
        this.container = element;
        this.engine = Engine.create({
            gravity: {x : 0, y : 0}
        });

        this.render = Render.create({
            element: this.container,
            engine: this.engine,
            options: {
                width: this.container.clientWidth,
                height: this.container.clientHeight,
                background: "transparent",
                wireframes: false,
                showAngleIndicator: false,
                showDebug: false,
            }
        });

        this.runner = Runner.create();
        this.mouse = Mouse.create(this.render.canvas);
        
        this.mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.1,
                damping: 0.1,
                render: {
                    visible: false
                }
            },
        });
    }

    run() {
        Render.run(this.render);
        Runner.run(this.runner, this.engine);
    }

    resize() {
        this.render.canvas.width = this.container.clientWidth;
        this.render.canvas.height = this.container.clientHeight;
    }
}