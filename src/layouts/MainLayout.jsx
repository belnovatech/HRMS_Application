import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

export default function MainLayout({
  children,
  title,
  breadcrumb,
}) {
  return (
    <>
      <Sidebar />

      <Header
        title={title}
        breadcrumb={breadcrumb}
      />

      <div className="page-content">
        {children}
      </div>
    </>
  );
}