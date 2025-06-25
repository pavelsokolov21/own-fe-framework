export const ARRAY_DIFF_OP = {
  ADD: "add",
  REMOVE: "remove",
  MOVE: "move",
  NOOP: "noop",
};

export const swap = (i, j, arr) => {
  const a = arr[i];

  arr[i] = arr[j];
  arr[j] = a;
};

export class ArrayWithOriginalIndices {
  #array = [];
  #originalIndices = [];
  #equalsFn;

  constructor(array, equalsFn) {
    this.#array = array.slice();
    this.#originalIndices = array.map((_, i) => i);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#array.length;
  }

  originalIndexAt(i) {
    return this.#originalIndices[i];
  }

  findIndexFrom(item, fromIdx) {
    let res = -1;

    for (let i = fromIdx; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        res = i;

        break;
      }
    }

    return res;
  }

  isRemoval(i, newArr) {
    if (i >= this.length) {
      return false;
    }

    const item = this.#array[i];

    return !newArr.some((newItem) => {
      return this.#equalsFn(item, newItem);
    });
  }

  isNoop(i, newArr) {
    if (i >= this.length) {
      return false;
    }

    return this.#equalsFn(this.#array[i], newArr[i]);
  }

  isAdditional(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1;
  }

  removeItemAfter(i) {
    return Array.from({ length: this.length - i }, () => {
      return this.removeItem(i);
    });
  }

  removeItem(i) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index: i,
      item: this.#array[i],
    };

    [this.#array, this.#originalIndices].forEach((arr) => {
      arr.splice(i, 1);
    });

    return operation;
  }

  noopItem(i) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(i),
      index: i,
      item: this.#array[i],
    };
  }

  addItem(item, i) {
    this.#array.splice(i, 0, item);
    this.#originalIndices.splice(i, 0, -1);

    return {
      op: ARRAY_DIFF_OP.ADD,
      index: i,
      item,
    };
  }

  moveItem(item, toIdx) {
    const fromIdx = this.findIndexFrom(item, toIdx);

    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIdx),
      from: fromIdx,
      index: toIdx,
      item: this.#array[fromIdx],
    };

    [this.#array, this.#originalIndices].forEach((arr) => {
      swap(fromIdx, toIdx, arr);
    });

    return operation;
  }
}

const defaultEqualsFn = (a, b) => a === b;

export const arraysDiffSequence = (
  oldArr,
  newArr,
  equalsFn = defaultEqualsFn
) => {
  const sequence = [];
  const arr = new ArrayWithOriginalIndices(oldArr, equalsFn);

  for (let i = 0; i < newArr.length; i++) {
    if (arr.isRemoval(i, newArr)) {
      sequence.push(arr.removeItem(i));
      i--;

      continue;
    }

    if (arr.isNoop(i, newArr)) {
      sequence.push(arr.noopItem(i));

      continue;
    }

    const item = newArr[i];

    if (arr.isAdditional(item, i)) {
      sequence.push(arr.addItem(item, i));

      continue;
    }

    sequence.push(arr.moveItem(item, i));
  }

  sequence.push(...arr.removeItemAfter(newArr.length));

  return sequence;
};

export const withoutNulls = (arr) => {
  return arr.filter((e) => e !== null);
};

export const withoutNullish = (arr) => {
  return arr.filter((e) => e !== null && e !== undefined);
};

export const arraysDiff = (array1, array2) => {
  return {
    added: array2.filter((item) => !array1.includes(item)),
    removed: array1.filter((item) => !array2.includes(item)),
  };
};
