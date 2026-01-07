import { WORKOUT } from '../data/workout';

type ExerciseGuideProps = {
  onClose: () => void;
};

export function ExerciseGuide({ onClose }: ExerciseGuideProps) {
  return (
    <div className='guide-backdrop' onClick={onClose}>
      <div
        className='guide-modal'
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
      >
        <header className='guide-header'>
          <h2>Exercise guide</h2>
          <button
            type='button'
            className='text-button'
            onClick={onClose}
            aria-label='Close exercise guide'
          >
            <span className='material-symbols-rounded'>close</span>
          </button>
        </header>

        <div className='guide-content'>
          <p className='guide-intro'>
            Each exercise focuses on form and control. Follow the cues below to
            maintain a safe, effective position.
          </p>

          {WORKOUT.map((ex) => (
            <section key={ex.name} className='guide-exercise'>
              <div className='guide-image-wrapper'>
                <img src={ex.image} alt={ex.name} />
              </div>
              <h3>{ex.name}</h3>
              <ul>
                {(ex.description ?? []).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
