import { ErrorWithCode } from "./error-with-code";

class RequestError implements ErrorWithCode {
    code: number;
    message: string;
    name: string;

    constructor(message: string, errorCode: number, err?: Error, name?: string) {
        this.code = errorCode;
        this.message = message;
        this.name = name ?? "Error";
        // If err is passed, it will be logged on the console
        if ( err ) {
            console.log("\n")
            const currentDate = new Date();

            const datetime = currentDate.getDate() + "/"
                + ( currentDate.getMonth() + 1 ) + "/"
                + currentDate.getFullYear() + " @ "
                + currentDate.getHours() + ":"
                + currentDate.getMinutes() + ":"
                + currentDate.getSeconds();

            console.log(`The following error occurred on ${ datetime }:`);
            console.log(err);
            console.log("error->catch");
            console.log("\n")
        }
    }
}

export default RequestError;
