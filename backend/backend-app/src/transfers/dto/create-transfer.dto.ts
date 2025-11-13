export class CreateTransferDto {
  senderId!: string;
  recipientId!: string;
  fromCurrency!: string; // e.g. "ZAR"
  toCurrency!: string; // e.g. "KES"
  amount!: number; // base currency amount (fromCurrency)
}
