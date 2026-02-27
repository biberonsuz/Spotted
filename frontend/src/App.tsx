import { useState } from 'react'
import './App.css'
import HomeView from './views/HomeView'
import MapView from './views/MapView'
import ProfileView from './views/ProfileView'
import ShopView from './views/ShopView'
import AuthModal from './components/AuthModal'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VisitedShopsProvider } from './context/VisitedShopsContext'
import RequireAuth from './components/RequireAuth'
import AppShell from './components/AppShell'
import MarketingLandingView from './views/MarketingLandingView'

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)

  const closeAuthModal = () => setAuthMode(null)

  return (
    <BrowserRouter>
      <AuthProvider>
        <VisitedShopsProvider>
          <>
            <Routes>
              <Route
                path="/"
                element={
                  <MarketingLandingView
                    onLoginClick={() => setAuthMode('login')}
                    onRegisterClick={() => setAuthMode('register')}
                  />
                }
              />
              <Route
                path="/app/*"
                element={
                  <RequireAuth>
                    <AppShell
                      onLoginClick={() => setAuthMode('login')}
                      onRegisterClick={() => setAuthMode('register')}
                    />
                  </RequireAuth>
                }
              >
                <Route index element={<HomeView />} />
                <Route path="map" element={<MapView />} />
                <Route path="shop/:id" element={<ShopView />} />
                <Route
                  path="profile"
                  element={
                    <ProfileView
                      name="Pinar Kazak"
                      username="biberonsuz"
                      brands={[
                        'COS',
                        'Urban Outfitters',
                        'Uniqlo',
                        'Ralph Lauren',
                        'Prada',
                        '&Other Stories',
                        'L.L.Bean',
                      ]}
                      visitedShops={[
                        'Shop from Crisis, Brick Lane',
                        'Rokit Brick Lane',
                        'The Brick Lane Vintage Market',
                        'Non Stop Vintage',
                        'Brick Lane Vintage',
                      ]}
                    />
                  }
                />
              </Route>
            </Routes>

            {authMode && <AuthModal mode={authMode} onClose={closeAuthModal} />}
          </>
        </VisitedShopsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
