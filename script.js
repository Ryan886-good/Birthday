//   <!-- Include THREE.js library -->

        let scene, camera, renderer, cake, candles = [], candleLights = [];
        let cakeClicked = false;
        let scrollEnabled = false;

        function initCake() {
            // Create scene
            scene = new THREE.Scene();

            // Create camera
            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            // Create renderer
            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById("cake-canvas").appendChild(renderer.domElement);

            // Add lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 10, 10);
            scene.add(directionalLight);

            // Create cake group
            const cakeGroup = new THREE.Group();

            // Bottom layer
            const bottomLayer = new THREE.CylinderGeometry(5, 5, 2, 32);
            const bottomMaterial = new THREE.MeshPhongMaterial({
                color: 0x5c3a6b
            });
            const bottomCake = new THREE.Mesh(bottomLayer, bottomMaterial);
            cakeGroup.add(bottomCake);

            // Middle layer
            const middleLayer = new THREE.CylinderGeometry(4, 4, 2, 32);
            const middleMaterial = new THREE.MeshPhongMaterial({
                color: 0x7d5a9a
            });
            const middleCake = new THREE.Mesh(middleLayer, middleMaterial);
            middleCake.position.y = 2;
            cakeGroup.add(middleCake);

            // Top layer
            const topLayer = new THREE.CylinderGeometry(3, 3, 2, 32);
            const topMaterial = new THREE.MeshPhongMaterial({
                color: 0xa37bc1
            });
            const topCake = new THREE.Mesh(topLayer, topMaterial);
            topCake.position.y = 4;
            cakeGroup.add(topCake);

            // Add frosting and candles
            addFrosting(cakeGroup);
            addCandles(cakeGroup);

            // Add cake to scene
            scene.add(cakeGroup);
            cake = cakeGroup;

            // Position camera
            camera.position.z = 15;
            camera.position.y = 5;

            // Start animation
            animate();

            // Add click event listener
            renderer.domElement.addEventListener("click", handleCakeClick);
        }

        function addFrosting(cakeGroup) {
            // Bottom layer frosting
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const x = Math.cos(angle) * 5;
                const z = Math.sin(angle) * 5;
                const frosting = new THREE.SphereGeometry(0.5, 8, 8);
                const frostingMaterial = new THREE.MeshPhongMaterial({
                    color: 0xd6c1e1
                });
                const frostingMesh = new THREE.Mesh(frosting, frostingMaterial);
                frostingMesh.position.set(x, 0.8, z);
                cakeGroup.add(frostingMesh);
            }

            // Middle layer frosting
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                const x = Math.cos(angle) * 4;
                const z = Math.sin(angle) * 4;
                const frosting = new THREE.SphereGeometry(0.4, 8, 8);
                const frostingMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                });
                const frostingMesh = new THREE.Mesh(frosting, frostingMaterial);
                frostingMesh.position.set(x, 2.8, z);
                cakeGroup.add(frostingMesh);
            }

            // Top layer frosting
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 3;
                const z = Math.sin(angle) * 3;
                const frosting = new THREE.SphereGeometry(0.3, 8, 8);
                const frostingMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                });
                const frostingMesh = new THREE.Mesh(frosting, frostingMaterial);
                frostingMesh.position.set(x, 4.8, z);
                cakeGroup.add(frostingMesh);
            }
        }

        function addCandles(cakeGroup) {
            const positions = [
                { x: 0, y: 5.5, z: 0 },      // Center
                { x: 1.5, y: 5.5, z: 0 },    // Right
                { x: -1.5, y: 5.5, z: 0 },   // Left
                { x: 0, y: 5.5, z: 1.5 },    // Front
                { x: 0, y: 5.5, z: -1.5 }    // Back
            ];

            positions.forEach((pos, index) => {
                // Create candle
                const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
                const candleMaterial = new THREE.MeshPhongMaterial({
                    color: 0xcca6ff
                });
                const candle = new THREE.Mesh(candleGeometry, candleMaterial);
                candle.position.set(pos.x, pos.y, pos.z);
                cakeGroup.add(candle);
                candles.push(candle);

                // Create candle light
                const candleLight = new THREE.PointLight(0xffcc00, 1, 3);
                candleLight.position.set(pos.x, pos.y + 0.7, pos.z);
                cakeGroup.add(candleLight);
                candleLights.push(candleLight);

                // Create flame
                const flameGeometry = new THREE.ConeGeometry(0.15, 0.4, 16);
                const flameMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffaa33,
                    emissive: 0xffaa33,
                    transparent: true,
                    opacity: 0.9
                });
                const flame = new THREE.Mesh(flameGeometry, flameMaterial);
                flame.position.set(pos.x, pos.y + 0.7, pos.z);
                cakeGroup.add(flame);
                candles.push(flame);
            });
        }

        function animate() {
            requestAnimationFrame(animate);

            // Animate candles
            candles.forEach((obj, index) => {
                if (index % 2 === 1 && !cakeClicked) {
                    obj.rotation.y += 0.05;
                    obj.position.y += Math.sin(Date.now() * 0.01) * 0.001;
                }
            });

            // Rotate cake if clicked
            if (cakeClicked) {
                cake.rotation.y += 0.03;
            }

            renderer.render(scene, camera);
        }

        function handleCakeClick() {
            if (!cakeClicked) {
                cakeClicked = true;
                document.getElementById("instructions").style.display = "none";

                // Hide flames
                candles.forEach((obj, index) => {
                    if (index % 2 === 1) {
                        obj.visible = false;
                    }
                });

                // Turn off lights
                candleLights.forEach((light) => {
                     light.intensity = 0;
                });

                // Show confetti
                document.getElementById("confetti-canvas").style.display = "none";
                createConfetti();

                // Enable scrolling
                scrollEnabled = true;

                // Show scroll instruction
                setTimeout(() => {
                    document.getElementById("scroll-instruction").style.display = "block";
                }, 1000);
            }
        }

        function createConfetti() {
            const canvas = document.getElementById("confetti-canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const confettiCount = 200;
            const confettiColors = [
                "#ff4081", "#ff9e80", "#ffff8d", "#b9f6ca",
                "#80d8ff", "#8c9eff", "#ea80fc"
            ];

            const confetti = [];

            for (let i = 0; i < confettiCount; i++) {
                confetti.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 2 - canvas.height,
                    size: Math.random() * 5 + 5,
                    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                    speed: Math.random() * 3 + 2,
                    angle: Math.random() * 360,
                    rotation: 0,
                    rotationSpeed: Math.random() * 10 - 5
                });
            }

            function drawConfetti() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let stillActive = false;

                confetti.forEach((c) => {
                    if (c.y < canvas.height) {
                        stillActive = true;
                        ctx.save();
                        ctx.translate(c.x, c.y);
                        ctx.rotate((c.rotation * Math.PI) / 180);
                        ctx.fillStyle = c.color;
                        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
                        ctx.restore();
                        c.y += c.speed;
                        c.rotation += c.rotationSpeed;
                    }
                });

                if (stillActive) {
                    requestAnimationFrame(drawConfetti);
                } else {
                    canvas.style.display = "none";
                }
            }

            drawConfetti();
        }

        // Handle window resize
        window.addEventListener("resize", () => {
            if (camera && renderer) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        // Handle scrolling
        window.addEventListener("scroll", function () {
            if (!scrollEnabled) {
                window.scrollTo(0, 0);
                return;
            }

            const scrollPosition = window.scrollY || document.documentElement.scrollTop;

            if (scrollPosition > 100) {
                document.getElementById("cake-canvas").style.transform = "translate(-40%, 0) scale(0.5)";
                document.getElementById("letter").style.right = "10%";
                document.getElementById("scroll-instruction").style.display = "none";
            } else {
                document.getElementById("cake-canvas").style.transform = "translate(0, 0) scale(1)";
                document.getElementById("letter").style.right = "-100%";
                if (cakeClicked) {
                    document.getElementById("scroll-instruction").style.display = "block";
                }
            }
        });

        // Initialize on window load
        window.onload = function () {
            initCake();
        };
