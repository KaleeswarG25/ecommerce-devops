import { useAuth } from '../context/AuthContext'
import '../styles/profile.css'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return <p>Please log in to view your profile</p>
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <h1>My Profile</h1>

          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{user.name}</p>
            </div>

            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="info-item">
              <label>Role</label>
              <p>{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
