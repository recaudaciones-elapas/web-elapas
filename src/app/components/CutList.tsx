import {
  Search,
  ArrowLeft,
  Droplets,
  Camera,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

// ========================================
// INTERFACES
// ========================================

interface Cut {
  id_corte: string;
  id_medidor: string;
  fecha: string;
  motivo: string;
  latitud: number;
  longitud: number;
  foto_url: string;
  id_empleado: string;

  // ESTADO VISUAL
  status?: string;
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

// ========================================
// API
// ========================================

const API_URL =
  "https://fastapi-app-latest-ride.onrender.com/api/v1";

// ========================================
// COMPONENTE
// ========================================

export function CutList({
  onBack,
}: CutListProps) {

  // ========================================
  // ESTADOS
  // ========================================

  const [cuts, setCuts] =
    useState<Cut[]>([]);

  const [meters, setMeters] =
    useState<Meter[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      // ================================
      // PETICIONES
      // ================================

      const [
        cutsRes,
        metersRes,
        employeesRes,
      ] = await Promise.all([
        fetch(`${API_URL}/cortes/`),
        fetch(`${API_URL}/medidores/`),
        fetch(`${API_URL}/empleados/`),
      ]);

      // ================================
      // JSON
      // ================================

      const cutsData =
        await cutsRes.json();

      const metersData =
        await metersRes.json();

      const employeesData =
        await employeesRes.json();

      console.log(
        "CORTES API:",
        cutsData
      );

      // ================================
      // VALIDAR ARRAYS
      // ================================

      const cutsArray =
        Array.isArray(cutsData)
          ? cutsData
          : [];

      // ================================
      // GENERAR ESTADO VISUAL
      // ================================

      const cutsWithStatus =
        cutsArray.map(
          (cut: any) => {

            let status =
              "Ejecutado";

            if (
              cut.motivo
                ?.toLowerCase()
                .includes(
                  "reconect"
                )
            ) {

              status =
                "Reconectado";

            } else if (
              cut.motivo
                ?.toLowerCase()
                .includes(
                  "pendiente"
                )
            ) {

              status =
                "Pendiente";
            }

            return {
              ...cut,
              status,
            };
          }
        );

      // ================================
      // SET DATA
      // ================================

      setCuts(cutsWithStatus);

      setMeters(
        Array.isArray(
          metersData
        )
          ? metersData
          : []
      );

      setEmployees(
        Array.isArray(
          employeesData
        )
          ? employeesData
          : []
      );

    } catch (error) {

      console.error(
        "ERROR:",
        error
      );

      setCuts([]);

    } finally {

      setLoading(false);
    }
  };

  // ========================================
  // HELPERS
  // ========================================

  const getMeterCode = (
    id: string
  ) => {

    return (
      meters.find(
        (m) =>
          m.id_medidor === id
      )?.codigo ||
      "Sin medidor"
    );
  };

  const getEmployeeName = (
    id: string
  ) => {

    const employee =
      employees.find(
        (e) =>
          e.id_empleado === id
      );

    return employee
      ? `${employee.nombre} ${employee.apellido}`
      : "Sin empleado";
  };

  // ========================================
  // FILTRO
  // ========================================

  const filteredCuts =
    cuts.filter((cut) => {

      const meterCode =
        getMeterCode(
          cut.id_medidor
        );

      const matchesSearch =
        meterCode
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        cut.motivo
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        !statusFilter ||
        cut.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ========================================
  // COLOR ESTADO
  // ========================================

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "Ejecutado":
        return "bg-blue-100 text-blue-700";

      case "Pendiente":
        return "bg-yellow-100 text-yellow-700";

      case "Reconectado":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">

      <div className="container mx-auto max-w-7xl">

        {/* BACK */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6"
        >

          <ArrowLeft className="w-5 h-5" />

          Volver

        </button>

        {/* CARD */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          {/* HEADER */}

          <div className="flex items-center gap-3 mb-6">

            <Droplets className="w-8 h-8 text-[#1e5a8e]" />

            <h2 className="text-3xl text-[#1e3a5f]">

              Registro de Cortes

            </h2>

          </div>

          {/* FILTROS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            {/* BUSCADOR */}

            <div className="relative md:col-span-2">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Buscar por medidor o motivo..."
                className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
              />

            </div>

            {/* COMBOBOX */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
            >

              <option value="">
                Todos los estados
              </option>

              <option value="Pendiente">
                Pendiente
              </option>

              <option value="Ejecutado">
                Ejecutado
              </option>

              <option value="Reconectado">
                Reconectado
              </option>

            </select>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="flex justify-center py-12">

              <Loader2 className="w-8 h-8 animate-spin text-[#1e5a8e]" />

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b-2 border-[#b3e5fc]">

                    <th className="text-left py-3 px-4">
                      Fecha
                    </th>

                    <th className="text-left py-3 px-4">
                      Medidor
                    </th>

                    <th className="text-left py-3 px-4">
                      Motivo
                    </th>

                    <th className="text-left py-3 px-4">
                      Empleado
                    </th>

                    <th className="text-center py-3 px-4">
                      Evidencia
                    </th>

                    <th className="text-center py-3 px-4">
                      Estado
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCuts.map(
                    (cut) => (

                      <tr
                        key={
                          cut.id_corte
                        }
                        className="border-b border-[#e3f2fd]"
                      >

                        <td className="py-4 px-4">

                          {new Date(
                            cut.fecha
                          ).toLocaleDateString(
                            "es-ES"
                          )}

                        </td>

                        <td className="py-4 px-4">

                          {getMeterCode(
                            cut.id_medidor
                          )}

                        </td>

                        <td className="py-4 px-4">

                          {cut.motivo}

                        </td>

                        <td className="py-4 px-4">

                          {getEmployeeName(
                            cut.id_empleado
                          )}

                        </td>

                        <td className="py-4 px-4 text-center">

                          {cut.foto_url ? (

                            <Camera className="w-5 h-5 text-[#1e5a8e] mx-auto" />

                          ) : (

                            "No"

                          )}

                        </td>

                        <td className="py-4 px-4 text-center">

                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                              cut.status ||
                                ""
                            )}`}
                          >

                            {cut.status}

                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}