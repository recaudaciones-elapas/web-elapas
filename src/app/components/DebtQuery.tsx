import { Search, ArrowLeft, DollarSign, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { useState } from "react";

interface DebtQueryProps {
  onBack: () => void;
}

interface DebtInfo {
  clientCode: string;
  clientName: string;
  meterNumber: string;
  totalDebt: number;
  monthsOverdue: number;
  lastPaymentDate: string;
  lastUpdateDate: string;
  status: "Al día" | "Atrasado" | "Crítico";
  details: Array<{
    month: string;
    amount: number;
    status: "Pagado" | "Pendiente";
  }>;
}

export function DebtQuery({ onBack }: DebtQueryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<DebtInfo | null>(null);

  const clients = [
    { code: "CLT-001", name: "Juan Pérez García" },
    { code: "CLT-002", name: "María López Rodríguez" },
    { code: "CLT-003", name: "Carlos Martínez Silva" },
    { code: "CLT-004", name: "Ana Sánchez Gómez" },
    { code: "CLT-005", name: "Roberto Díaz Fernández" },
    { code: "CLT-006", name: "Laura Torres Vega" },
  ];

  const debtData: Record<string, DebtInfo> = {
    "CLT-001": {
      clientCode: "CLT-001",
      clientName: "Juan Pérez García",
      meterNumber: "MED-1001",
      totalDebt: 125.50,
      monthsOverdue: 2,
      lastPaymentDate: "15/02/2026",
      lastUpdateDate: "28/04/2026",
      status: "Atrasado",
      details: [
        { month: "Abril 2026", amount: 45.50, status: "Pendiente" },
        { month: "Marzo 2026", amount: 80.00, status: "Pendiente" },
        { month: "Febrero 2026", amount: 42.00, status: "Pagado" },
        { month: "Enero 2026", amount: 38.00, status: "Pagado" },
      ],
    },
    "CLT-002": {
      clientCode: "CLT-002",
      clientName: "María López Rodríguez",
      meterNumber: "MED-1002",
      totalDebt: 0,
      monthsOverdue: 0,
      lastPaymentDate: "20/04/2026",
      lastUpdateDate: "28/04/2026",
      status: "Al día",
      details: [
        { month: "Abril 2026", amount: 52.00, status: "Pagado" },
        { month: "Marzo 2026", amount: 48.00, status: "Pagado" },
        { month: "Febrero 2026", amount: 51.00, status: "Pagado" },
      ],
    },
    "CLT-003": {
      clientCode: "CLT-003",
      clientName: "Carlos Martínez Silva",
      meterNumber: "MED-1003",
      totalDebt: 350.00,
      monthsOverdue: 4,
      lastPaymentDate: "10/12/2025",
      lastUpdateDate: "28/04/2026",
      status: "Crítico",
      details: [
        { month: "Abril 2026", amount: 95.00, status: "Pendiente" },
        { month: "Marzo 2026", amount: 88.00, status: "Pendiente" },
        { month: "Febrero 2026", amount: 82.00, status: "Pendiente" },
        { month: "Enero 2026", amount: 85.00, status: "Pendiente" },
      ],
    },
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (clientCode: string) => {
    const debt = debtData[clientCode];
    setSelectedClient(debt || null);
  };

  const getStatusConfig = (status: DebtInfo["status"]) => {
    switch (status) {
      case "Al día":
        return { color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", icon: CheckCircle };
      case "Atrasado":
        return { color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", icon: AlertCircle };
      case "Crítico":
        return { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", icon: AlertCircle };
      default:
        return { color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200", icon: AlertCircle };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-[#1e5a8e]" />
            <h2 className="text-3xl text-[#1e3a5f]">Consulta de Deuda</h2>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente por nombre o código..."
              className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7] transition-colors"
            />
          </div>

          {searchTerm && filteredClients.length > 0 && !selectedClient && (
            <div className="bg-[#f1f8fb] rounded-lg border-2 border-[#b3e5fc] p-4 mb-6">
              <p className="text-[#546e7a] mb-3">Resultados de búsqueda:</p>
              <div className="space-y-2">
                {filteredClients.map((client) => (
                  <button
                    key={client.code}
                    onClick={() => handleSearch(client.code)}
                    className="w-full text-left p-3 bg-white hover:bg-[#e3f2fd] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[#1e3a5f]">{client.name}</p>
                      <p className="text-sm text-[#546e7a]">{client.code}</p>
                    </div>
                    <Search className="w-5 h-5 text-[#4fc3f7]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl text-[#1e3a5f] mb-1">{selectedClient.clientName}</h3>
                  <p className="text-[#546e7a]">Código: {selectedClient.clientCode}</p>
                  <p className="text-[#546e7a]">Medidor: {selectedClient.meterNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-[#1e5a8e] hover:text-[#4fc3f7] transition-colors"
                >
                  Nueva búsqueda
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className={`${getStatusConfig(selectedClient.status).bgColor} border-2 ${getStatusConfig(selectedClient.status).borderColor} rounded-lg p-4`}>
                  {(() => {
                    const StatusIcon = getStatusConfig(selectedClient.status).icon;
                    return <StatusIcon className={`w-6 h-6 ${getStatusConfig(selectedClient.status).color} mb-2`} />;
                  })()}
                  <p className="text-sm text-[#546e7a] mb-1">Estado</p>
                  <p className={`text-xl ${getStatusConfig(selectedClient.status).color}`}>
                    {selectedClient.status}
                  </p>
                </div>

                <div className="bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg p-4">
                  <DollarSign className="w-6 h-6 text-[#1e5a8e] mb-2" />
                  <p className="text-sm text-[#546e7a] mb-1">Monto Adeudado</p>
                  <p className="text-3xl text-[#1e3a5f]">${selectedClient.totalDebt.toFixed(2)}</p>
                  {selectedClient.monthsOverdue > 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      {selectedClient.monthsOverdue} {selectedClient.monthsOverdue === 1 ? "mes" : "meses"} atrasado
                    </p>
                  )}
                </div>

                <div className="bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg p-4">
                  <Calendar className="w-6 h-6 text-[#1e5a8e] mb-2" />
                  <p className="text-sm text-[#546e7a] mb-1">Último Pago</p>
                  <p className="text-lg text-[#1e3a5f]">{selectedClient.lastPaymentDate}</p>
                  <p className="text-xs text-[#546e7a] mt-2">
                    Actualizado: {selectedClient.lastUpdateDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-xl text-[#1e3a5f] mb-4">Detalle de Deuda</h4>
              <div className="space-y-3">
                {selectedClient.details.map((detail, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      detail.status === "Pagado" ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {detail.status === "Pagado" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-[#1e3a5f]">{detail.month}</p>
                        <p className={`text-sm ${detail.status === "Pagado" ? "text-green-600" : "text-red-600"}`}>
                          {detail.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-[#1e3a5f]">${detail.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!selectedClient && !searchTerm && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Search className="w-16 h-16 text-[#b3e5fc] mx-auto mb-4" />
            <p className="text-[#546e7a] text-lg">
              Ingrese el nombre o código del cliente para consultar su estado de deuda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
