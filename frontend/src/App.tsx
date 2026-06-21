import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Dashboard } from '@/pages/Dashboard';
import { BackendStatusBanner } from '@/components/layout/BackendStatusBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

        <Navbar />
        <BackendStatusBanner />
        <main>
          <Dashboard />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
