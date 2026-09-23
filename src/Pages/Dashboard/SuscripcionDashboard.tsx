import React, { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const POLL_INTERVAL_MS = 20_000; // cada 20 segundos
const POLL_DURATION_MS = 2 * 60_000; // durante 2 minutos (igual que el verificador del backend)
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Package, CalendarClock, Check, CheckCircle2, XCircle, RefreshCw, QrCode } from 'lucide-react';
import './Dashboard.css';

interface Props {
  /** 'onboarding' = pantalla de pago obligatoria antes de entrar al panel */
  modo?: 'dashboard' | 'onboarding';
  onPagado?: () => void;
}

export default function SuscripcionDashboard({ modo = 'dashboard', onPagado }: Props) {
  const esOnboarding = modo === 'onboarding';
  const { token, user } = useAuthStore();
  const [storeData, setStoreData] = useState<any>(null);
  const [planes, setPlanes] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [meses, setMeses] = useState<number>(1);
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDIENTE');
  const [pollingActivo, setPollingActivo] = useState(false);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    fetchStoreAndPlans();
  }, []);

  const fetchStoreAndPlans = async () => {
    try {
      const resStore = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStoreData(resStore.data[0]);

      const resPlanes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/planes`);
      setPlanes(resPlanes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePagar = async () => {
    if (!selectedPlan || !storeData) return;
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas/${storeData.id}/suscripcion/checkout`, {
        planId: selectedPlan,
        meses
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrData(res.data);
      setPaymentStatus('PENDIENTE');
      setPollingActivo(true);
    } catch (error: any) {
      console.error(error);
      const m = error.response?.data?.message;
      alert((Array.isArray(m) ? m[0] : m) || 'Error al generar QR');
    } finally {
      setLoading(false);
    }
  };

  const aplicarEstado = (estado?: string) => {
    if (estado === 'PAGADO') {
      setPaymentStatus('PAGADO');
      setPollingActivo(false);
      fetchStoreAndPlans(); // refresh store data
    } else if (estado === 'EXPIRADO' || estado === 'CANCELADO') {
      setPaymentStatus(estado);
      setPollingActivo(false);
    }
  };

  // Polling liviano: solo lee el estado en la BD (el backend es quien consulta a la pasarela)
  const consultarEstado = useCallback(async () => {
    if (!qrData || !storeData) return;
    try {
      const res = await axios.get(
        `${API_URL}/tiendas/${storeData.id}/suscripcion/estado/${qrData.idempotencyKey}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      aplicarEstado(res.data?.estado);
    } catch (error) {
      console.error('Error consultando estado', error);
    }
  }, [qrData, storeData, token]);

  // Botón manual: pide al backend que consulte a la pasarela ahora
  const verificarPago = async () => {
    if (!qrData || !storeData) return;
    try {
      const res = await axios.post(
        `${API_URL}/tiendas/${storeData.id}/suscripcion/verificar/${qrData.idempotencyKey}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      aplicarEstado(res.data?.estado);
    } catch (error) {
      console.error('Error verificando pago', error);
    }
  };

  // Consulta automática: cada 20s durante 2 min; después, solo con el botón
  useEffect(() => {
    if (!qrData || paymentStatus !== 'PENDIENTE' || !pollingActivo) return;

    const interval = setInterval(consultarEstado, POLL_INTERVAL_MS);
    const timeout = setTimeout(() => setPollingActivo(false), POLL_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [qrData, paymentStatus, pollingActivo, consultarEstado]);

  const handleVerificarManual = async () => {
    setVerificando(true);
    await verificarPago();
    setVerificando(false);
  };

  if (!storeData) return <div className="p-8 text-muted">Cargando suscripción...</div>;

  const planSeleccionado = planes.find(p => p.id === selectedPlan);
  const total = planSeleccionado ? Number(planSeleccionado.precioMensual) * meses : 0;
  const cerrarQr = () => { setQrData(null); setPollingActivo(false); };

  return (
    <div className={esOnboarding ? '' : 'p-8'}>
      {esOnboarding ? (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">¡Bienvenido, {storeData.nombre}!</h1>
          <p className="text-muted">Elige un plan y completa el pago para activar tu tienda y entrar a tu panel.</p>
        </div>
      ) : (
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mi Suscripción</h1>
          <p className="text-muted">Administra el plan de {storeData.nombre}</p>
        </div>
      )}

      {!esOnboarding && (
      <div className="dashboard-stats-grid mb-8">
        <div className="card p-6 flex items-center gap-4">
          <div className="icon-circle bg-primary-light">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Plan Actual</p>
            <p className="text-xl font-bold">{storeData.plan?.nombre || 'Sin Plan'}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="icon-circle bg-secondary-light">
            <CalendarClock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Vence</p>
            <p className="text-xl font-bold">
              {storeData.suscripcionFin ? new Date(storeData.suscripcionFin).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      )}

      {!qrData ? (
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-2">Comprar o Renovar Plan</h2>
          <p className="text-muted mb-6">Elige un plan y la cantidad de meses. Pagarás con QR.</p>

          <div className="plan-grid mb-6">
            {planes.map(p => {
              const activo = selectedPlan === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  className={`plan-option ${activo ? 'plan-option--selected' : ''}`}
                  onClick={() => setSelectedPlan(p.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">{p.nombre}</h3>
                    {activo && <span className="plan-check"><Check size={14} /></span>}
                  </div>
                  <p className="text-sm text-muted mb-4">{p.descripcion}</p>
                  <p className="plan-price">
                    {p.precioMensual} <span className="text-sm text-muted font-medium">BOB / mes</span>
                  </p>
                  <span className="badge badge-neutral mt-2">Hasta {p.limiteProductos} productos</span>
                </button>
              );
            })}
          </div>

          <div className="plan-footer border-t">
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="meses">Cantidad de meses</label>
              <select
                id="meses"
                className="form-input w-auto"
                value={meses}
                onChange={e => setMeses(Number(e.target.value))}
              >
                {[1, 3, 6, 12].map(m => (
                  <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              {planSeleccionado && (
                <div className="text-right">
                  <p className="text-sm text-muted">Total a pagar</p>
                  <p className="text-2xl font-bold">{total.toFixed(2)} BOB</p>
                </div>
              )}
              <button
                className="btn btn-primary"
                disabled={!selectedPlan || loading}
                onClick={handlePagar}
              >
                <QrCode size={18} />
                {loading ? 'Generando QR...' : 'Pagar con QR'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-8 max-w-2xl text-center animate-slide-up">
          {paymentStatus === 'PENDIENTE' ? (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2">Escanea para pagar</h2>
              <p className="text-muted mb-6">Usa la app de tu banco para escanear el código QR.</p>

              <div className="qr-frame mb-6">
                <img src={`data:image/png;base64,${qrData.qrImageBase64}`} alt="QR de Pago" />
              </div>

              {pollingActivo ? (
                <p className="flex items-center gap-2 text-sm text-muted mb-4">
                  <span className="spinner" />
                  Esperando confirmación del pago...
                </p>
              ) : (
                <p className="text-sm text-muted mb-4">¿Ya pagaste? Presiona el botón para verificar tu pago.</p>
              )}

              <div className="flex gap-4 justify-center flex-wrap">
                <button className="btn btn-secondary" onClick={cerrarQr}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  disabled={verificando}
                  onClick={handleVerificarManual}
                >
                  <RefreshCw size={16} className={verificando ? 'spin' : ''} />
                  {verificando ? 'Verificando...' : 'Verificar pago'}
                </button>
              </div>
            </div>
          ) : paymentStatus === 'PAGADO' ? (
            <div className="flex flex-col items-center">
              <div className="icon-circle bg-success-light mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Pago exitoso!</h2>
              <p className="text-muted mb-6">
                {esOnboarding ? 'Tu tienda ya está activa.' : 'Tu suscripción ya fue actualizada.'}
              </p>
              {esOnboarding ? (
                <button className="btn btn-primary" onClick={onPagado}>Ir a mi panel</button>
              ) : (
                <button className="btn btn-primary" onClick={cerrarQr}>Volver</button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="icon-circle bg-danger-light mb-4">
                <XCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">El QR ha {paymentStatus.toLowerCase()}</h2>
              <p className="text-muted mb-6">Genera un nuevo QR para completar el pago.</p>
              <button className="btn btn-primary" onClick={cerrarQr}>Intentar de nuevo</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
