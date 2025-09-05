import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'


export default function AdminLayout() {
return (
<div className="min-h-dvh grid md:grid-cols-[240px_1fr]">
<AdminSidebar />
<div className="min-w-0">
<AdminTopbar />
<main className="p-6">
<Outlet />
</main>
</div>
</div>
)
}