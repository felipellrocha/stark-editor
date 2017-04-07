export function arrayReplace(data, value, index) {
    return [
      ...data.slice(0, index),
      value,
      ...data.slice(index + 1, data.length)
    ];
};
