import {Version} from "./version";

export interface Document {
  id: number;
  name: string;
  versions: Version[];
}