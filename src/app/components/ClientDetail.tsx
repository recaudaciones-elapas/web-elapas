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

interface DebtData {
  deuda_total?: number;
  total_deuda?: number;
  deuda?: number;
}

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

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

  const [debt, setDebt] =
    useState<number>(0);

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
  // FETCH DATA
  // ========================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        setError("");

        const token =
          localStorage.getItem("token");

        // ========================================
        // 1. BUSCAR CLIENTE POR CI
        // ========================================

        const searchResponse =
          await fetch(
            `${API_BASE}/clientes/buscar?q=${clientId}`,
            {
              method: "GET",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!searchResponse.ok) {

          throw new Error(
            "No se pudo buscar el cliente"
          );
        }

        const searchData =
          await searchResponse.json();

        if (
          !Array.isArray(searchData) ||
          searchData.length === 0
        ) {

          throw new Error(
            "Cliente no encontrado"
          );
        }

        // ========================================
        // CLIENTE REAL
        // ========================================

        const clienteReal =
          searchData[0];

        setClient(clienteReal);

        const realClientId =
          clienteReal.id_cliente;

        console.log(
          "CLIENTE:",
          clienteReal
        );

        // ========================================
        // 2. DEUDA
        // ========================================

        try {

          const debtResponse =
            await fetch(
              `${API_BASE}/consulta-deuda/${realClientId}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (debtResponse.ok) {

            const debtData: DebtData =
              await debtResponse.json();

            console.log(
              "DEUDA:",
              debtData
            );

            setDebt(
              Number(
                debtData.deuda_total ||
                debtData.total_deuda ||
                debtData.deuda ||
                0
              )
            );
          }

        } catch (err) {

          console.log(
            "Sin deuda"
          );
        }

        // ========================================
        // 3. MEDIDOR
        // ========================================

        try {

          const meterResponse =
            await fetch(
              `${API_BASE}/medidores/cliente/${realClientId}`,
              {
                method: "GET",
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
              "MEDIDORES:",
              meterData
            );

            if (
              Array.isArray(meterData) &&
              meterData.length > 0
            ) {

              const medidor =
                meterData[0];

              setMeter(medidor);

              // ========================================
              // 4. LECTURAS
              // ========================================

              const readingsResponse =
                await fetch(
                  `${API_BASE}/lecturas/medidor/${medidor.id_medidor}`,
                  {
                    method: "GET",
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

        } catch (err) {

          console.log(
            "Sin medidor"
          );
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

    if (clientId) {

      fetchData();
    }

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
  // CLIENTE NO ENCONTRADO
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

        {/* VOLVER */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] hover:text-[#4fc3f7] mb-6"
        >

          <ArrowLeft className="w-5 h-5" />

          Volver al Listado

        </button>

        {/* CLIENTE */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

          <div className="flex items-start justify-between gap-4 mb-6">

            <div className="flex gap-4">

              <div className="w-16 h-16 bg-gradient-to-br from-[#1e5a8e] to-[#4fc3f7] rounded-full flex items-center justify-center">

                <User className="w-8 h-8 text-white" />

              </div>

              <div>

                <h2 className="text-3xl text-[#1e3a5f]">

                  {client.nombre} {client.apellido}

                </h2>

                <div className="flex items-center gap-2 text-[#546e7a] mt-2">

                  <CreditCard className="w-4 h-4" />

                  CI: {client.ci}

                </div>

              </div>

            </div>

            <div className="text-right">

              <p className="text-sm text-[#546e7a]">
                Deuda Actual
              </p>

              <p className="text-3xl text-red-600">

                Bs. {debt.toFixed(2)}

              </p>

            </div>

          </div>

          {/* INFO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* DIRECCION */}

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

            {/* CONTACTO */}

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

            {/* MEDIDOR */}

            <div className="bg-[#f1f8fb] rounded-lg p-4">

              <div className="flex items-center gap-3 mb-3">

                <Gauge className="w-5 h-5 text-[#1e5a8e]" />

                <h3 className="text-[#1e3a5f]">
                  Medidor
                </h3>

              </div>

              {meter ? (

                <>
                  <p className="text-[#546e7a]">

                    Código:
                    {" "}
                    {meter.codigo}

                  </p>

                  <p className="text-[#546e7a]">

                    Estado:
                    {" "}
                    {meter.estado}

                  </p>
                </>

              ) : (

                <p className="text-[#546e7a]">
                  Sin medidor registrado
                </p>
              )}

            </div>

            {/* ESTADO */}

            <div className="bg-[#f1f8fb] rounded-lg p-4">

              <div className="flex items-center gap-3 mb-3">

                <DollarSign className="w-5 h-5 text-[#1e5a8e]" />

                <h3 className="text-[#1e3a5f]">
                  Estado de Cuenta
                </h3>

              </div>

              <p
                className={
                  debt > 0
                    ? "text-red-600"
                    : "text-green-600"
                }
              >

                {debt > 0
                  ? "Con deuda pendiente"
                  : "Al día"}

              </p>

              <p
                className={`mt-2 ${
                  estadoActivo
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >

                Cliente {client.estado}

              </p>

            </div>

          </div>

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