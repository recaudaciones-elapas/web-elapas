import {
  ArrowLeft,
  User,
  MapPin,
  Gauge,
  DollarSign,
  FileText,
  Droplets,
  Mail,
  Phone,
  CreditCard,
  AlertCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

// ========================================
// INTERFACES
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
}

interface Meter {
  id_medidor: string;
  codigo: string;
  estado: string;
}

interface Reading {
  id_lectura: string;
  fecha: string;
  lectura_actual: number;
  lectura_anterior: number;
  consumo: number;
}

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

// ========================================
// COMPONENTE
// ========================================

export function ClientDetail({
  clientId,
  onBack,
}: ClientDetailProps) {

  // ========================================
  // ESTADOS
  // ========================================

  const [client, setClient] =
    useState<Client | null>(null);

  const [meter, setMeter] =
    useState<Meter | null>(null);

  const [readings, setReadings] =
    useState<Reading[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ========================================
  // API
  // ========================================

  const API_BASE =
    "https://fastapi-app-latest-ride.onrender.com/api/v1";

  // ========================================
  // CARGAR DATOS
  // ========================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        setError("");

        const token =
          localStorage.getItem("token");

        // ========================================
        // CLIENTE
        // ========================================

        const clientResponse =
          await fetch(
            `${API_BASE}/clientes/${clientId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!clientResponse.ok) {

          throw new Error(
            "Error al cargar cliente"
          );
        }

        const clientData =
          await clientResponse.json();

        console.log(
          "CLIENTE:",
          clientData
        );

        setClient(clientData);

        // ========================================
        // MEDIDOR
        // ========================================

        const meterResponse =
          await fetch(
            `${API_BASE}/medidores/cliente/${clientId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (meterResponse.ok) {

          const meterData =
            await meterResponse.json();

          console.log(
            "MEDIDOR:",
            meterData
          );

          let medidor = null;

          if (
            Array.isArray(meterData)
          ) {

            medidor =
              meterData[0];

          } else {

            medidor =
              meterData;
          }

          setMeter(medidor);

          // ========================================
          // LECTURAS
          // ========================================

          if (
            medidor?.id_medidor
          ) {

            const readingsResponse =
              await fetch(
                `${API_BASE}/lecturas/medidor/${medidor.id_medidor}`,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );

            if (
              readingsResponse.ok
            ) {

              const readingsData =
                await readingsResponse.json();

              console.log(
                "LECTURAS:",
                readingsData
              );

              let lecturas =
                Array.isArray(
                  readingsData
                )
                  ? readingsData
                  : [];

              // ORDENAR DESCENDENTE

              lecturas.sort(
                (
                  a: Reading,
                  b: Reading
                ) =>
                  new Date(
                    b.fecha
                  ).getTime() -
                  new Date(
                    a.fecha
                  ).getTime()
              );

              setReadings(
                lecturas
              );
            }
          }
        }

      } catch (err: any) {

        console.error(err);

        setError(
          err.message ||
            "Error al cargar datos"
        );

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, [clientId]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p className="text-[#1e5a8e] text-xl">
          Cargando cliente...
        </p>

      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center gap-4">

        <p className="text-red-600">
          {error}
        </p>

        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >

          Volver

        </button>

      </div>
    );
  }

  // ========================================
  // CLIENTE NO EXISTE
  // ========================================

  if (!client) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Cliente no encontrado

      </div>
    );
  }

  // ========================================
  // HELPERS
  // ========================================

  const estadoActivo =
    client.estado
      ?.toLowerCase()
      .trim() === "activo";

  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] p-6">

      <div className="container mx-auto max-w-6xl">

        {/* BOTON VOLVER */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6"
        >

          <ArrowLeft className="w-5 h-5" />

          Volver al Listado

        </button>

        {/* CLIENTE */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

          <div className="flex items-start gap-4 mb-6">

            <div className="w-16 h-16 bg-gradient-to-br from-[#1e5a8e] to-[#4fc3f7] rounded-full flex items-center justify-center">

              <User className="w-8 h-8 text-white" />

            </div>

            <div className="flex-1">

              <h2 className="text-3xl text-[#1e3a5f] mb-2">

                {client.nombre} {client.apellido}

              </h2>

              <div className="flex items-center gap-2 text-[#546e7a]">

                <CreditCard className="w-4 h-4" />

                CI: {client.ci}

              </div>

            </div>

            <span
              className={`px-4 py-2 rounded-full font-semibold ${
                estadoActivo
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              {client.estado}

            </span>

          </div>

          {/* INFORMACION */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-[#f1f8fb] rounded-lg p-4">

              <div className="flex items-center gap-3 mb-3">

                <MapPin className="w-5 h-5 text-[#1e5a8e]" />

                <h3 className="text-[#1e3a5f]">
                  Dirección
                </h3>

              </div>

              <p className="text-[#546e7a]">

                {client.direccion ||
                  "Sin dirección"}

              </p>

            </div>

            <div className="bg-[#f1f8fb] rounded-lg p-4">

              <div className="flex items-center gap-3 mb-3">

                <Phone className="w-5 h-5 text-[#1e5a8e]" />

                <h3 className="text-[#1e3a5f]">
                  Contacto
                </h3>

              </div>

              <p className="text-[#546e7a] mb-2">

                Teléfono:
                {" "}
                {client.telefono ||
                  "Sin teléfono"}

              </p>

              <div className="flex items-center gap-2 text-[#546e7a]">

                <Mail className="w-4 h-4" />

                {client.email ||
                  "Sin email"}

              </div>

            </div>

          </div>

        </div>

        {/* MEDIDOR */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">

            <Gauge className="w-6 h-6 text-[#1e5a8e]" />

            <h3 className="text-2xl text-[#1e3a5f]">

              Información del Medidor

            </h3>

          </div>

          {meter ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <p className="text-sm text-[#546e7a]">
                  Código
                </p>

                <p className="text-[#1e3a5f]">
                  {meter.codigo}
                </p>

              </div>

              <div>

                <p className="text-sm text-[#546e7a]">
                  Estado
                </p>

                <p className="text-[#1e3a5f]">
                  {meter.estado}
                </p>

              </div>

            </div>

          ) : (

            <p className="text-[#546e7a]">
              Sin medidor registrado
            </p>

          )}

        </div>

        {/* LECTURAS */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <div className="flex items-center gap-3 mb-6">

            <FileText className="w-6 h-6 text-[#1e5a8e]" />

            <h3 className="text-2xl text-[#1e3a5f]">

              Historial de Lecturas

            </h3>

          </div>

          {readings.length > 0 ? (

            <div className="space-y-4">

              {readings.map((reading) => (

                <div
                  key={reading.id_lectura}
                  className="bg-[#f1f8fb] rounded-lg p-4 flex items-center justify-between"
                >

                  <div>

                    <p className="text-[#1e3a5f] font-semibold">

                      {new Date(
                        reading.fecha
                      ).toLocaleDateString("es-ES")}

                    </p>

                    <p className="text-sm text-[#546e7a]">

                      Anterior:
                      {" "}
                      {reading.lectura_anterior} m³

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[#1e5a8e] font-semibold">

                      {reading.lectura_actual} m³

                    </p>

                    <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                      <Droplets className="w-4 h-4" />

                      {reading.consumo} m³

                    </div>

                  </div>

                </div>
              ))}

            </div>

          ) : (

            <div className="text-center py-10 text-[#546e7a]">

              No hay lecturas registradas

            </div>

          )}

        </div>

      </div>

    </div>
  );
}