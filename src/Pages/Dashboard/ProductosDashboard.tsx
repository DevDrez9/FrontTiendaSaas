import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Plus, Trash2 } from 'lucide-react';
import './Dashboard.css';
import { fixImageUrl } from '../../config/api';

export default function ProductosDashboard() {
  const { token } = useAuthStore();
  const [storeData, setStoreData] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [formProd, setFormProd] = useState({ nombre: '', precio: '', categoriaId: '', descripcion: '' });
  const [imagenFiles, setImagenFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesModified, setImagesModified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      // 1. Get user's stores
      const resStores = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const miTienda = resStores.data[0];
      setStoreData(miTienda);

      if (miTienda) {
        // 2. Get products for this store
        const resProd = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto/tienda/${miTienda.id}`);
        setProductos(resProd.data.data || []);
        
        // 3. Get categories (only if plan allows)
        if ((miTienda.plan?.nivel || 0) >= 2) {
          const resCat = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categoria/tienda/${miTienda.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCategorias(resCat.data || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const isAdvanced = (storeData.plan?.nivel || 0) >= 2;
      let finalCategoriaId = isAdvanced ? formProd.categoriaId : null;

      if (isAdvanced && !finalCategoriaId) {
        alert('Debes seleccionar una categoría');
        setIsUploading(false);
        return;
      }

      let uploadedUrls = [];
      if (imagenFiles.length > 0) {
        for (const file of imagenFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('productoNombre', formProd.nombre);
          formData.append('tiendaId', storeData.id.toString());

          const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/upload/image`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          uploadedUrls.push(uploadRes.data.url);
        }
      }

      const payload: any = {
        nombre: formProd.nombre,
        descripcion: formProd.descripcion,
        precio: parseFloat(formProd.precio),
        tiendaId: storeData.id,
      };

      let allImageUrls: string[] = [];
      if (isEditMode) {
        allImageUrls = [...existingImages.map(img => img.url), ...uploadedUrls];
      } else {
        allImageUrls = [...uploadedUrls];
      }

      if (!isEditMode) {
        payload.stock = 10; // Solo al crear
      }

      if (imagesModified || !isEditMode) {
        if (allImageUrls.length > 0) {
          payload.imagenUrl = allImageUrls[0];
          payload.imagenes = allImageUrls.map((url, idx) => ({ url, orden: idx }));
        } else {
          payload.imagenUrl = null;
          payload.imagenes = [];
        }
      }

      if (finalCategoriaId) payload.categoriaId = Number(finalCategoriaId);

      if (isEditMode && currentEditId) {
        await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto/${currentEditId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      handleCloseModal();
      fetchData(); // Refetch
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
    setFormProd({ nombre: '', precio: '', categoriaId: '', descripcion: '' });
    setImagenFiles([]);
    setExistingImages([]);
    setImagesModified(false);
  };

  const handleOpenEdit = (p: any) => {
    setIsEditMode(true);
    setCurrentEditId(p.id);
    setFormProd({ 
      nombre: p.nombre, 
      precio: p.precio.toString(), 
      categoriaId: p.categoriaId ? p.categoriaId.toString() : '',
      descripcion: p.descripcion || '' 
    });
    setImagenFiles([]);
    setExistingImages(p.imagenes?.length > 0 ? p.imagenes : (p.imagenUrl ? [{url: p.imagenUrl}] : []));
    setImagesModified(false);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    const limiteProductos = storeData.limiteProductosPersonalizado !== null 
      ? storeData.limiteProductosPersonalizado 
      : storeData.plan?.limiteProductos;

    if (limiteProductos !== -1 && productos.length >= limiteProductos) {
      alert(`Has alcanzado el límite de productos de tu plan (${limiteProductos}).`);
      return;
    }

    setIsEditMode(false);
    setCurrentEditId(null);
    setFormProd({ nombre: '', precio: '', categoriaId: '', descripcion: '' });
    setImagenFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(!confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch(err) {
      alert('Error al eliminar');
    }
  };

  if (loading) return <div className="p-8 text-muted">Cargando catálogo...</div>;

  if (!storeData) {
    return (
      <div className="p-8">
        <div className="warning-card">
          <h3>Aún no tienes una tienda</h3>
          <p>Por favor contacta al administrador para configurar tu cuenta.</p>
        </div>
      </div>
    );
  }

  if (!storeData.planId) {
    return (
      <div className="p-8">
        <div className="warning-card">
          <h3>Suscripción Pendiente 🔒</h3>
          <p>Tu tienda está creada pero no tienes una suscripción activa.</p>
          <p>No podrás subir productos ni imágenes hasta que el administrador asigne un plan a tu tienda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
          <p className="text-muted">Gestiona los productos de {storeData.nombre}</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="empty-state">
          Aún no tienes productos. ¡Agrega el primero!
        </div>
      ) : (
        <div className="dashboard-products-grid">
          {productos.map(p => (
            <div key={p.id} className="card p-4">
              {p.imagenUrl && <img src={p.imagenUrl} alt={p.nombre} className="prod-img" />}
              <h4 className="font-semibold mb-2">{p.nombre}</h4>
              <div className="prod-price">${p.precio}</div>
              <div className="flex gap-2 mt-4">
                <button className="btn btn-secondary flex-1 justify-center" onClick={() => handleOpenEdit(p)}>
                  Editar
                </button>
                <button className="btn btn-danger flex-1 justify-center" onClick={() => handleDelete(p.id)}>
                  <Trash2 size={16} /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h3>{isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveProduct}>
                <div className="form-group">
                  <label className="form-label">Nombre del Producto</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={formProd.nombre}
                    onChange={e => setFormProd({...formProd, nombre: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    min="0" step="0.01"
                    value={formProd.precio}
                    onChange={e => setFormProd({...formProd, precio: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-input" 
                    value={formProd.descripcion}
                    onChange={e => setFormProd({...formProd, descripcion: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Imágenes del Producto 
                    <span className="text-muted" style={{fontSize: '0.8rem', marginLeft: '0.5rem'}}>
                      (Max. {storeData.plan?.limiteImagenesPorProducto || 1})
                    </span>
                  </label>
                  
                  {isEditMode && existingImages.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-muted mb-2">Imágenes actuales (haz clic en la 'x' para eliminar):</div>
                      <div className="flex gap-2 flex-wrap">
                        {existingImages.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                            <img src={fixImageUrl(img.url)} alt="img" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: '#ef4444',
                                color: 'white',
                                border: '2px solid white',
                                borderRadius: '50%',
                                width: '26px',
                                height: '26px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                zIndex: 10
                              }}
                              onClick={() => {
                                const newArr = [...existingImages];
                                newArr.splice(idx, 1);
                                setExistingImages(newArr);
                                setImagesModified(true);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*"
                    multiple={(storeData.plan?.limiteImagenesPorProducto || 1) > 1}
                    className="form-input"
                    onChange={e => {
                      const files = Array.from(e.target.files || []);
                      const limit = storeData.plan?.limiteImagenesPorProducto || 1;
                      if (limit === 1) {
                        setExistingImages([]);
                        setImagenFiles(files.slice(0, 1));
                      } else {
                        if (existingImages.length + files.length > limit) {
                          alert(`Tu plan permite máximo ${limit} imagen(es) en total.`);
                          setImagenFiles(files.slice(0, limit - existingImages.length));
                        } else {
                          setImagenFiles(files);
                        }
                      }
                      setImagesModified(true);
                    }}
                  />
                  {imagenFiles.length > 0 && (
                    <div className="text-sm mt-1 text-muted">
                      {imagenFiles.length} nueva(s) imagen(es) seleccionada(s)
                    </div>
                  )}
                </div>
                
                {(storeData?.plan?.nivel || 0) >= 2 && (
                  <div className="form-group border-t mt-4 pt-4">
                    <label className="form-label">Categoría</label>
                    <select 
                      className="form-input"
                      value={formProd.categoriaId}
                      onChange={e => setFormProd({...formProd, categoriaId: e.target.value})}
                      required
                    >
                      <option value="">Selecciona una categoría...</option>
                      {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" disabled={isUploading} className="btn btn-primary">
                    {isUploading ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Guardar Producto')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
