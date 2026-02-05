import SideBarCompany from "../../components/SideBar/SideBarCompany.jsx"
import navbarcompany from "../../components/navbarcompany/navbarcompany.jsx"
import CApplicationsLayout from "../../components/CApplicationsLayout/CApplicationsLayout.jsx"
import ChatBot from "../../components/chatbot/ChatBot.jsx"
 const CApplicationsLayoutPage = () => {
  return (
    <>
        <navbarcompany/>
        <SideBarCompany/>
        <CApplicationsLayout/>
        <ChatBot></ChatBot>
    </>
  )
}

export default CApplicationsLayoutPage