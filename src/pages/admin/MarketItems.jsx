import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  X,
  Store,
  Award,
  Loader2,
} from "lucide-react";

import { useFetch } from "../../hooks/useFetch";
import {
  getMarketplaceItems,
  updateMarketplaceItem,
} from "../../api/marketplaceApi";
import { useAlert } from "../../context/AlertContext";

function Marketplace() {
  const { data: apiItems, loading, error } = useFetch(getMarketplaceItems);
  const [items, setItems] = useState([]);
  const showAlert = useAlert();

  useEffect(() => {
    if (Array.isArray(apiItems)) {
      setItems(apiItems);
    }
  }, [apiItems]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- ANALYTICS CALCULATIONS ---

  // 1. Most Active Sellers (Listings အရေအတွက် အများဆုံး)
  const userListingCounts = items.reduce((acc, item) => {
    const seller = item.sellerName || item.seller || "Unknown";
    acc[seller] = (acc[seller] || 0) + 1;
    return acc;
  }, {});

  const mostSellUsers = Object.entries(userListingCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 2. Most Sold Out Users (Sold Out လုပ်ထားသည့် Items အများဆုံး)
  const userSoldOutCounts = items.reduce((acc, item) => {
    const seller = item.sellerName || item.seller || "Unknown";
    const isSoldOut = item.isSold || item.isSoldOut || item.status === "Sold Out";
    if (isSoldOut) {
      acc[seller] = (acc[seller] || 0) + 1;
    }
    return acc;
  }, {});

  const mostSoldUsers = Object.entries(userSoldOutCounts)
    .map(([name, soldTotal]) => ({ name, soldTotal }))
    .sort((a, b) => b.soldTotal - a.soldTotal);

  // Filter Logic for Table
  const filteredItems = items.filter((item) => {
    const title = item.title || "";
    const seller = item.sellerName || item.seller || "";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.toLowerCase().includes(searchTerm.toLowerCase());

    const isSoldOut = Boolean(item.isSold || item.isSoldOut);
    const itemStatus = item.status || (isSoldOut ? "Sold Out" : "Available");

    let matchesStatus = true;
    if (statusFilter === "Sold Out") {
      matchesStatus = isSoldOut || itemStatus === "Sold Out";
    } else if (statusFilter === "Available") {
      matchesStatus = !isSoldOut && itemStatus !== "Sold Out";
    } else if (statusFilter !== "All") {
      matchesStatus = itemStatus === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const previousItems = [...items];
      setItems(
        items.filter((item) => String(item.id) !== String(itemToDelete.id)),
      );
      setIsDeleteModalOpen(false);

      try {
        showAlert("Marketplace item removed successfully.");
        setItemToDelete(null);
      } catch (err) {
        console.error("Failed to delete item:", err);
        setItems(previousItems);
        showAlert("Failed to delete item.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Loading marketplace management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Marketplace Management
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Moderate community listings and check items sold by sellers.
          </p>
        </div>
        <div>
          <span className="px-3 py-1.5 rounded-xl bg-bg-elevated border border-border text-xs font-medium text-text">
            Total Listings:{" "}
            <strong className="text-primary">{items.length}</strong>
          </span>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-elevated border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <Store size={16} className="text-primary" /> Most Active Sellers
            </h2>
            <span className="text-xs text-text-muted">Total Posts</span>
          </div>

          <div className="space-y-3 pt-1">
            {mostSellUsers.length > 0 ? (
              mostSellUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-surface/50 border border-border px-4 py-2.5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </div>
                    <span className="text-sm font-medium text-text">
                      {user.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {user.count} Listings
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted text-center py-2">
                No seller data available
              </p>
            )}
          </div>
        </div>

        <div className="bg-bg-elevated border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <Award size={16} className="text-amber-500" /> Sellers with Most Sold-Out Items
            </h2>
            <span className="text-xs text-text-muted">Sold Out Items</span>
          </div>

          <div className="space-y-3 pt-1">
            {mostSoldUsers.length > 0 ? (
              mostSoldUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-surface/50 border border-border px-4 py-2.5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </div>
                    <span className="text-sm font-medium text-text">
                      {user.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-500">
                    {user.soldTotal} Sold Out
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted text-center py-2">
                No sold-out items recorded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            placeholder="Search products or sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter size={16} className="text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Sold Out">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/50 text-xs text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Product Title & Price</th>
                <th className="py-3.5 px-5 font-semibold">Seller</th>
                <th className="py-3.5 px-5 font-semibold">Availability Status</th>
                <th className="py-3.5 px-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const itemTitle = item.title || "Untitled Item";
                  const itemCategory = item.category || "Others";
                  const sellerName = item.sellerName || item.seller || "Anonymous";
                  const isSoldOut = Boolean(item.isSold || item.isSoldOut);

                  return (
                    <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-medium text-text">{itemTitle}</p>
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {typeof item.price === "number"
                            ? `${item.price.toLocaleString()} MMK`
                            : item.price || "0 MMK"}{" "}
                          • {itemCategory}
                        </p>
                      </td>

                      <td className="py-4 px-5 text-xs text-text-muted font-medium">
                        by <strong className="text-text">{sellerName}</strong>
                      </td>

                      <td className="py-4 px-5">
                        {isSoldOut ? (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-500">
                            Sold Out
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                            Available
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDeleteModal(item)}
                            title="Delete Listing"
                            className="p-2 rounded-xl bg-surface border border-border text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
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
                  <td colSpan="4" className="py-8 text-center text-text-muted text-sm">
                    No marketplace items found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-elevated border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Remove Listing?</h3>
              <p className="text-sm text-text-muted mt-1">
                Are you sure you want to remove{" "}
                <strong className="text-text">{itemToDelete?.title}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-text text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 cursor-pointer"
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

export default Marketplace;