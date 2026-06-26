import { useState, useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { fixImageUrl } from '../../config/api';

export default function AddToCartModal({ 
  isOpen, 
  onClose, 
  producto, 
  tiendaId 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  producto: any, 
  tiendaId: number 
}) {
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCartStore();

  // Resetear cantidad cada vez que se abre con un producto nuevo
  useEffect(() => {
    if (isOpen) setCantidad(1);
  }, [isOpen, producto]);

  if (!isOpen || !producto) return null;

  const handleAdd = () => {
    addToCart(tiendaId, {
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.enOferta && producto.precioOferta ? producto.precioOferta : producto.precio),
      imagenUrl: producto.imagenUrl
    }, cantidad);
    onClose();
  };

  return (
    <div className="add-modal-overlay" onClick={onClose}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="add-modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        
        <div className="add-modal-image-container">
          {producto.imagenUrl ? (
            <img src={fixImageUrl(producto.imagenUrl)} alt={producto.nombre} />
          ) : (
            <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ShoppingCart size={40} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sin imagen</span>
            </div>
          )}
          <div className="add-modal-image-gradient"></div>
        </div>

        <div className="add-modal-body">
          <h3 className="add-modal-title">{producto.nombre}</h3>
          
          <div className="add-modal-price-row">
            <p className="add-modal-price" style={{ color: 'var(--primary-color, #3b82f6)' }}>
              Bs{producto.enOferta && producto.precioOferta ? producto.precioOferta : producto.precio}
            </p>
            {producto.enOferta && producto.precioOferta > 0 && (
              <p className="add-modal-price-old">Bs{producto.precio}</p>
            )}
          </div>

          <div className="add-modal-qty-container">
            <label className="add-modal-qty-label">Selecciona la cantidad</label>
            <div className="qty-control">
              <button 
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                disabled={cantidad <= 1}
              >-</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)}>+</button>
            </div>
          </div>

          <button className="add-modal-submit" style={{ backgroundColor: 'var(--primary-color, #3b82f6)' }} onClick={handleAdd}>
            <ShoppingCart size={20} /> Añadir al Carrito • Bs{((producto.enOferta && producto.precioOferta ? producto.precioOferta : producto.precio) * cantidad).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
