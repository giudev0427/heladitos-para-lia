# 🍦 Heladitos para Lia — Una invitación dulce

Una experiencia web **romántica, inmersiva e interactiva**: un pequeño cuento
de helados, hecho a mano, para invitar a **Lia** a comer heladito.

No es una plantilla: es una historia breve con introducción cinematográfica,
ilustraciones SVG propias, un fondo vivo, una galería fotográfica y un flujo
interactivo cuidadoso, pensado para sorprender a quien lo abra por primera vez.

---

## ✨ ¿Qué es?

Una página **estática** (un solo `index.html` + CSS y JS) que funciona sin
servidor, sin backend y sin base de datos. Todo ocurre en el navegador.

- Sitio 100% estático → ideal para **GitHub Pages**.
- Sin procesos de compilación ni dependencias que instalar.
- Nada de datos personales se envía ni se guarda en ningún servidor: la fecha
  y la hora que se eligen viven solo en la pantalla del visitante.

---

## 🎬 La idea visual y el flujo interactivo

**Dirección artística:** fantasía romántica y sofisticada, con rosa pastel,
rosa fresa, crema, lavanda, blanco perlado y chocolate. Fondos degradados con
profundidad, estrellas diminutas, polvo brillante, partículas flotantes,
transparencias, tarjetas *glassmorphism* y una tipografía elegante
(Cormorant Garamond + Dancing Script + Quicksand).

**Recorrido de la experiencia:**

1. **Introducción cinematográfica** — pantalla completa con un cielo oscuro de
   tonos rosa, morado y chocolate, estrellas y una copa de helado con tres bolas
   (fresa, vainilla y chocolate) dibujada en SVG, con fresa, toppings, cuchara y
   destellos. Al tocar / pulsar Enter o Espacio, la copa hace zoom, las estrellas
   se iluminan y la pantalla se desvanece hacia la invitación.
2. **Fondo vivo** — helados (conos, copas, polos, fresas), corazones, estrellas
   y chispitas flotan con posiciones, tamaños, velocidades y retrasos distintos.
   Todos son decorativos (`pointer-events: none`) y no bloquean los botones.
3. **La invitación** — tarjeta central con el encabezado, el título, la pregunta
   y el mensaje, más dos botones grandes: **«SÍ, VAMOS 💗»** y **«NO, GRACIAS 🙈»**.
4. **El botón NO, juguetón** — en escritorio se aparta suavemente cuando el cursor
   se acerca y va cambiando de texto. Se puede elegir de verdad: tras unos cuantos
   movimientos se queda quieto, y con **teclado** (Enter/Espacio) se elige al
   instante. Nada de movimientos imposibles.
5. **Si elige NO** — una pantalla delicada con un botón para **volver** a la
   invitación.
6. **Si elige SÍ** — celebración con confeti delicado, corazones que suben,
   estrellas doradas y destellos, seguida de una confirmación divertida:
   *«¿Estás 100% segura de que quieres decir que sí? 🥹🍦»*.
7. **Pantalla final** — una composición distinta y aún más bonita, con la fecha y
   la hora **opcionales**, una confirmación elegante y un botón para modificarlas.
8. **Galería y extras** — cuatro tarjetas fotográficas con frase, la sección
   *«El plan perfecto»*, frases que aparecen suavemente, un contador de chispitas
   que crece al tocar el fondo, un indicador de scroll, un botón para volver
   arriba, música **opcional** (nunca automática) y un pie de página minimalista.

---

## 🧰 Tecnologías

- **HTML5** semántico y accesible.
- **CSS3** a medida (degradados, *glassmorphism*, animaciones, partículas CSS).
- **JavaScript vanilla** (sin frameworks, sin build).
- **SVG** para las ilustraciones (copa de helado, cono, copa, polo, fresa,
  corazón y estrella) — creadas para este proyecto.
- **Canvas 2D** para el confeti, los corazones y las chispitas.
- **Web Audio API** para una melodía suave **opcional** (solo si se activa a mano).
- **Google Fonts** para la tipografía.

> **Sobre Tailwind CSS:** se evaluó su uso mediante CDN, pero este diseño se
> construyó con CSS propio para tener control total de la dirección artística.
> En el CDN de Tailwind, su *Preflight* puede reescribir estilos base y además
> imprime un aviso en consola ("should not be used in production"). Para
> mantener la página limpia, sin avisos y autocontenida, no se incluye. Si lo
> quieres, puedes añadirlo con una línea en el `<head>`:
> `<script src="https://cdn.tailwindcss.com"></script>`.

---

## 📁 Estructura de archivos

```
heladitos-para-lia/
├── index.html            # Toda la estructura y las ilustraciones SVG
├── README.md             # Este archivo
├── .nojekyll             # Evita el procesado de Jekyll en GitHub Pages
└── assets/
    ├── css/
    │   └── styles.css    # Estilos, animaciones y diseño responsive
    └── js/
        └── main.js       # Interacciones, partículas, confeti y flujo
```

---

## 🖼️ Fuentes de las imágenes

Las cuatro fotografías de la galería provienen de **Pexels** (licencia gratuita
para uso personal y comercial, sin atribución obligatoria). Cada tarjeta tiene
texto alternativo y un **fondo decorativo de reserva** (con su emoji) por si la
imagen no cargara.

| Tarjeta | Descripción | Fuente |
|---|---|---|
| Fresa | Primer plano de helado de fresa | Pexels — foto `5535554` |
| Chocolate | Copa de helado de chocolate con barquillos | Pexels — foto `38371324` |
| Vainilla | Copa de vainilla con sirope y virutas | Pexels — foto `30648974` |
| Con toppings | Copa con toppings de colores y sirope | Pexels — foto `16560455` |

Las ilustraciones de helados de la introducción, el fondo y el plan son **SVG
originales** incluidos dentro de `index.html` (no son imágenes externas).

Autoría de las fotos: se atribuye a **Pexels** y a sus autores. Para consultar
la licencia: <https://www.pexels.com/license/>.

---

## 🚀 Cómo abrir la página en local

No hace falta servidor. Solo tienes que abrir el archivo:

1. Descarga o clona el repositorio.
2. Haz doble clic en **`index.html`** (o arrástralo a tu navegador).

Opcionalmente, si prefieres servirlo (recomendado para que todo cargue igual que
en GitHub Pages):

```bash
# con Python 3
python -m http.server 8000
# luego abre http://localhost:8000

# o con Node (si lo tienes)
npx serve .
```

---

## 🌐 Cómo activar GitHub Pages

1. Entra en el repositorio: `https://github.com/giudev0427/heladitos-para-lia`.
2. Ve a **Settings → Pages**.
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. Selecciona la rama **`main`** y la carpeta **`/(root)`**.
5. Pulsa **Save**.
6. En un par de minutos la web estará en:
   `https://giudev0427.github.io/heladitos-para-lia/`

---

## 🔄 Cómo actualizar la web en el futuro

1. Edita los archivos que quieras:
   - `index.html` → textos, estructura, ilustraciones SVG.
   - `assets/css/styles.css` → colores, tipografía, animaciones.
   - `assets/js/main.js` → comportamiento e interacciones.
2. Guarda y sube los cambios:

```bash
git add .
git commit -m "Describe aquí tu cambio"
git push
```

GitHub Pages publicará la nueva versión automáticamente en la misma dirección.

### 🎵 Añadir una canción (opcional)

La sección de música está **preparada pero vacía** (no se inventó ningún enlace).
Para añadir una canción real, en `index.html` sustituye el contenido del
`<div id="musicSlot">` por tu reproductor (por ejemplo, un `<iframe>` de Spotify):
no se reproducirá nada hasta que la persona lo pulse.

---

## ♿ Accesibilidad y rendimiento

- Botones y enlaces operables con **ratón, teclado y pantalla táctil**.
- **El botón NO siempre se puede elegir** (se detiene y responde al teclado).
- Se respeta **`prefers-reduced-motion`**: se desactivan animaciones y se reducen
  las partículas.
- Imágenes con **texto alternativo** y respaldo visual.
- Diseño **responsive** de **320 px** a pantallas grandes, sin desbordes
  horizontales.
- La introducción **nunca bloquea** la página (se puede saltar y hay un cierre
  automático de seguridad).
- Sin errores en consola.

---

## 🙏 Créditos

- **Autor:** Giu
- **Contacto:** giudev0427@gmail.com
- **Hecho con cariño por Giu 💗**

Este proyecto no incluye contraseñas, tokens ni información privada.
