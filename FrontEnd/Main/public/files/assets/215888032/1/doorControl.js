var DoorControl = pc.createScript('doorControl');

DoorControl.prototype.initialize = function() {
    var self = this;
    
    this.glassDoorClosed = this.app.root.findByName("Glass Door Closed");
    this.glassDoorOpen = this.app.root.findByName("Glass Door Open");
    
    if (this.glassDoorClosed) this.glassDoorClosed.enabled = true;
    if (this.glassDoorOpen) this.glassDoorOpen.enabled = false;
    
    window.addEventListener("message", function(event) {
        if (event.data.loginToken) {
            self.unlockDoor();
        }
    }, false);
};

DoorControl.prototype.unlockDoor = function() {
    if (this.glassDoorClosed) this.glassDoorClosed.enabled = false;
    if (this.glassDoorOpen) this.glassDoorOpen.enabled = true;
};