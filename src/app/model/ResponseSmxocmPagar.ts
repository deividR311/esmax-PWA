

export interface ResponseSmxocmPagar {
    authorizationstatus: number;
    authorizationmessage: string | null;
    authorizationcode: number;
    monto: string;
    capturahabilitada: string;
    trxid: string;
}
