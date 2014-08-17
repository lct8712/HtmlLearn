var stage = new createjs.Stage('gameView');
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener('tick', stage);

var gameView = new createjs.Container();
stage.addChild(gameView);

var increaseCount = function ($countContainer) {
    $countContainer.html(parseInt($countContainer.html()) + 1);
}

var clickSuccess = function () {
    increaseCount($('#success-count'));
}

var clickFailed = function () {
    increaseCount($('#failed-count'));
}

var board = new Board(2, $('#gameView').width(), gameView);
board.setCallback(clickSuccess, clickFailed);
board.draw();
