document.addEventListener("DOMContentLoaded", () => {
    // Create cursor elements
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    
    const follower = document.createElement("div");
    follower.classList.add("custom-cursor-follower");

    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let followerX = mouseX;
    let followerY = mouseY;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor if hidden
        cursor.style.opacity = "1";
        follower.style.opacity = "1";
    });

    document.addEventListener("mouseout", (e) => {
        if (e.relatedTarget === null) {
            cursor.style.opacity = "0";
            follower.style.opacity = "0";
        }
    });

    function animate() {
        // Smooth follow
        cursorX += (mouseX - cursorX) * 0.4;
        cursorY += (mouseY - cursorY) * 0.4;
        
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(animate);
    }
    
    animate();

    // Add hover states to all links and interactive elements
    const setupInteractables = () => {
        const interactables = document.querySelectorAll('a, button, input, textarea, select, .glass-card, .profile-square');
        
        interactables.forEach(el => {
            // Avoid adding multiple listeners if already added
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = "true";

            el.addEventListener("mouseenter", () => {
                cursor.classList.add("hover");
                follower.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                cursor.classList.remove("hover");
                follower.classList.remove("hover");
            });
        });
    };

    setupInteractables();

    // Run setup again in case content is dynamically loaded (like the projects list)
    setTimeout(setupInteractables, 500);
});
