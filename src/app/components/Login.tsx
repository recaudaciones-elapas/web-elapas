import { useState } from "react";

import {
  Lock,
  Mail,
  Droplet,
  CreditCard,
} from "lucide-react";

// ========================================
// PROPS
// ========================================

interface LoginProps {
  onLogin: (
    userType: "client" | "admin"
  ) => void;
}

// ========================================
// COMPONENTE LOGIN
// ========================================

export function Login({
  onLogin,
}: LoginProps) {

  // ========================================
  // ESTADOS
  // ========================================

  const [loginType, setLoginType] =
    useState<"client" | "admin">(
      "client"
    );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [ci, setCI] =
    useState("");

  const [codigoMedidor, setCodigoMedidor] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ========================================
  // API
  // ========================================

  const API_BASE =
    "https://fastapi-app-latest-ride.onrender.com/api/v1";

  // ========================================
  // LOGIN
  // ========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      // ========================================
      // LOGIN CLIENTE
      // ========================================

      if (loginType === "client") {

        if (!ci || !codigoMedidor) {

          setError(
            "Ingrese CI y Código de Medidor"
          );

          return;
        }

        // ========================================
        // CONSULTA DEUDA
        // ========================================

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
            "CI o código de medidor incorrecto"
          );
        }

        const data =
          await response.json();

        console.log(
          "CONSULTA CLIENTE:",
          data
        );

        // ========================================
        // GUARDAR DATOS
        // ========================================

        localStorage.setItem(
          "clienteConsulta",
          JSON.stringify(data)
        );

        localStorage.setItem(
          "userType",
          "client"
        );

        onLogin("client");
      }

      // ========================================
      // LOGIN EMPLEADO
      // ========================================

      else {

        if (!email || !password) {

          setError(
            "Ingrese correo y contraseña"
          );

          return;
        }

        const formData =
          new URLSearchParams();

        formData.append(
          "username",
          email
        );

        formData.append(
          "password",
          password
        );

        const response = await fetch(
          `${API_BASE}/auth/login`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {

          throw new Error(
            "Correo o contraseña incorrectos"
          );
        }

        const data =
          await response.json();

        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "userType",
          "admin"
        );

        onLogin("admin");
      }

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ||
          "Error al iniciar sesión"
      );

    } finally {

      setLoading(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e5a8e] via-[#4fc3f7] to-[#80deea] p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* LOGO */}

          <div className="flex flex-col items-center mb-8">

            <div className="w-20 h-20 bg-gradient-to-br from-[#1e5a8e] to-[#4fc3f7] rounded-full flex items-center justify-center mb-4 shadow-lg">

              <Droplet className="w-10 h-10 text-white" />

            </div>

            <h1 className="text-3xl text-[#1e3a5f] text-center">
              ELAPAS
            </h1>

            <p className="text-[#546e7a] text-center mt-2">
              Sistema de Gestión de Medidores
            </p>

          </div>

          {/* TABS */}

          <div className="flex gap-2 mb-6">

            <button
              type="button"
              onClick={() =>
                setLoginType("client")
              }
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginType === "client"
                  ? "bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white"
                  : "bg-[#f1f8fb] text-[#546e7a]"
              }`}
            >

              Consulta de Cuenta

            </button>

            <button
              type="button"
              onClick={() =>
                setLoginType("admin")
              }
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginType === "admin"
                  ? "bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white"
                  : "bg-[#f1f8fb] text-[#546e7a]"
              }`}
            >

              Personal

            </button>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {loginType === "client" ? (

              <>
                {/* CI */}

                <div>

                  <label
                    htmlFor="ci"
                    className="block text-[#1e3a5f] mb-2"
                  >

                    Cédula de Identidad

                  </label>

                  <div className="relative">

                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

                    <input
                      id="ci"
                      type="text"
                      value={ci}
                      onChange={(e) =>
                        setCI(
                          e.target.value
                        )
                      }
                      className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                      placeholder="Ingrese su CI"
                    />

                  </div>

                </div>

                {/* MEDIDOR */}

                <div>

                  <label
                    htmlFor="medidor"
                    className="block text-[#1e3a5f] mb-2"
                  >

                    Código de Medidor

                  </label>

                  <div className="relative">

                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

                    <input
                      id="medidor"
                      type="text"
                      value={codigoMedidor}
                      onChange={(e) =>
                        setCodigoMedidor(
                          e.target.value
                        )
                      }
                      className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                      placeholder="Ej: MED-1001"
                    />

                  </div>

                </div>
              </>

            ) : (

              <>
                {/* EMAIL */}

                <div>

                  <label className="block text-[#1e3a5f] mb-2">
                    Correo Electrónico
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                      placeholder="Ingrese su correo"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="block text-[#1e3a5f] mb-2">
                    Contraseña
                  </label>

                  <div className="relative">

                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#546e7a]" />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      className="w-full pl-11 pr-4 py-3 bg-[#f1f8fb] border-2 border-[#b3e5fc] rounded-lg focus:outline-none focus:border-[#4fc3f7]"
                      placeholder="Ingrese su contraseña"
                    />

                  </div>

                </div>
              </>
            )}

            {/* ERROR */}

            {error && (

              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">

                {error}

              </div>

            )}

            {/* BOTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white py-3 rounded-lg hover:shadow-lg disabled:opacity-50"
            >

              {loading
                ? "Ingresando..."
                : "Iniciar Sesión"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}