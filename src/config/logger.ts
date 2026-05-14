import * as appInsights from "applicationinsights";
import { envs } from "./envs";

// Inicializar Application Insights
if (envs.APPINSIGHTS_CONNECTION_STRING) {
    appInsights
        .setup(envs.APPINSIGHTS_CONNECTION_STRING)
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true)
        .start();
}

const aiClient = appInsights.defaultClient;

// Logger simple que funciona con Application Insights
export const logger = {
    info: (message: string) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [INFO]: ${message}`;
        console.log(logMessage);
        if (aiClient) {
            aiClient.trackTrace({ message: logMessage });
        }
    },
    error: (message: string, error?: any) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [ERROR]: ${message}`;
        console.error(logMessage, error);
        if (aiClient) {
            aiClient.trackException({ exception: new Error(logMessage) });
        }
    },
    debug: (message: string) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [DEBUG]: ${message}`;
        console.debug(logMessage);
    }
};
