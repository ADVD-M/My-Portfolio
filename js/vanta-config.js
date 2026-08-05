document.addEventListener("DOMContentLoaded", () => {
    // Check if the element exists
    if(document.getElementById("particles-js")) {
        VANTA.DOTS({
            el: "#particles-js",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xfbbf24, // Gold Accent
            color2: 0xd97706, // Secondary Gold
            backgroundColor: 0x050505, // True Black
            size: 3.00,
            spacing: 35.00,
            showLines: false
        });
    }
});
