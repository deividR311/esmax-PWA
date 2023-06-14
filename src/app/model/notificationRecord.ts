export interface NotificationRecord {
    notificationRecordId : number | null,
    timestamp : Date,
    notificationId : number,
    iddsps : number,
    rut : string | null,
    idpaymenttrx : number | null,
    state : string,
    updateTimestamp : Date | null,
    userRut : string,
    payment_description : string,
    cashPaymentId : number,
    peopleRut : string
}