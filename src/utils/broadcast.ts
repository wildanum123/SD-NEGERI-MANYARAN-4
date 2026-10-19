import { ReportTicket } from '../types/report';

export type RealtimeEvent =
  | { type: 'NEW_REPORT'; payload: ReportTicket }
  | { type: 'REPORT_UPDATED'; payload: ReportTicket }
  | { type: 'REPORT_DELETED'; payload: { id: string } };

type Listener = (event: RealtimeEvent) => void;

class RealtimeChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('sdn_manyaran_4_grievances_sync');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type) {
            this.notifyListeners(event.data);
          }
        };
      } catch {
        // Fallback handled via storage event
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'sdn_manyaran_4_last_event' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyListeners(parsed);
          } catch {
            // ignore
          }
        }
      });
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(event: RealtimeEvent) {
    // Notify in same window
    this.notifyListeners(event);

    // Notify other tabs via BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch {
        // fallback
      }
    }

    // Storage fallback for cross-tab in restrictive environments
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'sdn_manyaran_4_last_event',
          JSON.stringify({ ...event, timestamp: Date.now() })
        );
      } catch {
        // ignore
      }
    }
  }

  private notifyListeners(event: RealtimeEvent) {
    this.listeners.forEach((fn) => {
      try {
        fn(event);
      } catch (err) {
        console.error('Error in realtime listener', err);
      }
    });
  }
}

export const realtimeSync = new RealtimeChannel();
