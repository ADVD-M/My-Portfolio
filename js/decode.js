document.addEventListener("DOMContentLoaded", () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>[]{}";

    const elements = document.querySelectorAll(".decode-text");

    elements.forEach((el, index) => {
        // Stagger the start times slightly based on the element's index
        setTimeout(() => {
            const originalText = el.dataset.original || el.innerText;
            if (!el.dataset.original) {
                el.dataset.original = originalText;
            }

            let iterations = 0;
            const interval = setInterval(() => {
                el.innerText = originalText
                    .split("")
                    .map((letter, i) => {
                        if (i < iterations) {
                            return originalText[i];
                        }
                        if (letter === " " || letter === "\n") return letter;
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    // Ensure the exact original HTML is restored if there were encoded entities like &amp;
                    el.innerHTML = el.dataset.originalHtml || originalText;
                }

                // Increase this fraction to decode faster (e.g. 1/3 means 3 frames per letter)
                iterations += 1/2; 
            }, 30);
        }, index * 300); // 300ms delay between elements starting
        
        // Save HTML for restoration
        if(!el.dataset.originalHtml) {
            el.dataset.originalHtml = el.innerHTML;
        }
    });
});
