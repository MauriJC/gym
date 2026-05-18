const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("es", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatSessionDateDescription = (dateIso: string): string => {
  const date: Date = new Date(dateIso);
  return `Iniciada el ${formatDate(date)} a las ${formatTime(date)}`;
};

export { formatDate, formatTime, formatSessionDateDescription };
