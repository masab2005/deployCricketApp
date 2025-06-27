import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";

class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl) // e.g., https://cloud.appwrite.io/v1
      .setProject(config.appwriteProjectId); // your project ID

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const user = await this.account.create(ID.unique(), email, password, name);
      if (user) {
        // Immediately log in user after account creation
        return await this.login(email, password);
      }
    } catch (error) {
      console.error("AuthService :: createAccount error", error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("AuthService :: login error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get(); // Only works if user is logged in
    } catch (error) {
      console.error("AuthService :: getCurrentUser error", error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("AuthService :: logout error", error);
      throw error; // Propagate the error to be handled by the caller
    }
  }


}

const authService = new AuthService();
export default authService;
