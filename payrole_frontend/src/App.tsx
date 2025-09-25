import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './components/wallet';
import { Layout } from './components/layout';
import { Dashboard, Employees, Payments, Treasury, Admin, WalletConnect } from './pages';
import { useWalletContext } from './components/wallet';

const AppContent: React.FC = () => {
  const { walletState } = useWalletContext();

  // Show wallet connection page if not connected
  if (!walletState.isConnected) {
    return <WalletConnect />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/treasury" element={<Treasury />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </Router>
  );
}

export default App;
