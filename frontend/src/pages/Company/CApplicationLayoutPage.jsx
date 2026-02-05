import SideBarCompany from "../../components/SideBar/SideBarCompany.jsx"
import NavBarCompany from "../../components/navbarcompany/navbarcompany.jsx"
import CApplicationsLayout from "../../components/CApplicationsLayout/CApplicationsLayout.jsx"
import ChatBot from "../../components/chatbot/ChatBot.jsx"
 const CApplicationsLayoutPage = () => {
  return (
    <>
        <NavBarCompany/>
        <SideBarCompany/>
        <CApplicationsLayout/>
        <ChatBot></ChatBot>
    </>
  )
}

export default CApplicationsLayoutPage