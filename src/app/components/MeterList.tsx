import {
  Search,
  ArrowLeft,
  Plus,
  Gauge,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

// =========================
// INTERFACES
// =========================

interface Meter {
  id_medidor: string;
  codigo: string;
  id_cliente: string;
  id_ruta: string;
  id_tarifa: string;
  estado: string;

  // DATOS EXTRA
  cliente_nombre?: string;
  cliente_apellido?: string;
  direccion?: string;
  zona_nombre?: string;
  ruta_nombre?: string;
  tarifa_nombre?: string;
}

interface Client {
  id_cliente: string;
  nombre: string;
  apellido: string;
  direccion: string;
}

interface Ruta {
  id_ruta: string;
  nombre: string;
  id_zona: string;
}

interface Zona {
  id_zona: string;
  nombre: string;
}

interface Tarifa {
  id_tarifa: string;
  nombre: string;
}

interface MeterListProps {
  onBack: () => void;
}

export function MeterList({ onBack }: MeterListProps) {
  // =========================
  // API URLS
  // =========================

  const API_MEDIDORES =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/medidores/";

  const API_CLIENTES =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/clientes/";

  const API_RUTAS =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/rutas/";

  const API_ZONAS =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/zonas/";

  const API_TARIFAS =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/tarifas/";

  // =========================
  // STATES
  // =========================

  const [meters, setMeters] = useState<Meter[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [routes, setRoutes] = useState<Ruta[]>([]);
  const [zones, setZones] = useState<Zona[]>([]);
  const [tariffs, setTariffs] = useState<Tarifa[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [editingMeter, setEditingMeter] = useState<Meter | null>(null);

  // =========================
  // FORM STATE
  // =========================

  const [formData, setFormData] = useState({
    codigo: "",
    id_cliente: "",
    id_ruta: "",
    id_tarifa: "",
    estado: "activo",
  });

  // =========================
  // TOKEN
  // =========================

  const token = localStorage.getItem("token");

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [
        medidoresRes,
        clientesRes,
        rutasRes,
        zonasRes,
        tarifasRes,
      ] = await Promise.all([
        fetch(API_MEDIDORES, { headers }),
        fetch(API_CLIENTES, { headers }),
        fetch(API_RUTAS, { headers }),
        fetch(API_ZONAS, { headers }),
        fetch(API_TARIFAS, { headers }),
      ]);

      const medidoresData = await medidoresRes.json();
      const clientesData = await clientesRes.json();
      const rutasData = await rutasRes.json();
      const zonasData = await zonasRes.json();
      const tarifasData = await tarifasRes.json();

      const medidoresArray = Array.isArray(medidoresData)
        ? medidoresData
        : medidoresData.items || medidoresData.medidores || [];

      const clientesArray = Array.isArray(clientesData)
        ? clientesData
        : clientesData.items || clientesData.clientes || [];

      const rutasArray = Array.isArray(rutasData)
        ? rutasData
        : rutasData.items || rutasData.rutas || [];

      const zonasArray = Array.isArray(zonasData)
        ? zonasData
        : zonasData.items || zonasData.zonas || [];

      const tarifasArray = Array.isArray(tarifasData)
        ? tarifasData
        : tarifasData.items || tarifasData.tarifas || [];

      setClients(clientesArray);
      setRoutes(rutasArray);
      setZones(zonasArray);
      setTariffs(tarifasArray);

      // =========================
      // ENRIQUECER DATOS
      // =========================

      const enrichedMeters = medidoresArray.map((meter: Meter) => {
        const cliente = clientesArray.find(
          (c: Client) => c.id_cliente === meter.id_cliente
        );

        const ruta = rutasArray.find(
          (r: Ruta) => r.id_ruta === meter.id_ruta
        );

        const zona = zonasArray.find(
          (z: Zona) => z.id_zona === ruta?.id_zona
        );

        const tarifa = tarifasArray.find(
          (t: Tarifa) => t.id_tarifa === meter.id_tarifa
        );

        return {
          ...meter,
          cliente_nombre: cliente?.nombre || "",
          cliente_apellido: cliente?.apellido || "",
          direccion: cliente?.direccion || "",
          ruta_nombre: ruta?.nombre || "",
          zona_nombre: zona?.nombre || "",
          tarifa_nombre: tarifa?.nombre || "",
        };
      });

      setMeters(enrichedMeters);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar medidores");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTRADO
  // =========================

  const filteredMeters = meters.filter((meter) => {
    const search = searchTerm.toLowerCase();

    return (
      meter.codigo?.toLowerCase().includes(search) ||
      meter.cliente_nombre?.toLowerCase().includes(search) ||
      meter.cliente_apellido?.toLowerCase().includes(search) ||
      meter.zona_nombre?.toLowerCase().includes(search) ||
      meter.ruta_nombre?.toLowerCase().includes(search)
    );
  });

  // =========================
  // STATUS COLORS
  // =========================

  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "activo":
        return "bg-green-100 text-green-700";

      case "suspendido":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (meter: Meter) => {
    setEditingMeter(meter);

    setFormData({
      codigo: meter.codigo,
      id_cliente: meter.id_cliente,
      id_ruta: meter.id_ruta,
      id_tarifa: meter.id_tarifa,
      estado: meter.estado,
    });

    setShowRegisterForm(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "¿Está seguro de eliminar este medidor?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_MEDIDORES}${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar");
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingMeter
        ? `${API_MEDIDORES}${editingMeter.id_medidor}`
        : API_MEDIDORES;

      const method = editingMeter ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      setShowRegisterForm(false);

      setEditingMeter(null);

      setFormData({
        codigo: "",
        id_cliente: "",
        id_ruta: "",
        id_tarifa: "",
        estado: "activo",
      });

      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Error al guardar medidor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">
      <div className="container mx-auto max-w-7xl">
        {/* VOLVER */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        {/* CARD */}

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Gauge className="w-8 h-8 text-[#1e5a8e]" />

              <h2 className="text-3xl text-[#1e3a5f]">
                Gestión de Medidores
              </h2>
            </div>

            {/*<button
              onClick={() => {
                setEditingMeter(null);

                setFormData({
                  codigo: "",
                  id_cliente: "",
                  id_ruta: "",
                  id_tarifa: "",
                  estado: "activo",
                });

                setShowRegisterForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-6 py-3 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Registrar Medidor
            </button>*/}
          </div>

          {/* SEARCH */}

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

            <input
              type="text"
              placeholder="Buscar medidor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
            />
          </div>

          {/* LOADING */}

          {loading && (
            <div className="text-center py-10">
              Cargando medidores...
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="text-center text-red-600 py-10">
              {error}
            </div>
          )}

          {/* TABLE */}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#b3e5fc]">
                    <th className="text-left py-3 px-4">Código</th>
                    <th className="text-left py-3 px-4">Cliente</th>
                    <th className="text-left py-3 px-4">Dirección</th>
                    <th className="text-left py-3 px-4">Zona</th>
                    <th className="text-left py-3 px-4">Ruta</th>
                    <th className="text-left py-3 px-4">Tarifa</th>
                    <th className="text-center py-3 px-4">Estado</th>
                    {/*<th className="text-center py-3 px-4">Acciones</th>*/}
                  </tr>
                </thead>

                <tbody>
                  {filteredMeters.map((meter) => (
                    <tr
                      key={meter.id_medidor}
                      className="border-b border-[#e3f2fd]"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-[#1e5a8e]" />

                          {meter.codigo}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {meter.cliente_nombre}{" "}
                        {meter.cliente_apellido}
                      </td>

                      <td className="py-4 px-4">
                        {meter.direccion}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />

                          {meter.zona_nombre}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {meter.ruta_nombre}
                      </td>

                      <td className="py-4 px-4">
                        {meter.tarifa_nombre}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            meter.estado
                          )}`}
                        >
                          {meter.estado}
                        </span>
                      </td>

                      {/*<td className="py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(meter)}
                            className="p-2 text-[#1e5a8e] hover:bg-[#e3f2fd] rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(meter.id_medidor)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>*/}
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMeters.length === 0 && (
                <div className="text-center py-10">
                  No se encontraron medidores
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}

      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
            <h3 className="text-2xl text-[#1e3a5f] mb-6">
              {editingMeter
                ? "Editar Medidor"
                : "Registrar Nuevo Medidor"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CODIGO */}

                <div>
                  <label className="block mb-2">
                    Código del Medidor
                  </label>

                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        codigo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  />
                </div>

                {/* CLIENTE */}

                <div>
                  <label className="block mb-2">Cliente</label>

                  <select
                    value={formData.id_cliente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_cliente: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  >
                    <option value="">
                      Seleccione un cliente
                    </option>

                    {clients.map((client) => (
                      <option
                        key={client.id_cliente}
                        value={client.id_cliente}
                      >
                        {client.nombre} {client.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                {/* RUTA */}

                <div>
                  <label className="block mb-2">Ruta</label>

                  <select
                    value={formData.id_ruta}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_ruta: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  >
                    <option value="">Seleccione una ruta</option>

                    {routes.map((route) => (
                      <option
                        key={route.id_ruta}
                        value={route.id_ruta}
                      >
                        {route.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TARIFA */}

                <div>
                  <label className="block mb-2">Tarifa</label>

                  <select
                    value={formData.id_tarifa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_tarifa: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  >
                    <option value="">
                      Seleccione una tarifa
                    </option>

                    {tariffs.map((tariff) => (
                      <option
                        key={tariff.id_tarifa}
                        value={tariff.id_tarifa}
                      >
                        {tariff.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ESTADO */}

                <div>
                  <label className="block mb-2">Estado</label>

                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estado: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  >
                    <option value="activo">Activo</option>

                    <option value="inactivo">
                      Inactivo
                    </option>

                    <option value="suspendido">
                      Suspendido
                    </option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setEditingMeter(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white rounded-lg"
                >
                  {editingMeter
                    ? "Actualizar"
                    : "Guardar"}{" "}
                  Medidor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}