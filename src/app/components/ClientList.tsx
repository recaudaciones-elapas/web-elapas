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

interface Client {
  id_cliente: string;
  nombre: string;
  apellido: string;
  ci: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
}

interface ClientListProps {
  onViewDetail: (clientId: string) => void;
  onBack: () => void;
}

export function ClientList({
  onViewDetail,
  onBack,
}: ClientListProps) {

  const [searchTerm, setSearchTerm] =
    useState("");

  const [clients, setClients] =
    useState<Client[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const API_URL =
    "https://fastapi-app-latest-ride.onrender.com/api/v1/clientes";

  // ========================================
  // OBTENER CLIENTES
  // ========================================

  const fetchClients = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

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
          "Error al cargar clientes"
        );
      }

      const data =
        await response.json();

      console.log(
        "CLIENTES API:",
        data
      );

      let clientes: Client[] = [];

      if (Array.isArray(data)) {
        clientes = data;
      } else if (
        Array.isArray(data.clientes)
      ) {
        clientes = data.clientes;
      } else if (
        Array.isArray(data.items)
      ) {
        clientes = data.items;
      }

      setClients(clientes);

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ||
          "Error al obtener clientes"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ========================================
  // FILTRO
  // ========================================

  const filteredClients =
    clients.filter((client) => {

      const text =
        searchTerm.toLowerCase();

      return (
        client.nombre
          ?.toLowerCase()
          .includes(text) ||
        client.apellido
          ?.toLowerCase()
          .includes(text) ||
        client.ci
          ?.toLowerCase()
          .includes(text)
      );
    });

  // ========================================
  // ELIMINAR
  // ========================================

  const handleDelete =
    async (id: string) => {

      if (
        !window.confirm(
          "¿Eliminar cliente?"
        )
      ) {
        return;
      }

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await fetch(
            `${API_URL}/${id}`,
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
            "Error al eliminar cliente"
          );
        }

        fetchClients();

      } catch (err: any) {

        console.error(err);

        alert(err.message);
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

        <div className="bg-white rounded-xl shadow-lg p-6">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-3xl text-[#1e3a5f]">
              Clientes
            </h2>

            <button
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
              placeholder="Buscar cliente..."
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

          {!loading && error && (
            <div className="text-center text-red-600 py-10">
              {error}
            </div>
          )}

          {/* TABLA */}

          {!loading && !error && (

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
                      Estado
                    </th>

                    <th className="text-center py-3 px-4">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredClients.map(
                    (client) => (

                      <tr
                        key={
                          client.id_cliente
                        }
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="py-4 px-4">

                          {client.nombre}{" "}
                          {client.apellido}

                        </td>

                        <td className="py-4 px-4">
                          {client.ci}
                        </td>

                        <td className="py-4 px-4">
                          {client.direccion}
                        </td>

                        <td className="py-4 px-4">
                          {client.telefono}
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
                            {client.estado}
                          </span>

                        </td>

                        <td className="py-4 px-4">

                          <div className="flex items-center justify-center gap-2">

                            {/* VER */}

                            <button
                              onClick={() => {

                                console.log(
                                  "CLIENTE SELECCIONADO:",
                                  client
                                );

                                // ENVIAR CI
                                onViewDetail(client.ci);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >

                              <Eye className="w-4 h-4" />

                            </button>

                            {/* EDITAR */}

                            <button
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

            </div>
          )}

        </div>

      </div>

    </div>
  );
}