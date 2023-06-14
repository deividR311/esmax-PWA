export class User {
  /*
    "nombres": "string",
    "apellidos": "string",
    "genero": "string",
    "rut": "string",
    "tipousuario": "string",
    "email": "string",
    "telefono": "string",
    "comuna": "string",
    "status": "string",
    "data": "string"
    ------------------------------ 18-03-2021
    "telefonovalidado": "string",
    "emailvalidado": "string",
    "fechanacimiento": "string"
  */

  public rut!: string;
  public email!: string;
  public nombres: string | undefined;
  public apellidos: string | undefined;
  public genero: string | undefined;
  public tipousuario: string | undefined;
  public telefono: string | undefined;
  public comuna: string | undefined;
  public status?: string;
  public data?: string;
  public password?: string;

  public telefonovalidado?: string;
  public emailvalidado?: string;
  public fechanacimiento?: string;

  public newjwttoken?: string;

}
