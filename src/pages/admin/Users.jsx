import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Award,
  Lock,
  Unlock,
  Trash2,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";

// 📌 userService မှ real user data များနှင့် management function များကို ယူရန်
import { getUsers, deleteUserAccount } from "../../api/userService";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal States
  const [modalType, setModalType] = useState(null); // 'suspend' | 'delete' | null
  const [selectedUser, setSelectedUser] = useState(null);

  // 📌 Component Mount ဖြစ်ချိန်တွင် LocalStorage ထဲမှ real users များကို ဆွဲယူခြင်း
  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = () => {
    setLoading(true);
    try {
      const response = getUsers();
      if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic (Search & Role filter)
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole =
      roleFilter === "All" ||
      (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  // Open Modals
  const openSuspendModal = (user) => {
    setSelectedUser(user);
    setModalType("suspend");
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModalType("delete");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  // 📌 Confirm Suspend / Active Toggle (LocalStorage တွင်ပါ ချက်ချင်း update လုပ်ရန်)
  const handleConfirmSuspend = () => {
    if (selectedUser) {
      const updatedUsers = users.map((u) => {
        if (u.id === selectedUser.id) {
          const newStatus = u.status === "Suspended" ? "Active" : "Suspended";
          return { ...u, status: newStatus };
        }
        return u;
      });

      setUsers(updatedUsers);
      // LocalStorage သို့ပါ သိမ်းဆည်းရန်
      const USERS_KEY = "makerhub_users";
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      closeModal();
    }
  };

  // 📌 Confirm Delete (userService ၏ deleteUserAccount ကို သုံး၍ LocalStorage မှ ဖယ်ရှားရန်)
  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUserAccount(selectedUser.id);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Loading platform users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">User Management</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage platform users, roles, and account statuses securely.
          </p>
        </div>
        <div>
          <span className="px-3 py-1.5 rounded-xl bg-bg-elevated border border-border text-xs font-medium text-text">
            Total Users:{" "}
            <strong className="text-primary">{users.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter size={16} className="text-text-muted" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="learner">Learner</option>
          </select>
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/50 text-xs text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">User Profile</th>
                <th className="py-3.5 px-5 font-semibold">Role</th>
                <th className="py-3.5 px-5 font-semibold">
                  Learning Track & XP
                </th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const userRole = user.role || "learner";
                  const userStatus = user.status || "Active";
                  const userXp = user.xp || 0;
                  const userTrack =
                    user.track || user.interest || "IoT & Embedded";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-surface/30 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt="Avatar Preview"
                                className="w-full h-full object-cover border rounded-full"
                              />
                            ) : (
                              user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-text">
                              {user.name || "Unknown"}
                            </p>
                            <p className="text-xs text-text-muted">
                              {user.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                            userRole === "admin"
                              ? "bg-purple-500/10 text-purple-500"
                              : userRole === "maker"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {userRole}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-medium text-text text-xs">
                          {userTrack}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                          <Award size={12} className="text-amber-500" />
                          {userXp.toLocaleString()} XP
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            userStatus === "Active"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {userStatus}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openSuspendModal(user)}
                            title={
                              userStatus === "Active"
                                ? "Suspend User"
                                : "Activate User"
                            }
                            className={`p-2 rounded-xl border transition-colors ${
                              userStatus === "Active"
                                ? "bg-surface border-border text-amber-500 hover:bg-amber-500/10"
                                : "bg-surface border-border text-emerald-500 hover:bg-emerald-500/10"
                            }`}
                          >
                            {userStatus === "Active" ? (
                              <Lock size={16} />
                            ) : (
                              <Unlock size={16} />
                            )}
                          </button>

                          <button
                            onClick={() => openDeleteModal(user)}
                            title="Remove / Delete User"
                            className="p-2 rounded-xl bg-surface border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-text-muted text-sm"
                  >
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 4. CONFIRMATION MODALS --- */}

      {/* Suspend / Unlock Modal */}
      {modalType === "suspend" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-elevated border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">
                {selectedUser?.status === "Suspended"
                  ? "Reactivate User Account?"
                  : "Suspend User Account?"}
              </h3>
              <p className="text-sm text-text-muted mt-1">
                {selectedUser?.status === "Suspended"
                  ? `${selectedUser?.name} will regain full access to their account.`
                  : `${selectedUser?.name} will temporarily lose access to MakerHub.`}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hard Delete Modal */}
      {modalType === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-elevated border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">
                Delete User Account?
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Are you sure you want to remove{" "}
                <strong className="text-text">{selectedUser?.name}</strong>?
                This action will erase all user records permanently.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
