import { severityColors } from "@/lib/theme"
import { Notification } from "@/types/ui"
import { notifications } from "@mantine/notifications"

export const notify = ({ title, message, severity }: Notification) => {
    notifications.show({
        title,
        message,
        color: severityColors[severity]
    })
}