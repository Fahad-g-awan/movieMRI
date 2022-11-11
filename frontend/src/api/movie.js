import { catchError, getToken } from "../utils/helper";
import client from "./clinet";

export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();

  try {
    const { data } = await client.post("/movie/upload-trailer", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
      onUploadProgress: ({ loaded, total }) => {
        if (onUploadProgress) onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const uploadMovie = async (formData) => {
  const token = getToken();

  try {
    const { data } = await client.post("/movie/create", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovies = async (limit, pageNo) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/movies?limit=${limit}&pageNo=${pageNo}`, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovieForUodate = async (id) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/for-update/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateMovie = async (id, formDate) => {
  const token = getToken();
  try {
    const { data } = await client.patch(`/movie/update/${id}`, formDate, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/delete/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/search?title=${title}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getTopRatedMovies = async (type) => {
  try {
    let endPoint = "/movie/top-rated";

    if (type) endPoint += "?type=" + type;

    const { data } = await client(endPoint);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
