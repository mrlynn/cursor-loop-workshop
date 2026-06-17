import React, {useEffect, useState} from 'react';
import {
  readQuizPassed,
  writeQuizPassed,
} from './progressStorage';
import {notifyLearningProgressChanged} from './LearningProgressContext';

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  /** Option id that is correct */
  correctId: string;
  explanation: string;
}

export interface KnowledgeCheckProps {
  courseId: string;
  quizId: string;
  title?: string;
  questions: QuizQuestion[];
}

export default function KnowledgeCheck({
  courseId,
  quizId,
  title = 'Knowledge check',
  questions,
}: KnowledgeCheckProps): React.ReactElement {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    setPassed(readQuizPassed(courseId, quizId));
  }, [courseId, quizId]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) {
      return;
    }
    setAnswers((prev) => ({...prev, [questionId]: optionId}));
  };

  const handleSubmit = () => {
    const allCorrect = questions.every(
      (q) => answers[q.id] === q.correctId,
    );
    setSubmitted(true);
    if (allCorrect) {
      setPassed(true);
      writeQuizPassed(courseId, quizId, true);
      notifyLearningProgressChanged();
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === questions.length && !submitted;

  return (
    <section className="cursor-knowledge-check" aria-label={title}>
      <header className="cursor-knowledge-check__header">
        <p className="cursor-eyebrow">Self-assessment</p>
        <h2 className="cursor-knowledge-check__title">{title}</h2>
        {passed ? (
          <p className="cursor-knowledge-check__passed">Passed</p>
        ) : null}
      </header>

      <div className="cursor-knowledge-check__questions">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctId;
          const showResult = submitted && selected;

          return (
            <fieldset
              key={question.id}
              className="cursor-knowledge-check__question"
              disabled={submitted}>
              <legend className="cursor-knowledge-check__prompt">
                <span className="cursor-knowledge-check__number">
                  {index + 1}
                </span>
                {question.prompt}
              </legend>
              <div className="cursor-knowledge-check__options" role="radiogroup">
                {question.options.map((option) => {
                  const isSelected = selected === option.id;
                  let resultClass = '';
                  if (showResult && isSelected) {
                    resultClass = isCorrect
                      ? ' cursor-knowledge-check__option--correct'
                      : ' cursor-knowledge-check__option--incorrect';
                  } else if (
                    showResult &&
                    option.id === question.correctId &&
                    !isCorrect
                  ) {
                    resultClass = ' cursor-knowledge-check__option--reveal';
                  }

                  return (
                    <label
                      key={option.id}
                      className={`cursor-knowledge-check__option${isSelected ? ' cursor-knowledge-check__option--selected' : ''}${resultClass}`}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleSelect(question.id, option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              {submitted && selected ? (
                <p
                  className={`cursor-knowledge-check__explanation${isCorrect ? ' cursor-knowledge-check__explanation--correct' : ' cursor-knowledge-check__explanation--incorrect'}`}>
                  {question.explanation}
                </p>
              ) : null}
            </fieldset>
          );
        })}
      </div>

      <footer className="cursor-knowledge-check__footer">
        {!submitted ? (
          <button
            type="button"
            className="cursor-lms-button"
            disabled={!canSubmit}
            onClick={handleSubmit}>
            Check answers
          </button>
        ) : passed ? (
          <p className="cursor-knowledge-check__success">
            Nice work. You can move on to the next lesson.
          </p>
        ) : (
          <button
            type="button"
            className="cursor-lms-button cursor-lms-button--secondary"
            onClick={handleRetry}>
            Try again
          </button>
        )}
      </footer>
    </section>
  );
}
