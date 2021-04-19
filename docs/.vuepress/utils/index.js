exports.formatDate = (v) => {
  const date = new Date(v)
  const year = date.getFullYear();
  const month = date.getMonth() + 1
  const day = date.getDate();
  const _month = (`00${month}`.slice(-2))
  const _day = (`00${day}`.slice(-2))
  return `${year}-${_month}-${_day}`
}
