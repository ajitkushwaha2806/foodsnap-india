"use client";
import { AlertItem } from "./alert-item";
import { useNotification } from "@/store/hooks/useNotification";

export default function Notification({ customSlot }) {
  const { notifications, removeNotification } = useNotification();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2">
      {notifications.map((note) => (
        <AlertItem
          key={note.id || note.message}
          id={note.id}
          message={note.message}
          variant={note.type || note.variant}
          icon={note.icon}
          action={note.action}
          duration={note.duration}
          onDismiss={removeNotification}
          customSlot={customSlot}
        />
      ))}
    </div>
  );
}

export { AlertItem } from "./alert-item";
export { NOTIFICATION_VARIANTS } from "./helpers/constants";
export { useNotification } from "@/store/hooks/useNotification";
