class GlyphDictionary {
    constructor() {
        this.digitVertices = new Array(10);
        this.upperVertices = new Array(26);
        this.lowerVertices = new Array(26);
        this.operVertices = {};

        this.digitRatio = new Array(10);
        this.upperRatio = new Array(26);
        this.lowerRatio = new Array(26);
        this.operRatio = {};

        this.parser = new window.DOMParser();
        this.aRatio = -1;
    }

    //Foundry.load();
    async load() {
        await this.loadVertices();
        await this.calculateDimensions();
    }

    get(char) {
        if (isDigit(char)) return { 
            vertices: this.digitVertices[char.charCodeAt(0) - 48],
            aspectRatio: this.digitRatio[char.charCodeAt(0) - 48]
        }; else if (isUpper(char)) return {
            vertices: this.upperVertices[char.charCodeAt(0) - 65],
            aspectRatio: this.upperRatio[char.charCodeAt(0) - 65]
        }; else if (isLower(char)) return {
            vertices: this.lowerVertices[char.charCodeAt(0) - 97],
            aspectRatio: this.lowerRatio[char.charCodeAt(0) - 97]
        }; else return {
            vertices: this.operVertices[char],
            aspectRatio: this.operRatio[char]
        };
    }

    async loadVertices() {
        for (let i = 0 ; i < 10; i++) this.digitVertices[i] = await this.getCharVertex(lsNumber[i]);
        for (let i = 0 ; i < 26; i++) this.upperVertices[i] = await this.getCharVertex(lsUpper[i]);
        for (let i = 0 ; i < 26; i++) this.lowerVertices[i] = await this.getCharVertex(lsLower[i]);
        this.operVertices['+'] = await this.getCharVertex('+');
        this.operVertices['-'] = await this.getCharVertex('-');
        this.operVertices['/'] = await this.getCharVertex('/');
    }

    async calculateDimensions() {
        for (let i = 0 ; i < 10; i++) this.digitRatio[i] = aspectRatio(this.digitVertices[i]);
        for (let i = 0 ; i < 26; i++) this.upperRatio[i] = aspectRatio(this.upperVertices[i]);
        for (let i = 0 ; i < 26; i++) this.lowerRatio[i] = aspectRatio(this.lowerVertices[i]);
        this.operRatio['+'] = aspectRatio(this.operVertices['+']);
        this.operRatio['-'] = aspectRatio(this.operVertices['-']);
        this.operRatio['/'] = aspectRatio(this.operVertices['/']);
        this.aRatio = this.lowerRatio[0];
    }

    getCharVertex(char) {
        if (isDigit(char)) return this.getVertices(numberPath + char + '.svg');
        else if (isUpper(char)) return this.getVertices(upperPath + char + '.svg');
        else if (isLower(char)) return this.getVertices(lowerPath + char + '.svg');
        else if (char == '+') return this.getVertices(operPath + 'plus-43.svg');
        else if (char == '-') return this.getVertices(operPath + 'hyphen-45.svg');
        else if (char == '/') return this.getVertices(operPath + 'slash-47.svg');
        return null;
    }

    async getVertices(filePath) {
        try {
            const response = await fetch(filePath);
            const svgText = await response.text();
            const svgDoc = this.parser.parseFromString(svgText, 'image/svg+xml');
            const paths = [...svgDoc.querySelectorAll("path")];
            return Matter.Svg.pathToVertices(paths[0]);
        } catch (error) {
            console.log(filePath);
            console.error('Error fetching or processing SVG file:', error);
        }
    }

}