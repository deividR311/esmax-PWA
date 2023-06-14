export interface CashPayment {
    data : {
        cashPaymentId : number | null;
        amount : number | null;
        timestamp : any | null;
        state : string | null;
        updateTimestamp : Date | null;
        iddsps : number | null;
        rut : string | null;
        idpaymenttrx : number | null;
        userRut : string | null;
        productName : string | null;
        pricePerLiter : number | null;
        liter : number | null;
        discount : any | null;
        total : number | null;
        literPriceWithDiscount : any | null;
        discountName : string | null;
    };
    order? : any | null;
    frontendid : any | null;
}