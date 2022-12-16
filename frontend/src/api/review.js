import { catchError, getToken } from "../utils/helper";
import client from "./clinet";

export const addReview = async (movieId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.post(`/review/add/${movieId}`, reviewData, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getReview = async (movieId) => {
  try {
    const { data } = await client("/review/get-reviews-by-movie/" + movieId);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
