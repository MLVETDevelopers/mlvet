import CollabClient from './CollabClient';

// Singleton (sort of) that ensures there is either 0 or 1 instances of a collab client at any given time
class CollabClientManager {
  static client: CollabClient | null = null;

  static getClient() {
    if (CollabClientManager.client === null) {
      CollabClientManager.client = new CollabClient();
    }

    return CollabClientManager.client;
  }

  static hasClient() {
    return CollabClientManager.client !== null;
  }

  static clearClient() {
    CollabClientManager.client = null;
  }
}

export default CollabClientManager;
