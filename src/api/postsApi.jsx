// src/api/postsApi.jsx
import { communityApi } from "./api";

export const getPosts = async () => {
  const response = await communityApi.get("/posts");
  return response.data;
};

export const getPostById = async (id) => {
  const response = await communityApi.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await communityApi.post("/posts", postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await communityApi.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await communityApi.delete(`/posts/${id}`);
  return response.data;
};
