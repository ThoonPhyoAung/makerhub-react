import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  AlertTriangle,
  X,
  TrendingUp,
  PackageCheck,
  ShoppingBag,
  Store,
  Award,
} from "lucide-react";

function Marketplace() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "ESP32-S3 Dev Board with Camera Module",
      seller: "Ko Htet",
      price: 14.5,
      stock: 12,
      soldCount: 45,
      category: "Microcontrollers",
      status: "Approved",
      isFeatured: true,
    },
    {
      id: 2,
      title: "Raspberry Pi Zero 2 W",
      seller: "Ma Phyu",
      price: 25.0,
      stock: 0,
      soldCount: 80,
      category: "SBCs",
      status: "Approved",
      isFeatured: false,
    },
    {
      id: 3,
      title: "DHT22 Temperature & Humidity Sensor",
      seller: "Aung Min",
      price: 3.5,
      stock: 50,
      soldCount: 15,
      category: "Sensors",
      status: "Pending",
      isFeatured: false,
    },
    {
      id: 4,
      title: "Custom IoT Smart Farming PCB Shield",
      seller: "Su Su",
      price: 18.0,
      stock: 0,
      soldCount: 32,
      category: "Custom PCBs",
      status: "Approved",
      isFeatured: false,
    },
    {
      id: 5,
      title: "ESP8266 NodeMCU Module",
      seller: "Ko Htet",
      price: 4.0,
      stock: 25,
      soldCount: 10,
      category: "Microcontrollers",
      status: "Approved",
      isFeatured: false,
    },
    {
      id: 6,
      title: "OLED 0.96 inch Display",
      seller: "Ko Htet",
      price: 5.0,
      stock: 30,
      soldCount: 20,
      category: "Sensors",
      status: "Approved",
      isFeatured: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- ANALYTICS CALCULATIONS ---

  // 1. Most Sell Users (Users with most posts / listings created)
  const userListingCounts = items.reduce((acc, item) => {
    acc[item.seller] = (acc[item.seller] || 0) + 1;
    return acc;
  }, {});

  const mostSellUsers = Object.entries(userListingCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 2. Most Sold Users (Users with highest total sold items / sold out success)
  const userSoldCounts = items.reduce((acc, item) => {
    acc[item.seller] = (acc[item.seller] || 0) + item.soldCount;
    return acc;
  }, {});

  const mostSoldUsers = Object.entries(userSoldCounts)
    .map(([name, soldTotal]) => ({ name, soldTotal }))
    .sort((a, b) => b.soldTotal - a.soldTotal);

  // Filter Logic for Table
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "Sold Out") {
      matchesStatus = item.stock === 0;
    } else if (statusFilter === "In Stock") {
      matchesStatus = item.stock > 0 && item.status === "Approved";
    } else if (statusFilter !== "All") {
      matchesStatus = item.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  const toggleFeatured = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isFeatured: !item.isFeatured } : item,
      ),
    );
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(items.filter((item) => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Marketplace Management
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Analyze seller performance (listings vs. actual sales) and moderate
            listings.
          </p>
        </div>
        <div>
          <span className="px-3 py-1.5 rounded-xl bg-bg-elevated border border-border text-xs font-medium text-text">
            Total Listings:{" "}
            <strong className="text-primary">{items.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. ANALYTICS GRAPHS: Most Sell Users vs Most Sold Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Sell Users (Most Listings Posted) */}
        <div className="bg-bg-elevated border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <Store size={16} className="text-primary" /> Most Active Sellers
              (Most Posts Created)
            </h2>
            <span className="text-xs text-text-muted">Total Listings</span>
          </div>

          <div className="space-y-3 pt-1">
            {mostSellUsers.map((user, index) => (
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
            ))}
          </div>
        </div>

        {/* Most Sold Users (Highest Total Sales / Sold Out Volume) */}
        <div className="bg-bg-elevated border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <Award size={16} className="text-emerald-500" /> Top Revenue /
              Most Sold Users
            </h2>
            <span className="text-xs text-text-muted">Units Sold</span>
          </div>

          <div className="space-y-3 pt-1">
            {mostSoldUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-surface/50 border border-border px-4 py-2.5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                    #{index + 1}
                  </div>
                  <span className="text-sm font-medium text-text">
                    {user.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-500">
                  {user.soldTotal} Sold
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
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
            <option value="In Stock">In Stock (Active)</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Pending">Pending Approval</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* 4. Marketplace Table */}
      <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/50 text-xs text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">
                  Product Title & Price
                </th>
                <th className="py-3.5 px-5 font-semibold">Seller</th>
                <th className="py-3.5 px-5 font-semibold">
                  Stock / Units Sold
                </th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface/30 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text">{item.title}</p>
                        {item.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-primary mt-0.5">
                        ${item.price.toFixed(2)} • {item.category}
                      </p>
                    </td>

                    <td className="py-4 px-5 text-xs text-text-muted font-medium">
                      by <strong className="text-text">{item.seller}</strong>
                    </td>

                    <td className="py-4 px-5">
                      <p className="text-xs font-medium text-text">
                        {item.stock > 0 ? (
                          <span className="text-emerald-500">
                            {item.stock} in stock
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold">
                            Sold Out
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {item.soldCount} units sold
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          item.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : item.status === "Pending"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured(item.id)}
                          title={
                            item.isFeatured ? "Unfeature Item" : "Feature Item"
                          }
                          className={`p-2 rounded-xl border transition-colors ${
                            item.isFeatured
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                              : "bg-surface border-border text-text-muted hover:text-text"
                          }`}
                        >
                          <Star
                            size={16}
                            fill={item.isFeatured ? "currentColor" : "none"}
                          />
                        </button>

                        {item.status !== "Approved" && (
                          <button
                            onClick={() =>
                              handleStatusChange(item.id, "Approved")
                            }
                            title="Approve Listing"
                            className="p-2 rounded-xl bg-surface border border-border text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {item.status !== "Rejected" && (
                          <button
                            onClick={() =>
                              handleStatusChange(item.id, "Rejected")
                            }
                            title="Reject Listing"
                            className="p-2 rounded-xl bg-surface border border-border text-amber-500 hover:bg-amber-500/10 transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => openDeleteModal(item)}
                          title="Delete Listing"
                          className="p-2 rounded-xl bg-surface border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-text-muted text-sm"
                  >
                    No marketplace items found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DELETE MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-elevated border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface"
              >
                <X size={18} />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">
                Remove Listing?
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Are you sure you want to remove{" "}
                <strong className="text-text">{itemToDelete?.title}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-text text-sm font-medium"
              >
                Cancel, Keep It
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600"
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
