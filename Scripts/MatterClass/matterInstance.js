const invisibleCategory = 0x0000;
const defaultCategory = 0x0001;
const particleCategory = 0x0002;
const charCategory = 0x0004;

class MatterInstance {
    constructor(element) {
        this.container = element;
        this.engine = Engine.create({
            gravity: { x: 0, y: 0 }
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
            collisionFilter: {
                category: charCategory,
                mask: charCategory,
            },
        });

        this.mouseConstraint.mouse.element.removeEventListener("mousewheel", this.mouseConstraint.mouse.mousewheel);
        this.mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", this.mouseConstraint.mouse.mousewheel);

        Composite.add(this.engine.world, this.mouseConstraint);
    }

    run() {
        Render.run(this.render);
        Runner.run(this.runner, this.engine);
    }

    resize(width, height) {
        this.render.canvas.width = width;
        this.render.canvas.height = height;
    }
}