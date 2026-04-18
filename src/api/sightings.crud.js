import axiosInstance from './axiosInstance';

const FORM_ID = import.meta.env.VITE_FORM_ID_SIGHTINGS;

export const getSightings = async () => {
  const response = await axiosInstance.get(`/form/${FORM_ID}/submissions`);
  return response.data;
};
