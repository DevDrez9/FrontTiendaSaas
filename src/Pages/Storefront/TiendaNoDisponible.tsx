import { Store } from 'lucide-react';

/** Se muestra cuando la tienda no pagó o venció su suscripción (el backend responde TIENDA_NO_DISPONIBLE). */
export default function TiendaNoDisponible() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="card p-8 text-center" style={{ maxWidth: '28rem' }}>
        <div className="flex justify-center mb-4">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
          >
            <Store size={28} />
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Tienda no disponible</h1>
        <p className="text-muted">
          Este catálogo no está disponible en este momento. Vuelve a intentarlo más tarde.
        </p>
      </div>
    </div>
  );
}

export const esTiendaNoDisponible = (err: any) =>
  err?.response?.data?.code === 'TIENDA_NO_DISPONIBLE';
