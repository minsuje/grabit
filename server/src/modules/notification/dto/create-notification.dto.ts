export class CreateNotificationDto {
  notification_id?: number;
  userid_num: number;
  reference_id: number;
  message?: object;
  type: string;
  is_confirm: boolean;
}
