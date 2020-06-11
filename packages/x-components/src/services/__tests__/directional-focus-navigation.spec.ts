import { DirectionalFocusNavigationService } from '../directional-focus-navigation.service';

describe(`testing directional-focus-navigation service functionalities`, () => {
  describe('testing that service filters out unfocusable candidates', () => {
    const mockedFilterCandidates = jest.fn(candidates =>
      DirectionalFocusNavigationService.prototype['filterCandidates'](candidates)
    );
    jest
      .spyOn(DirectionalFocusNavigationService.prototype as any, 'isInNavigateDirection')
      .mockImplementation(() => true);

    const buttonCandidate = document.createElement('button');
    document.body.appendChild(buttonCandidate);
    jest.spyOn(buttonCandidate, 'offsetWidth', 'get').mockImplementation(() => 100);
    jest.spyOn(buttonCandidate, 'offsetHeight', 'get').mockImplementation(() => 100);

    it('filters out candidates without dimensions', () => {
      const noDimensionsCandidate = document.createElement('button');
      document.body.appendChild(noDimensionsCandidate);

      const filteredCandidates = mockedFilterCandidates([buttonCandidate, noDimensionsCandidate]);
      expect(filteredCandidates).toEqual([buttonCandidate]);
    });

    it('filters out non visible candidates', () => {
      buttonCandidate.style.visibility = 'hidden';

      let filteredCandidates = mockedFilterCandidates([buttonCandidate]);
      expect(filteredCandidates).toEqual([]);

      buttonCandidate.style.visibility = 'collapsed';

      filteredCandidates = mockedFilterCandidates([buttonCandidate]);
      expect(filteredCandidates).toEqual([]);
    });

    it('filters out disabled candidates', () => {
      buttonCandidate.style.visibility = 'visible';
      buttonCandidate.setAttribute('disabled', 'disabled');

      let filteredCandidates = mockedFilterCandidates([buttonCandidate]);
      expect(filteredCandidates).toEqual([]);
    });
  });
});
