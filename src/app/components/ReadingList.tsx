import {
  Search,
  ArrowLeft,
  Calendar,
  Gauge,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";

// =========================
// INTERFACES
// =========================

interface Reading {
  id_lectura: string;
  id_medidor: string;
  fecha: string;
  lectura_actual: number;
  lectura_anterior: number;
  consumo: number;
  latitud: number;
  longitud: number;
  foto_url: string;
  sincronizado: boolean;
  created_at: string;
  id_empleado: string;

  // EXTRA
  meter_code?: string;
  client_name?: string;
}

interface Meter {
  id_medidor: string;
  codigo: string;
  id_cliente: string;
}

interface Client {
  id_cliente: string;
  nombre: string;
  apellido: string;
}

interface Employee {
  id_empleado: string;
  nombre: string;
  apellido: string;
}

interface ReadingListProps {
  onBack: () => void;
}

export function ReadingList({ onBack }: ReadingListProps) {
  // =========================
  // API URLS
  // =========================

  const API_LECTURAS =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/lecturas/";

  const API_MEDIDORES =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/medidores/";

  const API_CLIENTES =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/clientes/";

  const API_EMPLEADOS =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/empleados/";

  // =========================
  // STATES
  // =========================

  const [readings, setReadings] = useState<Reading[]>([]);

  const [meters, setMeters] = useState<Meter[]>([]);

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [dateFilter, setDateFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [editingReading, setEditingReading] =
    useState<Reading | null>(null);

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({
    id_medidor: "",
    fecha: "",
    lectura_actual: "",
    lectura_anterior: "",
    consumo: "",
    latitud: "",
    longitud: "",
    foto_url: "",
    sincronizado: true,
    id_empleado: "",
  });

  // =========================
  // TOKEN
  // =========================

  const token = localStorage.getItem("token");

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [
        readingsRes,
        metersRes,
        clientsRes,
        employeesRes,
      ] = await Promise.all([
        fetch(API_LECTURAS, { headers }),
        fetch(API_MEDIDORES, { headers }),
        fetch(API_CLIENTES, { headers }),
        fetch(API_EMPLEADOS, { headers }),
      ]);

      const readingsData = await readingsRes.json();

      const metersData = await metersRes.json();

      const clientsData = await clientsRes.json();

      const employeesData = await employeesRes.json();

      const readingsArray = Array.isArray(readingsData)
        ? readingsData
        : readingsData.items || readingsData.lecturas || [];

      const metersArray = Array.isArray(metersData)
        ? metersData
        : metersData.items || metersData.medidores || [];

      const clientsArray = Array.isArray(clientsData)
        ? clientsData
        : clientsData.items || clientsData.clientes || [];

      const employeesArray = Array.isArray(employeesData)
        ? employeesData
        : employeesData.items || employeesData.empleados || [];

      setMeters(metersArray);

      setEmployees(employeesArray);

      // =========================
      // ENRIQUECER DATOS
      // =========================

      const enrichedReadings = readingsArray.map(
        (reading: Reading) => {
          const meter = metersArray.find(
            (m: Meter) =>
              m.id_medidor === reading.id_medidor
          );

          const client = clientsArray.find(
            (c: Client) =>
              c.id_cliente === meter?.id_cliente
          );

          return {
            ...reading,
            meter_code: meter?.codigo || "Sin código",
            client_name: client
              ? `${client.nombre} ${client.apellido}`
              : "Sin cliente",
          };
        }
      );

      setReadings(enrichedReadings);
    } catch (err) {
      console.error(err);

      setError("Error al cargar lecturas");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTROS
  // =========================

  const filteredReadings = readings.filter((reading) => {
    const matchesSearch =
      reading.client_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reading.meter_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDate =
      !dateFilter ||
      reading.fecha?.split("T")[0] === dateFilter;

    return matchesSearch && matchesDate;
  });

  // =========================
  // EDIT
  // =========================

  const handleEdit = (reading: Reading) => {
    setEditingReading(reading);

    setFormData({
      id_medidor: reading.id_medidor,
      fecha: reading.fecha?.split("T")[0] || "",
      lectura_actual: String(reading.lectura_actual),
      lectura_anterior: String(reading.lectura_anterior),
      consumo: String(reading.consumo),
      latitud: String(reading.latitud || ""),
      longitud: String(reading.longitud || ""),
      foto_url: reading.foto_url || "",
      sincronizado: reading.sincronizado,
      id_empleado: reading.id_empleado || "",
    });

    setShowRegisterForm(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "¿Está seguro de eliminar esta lectura?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_LECTURAS}${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      fetchData();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar");
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const url = editingReading
        ? `${API_LECTURAS}${editingReading.id_lectura}`
        : API_LECTURAS;

      const method = editingReading ? "PUT" : "POST";

      const body = {
        ...formData,
        lectura_actual: Number(
          formData.lectura_actual
        ),
        lectura_anterior: Number(
          formData.lectura_anterior
        ),
        consumo: Number(formData.consumo),
        latitud: Number(formData.latitud),
        longitud: Number(formData.longitud),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      setShowRegisterForm(false);

      setEditingReading(null);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al guardar lectura");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">
      <div className="container mx-auto max-w-7xl">
        {/* VOLVER */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        {/* CARD */}

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl text-[#1e3a5f]">
              Registro de Lecturas
            </h2>

            {/*button
              onClick={() => {
                setEditingReading(null);

                setFormData({
                  id_medidor: "",
                  fecha: "",
                  lectura_actual: "",
                  lectura_anterior: "",
                  consumo: "",
                  latitud: "",
                  longitud: "",
                  foto_url: "",
                  sincronizado: true,
                  id_empleado: "",
                });

                setShowRegisterForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-6 py-3 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Registrar Lectura
            </button>*/}
          </div>

          {/* FILTROS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Buscar..."
                className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 rounded-lg"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 rounded-lg"
              />
            </div>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="text-center py-10">
              Cargando lecturas...
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
                    <th className="text-left py-3 px-4">
                      Fecha
                    </th>

                    <th className="text-left py-3 px-4">
                      Cliente
                    </th>

                    <th className="text-left py-3 px-4">
                      Medidor
                    </th>

                    <th className="text-right py-3 px-4">
                      Lectura Anterior
                    </th>

                    <th className="text-right py-3 px-4">
                      Lectura Actual
                    </th>

                    <th className="text-right py-3 px-4">
                      Consumo
                    </th>

                    {/*<th className="text-center py-3 px-4">
                      Acciones
                    </th>*/}
                  </tr>
                </thead>

                <tbody>
                  {filteredReadings.map((reading) => (
                    <tr
                      key={reading.id_lectura}
                      className="border-b border-[#e3f2fd]"
                    >
                      <td className="py-4 px-4">
                        {new Date(
                          reading.fecha
                        ).toLocaleDateString("es-ES")}
                      </td>

                      <td className="py-4 px-4">
                        {reading.client_name}
                      </td>

                      <td className="py-4 px-4">
                        {reading.meter_code}
                      </td>

                      <td className="py-4 px-4 text-right">
                        {reading.lectura_anterior} m³
                      </td>

                      <td className="py-4 px-4 text-right text-[#1e5a8e]">
                        {reading.lectura_actual} m³
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e3f2fd] text-[#1e5a8e] rounded-full">
                          <Gauge className="w-4 h-4" />
                          {reading.consumo} m³
                        </span>
                      </td>

                      {/*<td className="py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleEdit(reading)
                            }
                            className="p-2 text-[#1e5a8e] hover:bg-[#e3f2fd] rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                reading.id_lectura
                              )
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

              {filteredReadings.length === 0 && (
                <div className="text-center py-10 text-[#546e7a]">
                  No se encontraron lecturas
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}

      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl text-[#1e3a5f] mb-6">
              {editingReading
                ? "Editar Lectura"
                : "Registrar Nueva Lectura"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MEDIDOR */}

                <div className="md:col-span-2">
                  <label className="block mb-2">
                    Medidor
                  </label>

                  <select
                    value={formData.id_medidor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_medidor: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  >
                    <option value="">
                      Seleccione un medidor
                    </option>

                    {meters.map((meter) => (
                      <option
                        key={meter.id_medidor}
                        value={meter.id_medidor}
                      >
                        {meter.codigo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LECTURA ACTUAL */}

                <div>
                  <label className="block mb-2">
                    Lectura Actual
                  </label>

                  <input
                    type="number"
                    value={formData.lectura_actual}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lectura_actual:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  />
                </div>

                {/* LECTURA ANTERIOR */}

                <div>
                  <label className="block mb-2">
                    Lectura Anterior
                  </label>

                  <input
                    type="number"
                    value={formData.lectura_anterior}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lectura_anterior:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  />
                </div>

                {/* CONSUMO */}

                <div>
                  <label className="block mb-2">
                    Consumo
                  </label>

                  <input
                    type="number"
                    value={formData.consumo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consumo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  />
                </div>

                {/* FECHA */}

                <div>
                  <label className="block mb-2">
                    Fecha
                  </label>

                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fecha: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  />
                </div>

                {/* LATITUD */}

                <div>
                  <label className="block mb-2">
                    Latitud
                  </label>

                  <input
                    type="number"
                    value={formData.latitud}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitud: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  />
                </div>

                {/* LONGITUD */}

                <div>
                  <label className="block mb-2">
                    Longitud
                  </label>

                  <input
                    type="number"
                    value={formData.longitud}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitud: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  />
                </div>

                {/* EMPLEADO */}

                <div className="md:col-span-2">
                  <label className="block mb-2">
                    Empleado
                  </label>

                  <select
                    value={formData.id_empleado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_empleado:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg"
                  >
                    <option value="">
                      Seleccione un empleado
                    </option>

                    {employees.map((emp) => (
                      <option
                        key={emp.id_empleado}
                        value={emp.id_empleado}
                      >
                        {emp.nombre}{" "}
                        {emp.apellido}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BOTONES */}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setEditingReading(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white rounded-lg"
                >
                  {editingReading
                    ? "Actualizar"
                    : "Guardar"}{" "}
                  Lectura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}