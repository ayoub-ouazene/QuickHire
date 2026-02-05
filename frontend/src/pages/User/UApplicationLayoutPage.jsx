import SideBar from "../../components/SideBar/SideBar"
import NavBar from "../../components/NavBar/NavBar"
import JobApplicationLayout from "../../components/JobApplicationLayout/JobApplicationLayout.jsx"
import ChatBot from "../../components/chatbot/ChatBot.jsx"
 const UApplicationLayoutPage = () => {
  return (
    <>
        <NavBar/>
        <SideBar/>
        <JobApplicationLayout/>
        <ChatBot></ChatBot>
    </>
  )
}

export default UApplicationLayoutPage