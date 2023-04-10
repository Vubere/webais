const formatDateToYMD = (date: string) => {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const addZero = (n: number) => (n < 10 ? `0${n}` : n);
  return `${year}-${addZero(month)}-${addZero(day)}`;
};
export {formatDateToYMD};