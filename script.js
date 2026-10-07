/* ========================================
   1. INTRO
======================================== */

const intro = document.getElementById("intro");
const skipButton = document.getElementById("skip");

function closeIntro() {
    if (!intro || intro.classList.contains("out")) return;

    intro.classList.add("out");

    setTimeout(() => {
        intro.remove();
    }, 1300);
}

skipButton?.addEventListener("click", closeIntro);

setTimeout(closeIntro, 4200);


/* ========================================
   2. CHARACTER DATA
======================================== */

const characters = [
    {
        img: "images/kim.jpg",
        name: "KIM DOKJA",
        role: "ผู้อ่านคนเดียวที่รู้อนาคต",
        icon: "book",
        color: "#defbff",
        description:
            "พนักงานออฟฟิศธรรมดาที่อ่านนิยายเรื่องเดียวจนจบ 3,149 ตอน ความรู้ของเขาคืออาวุธที่ไม่มีใครมี",
        quote:
            "'I will finish your story'",
        tags: ["ผู้อ่าน", "ไหวพริบ", "รู้อนาคต"]
    },
    {
        img: "images/Yoo1.webp",
        name: "YOO JOONGHYUK",
        role: "ตัวเอกของนิยายต้นฉบับ",
        icon: "sword",
        color: "#f8ffde",
        description:
            "ผู้ผ่านโลกที่ล่มสลายมานับครั้งไม่ถ้วน จนรู้ดีว่าต้องทำอย่างไรจึงจะรอด",
        quote:
            "'Will I ever get to meet you again ?'",
        tags: ["ตัวเอกต้นฉบับ", "วนซ้ำ", "นักสู้"]
    },
    {
        img: "images/Han2.webp",
        name: "HAN SOOYOUNG",
        role: "นักเขียนผู้พัวพันกับเรื่องราว",
        icon: "quill",
        color: "#ecdbfd",
        description:
            "นักเขียนผู้มีความสัมพันธ์ซับซ้อนกับเรื่องราว ตัวละคร และความจริง",
        quote:
            "'Ultimatary , every human is their own writer'",
        tags: ["นักเขียน", "เจ้าเล่ห์", "ปริศนา"]
    }
];


/* ========================================
   3. CREATE CHARACTER CARDS
======================================== */

const stage = document.getElementById("stage");
const dotsContainer = document.getElementById("dots");
const characterSection = document.getElementById("chars");
const previousButton = document.getElementById("pv");
const nextButton = document.getElementById("nx");

let currentIndex = 0;

if (stage && dotsContainer && characterSection) {
    characters.forEach((character, index) => {
        const card = document.createElement("div");

        card.className = "card";
        card.dataset.index = index;
        card.style.setProperty("--c", character.color);

        card.innerHTML = `
            <div class="tilt">
                <div class="f">

                    <!-- Front of card -->
                    <div class="face">

                        <div
                            class="ph"
                            style="background-image: url('${character.img}')"
                        ></div>

                        <div class="ic">
                            <svg class="i">
                                <use href="#${character.icon}"></use>
                            </svg>
                        </div>

                        <div class="glare"></div>

                        <h3>${character.name}</h3>

                        <div class="role">
                            ${character.role}
                        </div>

                        <p>${character.description}</p>

                    </div>

                    <!-- Back of card -->
                    <div class="face bk">

                        <div
                            class="ph"
                            style="background-image: url('${character.img}')"
                        ></div>

                        <div class="ic">
                            <svg class="i">
                                <use href="#${character.icon}"></use>
                            </svg>
                        </div>

                        <h3>${character.name}</h3>

                        <p
                            style="
                                font: 500 18px 'Noto Serif Thai', serif;
                                margin-top: 10px;
                            "
                        >
                            ${character.quote}
                        </p>

                        <div class="tags">
                            ${character.tags
                                .map(tag => `<i>${tag}</i>`)
                                .join("")}
                        </div>

                    </div>

                </div>
            </div>
        `;

        stage.appendChild(card);

        const dot = document.createElement("i");
        dot.setAttribute("aria-label", character.name);
        dot.style.cursor = "pointer";

        dot.addEventListener("click", () => {
            goToCharacter(index);
        });

        dotsContainer.appendChild(dot);
    });
}


/* ========================================
   4. CHARACTER SLIDER
======================================== */

const cards = stage
    ? [...stage.querySelectorAll(".card")]
    : [];

const dots = dotsContainer
    ? [...dotsContainer.children]
    : [];

function updateCharacters() {
    if (!stage || !characterSection) return;

    const step = Math.min(230, window.innerWidth * 0.46);

    cards.forEach((card, index) => {
        const offset = index - currentIndex;
        const distance = Math.abs(offset);

        card.classList.toggle("on", offset === 0);

        if (offset !== 0) {
            card.classList.remove("flip");
        }

        card.style.transform = `
            translateX(${offset * step}px)
            translateZ(${-distance * 140}px)
            rotateY(${-offset * 32}deg)
            scale(${1 - distance * 0.06})
        `;

        card.style.opacity = distance > 1
            ? "0"
            : distance === 1
                ? "0.5"
                : "1";

        card.style.filter = distance > 0
            ? "blur(2px)"
            : "none";

        card.style.zIndex = String(9 - distance);

        card.style.pointerEvents = distance > 1
            ? "none"
            : "auto";
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("on", index === currentIndex);
    });

    characterSection.style.setProperty(
        "--aura",
        characters[currentIndex].color
    );
}

function goToCharacter(index) {
    currentIndex = Math.max(
        0,
        Math.min(characters.length - 1, index)
    );

    updateCharacters();
}

previousButton?.addEventListener("click", () => {
    goToCharacter(currentIndex - 1);
});

nextButton?.addEventListener("click", () => {
    goToCharacter(currentIndex + 1);
});

stage?.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        goToCharacter(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
        goToCharacter(currentIndex + 1);
    }
});


/* ========================================
   5. SWIPE AND FLIP CARDS
======================================== */

let startX = null;

stage?.addEventListener("pointerdown", event => {
    startX = event.clientX;
});

stage?.addEventListener("pointerup", event => {
    if (startX === null) return;

    const distance = event.clientX - startX;
    startX = null;

    if (Math.abs(distance) > 40) {
        goToCharacter(
            currentIndex + (distance < 0 ? 1 : -1)
        );

        return;
    }

    const card = event.target.closest(".card");

    if (!card) return;

    const index = Number(card.dataset.index);

    if (index === currentIndex) {
        card.classList.toggle("flip");
    } else {
        goToCharacter(index);
    }
});

stage?.addEventListener("pointermove", event => {
    if (!cards.length) return;

    const card = cards[currentIndex];
    const tilt = card.querySelector(".tilt");
    const glare = card.querySelector(".glare");

    const rect = card.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    if (x < 0 || x > 1 || y < 0 || y > 1) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
        return;
    }

    tilt.style.setProperty(
        "--ry",
        `${(x - 0.5) * 16}deg`
    );

    tilt.style.setProperty(
        "--rx",
        `${(0.5 - y) * 14}deg`
    );

    glare?.style.setProperty("--gx", `${x * 100}%`);
    glare?.style.setProperty("--gy", `${y * 100}%`);
});

stage?.addEventListener("pointerleave", () => {
    const card = cards[currentIndex];

    if (!card) return;

    const tilt = card.querySelector(".tilt");

    tilt.style.setProperty("--rx", "0deg");
    tilt.style.setProperty("--ry", "0deg");
});

window.addEventListener("resize", updateCharacters);

updateCharacters();


/* ========================================
   6. SCROLL REVEAL
======================================== */

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("on");

            if (entry.target.id === "mood") {
                startRadar();
            }

            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll(".rv, #clock").forEach(element => {
        revealObserver.observe(element);
    });
} else {
    document.querySelectorAll(".rv, #clock").forEach(element => {
        element.classList.add("on");
    });
}


/* ========================================
   7. STARRY SKY AND SHOOTING STARS
======================================== */

const canvas = document.getElementById("sky");
const context = canvas?.getContext("2d");

let canvasWidth = 0;
let canvasHeight = 0;
let stars = [];
let shootingStars = [];
let nextShootingStar = 600;

function resizeCanvas() {
    if (!canvas || !context) return;

    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;

    stars = Array.from({
        length: Math.min(150, canvasWidth / 6)
    }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 1.3 + 0.3,
        phase: Math.random() * 6,
        depth: Math.random() * 0.3 + 0.05
    }));
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

let previousFrame = 0;

function drawSky(time) {
    if (!context) return;

    const deltaTime = (time - previousFrame) / 1000 || 0;
    previousFrame = time;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw stars
    stars.forEach(star => {
        const y = (
            (star.y - window.scrollY * star.depth) % canvasHeight
            + canvasHeight
        ) % canvasHeight;

        context.globalAlpha =
            0.35 + 0.65 * Math.abs(
                Math.sin(time / 1300 + star.phase)
            );

        context.fillStyle = star.radius > 1.1
            ? "#ffffff"
            : "#b9c0d8";

        context.beginPath();

        context.arc(
            star.x,
            y,
            star.radius,
            0,
            Math.PI * 2
        );

        context.fill();
    });

    // Create shooting stars
    if (time > nextShootingStar) {
        nextShootingStar =
            time + 1400 + Math.random() * 3200;

        const angle = Math.PI * (
            0.68 + Math.random() * 0.12
        );

        shootingStars.push({
            x: Math.random() * canvasWidth * 1.1,
            y: Math.random() * canvasHeight * 0.5,
            vx: Math.cos(angle) * -1,
            vy: Math.sin(angle),
            life: 0,
            length: 110 + Math.random() * 130
        });
    }

    // Draw shooting stars
    shootingStars = shootingStars.filter(star => {
        star.life += deltaTime;

        const speed = 950;

        star.x += star.vx * speed * deltaTime;
        star.y += star.vy * speed * deltaTime * 0.7;

        const alpha = Math.max(
            0,
            1 - star.life / 1.1
        );

        const gradient = context.createLinearGradient(
            star.x,
            star.y,
            star.x - star.vx * star.length,
            star.y - star.vy * star.length * 0.7
        );

        gradient.addColorStop(
            0,
            `rgba(255,255,255,${alpha})`
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        context.globalAlpha = 1;
        context.strokeStyle = gradient;
        context.lineWidth = 2;

        context.beginPath();

        context.moveTo(star.x, star.y);

        context.lineTo(
            star.x - star.vx * star.length,
            star.y - star.vy * star.length * 0.7
        );

        context.stroke();

        context.fillStyle = `rgba(255,255,255,${alpha})`;

        context.beginPath();

        context.arc(
            star.x,
            star.y,
            2.2,
            0,
            Math.PI * 2
        );

        context.fill();

        return star.life < 1.1;
    });

    context.globalAlpha = 1;

    requestAnimationFrame(drawSky);
}

if (context) {
    requestAnimationFrame(drawSky);
}


/* ========================================
   8. CLOCK, PROGRESS BAR, PARALLAX
======================================== */

const hourHand = document.querySelector(".hh");
const minuteHand = document.querySelector(".hm");
const secondHand = document.querySelector(".hs");
const clockRing = document.querySelector(".ring");

const bannerImage = document.querySelector("#banner img");
const progressBar = document.getElementById("prog");
const cursorGlow = document.getElementById("cur");

let clockAngle = 0;
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

window.addEventListener("pointermove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function animatePage(time) {
    const targetAngle = -window.scrollY * 0.55;

    clockAngle += (targetAngle - clockAngle) * 0.07;

    if (secondHand) {
        secondHand.style.transform =
            `rotate(${clockAngle * 6 + time * 0.004}deg)`;
    }

    if (minuteHand) {
        minuteHand.style.transform =
            `rotate(${clockAngle * 1.4}deg)`;
    }

    if (hourHand) {
        hourHand.style.transform =
            `rotate(${clockAngle * 0.12}deg)`;
    }

    if (clockRing) {
        clockRing.style.transform =
            `rotate(${-clockAngle * 0.6}deg)`;
    }

    // Reading progress
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
        const progress = maxScroll > 0
            ? (window.scrollY / maxScroll) * 100
            : 0;

        progressBar.style.width = `${progress}%`;
    }

    // Banner parallax
    if (bannerImage) {
        const rect = bannerImage.parentNode.getBoundingClientRect();

        bannerImage.style.transform =
            `translateY(${rect.top * -0.12}px)`;
    }

    // Cursor glow
    if (cursorGlow) {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;

        cursorGlow.style.transform =
            `translate(${cursorX}px, ${cursorY}px)`;
    }

    requestAnimationFrame(animatePage);
}

requestAnimationFrame(animatePage);


/* ========================================
   9. COVER TILT EFFECT
======================================== */

const cover = document.getElementById("cvr");
const coverWrapper = cover?.parentElement;

coverWrapper?.addEventListener("pointermove", event => {
    const rect = cover.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    cover.style.setProperty("--ry", `${x * 20}deg`);
    cover.style.setProperty("--rx", `${-y * 16}deg`);
});

coverWrapper?.addEventListener("pointerleave", () => {
    cover?.style.setProperty("--ry", "0deg");
    cover?.style.setProperty("--rx", "0deg");
});


/* ========================================
   10. MOOD RADAR CHART
======================================== */

const moodData = [
    ["ACTION", 90],
    ["DRAMA", 80],
    ["MYSTERY", 100],
    ["COMEDY", 50],
    ["EMOTION", 90]
];

let radarStarted = false;

function startRadar() {
    if (radarStarted) return;

    const radar = document.getElementById("radar");

    if (!radar) return;

    radarStarted = true;

    const size = 340;
    const center = size / 2;
    const radius = 112;

    function point(index, distance) {
        const angle = (-90 + 72 * index) * Math.PI / 180;

        return [
            center + distance * Math.cos(angle),
            center + distance * Math.sin(angle)
        ];
    }

    let svg = `
        <svg viewBox="0 0 ${size} ${size}">
    `;

    // Radar grid
    [0.25, 0.5, 0.75, 1].forEach(scale => {
        const points = moodData
            .map((_, index) => point(index, radius * scale).join(","))
            .join(" ");

        svg += `
            <polygon
                fill="none"
                stroke="#fff"
                stroke-opacity="${scale === 1 ? 0.5 : 0.18}"
                points="${points}"
            />
        `;
    });

    // Radar labels
    moodData.forEach((item, index) => {
        const position = point(index, radius);
        const labelPosition = point(index, radius + 26);

        svg += `
            <line
                x1="${center}"
                y1="${center}"
                x2="${position[0]}"
                y2="${position[1]}"
                stroke="#fff"
                stroke-opacity=".2"
            />

            <text
                x="${labelPosition[0]}"
                y="${labelPosition[1] + 4}"
            >${item[0]}</text>

            <text
                class="radar-value"
                x="${labelPosition[0]}"
                y="${labelPosition[1] + 19}"
                style="fill:#F5F5F5;font-size:13px"
            >0</text>
        `;
    });

    // Radar polygon and points
    svg += `
        <polygon class="pl" points=""></polygon>
        ${moodData.map(() => `
            <circle
                r="4"
                fill="#fff"
                style="filter:drop-shadow(0 0 6px #fff)"
            ></circle>
        `).join("")}

        <g
            class="sp"
            style="transform-origin:${center}px ${center}px"
        >
            <circle
                cx="${center}"
                cy="${center}"
                r="${radius + 8}"
                fill="none"
                stroke="#fff"
                stroke-opacity=".25"
                stroke-dasharray="2 8"
            ></circle>
        </g>

        </svg>
    `;

    radar.innerHTML = svg;

    const polygon = radar.querySelector(".pl");
    const points = radar.querySelectorAll('circle[r="4"]');
    const values = radar.querySelectorAll(".radar-value");
    const spinner = radar.querySelector(".sp");

    let startTime = null;

    function animateRadar(time) {
        if (startTime === null) {
            startTime = time;
        }

        const progress = Math.min(
            1,
            (time - startTime) / 2200
        );

        const easing = 1 - Math.pow(1 - progress, 3);

        const polygonPoints = [];

        moodData.forEach((item, index) => {
            const breathing = progress === 1
                ? 1 + 0.035 * Math.sin(time / 650 + index * 1.3)
                : 1;

            const valueRadius =
                radius * (item[1] / 100) * easing * breathing;

            const position = point(index, valueRadius);

            polygonPoints.push(position.join(","));

            points[index].setAttribute("cx", position[0]);
            points[index].setAttribute("cy", position[1]);

            values[index].textContent = Math.round(
                item[1] * easing
            );
        });

        polygon.setAttribute(
            "points",
            polygonPoints.join(" ")
        );

        spinner.style.transform =
            `rotate(${time / 90}deg)`;

        requestAnimationFrame(animateRadar);
    }

    requestAnimationFrame(animateRadar);
}


/* ========================================
   11. FLOATING PAPERS
======================================== */

(function createFloatingPapers() {
    const wrapper = document.getElementById("papers");

    if (!wrapper) return;

    const amount = window.innerWidth < 600 ? 9 : 16;

    for (let index = 0; index < amount; index++) {
        const paper = document.createElement("div");
        const style = paper.style;

        paper.className = "pp";

        style.left = `${Math.random() * 100}%`;

        style.setProperty(
            "--t",
            `${20 + Math.random() * 22}s`
        );

        style.setProperty(
            "--dl",
            `${-Math.random() * 40}s`
        );

        style.setProperty(
            "--dx",
            `${Math.random() * 240 - 120}px`
        );

        style.setProperty(
            "--w",
            `${18 + Math.random() * 26}px`
        );

        style.setProperty(
            "--f",
            `${2.2 + Math.random() * 2.5}s`
        );

        paper.innerHTML = "<i></i>";

        wrapper.appendChild(paper);
    }
})();


/* ========================================
   12. FALLING FEATHERS
======================================== */

(function createFallingFeathers() {
    const ending = document.querySelector(".end");

    if (!ending) return;

    const amount = window.innerWidth < 600 ? 6 : 11;

    for (let index = 0; index < amount; index++) {
        const feather = document.createElement("span");
        const style = feather.style;

        feather.className = "ff";

        style.left = `${Math.random() * 100}%`;

        style.setProperty(
            "--t",
            `${9 + Math.random() * 9}s`
        );

        style.setProperty(
            "--dl",
            `${-Math.random() * 14}s`
        );

        style.setProperty(
            "--s",
            0.6 + Math.random() * 0.7
        );

        feather.innerHTML = `
            <svg viewBox="-10 -40 20 80">
                <path d="M0 -38C8 -20 8 18 0 38C-8 18 -8 -20 0 -38Z"></path>
            </svg>
        `;

        ending.appendChild(feather);
    }
})();


/* ========================================
   13. GENERATE FEATHERED WINGS
======================================== */

function buildWing(key) {
    let seed = 7;

    function random() {
        seed = seed * 16807 % 2147483647;

        return seed / 2147483647;
    }

    const start = [256, 24];
    const end = [70, 64];
    const control = [170, -6];

    function curvePoint(t) {
        const u = 1 - t;

        return [
            u * u * start[0]
                + 2 * u * t * control[0]
                + t * t * end[0],

            u * u * start[1]
                + 2 * u * t * control[1]
                + t * t * end[1]
        ];
    }

    function featherPath(length, width) {
        return `
            M0 0
            C${width} ${length * 0.18}
             ${width * 0.9} ${length * 0.78}
             0 ${length}
            C${-width * 0.9} ${length * 0.78}
             ${-width} ${length * 0.18}
             0 0Z
        `;
    }

    const layers = [
        {
            count: 9,
            minLength: 150,
            maxLength: 290,
            width: 19,
            start: 0.05,
            end: 1,
            fill: `url(#fa${key})`,
            offsetY: 0
        },
        {
            count: 11,
            minLength: 92,
            maxLength: 172,
            width: 17,
            start: 0.02,
            end: 0.95,
            fill: `url(#fb${key})`,
            offsetY: 6
        },
        {
            count: 14,
            minLength: 58,
            maxLength: 102,
            width: 13,
            start: 0,
            end: 0.9,
            fill: "#fff",
            offsetY: 10
        }
    ];

    let output = `
        <defs>
            <linearGradient
                id="fa${key}"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >
                <stop offset="0" stop-color="#e9ebf3"></stop>
                <stop offset="1" stop-color="#9ea4b8"></stop>
            </linearGradient>

            <linearGradient
                id="fb${key}"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >
                <stop offset="0" stop-color="#f7f8fc"></stop>
                <stop offset="1" stop-color="#c3c8d8"></stop>
            </linearGradient>
        </defs>
    `;

    layers.forEach((layer, layerIndex) => {
        for (let index = 0; index < layer.count; index++) {
            const fraction = index / (layer.count - 1);

            const t =
                layer.start
                + (layer.end - layer.start) * fraction;

            const position = curvePoint(t);

            const angle =
                -3 + fraction * 30 + (random() - 0.5) * 4;

            const length =
                (
                    layer.minLength
                    + (layer.maxLength - layer.minLength)
                    * Math.pow(fraction, 1.15)
                )
                * (1 + (random() - 0.5) * 0.06);

            const lag = fraction * 0.45 + layerIndex * 0.1;
            const amplitude = 2 + fraction * 7;

            output += `
                <g
                    transform="
                        translate(
                            ${position[0].toFixed(1)}
                            ${(position[1] + layer.offsetY).toFixed(1)}
                        )
                        rotate(${angle.toFixed(1)})
                    "
                >
                    <g
                        class="fw"
                        style="
                            --lag: ${lag.toFixed(2)}s;
                            --amp: ${amplitude.toFixed(1)}deg;
                        "
                    >
                        <path
                            d="${featherPath(length, layer.width)}"
                            fill="${layer.fill}"
                            stroke="#0b0c12"
                            stroke-opacity=".35"
                            stroke-width=".8"
                        ></path>

                        <path
                            d="M0 4V${(length * 0.85).toFixed(0)}"
                            stroke="#0b0c12"
                            stroke-opacity=".22"
                            stroke-width=".7"
                            fill="none"
                        ></path>
                    </g>
                </g>
            `;
        }
    });

    return output;
}

document.querySelectorAll(".end .wing").forEach((wing, index) => {
    wing.innerHTML = buildWing(index);
});


/* ========================================
   14. REDUCED MOTION ACCESSIBILITY
======================================== */

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".rv").forEach(element => {
        element.classList.add("on");
    });
}