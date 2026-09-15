// src/api/marketplaceApi.jsx
import { communityApi as marketplaceApi } from "./api"; // Axios instance (MockAPI URL သီးသန့် သို့မဟုတ် ဘုံသုံး instance)

// 1. Get All Marketplace Items (Search/FilterParams ပါ တစ်ခါတည်း လက်ခံနိုင်ရန်)
export const getMarketplaceItems = async (params = {}) => {
  const response = await marketplaceApi.get("/marketplace", { params });
  return response.data;
};

// 2. Get Single Item Details by ID
export const getMarketplaceItemById = async (id) => {
  const response = await marketplaceApi.get(`/marketplace/${id}`);
  return response.data;
};

// 3. Create New Listing
export const createMarketplaceItem = async (itemData) => {
  const response = await marketplaceApi.post("/marketplace", itemData
  //   {
  //   ...itemData,
  //   createdAt: new Date().toISOString(),
  //   isSold: false,
  //   reportCount: 0,
  // }
);
  return response.data;
};

// 4. Update Listing (Full Edit)
export const updateMarketplaceItem = async (id, itemData) => {
  const response = await marketplaceApi.put(`/marketplace/${id}`, itemData);
  return response.data;
};

// 5. Mark as Sold (Status ပြောင်းရန်)
export const markItemAsSold = async (id, currentData) => {
  const response = await marketplaceApi.put(`/marketplace/${id}`, {
    ...currentData,
    isSold: true,
  });
  return response.data;
};

// 6. Delete Listing
export const deleteMarketplaceItem = async (id) => {
  const response = await marketplaceApi.delete(`/marketplace/${id}`);
  return response.data;
};
