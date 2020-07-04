export interface IMessage {
  content?: string;
  image?: string;
  creator: {
    id: string;
    avataar: string;
    name: string;
  };
  timestamp: string;
}

export interface IUser {
  uid: string;
  photoURL: string;
  displayName: string;
}

export interface IChannel {
  createdBy: {
    avatar: string;
    name: string;
  };
  detail: string;
  id: string;
  name: string;
}

export interface ICurrentUser {
  uid: string;
  photoURL: string;
  displayName: string;
}
