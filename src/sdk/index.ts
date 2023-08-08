import Gap, {GapApiVersion} from "gap-nodejs-sdk";
import {GapMiniAppSdk, Platform} from "gap-miniapp-sdk";
import {useUserStore} from "@/stores/auth";

let posSdk: any = null;
let settingsSdk: any = null;
let goCheckInSdk: any = null;
let appointmentSdk: any = null;
let userSdk: any = null;

type GetAccessTokenResponse = {
    token?: string,
    gClientId?: string,
    domain?: string,
};

const getPlatform = (): Platform | undefined => {
    if (window.navigator.userAgent.includes("Android")) {
        return Platform.ANDROID;
    }
    if (
        window.navigator.userAgent.includes("iOS") ||
        window.navigator.userAgent.includes("Macintosh")
    ) {
        return Platform.IOS;
    }
    if (window.navigator.userAgent.includes("Web")) {
        return Platform.WEB;
    }
    if (window.navigator.userAgent.includes("Window")) {
        return Platform.WINDOW;
    }
    return undefined;
};

const tryParseJson = (data: any) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
};

const gapMiniApp = (function () {
    let instance: GapMiniAppSdk | null = null;
    const createInstance = () => {
        instance = new GapMiniAppSdk();
    };
    const getInstance = (): GapMiniAppSdk => {
        if (!instance) {
            createInstance();
        }
        return instance!;
    };
    const getAccessToken = (): Promise<GetAccessTokenResponse> => {
        return new Promise(async (resolve, reject) => {
            try {
                const platform = getPlatform();
                getInstance().setPlatformExecutor(platform!);
                const res = await getInstance().getAccessToken();
                const {token, gClientId, domain} = tryParseJson(res);
                resolve({
                    token,
                    gClientId,
                    domain,
                });
            } catch (error: any) {
                console.error(error);
                resolve({
                    token: undefined,
                    gClientId: undefined,
                    domain: undefined,
                })
            }
        })
    };
    return {
        getAccessToken
    }
})();

const sdkInit = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                domain = localStorage.getItem('domain'),
                gClientId = localStorage.getItem('id'),
                token = localStorage.getItem('accessToken'),
            } = await gapMiniApp.getAccessToken();

            if (!domain || !gClientId || !token) {
                throw new Error(`Can't get access token`);
            }

            localStorage.setItem('domain', domain);
            localStorage.setItem('id', gClientId);
            localStorage.setItem('accessToken', token);

            const userStore = useUserStore();
            userStore.accessToken = token;

            posSdk = new Gap.PosClientApi(domain, gClientId, token, GapApiVersion.V1);
            settingsSdk = new Gap.SettingsApi(domain, gClientId, token, GapApiVersion.V1);
            goCheckInSdk = new Gap.GoCheckInApi(domain, gClientId, token, GapApiVersion.V1);
            appointmentSdk = new Gap.AppointmentApi(domain, gClientId, token, GapApiVersion.V1);
            userSdk = new Gap.UserApi(domain, gClientId, token, GapApiVersion.V1);
            resolve();
        } catch (error: any) {
            reject(new Error(`SDK init failed: ${error.message}`));
        }
    });
};

export {
    posSdk,
    settingsSdk,
    goCheckInSdk,
    appointmentSdk,
    userSdk,
    sdkInit,
};
