import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import ToastStack from '@/components/ui/ToastStack'


export default function App() {
return (
<div className="min-h-dvh flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1"><Outlet /></main>
<Footer />
  <ToastStack />
</div>
)
}