var SceneSwitch = pc.createScript('sceneSwitch');

SceneSwitch.prototype.initialize = function() {
    var self = this;
    window.addEventListener("message", function(event) {
        if (event.data && event.data.action === 'switchScene') {
            var sceneName = event.data.sceneName;
            self.switchScene(sceneName);
        }
    }, false);
};
SceneSwitch.prototype.switchScene = function(sceneName) {

    this.app.scene.load(sceneName, function (err) {
        if (err) {
            console.error( err);
        } else {
            console.log(sceneName);
        }
    });
};