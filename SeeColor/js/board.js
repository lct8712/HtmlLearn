function Board (rectNumber, boardLength, container) {
    this.rectNumber = rectNumber;
    this.boardLength = boardLength;
    this.container = container;

    this.generate();
}

Board.prototype = {
    maxRectNumber : 8,
    getRectType : function (x, y) {
        return (x == this.specialBoardX && y == this.specialBoardY) ? RectType.Special : RectType.Normal;
    },
    increaseNumber : function () {
        this.rectNumber += 1;
        if (this.rectNumber >= this.maxRectNumber) {
            this.rectNumber = this.maxRectNumber;
        }
        this.generate();
    },
    generate : function () {
        this.rectColor = getRandomColor();

        this.specialBoardX = parseInt(Math.random() * this.rectNumber, 10);
        this.specialBoardY = parseInt(Math.random() * this.rectNumber, 10);
    },
    draw : function () {
        this.container.removeAllChildren();

        var rectLength = this.boardLength / this.rectNumber;
        for (var i = 0; i < this.rectNumber; i++) {
            for (var j = 0; j < this.rectNumber; j++) {
                var rectType = this.getRectType(i, j);
                var rect = new Rect(rectLength, this.rectColor, rectType);
                rect.x = i * rectLength;
                rect.y = j * rectLength;
                this.container.addChild(rect);

                rect.addEventListener('click', function(e) {
                    if (e.currentTarget.getResult()) {
                        this.increaseNumber();
                        this.draw();
                        this.successCallback();
                    } else {
                        this.failedCallback();
                    }
                }.bind(this));
            }
        }
    },
    setCallback : function (successCallback, failedCallback) {
        this.successCallback = successCallback;
        this.failedCallback = failedCallback;
    }
}
