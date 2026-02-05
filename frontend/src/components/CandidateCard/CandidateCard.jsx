import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CandidateCard.module.css';
import PropTypes from 'prop-types';
import { Star } from "lucide-react";

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      color={i + 1 <= rating ? "#FFD700" : "#ddd"}
      fill={i + 1 <= rating ? "#FFD700" : "none"}
      style={{ marginRight: "2px" }}
    />
  ));

function CandidatePost({ id, pic, name, title, stats, description, skills, onInvite, showAlert }) {
  console.log('🔍 CandidatePost rendered with name:', name, 'id:', id);
  
  const [averageRating, setRating] = useState(2.5);
  const [invited, setInvited] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [hasRemoved, setHasRemoved] = useState(false); // Track if we've already triggered removal
  const [processedEvents, setProcessedEvents] = useState(new Set()); // Track processed events

  useEffect(() => {
    // Use rating from stats if available, otherwise default to 2.5
    if (stats?.rating !== undefined && stats?.rating !== null) {
      setRating(Number(stats.rating));
    } else if (stats?.ratings?.length > 0) {
      const avg = stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length;
      setRating(Number(avg.toFixed(1)));
    } else {
      setRating(2.5);
    }
    
    // Check if already invited from localStorage
    const recentlyInvited = JSON.parse(localStorage.getItem('recentlyInvitedCandidates') || '[]');
    if (recentlyInvited.includes(id)) {
      console.log('✅ Candidate already invited (from localStorage)');
      setInvited(true);
      setHasRemoved(true);
    }
  }, [stats, id]);

  // ✅ FIXED: Event listener only updates local state, checks source
  useEffect(() => {
    const handleExternalInvite = (event) => {
      const { userId, eventId, source } = event.detail;
      
      // Prevent processing the same event multiple times
      if (processedEvents.has(eventId)) {
        return;
      }
      
      if (userId === id) {
        console.log('📢 Received external invite event for user:', id, 'from:', source, 'eventId:', eventId);
        
        // Add to processed events
        setProcessedEvents(prev => new Set([...prev, eventId]));
        
        // Only update local state if event is from UserDetailsPage
        // If event is from CandidateCard, we're already handling it
        if (source === 'UserDetailsPage') {
          setInvited(true);
          setHasRemoved(true);
        }
      }
    };

    window.addEventListener('candidateInvited', handleExternalInvite);
    
    return () => {
      window.removeEventListener('candidateInvited', handleExternalInvite);
    };
  }, [id, processedEvents]);

  const handleInvite = async () => {
    if (invited || inviting || hasRemoved) {
      console.log('⏸️ Invite blocked:', { invited, inviting, hasRemoved });
      return;
    }

    try {
      setInviting(true);
      
      console.log('🔄 Starting invite process for candidate:', { id, name });

      // Get company info
      const companyData = JSON.parse(localStorage.getItem("user") || "{}");
      console.log('🏢 Company data from localStorage:', companyData);
      
      const companyId = companyData.Company_id || companyData.id || companyData.company_id;
      const companyName = companyData.Name || companyData.name || companyData.companyName || "Your Company";
      
      const token = localStorage.getItem("token");
      const accountType = localStorage.getItem("accountType");

      // Check authentication
      if (!token) {
        if (showAlert) {
          showAlert("You must be logged in to send invitations.", 'error');
        } else {
          alert("You must be logged in to send invitations.");
        }
        setInviting(false);
        return;
      }

      if (accountType !== "company") {
        if (showAlert) {
          showAlert("Only companies can send invitations to candidates.", 'error');
        } else {
          alert("Only companies can send invitations to candidates.");
        }
        setInviting(false);
        return;
      }

      if (!companyId) {
        if (showAlert) {
          showAlert("Unable to retrieve company information.", 'error');
        } else {
          alert("Unable to retrieve company information.");
        }
        setInviting(false);
        return;
      }

      console.log('📤 Sending invitation...', { 
        companyId, 
        userId: id,
        candidateName: name,
        candidateNameType: typeof name
      });

      // Send invitation (backend will create notification)
      const invitationResponse = await fetch('http://localhost:3000/api/Company/Invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId: companyId,
          userId: id,
          jobName: "Open Position",
          type: "Invitation"
        }),
      });

      const invitationData = await invitationResponse.json();
      console.log('📩 Backend response:', invitationData);

      if (!invitationData.success) {
        throw new Error(invitationData.error || 'Failed to send invitation');
      }

      console.log('✅ Invitation sent successfully!');

      // Update local state
      setInvited(true);
      setHasRemoved(true);
      
      // Add to localStorage
      const recentlyInvited = JSON.parse(localStorage.getItem('recentlyInvitedCandidates') || '[]');
      if (!recentlyInvited.includes(id)) {
        recentlyInvited.push(id);
        localStorage.setItem('recentlyInvitedCandidates', JSON.stringify(recentlyInvited));
      }
      
      // ✅ FIXED: Call onInvite ONCE with proper parameters
      if (onInvite && typeof onInvite === 'function') {
        console.log('📞 Calling onInvite callback for id:', id);
        onInvite(id, displayName);
      } else {
        console.log('⚠️ onInvite callback not available or not a function');
      }
      
      // Show notification
      if (showAlert) {
        if (name && name.trim() !== "") {
          showAlert(`Invitation sent to ${name}!`, 'success');
        } else {
          showAlert('Invitation sent successfully to the candidate!', 'success');
        }
      }
      
      // ✅ Dispatch event with unique ID to notify other components
      const eventId = `card-invite-${id}-${Date.now()}`;
      window.dispatchEvent(new CustomEvent('candidateInvited', {
        detail: { 
          userId: id, 
          userName: name,
          eventId: eventId,
          source: 'CandidateCard'
        }
      }));

    } catch (error) {
      console.error('❌ Error inviting candidate:', error);
      
      if (error.message.includes('already') || error.message.includes('Duplicate')) {
        setInvited(true);
        setHasRemoved(true);
        
        // Add to localStorage even if duplicate
        const recentlyInvited = JSON.parse(localStorage.getItem('recentlyInvitedCandidates') || '[]');
        if (!recentlyInvited.includes(id)) {
          recentlyInvited.push(id);
          localStorage.setItem('recentlyInvitedCandidates', JSON.stringify(recentlyInvited));
        }
        
        if (showAlert) {
          showAlert('You have already invited this candidate.', 'info');
        }
      } else {
        if (showAlert) {
          showAlert('Failed to send invitation: ' + error.message, 'error');
        }
      }
    } finally {
      setInviting(false);
    }
  };

  // ✅ Use safe name for display
  const displayName = name && name.trim() !== "" ? name : "Candidate";
  const displayTitle = title && title.trim() !== "" ? title : "No Title";

  return (      
    <div className={styles.JobCard}>
      <div className={styles.Header}>
        <div className={styles.HeaderLeft}>
          <img 
            src={pic || "https://via.placeholder.com/150"} 
            alt={displayName}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          <div className={styles.HeaderLeftText}>
            <h2>{displayName}</h2>
            <h4>{displayTitle}</h4>
          </div>
        </div>
        <Link
          to={`/Company/candidate-details/${id}`}
          className={styles.moreDetailsLink}
        >
          More Details
        </Link>
      </div>

      <div className={styles.workExperience}>
        {stats?.lastCompletedRole ? (
          <p>
            Last Role: <strong>{stats.lastCompletedRole}</strong>
            {stats.lastCompletedCompany && ` at ${stats.lastCompletedCompany}`}
          </p>
        ) : (
          <p>No completed work experience</p>
        )}
      </div>

      <div className={styles.Description}>
        <p>{description || "No description available"}</p>
      </div>

      <div className={styles.collector}>
        <div className={styles.JobSkill}>
          {skills && skills.length > 0 ? (
            skills.map((skill, i) => (
              <span key={i} className={styles.Text}>{skill}</span>
            ))
          ) : (
            <span className={styles.Text}>No skills listed</span>
          )}
        </div>

        <div className={styles.Footer}>
          <div>
            {renderStars(averageRating)}
            <span style={{ fontWeight: 600, color: "#000" }}>{averageRating}</span>
          </div>

          {localStorage.getItem("accountType") === "company" && (
            <button
              type="button"
              className={`${styles.ApplyButton} ${invited ? styles.applied : ""}`}
              onClick={handleInvite}
              disabled={invited || inviting || hasRemoved}
            >
              {inviting ? "Sending..." : invited ? "✔ Invited" : "Invite"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

CandidatePost.propTypes = {
  id: PropTypes.number.isRequired,
  pic: PropTypes.string,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired,
  description: PropTypes.string,
  skills: PropTypes.array,
  onInvite: PropTypes.func,
  showAlert: PropTypes.func,
};

export default CandidatePost;