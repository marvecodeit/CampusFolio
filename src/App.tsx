import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import { MarketplaceProvider } from './marketplace'
import { ToastProvider } from './toast'
import LandingPage from './pages/Landing'
import AuthPage from './pages/Auth'
import DashboardLayout from './pages/DashboardLayout'
import OverviewPage from './pages/Overview'
import ExplorePage from './pages/Explore'
import SavedPage from './pages/Saved'
import OffersPage from './pages/Offers'
import ActivityLogPage from './pages/ActivityLog'
import ProfilePage from './pages/Profile'
import NotFoundPage from './pages/NotFound'
import './App.css'
import './pages.css'

const titles: Record<string, string> = {
  '/': 'Campus Folio — Anchor University Lagos',
  '/login': 'Log in · Campus Folio',
  '/signup': 'Create your folio · Campus Folio',
  '/dashboard': 'Overview · Campus Folio',
  '/dashboard/explore': 'Explore services · Campus Folio',
  '/dashboard/saved': 'Saved services · Campus Folio',
  '/dashboard/offers': 'My offers · Campus Folio',
  '/dashboard/activity': 'Activity log · Campus Folio',
  '/dashboard/profile': 'Profile · Campus Folio',
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = titles[pathname] ?? 'Campus Folio'
  }, [pathname])

  return null
}

function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to='/login'
      />
    )
  }

  return (
    <MarketplaceProvider>
      <Outlet />
    </MarketplaceProvider>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingPage />} path='/' />
      <Route element={<AuthPage mode='login' />} path='/login' />
      <Route element={<AuthPage mode='signup' />} path='/signup' />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />} path='/dashboard'>
          <Route index element={<OverviewPage />} />
          <Route element={<ExplorePage />} path='explore' />
          <Route element={<SavedPage />} path='saved' />
          <Route element={<OffersPage />} path='offers' />
          <Route element={<ActivityLogPage />} path='activity' />
          <Route element={<ProfilePage />} path='profile' />
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path='*' />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
