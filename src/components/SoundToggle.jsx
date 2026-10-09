export default function SoundToggle({ on, onToggle }) {
  return (
    <button className="sound" type="button" aria-pressed={on} aria-label="Ambient sound" onClick={onToggle}>
      <span className="eq" aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}
