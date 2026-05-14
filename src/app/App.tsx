import { useState } from "react";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { ClientDashboard } from "./components/ClientDashboard";
import { ClientList } from "./components/ClientList";
import { ClientDetail } from "./components/ClientDetail";
import { ReadingList } from "./components/ReadingList";
import { CutList } from "./components/CutList";
import { DebtQuery } from "./components/DebtQuery";
import { MeterList } from "./components/MeterList";
import { EmployeeList } from "./components/EmployeeList";
import { Settings } from "./components/Settings";

type UserType = "client" | "admin" | null;
type Page = "dashboard" | "clients" | "client-detail" | "readings" | "cuts" | "debt" | "meters" | "employees" | "settings";

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const handleLogin = (type: "client" | "admin") => {
    setUserType(type);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleViewClientDetail = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentPage("client-detail");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleBackToClients = () => {
    setCurrentPage("clients");
  };

  const renderAdminPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
      case "clients":
        return <ClientList onViewDetail={handleViewClientDetail} onBack={handleBackToDashboard} />;
      case "client-detail":
        return <ClientDetail clientId={selectedClientId} onBack={handleBackToClients} />;
      case "meters":
        return <MeterList onBack={handleBackToDashboard} />;
      case "employees":
        return <EmployeeList onBack={handleBackToDashboard} />;
      case "readings":
        return <ReadingList onBack={handleBackToDashboard} />;
      case "cuts":
        return <CutList onBack={handleBackToDashboard} />;
      case "debt":
        return <DebtQuery onBack={handleBackToDashboard} />;
      case "settings":
        return <Settings onBack={handleBackToDashboard} userType="admin" />;
      default:
        return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
  };

  const renderClientPage = () => {
    switch (currentPage) {
      case "settings":
        return <Settings onBack={handleBackToDashboard} userType="client" />;
      default:
        return <ClientDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="size-full">
      {!userType ? (
        <Login onLogin={handleLogin} />
      ) : userType === "client" ? (
        renderClientPage()
      ) : (
        renderAdminPage()
      )}
    </div>
  );
}