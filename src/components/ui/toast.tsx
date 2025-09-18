import { X } from 'lucide-react';
import { useApp } from '@/contexts/app-context';
import { Button } from './button';

export function Toaster() {
  const { state, removeNotification } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : notification.type === 'warning'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex-1">
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm opacity-90">{notification.message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeNotification(notification.id)}
            className="h-6 w-6 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}