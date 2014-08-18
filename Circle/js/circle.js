/**
 * Created by lingchentian on 14-8-18.
 */
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener('tick', onTick);

var GameState = {
    Ready : 'ready',
    Drawing : 'drawing',
    Finished : 'finished'
};

var stage;
var scoreLabel;
var circleShape;
var radiusShape;
var restartButton;

var mouseShape;
var gameState;
var xHistory;
var yHistory;

var currentRadiusLength;

function init() {
    stage = new createjs.Stage('canvas-stage');

    scoreLabel = new createjs.Text('', '18px Arial');
    scoreLabel.x = scoreLabel.y = 0;
    stage.addChild(scoreLabel);

    var buttonBackGround = new createjs.Shape();
    buttonBackGround.name = 'buttonBackGround';
    buttonBackGround.graphics.beginFill('green').drawRoundRect(0, 0, 100, 40, 10);
    var buttonLabel = new createjs.Text('Try Again!', '18px Arial', 'white');
    buttonLabel.textAlign = 'center';
    buttonLabel.textBaseline = 'middle';
    buttonLabel.x = 100 / 2;
    buttonLabel.y = 40 / 2;
    restartButton = new createjs.Container();
    restartButton.x = stage.canvas.width - 100;
    restartButton.y = 0;
    restartButton.addChild(buttonBackGround, buttonLabel);
    restartButton.addEventListener('click', run);
    stage.addChild(restartButton);

    stage.addEventListener('stagemousedown', onStageMouseDown);
    stage.addEventListener('stagemouseup', onStageMouseUp);
    stage.addEventListener('stagemousemove', onStageMouseMove);
}

function run() {
    gameState = GameState.Ready;
    xHistory = [];
    yHistory = [];
    currentRadiusLength = Math.random() * stage.canvas.width / 4 + 30;
    stage.removeChild(circleShape);
    stage.removeChild(mouseShape);
    stage.removeChild(radiusShape);

    scoreLabel.text = 'Press mouse and draw a circle';

    circleShape = new createjs.Shape();
    circleShape.x = stage.canvas.width / 2;
    circleShape.y = stage.canvas.height / 2;
    circleShape.graphics.beginStroke('black').drawCircle(0, 0, currentRadiusLength);
    stage.addChild(circleShape);

    mouseShape = new createjs.Shape();
    stage.addChild(mouseShape);

    radiusShape = new createjs.Shape();
    radiusShape.x = stage.canvas.width / 2;
    radiusShape.y = stage.canvas.height / 2;
    var linePosition = currentRadiusLength / Math.sqrt(2);
    radiusShape.graphics.beginStroke('black').moveTo(0, 0).lineTo(linePosition, -linePosition);
    stage.addChild(radiusShape);

    stage.update();
}

function onTick() {
}

function isInRestartButton() {
    var button = restartButton.getChildByName('buttonBackGround');
    var pt = button.globalToLocal(stage.mouseX, stage.mouseY);
    return restartButton.getChildByName('buttonBackGround').hitTest(pt.x, pt.y);
}

function onStageMouseDown(event) {
    if (isInRestartButton() || gameState != GameState.Ready) {
        return;
    }

    gameState = GameState.Drawing;
    xHistory.push(event.stageX);
    yHistory.push(event.stageY);

    scoreLabel.text = '';
    stage.removeChild(circleShape);
    stage.update();
}

function onStageMouseUp() {
    if (isInRestartButton() || gameState != GameState.Drawing) {
        return;
    }
    gameState = GameState.Finished;

    scoreLabel.text = 'score: ' + Math.round(computeScore() * 10000) / 100  + '%';
    stage.update();
}

function onStageMouseMove(event) {
    if (gameState != GameState.Drawing) {
        return;
    }

    mouseShape.graphics.beginStroke('blue').setStrokeStyle(3, 'round')
        .moveTo(xHistory[xHistory.length - 1], yHistory[yHistory.length - 1])
        .lineTo(event.stageX, event.stageY);
    xHistory.push(event.stageX);
    yHistory.push(event.stageY);
    stage.update();
}

function computeDistance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function computeAngle(a, b, c) {
    var dA = computeDistance(b, c);
    var dB = computeDistance(a, c);
    var dC = computeDistance(a, b);
    var cosA = (dB * dB + dC * dC - dA * dA) / (2 * dB * dC);
    return Math.acos(cosA) * 180 / Math.PI;
}

function initList(size) {
    var result = [];
    for (var i = 0; i < size; i++) {
        result.push(0);
    }
    return result;
}

function computeDrawedAnglePercent(drawedAngleTable) {
    var sum = 0;
    for (var i = 0; i < drawedAngleTable.length; i++) {
        sum += drawedAngleTable[i];
    }
    return sum / drawedAngleTable.length;
}

function computeScore() {
    var offset = 0;
    var drawedAngleLength = 10;
    var drawedAngleTable = initList(drawedAngleLength);
    for (var i = 0; i < xHistory.length; i++) {
        var drawRaidus = computeDistance({ x : xHistory[i], y : yHistory[i]}, { x : radiusShape.x, y : radiusShape.y});
        offset += Math.abs(currentRadiusLength - drawRaidus);

        var currentAngle = computeAngle(
            { x : stage.canvas.width / 2, y : stage.canvas.height / 2},
            { x : xHistory[0], y : yHistory[0]},
            { x : xHistory[i], y : yHistory[i]});
        drawedAngleTable[Math.round(currentAngle / (180 / drawedAngleLength))] = 1;
    }

    var drawedAnglePercent = computeDrawedAnglePercent(drawedAngleTable);
    var startEndAngle = computeAngle(
        { x : stage.canvas.width / 2, y : stage.canvas.height / 2},
        { x : xHistory[0], y : yHistory[0]},
        { x : xHistory[xHistory.length - 1], y : yHistory[yHistory.length - 1]});
    var startEndPercent = 1 - startEndAngle / 180;

    var score = 1.0 - offset / (currentRadiusLength * xHistory.length);
    console.log('init score: ' + score);
    console.log('drawedAnglePercent: ' + drawedAnglePercent);
    console.log('startEndPercent: ' + startEndPercent);
    return score * drawedAnglePercent * startEndPercent;
}

init();
run();
