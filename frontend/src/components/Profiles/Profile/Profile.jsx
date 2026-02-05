import styles from "./Profile.module.css"


const Profile = ({ProfileImg ,Name , LastMessage , onClick, isSelected, UnreadCount }) => {

    const handleCombinedClick = () => {
        onClick(); 
    };

    const profileClassName = isSelected ? styles.ProfileSelected : styles.Profile;

    return (
        <div className={profileClassName} onClick={handleCombinedClick}>
            <img src={ProfileImg} alt={`${Name} profile`} />
            <div className={styles.ProfileDetails}>

                <div className={styles.NameWithBadge}>
                    <h6>{Name}</h6>
                    {UnreadCount > 0 && (
                        <span className={styles.UnreadBadge}>{UnreadCount}</span>
                    )}
                </div>

                <p>{LastMessage}</p>
            </div>
        </div>
    )
}


export default Profile
