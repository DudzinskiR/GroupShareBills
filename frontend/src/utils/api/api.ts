import axios, { AxiosResponse } from "axios";

class Api {
  private static API_ROOT =
    process.env.REACT_APP_API_ROOT || "http://localhost:8080";

  private static debugMode = true;

  protected static async get<T>(
    link: string,
    headers?: {},
  ): Promise<T | undefined> {
    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));

      console.log(
        `GET - Link -> ${this.API_ROOT}/${link}`,
        `headers ->`,
        headers,
      );
      return;
    }

    try {
      const res: AxiosResponse<T, any> = await axios.get<T>(
        `${this.API_ROOT}/${link}`,
        { headers: headers },
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
    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));
      console.log(
        `POST - Link -> ${this.API_ROOT}/${link}`,
        ` body -> `,
        body,
        ` headers -> `,
        headers,
      );
      return;
    }

    try {
      const res: AxiosResponse<T, any> = await axios.post(
        `${this.API_ROOT}/${link}`,
        body,
        { headers: headers },
      );

      return res.data;
    } catch (e) {}
  }

  protected static async put<T>(
    link: string,
    body: any,
    headers?: {},
  ): Promise<T | undefined> {
    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));

      console.log(
        `PUT - Link -> ${this.API_ROOT}/${link}`,
        ` body -> `,
        body,
        ` headers -> `,
        headers,
      );
      return;
    }

    try {
      const res: AxiosResponse<T, any> = await axios.put(
        `${this.API_ROOT}/${link}`,
        body,
        { headers: headers },
      );

      return res.data;
    } catch (e) {}
  }

  protected static async delete<T>(
    link: string,
    headers?: {},
  ): Promise<T | undefined> {
    if (this.debugMode) {
      await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));

      console.log(
        `DELETE - Link -> ${this.API_ROOT}/${link}`,
        `headers ->`,
        headers,
      );
      return;
    }
    try {
      const res: AxiosResponse<T, any> = await axios.delete(
        `${this.API_ROOT}/${link}`,
        { headers: headers },
      );

      return res.data;
    } catch (e) {}
  }
}

export default Api;
