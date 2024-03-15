class Printer {
    constructor(matterInstance) {
        this.engine = matterInstance.engine;
        this.container = matterInstance.container;

        this.parser = new window.DOMParser();
        this.wrappingBodies = [];
    }
    
    emptyOption() {
        return {
            text: "", //The string to be spawned
            size: 0, //Size of each character
            x: 0, //Position of the word spawning (beginning of the word)
            y: 0, //Position of the word spawning (center of the word)
            relPosition: false, //If the x, y should be multiplied by container's dimensions
            relSize: false, //If the size should be multiplied by container's dimensions
            wrap: true, //If the bodies spawned should wrap around the container
            color: ["#000000"], //An array of colors, will be picked at random for each character
            category: 0, //The category of the bodies spawned
            mask: 0, //The mask of the bodies spawned
            restitution: 0.8, //The restitution of the bodies spawned
        }
    }

    parseOption(option) {
        option = { ...this.emptyOption(), ...option };

        if (option.relPosition) {
            option.x *= this.container.clientWidth;
            option.y *= this.container.clientHeight;
        }

        return option;
    }

    print(option) {
        option = this.parseOption(option);

        var width = option.size;
        if (option.relSize) width *= this.container.clientWidth;
        var height = width * Foundry.aRatio;
        var gap = inBetween * width;
        var bodies = [];

        for (var i = 0, curX = 0; i < option.text.length; i++) {
            if (option.text[i] == " ") { curX += width; continue; }
            bodies.push(this.printGlyph(option.text[i], option.x + curX, option.y, width, height, randomElement(option.color), option)); //Spawn a single character
            curX += relativeWidth[option.text[i]] * width + gap;
        }

        return bodies;
    }

    printGlyph(char, x, y, width, height, color, option) {
        var body = Bodies.fromVertices(
            x, y, Foundry.get(char).vertices, {
                render: {
                    fillStyle: color,
                    strokeStyle: color,
                    lineWidth: 1,
                },
                collisionFilter: {
                    category: option.category,
                    mask: option.mask,
                },
                restitution: option.restitution,
                label: char,
            }
        );

        if (option.wrap) {
            body.plugin.wrap = {
                min: { x: 0, y: 0, },
                max: { x: this.container.clientWidth, y: this.container.clientHeight, }
            }
            this.wrappingBodies.push(body);
        }

        var newWidth = relativeBoundingWidth[char] * width;
        var scale = newWidth/(body.bounds.max.x - body.bounds.min.x);
        var verticalOffset = ((body.bounds.max.y - body.bounds.min.y) * scale * Foundry.get(char).aspectRatio - height)/2;

        if ("gjpqy".includes(char)) verticalOffset = -height * charAscent;
        else if ("fil".includes(char)) verticalOffset = height * charAscent;
        else if ("79".includes(char)) verticalOffset = height * numberAdjustment;
        else if (isUpper(char)) verticalOffset = height * capsAscent;

        Body.scale(body, scale, scale);
        Body.setPosition(body, {
            x: x + newWidth/2,
            y: y - verticalOffset,
        });

        Composite.add(this.engine.world, body);

        return body;
    }

    updateWrap() {
        this.wrappingBodies.forEach(body => {
            body.plugin.wrap = {
                min: { x: 0, y: 0, },
                max: { x: this.container.clientWidth, y: this.container.clientHeight, }
            }
        });
    }

}
const rprinter = new Printer(realityInstance);