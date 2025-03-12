let juegos = [];
let noticias = [];

Promise.all([
    fetch('/jesalstore/data/juegos.json')
        .then(res => {
            if (!res.ok) throw new Error(`Error al cargar juegos: ${res.status}`);
            return res.json();
        }),
    fetch('/jesalstore/data/noticias.json')
        .then(res => {
            if (!res.ok) throw new Error(`Error al cargar noticias: ${res.status}`);
            return res.json();
        })
])
.then(([juegosData, noticiasData]) => {
    juegos = juegosData;
    noticias = noticiasData;

    console.log("✅ Juegos cargados:", juegos);
    console.log("✅ Noticias cargadas:", noticias);

    cargarContenidoInicio();
    cargarContenidoNoticias();
    mostrarSeccion('homeSection');
})
.catch(error => console.error("❌ Error al cargar datos:", error));















        let lastSection = 'homeSection';

        function cargarContenidoInicio() {
            const bannerSlides = document.getElementById('bannerSlides');
            bannerSlides.innerHTML = '';
            juegos.filter(juego => juego.enBanner).slice(0, 5).forEach(juego => {
                const slide = document.createElement('div');
                slide.className = 'banner-slide';
                slide.innerHTML = `
                    <img src="${juego.imagenBanner}" alt="${juego.nombre}">
                    <h3>${juego.nombre}</h3>
                `;
                bannerSlides.appendChild(slide);
            });

            cargarSeccion('featuredGames', juegos.filter(juego => juego.destacado));
            cargarSeccion('newGames', juegos.filter(juego => juego.nuevo));
            cargarSeccion('popularGames', juegos.filter(juego => juego.popular));
            cargarSeccionNoticiasInicio('news', noticias);
            document.getElementById('ads').innerHTML = '';

            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            let currentSlide = 0;
            const totalSlides = bannerSlides.children.length;

            function updateBanner() {
                bannerSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
            }

            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateBanner();
            });

            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateBanner();
            });

            setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateBanner();
            }, 5000);
        }

        function cargarSeccion(sectionId, juegosFiltrados) {
            const section = document.getElementById(sectionId);
            section.innerHTML = '';
            juegosFiltrados.forEach(juego => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${juego.imagenTarjeta}" alt="${juego.nombre}">
                    <h3>${juego.nombre}</h3>
                    <p>${juego.descripcion}</p>
                    ${juego.nuevo ? '<span class="nuevo-tag">Nuevo</span>' : ''}
                `;
                card.addEventListener('click', () => mostrarDetallesJuego(juego));
                section.appendChild(card);
            });
        }

        function cargarSeccionNoticiasInicio(sectionId, noticiasFiltradas) {
            const section = document.getElementById(sectionId);
            section.innerHTML = '';
            noticiasFiltradas.forEach(noticia => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${noticia.imagen}" alt="${noticia.titulo}">
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.textoCorto}</p>
                `;
                card.addEventListener('click', () => mostrarSeccion('noticiasSection'));
                section.appendChild(card);
            });
        }

        function cargarContenidoCategorias() {
            filtrarJuegos('all');
        }

        function cargarContenidoNoticias() {
            const noticiasGrid = document.getElementById('noticiasGrid');
            noticiasGrid.innerHTML = '';
            noticias.forEach(noticia => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${noticia.imagen}" alt="${noticia.titulo}">
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.textoCorto}</p>
                `;
                card.addEventListener('click', () => mostrarDetallesNoticia(noticia));
                noticiasGrid.appendChild(card);
            });
        }

        function mostrarDetallesJuego(juego) {
            const sections = ['homeSection', 'gamesSection', 'noticiasSection', 'videosSection', 'nosotrosSection', 'gameDetailsSection'];
            lastSection = sections.find(id => document.getElementById(id).style.display === 'block') || 'homeSection';
            sections.forEach(id => document.getElementById(id).style.display = id === 'gameDetailsSection' ? 'block' : 'none');

            const gameDetailsSection = document.getElementById('gameDetailsSection');
            gameDetailsSection.innerHTML = `
                <div class="game-details-header">
                    <img src="${juego.imagenTarjeta}" alt="${juego.nombre}">
                    <div class="game-details-info">
                        <h2>${juego.nombre}</h2>
                        <p><strong>Desarrollador:</strong> ${juego.desarrollador}</p>
                        <p><strong>Lanzamiento:</strong> ${juego.lanzamiento}</p>
                        <p><strong>Versión:</strong> ${juego.version}</p>
                        <p><strong>Categoría:</strong> ${juego.categoria}</p>
                    </div>
                </div>
                <div class="game-details-images">
                    <h3>Imágenes</h3>
                    <div class="game-details-images-grid">
                        ${juego.imagenes.map(img => `<img src="${img}" alt="${juego.nombre} imagen">`).join('')}
                    </div>
                </div>
                <div class="game-details-description">
                    <h3>Descripción</h3>
                    <p>${juego.descripcionCompleta}</p>
                </div>
                <button class="download-btn" onclick="window.location.href='${juego.linkDescarga}'">Descargar Ahora</button>
                <button class="close-btn" onclick="cerrarDetallesJuego()">Atrás</button>
            `;
        }

        function mostrarDetallesNoticia(noticia) {
            const sections = ['homeSection', 'gamesSection', 'noticiasSection', 'videosSection', 'nosotrosSection', 'gameDetailsSection'];
            lastSection = sections.find(id => document.getElementById(id).style.display === 'block') || 'noticiasSection';
            sections.forEach(id => document.getElementById(id).style.display = id === 'gameDetailsSection' ? 'block' : 'none');

            const gameDetailsSection = document.getElementById('gameDetailsSection');
            gameDetailsSection.innerHTML = `
                <div class="game-details-header">
                    <div class="game-details-info">
                        <h2>${noticia.titulo}</h2>
                        <p><strong>Fecha:</strong> ${noticia.fecha}</p>
                    </div>
                </div>
                <div class="game-details-description">
                    <h3>Detalles</h3>
                    <p>${noticia.textoCompleto}</p>
                </div>
                <img src="${noticia.imagen}" alt="${noticia.titulo}" class="noticia-imagen-grande">
                <button class="close-btn" onclick="cerrarDetallesJuego()">Atrás</button>
            `;
        }

        function cerrarDetallesJuego() {
            mostrarSeccion(lastSection);
        }

        function filtrarJuegos(categoria, terminoBusqueda = '') {
            const gamesGrid = document.getElementById('gamesGrid');
            gamesGrid.innerHTML = '';
            let juegosFiltrados = categoria === 'all' ? juegos : juegos.filter(juego => juego.categoria === categoria);

            if (terminoBusqueda) {
                juegosFiltrados = juegosFiltrados.filter(juego => 
                    juego.nombre.toLowerCase().includes(terminoBusqueda) ||
                    juego.descripcion.toLowerCase().includes(terminoBusqueda) ||
                    juego.categoria.toLowerCase().includes(terminoBusqueda)
                );
            }

            juegosFiltrados.forEach(juego => {
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';
                gameCard.innerHTML = `
                    <img src="${juego.imagenTarjeta}" alt="${juego.nombre}">
                    <h3>${juego.nombre}</h3>
                    <p>${juego.descripcion}</p>
                    ${juego.nuevo ? '<span class="nuevo-tag">Nuevo</span>' : ''}
                    <button onclick="window.location.href='${juego.linkDescarga}'">Descargar</button>
                `;
                gameCard.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'BUTTON') mostrarDetallesJuego(juego);
                });
                gamesGrid.appendChild(gameCard);
            });
        }

        const sections = {
            homeSection: cargarContenidoInicio,
            gamesSection: cargarContenidoCategorias,
            noticiasSection: cargarContenidoNoticias,
            videosSection: () => {},
            nosotrosSection: () => {},
            gameDetailsSection: () => {}
        };

        function mostrarSeccion(seccionId) {
            Object.keys(sections).forEach(id => {
                document.getElementById(id).style.display = id === seccionId ? 'block' : 'none';
            });
            if (sections[seccionId]) sections[seccionId]();
        }

        document.getElementById('homeLink').addEventListener('click', (e) => { e.preventDefault(); mostrarSeccion('homeSection'); });
        document.getElementById('categoriesLink').addEventListener('click', (e) => { e.preventDefault(); mostrarSeccion('gamesSection'); });
        document.getElementById('noticiasLink').addEventListener('click', (e) => { e.preventDefault(); mostrarSeccion('noticiasSection'); });
        document.getElementById('videosLink').addEventListener('click', (e) => { e.preventDefault(); mostrarSeccion('videosSection'); });
        document.getElementById('nosotrosLink').addEventListener('click', (e) => { e.preventDefault(); mostrarSeccion('nosotrosSection'); });
        document.getElementById('exploreMore').addEventListener('click', () => mostrarSeccion('gamesSection'));

        document.getElementById('searchInput').addEventListener('input', function() {
            const terminoBusqueda = this.value.toLowerCase();
            const categoriaActiva = document.querySelector('.category-btn.active').dataset.category;
            filtrarJuegos(categoriaActiva, terminoBusqueda);
        });

        document.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const categoria = this.dataset.category;
                const terminoBusqueda = document.getElementById('searchInput').value.toLowerCase();
                filtrarJuegos(categoria, terminoBusqueda);
            });
        });

        document.getElementById('gameSearch').addEventListener('input', function() {
            const terminoBusqueda = this.value.toLowerCase();
            const currentSection = Object.keys(sections).find(id => document.getElementById(id).style.display === 'block');

            if (currentSection === 'homeSection') {
                cargarSeccion('featuredGames', juegos.filter(juego => juego.destacado && (
                    juego.nombre.toLowerCase().includes(terminoBusqueda) ||
                    juego.descripcion.toLowerCase().includes(terminoBusqueda)
                )));
                cargarSeccion('newGames', juegos.filter(juego => juego.nuevo && (
                    juego.nombre.toLowerCase().includes(terminoBusqueda) ||
                    juego.descripcion.toLowerCase().includes(terminoBusqueda)
                )));
                cargarSeccion('popularGames', juegos.filter(juego => juego.popular && (
                    juego.nombre.toLowerCase().includes(terminoBusqueda) ||
                    juego.descripcion.toLowerCase().includes(terminoBusqueda)
                )));
                cargarSeccionNoticiasInicio('news', noticias.filter(noticia => (
                    noticia.titulo.toLowerCase().includes(terminoBusqueda) ||
                    noticia.textoCorto.toLowerCase().includes(terminoBusqueda)
                )));
                document.getElementById('ads').innerHTML = '';
            } else if (currentSection === 'gamesSection') {
                const categoriaActiva = document.querySelector('.category-btn.active').dataset.category;
                filtrarJuegos(categoriaActiva, terminoBusqueda);
            } else if (currentSection === 'noticiasSection') {
                const noticiasGrid = document.getElementById('noticiasGrid');
                noticiasGrid.innerHTML = '';
                noticias.filter(noticia => (
                    noticia.titulo.toLowerCase().includes(terminoBusqueda) ||
                    noticia.textoCorto.toLowerCase().includes(terminoBusqueda)
                )).forEach(noticia => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${noticia.imagen}" alt="${noticia.titulo}">
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.textoCorto}</p>
                    `;
                    card.addEventListener('click', () => mostrarDetallesNoticia(noticia));
                    noticiasGrid.appendChild(card);
                });
            }

            if (!terminoBusqueda) {
                if (currentSection === 'homeSection') cargarContenidoInicio();
                else if (currentSection === 'gamesSection') filtrarJuegos(document.querySelector('.category-btn.active').dataset.category);
                else if (currentSection === 'noticiasSection') cargarContenidoNoticias();
            }
        });

        const videoPlayer = document.getElementById('videoPlayer').querySelector('iframe');
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', function() {
                const videoId = this.dataset.videoId;
                videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            });
        });

        cargarContenidoInicio();
        mostrarSeccion('homeSection');