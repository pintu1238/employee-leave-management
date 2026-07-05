import { useAuth } from "../context/authContext";

const EmployeeDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Employee Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <div className="grid gap-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm uppercase tracking-wider text-gray-500">Name</p>
                <p className="mt-2 text-lg font-medium text-gray-900">{user.name}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm uppercase tracking-wider text-gray-500">Email</p>
                <p className="mt-2 text-lg font-medium text-gray-900">{user.email}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm uppercase tracking-wider text-gray-500">Department</p>
                <p className="mt-2 text-lg font-medium text-gray-900">{user.department || 'Not assigned'}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm uppercase tracking-wider text-gray-500">Role</p>
                <p className="mt-2 text-lg font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;