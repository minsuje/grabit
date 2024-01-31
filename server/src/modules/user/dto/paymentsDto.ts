import { IsNotEmpty } from 'class-validator';

export class PaymentDTO {
  @IsNotEmpty()
  paymentKey: string;

  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  amount: number;
}
