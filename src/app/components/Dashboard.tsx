import { Users, FileText, Droplets, DollarSign, Droplet, LogOut, Home, BookOpen, Settings, Gauge } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function Dashboard({ onLogout, onNavigate }: DashboardProps) {
  const stats = [
    {
      title: "Total Clientes",
      value: "1,248",
      icon: Users,
      color: "from-[#1e5a8e] to-[#4fc3f7]",
      bgColor: "bg-[#e3f2fd]",
    },
    {
      title: "Lecturas Registradas",
      value: "987",
      icon: FileText,
      color: "from-[#4fc3f7] to-[#80deea]",
      bgColor: "bg-[#e0f7fa]",
    },
    {
      title: "Cortes Registrados",
      value: "156",
      icon: Droplets,
      color: "from-[#0277bd] to-[#4fc3f7]",
      bgColor: "bg-[#b3e5fc]",
    },
    {
      title: "Recaudación Mensual",
      value: "$24,560",
      icon: DollarSign,
      color: "from-[#26c6da] to-[#80deea]",
      bgColor: "bg-[#e0f2f1]",
    },
  ];

  const quickLinks = [
    {
      title: "Gestión de Clientes",
      description: "Administrar información de clientes",
      icon: Users,
      color: "bg-gradient-to-br from-[#1e5a8e] to-[#4fc3f7]",
      page: "clients",
    },
    {
      title: "Gestión de Medidores",
      description: "Administrar medidores de agua",
      icon: Gauge,
      color: "bg-gradient-to-br from-[#4fc3f7] to-[#80deea]",
      page: "meters",
    },
    {
      title: "Gestión de Empleados",
      description: "Administrar personal y usuarios",
      icon: Users,
      color: "bg-gradient-to-br from-[#1e5a8e] to-[#26c6da]",
      page: "employees",
    },
    {
      title: "Registro de Lecturas",
      description: "Ingresar lecturas de medidores",
      icon: FileText,
      color: "bg-gradient-to-br from-[#0277bd] to-[#4fc3f7]",
      page: "readings",
    },
    {
      title: "Control de Cortes",
      description: "Gestionar cortes de servicio",
      icon: Droplets,
      color: "bg-gradient-to-br from-[#0277bd] to-[#26c6da]",
      page: "cuts",
    },
    {
      title: "Consulta de Facturas",
      description: "Verificar estado de cuenta",
      icon: DollarSign,
      color: "bg-gradient-to-br from-[#26c6da] to-[#80deea]",
      page: "debt",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] to-[#e3f2fd]">
      <header className="bg-gradient-to-r from-[#1e5a8e] to-[#4fc3f7] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl">ELAPAS</h1>
                <p className="text-sm text-white/80">Sistema de Gestión</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2 hover:text-[#80deea] transition-colors">
                <Home className="w-5 h-5" />
                Inicio
              </button>
              <button className="flex items-center gap-2 hover:text-[#80deea] transition-colors">
                <BookOpen className="w-5 h-5" />
                Reportes
              </button>
              <button onClick={() => onNavigate("settings")} className="flex items-center gap-2 hover:text-[#80deea] transition-colors">
                <Settings className="w-5 h-5" />
                Configuración
              </button>
            </nav>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl text-[#1e3a5f] mb-2">Dashboard Principal</h2>
          <p className="text-[#546e7a]">Resumen general del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-[#1e5a8e]" />
                  </div>
                </div>
                <h3 className="text-[#546e7a] text-sm mb-1">{stat.title}</h3>
                <p className={`text-3xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mb-8">
          <h3 className="text-2xl text-[#1e3a5f] mb-6">Accesos Rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <button
                  key={index}
                  onClick={() => onNavigate(link.page)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left group hover:scale-[1.02] duration-200"
                >
                  <div className={`${link.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-[#1e3a5f] text-xl mb-2">{link.title}</h4>
                  <p className="text-[#546e7a]">{link.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
