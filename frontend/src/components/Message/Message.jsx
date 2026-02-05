import styles from "./Message.module.css"


const Message = ({ProfileImg , Content , Role, isRead}) => {

    const senderMessage = ()=>{
        return(
            <div className={styles.MessageContainerSender}>

                <p className={`${styles.senderMessage} ${!isRead ? styles.unreadMessage : ''}`}>{Content}</p>
                <img src={ProfileImg}  />
                     
            </div>
        )

    }

      const receiverMessage = ()=>{
        return(

            <div className={styles.MessageContainerReceiver}>
                <img src={ProfileImg} />
                <p className={`${styles.RecieverMessage} ${!isRead ? styles.unreadMessage : ''}`}>{Content}</p>
                
                     
            </div>
        )

    }


  return (
     
           <>
           {(Role=="sender")? 
        (senderMessage())
        : 
        (receiverMessage())
            }
           </> 
      



  )
}


export  default Message 