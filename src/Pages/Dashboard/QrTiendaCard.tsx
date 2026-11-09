import { useEffect, useRef, useState } from 'react';
import {
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import { renderStoreQrToCanvas } from '../../utils/qrCode';

interface QrTiendaCardProps {
  nombreTienda: string;
  dominio: string;
  colorPrimario?: string;
}

export default function QrTiendaCard({
  nombreTienda,
  dominio,
  colorPrimario = '#2563eb',
}: QrTiendaCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [conMarco, setConMarco] = useState<boolean>(true);
  const [copiadoLink, setCopiadoLink] = useState<boolean>(false);
  const [copiadaImg, setCopiadaImg] = useState<boolean>(false);
  const [compartiendo, setCompartiendo] = useState<boolean>(false);

  const urlTienda = `${window.location.origin}/${dominio}`;

  useEffect(() => {
    if (!canvasRef.current || !dominio) return;
    renderStoreQrToCanvas(canvasRef.current, {
      url: urlTienda,
      storeName: nombreTienda || 'Mi Tienda',
      domain: dominio,
      accentColor: colorPrimario || '#2563eb',
      includeFrame: conMarco,
    });
  }, [urlTienda, nombreTienda, dominio, colorPrimario, conMarco]);

  const handleDescargar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qr-${dominio || 'tienda'}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const obtenerBlobCanvas = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      if (!canvasRef.current) return resolve(null);
      canvasRef.current.toBlob((blob) => resolve(blob), 'image/png');
    });

  const handleCompartir = async () => {
    setCompartiendo(true);
    try {
      const blob = await obtenerBlobCanvas();
      const texto = `¡Visita el catálogo en línea de ${nombreTienda}! Escanea el QR o entra aquí: ${urlTienda}`;

      if (navigator.share) {
        if (blob) {
          const file = new File([blob], `qr-${dominio}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: nombreTienda,
              text: texto,
              url: urlTienda,
              files: [file],
            });
            return;
          }
        }
        await navigator.share({
          title: nombreTienda,
          text: texto,
          url: urlTienda,
        });
        return;
      }

      // Respaldo si el navegador no soporta navigator.share
      window.open(
        `https://wa.me/?text=${encodeURIComponent(texto)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } catch (err: any) {
      // Si el usuario cancela el diálogo nativo de compartir (AbortError), no hacer nada
      if (err?.name !== 'AbortError') {
        console.error('Error al compartir QR:', err);
      }
    } finally {
      setCompartiendo(false);
    }
  };

  const handleCompartirWhatsApp = () => {
    const texto = `¡Mira nuestro catálogo en línea de *${nombreTienda}*! 🛍️\n👉 ${urlTienda}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCopiarImagen = async () => {
    try {
      const blob = await obtenerBlobCanvas();
      if (!blob || !navigator.clipboard?.write) {
        handleDescargar();
        return;
      }
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopiadaImg(true);
      setTimeout(() => setCopiadaImg(false), 2000);
    } catch {
      handleDescargar();
    }
  };

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlTienda);
      setCopiadoLink(true);
      setTimeout(() => setCopiadoLink(false), 2000);
    } catch {
      /* sin permiso */
    }
  };

  return (
    <div className="card p-8 qr-tienda-card">
      <div className="qr-tienda-layout">
        {/* Columna izquierda: información y botones */}
        <div className="qr-tienda-info">
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-circle bg-primary-light" style={{ padding: '0.65rem' }}>
              <QrCode size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Código QR de tu Tienda</h2>
              <p className="text-sm text-muted">
                Descárgalo o compártelo para que tus clientes entren directo a tu catálogo
              </p>
            </div>
          </div>

          <div className="dominio-actual mt-4 mb-6">
            <a
              href={urlTienda}
              target="_blank"
              rel="noreferrer"
              className="dominio-link"
            >
              {urlTienda}
            </a>
            <button
              type="button"
              className="btn btn-secondary dominio-copiar"
              onClick={handleCopiarLink}
            >
              {copiadoLink ? <Check size={14} /> : <Copy size={14} />}
              {copiadoLink ? 'Copiado' : 'Copiar link'}
            </button>
            <a
              href={urlTienda}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary dominio-copiar"
              style={{ textDecoration: 'none' }}
              title="Abrir tienda"
            >
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Selector de estilo de imagen */}
          <div className="mb-6">
            <span className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Formato de imagen QR
            </span>
            <div className="qr-format-toggle">
              <button
                type="button"
                className={conMarco ? 'active' : ''}
                onClick={() => setConMarco(true)}
              >
                Tarjeta con nombre (Para redes / imprimir)
              </button>
              <button
                type="button"
                className={!conMarco ? 'active' : ''}
                onClick={() => setConMarco(false)}
              >
                Solo código QR
              </button>
            </div>
          </div>

          {/* Acciones de descarga y compartir */}
          <div className="qr-actions-grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDescargar}
            >
              <Download size={18} />
              Descargar QR (PNG)
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCompartir}
              disabled={compartiendo}
            >
              <Share2 size={18} />
              {compartiendo ? 'Compartiendo...' : 'Compartir QR'}
            </button>

            <button
              type="button"
              className="btn"
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              onClick={handleCompartirWhatsApp}
            >
              <MessageCircle size={18} />
              Enviar por WhatsApp
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCopiarImagen}
            >
              {copiadaImg ? <Check size={18} /> : <ImageIcon size={18} />}
              {copiadaImg ? '¡Imagen copiada!' : 'Copiar imagen'}
            </button>
          </div>
        </div>

        {/* Columna derecha: Vista previa del QR en vivo */}
        <div className="qr-tienda-preview">
          <div className="qr-canvas-wrapper">
            <canvas ref={canvasRef} className="qr-tienda-canvas" />
          </div>
          <span className="text-xs text-muted mt-2">
            Vista previa lista para escanear con cualquier celular
          </span>
        </div>
      </div>
    </div>
  );
}
