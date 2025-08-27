import { Observable } from '@/models/Observable';
import type { Vec2 } from '@/utils/colour/types';

export type GraphObsProps = {
  isHovered: () => boolean;
  getMousePos: () => Vec2;
};

export class GraphObservable extends Observable<GraphObsProps> {
  #mousePos: Vec2;
  #isHovered: boolean;
  constructor() {
    const initial: GraphObsProps = {
      isHovered: () => false,
      getMousePos: () => this.mousePos,
    };
    super(initial);
    this.#mousePos = [0, 0];
    this.#isHovered = true;
  }

  get mousePos() {
    return this.#mousePos;
  }
  set mousePos(pos: Vec2) {
    this.#mousePos = pos;
    this.notify();
  }

  get isHovered() {
    return this.#isHovered;
  }
  set isHovered(isHovered: boolean) {
    this.#isHovered = isHovered;
    this.notify();
  }

  handlePointerMove(e: React.PointerEvent) {
    const { offsetX, offsetY } = e.nativeEvent;
    this.mousePos = [offsetX, offsetY];
  }
}
