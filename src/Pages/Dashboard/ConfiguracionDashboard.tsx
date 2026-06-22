import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './Dashboard.css';

export default function ConfiguracionDashboard() {
  const { token } = useAuthStore();
  const [storeData, setStoreData] = useState<any>(null);
  const [configWeb, setConfigWeb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const miTienda = res.data[0];
        setStoreData(miTienda);
        
        if (miTienda?.configWebId) {
          const resConfig = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/config-web/${miTienda.configWebId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setConfigWeb(resConfig.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Guardar nombre y descripción de la tienda
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas/${storeData.id}`, {
        nombre: storeData.nombre,
        descripcion: storeData.descripcion,
        ciudad: storeData.ciudad
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Guardar colores y whatsapp de configWeb
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/config-web/${configWeb.id}`, {
        nombreSitio: storeData.nombre,
        colorPrimario: configWeb.colorPrimario,
        colorSecundario: configWeb.colorSecundario,
        whatsapp: configWeb.whatsapp
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Subir banner si existe
      if (bannerFile) {
        setIsUploadingBanner(true);
        const formData = new FormData();
        formData.append('file', bannerFile);
        formData.append('productoNombre', 'banner');
        formData.append('tiendaId', storeData.id.toString());

        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/upload/image`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const uploadedUrl = uploadRes.data.url;

        // Verificar si ya tiene banner
        if (configWeb.banners && configWeb.banners.length > 0) {
          const bannerId = configWeb.banners[0].id;
          await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/config-web/banners/${bannerId}`, {
            url: uploadedUrl
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/config-web/${configWeb.id}/banners`, {
            url: uploadedUrl,
            orden: 0
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }

      alert('Configuración guardada correctamente');
      setBannerFile(null); // Reset
    } catch (err) {
      console.error(err);
      alert('Error al guardar configuración');
    } finally {
      setSaving(false);
      setIsUploadingBanner(false);
    }
  };

  if (loading) return <div className="p-8 text-muted">Cargando...</div>;
  if (!storeData || !configWeb) return <div className="p-8 text-muted">No se encontró la configuración.</div>;

  return (
    <div className="p-8">
      <div className="card p-8 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Configuración de Tienda</h2>
        
        <form onSubmit={handleSubmit} className="flex-col gap-6" style={{ display: 'flex' }}>
          <div className="form-group mb-0">
            <label className="form-label">Nombre de la Tienda</label>
            <input 
              type="text" 
              className="form-input"
              value={storeData.nombre}
              onChange={(e) => setStoreData({...storeData, nombre: e.target.value})}
              required
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Descripción corta</label>
            <textarea 
              className="form-input"
              value={storeData.descripcion || ''}
              onChange={(e) => setStoreData({...storeData, descripcion: e.target.value})}
              rows={3}
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Ciudad de la Tienda</label>
            <input 
              type="text" 
              className="form-input"
              value={storeData.ciudad || ''}
              onChange={(e) => setStoreData({...storeData, ciudad: e.target.value})}
              placeholder="Ej. Madrid, Buenos Aires, Ciudad de México"
            />
          </div>

          <div className="form-group mb-0 border-t pt-4 mt-2">
            <h3 className="text-lg font-bold mb-4">Datos de Contacto y Diseño</h3>
            <label className="form-label">Número de WhatsApp (con código de país, ej. 5215551234567)</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="5215551234567"
              value={configWeb.whatsapp || ''}
              onChange={(e) => setConfigWeb({...configWeb, whatsapp: e.target.value})}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="form-group mb-0 flex-1">
              <label className="form-label">Color Primario</label>
              <div className="flex-row-gap">
                <input 
                  type="color" 
                  style={{ height: '40px', width: '40px', padding: '0', cursor: 'pointer', border: 'none' }}
                  value={configWeb.colorPrimario || '#0043ce'}
                  onChange={(e) => setConfigWeb({...configWeb, colorPrimario: e.target.value})}
                />
                <span className="text-muted text-sm font-mono">{configWeb.colorPrimario || '#0043ce'}</span>
              </div>
            </div>

            <div className="form-group mb-0 flex-1">
              <label className="form-label">Color Secundario</label>
              <div className="flex-row-gap">
                <input 
                  type="color" 
                  style={{ height: '40px', width: '40px', padding: '0', cursor: 'pointer', border: 'none' }}
                  value={configWeb.colorSecundario || '#ffffff'}
                  onChange={(e) => setConfigWeb({...configWeb, colorSecundario: e.target.value})}
                />
                <span className="text-muted text-sm font-mono">{configWeb.colorSecundario || '#ffffff'}</span>
              </div>
            </div>
          </div>

          {(storeData.plan?.nivel || 0) >= 2 && (
            <div className="form-group mb-0 border-t pt-4 mt-2">
              <label className="form-label">Banner Principal (Tienda Avanzada)</label>
              {configWeb.banners && configWeb.banners.length > 0 && (
                <div className="mb-2">
                  <img src={configWeb.banners[0].url} alt="Banner Actual" className="w-full h-32 object-cover rounded-md border border-gray-200" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                className="form-input"
                onChange={e => setBannerFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted mt-1">Recomendado: 1200x400px</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <button 
              type="submit" 
              disabled={saving || isUploadingBanner}
              className="btn btn-primary"
            >
              {saving || isUploadingBanner ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
