# 🍦 Un plan dulce para Lia — Una invitación

Una experiencia web **romántica, dulce, elegante y espontánea**: un detalle
digital preparado a mano para invitar a **Lia** a comer unos heladitos **este
jueves**. Sin preguntas de sí o no, sin botones que se escapan: solo una
invitación bonita, sincera y fácil de responder.

No es una plantilla: es una historia breve con entrada cinematográfica,
ilustraciones SVG propias, un fondo vivo, una galería fotográfica y un cierre
interactivo cuidadoso, pensado para sorprender a quien lo abra por primera vez.

---

## ✨ ¿Qué es?

Una página **estática** (un solo `index.html` + CSS y JS) que funciona sin
servidor, sin backend y sin base de datos. Todo ocurre en el navegador.

- Sitio 100% estático → ideal para **GitHub Pages**.
- Sin procesos de compilación ni dependencias que instalar.
- Nada de datos personales se envía ni se guarda en ningún servidor: la hora que
  Lia elija (si la elige) vive solo en la pantalla de su dispositivo.

---

## 🎬 La idea visual y el flujo interactivo

**Dirección artística:** fantasía romántica con fondo de ensueño en rosa, crema,
lavanda y chocolate. Fondos degradados con profundidad, estrellas diminutas,
polvo brillante, partículas flotantes, fresas y corazones, transparencias,
tarjetas *glassmorphism* y tipografía elegante (Cormorant Garamond +
Dancing Script + Quicksand). La protagonista es una **copa de helado de fresa,
vainilla y chocolate** dibujada en SVG.

**Recorrido de la experiencia:**

1. **Entrada cinematográfica** — pantalla completa con un cielo oscuro en tonos
   rosa, morado y chocolate, estrellas y la copa de tres bolas con fresa,
   toppings y destellos. Aparece el mensaje
   **«Lia, tengo un plan dulce para ti...»** y el botón
   **«Descubrir mi invitación 🍓»**. Al pulsarlo (o tocar la pantalla), la copa
   hace zoom, las estrellas se iluminan y todo se desvanece hacia la invitación.
2. **Fondo vivo** — helados (conos, copas, polos, fresas), corazones y estrellas
   brillantes flotan con posiciones, tamaños, velocidades y retrasos distintos.
   Todos son decorativos (`pointer-events: none`) y no bloquean los botones.
3. **La invitación** — tarjeta central con el encabezado
   *«Un pequeño plan para ti, Lia 🍓🍦»*, el texto principal (la invitación del
   jueves) y una **frase destacada** en un marco luminoso:
   *«Este jueves, tú pones la hora y yo te invito los helados. 🍦💗»*.
4. **Dos respuestas, ninguna obligatoria** — un botón principal
   **«🍦 ¡Me encantaría!»** y una opción discreta
   **«Te confirmo después 💌»**. No hay botones de rechazo, ni botones que se
   escapan: responder es libre y siempre se puede volver atrás.
5. **Si pulsa «¡Me encantaría!»** — una celebración delicada (corazones y
   destellos que suben) y un mensaje bonito:
   *«¡Qué bonito! 💗 Entonces queda pendiente nuestro heladito de este jueves.
   Tú dime a qué hora te viene bien y nos organizamos. 🍓✨»*, con un **campo de
   hora totalmente opcional**. No se inventa ninguna hora: el campo empieza
   vacío y solo confirma si Lia decide rellenarlo.
6. **Si pulsa «Te confirmo después 💌»** — un mensaje tranquilo y sin presión:
   *«Claro, Lia 💗. Me dices cuando puedas y coordinamos la hora.»*
7. **Galería y extras** — cuatro tarjetas fotográficas con frase (fresa,
   chocolate, vainilla y toppings), la sección *«Así me imagino nuestro jueves»*,
   frases que aparecen suavemente, un contador de chispitas que crece al tocar el
   fondo, un indicador de scroll, un botón para volver arriba, música
   **opcional** (nunca automática) y un pie de página minimalista.

---

## 🧰 Tecnologías

- **HTML5** semántico y accesible.
- **CSS3** a medida (degradados, *glassmorphism*, animaciones, partículas CSS).
- **JavaScript vanilla** (sin frameworks, sin build).
- **Tailwind CSS** vía **CDN** (`https://cdn.tailwindcss.com`).
- **SVG** para las ilustraciones (copa de helado, cono, copa, polo, fresa,
  corazón y estrella) — creadas para este proyecto.
- **Canvas 2D** para la celebración, los corazones y las chispitas.
- **Web Audio API** para una melodía suave **opcional** (solo si se activa a mano).
- **Google Fonts** para la tipografía.

> **Sobre Tailwind CSS:** se incluye por CDN, como pediste, pero con
> `corePlugins.preflight = false` para que su *Preflight* **no** reescriba los
> estilos base del proyecto (el diseño se controla al 100% desde `styles.css`).
> El CDN de Tailwind muestra un aviso informativo en consola del propio Tailwind
> ("should not be used in production"); no es un error del sitio. Para uso en
> producción, la recomendación oficial es compilar Tailwind.

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
        └── main.js       # Interacciones, partículas y flujo de respuesta
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

Las ilustraciones de helados de la entrada, el fondo y el plan son **SVG
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
- Las dos respuestas de la invitación son **libres y reversibles**: se puede
  cerrar cualquier mensaje con el botón *Volver* o la tecla **Escape**.
- El **campo de hora es opcional** y nunca bloquea la respuesta.
- Se respeta **`prefers-reduced-motion`**: se desactivan animaciones y se reducen
  las partículas.
- Imágenes con **texto alternativo** y respaldo visual.
- Diseño **responsive** de **320 px** a pantallas grandes, sin desbordes
  horizontales.
- La entrada **nunca bloquea** la página (cierre automático de seguridad si no se
  interactúa).
- Sin errores (ni excepciones) en consola.

---

## 🙏 Créditos

- **Autor:** Giu
- **Contacto:** giudev0427@gmail.com
- **Hecho con cariño por Giu 💗**

Este proyecto no incluye contraseñas, tokens ni información privada.
