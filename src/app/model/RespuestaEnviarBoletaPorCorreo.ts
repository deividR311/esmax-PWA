export interface RespuestaEnviarBoletaPorCorreo {
    status?: string, // "success|fail|error"
    data?: string | {message?: string},
    message?: string
}
