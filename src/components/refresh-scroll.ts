import { ScrollTrigger } from 'gsap/ScrollTrigger';

let frame = 0;
const requests = new Set<object>();

/** Route and filter effects can mount together; measure layout only once per frame. */
export function requestScrollRefresh() {
  const request = {};
  requests.add(request);
  if (!frame) frame = requestAnimationFrame(() => {
    frame = 0;
    requests.clear();
    ScrollTrigger.refresh();
  });
  return () => {
    requests.delete(request);
    if (!requests.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
