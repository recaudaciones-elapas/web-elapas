import {
  Search,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";

import { useEffect, useState } from "react";

interface DebtQueryProps {
  onBack: () => void;
}

interface Client {
  id_cliente: string;
  nombre: string;
  apellido: string;
  ci: string;
}

interface Meter {
  id_medidor: string;
  codigo: string;
  id_cliente: string;
}

interface Factura {
  periodo: string;
  monto: number;
  fecha_vencimiento: string;
  estado: string;
}

interface DebtResponse {
  nombre_cliente: string;
  apellido_cliente: string;
  codigo_medidor: string;
  total_deuda: number;
  cantidad_facturas_pendientes: number;
  facturas: Factura[];
}

const API_URL =
  "https://fastapi-app-latest-ride.onrender.com/api/v1";

export function DebtQuery({
  onBack,
}: DebtQueryProps) {
  const [loading, setLoading] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [clients, setClients] =
    useState<Client[]>([]);

  const [meters, setMeters] =
    useState<Meter[]>([]);

  // TODAS LAS FACTURAS
  const [allDebts, setAllDebts] =
    useState<DebtResponse[]>([]);

  // =========================================
  // CARGAR CLIENTES Y MEDIDORES
  // =========================================

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [clientsRes, metersRes] =
        await Promise.all([
          fetch(`${API_URL}/clientes/`),
          fetch(`${API_URL}/medidores/`),
        ]);

      const clientsData =
        await clientsRes.json();

      const metersData =
        await metersRes.json();

      setClients(
        Array.isArray(clientsData)
          ? clientsData
          : []
      );

      setMeters(
        Array.isArray(metersData)
          ? metersData
          : []
      );
    } catch (error) {
      console.error(
        "ERROR CARGANDO:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // BUSCAR TODAS LAS FACTURAS
  // =========================================

  const loadAllDebts = async () => {
    try {
      setLoading(true);

      const debts: DebtResponse[] = [];

      for (const client of clients) {
        const meter = meters.find(
          (m) =>
            m.id_cliente ===
            client.id_cliente
        );

        if (!meter) continue;

        try {
          const response = await fetch(
            `${API_URL}/public/consulta-deuda`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                ci: client.ci,
                codigo_medidor:
                  meter.codigo,
              }),
            }
          );

          if (response.ok) {
            const data =
              await response.json();

            console.log(
              "FACTURA:",
              data
            );

            debts.push(data);
          }
        } catch (error) {
          console.error(
            "ERROR CLIENTE:",
            client.nombre,
            error
          );
        }
      }

      setAllDebts(debts);
    } catch (error) {
      console.error(
        "ERROR GENERAL:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FILTRAR
  // =========================================

  const filteredDebts =
    allDebts.filter((debt) => {
      const fullName =
        `${debt.nombre_cliente} ${debt.apellido_cliente}`;

      return (
        fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        debt.codigo_medidor
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });

  // =========================================
  // COLOR ESTADO
  // =========================================

  const getStatusColor = (
    estado: string
  ) => {
    switch (
      estado?.toLowerCase()
    ) {
      case "pagado":
        return "bg-green-100 text-green-700";

      case "pendiente":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
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
              <DollarSign className="w-8 h-8 text-[#1e5a8e]" />

              <h2 className="text-3xl text-[#1e3a5f]">
                Facturación / Deudas
              </h2>
            </div>

            <button
              onClick={loadAllDebts}
              className="bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Buscar Facturas
            </button>
          </div>

          {/* BUSCADOR */}

          <div className="relative mb-6">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Buscar por cliente o medidor..."
              className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg"
            />
          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-[#1e5a8e]" />
            </div>
          )}

          {/* TABLA */}

          {!loading && (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b-2 border-[#b3e5fc]">

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Cliente
                    </th>

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Medidor
                    </th>

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Total Deuda
                    </th>

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Facturas Pendientes
                    </th>

                    <th className="text-left py-3 px-4 text-[#1e3a5f]">
                      Detalle
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredDebts.map(
                    (debt, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#e3f2fd] hover:bg-[#f1f8fb]"
                      >

                        <td className="py-4 px-4 text-[#1e3a5f]">
                          {
                            debt.nombre_cliente
                          }{" "}
                          {
                            debt.apellido_cliente
                          }
                        </td>

                        <td className="py-4 px-4 text-[#546e7a]">
                          {
                            debt.codigo_medidor
                          }
                        </td>

                        <td className="py-4 px-4 text-[#1e3a5f] font-semibold">
                          Bs.{" "}
                          {debt.total_deuda.toFixed(
                            2
                          )}
                        </td>

                        <td className="py-4 px-4">

                          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">

                            {
                              debt.cantidad_facturas_pendientes
                            }

                          </span>

                        </td>

                        <td className="py-4 px-4">

                          <div className="space-y-2">

                            {debt.facturas.map(
                              (
                                factura,
                                idx
                              ) => (
                                <div
                                  key={idx}
                                  className="bg-[#f1f8fb] rounded-lg p-3"
                                >

                                  <div className="flex justify-between items-center">

                                    <div>

                                      <p className="text-[#1e3a5f] text-sm">
                                        {
                                          factura.periodo
                                        }
                                      </p>

                                      <p className="text-xs text-[#546e7a]">
                                        Vence:
                                        {" "}
                                        {new Date(
                                          factura.fecha_vencimiento
                                        ).toLocaleDateString(
                                          "es-ES"
                                        )}
                                      </p>

                                    </div>

                                    <div className="text-right">

                                      <p className="text-[#1e3a5f] font-semibold">
                                        Bs.{" "}
                                        {factura.monto.toFixed(
                                          2
                                        )}
                                      </p>

                                      <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(
                                          factura.estado
                                        )}`}
                                      >
                                        {
                                          factura.estado
                                        }
                                      </span>

                                    </div>

                                  </div>

                                </div>
                              )
                            )}

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

              {!loading &&
                filteredDebts.length ===
                  0 && (
                  <div className="text-center py-12 text-[#546e7a]">

                    No se encontraron facturas

                  </div>
                )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}