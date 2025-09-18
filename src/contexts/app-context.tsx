import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Lead, Doctor, Appointment, Condition, Specialty, Notification } from '@/types';

interface AppState {
  leads: Lead[];
  doctors: Doctor[];
  appointments: Appointment[];
  conditions: Condition[];
  loading: boolean;
  notifications: Notification[];
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LEADS'; payload: Lead[] }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: Lead }
  | { type: 'DELETE_LEAD'; payload: string }
  | { type: 'SET_DOCTORS'; payload: Doctor[] }
  | { type: 'ADD_DOCTOR'; payload: Doctor }
  | { type: 'UPDATE_DOCTOR'; payload: Doctor }
  | { type: 'DELETE_DOCTOR'; payload: string }
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'SET_CONDITIONS'; payload: Condition[] }
  | { type: 'ADD_CONDITION'; payload: Condition }
  | { type: 'UPDATE_CONDITION'; payload: Condition }
  | { type: 'DELETE_CONDITION'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  leads: [],
  doctors: [],
  appointments: [],
  conditions: [],
  loading: false,
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_LEADS':
      return { ...state, leads: action.payload };
    case 'ADD_LEAD':
      return { ...state, leads: [...state.leads, action.payload] };
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload : lead
        ),
      };
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter(lead => lead.id !== action.payload),
      };
    
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, action.payload] };
    case 'UPDATE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.map(doctor =>
          doctor.id === action.payload.id ? action.payload : doctor
        ),
      };
    case 'DELETE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.filter(doctor => doctor.id !== action.payload),
      };
    
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload),
      };
    
    case 'SET_CONDITIONS':
      return { ...state, conditions: action.payload };
    case 'ADD_CONDITION':
      return { ...state, conditions: [...state.conditions, action.payload] };
    case 'UPDATE_CONDITION':
      return {
        ...state,
        conditions: state.conditions.map(condition =>
          condition.id === action.payload.id ? action.payload : condition
        ),
      };
    case 'DELETE_CONDITION':
      return {
        ...state,
        conditions: state.conditions.filter(condition => condition.id !== action.payload),
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString();
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        ...notification,
        id,
        timestamp: new Date(),
      },
    });

    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 5000);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Types are imported from @/types and re-exported by components that need them