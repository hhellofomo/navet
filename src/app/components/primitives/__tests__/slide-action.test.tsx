import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SlideAction } from '../slide-action';

describe('SlideAction', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('moves the thumb as the pointer moves before completion', () => {
    render(
      <SlideAction
        actionLabel="Slide to unlock"
        ariaLabel="Slide to unlock"
        onComplete={vi.fn()}
        size="small"
        theme="glass"
      />
    );

    const button = screen.getByRole('button', { name: 'Slide to unlock' });
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
      bottom: 48,
      height: 48,
      left: 0,
      right: 238,
      toJSON: () => ({}),
      top: 0,
      width: 238,
      x: 0,
      y: 0,
    });

    fireEvent.pointerDown(button, { clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(button, { clientX: 96, pointerId: 1 });

    const thumb = button.querySelector('.absolute.top-1\\/2');
    expect(button.style.getPropertyValue('--slide-knob-offset')).toBe('96px');
    expect(button.style.getPropertyValue('--slide-fill-width')).toBe('134px');
    expect(thumb).toHaveStyle({ transition: 'none' });
  });
});
