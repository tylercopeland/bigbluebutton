interface Bounds {
  width: number;
  height: number;
  top: number;
  left?: number | null;
  right?: number | null;
}

interface SlideSize {
  width?: number;
  height?: number;
}

const DEFAULT_ASPECT = 16 / 9;

/**
 * The box the current slide takes inside the stage: as big as fits, centred.
 * The shared screen uses the same box while the presenter's switch shows, so
 * the switch stays at the same corner on both sides.
 */
const fitToSlide = <T extends Bounds>(bounds: T, slide?: SlideSize): T => {
  const { width, height } = bounds;
  if (!width || !height) return bounds;
  const aspect = slide?.width && slide?.height ? slide.width / slide.height : DEFAULT_ASPECT;
  const fitted = width / height > aspect
    ? { width: height * aspect, height }
    : { width, height: width / aspect };
  const sideGap = (width - fitted.width) / 2;
  return {
    ...bounds,
    ...fitted,
    top: bounds.top + (height - fitted.height) / 2,
    left: typeof bounds.left === 'number' ? bounds.left + sideGap : bounds.left,
    right: typeof bounds.right === 'number' ? bounds.right + sideGap : bounds.right,
  };
};

export default fitToSlide;
