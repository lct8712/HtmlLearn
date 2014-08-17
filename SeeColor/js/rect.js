var RectType = {
    Normal : 'Normal',
    Special : 'Special'
}

var RectMargin = 5;
var ColorSamilarMargin = 32;

function getRandomColor () {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

function getSamilarColor (color) {
    var samilarColor = (parseInt(color.substr(1), 16) - ColorSamilarMargin);
    if (samilarColor < 0) {
        samilarColor = 0xFFFFFF;
    }
    return '#' + samilarColor.toString(16);
}

// --------------------------- Ojbect Rect ------------------------------------

function Rect (length, color, type) {
    createjs.Shape.call(this);
    this.rectType = type;

    currentColor = (type == RectType.Normal) ? color : getSamilarColor(color);
    this.graphics.beginFill(currentColor);
    this.graphics.drawRect(0, 0, length - RectMargin, length - RectMargin);
    this.graphics.endFill();
}

Rect.prototype = new createjs.Shape();

Rect.prototype.getResult = function () {
    return this.rectType == RectType.Special;
}
