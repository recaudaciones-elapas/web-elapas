import { ArrowLeft, Moon, Sun, User, Mail, Phone, Shield } from "lucide-react";
import { useState, useEffect } from "react";

interface SettingsProps {
  onBack: () => void;
  userType: "client" | "admin";
}

export function Settings({ onBack, userType }: SettingsProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const adminUser = {
    nombre: "Pedro",
    apellido: "González",
    email: "pedro.gonzalez@elapas.com",
    rol: "Administrador",
    telefono: "555-1111",
  };

  const clientUser = {
    nombre: "Juan",
    apellido: "Pérez García",
    ci: "1234567",
    email: "juan.perez@email.com",
    telefono: "555-0123",
    direccion: "Av. Principal #123, Sector Centro",
  };

  const currentUser = userType === "admin" ? adminUser : clientUser;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd] dark:from-gray-900 dark:to-gray-800 p-6 transition-colors">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1e5a8e] dark:text-[#4fc3f7] hover:text-[#4fc3f7] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-3xl text-[#1e3a5f] dark:text-white mb-6">Configuración</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-[#1e3a5f] dark:text-white mb-4">Apariencia</h3>
                <div className="flex items-center justify-between p-4 bg-[#f1f8fb] dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {theme === "light" ? (
                      <Sun className="w-6 h-6 text-[#1e5a8e] dark:text-[#4fc3f7]" />
                    ) : (
                      <Moon className="w-6 h-6 text-[#1e5a8e] dark:text-[#4fc3f7]" />
                    )}
                    <div>
                      <p className="text-[#1e3a5f] dark:text-white">Tema</p>
                      <p className="text-sm text-[#546e7a] dark:text-gray-400">
                        {theme === "light" ? "Modo Claro" : "Modo Oscuro"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      theme === "dark" ? "bg-[#4fc3f7]" : "bg-[#b3e5fc]"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        theme === "dark" ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl text-[#1e3a5f] dark:text-white mb-6">Información del Usuario</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-[#f1f8fb] dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-[#1e5a8e] dark:text-[#4fc3f7] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-[#546e7a] dark:text-gray-400">Nombre Completo</p>
                  <p className="text-[#1e3a5f] dark:text-white">
                    {currentUser.nombre} {currentUser.apellido}
                  </p>
                </div>
              </div>

              {userType === "admin" && (
                <div className="flex items-start gap-3 p-4 bg-[#f1f8fb] dark:bg-gray-700 rounded-lg">
                  <Shield className="w-5 h-5 text-[#1e5a8e] dark:text-[#4fc3f7] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-[#546e7a] dark:text-gray-400">Rol</p>
                    <p className="text-[#1e3a5f] dark:text-white">{adminUser.rol}</p>
                  </div>
                </div>
              )}

              {userType === "client" && "ci" in currentUser && (
                <div className="flex items-start gap-3 p-4 bg-[#f1f8fb] dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-[#1e5a8e] dark:text-[#4fc3f7] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-[#546e7a] dark:text-gray-400">Cédula de Identidad</p>
                    <p className="text-[#1e3a5f] dark:text-white">{currentUser.ci}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-[#f1f8fb] dark:bg-gray-700 rounded-lg">
                <Mail className="w-5 h-5 text-[#1e5a8e] dark:text-[#4fc3f7] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-[#546e7a] dark:text-gray-400">Email</p>
                  <p className="text-[#1e3a5f] dark:text-white">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#f1f8fb] dark:bg-gray-700 rounded-lg">
                <Phone className="w-5 h-5 text-[#1e5a8e] dark:text-[#4fc3f7] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-[#546e7a] dark:text-gray-400">Teléfono</p>
                  <p className="text-[#1e3a5f] dark:text-white">{currentUser.telefono}</p>
                </div>
              </div>

              {userType === "client" && "direccion" in currentUser && (
                <div className="flex items-start gap-3 p-4 bg-[#f1f8fb] dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-[#1e5a8e] dark:text-[#4fc3f7] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-[#546e7a] dark:text-gray-400">Dirección</p>
                    <p className="text-[#1e3a5f] dark:text-white">{currentUser.direccion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
