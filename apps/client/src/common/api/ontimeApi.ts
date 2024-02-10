import axios, { AxiosResponse } from 'axios';
import {
  Alias,
  DatabaseModel,
  GetInfo,
  HttpSettings,
  MessageResponse,
  OntimeRundown,
  OSCSettings,
  OscSubscription,
  ProjectData,
  ProjectFileListResponse,
  Settings,
  UserFields,
  ViewSettings,
} from 'ontime-types';
import { ExcelImportMap } from 'ontime-utils';

import { apiRepoLatest } from '../../externals';
import fileDownload from '../utils/fileDownload';

import { ontimeURL } from './apiConstants';

/**
 * @description HTTP request to retrieve application settings
 * @return {Promise}
 */
export async function getSettings(): Promise<Settings> {
  const res = await axios.get(`${ontimeURL}/settings`);
  return res.data;
}

/**
 * @description HTTP request to mutate application settings
 * @return {Promise}
 */
export async function postSettings(data: Settings) {
  return axios.post(`${ontimeURL}/settings`, data);
}

/**
 * @description HTTP request to retrieve application info
 * @return {Promise}
 */
export async function getInfo(): Promise<GetInfo> {
  const res = await axios.get(`${ontimeURL}/info`);
  return res.data;
}

/**
 * @description HTTP request to retrieve view settings
 * @return {Promise}
 */
export async function getView(): Promise<ViewSettings> {
  const res = await axios.get(`${ontimeURL}/views`);
  return res.data;
}

/**
 * @description HTTP request to mutate view settings
 * @return {Promise}
 */
export async function postViewSettings(data: ViewSettings) {
  return axios.post(`${ontimeURL}/views`, data);
}

/**
 * @description HTTP request to retrieve aliases
 * @return {Promise}
 */
export async function getAliases(): Promise<Alias[]> {
  const res = await axios.get(`${ontimeURL}/aliases`);
  return res.data;
}

/**
 * @description HTTP request to mutate aliases
 * @return {Promise}
 */
export async function postAliases(data: Alias[]) {
  return axios.post(`${ontimeURL}/aliases`, data);
}

/**
 * @description HTTP request to retrieve user fields
 * @return {Promise}
 */
export async function getUserFields(): Promise<UserFields> {
  const res = await axios.get(`${ontimeURL}/userfields`);
  return res.data;
}

/**
 * @description HTTP request to mutate user fields
 * @return {Promise}
 */
export async function postUserFields(data: UserFields) {
  return axios.post(`${ontimeURL}/userfields`, data);
}

/**
 * @description HTTP request to retrieve osc settings
 * @return {Promise}
 */
export async function getOSC(): Promise<OSCSettings> {
  const res = await axios.get(`${ontimeURL}/osc`);
  return res.data;
}

/**
 * @description HTTP request to retrieve http settings
 * @return {Promise}
 */
export async function getHTTP(): Promise<HttpSettings> {
  const res = await axios.get(`${ontimeURL}/http`);
  return res.data;
}

/**
 * @description HTTP request to mutate http settings
 * @return {Promise}
 */
export async function postHTTP(data: HttpSettings) {
  return axios.post(`${ontimeURL}/http`, data);
}

/**
 * @description HTTP request to mutate osc settings
 * @return {Promise}
 */
export async function postOSC(data: OSCSettings) {
  return axios.post(`${ontimeURL}/osc`, data);
}

/**
 * @description HTTP request to mutate osc subscriptions
 * @return {Promise}
 */
export async function postOscSubscriptions(data: OscSubscription) {
  return axios.post(`${ontimeURL}/osc-subscriptions`, data);
}

/**
 * @description HTTP request to download db in CSV format
 */
export const downloadCSV = (fileName?: string) => {
  return fileDownload(ontimeURL, { name: fileName ?? 'rundown', type: 'csv' }, { type: 'text/csv;charset=utf-8;' });
};

/**
 * @description HTTP request to download db in JSON format
 */
export const downloadRundown = (fileName?: string) => {
  return fileDownload(
    ontimeURL,
    { name: fileName ?? 'rundown', type: 'json' },
    { type: 'application/json;charset=utf-8;' },
  );
};

// TODO: should this be extracted to shared code?
export type ProjectFileImportOptions = {
  onlyRundown: boolean;
};

/**
 * @description HTTP request to upload events db
 * @return {Promise}
 */
export const uploadProjectFile = async (
  file: File,
  setProgress: (value: number) => void,
  options?: Partial<ProjectFileImportOptions>,
) => {
  const formData = new FormData();
  formData.append('userFile', file);

  const onlyRundown = Boolean(options?.onlyRundown);

  await axios
    .post(`${ontimeURL}/db?onlyRundown=${onlyRundown}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const complete = progressEvent?.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
        setProgress(complete);
      },
    })
    .then((response) => response.data.id);
};

/**
 * @description Make patch changes to the objects in the db
 * @return {Promise}
 */
export async function patchData(patchDb: Partial<DatabaseModel>) {
  const response = await axios.patch(`${ontimeURL}/db`, patchDb);
  return response;
}

type PostPreviewExcelResponse = {
  rundown: OntimeRundown;
  userFields: UserFields;
};

/**
 * @description Make patch changes to the objects in the db
 * @return {Promise} - returns parsed rundown and userfields
 */
export async function postPreviewExcel(file: File, setProgress: (value: number) => void, options?: ExcelImportMap) {
  const formData = new FormData();
  formData.append('userFile', file);
  formData.append('options', JSON.stringify(options));

  const response: AxiosResponse<PostPreviewExcelResponse> = await axios.post(
    `${ontimeURL}/preview-spreadsheet`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const complete = progressEvent?.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
        setProgress(complete);
      },
    },
  );

  return response;
}

export type HasUpdate = {
  url: string;
  version: string;
};

/**
 * @description HTTP request to get the latest version and url from github
 * @return {Promise}
 */
export async function getLatestVersion(): Promise<HasUpdate> {
  const res = await axios.get(`${apiRepoLatest}`);
  return {
    url: res.data.html_url as string,
    version: res.data.tag_name as string,
  };
}

/**
 * @description HTTP request to get the list of available project files
 */
export async function getProjects(): Promise<ProjectFileListResponse> {
  const res = await axios.get(`${ontimeURL}/projects`);
  return res.data;
}

/**
 * @description HTTP request to load a project file
 */
export async function loadProject(filename: string): Promise<MessageResponse> {
  const res = await axios.post(`${ontimeURL}/load-project`, {
    filename,
  });
  return res.data;
}

/**
 * @description STEP 1
 */
export const uploadSheetClientFile = async (file: File) => {
  const formData = new FormData();
  formData.append('userFile', file);
  const res = await axios
    .post(`${ontimeURL}/sheet/clientsecret`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data.id);
  return res;
};

/**
 * @description STEP 1 test
 */
export const getClientSecrect = async () => {
  const response = await axios.get(`${ontimeURL}/sheet/clientsecret`);
  return response.data;
};

/**
 * @description STEP 2
 */
export const getSheetsAuthUrl = async () => {
  const response = await axios.get(`${ontimeURL}/sheet/authentication/url`);
  return response.data;
};

/**
 * @description STEP 2 test
 */
export const getAuthentication = async () => {
  const response = await axios.get(`${ontimeURL}/sheet/authentication`);
  return response.data;
};

/**
 * @description STEP 3
 * @returns worksheetOptions
 */
export const postId = async (id: string) => {
  const response = await axios.post(`${ontimeURL}/sheet/id`, { id });
  return response.data;
};

/**
 * @description STEP 4
 */
export const postWorksheet = async (id: string, worksheet: string) => {
  const response = await axios.post(`${ontimeURL}/sheet/worksheet`, { id, worksheet });
  return response.data;
};

/**
 * @description STEP 5
 */
export const postPreviewSheet = async (id: string, options: ExcelImportMap) => {
  const response = await axios.post(`${ontimeURL}/sheet/pull`, { id, options });
  return response.data.data;
};

/**
 * @description STEP 5
 */
export const postPushSheet = async (id: string, options: ExcelImportMap) => {
  const response = await axios.post(`${ontimeURL}/sheet-push`, { id, options });
  return response.data.data;
};

/**
 * @description HTTP request to rename a project file
 */
export async function renameProject(filename: string, newFilename: string): Promise<MessageResponse> {
  const url = `${ontimeURL}/project/${filename}/rename`;
  const decodedUrl = decodeURIComponent(url);
  const res = await axios.put(decodedUrl, {
    newFilename,
  });
  return res.data;
}

/**
 * @description HTTP request to duplicate a project file
 */
export async function duplicateProject(filename: string, newFilename: string): Promise<MessageResponse> {
  const url = `${ontimeURL}/project/${filename}/duplicate`;
  const decodedUrl = decodeURIComponent(url);
  const res = await axios.post(decodedUrl, {
    newFilename,
  });
  return res.data;
}

/**
 * @description HTTP request to delete a project file
 */
export async function deleteProject(filename: string): Promise<MessageResponse> {
  const url = `${ontimeURL}/project/${filename}`;
  const decodedUrl = decodeURIComponent(url);
  const res = await axios.delete(decodedUrl);
  return res.data;
}

/**
 * @description HTTP request to create a project file
 */
export async function createProject(
  project: Partial<
    ProjectData & {
      filename: string;
    }
  >,
): Promise<MessageResponse> {
  const url = `${ontimeURL}/project`;
  const decodedUrl = decodeURIComponent(url);
  const res = await axios.post(decodedUrl, project);
  return res.data;
}
