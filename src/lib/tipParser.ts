import { diff } from 'radash';

const tipParser = (
  value: string | number | string[],
  compare: string | number | string[]
): 'correct' | 'incorrect' | 'partial' => {
  if (Array.isArray(value) && Array.isArray(compare)) {
    const dif = diff(value, compare);
    const sameSize = value.length === compare.length;

    if (dif.length === value.length) {
      return 'incorrect';
    }

    if (dif.length === 0) {
      if (sameSize) {
        return 'correct';
      }
      return 'partial';
    }

    if (dif.length < value.length) {
      return 'partial';
    }
  }

  return value === compare ? 'correct' : 'incorrect';
};

export default tipParser;
