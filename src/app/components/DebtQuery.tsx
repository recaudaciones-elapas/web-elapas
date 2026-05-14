import {
  Search,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Calendar,
  Droplet,
} from "lucide-react";

import { useState } from "react";

interface DebtQueryProps {
  onBack: () => void;
}

interface Factura {
  periodo: string;
  monto: number;
  fecha_vencimiento: string;
  estado: string;
}

interface ConsultaResponse {
  nombre_cliente: string;
  apellido_cliente: string;
  codigo_medidor: string;
  total_deuda: number;
  cantidad_facturas_pendientes: number;
  facturas: Factura[];
}

export function DebtQuery({
  onBack,
}: DebtQueryProps) {

  const API_BASE =
    "https://fastapi-app-latest-ride.onrender.com/api/v1";

  const [ci, setCI] =
    useState("");

  const [codigoMedidor, setCodigoMedidor] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [consulta, setConsulta] =
    useState<ConsultaResponse | null>(null);

  // ========================================
  // BUSCAR DEUDA
  // ========================================

  const handleSearch = async () => {

    try {

      setLoading(true);

      setError("");

      setConsulta(null);

      const response = await fetch(
        `${API_BASE}/public/consulta-deuda`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ci: ci,
            codigo_medidor:
              codigoMedidor,
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          "No se encontró información del cliente"
        );
      }

      const data =
        await response.json();

      console.log(
        "CONSULTA:",
        data
      );

      setConsulta(data);

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ||
          "Error al consultar deuda"
      );

    } finally {

      setLoading(false);
    }
  };

  // ========================================
  // ESTADO
  // ========================================

  const getStatusColor = (
    estado: string
  ) => {

    if (
      estado.toLowerCase() ===
      "pagado"
    ) {
      return {
        bg: "bg-green-50",
        border:
          "border-green-200",
        text:
          "text-green-600",
        icon: CheckCircle,
      };
    }

    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      icon: AlertCircle,
    };
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">

      <div className="container mx-auto max-w-6xl">

        {/* VOLVER */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6"
        >

          <ArrowLeft className="w-5 h-5" />

          Volver al Dashboard

        </button>

        {/* BUSQUEDA */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <DollarSign className="w-8 h-8 text-[#1e5a8e]" />

            <h2 className="text-3xl text-[#1e3a5f]">

              Consulta de Deuda

            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            {/* CI */}

            <div>

              <label className="block text-[#1e3a5f] mb-2">

                Cédula de Identidad

              </label>

              <input
                type="text"
                value={ci}
                onChange={(e) =>
                  setCI(
                    e.target.value
                  )
                }
                placeholder="Ingrese CI"
                className="w-full px-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
              />

            </div>

            {/* MEDIDOR */}

            <div>

              <label className="block text-[#1e3a5f] mb-2">

                Código Medidor

              </label>

              <input
                type="text"
                value={codigoMedidor}
                onChange={(e) =>
                  setCodigoMedidor(
                    e.target.value
                  )
                }
                placeholder="Ej: MED-1001"
                className="w-full px-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
              />

            </div>

          </div>

          {/* BOTON */}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-6 py-3 rounded-lg hover:shadow-lg disabled:opacity-50"
          >

            <Search className="w-5 h-5" />

            {loading
              ? "Consultando..."
              : "Buscar"}

          </button>

          {/* ERROR */}

          {error && (

            <div className="mt-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">

              {error}

            </div>

          )}

        </div>

        {/* RESULTADO */}

        {consulta && (

          <div className="space-y-6">

            {/* RESUMEN */}

            <div className="bg-white rounded-xl shadow-lg p-6">

              <div className="flex items-start justify-between mb-6">

                <div>

                  <h3 className="text-2xl text-[#1e3a5f] mb-1">

                    {consulta.nombre_cliente}
                    {" "}
                    {consulta.apellido_cliente}

                  </h3>

                  <p className="text-[#546e7a]">

                    Medidor:
                    {" "}
                    {consulta.codigo_medidor}

                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* DEUDA */}

                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">

                  <DollarSign className="w-6 h-6 text-red-600 mb-2" />

                  <p className="text-sm text-[#546e7a] mb-1">

                    Deuda Total

                  </p>

                  <p className="text-3xl text-red-600">

                    Bs.
                    {" "}
                    {consulta.total_deuda}

                  </p>

                </div>

                {/* FACTURAS */}

                <div className="bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg p-4">

                  <AlertCircle className="w-6 h-6 text-[#1e5a8e] mb-2" />

                  <p className="text-sm text-[#546e7a] mb-1">

                    Facturas Pendientes

                  </p>

                  <p className="text-3xl text-[#1e3a5f]">

                    {consulta.cantidad_facturas_pendientes}

                  </p>

                </div>

                {/* MEDIDOR */}

                <div className="bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg p-4">

                  <Droplet className="w-6 h-6 text-[#1e5a8e] mb-2" />

                  <p className="text-sm text-[#546e7a] mb-1">

                    Código Medidor

                  </p>

                  <p className="text-xl text-[#1e3a5f]">

                    {consulta.codigo_medidor}

                  </p>

                </div>

              </div>

            </div>

            {/* FACTURAS */}

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h4 className="text-2xl text-[#1e3a5f] mb-6">

                Facturas

              </h4>

              {consulta.facturas.length > 0 ? (

                <div className="space-y-4">

                  {consulta.facturas.map(
                    (
                      factura,
                      index
                    ) => {

                      const config =
                        getStatusColor(
                          factura.estado
                        );

                      const Icon =
                        config.icon;

                      return (

                        <div
                          key={index}
                          className={`${config.bg} border-2 ${config.border} rounded-xl p-5`}
                        >

                          <div className="flex justify-between items-center">

                            <div className="flex items-center gap-3">

                              <Icon
                                className={`w-6 h-6 ${config.text}`}
                              />

                              <div>

                                <p className="text-lg text-[#1e3a5f]">

                                  {factura.periodo}

                                </p>

                                <p className="text-sm text-[#546e7a]">

                                  Vence:
                                  {" "}
                                  {new Date(
                                    factura.fecha_vencimiento
                                  ).toLocaleDateString(
                                    "es-ES"
                                  )}

                                </p>

                              </div>

                            </div>

                            <div className="text-right">

                              <p className="text-2xl text-[#1e3a5f]">

                                Bs.
                                {" "}
                                {factura.monto}

                              </p>

                              <span
                                className={`text-sm ${config.text}`}
                              >

                                {factura.estado}

                              </span>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              ) : (

                <div className="text-center py-10">

                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

                  <p className="text-green-600 text-xl">

                    No tiene facturas pendientes

                  </p>

                </div>

              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}