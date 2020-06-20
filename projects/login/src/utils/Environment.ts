import { environment } from '../environments/environment';

/** Determine if current environment is production */
export function IsProductionEnv(): boolean {
    return environment.production
}

/** Determine if current environment is development */
export function IsDevEnv(): boolean {
    return !IsProductionEnv();
}
