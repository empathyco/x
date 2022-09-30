import { FOCUSABLE_SELECTORS } from '../utils/focus';
import { ArrowKey } from '../utils/types';
import {
  AbsoluteDistances,
  Intersection,
  Point,
  Points,
  SpatialNavigation
} from './services.types';

/**
 * Implementation of {@link SpatialNavigation} using directional focus.
 *
 * @public
 */
export class DirectionalFocusNavigationService implements SpatialNavigation {
  /**
   * The HTMLElement that is currently on focus and used as reference to navigateTo from.
   */
  private origin!: HTMLElement;

  /**
   * The DOMRect of the origin Element.
   */
  private originRect!: DOMRect;

  /**
   * Direction of the navigation.
   */
  private direction!: ArrowKey;

  /**
   * Weight of the projected intersection area weight in the
   * {@link DirectionalFocusNavigationService.getDistanceScore | getDistanceScore} formula.
   */
  private readonly intersectionAreaWeight = 100;

  /**
   * Weight of the absolute distance on the orthogonal axis between to elements when navigating
   * left or right. Used to calculate the displacement in
   * {@link DirectionalFocusNavigationService.getDisplacementAndAlignment |
   * getDisplacementAndAlignment}.
   */
  private readonly orthogonalWeightHorizontal = 30;

  /**
   * Weight of the absolute distance on the orthogonal axis between to elements when navigating
   * up or down. Used to calculate the displacement in
   * {@link DirectionalFocusNavigationService.getDisplacementAndAlignment |
   * getDisplacementAndAlignment}.
   */
  private readonly orthogonalWeightVertical = 2;

  /**
   * Weight of the degree of alignment between two elements when calculating the alignment in
   * {@link DirectionalFocusNavigationService.getDisplacementAndAlignment |
   * getDisplacementAndAlignment}.
   */
  private readonly alignWeight = 5;

  /**
   * Set of functions to filter out candidates based on the navigation's direction.
   */
  private readonly filterFunction = {
    ArrowUp: (candidateRect: DOMRect) => this.isBelow(this.originRect, candidateRect),
    ArrowRight: (candidateRect: DOMRect) => this.isRightSide(candidateRect, this.originRect),
    ArrowDown: (candidateRect: DOMRect) => this.isBelow(candidateRect, this.originRect),
    ArrowLeft: (candidateRect: DOMRect) => this.isRightSide(this.originRect, candidateRect)
  };

  /**
   * Constructor for the {@link DirectionalFocusNavigationService}.
   *
   * @param container - The element that contains the navigable elements.
   * @param focusableSelectors - A comma separated string with the focusable selectors to look up.
   */
  public constructor(
    /**
     * The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement | HTMLElement} that
     * contains the navigable elements.
     */
    private readonly container: HTMLElement,
    /**
     * Comma separated focusable selectors to look up.
     */
    private readonly focusableSelectors = FOCUSABLE_SELECTORS
  ) {}

  /**
   * Get the element that would be the next one to be navigated to based on the direction of the
   * arrow key pressed. If there are no possible candidates the element to focus would be the one on
   * currently on focus or the first one in the container.
   *
   * @param arrowKey - The arrow key that was pressed.
   *
   * @returns The element to navigate to.
   */
  navigateTo(arrowKey: ArrowKey): HTMLElement {
    const rawCandidates = this.getFocusableElements();
    this.direction = arrowKey;
    this.updateOrigin();

    return this.getBestCandidate(rawCandidates);
  }

  /**
   * Gets focusable elements within the container.
   *
   * @returns List of focusable elements.
   * @internal
   */
  private getFocusableElements(): HTMLElement[] {
    return Array.from(this.container.querySelectorAll(this.focusableSelectors));
  }

  /**
   * Updates the origin with the current document active element.
   *
   * @remarks
   * This also covers cases when the user might have iterated through the DOM using the TAB or
   * SHIFT+TAB keys.
   */
  private updateOrigin(): void {
    const newOrigin = document.activeElement as HTMLElement;
    this.origin = newOrigin;
    this.originRect = newOrigin.getBoundingClientRect();
  }

  /**
   * Finds the closest candidate to the origin from a list of candidates.
   *
   * @remarks
   * If there are no candidates the origin will be retrieved as best candidate.
   *
   * @param rawCandidates - List of all candidates.
   *
   * @returns The closest candidate to the origin or origin if there's none.
   * @internal
   */
  private getBestCandidate(rawCandidates: HTMLElement[]): HTMLElement {
    const candidates = this.filterCandidates(rawCandidates);
    let bestCandidate = this.origin;

    candidates.reduce((bestCurrentScore: number, candidate) => {
      const bestScore = Math.min(bestCurrentScore, this.getDistanceScore(candidate));
      if (bestScore !== bestCurrentScore) {
        bestCandidate = candidate;
      }
      return bestScore;
    }, Number.MAX_SAFE_INTEGER);

    return bestCandidate;
  }

  /**
   * Filters out candidates that can't be candidates based on the direction of the navigation and
   * if they are visible and enabled.
   *
   * @param rawCandidates - List of all candidates.
   *
   * @returns List of filtered candidates.
   * @internal
   */
  private filterCandidates(rawCandidates: HTMLElement[]): HTMLElement[] {
    return rawCandidates.filter(candidate => this.isValidCandidate(candidate));
  }

  /**
   * Checks if the provided candidate is not the origin, is visible, enabled  and in the correct
   * direction to be a valid candidate.
   *
   * @param candidate - The candidate element.
   * @returns If the candidate is valid for the navigation.
   * @internal
   */
  private isValidCandidate(candidate: HTMLElement): boolean {
    return (
      candidate !== this.origin &&
      this.isCandidateVisible(candidate) &&
      this.hasFocusCompatibleAttributes(candidate) &&
      this.isInNavigateDirection(candidate)
    );
  }

  /**
   * Checks if the provided candidate is visible.
   *
   * @param candidate - The candidate element.
   * @returns If the candidate is visible.
   * @internal
   */
  private isCandidateVisible(candidate: HTMLElement): boolean {
    const candidateStyle = window.getComputedStyle(candidate, null);

    return !!(
      candidate.offsetWidth &&
      candidate.offsetHeight &&
      candidateStyle.visibility === 'visible'
    );
  }

  /**
   * Checks if the provided candidate is disabled and if the tabindex allows the element to be
   * focused.
   *
   * @param candidate - The candidate element.
   * @returns If candidate's attributes allow it to be focused.
   * @internal
   */
  private hasFocusCompatibleAttributes(candidate: HTMLElement): boolean {
    return !candidate.getAttribute('disabled') && candidate.getAttribute('tabindex') !== '-1';
  }

  /**
   * Checks if the provided candidate is in the direction the navigation is going.
   *
   * @param candidate - The candidate element.
   * @returns If the candidate is in the correct direction.
   * @internal
   */
  private isInNavigateDirection(candidate: HTMLElement): boolean {
    return this.filterFunction[this.direction](candidate.getBoundingClientRect());
  }

  /**
   * Calculates the candidate's score for it to be the next element to navigateTo to based on a
   * formula that takes into account euclidean distance, displacement, alignment and
   * intersection area relative to the origin element.
   *
   * @param candidate - The candidate element.
   *
   * @returns The candidate score for best candidate.
   * @internal
   */
  private getDistanceScore(candidate: HTMLElement): number {
    const candidateRect = candidate.getBoundingClientRect();
    const { 0: candidatePoint, 1: originPoint } = this.getComparisionPoints(candidateRect);
    const absoluteDistances: AbsoluteDistances = {
      x: Math.abs(candidatePoint.x - originPoint.x),
      y: Math.abs(candidatePoint.y - originPoint.y)
    };
    const euclideanDistance = Math.sqrt(
      Math.pow(absoluteDistances.x, 2) + Math.pow(absoluteDistances.y, 2)
    );
    const intersection = this.getIntersection(this.originRect, candidateRect);
    const { displacement, alignment } = this.getDisplacementAndAlignment(
      candidateRect,
      intersection,
      absoluteDistances
    );
    const projectedArea = Math.sqrt(intersection.area) / this.intersectionAreaWeight;

    return euclideanDistance + displacement - alignment - projectedArea;
  }

  /**
   * Gets the closest point to origin within the candidate and to the candidate within the origin
   * based on the navigation direction.
   *
   * @param candidateRect - The DOMRect of the candidate.
   *
   * @returns The candidate's closest Points to the origin.
   * @internal
   */
  private getComparisionPoints(candidateRect: DOMRect): Points {
    const points: Points = [
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ];

    return {
      ...this.setParallelPointValues(points, candidateRect),
      ...this.setOrthogonalPointValues(points, candidateRect)
    };
  }

  /**
   * Set parallel values between candidate and origin based on the navigation direction and
   * returns them.
   *
   * @param points - Current values for the candidate and origin's points.
   * @param candidateRect - The DOMRect of the candidate.
   *
   * @returns Candidate and origin points with parallel values set.
   * @internal
   */
  private setParallelPointValues(
    { 0: candidatePoint, 1: originPoint }: Points,
    candidateRect: DOMRect
  ): Points {
    switch (this.direction) {
      case 'ArrowUp':
        candidatePoint.y = Math.min(candidateRect.bottom, this.originRect.top);
        originPoint.y = this.originRect.top;
        break;
      case 'ArrowDown':
        candidatePoint.y = Math.max(candidateRect.top, this.originRect.bottom);
        originPoint.y = this.originRect.bottom;
        break;
      case 'ArrowRight':
        candidatePoint.x = Math.max(candidateRect.left, this.originRect.right);
        originPoint.x = this.originRect.right;
        break;
      case 'ArrowLeft':
        candidatePoint.x = Math.min(candidateRect.right, this.originRect.left);
        originPoint.x = this.originRect.left;
        break;
    }

    return [candidatePoint, originPoint];
  }

  /**
   * Set orthogonal values between candidate and origin based on the navigation direction and
   * returns them.
   *
   * @param points - Current values for the candidate and origin's points.
   * @param candidateRect - The DOMRect of the candidate.
   *
   * @returns Candidate and origin points with orthogonal values set.
   * @internal
   */
  private setOrthogonalPointValues(
    { 0: candidatePoint, 1: originPoint }: Points,
    candidateRect: DOMRect
  ): Points {
    switch (this.direction) {
      case 'ArrowUp':
      case 'ArrowDown':
        if (this.isRightSide(this.originRect, candidateRect)) {
          candidatePoint.x = Math.min(candidateRect.right, this.originRect.left);
          originPoint.x = this.originRect.left;
        } else if (this.isRightSide(candidateRect, this.originRect)) {
          candidatePoint.x = Math.max(candidateRect.left, this.originRect.right);
          originPoint.x = this.originRect.right;
        } else {
          candidatePoint.x = Math.max(this.originRect.left, candidateRect.left);
          originPoint.x = candidatePoint.x;
        }
        break;

      case 'ArrowRight':
      case 'ArrowLeft':
        if (this.isBelow(this.originRect, candidateRect)) {
          candidatePoint.y = Math.min(candidateRect.bottom, this.originRect.top);
          originPoint.y = this.originRect.top;
        } else if (this.isBelow(candidateRect, this.originRect)) {
          candidatePoint.y = Math.max(candidateRect.top, this.originRect.bottom);
          originPoint.y = this.originRect.bottom;
        } else {
          candidatePoint.y = Math.max(this.originRect.top, candidateRect.top);
          originPoint.y = candidatePoint.y;
        }
        break;
    }

    return [candidatePoint, originPoint];
  }

  /**
   * Calculates the displacement and alignment values for the candidate relative to the origin.
   *
   * @param candidateRect - The DOMRect of the candidate.
   * @param intersection - Projected intersection between candidate and origin.
   * @param absoluteDistances - Absolute distances between candidate and origin points.
   *
   * @returns Displacement and alignment values.
   * @internal
   */
  private getDisplacementAndAlignment(
    candidateRect: DOMRect,
    intersection: Intersection,
    absoluteDistances: AbsoluteDistances
  ): { displacement: number; alignment: number } {
    const areAligned = this.areAligned(this.originRect, candidateRect);

    let alignBias = 0;
    let orthogonalBias = 0;
    let displacement = 0;

    switch (this.direction) {
      case 'ArrowUp':
      case 'ArrowDown':
        if (areAligned) {
          alignBias = Math.min(intersection.width / this.originRect.width, 1);
        } else {
          orthogonalBias = this.originRect.width / 2;
        }

        displacement = (absoluteDistances.x + orthogonalBias) * this.orthogonalWeightVertical;
        break;

      case 'ArrowRight':
      case 'ArrowLeft':
        if (areAligned) {
          alignBias = Math.min(intersection.height / this.originRect.height, 1);
        } else {
          orthogonalBias = this.originRect.height / 2;
        }

        displacement = (absoluteDistances.y + orthogonalBias) * this.orthogonalWeightHorizontal;
        break;
    }

    return { displacement, alignment: alignBias * this.alignWeight };
  }

  /**
   * Calculates the projected intersection between two
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect | rects}.
   *
   * @param rect1 - First {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect | rect}.
   * @param rect2 - Second {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect | rect}.
   *
   * @returns The intersection.
   * @internal
   */
  private getIntersection(rect1: DOMRect, rect2: DOMRect): Intersection {
    const intersection: Intersection = { width: 0, height: 0, area: 0 };

    const topLeftPoint: Point = {
      x: Math.max(rect1.left, rect2.left),
      y: Math.max(rect1.top, rect2.top)
    };
    const bottomRightPoint: Point = {
      x: Math.min(rect1.right, rect2.right),
      y: Math.min(rect1.bottom, rect2.bottom)
    };

    intersection.width = Math.abs(topLeftPoint.x - bottomRightPoint.x);
    intersection.height = Math.abs(topLeftPoint.y - bottomRightPoint.y);

    if (topLeftPoint.x < bottomRightPoint.x || topLeftPoint.y < bottomRightPoint.y) {
      intersection.area = intersection.width * intersection.height;
    }

    return intersection;
  }

  /**
   * Checks that both DOMRect are aligned based on the provided direction.
   *
   * @param rect1 - The first DOMRect.
   * @param rect2 - The DOMRect that the first one will be compared to.
   *
   * @returns If the DOMRect are aligned.
   * @internal
   */
  private areAligned(rect1: DOMRect, rect2: DOMRect): boolean {
    return this.direction === 'ArrowLeft' || this.direction === 'ArrowRight'
      ? rect1.bottom > rect2.top && rect1.top < rect2.bottom
      : rect1.right > rect2.left && rect1.left < rect2.right;
  }

  /**
   * Checks that the first DOMRect is below the second one.
   *
   * @param rect1 - The first DOMRect.
   * @param rect2 - The DOMRect that the first one will be compared to.
   *
   * @returns If it's below.
   * @internal
   */
  private isBelow(rect1: DOMRect, rect2: DOMRect): boolean {
    return (
      rect1.top >= rect2.bottom ||
      (rect1.top >= rect2.top &&
        rect1.bottom > rect2.bottom &&
        rect1.left < rect2.right &&
        rect1.right > rect2.left)
    );
  }

  /**
   * Checks that the first DOMRect is to the right side of the second one.
   *
   * @param rect1 - The first DOMRect.
   * @param rect2 - The DOMRect that the first one will be compared to.
   *
   * @returns If it's to the right side.
   * @internal
   */
  private isRightSide(rect1: DOMRect, rect2: DOMRect): boolean {
    return (
      rect1.left >= rect2.right ||
      (rect1.left >= rect2.left &&
        rect1.right > rect2.right &&
        rect1.bottom > rect2.top &&
        rect1.top < rect2.bottom)
    );
  }
}
