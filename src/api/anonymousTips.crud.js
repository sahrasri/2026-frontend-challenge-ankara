import axiosInstance from './axiosInstance';

const FORM_ID = import.meta.env.VITE_FORM_ID_ANONYMOUS_TIPS;

export const getAnonymousTips = async () => {
  const response = await axiosInstance.get(`/form/${FORM_ID}/submissions`);
  return response.data;
};
