import {
  Search,
  ArrowLeft,
  Calendar,
  Droplets,
  Camera,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Cut {
  id_corte: string;
  id_medidor: string;
  fecha: string;
  motivo: string;
  latitud: number;
  longitud: number;
  foto_url: string;
  id_empleado: string;
}

interface Meter {
  id_medidor: string;
  codigo: string;
}

interface Employee {
  id_empleado: string;
  nombre: string;
  apellido: string;
}

interface CutListProps {
  onBack: () => void;
}

const API_URL = "https://fastapi-app-latest-ride.onrender.com/api/v1";

export function CutList({ onBack }: CutListProps) {
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingCut, setEditingCut] = useState<Cut | null>(null);

  const [formData, setFormData] = useState({
    id_medidor: "",
    fecha: "",
    motivo: "",
    latitud: "",
    longitud: "",
    foto_url: "",
    id_empleado: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [cutsRes, metersRes, employeesRes] = await Promise.all([
        fetch(`${API_URL}/cortes/`),
        fetch(`${API_URL}/medidores/`),
        fetch(`${API_URL}/empleados/`),
      ]);

      const cutsData = await cutsRes.json();
      const metersData = await metersRes.json();
      const employeesData = await employeesRes.json();

      setCuts(Array.isArray(cutsData) ? cutsData : []);
      setMeters(Array.isArray(metersData) ? metersData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id_medidor: "",
      fecha: "",
      motivo: "",
      latitud: "",
      longitud: "",
      foto_url: "",
      id_empleado: "",
    });
  };

  const handleEdit = (cut: Cut) => {
    setEditingCut(cut);

    setFormData({
      id_medidor: cut.id_medidor || "",
      fecha: cut.fecha
        ? new Date(cut.fecha).toISOString().split("T")[0]
        : "",
      motivo: cut.motivo || "",
      latitud: cut.latitud?.toString() || "",
      longitud: cut.longitud?.toString() || "",
      foto_url: cut.foto_url || "",
      id_empleado: cut.id_empleado || "",
    });

    setShowRegisterForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este corte?")) return;

    try {
      const response = await fetch(
        `${API_URL}/cortes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el corte");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        id_medidor: formData.id_medidor,
        fecha: formData.fecha,
        motivo: formData.motivo,
        latitud: Number(formData.latitud),
        longitud: Number(formData.longitud),
        foto_url: formData.foto_url,
        id_empleado: formData.id_empleado,
      };

      let response;

      if (editingCut) {
        response = await fetch(
          `${API_URL}/cortes/${editingCut.id_corte}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(`${API_URL}/cortes/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Error guardando corte");
      }

      await loadData();

      setShowRegisterForm(false);
      setEditingCut(null);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el corte");
    }
  };

  const filteredCuts = cuts.filter((cut) => {
    const meter = meters.find(
      (m) => m.id_medidor === cut.id_medidor
    );

    return (
      meter?.codigo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cut.motivo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const getMeterCode = (id: string) => {
    return (
      meters.find((m) => m.id_medidor === id)?.codigo ||
      "Sin medidor"
    );
  };

  const getEmployeeName = (id: string) => {
    const employee = employees.find(
      (e) => e.id_empleado === id
    );

    return employee
      ? `${employee.nombre} ${employee.apellido}`
      : "Sin empleado";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">
      <div className="container mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Droplets className="w-8 h-8 text-[#1e5a8e]" />
              <h2 className="text-3xl text-[#1e3a5f]">
                Registro de Cortes
              </h2>
            </div>

            {/*<button
              onClick={() => {
                setEditingCut(null);
                resetForm();
                setShowRegisterForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Registrar Corte
            </button>*/}
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Buscar por medidor o motivo..."
              className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#1e5a8e]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#b3e5fc]">
                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Fecha
                    </th>

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Medidor
                    </th>

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Motivo
                    </th>

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Empleado
                    </th>

                    <th className="text-center py-3 px-4 text-[#1e3a5f]">
                      Evidencia
                    </th>

                    {/*<th className="text-center py-3 px-4 text-[#1e3a5f]">
                      Acciones
                    </th>*/}
                  </tr>
                </thead>

                <tbody>
                  {filteredCuts.map((cut) => (
                    <tr
                      key={cut.id_corte}
                      className="border-b border-[#e3f2fd] hover:bg-[#f1f8fb]"
                    >
                      <td className="py-4 px-4 text-[#1e3a5f]">
                        {new Date(
                          cut.fecha
                        ).toLocaleDateString("es-ES")}
                      </td>

                      <td className="py-4 px-4 text-[#1e3a5f]">
                        {getMeterCode(cut.id_medidor)}
                      </td>

                      <td className="py-4 px-4 text-[#546e7a]">
                        {cut.motivo}
                      </td>

                      <td className="py-4 px-4 text-[#546e7a]">
                        {getEmployeeName(cut.id_empleado)}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {cut.foto_url ? (
                          <div className="inline-flex items-center gap-1 text-[#1e5a8e]">
                            <Camera className="w-5 h-5" />
                            <span className="text-sm">Sí</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleEdit(cut)
                            }
                            className="p-2 text-[#1e5a8e] hover:bg-[#e3f2fd] rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(cut.id_corte)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredCuts.length === 0 && (
            <div className="text-center py-12 text-[#546e7a]">
              No se encontraron cortes registrados
            </div>
          )}
        </div>
      </div>

      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl text-[#1e3a5f] mb-6">
              {editingCut
                ? "Editar Corte"
                : "Registrar Nuevo Corte"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#1e3a5f] mb-2">
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
                    required
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
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

                <div>
                  <label className="block text-[#1e3a5f] mb-2">
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
                    required
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#1e3a5f] mb-2">
                    Empleado
                  </label>

                  <select
                    value={formData.id_empleado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_empleado: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
                  >
                    <option value="">
                      Seleccione un empleado
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.id_empleado}
                        value={employee.id_empleado}
                      >
                        {employee.nombre}{" "}
                        {employee.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#1e3a5f] mb-2">
                    Motivo
                  </label>

                  <textarea
                    value={formData.motivo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        motivo: e.target.value,
                      })
                    }
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#1e3a5f] mb-2">
                    Latitud
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={formData.latitud}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitud: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#1e3a5f] mb-2">
                    Longitud
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={formData.longitud}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitud: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#1e3a5f] mb-2">
                    URL Evidencia Fotográfica
                  </label>

                  <input
                    type="text"
                    value={formData.foto_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        foto_url: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setEditingCut(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-[#f1f8fb] text-[#546e7a] rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white rounded-lg"
                >
                  {editingCut
                    ? "Actualizar"
                    : "Guardar"}{" "}
                  Corte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}