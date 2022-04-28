declare global {
    namespace Bookables{
        export interface User {
            email: string;
            password: string;
            doesSomething(): number;
            phoneNumber: string;
        }
        export interface SpecialUser extends User {
            somethingElse: string,
        }
    }
}


export = {}