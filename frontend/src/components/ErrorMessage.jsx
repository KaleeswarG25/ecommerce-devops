import '../styles/error.css'

export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message">
      <span>{message}</span>
      {onDismiss && <button onClick={onDismiss}>✕</button>}
    </div>
  )
}
