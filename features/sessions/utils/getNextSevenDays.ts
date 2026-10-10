export const getNextSevenDays = () => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() + index);

    return {
      id: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.getDate(),
    };
  });
};
