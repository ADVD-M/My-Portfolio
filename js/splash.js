document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById("splash-screen");
    if (!splashScreen) return;

    // Check if the splash screen has already been played in this session
    if (sessionStorage.getItem("splashPlayed") === "true") {
        splashScreen.style.display = "none";
        splashScreen.remove();
        return;
    }

    // Mark as played for future loads in this session
    sessionStorage.setItem("splashPlayed", "true");

    const line1 = document.getElementById("splash-line-1");
    const line2 = document.getElementById("splash-line-2");
    
    const text1 = "> Initializing system...";
    const text2 = "> Access granted. Welcome, visitor.";

    // Initially hide cursor on line 2
    document.getElementById("cursor-2").style.display = "none";

    let i1 = 0;
    let i2 = 0;
    const speed = 50; // ms per character

    function typeLine1() {
        if (i1 < text1.length) {
            line1.innerHTML += text1.charAt(i1);
            i1++;
            setTimeout(typeLine1, speed);
        } else {
            // Hide cursor 1, show cursor 2, pause, then type line 2
            document.getElementById("cursor-1").style.display = "none";
            document.getElementById("cursor-2").style.display = "inline-block";
            setTimeout(typeLine2, 500); // 500ms pause before line 2 starts
        }
    }

    function typeLine2() {
        if (i2 < text2.length) {
            line2.innerHTML += text2.charAt(i2);
            i2++;
            setTimeout(typeLine2, speed);
        } else {
            // Finished typing. Pause, then fade out.
            setTimeout(() => {
                splashScreen.classList.add("fade-out");

                // Remove from DOM after fade out completes
                setTimeout(() => {
                    splashScreen.remove();
                }, 800); // Matches CSS transition duration (0.8s)
            }, 1000); // 1s pause reading time before fading out
        }
    }

    // Start typing after a tiny delay to ensure page is rendering
    setTimeout(typeLine1, 300);
});
