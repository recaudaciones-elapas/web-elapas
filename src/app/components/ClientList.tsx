import {
  Search,
  Eye,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

// ========================================
// INTERFACE
// ========================================

interface Client {
  id_cliente: string;
  nombre: string;
  apellido: string;
  ci: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  created_at?: string;
}

interface ClientListProps {
  onViewDetail: (
    clientId: string
  ) => void;

  onBack: () => void;
}

// ========================================
// COMPONENTE
// ========================================

export function ClientList({
  onViewDetail,
  onBack,
}: ClientListProps) {

  // ========================================
  // ESTADOS
  // ========================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [clients, setClients] =
    useState<Client[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // MODAL
  const [
    showRegisterForm,
    setShowRegisterForm,
  ] = useState(false);

  // CLIENTE EDITANDO
  const [
    editingClient,
    setEditingClient,
  ] = useState<Client | null>(
    null
  );

  // FORMULARIO
  const [formData, setFormData] =
    useState({
      nombre: "",
      apellido: "",
      ci: "",
      direccion: "",
      telefono: "",
      email: "",
      estado: "activo",
    });

  // ========================================
  // API URL
  // ========================================

  const API_URL =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/clientes/";

  // ========================================
  // OBTENER CLIENTES
  // ========================================

  const fetchClients = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(API_URL, {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        });

      if (!response.ok) {

        throw new Error(
          "Error al obtener clientes"
        );
      }

      const data =
        await response.json();

      console.log(
        "CLIENTES:",
        data
      );

      // VALIDAR RESPUESTA

      if (
        Array.isArray(data)
      ) {

        setClients(data);

      } else if (
        Array.isArray(
          data.clientes
        )
      ) {

        setClients(
          data.clientes
        );

      } else if (
        Array.isArray(data.items)
      ) {

        setClients(data.items);

      } else {

        setClients([]);
      }

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ||
          "Error al cargar clientes"
      );

    } finally {

      setLoading(false);
    }
  };

  // ========================================
  // USE EFFECT
  // ========================================

  useEffect(() => {

    fetchClients();

  }, []);

  // ========================================
  // FILTRAR CLIENTES
  // ========================================

  const filteredClients =
    clients.filter((client) => {

      return (

        client.nombre
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        client.apellido
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        client.ci
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      );
    });

  // ========================================
  // NUEVO CLIENTE
  // ========================================

  const handleNewClient = () => {

    setEditingClient(null);

    setFormData({
      nombre: "",
      apellido: "",
      ci: "",
      direccion: "",
      telefono: "",
      email: "",
      estado: "activo",
    });

    setShowRegisterForm(true);
  };

  // ========================================
  // EDITAR
  // ========================================

  const handleEdit = (
    client: Client
  ) => {

    setEditingClient(client);

    setFormData({
      nombre:
        client.nombre || "",

      apellido:
        client.apellido || "",

      ci: client.ci || "",

      direccion:
        client.direccion || "",

      telefono:
        client.telefono || "",

      email:
        client.email || "",

      estado:
        client.estado ||
        "activo",
    });

    setShowRegisterForm(true);
  };

  // ========================================
  // ELIMINAR
  // ========================================

  const handleDelete =
    async (
      id: string
    ) => {

      const confirmDelete =
        window.confirm(
          "¿Eliminar cliente?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${API_URL}${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!response.ok) {

          throw new Error(
            "Error al eliminar"
          );
        }

        fetchClients();

      } catch (err: any) {

        console.error(err);

        alert(
          err.message
        );
      }
    };

  // ========================================
  // INPUTS
  // ========================================

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // ========================================
  // GUARDAR
  // ========================================

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        // =========================
        // EDITAR
        // =========================

        if (
          editingClient
        ) {

          const response =
            await fetch(
              `${API_URL}${editingClient.id_cliente}`,
              {
                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`,
                },

                body: JSON.stringify(
                  formData
                ),
              }
            );

          if (
            !response.ok
          ) {

            throw new Error(
              "Error al actualizar cliente"
            );
          }
        }

        // =========================
        // CREAR
        // =========================

        else {

          const response =
            await fetch(
              API_URL,
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`,
                },

                body: JSON.stringify(
                  formData
                ),
              }
            );

          if (
            !response.ok
          ) {

            throw new Error(
              "Error al registrar cliente"
            );
          }
        }

        // CERRAR
        setShowRegisterForm(
          false
        );

        setEditingClient(
          null
        );

        // RECARGAR
        fetchClients();

      } catch (err: any) {

        console.error(err);

        alert(
          err.message
        );
      }
    };

  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">

      <div className="container mx-auto max-w-7xl">

        {/* VOLVER */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] mb-6"
        >

          <ArrowLeft className="w-5 h-5" />

          Volver

        </button>

        {/* CARD */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-3xl text-[#1e3a5f]">

              Clientes

            </h2>

            <button
              onClick={
                handleNewClient
              }
              className="flex items-center gap-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-5 py-3 rounded-lg"
            >

              <Plus className="w-5 h-5" />

              Registrar

            </button>

          </div>

          {/* BUSCADOR */}

          <div className="relative mb-6">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Buscar..."
              className="w-full pl-11 pr-4 py-3 border-2 rounded-lg"
            />

          </div>

          {/* LOADING */}

          {loading && (

            <div className="text-center py-10">

              Cargando...

            </div>

          )}

          {/* ERROR */}

          {!loading &&
            error && (

              <div className="text-center text-red-600 py-10">

                {error}

              </div>
            )}

          {/* TABLA */}

          {!loading &&
            !error && (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b">

                      <th className="text-left py-3 px-4">
                        Nombre
                      </th>

                      <th className="text-left py-3 px-4">
                        CI
                      </th>

                      <th className="text-left py-3 px-4">
                        Dirección
                      </th>

                      <th className="text-left py-3 px-4">
                        Teléfono
                      </th>

                      <th className="text-left py-3 px-4">
                        Email
                      </th>

                      <th className="text-left py-3 px-4">
                        Estado
                      </th>

                      <th className="text-center py-3 px-4">
                        Acciones
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredClients.map(
                      (
                        client
                      ) => (

                        <tr
                          key={
                            client.id_cliente
                          }
                          className="border-b hover:bg-gray-50"
                        >

                          <td className="py-4 px-4">

                            {
                              client.nombre
                            }{" "}

                            {
                              client.apellido
                            }

                          </td>

                          <td className="py-4 px-4">

                            {
                              client.ci
                            }

                          </td>

                          <td className="py-4 px-4">

                            {
                              client.direccion
                            }

                          </td>

                          <td className="py-4 px-4">

                            {
                              client.telefono
                            }

                          </td>

                          <td className="py-4 px-4">

                            {
                              client.email
                            }

                          </td>

                          <td className="py-4 px-4">

                            <span
                              className={`font-semibold ${
                                client.estado ===
                                "activo"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >

                              {
                                client.estado
                              }

                            </span>

                          </td>

                          {/* BOTONES */}

                          <td className="py-4 px-4">

                            <div className="flex items-center justify-center gap-2">

                              {/* VER */}

                              <button
                                onClick={() =>
                                  onViewDetail(
                                    client.id_cliente
                                  )
                                }
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >

                                <Eye className="w-4 h-4" />

                              </button>

                              {/* EDITAR */}

                              <button
                                onClick={() =>
                                  handleEdit(
                                    client
                                  )
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              >

                                <Edit className="w-4 h-4" />

                              </button>

                              {/* ELIMINAR */}

                              <button
                                onClick={() =>
                                  handleDelete(
                                    client.id_cliente
                                  )
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >

                                <Trash2 className="w-4 h-4" />

                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

                {/* SIN DATOS */}

                {filteredClients.length ===
                  0 && (

                  <div className="text-center py-10">

                    No hay clientes

                  </div>
                )}

              </div>
            )}

        </div>

      </div>

      {/* ======================================== */}
      {/* MODAL */}
      {/* ======================================== */}

      {showRegisterForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">

            <h3 className="text-2xl mb-6">

              {editingClient
                ? "Editar Cliente"
                : "Registrar Cliente"}

            </h3>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="nombre"
                  value={
                    formData.nombre
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Nombre"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="apellido"
                  value={
                    formData.apellido
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Apellido"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="ci"
                  value={
                    formData.ci
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="CI"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="telefono"
                  value={
                    formData.telefono
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Teléfono"
                  className="w-full px-4 py-3 border rounded-lg"
                />

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Email"
                  className="w-full px-4 py-3 border rounded-lg"
                />

                <select
                  name="estado"
                  value={
                    formData.estado
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full px-4 py-3 border rounded-lg"
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

                <input
                  type="text"
                  name="direccion"
                  value={
                    formData.direccion
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Dirección"
                  className="w-full px-4 py-3 border rounded-lg md:col-span-2"
                />

              </div>

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => {

                    setShowRegisterForm(
                      false
                    );

                    setEditingClient(
                      null
                    );
                  }}
                  className="flex-1 py-3 bg-gray-200 rounded-lg"
                >

                  Cancelar

                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white rounded-lg"
                >

                  {editingClient
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