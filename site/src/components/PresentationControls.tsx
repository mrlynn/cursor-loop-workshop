import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useLmsConfig} from './useLmsConfig';

const PRESENTER_CLASS = 'cursor-presenter-mode';

function usePresenterSlideIndex(
  presenterPageIds: string[] | undefined,
  currentId: string,
): {index: number; total: number} | null {
  return useMemo(() => {
    if (!presenterPageIds?.length) {
      return null;
    }
    const index = presenterPageIds.indexOf(currentId);
    if (index === -1) {
      return null;
    }
    return {index: index + 1, total: presenterPageIds.length};
  }, [presenterPageIds, currentId]);
}

/**
 * Floating presenter toolbar for instructor-led sessions.
 * Press P to toggle presenter mode; arrow keys navigate; F fullscreen; Esc exit.
 */
export default function PresentationControls(): React.ReactElement | null {
  const {metadata, frontMatter} = useDoc();
  const lms = useLmsConfig();
  const [presenterOn, setPresenterOn] = useState(false);
  const slide = usePresenterSlideIndex(lms?.presenterPageIds, metadata.id);
  const isPresentation = Boolean(frontMatter.presentation_layout);

  const setPresenter = useCallback((on: boolean) => {
    setPresenterOn(on);
    document.documentElement.classList.toggle(PRESENTER_CLASS, on);
  }, []);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove(PRESENTER_CLASS);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        setPresenterOn((prev) => {
          const next = !prev;
          document.documentElement.classList.toggle(PRESENTER_CLASS, next);
          return next;
        });
        return;
      }

      if (!document.documentElement.classList.contains(PRESENTER_CLASS)) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setPresenter(false);
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        }
        return;
      }

      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen();
        } else {
          void document.exitFullscreen();
        }
        return;
      }

      if (event.key === 'ArrowLeft' && metadata.previous) {
        event.preventDefault();
        window.location.assign(metadata.previous.permalink);
        return;
      }

      if (event.key === 'ArrowRight' && metadata.next) {
        event.preventDefault();
        window.location.assign(metadata.next.permalink);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [metadata.next, metadata.previous, setPresenter]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  };

  if (!isPresentation) {
    return null;
  }

  return (
    <div
      className={`cursor-presentation-controls${presenterOn ? ' cursor-presentation-controls--active' : ''}`}
      role="toolbar"
      aria-label="Presenter controls">
      <button
        type="button"
        className="cursor-presentation-controls__btn"
        onClick={() => setPresenter(!presenterOn)}
        aria-pressed={presenterOn}>
        {presenterOn ? 'Exit presenter' : 'Presenter'}
      </button>

      {slide ? (
        <span className="cursor-presentation-controls__slide">
          Slide {slide.index} / {slide.total}
        </span>
      ) : null}

      {metadata.previous ? (
        <Link
          className="cursor-presentation-controls__btn"
          to={metadata.previous.permalink}>
          ← Prev
        </Link>
      ) : (
        <span className="cursor-presentation-controls__btn cursor-presentation-controls__btn--disabled">
          ← Prev
        </span>
      )}

      {metadata.next ? (
        <Link
          className="cursor-presentation-controls__btn"
          to={metadata.next.permalink}>
          Next →
        </Link>
      ) : (
        <span className="cursor-presentation-controls__btn cursor-presentation-controls__btn--disabled">
          Next →
        </span>
      )}

      <button
        type="button"
        className="cursor-presentation-controls__btn"
        onClick={toggleFullscreen}>
        Fullscreen
      </button>

      <span className="cursor-presentation-controls__hint">
        P presenter · ← → navigate · F fullscreen
      </span>
    </div>
  );
}
