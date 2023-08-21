import axios, { AxiosResponse } from "axios";
import { getToken } from "../firebase/firebase";

class Api {
  private static API_ROOT =
    process.env.REACT_APP_API_ROOT || "http://localhost:8080";

  private static token = "";

  private static debugMode = true;

  private static async getTokenID(): Promise<string> {
    return getToken()
      .then((val) => {
        return val;
      })
      .catch((e) => {
        return " ";
      });
  }

  protected static async get<T>(
    link: string,
    headers?: {},
  ): Promise<T | undefined> {
    const newHeaders = {
      ...headers,
      Authorization: `Bearer ${await this.getTokenID()}`,
    };

    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));

      console.log(`GET - Link -> ${this.API_ROOT}/${link}`, `headers ->`, {
        headers: newHeaders,
      });
      return;
    }

    try {
      const res: AxiosResponse<T, any> = await axios.get<T>(
        `${this.API_ROOT}/${link}`,
        { headers: newHeaders },
      );

      return res.data;
    } catch {
      //Obsługa błędów
    }
  }

  protected static async post<T>(
    link: string,
    body: any,
    headers?: {},
  ): Promise<T | undefined> {
    const newHeaders = {
      ...headers,
      Authorization: `Bearer ${await this.getTokenID()}`,
    };

    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));
      console.log(
        `POST - Link -> ${this.API_ROOT}/${link}`,
        ` body -> `,
        body,
        ` headers -> `,
        { headers: newHeaders },
      );
      return;
    }

    try {
      const res: AxiosResponse<T, any> = await axios.post(
        `${this.API_ROOT}/${link}`,
        body,
        { headers: newHeaders },
      );

      return res.data;
    } catch (e) {}
  }

  protected static async put<T>(
    link: string,
    body: any,
    headers?: {},
  ): Promise<T | undefined> {
    const newHeaders = {
      ...headers,
      Authorization: `Bearer ${await this.getTokenID()}`,
    };

    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));

      console.log(
        `PUT - Link -> ${this.API_ROOT}/${link}`,
        ` body -> `,
        body,
        ` headers -> `,
        { headers: newHeaders },
      );
      return;
    }

    try {
      const res: AxiosResponse<T, any> = await axios.put(
        `${this.API_ROOT}/${link}`,
        body,
        { headers: newHeaders },
      );

      return res.data;
    } catch (e) {}
  }

  protected static async delete<T>(
    link: string,
    headers?: {},
  ): Promise<T | undefined> {
    const newHeaders = {
      ...headers,
      Authorization: `Bearer ${await this.getTokenID()}`,
    };

    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));

      console.log(`DELETE - Link -> ${this.API_ROOT}/${link}`, `headers ->`, {
        headers: newHeaders,
      });
      return;
    }
    try {
      const res: AxiosResponse<T, any> = await axios.delete(
        `${this.API_ROOT}/${link}`,
        { headers: newHeaders },
      );

      return res.data;
    } catch (e) {}
  }
}

export default Api;
