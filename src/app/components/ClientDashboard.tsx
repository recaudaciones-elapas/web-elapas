import {
  Droplet,
  LogOut,
  FileText,
  DollarSign,
  AlertCircle,
  Settings
} from "lucide-react";

interface ClientDashboardProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function ClientDashboard({
  onLogout,
  onNavigate
}: ClientDashboardProps) {

  const consultaStorage =
    localStorage.getItem(
      "clienteConsulta"
    );

  const consulta =
    consultaStorage
      ? JSON.parse(consultaStorage)
      : null;

  const facturas =
    consulta?.facturas || [];

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd]">

      {/* HEADER */}

      <header className="bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white shadow-lg">

        <div className="container mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">

                <Droplet className="w-6 h-6" />

              </div>

              <div>

                <h1 className="text-2xl">
                  ELAPAS
                </h1>

                <p className="text-sm text-white/80">
                  Portal del Cliente
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="hidden md:block text-right">

                <p className="text-sm text-white/80">
                  Bienvenido
                </p>

                <p>
                  {consulta?.nombre_cliente}
                  {" "}
                  {consulta?.apellido_cliente}
                </p>

              </div>

              <button
                onClick={() =>
                  onNavigate("settings")
                }
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
              >

                <Settings className="w-5 h-5" />

              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
              >

                <LogOut className="w-5 h-5" />

                <span className="hidden md:inline">
                  Salir
                </span>

              </button>

            </div>

          </div>

        </div>

      </header>

      {/* MAIN */}

      <main className="container mx-auto px-6 py-8">

        {/* RESUMEN */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* DEUDA */}

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">

            <div className="flex items-center gap-3 mb-3">

              <DollarSign className="w-8 h-8 text-red-600" />

              <h2 className="text-xl text-[#1e3a5f]">
                Deuda Total
              </h2>

            </div>

            <p className="text-4xl text-red-600">

              Bs.
              {" "}
              {consulta?.total_deuda || 0}

            </p>

          </div>

          {/* FACTURAS */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="flex items-center gap-3 mb-3">

              <FileText className="w-8 h-8 text-[#1e5a8e]" />

              <h2 className="text-xl text-[#1e3a5f]">
                Facturas Pendientes
              </h2>

            </div>

            <p className="text-4xl text-[#1e5a8e]">

              {consulta?.cantidad_facturas_pendientes || 0}

            </p>

          </div>

          {/* MEDIDOR */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="flex items-center gap-3 mb-3">

              <AlertCircle className="w-8 h-8 text-[#1e5a8e]" />

              <h2 className="text-xl text-[#1e3a5f]">
                Medidor
              </h2>

            </div>

            <p className="text-2xl text-[#1e3a5f]">

              {consulta?.codigo_medidor}

            </p>

          </div>

        </div>

        {/* FACTURAS */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl text-[#1e3a5f] mb-6">

            Facturas Pendientes

          </h2>

          {facturas.length > 0 ? (

            <div className="space-y-4">

              {facturas.map(
                (
                  factura: any,
                  index: number
                ) => (

                  <div
                    key={index}
                    className="border-2 border-[#b3e5fc] rounded-xl p-5 bg-[#f8fbfd]"
                  >

                    <div className="flex justify-between items-center mb-3">

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

                      <span className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm">

                        {factura.estado}

                      </span>

                    </div>

                    <p className="text-3xl text-red-600">

                      Bs.
                      {" "}
                      {factura.monto}

                    </p>

                  </div>
                )
              )}

            </div>

          ) : (

            <div className="text-center py-10">

              <Droplet className="w-16 h-16 text-green-500 mx-auto mb-4" />

              <p className="text-green-600 text-xl">

                No tiene facturas pendientes

              </p>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}