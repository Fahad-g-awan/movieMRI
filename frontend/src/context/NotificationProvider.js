import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

let timeOutId;

export default function NotificationProvider({ children }) {
  const [notifcation, setNotification] = useState("");
  const [classes, setClasses] = useState("");

  const updateNotification = (type, value) => {
    if (timeOutId) clearTimeout(timeOutId);

    switch (type) {
      case "error":
        setClasses("bg-red-400");
        break;
      case "success":
        setClasses("bg-green-400");
        break;
      case "warning":
        setClasses("bg-orange-400");
        break;

      default:
        setClasses("bg-red-400");
        break;
    }

    setNotification(value);

    timeOutId = setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      {notifcation && (
        <div className="fixed left-1/2 -translate-x-1/2 top-24">
          <div className="bounce rounded">
            <p className={classes + " text-white px-4 py-2 font-semibold"}>{notifcation}</p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
