/** ISW klavertje — neon dot style (klassieke 4-blaadjes vorm) */

let cloverCanvas, cloverCtx, cloverDots = [], cloverAnimId = null;

function drawCloverShape(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const u = w / 92;
    const tilt = Math.PI / 10;

    ctx.fillStyle = '#fff';

    for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(i * Math.PI / 2 + tilt);

        ctx.beginPath();
        ctx.moveTo(-7 * u, -6 * u);
        ctx.lineTo(7 * u, -6 * u);
        ctx.bezierCurveTo(16 * u, -6 * u, 24 * u, -14 * u, 24 * u, -24 * u);
        ctx.bezierCurveTo(24 * u, -33 * u, 16 * u, -40 * u, 0, -40 * u);
        ctx.bezierCurveTo(-16 * u, -40 * u, -24 * u, -33 * u, -24 * u, -24 * u);
        ctx.bezierCurveTo(-24 * u, -14 * u, -16 * u, -6 * u, -7 * u, -6 * u);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

function sampleShapeAlpha(data, w, x, y) {
    const px = Math.min(w - 1, Math.max(0, Math.floor(x)));
    const py = Math.min(w - 1, Math.max(0, Math.floor(y)));
    return data[(py * w + px) * 4 + 3];
}

function buildCloverDots(w, h) {
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');
    drawCloverShape(octx, w, h);
    const data = octx.getImageData(0, 0, w, h).data;
    const spacing = 3.8;
    const dots = [];

    for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
            if (sampleShapeAlpha(data, w, x, y) <= 128) continue;

            const edge =
                sampleShapeAlpha(data, w, x + spacing, y) <= 128 ||
                sampleShapeAlpha(data, w, x - spacing, y) <= 128 ||
                sampleShapeAlpha(data, w, x, y + spacing) <= 128 ||
                sampleShapeAlpha(data, w, x, y - spacing) <= 128;

            dots.push({
                x, y,
                offset: Math.random() * Math.PI * 2,
                tier: edge ? 'edge' : Math.random() > 0.65 ? 'bright' : 'base'
            });
        }
    }
    return dots;
}

function animateCloverLogo() {
    if (!cloverCtx || !cloverDots.length) return;
    const w = cloverCanvas.width;
    const h = cloverCanvas.height;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const time = Date.now() * 0.0022;

    cloverCtx.clearRect(0, 0, w, h);

    cloverDots.forEach(dot => {
        const pulse = reduced ? 0 : Math.sin(time + dot.offset);
        const wave = reduced ? 0 : Math.sin(time * 0.65 + dot.x * 0.07 + dot.y * 0.07);

        let alpha, radius, color;

        if (dot.tier === 'edge') {
            alpha = 0.72 + pulse * 0.28 + wave * 0.08;
            radius = 1.35 + pulse * 0.2;
            color = `rgba(80, 255, 160, ${alpha})`;
        } else if (dot.tier === 'bright') {
            alpha = 0.5 + pulse * 0.3 + wave * 0.08;
            radius = 1.45 + pulse * 0.25;
            color = `rgba(0, 255, 140, ${alpha})`;
        } else {
            alpha = 0.32 + pulse * 0.18 + wave * 0.05;
            radius = 1.05 + pulse * 0.15;
            color = `rgba(0, 255, 204, ${alpha})`;
        }

        cloverCtx.beginPath();
        cloverCtx.fillStyle = color;
        cloverCtx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        cloverCtx.fill();

        if (dot.tier === 'edge' && !reduced) {
            cloverCtx.beginPath();
            cloverCtx.fillStyle = `rgba(120, 255, 180, ${alpha * 0.22})`;
            cloverCtx.arc(dot.x, dot.y, radius * 2.4, 0, Math.PI * 2);
            cloverCtx.fill();
        }
    });

    cloverAnimId = requestAnimationFrame(animateCloverLogo);
}

function initHeaderCloverLogo() {
    cloverCanvas = document.getElementById('isw-clover-canvas');
    if (!cloverCanvas) return;

    cloverCtx = cloverCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 96;
    cloverCanvas.width = size * dpr;
    cloverCanvas.height = size * dpr;
    cloverCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cloverDots = buildCloverDots(size, size);

    if (cloverAnimId) cancelAnimationFrame(cloverAnimId);
    animateCloverLogo();
}
