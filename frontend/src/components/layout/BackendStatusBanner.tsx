import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Loader2, Server } from 'lucide-react';

export function BackendStatusBanner() {
  const { isSuccess } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: apiService.healthCheck,
    refetchInterval: (query: any) => (query.state.data ? false : 5000),
    retry: true,
  });

  if (isSuccess) {
    return null;
  }

  return (
    <div 
      style={{ 
        position: 'fixed', top: '72px', left: 0, right: 0, zIndex: 40, 
        background: 'rgba(30, 58, 138, 0.35)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
        color: '#BFDBFE'
      }}
    >
      <div style={{ 
        maxWidth: '1600px', margin: '0 auto', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        gap: '0.75rem', padding: '0.6rem 1rem' 
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#60A5FA' }}>
          <Loader2 className="animate-spin" size={16} />
          <Server size={16} />
        </div>
        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
          <strong style={{ color: '#93C5FD', letterSpacing: '0.05em', marginRight: '6px' }}>SYSTEM INITIALIZATION:</strong>
          <span style={{ opacity: 0.9 }}>
            Waking up AI backend. <strong>Note for Judges:</strong> This prototype is hosted on Render's free tier. Please allow ~50 seconds for the system to come online. Thank you for your patience!
          </span>
        </div>
      </div>
    </div>
  );
}
