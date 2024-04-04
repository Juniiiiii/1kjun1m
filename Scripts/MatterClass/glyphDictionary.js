const allowedGlyphs = /^[a-zA-Z0-9\/+\-]+$/;

class GlyphDictionary {
    constructor(data) {
        this.digitVertices = data.digitVertices;
        this.upperVertices = data.upperVertices;
        this.lowerVertices = data.lowerVertices;
        this.operVertices = data.operVertices;

        this.digitRatio = data.digitRatio;
        this.upperRatio = data.upperRatio;
        this.lowerRatio = data.lowerRatio;
        this.operRatio = data.operRatio;

        this.aRatio = data.aRatio;
        
        this.parser = new window.DOMParser();
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
}