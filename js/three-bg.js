/**
 * three-bg.js — Static starfield with cursor repulsion void
 *
 * Rules:
 *  - Stars have FIXED home positions. They do not drift or twinkle.
 *  - Alpha is a hardcoded constant per-star. No shader math can zero it out.
 *  - Only the cursor disturbs stars. They spring back when cursor leaves.
 *  - That's it.
 */
(function () {
    const canvas = document.getElementById("three-bg-canvas");
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x01020A, 1);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // ── Star data (CPU) ───────────────────────────────────────────────────────
    const COUNT = 1400;

    // Home positions — fixed forever
    const homeX = new Float32Array(COUNT);
    const homeY = new Float32Array(COUNT);

    // Current positions (what gets rendered) — spring toward home
    const curX  = new Float32Array(COUNT);
    const curY  = new Float32Array(COUNT);

    // Depth: random Z value, used only for size variation
    const depth  = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);

    // GPU buffer we write to every frame
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);

    // Spread in world units at camera z=5 with FOV 60:
    // half-height = tan(30°) * 5 ≈ 2.89, half-width = aspect * 2.89
    const aspect = window.innerWidth / window.innerHeight;
    const HH = Math.tan(30 * Math.PI / 180) * camera.position.z;
    const HW = HH * aspect;

    // Colour palette — mostly white/blue-white, small gold + purple garnish
    // Format: [r, g, b, weight]
    const palette = [
        [1.00, 1.00, 1.00, 6],   // pure white
        [0.82, 0.90, 1.00, 4],   // blue-white
        [0.70, 0.82, 1.00, 2],   // pale blue
        [1.00, 0.88, 0.55, 1],   // amber gold
        [0.80, 0.65, 1.00, 1],   // soft purple
    ];
    // Build weighted lookup
    const lookup = [];
    for (const [r, g, b, w] of palette) {
        for (let i = 0; i < w; i++) lookup.push([r, g, b]);
    }

    for (let i = 0; i < COUNT; i++) {
        // Spread stars across 1.6× the visible area so edges feel filled
        homeX[i] = (Math.random() - 0.5) * HW * 3.2;
        homeY[i] = (Math.random() - 0.5) * HH * 3.2;
        depth[i] = Math.random();          // 0 = far, 1 = close

        curX[i] = homeX[i];
        curY[i] = homeY[i];

        // Size: near stars slightly bigger, but all small
        sizes[i] = 0.015 + depth[i] * 0.025;

        // Alpha: hardcoded per-star, no runtime math — far stars dimmer
        alphas[i] = 0.30 + depth[i] * 0.55;

        const c = lookup[Math.floor(Math.random() * lookup.length)];
        const i3 = i * 3;
        colors[i3]     = c[0];
        colors[i3 + 1] = c[1];
        colors[i3 + 2] = c[2];
    }

    // ── Geometry & Material ───────────────────────────────────────────────────
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors,    3));
    geo.setAttribute("size",     new THREE.BufferAttribute(sizes,     1));
    geo.setAttribute("alpha",    new THREE.BufferAttribute(alphas,    1));

    const mat = new THREE.ShaderMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uPR: { value: renderer.getPixelRatio() },
        },
        vertexShader: `
            attribute float size;
            attribute float alpha;
            uniform float uPR;
            varying float vAlpha;
            varying vec3  vColor;
            void main() {
                vAlpha = alpha;
                vColor = color;
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                gl_Position  = projectionMatrix * mv;
                gl_PointSize = size * uPR * 600.0 / -mv.z;
            }
        `,
        fragmentShader: `
            varying float vAlpha;
            varying vec3  vColor;
            void main() {
                float r = length(gl_PointCoord - 0.5);
                if (r > 0.5) discard;
                // Soft disc — bright centre, fade to edge
                float a = smoothstep(0.5, 0.05, r) * vAlpha;
                gl_FragColor = vec4(vColor, a);
            }
        `,
    });

    scene.add(new THREE.Points(geo, mat));

    // ── Mouse in world space (z=0 plane) ─────────────────────────────────────
    const mouseW = { x: 99999, y: 99999, active: false };

    function toWorld(clientX, clientY) {
        const nx =  (clientX / window.innerWidth  - 0.5) * 2;
        const ny = -(clientY / window.innerHeight - 0.5) * 2;
        const fovRad = camera.fov * Math.PI / 180;
        const h = Math.tan(fovRad / 2) * camera.position.z;
        mouseW.x = nx * h * camera.aspect;
        mouseW.y = ny * h;
    }

    window.addEventListener("mousemove", (e) => {
        mouseW.active = true;
        toWorld(e.clientX, e.clientY);
    });
    document.addEventListener("mouseleave", () => {
        mouseW.active = false;
        mouseW.x = 99999;
        mouseW.y = 99999;
    });

    // ── Scroll: very subtle camera Y shift for depth feel ────────────────────
    let targetCamY = 0;
    window.addEventListener("scroll", () => {
        targetCamY = -window.scrollY * 0.0008;
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mat.uniforms.uPR.value = renderer.getPixelRatio();
    });

    // ── Animation loop ────────────────────────────────────────────────────────
    const REPULSE_R  = 1.2;   // world-unit radius of the cursor void
    const REPULSE_F  = 2.8;   // force at the centre
    const SPRING     = 0.08;  // how fast stars return home (0–1)

    function animate() {
        requestAnimationFrame(animate);

        for (let i = 0; i < COUNT; i++) {
            const dx = curX[i] - mouseW.x;
            const dy = curY[i] - mouseW.y;
            const d  = Math.sqrt(dx * dx + dy * dy);

            if (mouseW.active && d < REPULSE_R && d > 0.0001) {
                // Push away from cursor — strength falls off linearly with distance
                const f   = (1 - d / REPULSE_R) * REPULSE_F;
                curX[i]  += (dx / d) * f;
                curY[i]  += (dy / d) * f;
            } else {
                // Spring back toward home
                curX[i] += (homeX[i] - curX[i]) * SPRING;
                curY[i] += (homeY[i] - curY[i]) * SPRING;
            }

            const i3 = i * 3;
            positions[i3]     = curX[i];
            positions[i3 + 1] = curY[i];
            positions[i3 + 2] = -depth[i] * 2; // depth spread: 0 to -2
        }

        geo.getAttribute("position").needsUpdate = true;

        // Subtle scroll parallax
        camera.position.y += (targetCamY - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();
})();
