/**
 * Created by lingchentian on 14-8-18.
 */
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener('tick', onTick);

var stage;
var circle;
var fpsLabel;
var loadQueue;

function loadResource() {
    loadQueue = new createjs.LoadQueue();
    loadQueue.loadManifest([
        {id:'icon', src:'images/icon.png'}
    ]);
    loadQueue.addEventListener('complete', onLoadQueueComplete);
}

function onLoadQueueComplete() {
    stage = new createjs.Stage('canvas-stage');

    circle = new createjs.Shape();
    circle.width = circle.height = 50;
    circle.graphics.beginFill('red').drawCircle(0, 0, circle.width);
    circle.x = circle.width / 2;
    circle.y = stage.canvas.height / 2;
    circle.addEventListener('click', onClickCircle);
    stage.addChild(circle);

    fpsLabel = new createjs.Text("fps", "18px Arial");
    fpsLabel.x = fpsLabel.y = 0;
    stage.addChild(fpsLabel);
}

function onClickCircle() {
    var icon = new createjs.Bitmap(loadQueue.getResult('icon'));
    icon.x = Math.random() * stage.canvas.width;
    icon.y = Math.random() * stage.canvas.height;
    stage.addChild(icon);
}

function onTick(event) {
    circle.x = circle.x + 2;
    if (circle.x > stage.canvas.width + circle.width) {
        circle.x = circle.width / 2;
    }
    stage.update();
    fpsLabel.text = 'fpx: ' + Math.round(createjs.Ticker.getMeasuredFPS());
}

loadResource();
