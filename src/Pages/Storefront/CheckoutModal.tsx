import { useState } from 'react';
import axios from 'axios';
import { useCartStore } from '../../store/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorPrimario?: string;
  whatsapp?: string;
}

export default function CheckoutModal({ isOpen, onClose, colorPrimario = '#3182ce', whatsapp }: CheckoutModalProps) {
  const { items, getTotal, tiendaId, clearCart, updateQuantity, removeFromCart } = useCartStore();
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      const payload = {
        cliente,
        telefono,
        direccion,
        tiendaId,
        total: getTotal(),
        subtotal: getTotal(),
        items: items.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precio: item.precio
        }))
      };

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/venta`, payload);
      setSuccess(true);
      
      if (whatsapp) {
        const text = `¡Hola! Me gustaría realizar un pedido:\n\n` + 
          items.map(item => `- ${item.cantidad}x ${item.nombre} (Bs${(item.precio * item.cantidad).toFixed(2)})`).join('\n') +
          `\n\n*Total: Bs${getTotal().toFixed(2)}*\n\n` +
          `Mis datos:\nNombre: ${cliente}\nTeléfono: ${telefono}\nDirección: ${direccion}`;
        
        const url = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }

      clearCart();
    } catch (error) {
      console.error(error);
      alert('Error al procesar el pedido. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay p-4">
      <div className="modal-content flex flex-col" style={{ padding: 0 }}>
        <div 
          className="modal-header text-white"
          style={{ backgroundColor: colorPrimario, borderBottom: 'none' }}
        >
          <h2 className="text-xl font-bold m-0" style={{ color: 'white' }}>Resumen de Pedido</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        </div>

        {success ? (
          <div className="modal-body text-center py-8">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h3>
            <p className="text-muted mb-6">El vendedor se pondrá en contacto contigo pronto.</p>
            <button 
              onClick={onClose}
              className="btn btn-primary"
              style={{ backgroundColor: colorPrimario }}
            >
              Seguir Explorando
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="mb-6">
              <h3 className="font-semibold mb-4 border-b" style={{ paddingBottom: '0.5rem' }}>Tus Productos</h3>
              {items.length === 0 ? (
                <p className="text-muted" style={{ fontStyle: 'italic' }}>El carrito está vacío</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {items.map(item => (
                    <div key={item.id} className="cart-item-row">
                      <div className="cart-item-info">
                        <span className="cart-item-title" title={item.nombre}>{item.nombre}</span>
                        <span className="cart-item-price">Bs{(item.precio * item.cantidad).toFixed(2)}</span>
                      </div>
                      
                      <div className="cart-item-actions">
                        <div className="cart-mini-qty">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.cantidad}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="cart-item-delete"
                          title="Eliminar del carrito"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t flex justify-between items-center text-lg font-bold" style={{ marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                    <span>Total</span>
                    <span style={{ color: colorPrimario }}>Bs{getTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <form onSubmit={handleSubmit} className="flex flex-col">
                <h3 className="font-semibold mb-4">Datos de Contacto</h3>
                <div className="form-group">
                  <label className="form-label">Nombre Completo</label>
                  <input type="text" required value={cliente} onChange={e=>setCliente(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" required value={telefono} onChange={e=>setTelefono(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Dirección de Entrega</label>
                  <textarea required value={direccion} onChange={e=>setDireccion(e.target.value)} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary mt-4 w-full"
                  style={{ backgroundColor: colorPrimario, padding: '0.75rem', fontSize: '1rem' }}
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
