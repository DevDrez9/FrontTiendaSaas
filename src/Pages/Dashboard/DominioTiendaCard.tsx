import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, Link2, Copy } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Props {
  tiendaId: number;
  dominioActual: string;
  onCambiado: (nuevo: string) => void;
}

/** Misma normalización que el backend (DominioService.normalizar) para mostrar la vista previa. */
const normalizar = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-/, '').slice(0, 40);

export default function DominioTiendaCard({ tiendaId, dominioActual, onCambiado }: Props) {
  const { token } = useAuthStore();
  const [valor, setValor] = useState(dominioActual);
  const [estado, setEstado] = useState<{ disponible: boolean; motivo?: string } | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [copiado, setCopiado] = useState(false);

  const limpio = normalizar(valor).replace(/-$/, '');
  const sinCambios = limpio === dominioActual;
  const urlPublica = `${window.location.origin}/${dominioActual}`;

  // Verifica disponibilidad 400ms después de que el usuario deja de escribir
  useEffect(() => {
    setMensaje('');
    if (sinCambios || limpio.length < 3) {
      setEstado(limpio.length > 0 && limpio.length < 3 ? { disponible: false, motivo: 'Mínimo 3 caracteres' } : null);
      return;
    }
    setVerificando(true);
    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/tiendas/dominio-disponible`, {
          params: { dominio: limpio, tiendaId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstado(res.data);
      } catch {
        setEstado(null);
      } finally {
        setVerificando(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [limpio, sinCambios, tiendaId, token]);

  const guardar = async () => {
    setGuardando(true);
    setMensaje('');
    try {
      const res = await axios.patch(
        `${API_URL}/tiendas/${tiendaId}/dominio`,
        { dominio: limpio },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onCambiado(res.data.dominio);
      setValor(res.data.dominio);
      setEstado(null);
      setMensaje('¡Listo! Tu catálogo ya usa la nueva dirección.');
    } catch (err: any) {
      const m = err.response?.data?.message;
      setEstado({ disponible: false, motivo: (Array.isArray(m) ? m[0] : m) || 'No se pudo cambiar' });
    } finally {
      setGuardando(false);
    }
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(urlPublica);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch { /* sin permiso de portapapeles */ }
  };

  return (
    <div className="card p-8 max-w-2xl mb-8">
      <h2 className="text-2xl font-bold mb-2">Dirección de tu catálogo</h2>
      <p className="text-muted mb-6">Este es el link que compartes con tus clientes.</p>

      <div className="dominio-actual mb-6">
        <Link2 size={18} />
        <a href={urlPublica} target="_blank" rel="noreferrer" className="dominio-link">{urlPublica}</a>
        <button type="button" className="btn btn-secondary dominio-copiar" onClick={copiar}>
          <Copy size={14} /> {copiado ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      <div className="form-group mb-0">
        <label className="form-label" htmlFor="dominio">Cambiar dirección</label>
        <div className="dominio-input">
          <span className="dominio-prefijo">{window.location.host}/</span>
          <input
            id="dominio"
            className="form-input"
            value={valor}
            maxLength={40}
            onChange={e => setValor(e.target.value)}
            placeholder="mi-tienda"
          />
        </div>

        {!sinCambios && limpio !== valor && limpio.length >= 3 && (
          <p className="text-xs text-muted">Se guardará como: <strong>{limpio}</strong></p>
        )}
        {verificando && <p className="text-sm text-muted">Verificando...</p>}
        {!verificando && estado?.disponible && (
          <p className="text-sm text-success flex items-center gap-2"><CheckCircle2 size={16} /> Disponible</p>
        )}
        {!verificando && estado && !estado.disponible && (
          <p className="text-sm text-danger flex items-center gap-2"><XCircle size={16} /> {estado.motivo}</p>
        )}
        {mensaje && <p className="text-sm text-success">{mensaje}</p>}
        <p className="text-xs text-muted">
          Al cambiarla, el link anterior dejará de funcionar.
        </p>
      </div>

      <div className="pt-4 mt-4 border-t">
        <button
          type="button"
          className="btn btn-primary"
          disabled={sinCambios || verificando || guardando || !estado?.disponible}
          onClick={guardar}
        >
          {guardando ? 'Guardando...' : 'Cambiar dirección'}
        </button>
      </div>
    </div>
  );
}
