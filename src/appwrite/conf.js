import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";   

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getPlayer(index) {
  try {
    const res = await this.databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwritePlayerCollectionId,
      [Query.equal("index", index)]
    );
    return res.documents[0] || null;
  } catch (error) {
    throw new Error("Failed to fetch player data");
  }
}

  getFilePreview(fileId) {
      return this.bucket.getFileView(config.appwriteBucketId, fileId).toString();
}

// user 
  async createUser({$id, name}) {
    try {
      const user = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteUserCollectionId,
        $id,
        { username : name, score : 0,currentIndex : 0 }
      );
      return user;
    } catch (error) {
      throw new Error("Failed to create user profile");
    }
  }

  async getUserInfo($id) {
    try {
      const user = await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteUserCollectionId,
        $id
      );
      return user;
    } catch (error) {
      throw new Error("Failed to fetch user profile");
    }
  }

  async updateUserScore($id,existingScore, currentScore, currentIndex) {
    try {
      const user = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteUserCollectionId,
        $id,
        { score: (existingScore+currentScore), currentIndex: currentIndex }      
      );
      return user;
    } catch (error) {
      throw new Error("Failed to update score. Your progress may not be saved.");
    }
  }

  async getTopUsers() {
  try {
    const response = await this.databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteUserCollectionId,
      [
        Query.orderDesc("score"),  // Highest scores first
        Query.limit(3)             // Top 3 users only
      ]
    );
    return response; 
  } catch (error) {
    throw new Error("Failed to fetch leaderboard data");
  }
}
}


  
const service = new Service();
export default service;