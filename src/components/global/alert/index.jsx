"use client";
import { AlertItem } from "../notification/alert-item";
import { useNotification } from "@/store/hooks/useNotification";

export default function Alert(props) {
  const { removeNotification } = useNotification();
  return <AlertItem onDismiss={removeNotification} {...props} />;
}
