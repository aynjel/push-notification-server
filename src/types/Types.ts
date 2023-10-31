export type TPushNotification = {
    title: string;
    body: string;
    data: {
        [key: string]: string;
    };
};