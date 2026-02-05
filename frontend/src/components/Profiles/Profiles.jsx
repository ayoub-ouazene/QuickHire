import Profile from "./Profile/Profile.jsx"
import styles from "./Profiles.module.css"

const Profiles = ({ ContactsProfiles, handleChoseProfile, activeContactId }) => {

  if (ContactsProfiles.length === 0) {
    return (
      <div className={styles.Profiles}>
        <p className={styles.NoConversations}>No conversations yet</p>
      </div>
    )
  }

  return (
    <div className={styles.Profiles}>
      {ContactsProfiles.map((profile, index) => {
        const isSelected = profile.id === activeContactId;
        
        // Use the LastMessageContent from backend (already formatted)
        const lastMessage = profile.LastMessageContent || `Start Your Conversation with ${profile.Name}`;

        return (
          <Profile
            key={index}
            ProfileImg={profile.ProfileImg}
            Name={profile.Name}
            LastMessage={lastMessage}
            UnreadCount={profile.UnreadCount || 0}
            onClick={() => handleChoseProfile(profile)}
            isSelected={isSelected}
          />
        )
      })}
    </div>
  )
}

export default Profiles
