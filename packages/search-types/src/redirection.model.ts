import { Tagging } from './tagging.model';

export interface Redirection {
  id: string;
  title: string;
  url: string;
  tagging: {
    click: Tagging;
  };
}
