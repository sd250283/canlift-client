import {
  Elevator,
  MessageModel,
  Parameter,
  Recipient,
  ScheduleParameter,
  Simulation,
  SimulationEvent,
  SimulationSlot,
  User,
  type IElevator,
  type IMessageModel,
  type ISimulation
} from '@/models/index';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import JwtService from './jwt.service';
import store from '@/store';
import { API_URL } from './config';
import { POST_LOGOUT } from '@/store/action.type';
import router from '@/router';

const ApiService = {
  init() {
    if (!API_URL) {
      process.env.NODE_ENV === 'development' && console.error('API_URL is not defined! Check your environment variables.');
    }
    axios.defaults.baseURL = API_URL;
    axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          store.dispatch(POST_LOGOUT);
          router.push({ name: 'login' });
        }
        return Promise.reject(error);
      }
    );
  },

  setHeader() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${JwtService.getToken()}`;
  },

  query<T>(resource: string, params: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.get(resource, params);
  },

  get<T>(resource: string, slug = ''): Promise<AxiosResponse<T>> {
    const url = slug ? `api/${resource}/${slug}` : `api/${resource}`;
    return axios.get(url);
  },

  // New method for direct API calls with full path
  getRaw<T>(fullPath: string): Promise<AxiosResponse<T>> {
    return axios.get(fullPath);
  },

  post<T>(resource: string, params: T): Promise<AxiosResponse<T>> {
    const url = `api/${resource}`;
    return axios.post(url, params);
  },

  update<T>(resource: string, slug: string, params: Partial<T>): Promise<AxiosResponse<T>> {
    const url = `api/${resource}/${slug}`;
    return axios.patch(url, params, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
        'Accept': 'application/ld+json'
      }
    }).then(response => {
      return response
    }).catch(error => {
      process.env.NODE_ENV === 'development' && console.error(`[ApiService] PATCH failed - URL: ${url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw error
    });
  },

  put<T>(resource: string, params: T): Promise<AxiosResponse<T>> {
    const url = `api/${resource}`;
    return axios.put(url, params);
  },

  delete<T>(resource: string): Promise<AxiosResponse<T>> {
    const url = `api/${resource}`;
    return axios.delete(url);
  }
};

export default ApiService;

export const ParametersService = {
  get() {
    return ApiService.get<Parameter[]>('parameters');
  },
  update(id: number, value: string) {
    const p = { 'value': value };
    return ApiService.update('parameters', id.toString(), p);
  }
};

export const UsersService = {
  post(resource: string, data: User) {
    return ApiService.post<User>(`${resource}`, data);
  },
  get() {
    return ApiService.get<User[]>('users');
  },
  update(id: number, user: Partial<User>) {
    return ApiService.update<User>('users', id.toString(), user);
  },
  delete(resource: string) {
    return ApiService.delete<void>(`${resource}`);
  }
};

export const RecipientsService = {
  post(resource: string, data: Recipient) {
    return ApiService.post<Recipient>(`${resource}`, data);
  },
  get() {
    return ApiService.get<Recipient[]>('recipients');
  },
  update(id: number, recipient: Partial<Recipient>) {
    return ApiService.update<Recipient>('recipients', id.toString(), recipient);
  },
  delete(resource: string) {
    return ApiService.delete<void>(`${resource}`);
  }
};

export const ScheduleParametersService = {
  get() {
    return ApiService.get<ScheduleParameter[]>('scheduleparameters');
  },
  update(id: number, key: 'start' | 'end', value: string) {
    const p = { [key]: value };
    return ApiService.update('scheduleparameters', id.toString(), p);
  }
};

export const ElevatorsService = {
  get() {
    return ApiService.get<Elevator[]>('elevators');
  },
  update(id: number, capacity: number) {
    const p = { 'capacity': capacity };
    return ApiService.update('elevators', id.toString(), p);
  }
};

export const SimulationConfigsService = {
  update(id: number) {
    return ApiService.update('simulationconfigs', id.toString(), {});
  },
  destroy(id: number) {
    return ApiService.delete<void>(`simulationconfigs/${id}`);
  }
};

export const SimulationsService = {
  get(resource: string) {
    return ApiService.get<Simulation>(`${resource}`);
  },
  getByDate(date: string) {
    return ApiService.get<Simulation[]>(`simulations?date=${date}`).catch(error => {
      throw new Error(`ApiService ${error}`);
    });
  },
  getSells(id: number) {
    return ApiService.get<unknown>(`simulations/${id}`, 'sells').catch(error => {
      throw new Error(`ApiService ${error}`);
    });
  },
  post(resource: string, params: Simulation) {
    return ApiService.post<Simulation>(`${resource}`, params);
  },
  put(resource: string, params: Simulation) {
    return ApiService.put<Simulation>(`${resource}`, params);
  },
  destroy(id: number) {
    return ApiService.delete<void>(`simulations/${id}`);
  }
};

export const SimulationEventService = {
  get(resource: string) {
    return ApiService.get<SimulationEvent>(`${resource}`);
  },
  getList(resource: string) {
    return ApiService.get<SimulationEvent[]>(`${resource}`);
  },
  post(resource: string, data: SimulationEvent) {
    return ApiService.post<SimulationEvent>(`${resource}`, data);
  },
  put(resource: string, data: SimulationEvent) {
    return ApiService.put<SimulationEvent>(`${resource}`, data);
  },
  delete(resource: string) {
    return ApiService.delete<void>(`${resource}`);
  }
};

export const SimulationSlotService = {
  get(resource: string) {
    return ApiService.get<SimulationSlot>(`${resource}`);
  },
  post(resource: string, data: SimulationSlot) {
    return ApiService.post<SimulationSlot>(`${resource}`, data);
  },
  put(resource: string, data: SimulationSlot) {
    return ApiService.put<SimulationSlot>(`${resource}`, data);
  },
  delete(resource: string) {
    return ApiService.delete<void>(`${resource}`);
  }
};

export const MessageModelService = {
  get(resource: string) {
    return ApiService.get<MessageModel>(`${resource}`);
  },
  getList(resource: string) {
    return ApiService.get<MessageModel[]>(`${resource}`);
  },
  post(resource: string, data: MessageModel) {
    return ApiService.post<MessageModel>(`${resource}`, data);
  },
  update(id: number, messageModel: Partial<MessageModel>) {
    return ApiService.update<MessageModel>('messagemodels', id.toString(), messageModel);
  },
  delete(resource: string) {
    return ApiService.delete<void>(`${resource}`);
  }
};