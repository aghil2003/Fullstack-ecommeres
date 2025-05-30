import SideDiv from "../component/AdminSideDiv";
import Header from "../component/AdminHeader";
import SideBar from "../component/SideBar";

function AdminPage() {
  return (
    <div className="bg-white h-screen flex flex-col">
      <div className="w-full fixed top-0 z-10 bg-white shadow-md">
        <Header />
      </div>
      <div className="flex flex-1 pt-[80px]">
        <div className="w-[20%] h-screen fixed bg-gray-200">
          <SideBar />
        </div>
        <div className="w-[80%] ml-[20%] h-[calc(100vh-80px)] overflow-y-auto p-4 hide-scrollbar">
          <SideDiv />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

