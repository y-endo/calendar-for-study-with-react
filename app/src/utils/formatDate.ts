/**
 * 日付をフォーマットして返す
 * @param dateObj
 */
const formatDate = (dateObj: Date) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const date = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return {
    year,
    month,
    date,
    hours,
    minutes,
    string: `${year}-${month}-${date}T${hours}:${minutes}`
  };
};

export default formatDate;
