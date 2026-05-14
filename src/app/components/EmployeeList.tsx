import {
  Search,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";

// =========================
// INTERFACE EMPLEADO
// =========================

interface Employee {
  id_empleado: string;
  nombre: string;
  apellido: string;
  rol: string;
  telefono: string;
  email: string;
  estado: string;
  password_hash?: string;
  auth_user_id?: string;
}

// =========================
// PROPS
// =========================

interface EmployeeListProps {
  onBack: () => void;
}

export function EmployeeList({
  onBack,
}: EmployeeListProps) {

  // =========================
  // API
  // =========================

  const API_URL =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/empleados/";

  // =========================
  // ESTADOS
  // =========================

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showRegisterForm, setShowRegisterForm] =
    useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null);

  // =========================
  // FORMULARIO
  // =========================

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rol: "",
    telefono: "",
    email: "",
    estado: "activo",
    password: "",
  });

  // =========================
  // CARGAR EMPLEADOS
  // =========================

  const fetchEmployees = async () => {

    try {

      setLoading(true);

      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar empleados");
      }

      const data = await response.json();

      console.log("EMPLEADOS:", data);

      // SI LA API DEVUELVE ARRAY
      if (Array.isArray(data)) {

        setEmployees(data);

      }

      // SI DEVUELVE { empleados: [] }

      else if (Array.isArray(data.empleados)) {

        setEmployees(data.empleados);

      }

      // SI DEVUELVE { items: [] }

      else if (Array.isArray(data.items)) {

        setEmployees(data.items);

      }

      else {

        setEmployees([]);

      }

    } catch (err: any) {

      console.error(err);

      setError(
        err.message || "No se pudieron cargar los empleados"
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {

    fetchEmployees();

  }, []);

  // =========================
  // BUSCADOR
  // =========================

  const filteredEmployees = employees.filter((emp) => {

    return (

      (emp.nombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      (emp.apellido || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      (emp.rol || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      (emp.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    );
  });

  // =========================
  // COLORES ESTADO
  // =========================

  const getStatusColor = (estado: string) => {

    switch (estado?.toLowerCase()) {

      case "activo":
        return "bg-green-100 text-green-700";

      case "suspendido":
        return "bg-yellow-100 text-yellow-700";

      case "inactivo":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // ABRIR MODAL EDITAR
  // =========================

  const handleEdit = (employee: Employee) => {

    setEditingEmployee(employee);

    setFormData({
      nombre: employee.nombre || "",
      apellido: employee.apellido || "",
      rol: employee.rol || "",
      telefono: employee.telefono || "",
      email: employee.email || "",
      estado: employee.estado || "activo",
      password: "",
    });

    setShowRegisterForm(true);
  };

  // =========================
  // ELIMINAR
  // =========================

  const handleDelete = async (
    id_empleado: string
  ) => {

    const confirmDelete = window.confirm(
      "¿Está seguro de eliminar este empleado?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}${id_empleado}`,
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

      fetchEmployees();

    } catch (err) {

      console.error(err);

      alert("No se pudo eliminar el empleado");
    }
  };

  // =========================
  // ABRIR NUEVO
  // =========================

  const handleNewEmployee = () => {

    setEditingEmployee(null);

    setFormData({
      nombre: "",
      apellido: "",
      rol: "",
      telefono: "",
      email: "",
      estado: "activo",
      password: "",
    });

    setShowRegisterForm(true);
  };

  // =========================
  // CAMBIOS FORMULARIO
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // GUARDAR / ACTUALIZAR
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        rol: formData.rol,
        telefono: formData.telefono,
        email: formData.email,
        estado: formData.estado,
        password: formData.password,
      };

      // =========================
      // EDITAR
      // =========================

      if (editingEmployee) {

        const response = await fetch(
          `${API_URL}${editingEmployee.id_empleado}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar");
        }

      }

      // =========================
      // CREAR
      // =========================

      else {

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error al registrar");
        }
      }

      setShowRegisterForm(false);

      fetchEmployees();

    } catch (err) {

      console.error(err);

      alert("Ocurrió un error");
    }
  };

  // =========================
  // RENDER
  // =========================

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">

      <div className="container mx-auto max-w-7xl">

        {/* VOLVER */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />

          Volver al Dashboard
        </button>

        {/* CARD */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <User className="w-8 h-8 text-[#1e5a8e]" />

              <h2 className="text-3xl text-[#1e3a5f]">
                Gestión de Empleados
              </h2>

            </div>

            <button
              onClick={handleNewEmployee}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >

              <Plus className="w-5 h-5" />

              Registrar Empleado

            </button>

          </div>

          {/* BUSCADOR */}

          <div className="relative mb-6">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Buscar por nombre, rol o email..."
              className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
            />

          </div>

          {/* LOADING */}

          {loading && (

            <div className="text-center py-10">
              Cargando empleados...
            </div>

          )}

          {/* ERROR */}

          {!loading && error && (

            <div className="text-center py-10 text-red-600">
              {error}
            </div>

          )}

          {/* TABLA */}

          {!loading && !error && (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b-2 border-[#b3e5fc]">

                    <th className="text-left py-3 px-4">
                      Nombre
                    </th>

                    <th className="text-left py-3 px-4">
                      Apellido
                    </th>

                    <th className="text-left py-3 px-4">
                      Rol
                    </th>

                    <th className="text-left py-3 px-4">
                      Email
                    </th>

                    <th className="text-left py-3 px-4">
                      Teléfono
                    </th>

                    <th className="text-center py-3 px-4">
                      Estado
                    </th>

                    <th className="text-center py-3 px-4">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.map((employee) => (

                    <tr
                      key={employee.id_empleado}
                      className="border-b border-[#e3f2fd] hover:bg-[#f1f8fb]"
                    >

                      <td className="py-4 px-4">
                        {employee.nombre}
                      </td>

                      <td className="py-4 px-4">
                        {employee.apellido}
                      </td>

                      <td className="py-4 px-4">
                        {employee.rol}
                      </td>

                      <td className="py-4 px-4">
                        {employee.email}
                      </td>

                      <td className="py-4 px-4">
                        {employee.telefono}
                      </td>

                      <td className="py-4 px-4 text-center">

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                            employee.estado
                          )}`}
                        >
                          {employee.estado}
                        </span>

                      </td>

                      <td className="py-4 px-4">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() =>
                              handleEdit(employee)
                            }
                            className="p-2 text-[#1e5a8e] hover:bg-[#e3f2fd] rounded-lg"
                          >

                            <Edit className="w-4 h-4" />

                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                employee.id_empleado
                              )
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

        </div>

      </div>

      {/* MODAL */}

      {showRegisterForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">

            <h3 className="text-2xl text-[#1e3a5f] mb-6">

              {editingEmployee
                ? "Editar Empleado"
                : "Registrar Empleado"}

            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />

                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />

                <input
                  type="text"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  placeholder="Rol"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />

                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo"
                  className="w-full px-4 py-2 border-2 rounded-lg"
                />

                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 rounded-lg"
                >

                  <option value="activo">
                    Activo
                  </option>

                  <option value="suspendido">
                    Suspendido
                  </option>

                  <option value="inactivo">
                    Inactivo
                  </option>

                </select>

                {!editingEmployee && (

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    className="w-full px-4 py-2 border-2 rounded-lg md:col-span-2"
                  />

                )}

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setEditingEmployee(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white rounded-lg"
                >

                  {editingEmployee
                    ? "Actualizar"
                    : "Guardar"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}