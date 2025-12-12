import { useEffect, useReducer, useRef } from "react";

type SpringOptions = {
  stiffness?: number;
  damping?: number;
};

export function useSpringValue(
  target: number,
  { stiffness = 400, damping = 40 }: SpringOptions = {}
) {
  const value = useRef(target);
  const velocity = useRef(0);
  const raf = useRef<number | null>(null);

  const [, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    function step() {
      const displacement = target - value.current;
      const acceleration =
        stiffness * displacement - damping * velocity.current;

      velocity.current += acceleration * 0.016;
      value.current += velocity.current * 0.016;

      if (Math.abs(velocity.current) > 0.1 || Math.abs(displacement) > 0.1) {
        raf.current = requestAnimationFrame(step);
        forceRender();
      } else {
        value.current = target;
        velocity.current = 0;
        forceRender();
      }
    }

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, stiffness, damping]);

  return value.current;
}
