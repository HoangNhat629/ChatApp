export const HOST = "http://localhost:8747";
export const AUTH_ROUTES = "/api/user";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_ROUTE = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTE = "/api/contacts";
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTE}/search`;
export const GET_DM_CONTACTS_ROUTES = `${CONTACT_ROUTE}/get-contact-for-dm`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACT_ROUTE}/get-all-contacts`;

export const MESSAGE_ROUTES = "/api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTES}/upload-file`;

export const CHANNEL_ROUTE = "/api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`;
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/get-user-channel`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTE}/get-channel-messages`;
