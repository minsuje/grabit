export class CreateNotificationDto {
  notification_id?: number;
  userid_num: number;
  reference_id: number;
  type: string;
  message?: string;
  is_confirm: boolean;
}
