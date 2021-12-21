/**
 * Logging function.
 * @param message Message to log.
 */
export default function log(message: any) {
    if (message instanceof Error) {
        console.log(message.name + ': ' + message.message + '\n' + message.stack);
    } else {
        console.log(message.toString());
    }
}