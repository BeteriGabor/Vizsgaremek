var DoorControl = pc.createScript('doorControl');

DoorControl.prototype.initialize = function() {
    var self = this;

    // Ajtók lekérése a PlayCanvas scene-ből
    this.glassDoorClosed = this.app.root.findByName("Glass Door Closed");
    this.glassDoorOpen = this.app.root.findByName("Glass Door Open");

    // Kezdetben az egyik aktív, a másik nem
    if (this.glassDoorClosed) this.glassDoorClosed.enabled = true;
    if (this.glassDoorOpen) this.glassDoorOpen.enabled = false;

    // Üzenet figyelése a frontendtől
    window.addEventListener("message", function(event) {
        if (event.data.action === "unlockDoor") {
            self.unlockDoor();
        }
    }, false);
};

// Ajtó állapotának módosítása
DoorControl.prototype.unlockDoor = function() {
    if (this.glassDoorClosed) this.glassDoorClosed.enabled = false;
    if (this.glassDoorOpen) this.glassDoorOpen.enabled = true;
};
