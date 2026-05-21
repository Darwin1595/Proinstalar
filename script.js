// ============================================
// PRODUCTOS
// ============================================
const productos = [
  { id: 1, nombre: 'Taladro Inalámbrico',       desc: '20V con set de brocas incluido',           precio: 180000, cat: 'Herramientas', icono: 'imagenes/herramienta.png' },
  { id: 2, nombre: 'Juego de Destornilladores', desc: 'Set de 12 piezas con mango ergonómico',    precio: 45000,  cat: 'Herramientas', icono: 'imagenes/herramienta1.png' },
  { id: 3, nombre: 'Nivel Digital',             desc: 'Medición precisa con pantalla LED',         precio: 62000,  cat: 'Herramientas', icono: 'imagenes/herramienta2.png' },
  { id: 4, nombre: 'Pintura Vinílica Blanca',   desc: 'Cubeta de 4 litros, acabado mate',          precio: 95000,  cat: 'Pinturas',     icono: 'imagenes/pintura.png' },
  { id: 5, nombre: 'Pintura Esmalte Rojo',      desc: '1 galón, secado rápido',                   precio: 38000,  cat: 'Pinturas',     icono: 'imagenes/pintura1.png' },
  { id: 6, nombre: 'Rodillo y Bandeja',          desc: 'Kit completo para pintura',                precio: 25000,  cat: 'Pinturas',     icono: 'imagenes/pintura2.png' },
  { id: 7, nombre: 'Cilindro Gas 10kg',          desc: 'Cilindro vacío con válvula de seguridad',  precio: 120000, cat: 'Gas',          icono: 'imagenes/gas.png' },
  { id: 8, nombre: 'Manguera para Gas',          desc: '2 metros, certificada y flexible',          precio: 28000,  cat: 'Gas',          icono: 'imagenes/gas1.png' },
  { id: 9, nombre: 'Regulador de Gas',           desc: 'Universal con manómetro integrado',        precio: 55000,  cat: 'Gas',          icono: 'imagenes/gas.png' },
];

let carrito = [];
let filtroActual = 'Todos';

// ============================================
// CATÁLOGO - RENDER Y FILTROS
// ============================================
function renderProductos() {
  const buscar = document.getElementById('buscar-input').value.toLowerCase();
  const grid = document.getElementById('productos-grid');

  const filtrados = productos.filter(p => {
    const matchCat    = filtroActual === 'Todos' || p.cat === filtroActual;
    const matchBuscar = p.nombre.toLowerCase().includes(buscar) || p.desc.toLowerCase().includes(buscar);
    return matchCat && matchBuscar;
  });

  grid.innerHTML = filtrados.map(p => `
    <div class="prod-card">
      <div class="prod-img">
  <img src="${p.icono}" alt="${p.nombre}" class="img-producto">
</div>
      <div class="prod-info">
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        <div class="prod-precio">$${p.precio.toLocaleString('es-CO')}</div>
        <button class="btn-agregar" onclick="agregarAlCarrito(${p.id})">+ Agregar al carrito</button>
      </div>
    </div>
  `).join('');
}

function setFiltro(cat, btn) {
  filtroActual = cat;
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
  renderProductos();
}

function filtrarProductos() {
  renderProductos();
}

function filtrarYIr(cat) {
  filtroActual = cat;
  showPage('catalogo');
  document.querySelectorAll('.filtro-btn').forEach(b => {
    b.classList.toggle('activo', b.textContent.trim().includes(cat));
  });
}

// ============================================
// CARRITO
// ============================================
function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const existente = carrito.find(i => i.id === id);

  if (existente) {
    existente.qty++;
  } else {
    carrito.push({ ...prod, qty: 1 });
  }

  actualizarCarrito();
  mostrarToast(`✅ ${prod.nombre} agregado al carrito`, 'success');
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(i => i.id !== id);
  actualizarCarrito();
}

function actualizarCarrito() {
  const total = carrito.reduce((s, i) => s + i.precio * i.qty, 0);
  const count = carrito.reduce((s, i) => s + i.qty, 0);

  document.getElementById('carrito-count').textContent = count;

  const itemsEl   = document.getElementById('carrito-items');
  const resumenEl = document.getElementById('carrito-resumen');

  if (carrito.length === 0) {
    itemsEl.innerHTML   = '<div class="carrito-vacio">Tu carrito está vacío 🛒</div>';
    resumenEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = carrito.map(i => `
    <div class="carrito-item">
      <div class="carrito-item-icon">${i.icono}</div>
      <div class="carrito-item-info">
        <h4>${i.nombre}</h4>
        <span>x${i.qty} — $${(i.precio * i.qty).toLocaleString('es-CO')}</span>
      </div>
      <button class="btn-eliminar" onclick="eliminarDelCarrito(${i.id})">✕</button>
    </div>
  `).join('');

  const envio      = total >= 200000 ? 0 : 20000;
  const totalFinal = total + envio;

  const envioHtml = envio === 0
    ? '<div class="envio-gratis-badge">🎉 ¡Envío GRATIS por compras mayores a $200.000!</div>'
    : `<div class="resumen-fila envio"><span>Envío</span><span>$${envio.toLocaleString('es-CO')}</span></div>
       <div style="font-size:0.78rem;color:#999;margin-bottom:6px;">Envío gratis en pedidos mayores a $200.000</div>`;

  resumenEl.innerHTML = `
    <div class="carrito-resumen">
      <div class="resumen-fila"><span>Subtotal</span><span>$${total.toLocaleString('es-CO')}</span></div>
      ${envioHtml}
      <div class="resumen-fila total"><span>Total</span><span>$${totalFinal.toLocaleString('es-CO')}</span></div>
      <button class="btn-pedir" onclick="pedirPorWhatsApp()">📲 Pedir por WhatsApp</button>
    </div>
  `;
}

function pedirPorWhatsApp() {
  const items = carrito.map(i => `• ${i.nombre} x${i.qty}: $${(i.precio * i.qty).toLocaleString('es-CO')}`).join('\n');
  const total = carrito.reduce((s, i) => s + i.precio * i.qty, 0);
  const envio = total >= 200000 ? 0 : 20000;

  const msg = encodeURIComponent(
    `Hola Proinstalar, quiero hacer un pedido:\n\n${items}\n\nSubtotal: $${total.toLocaleString('es-CO')}\nEnvío: $${envio.toLocaleString('es-CO')}\nTotal: $${(total + envio).toLocaleString('es-CO')}`
  );
  window.open(`https://wa.me/573223501454?text=${msg}`, '_blank');
}

function toggleCarrito() {
  document.getElementById('carrito-overlay').classList.toggle('open');
}

function cerrarCarritoFuera(e) {
  if (e.target === document.getElementById('carrito-overlay')) {
    toggleCarrito();
  }
}

// ============================================
// NAVEGACIÓN
// ============================================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');

  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  window.scrollTo(0, 0);

  if (id === 'catalogo') renderProductos();
}

function scrollToForm() {
  showPage('servicios');
  setTimeout(() => {
    document.getElementById('form-servicio').scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// ============================================
// FORMULARIO SERVICIO DE GAS
// ============================================
function enviarSolicitudGas() {
  const nombre = document.getElementById('gas-nombre').value.trim();
  const tel    = document.getElementById('gas-tel').value.trim();
  const dir    = document.getElementById('gas-dir').value.trim();
  const tipo   = document.getElementById('gas-tipo').value;

  // Validación estricta antes de proceder
  if (!nombre || !tel || !dir || !tipo) {
    mostrarToast('⚠️ Por favor completa todos los campos obligatorios', 'error');
    return; // Detiene la función aquí si falta algo
  }

  const comentarios = document.getElementById('gas-comentarios').value.trim();
  const asunto = encodeURIComponent('Nueva solicitud de servicio - Proinstalar');
  const cuerpo = encodeURIComponent(
    `Nueva solicitud de servicio de gas:\n\nNombre: ${nombre}\nTeléfono: ${tel}\nDirección: ${dir}\nTipo de servicio: ${tipo}\nComentarios: ${comentarios || 'Ninguno'}`
  );

  // Abre el gestor de correo del cliente
  window.location.href = `mailto:izquierdodarwin581@gmail.com?subject=${asunto}&body=${cuerpo}`;

  // Muestra el modal de confirmación exitosa en pantalla
  document.getElementById('modal-exito').classList.add('open');

  // Limpiar campos del formulario
  ['gas-nombre', 'gas-tel', 'gas-dir', 'gas-comentarios'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('gas-tipo').value = '';
}
// ============================================
// TOAST
// ============================================
function mostrarToast(msg, tipo) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + tipo + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================
// INIT
// ============================================
renderProductos();
actualizarCarrito();
// Función para cerrar el modal de éxito y restablecer la vista
function cerrarModal() {
  // 1. Oculta el modal de éxito de la pantalla
  const modal = document.getElementById('modal-exito');
  if (modal) {
    modal.style.display = 'none'; // o modal.classList.remove('active') según uses clases
  }

  // 2. Opcional: Limpia los campos del formulario para que queden vacíos de nuevo
  const formulario = document.getElementById('form-servicio');
  if (formulario) {
    // Si tienes inputs individuales:
    document.getElementById('gas-nombre').value = '';
    document.getElementById('gas-tel').value = '';
    document.getElementById('gas-dir').value = '';
    document.getElementById('gas-tipo').value = '';
    document.getElementById('gas-comentarios').value = '';
  }
}
