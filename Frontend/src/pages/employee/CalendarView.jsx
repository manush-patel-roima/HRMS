import { useState } from "react";

const CalendarView = ({ onDateSelect }) => {

  const [date, setDate] = useState("");

  return (
    <input
      type="date"
      className="border p-2 mb-4"
      value={date}
      onChange={e => {
        setDate(e.target.value);
        onDateSelect(e.target.value);
      }}
    />
  );
};

export default CalendarView;