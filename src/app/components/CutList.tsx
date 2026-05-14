import { Search, ArrowLeft, Calendar, Droplets, Camera, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface Cut {
  id: string;
  clientCode: string;
  clientName: string;
  date: string;
  reason: string;
  observations: string;
  status: "Pendiente" | "Ejecutado" | "Reconectado";
  hasPhoto: boolean;
}

interface CutListProps {
  onBack: () => void;
}

export function CutList({ onBack }: CutListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingCut, setEditingCut] = useState<Cut | null>(null);

  const handleEdit = (cut: Cut) => {
    setEditingCut(cut);
    setShowRegisterForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar este corte?")) {
      console.log("Eliminar corte:", id);
    }
  };

  const cuts: Cut[] = [
    { id: "1", clientCode: "CLT-001", clientName: "Juan Pérez García", date: "2026-04-28", reason: "Falta de pago - 3 meses", observations: "Cliente no ubicado en domicilio", status: "Ejecutado", hasPhoto: true },
    { id: "2", clientCode: "CLT-003", clientName: "Carlos Martínez Silva", date: "2026-04-27", reason: "Falta de pago - 2 meses", observations: "Corte realizado sin novedad", status: "Ejecutado", hasPhoto: true },
    { id: "3", clientCode: "CLT-006", clientName: "Laura Torres Vega", date: "2026-04-26", reason: "Solicitud de cliente", observations: "Cliente solicita suspensión temporal", status: "Ejecutado", hasPhoto: false },
    { id: "4", clientCode: "CLT-008", clientName: "Pedro Ramírez Álvarez", date: "2026-04-25", reason: "Falta de pago - 4 meses", observations: "Pendiente de ejecución", status: "Pendiente", hasPhoto: false },
    { id: "5", clientCode: "CLT-001", clientName: "Juan Pérez García", date: "2026-02-10", reason: "Falta de pago", observations: "Servicio reconectado tras pago", status: "Reconectado", hasPhoto: true },
  ];

  const filteredCuts = cuts.filter((cut) => {
    const matchesSearch =
      cut.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cut.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cut.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || cut.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Cut["status"]) => {
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
              <h2 className="text-3xl text-[#1e3a5f]">Registro de Cortes</h2>
            </div>
            <button
              onClick={() => {
                setEditingCut(null);
                setShowRegisterForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Registrar Corte
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente, código o motivo..."
                className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7] transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7] transition-colors"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Ejecutado">Ejecutado</option>
              <option value="Reconectado">Reconectado</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#b3e5fc]">
                  <th className="text-left py-3 px-4 text-[#1e3a5f]">Fecha</th>
                  <th className="text-left py-3 px-4 text-[#1e3a5f]">Código</th>
                  <th className="text-left py-3 px-4 text-[#1e3a5f]">Cliente</th>
                  <th className="text-left py-3 px-4 text-[#1e3a5f]">Motivo</th>
                  <th className="text-left py-3 px-4 text-[#1e3a5f]">Observaciones</th>
                  <th className="text-center py-3 px-4 text-[#1e3a5f]">Evidencia</th>
                  <th className="text-center py-3 px-4 text-[#1e3a5f]">Estado</th>
                  <th className="text-center py-3 px-4 text-[#1e3a5f]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCuts.map((cut) => (
                  <tr
                    key={cut.id}
                    className="border-b border-[#e3f2fd] hover:bg-[#f1f8fb] transition-colors"
                  >
                    <td className="py-4 px-4 text-[#1e3a5f]">
                      {new Date(cut.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-4 px-4 text-[#1e3a5f]">{cut.clientCode}</td>
                    <td className="py-4 px-4 text-[#1e3a5f]">{cut.clientName}</td>
                    <td className="py-4 px-4 text-[#546e7a]">{cut.reason}</td>
                    <td className="py-4 px-4 text-[#546e7a] text-sm">{cut.observations}</td>
                    <td className="py-4 px-4 text-center">
                      {cut.hasPhoto ? (
                        <div className="inline-flex items-center gap-1 text-[#1e5a8e]">
                          <Camera className="w-5 h-5" />
                          <span className="text-sm">Sí</span>
                        </div>
                      ) : (
                        <span className="text-[#546e7a] text-sm">No</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(cut.status)}`}>
                        {cut.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cut)}
                          className="p-2 text-[#1e5a8e] hover:bg-[#e3f2fd] rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cut.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
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

          {filteredCuts.length === 0 && (
            <div className="text-center py-12 text-[#546e7a]">
              No se encontraron cortes con los criterios seleccionados
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t-2 border-[#e3f2fd] pt-4">
            <p className="text-[#546e7a]">
              Mostrando {filteredCuts.length} de {cuts.length} cortes registrados
            </p>
          </div>
        </div>
      </div>

      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl text-[#1e3a5f] mb-6">
              {editingCut ? "Editar Corte" : "Registrar Nuevo Corte"}
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#1e3a5f] mb-2">Medidor</label>
                  <select className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]">
                    <option value="">Seleccione un medidor</option>
                    <option value="MED-1001">MED-1001 - Juan Pérez García</option>
                    <option value="MED-1002">MED-1002 - María López Rodríguez</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#1e3a5f] mb-2">Fecha del Corte</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                  />
                </div>
                <div>
                  <label className="block text-[#1e3a5f] mb-2">Estado</label>
                  <select className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]">
                    <option value="pendiente">Pendiente</option>
                    <option value="ejecutado">Ejecutado</option>
                    <option value="reconectado">Reconectado</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#1e3a5f] mb-2">Motivo</label>
                  <input
                    type="text"
                    placeholder="Ej: Falta de pago"
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#1e3a5f] mb-2">Observaciones</label>
                  <textarea
                    rows={3}
                    placeholder="Detalles adicionales..."
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                  />
                </div>
                <div>
                  <label className="block text-[#1e3a5f] mb-2">Latitud</label>
                  <input
                    type="text"
                    placeholder="-16.5000"
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                  />
                </div>
                <div>
                  <label className="block text-[#1e3a5f] mb-2">Longitud</label>
                  <input
                    type="text"
                    placeholder="-68.1500"
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#1e3a5f] mb-2">Evidencia Fotográfica</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setEditingCut(null);
                  }}
                  className="flex-1 px-4 py-2 bg-[#f1f8fb] text-[#546e7a] rounded-lg hover:bg-[#e3f2fd] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingCut ? "Actualizar" : "Guardar"} Corte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
