export function converter(model) {
  const ret = Object.assign({}, model);
  ret.id = ret._id;
  return ret;
}
