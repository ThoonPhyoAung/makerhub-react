function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
      <p className="text-text-muted">
        Welcome back! Here is the overview of MakerHub MM.
      </p>

      {/* Quick stats or cards can go here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-bg-elevated border border-border rounded-xl">
          <h3 className="text-sm font-medium text-text-muted">Total Users</h3>
          <p className="text-2xl font-bold text-text mt-1">--</p>
        </div>
        <div className="p-4 bg-bg-elevated border border-border rounded-xl">
          <h3 className="text-sm font-medium text-text-muted">
            Community Posts
          </h3>
          <p className="text-2xl font-bold text-text mt-1">--</p>
        </div>
        <div className="p-4 bg-bg-elevated border border-border rounded-xl">
          <h3 className="text-sm font-medium text-text-muted">Market Items</h3>
          <p className="text-2xl font-bold text-text mt-1">--</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
