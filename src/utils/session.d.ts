import 'express-session'



interface SessionData {
    generatedOTP?: number
}

declare module 'express-session' {
    interface SessionData {
        generatedOTP?: number;
    }
}